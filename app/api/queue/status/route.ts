import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Service configuration
const serviceConfig = {
  ptk: { name: "PTK (Pendidik dan Tenaga Kependidikan)", color: "bg-blue-500" },
  sd: { name: "SD Umum", color: "bg-green-500" },
  smp: { name: "SMP Umum", color: "bg-purple-500" },
  paud: { name: "PAUD", color: "bg-orange-500" },
}

export async function GET() {
  try {
    // Get current queue status for each service
    const serviceQueues = await Promise.all(
      Object.keys(serviceConfig).map(async (service) => {
        const waitingCount = await prisma.reservasi.count({
          where: {
            service,
            status: "WAITING",
          },
        })

        const calledCount = await prisma.reservasi.count({
          where: {
            service,
            status: "CALLED",
          },
        })

        const totalQueue = waitingCount + calledCount
        const estimatedWait = `${totalQueue * 3} menit`

        return {
          service,
          serviceName: serviceConfig[service as keyof typeof serviceConfig].name,
          currentNumber: calledCount > 0 ? `CALLED-${calledCount}` : "Tidak ada",
          totalQueue,
          estimatedWait,
          status: totalQueue > 0 ? "active" : "inactive",
          color: serviceConfig[service as keyof typeof serviceConfig].color,
        }
      })
    )

    // Get recent completed calls
    const recentCalls = await prisma.reservasi.findMany({
      where: {
        status: "COMPLETED",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        queueNumber: true,
        service: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        serviceQueues,
        recentCalls: recentCalls.map((call) => ({
          number: call.queueNumber,
          service: call.service.toUpperCase(),
          time: call.updatedAt.toLocaleTimeString("id-ID", {
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
