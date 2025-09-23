import { type NextRequest, NextResponse } from "next/server"
import { createQueueItem, getQueueItems } from "@/lib/queue-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { service, date, timeSlot, name, phone, purpose } = body

    if (!service || !date || !timeSlot || !name || !phone || !purpose) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new queue item
    const queueItem = createQueueItem({
      service,
      date,
      timeSlot,
      name,
      phone,
      nik: body.nik || "",
      purpose,
      status: "waiting",
    })

    return NextResponse.json({
      success: true,
      data: queueItem,
    })
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const queueItems = getQueueItems()

    return NextResponse.json({
      success: true,
      data: queueItems,
    })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
