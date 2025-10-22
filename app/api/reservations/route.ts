import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// In-memory storage for reservations (fallback)
let reservations: any[] = []

// Helper function to generate queue number
function generateQueueNumber(service: string): string {
  const timestamp = Date.now().toString().slice(-6)
  const serviceCode = service.toUpperCase()
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
    const { service, date, timeSlot, name, phone, purpose } = body

    if (!service || !date || !timeSlot || !name || !phone || !purpose) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
      })
    } catch (dbError) {
      console.log("Database error, using mock data:", dbError)
      // Fallback to mock data
      reservation = {
        id: Date.now().toString(),
        queueNumber,
        service,
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
        orderBy: {
          createdAt: 'desc',
        },
      })
      
      data = dbReservations.map(reservation => ({
        id: reservation.id,
        queueNumber: reservation.queueNumber,
        service: reservation.service,
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
