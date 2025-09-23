import { NextResponse } from "next/server"
import { getServiceQueues, getRecentCompletedQueues } from "@/lib/queue-data"

export async function GET() {
  try {
    const serviceQueues = getServiceQueues()
    const recentCalls = getRecentCompletedQueues(5)

    return NextResponse.json({
      success: true,
      data: {
        serviceQueues,
        recentCalls: recentCalls.map((call) => ({
          number: call.queueNumber,
          service: call.service.toUpperCase(),
          time: new Date(call.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "completed",
        })),
      },
    })
  } catch (error) {
    console.error("Error fetching queue status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
