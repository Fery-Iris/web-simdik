import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await prisma.reservasi.findUnique({
      where: {
        id: params.id,
      },
      include: {
        layanan: true, // Include layanan relation
      },
    })

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
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
        date: reservation.date.toISOString().split('T')[0],
        timeSlot: reservation.timeSlot,
        status: reservation.status.toLowerCase(),
        createdAt: reservation.createdAt.toISOString(),
        updatedAt: reservation.updatedAt.toISOString(),
        estimatedCallTime: reservation.estimatedCallTime,
      },
    })
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      name, 
      phone, 
      nik, 
      purpose, 
      service, 
      date, 
      timeSlot, 
      status,
      idLayanan
    } = body

    // Validate required fields
    if (!name || !phone || !purpose || !service || !date || !timeSlot || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate status
    if (!["WAITING", "CALLED", "COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // If idLayanan provided, validate it exists and convert to BigInt
    let layananId: bigint | null = null
    if (idLayanan) {
      try {
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

    // AUTO-COMPLETE LOGIC: When calling a new ticket, auto-complete previous "called" tickets in the same service
    if (status === "CALLED") {
      try {
        // Get the current reservation to determine the service
        const currentReservation = await prisma.reservasi.findUnique({
          where: { id: params.id },
          include: { layanan: true }
        })

        if (currentReservation) {
          // Determine service key for matching
          const serviceKey = service.toLowerCase().trim()
          const serviceName = currentReservation.layanan?.name?.toLowerCase().trim()
          
          // Build conditions to find other "called" reservations in the same service
          const serviceConditions = []
          
          // Match by service field
          if (serviceKey) {
            serviceConditions.push({
              service: {
                contains: serviceKey,
                mode: 'insensitive' as const
              }
            })
          }
          
          // Match by layanan relation if exists
          if (layananId) {
            serviceConditions.push({
              idLayanan: layananId
            })
          }
          
          // Match by layanan name if exists
          if (serviceName) {
            serviceConditions.push({
              layanan: {
                name: {
                  contains: serviceName,
                  mode: 'insensitive' as const
                }
              }
            })
          }

          // Auto-complete all "called" reservations in the same service (except the current one)
          if (serviceConditions.length > 0) {
            await prisma.reservasi.updateMany({
              where: {
                AND: [
                  { id: { not: params.id } }, // Exclude current reservation
                  { status: "CALLED" },
                  { OR: serviceConditions }
                ]
              },
              data: {
                status: "COMPLETED"
              }
            })
          }
        }
      } catch (autoCompleteError) {
        console.error("Error in auto-complete logic:", autoCompleteError)
        // Continue with normal update even if auto-complete fails
      }
    }

    const reservation = await prisma.reservasi.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        phone,
        nik: nik || null,
        purpose,
        service,
        idLayanan: layananId,
        // Parse as local date (YYYY-MM-DD)
        date: (() => { const [y,m,d] = date.split('-').map(Number); return new Date(y, m-1, d) })(),
        timeSlot,
        status,
      },
      include: {
        layanan: true,
      },
    })

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
        date: reservation.date.toISOString().split('T')[0],
        timeSlot: reservation.timeSlot,
        status: reservation.status.toLowerCase(),
        createdAt: reservation.createdAt.toISOString(),
        updatedAt: reservation.updatedAt.toISOString(),
        estimatedCallTime: reservation.estimatedCallTime,
      },
    })
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.reservasi.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Reservation deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
