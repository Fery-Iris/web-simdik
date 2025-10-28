import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// In-memory storage for reservations (fallback)
let reservations: any[] = []

// Helper function to generate queue number
function generateQueueNumber(service: string): string {
  const timestamp = Date.now().toString().slice(-6)
  
  // Map service name to short code
  const serviceCodeMap: { [key: string]: string } = {
    'PTK (Pendidik dan Tenaga Kependidikan)': 'PTK',
    'SD Umum': 'SD',
    'SMP Umum': 'SMP',
    'PAUD': 'PAUD',
  }
  
  // Get short code or use first 3 chars of service name
  const serviceCode = serviceCodeMap[service] || service.substring(0, 3).toUpperCase()
  
  return `${serviceCode}-${timestamp}`
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

    // Generate queue number and estimated call time
    const queueNumber = generateQueueNumber(service)
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
