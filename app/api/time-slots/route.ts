import { type NextRequest, NextResponse } from "next/server"
import { getAvailableTimeSlots } from "@/lib/queue-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    const timeSlots = getAvailableTimeSlots(date)

    return NextResponse.json({
      success: true,
      data: timeSlots,
    })
  } catch (error) {
    console.error("Error fetching time slots:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
