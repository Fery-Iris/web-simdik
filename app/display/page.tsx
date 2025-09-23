"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Volume2, Tv } from "lucide-react"
import { cn } from "@/lib/utils"

// Static data for public display
const displayData = [
  {
    service: "PTK",
    serviceName: "PTK (Pendidik dan Tenaga Kependidikan)",
    currentNumber: "PTK-001234",
    nextNumbers: ["PTK-001235", "PTK-001236", "PTK-001237"],
    counter: "Loket 1",
    status: "calling",
    color: "bg-blue-500",
    textColor: "text-blue-600",
  },
  {
    service: "SD",
    serviceName: "SD Umum",
    currentNumber: "SD-001156",
    nextNumbers: ["SD-001157", "SD-001158", "SD-001159"],
    counter: "Loket 2",
    status: "calling",
    color: "bg-green-500",
    textColor: "text-green-600",
  },
  {
    service: "SMP",
    serviceName: "SMP Umum",
    currentNumber: "SMP-001089",
    nextNumbers: ["SMP-001090", "SMP-001091", "SMP-001092"],
    counter: "Loket 3",
    status: "calling",
    color: "bg-purple-500",
    textColor: "text-purple-600",
  },
  {
    service: "PAUD",
    serviceName: "PAUD",
    currentNumber: "PAUD-001067",
    nextNumbers: ["PAUD-001068", "PAUD-001069", "PAUD-001070"],
    counter: "Loket 4",
    status: "calling",
    color: "bg-orange-500",
    textColor: "text-orange-600",
  },
]

const announcements = [
  "Harap datang sesuai nomor antrian yang dipanggil",
  "Jika melewati 3 panggilan, nomor antrian akan hangus",
  "Untuk informasi lebih lanjut, hubungi petugas di loket informasi",
  "Jam operasional: Senin-Jumat 08:00-16:00",
]

export default function PublicDisplayPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)
  const [blinkingService, setBlinkingService] = useState<string | null>(null)

  useEffect(() => {
    // Update time every second
    const timeTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Rotate announcements every 5 seconds
    const announcementTimer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length)
    }, 5000)

    // Simulate blinking effect for newly called numbers
    const blinkTimer = setInterval(() => {
      const randomService = displayData[Math.floor(Math.random() * displayData.length)]
      setBlinkingService(randomService.service)
      setTimeout(() => setBlinkingService(null), 3000)
    }, 10000)

    return () => {
      clearInterval(timeTimer)
      clearInterval(announcementTimer)
      clearInterval(blinkTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Tv className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100">SISTEM ANTRIAN DINAS PENDIDIKAN</h1>
        </div>
        <div className="flex items-center justify-center gap-8 text-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <span className="font-mono text-2xl font-bold text-blue-800 dark:text-blue-200">
              {currentTime.toLocaleTimeString("id-ID")}
            </span>
          </div>
          <div className="text-blue-700 dark:text-blue-300">
            {currentTime.toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Main Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {displayData.map((service) => (
          <Card
            key={service.service}
            className={cn(
              "relative overflow-hidden border-4 transition-all duration-500",
              blinkingService === service.service
                ? "border-red-500 shadow-2xl shadow-red-500/50 animate-pulse"
                : "border-gray-200 dark:border-gray-700",
            )}
          >
            <CardHeader className={cn("text-center py-4", service.color, "text-white")}>
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                <Users className="w-8 h-8" />
                {service.serviceName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              {/* Current Number Being Called */}
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  SEDANG DIPANGGIL
                </div>
                <div
                  className={cn(
                    "text-6xl font-bold mb-2 transition-all duration-300",
                    service.textColor,
                    blinkingService === service.service && "animate-bounce",
                  )}
                >
                  {service.currentNumber}
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {service.counter}
                </Badge>
              </div>

              {/* Next Numbers */}
              <div className="border-t pt-4">
                <div className="text-sm text-muted-foreground mb-3">ANTRIAN SELANJUTNYA</div>
                <div className="flex justify-center gap-4">
                  {service.nextNumbers.map((number, index) => (
                    <div
                      key={number}
                      className={cn(
                        "px-3 py-2 rounded-lg font-medium transition-all duration-300",
                        index === 0
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-2 border-yellow-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
                      )}
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Information Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Running Announcements */}
        <Card className="lg:col-span-2">
          <CardHeader className="bg-blue-600 text-white py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              PENGUMUMAN
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-lg text-center font-medium text-blue-800 dark:text-blue-200 min-h-[60px] flex items-center justify-center">
              {announcements[currentAnnouncement]}
            </div>
          </CardContent>
        </Card>

        {/* Queue Statistics */}
        <Card>
          <CardHeader className="bg-green-600 text-white py-3">
            <CardTitle className="text-lg">STATISTIK HARI INI</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Dilayani:</span>
                <span className="text-2xl font-bold text-green-600">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sedang Antri:</span>
                <span className="text-2xl font-bold text-blue-600">41</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rata-rata Tunggu:</span>
                <span className="text-lg font-bold text-orange-600">12 menit</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-blue-700 dark:text-blue-300">
        <p className="text-lg font-medium">Dinas Pendidikan Kota Banjarmasin - Melayani dengan Sepenuh Hati</p>
        <p className="text-sm mt-2">Jl. Kapten Piere Tendean No.29, Banjarmasin | Telp: (0511) 3252732</p>
      </div>
    </div>
  )
}
