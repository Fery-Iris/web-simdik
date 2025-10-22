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
      status 
    } = body

    // Validate required fields
    if (!name || !phone || !purpose || !service || !date || !timeSlot || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate status
    if (!["WAITING", "CALLED", "COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
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
        // Parse as local date (YYYY-MM-DD)
        date: (() => { const [y,m,d] = date.split('-').map(Number); return new Date(y, m-1, d) })(),
        timeSlot,
        status,
      },
    })

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
