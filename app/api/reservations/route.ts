import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkReservationStatus, isValidReservationTime, isTimeSlotPassed } from "@/lib/reservation-hours"

// In-memory storage for reservations (fallback)
let reservations: any[] = []

// Helper function to get service code from service name
function getServiceCode(service: string): string {
  // Map service name to short code
  const serviceCodeMap: { [key: string]: string } = {
    'PTK (Pendidik dan Tenaga Kependidikan)': 'PTK',
    'SD Umum': 'SD',
    'SMP Umum': 'SMP',
    'PAUD': 'PAUD',
  }
  
  // Get short code or use first 3 chars of service name
  return serviceCodeMap[service] || service.substring(0, 3).toUpperCase()
}

// Helper function to generate queue number with auto-increment per service
// Counter akan selalu increment dari max counter yang pernah ada untuk layanan tersebut
// Saat admin menekan "Selesai", counter TIDAK di-reset, sehingga nomor ticket selalu unik
async function generateQueueNumber(service: string, idLayanan?: string | bigint | null): Promise<string> {
  const serviceCode = getServiceCode(service)
  
  try {
    // Find the maximum counter for this service from ALL reservations (including completed)
    // Ini memastikan nomor ticket selalu unik dan berurutan, tidak ada duplikasi
    const maxReservation = await prisma.reservasi.findFirst({
      where: {
        OR: [
          { service: service },
          ...(idLayanan ? [{ idLayanan: typeof idLayanan === 'string' ? BigInt(idLayanan) : idLayanan }] : [])
        ],
        // Cari dari semua reservasi, tidak peduli statusnya
        queueNumber: {
          startsWith: `${serviceCode}-`
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    let nextNumber = 1
    
    if (maxReservation) {
      // Extract number from existing queue number (format: CODE-XX)
      const match = maxReservation.queueNumber.match(/-(\d+)$/)
      if (match) {
        const currentNumber = parseInt(match[1], 10)
        nextNumber = currentNumber + 1
      }
    }
    
    // Format number with leading zeros (01, 02, ..., 10, 11, etc.)
    const formattedNumber = nextNumber.toString().padStart(2, '0')
    
    return `${serviceCode}-${formattedNumber}`
  } catch (error) {
    console.error("Error generating queue number:", error)
    // Fallback: use timestamp if database query fails
    const timestamp = Date.now().toString().slice(-6)
    return `${serviceCode}-${timestamp}`
  }
}

// Helper function to calculate estimated call time
function calculateEstimatedTime(service: string): string {
  const currentTime = new Date()
  const estimatedMinutes = 30 // Default 30 minutes
  const estimatedTime = new Date(currentTime.getTime() + estimatedMinutes * 60000)
  
  const hours = estimatedTime.getHours().toString().padStart(2, '0')
  const minutes = estimatedTime.getMinutes().toString().padStart(2, '0')
  
  return `${hours}:${minutes}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { service, date, timeSlot, name, phone, purpose, idLayanan } = body

    if (!service || !date || !timeSlot || !name || !phone || !purpose) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validasi tanggal reservasi
    const [y, m, d] = date.split('-').map(Number)
    const reservationDate = new Date(y, m - 1, d)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    reservationDate.setHours(0, 0, 0, 0)
    
    // Validasi tanggal tidak boleh di masa lalu
    if (reservationDate < today) {
      return NextResponse.json({ 
        success: false,
        error: "Tanggal reservasi tidak boleh di masa lalu."
      }, { status: 400 })
    }

    // Validasi waktu reservasi sesuai jadwal (Sabtu/Minggu/Jumat/Senin-Kamis)
    if (!isValidReservationTime(reservationDate, timeSlot)) {
      return NextResponse.json({ 
        success: false,
        error: "Waktu reservasi tidak valid. Pastikan memilih waktu yang sesuai dengan jadwal operasional."
      }, { status: 400 })
    }

    // Validasi apakah slot waktu sudah lewat (hanya untuk hari yang sama)
    // Jika hari ini dan slot sudah lewat atau sudah lewat jam operasional,
    // maka HARUS pilih tanggal besok atau selanjutnya
    if (isTimeSlotPassed(reservationDate, timeSlot)) {
      return NextResponse.json({ 
        success: false,
        error: "Slot waktu untuk hari ini sudah tidak tersedia. Silakan pilih tanggal besok atau selanjutnya."
      }, { status: 400 })
    }

    // If idLayanan provided, validate it exists and convert to BigInt
    let layananId: bigint | null = null
    if (idLayanan) {
      try {
        // Convert string to BigInt
        layananId = BigInt(idLayanan)
        
        const layananExists = await prisma.layanan.findUnique({
          where: { id: layananId }
        })
        
        if (!layananExists) {
          return NextResponse.json({ 
            success: false,
            error: "Layanan tidak ditemukan" 
          }, { status: 400 })
        }
      } catch (err) {
        console.log("Error validating layanan:", err)
        layananId = null
      }
    }

    // ✅ VALIDASI KAPASITAS SLOT - Cegah double booking
    try {
      // Hitung jumlah reservasi aktif (WAITING atau CALLED) pada tanggal dan slot yang sama
      const existingReservations = await prisma.reservasi.count({
        where: {
          date: reservationDate,
          timeSlot: timeSlot,
          status: {
            in: ["WAITING", "CALLED"] // Hanya hitung yang aktif, tidak termasuk COMPLETED atau CANCELLED
          }
        }
      })

      // Tentukan kapasitas maksimal berdasarkan hari
      const dayOfWeek = reservationDate.getDay()
      const maxCapacity = 1 // Setiap slot hanya untuk 1 orang

      // Cek apakah slot sudah penuh
      if (existingReservations >= maxCapacity) {
        return NextResponse.json({ 
          success: false,
          error: `Slot waktu ${timeSlot} pada tanggal ${date} sudah dipesan oleh orang lain. Silakan pilih slot waktu lain.`
        }, { status: 400 })
      }

      console.log(`✅ Slot ${timeSlot} pada ${date}: ${existingReservations}/${maxCapacity} (tersedia ${maxCapacity - existingReservations} slot)`)
    } catch (validationError) {
      console.error("Error validating slot capacity:", validationError)
      // Jika error saat validasi, tetap lanjutkan (fail-safe)
      // Tapi log error untuk monitoring
    }

    // Generate queue number and estimated call time
    const queueNumber = await generateQueueNumber(service, layananId)
    const estimatedCallTime = calculateEstimatedTime(service)

    // Create new reservation in database (with fallback)
    let reservation: any
    
    try {
      reservation = await prisma.reservasi.create({
        data: {
          queueNumber,
          service,
          idLayanan: layananId, // Use converted BigInt
          name,
          phone,
          nik: body.nik || null,
          purpose,
          // Parse YYYY-MM-DD as local date (avoid UTC shift)
          date: (() => { const [y,m,d] = date.split('-').map(Number); return new Date(y, m-1, d) })(),
          timeSlot,
          estimatedCallTime,
          status: "WAITING",
        },
        include: {
          layanan: true, // Include layanan relation
        },
      })
    } catch (dbError) {
      console.log("Database error, using mock data:", dbError)
      // Fallback to mock data
      reservation = {
        id: Date.now().toString(),
        queueNumber,
        service,
        idLayanan: idLayanan || null,
        name,
        phone,
        nik: body.nik || null,
        purpose,
        date,
        timeSlot,
        status: "waiting",
        createdAt: new Date().toISOString(),
        estimatedCallTime,
      }
      reservations.push(reservation)
    }

    return NextResponse.json({
      success: true,
      data: {
        id: reservation.id,
        queueNumber: reservation.queueNumber,
        service: reservation.service,
        idLayanan: reservation.idLayanan ? reservation.idLayanan.toString() : null,
        layanan: reservation.layanan ? {
          ...reservation.layanan,
          id: reservation.layanan.id.toString(),
        } : null,
        name: reservation.name,
        phone: reservation.phone,
        nik: reservation.nik,
        purpose: reservation.purpose,
        date: reservation.date?.toISOString?.()?.split('T')[0] || reservation.date,
        timeSlot: reservation.timeSlot,
        status: reservation.status.toLowerCase(),
        createdAt: reservation.createdAt,
        estimatedCallTime: reservation.estimatedCallTime,
      },
    })
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    let data: any[] = []
    
    try {
      const dbReservations = await prisma.reservasi.findMany({
        include: {
          layanan: true, // Include layanan relation
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      
      data = dbReservations.map(reservation => ({
        id: reservation.id,
        queueNumber: reservation.queueNumber,
        service: reservation.service,
        idLayanan: reservation.idLayanan ? reservation.idLayanan.toString() : null,
        layanan: reservation.layanan ? {
          ...reservation.layanan,
          id: reservation.layanan.id.toString(),
        } : null,
        name: reservation.name,
        phone: reservation.phone,
        nik: reservation.nik,
        purpose: reservation.purpose,
        date: reservation.date.toISOString().split('T')[0],
        timeSlot: reservation.timeSlot,
        status: reservation.status.toLowerCase(),
        createdAt: reservation.createdAt.toISOString(),
        estimatedCallTime: reservation.estimatedCallTime,
      }))
    } catch (dbError) {
      console.log("Database error, using mock data:", dbError)
      data = reservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
