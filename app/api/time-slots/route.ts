import { type NextRequest, NextResponse } from "next/server"

// Try to import prisma, fallback to mock data if it fails
let prisma: any = null
try {
  const { prisma: prismaClient } = await import("@/lib/prisma")
  prisma = prismaClient
} catch (error) {
  console.log("Prisma not available, using mock data")
}

// Define available time slots with capacity based on day of week
const getTimeSlotsForDay = (dayOfWeek: number) => {
  // Friday (5) - only 8 AM to 10 AM
  if (dayOfWeek === 5) {
    return [
      { id: "08:00", time: "08:00 - 09:00", capacity: 1 },
      { id: "09:00", time: "09:00 - 10:00", capacity: 1 },
    ]
  }
  
  // Saturday (6) and Sunday (0) - no service
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    return []
  }
  
  // Monday-Thursday (1-4) - 8 AM to 12 PM, then 2 PM to 4 PM (lunch break 12-2 PM, tutup jam 16:00)
  return [
    { id: "08:00", time: "08:00 - 09:00", capacity: 1 },
    { id: "09:00", time: "09:00 - 10:00", capacity: 1 },
    { id: "10:00", time: "10:00 - 11:00", capacity: 1 },
    { id: "11:00", time: "11:00 - 12:00", capacity: 1 },
    { id: "14:00", time: "14:00 - 15:00", capacity: 1 },
    { id: "15:00", time: "15:00 - 16:00", capacity: 1 },
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    // Parse as LOCAL date to avoid UTC shifting (YYYY-MM-DD -> local midnight)
    const [y, m, d] = date.split("-").map(Number)
    const selectedDate = new Date(y, (m as number) - 1, d)
    const dayOfWeek = selectedDate.getDay()
    
    // Get time slots for the specific day
    const timeSlotConfig = getTimeSlotsForDay(dayOfWeek)
    
    // If no service on weekends, return empty array
    if (timeSlotConfig.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "Layanan tidak tersedia pada hari Sabtu dan Minggu"
      })
    }

    let timeSlots: any[] = []
    
    if (prisma) {
      try {
        // Get reservations for the specific date
        const reservations = await prisma.reservasi.findMany({
          where: {
            date: selectedDate,
            status: {
              in: ["WAITING", "CALLED"],
            },
          },
          select: {
            timeSlot: true,
          },
        })

        // Count bookings for each time slot
        const bookingsCount: Record<string, number> = {}
        reservations.forEach(reservation => {
          bookingsCount[reservation.timeSlot] = (bookingsCount[reservation.timeSlot] || 0) + 1
        })

        // Generate time slots with availability
        timeSlots = timeSlotConfig.map(slot => ({
          id: slot.id,
          time: slot.time,
          capacity: slot.capacity,
          booked: bookingsCount[slot.id] || 0,
        }))
      } catch (dbError) {
        console.log("Database error, using mock data:", dbError)
        // Fallback to mock data
        timeSlots = timeSlotConfig.map(slot => ({
          id: slot.id,
          time: slot.time,
          capacity: slot.capacity,
          booked: Math.floor(Math.random() * slot.capacity), // Random booking count for demo
        }))
      }
    } else {
      // Use mock data
      timeSlots = timeSlotConfig.map(slot => ({
        id: slot.id,
        time: slot.time,
        capacity: slot.capacity,
        booked: Math.floor(Math.random() * slot.capacity), // Random booking count for demo
      }))
    }

    return NextResponse.json({
      success: true,
      data: timeSlots,
    })
  } catch (error) {
    console.error("Error fetching time slots:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
