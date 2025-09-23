"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Volume2, Tv, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// TV-optimized display data
const tvDisplayData = [
  {
    service: "PTK",
    serviceName: "PTK",
    fullName: "Pendidik dan Tenaga Kependidikan",
    currentNumber: "PTK-001234",
    nextNumbers: ["PTK-001235", "PTK-001236"],
    counter: "LOKET 1",
    status: "calling",
    color: "bg-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    service: "SD",
    serviceName: "SD UMUM",
    fullName: "Sekolah Dasar",
    currentNumber: "SD-001156",
    nextNumbers: ["SD-001157", "SD-001158"],
    counter: "LOKET 2",
    status: "calling",
    color: "bg-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-700 dark:text-green-300",
  },
  {
    service: "SMP",
    serviceName: "SMP UMUM",
    fullName: "Sekolah Menengah Pertama",
    currentNumber: "SMP-001089",
    nextNumbers: ["SMP-001090", "SMP-001091"],
    counter: "LOKET 3",
    status: "calling",
    color: "bg-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  {
    service: "PAUD",
    serviceName: "PAUD",
    fullName: "Pendidikan Anak Usia Dini",
    currentNumber: "PAUD-001067",
    nextNumbers: ["PAUD-001068", "PAUD-001069"],
    counter: "LOKET 4",
    status: "calling",
    color: "bg-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-300",
  },
]

const tvAnnouncements = [
  "HARAP DATANG SESUAI NOMOR ANTRIAN YANG DIPANGGIL",
  "JIKA MELEWATI 3 PANGGILAN, NOMOR ANTRIAN AKAN HANGUS",
  "JAM OPERASIONAL: SENIN - JUMAT 08:00 - 16:00",
  "UNTUK INFORMASI LEBIH LANJUT HUBUNGI PETUGAS",
]

export default function TVDisplayPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)
  const [highlightedService, setHighlightedService] = useState<string | null>(null)

  useEffect(() => {
    // Update time every second
    const timeTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Rotate announcements every 4 seconds
    const announcementTimer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % tvAnnouncements.length)
    }, 4000)

    // Highlight services cyclically
    const highlightTimer = setInterval(() => {
      const services = tvDisplayData.map((d) => d.service)
      const currentIndex = services.indexOf(highlightedService || "")
      const nextIndex = (currentIndex + 1) % services.length
      setHighlightedService(services[nextIndex])
    }, 3000)

    return () => {
      clearInterval(timeTimer)
      clearInterval(announcementTimer)
      clearInterval(highlightTimer)
    }
  }, [highlightedService])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 py-6 px-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 p-3 rounded-full">
              <Tv className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-wide">SISTEM ANTRIAN</h1>
              <p className="text-xl text-blue-100 mt-1">DINAS PENDIDIKAN KOTA BANJARMASIN</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-blue-200" />
              <div className="font-mono text-5xl font-bold text-white">
                {currentTime.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="text-lg text-blue-200">
              {currentTime.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Service Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {tvDisplayData.map((service) => (
            <Card
              key={service.service}
              className={cn(
                "relative overflow-hidden border-4 transition-all duration-700 transform",
                highlightedService === service.service
                  ? "border-yellow-400 shadow-2xl shadow-yellow-400/30 scale-105 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
                  : "border-gray-600 bg-gray-800/50 backdrop-blur-sm",
                service.bgColor,
              )}
            >
              {/* Service Header */}
              <div className={cn("py-4 px-6", service.color)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-white" />
                    <div>
                      <div className="text-2xl font-bold text-white">{service.serviceName}</div>
                      <div className="text-sm text-white/80">{service.fullName}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white border-white/30">
                    {service.counter}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-8 text-center">
                {/* Current Number */}
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Volume2 className={cn("w-6 h-6", service.textColor)} />
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">SEDANG DIPANGGIL</span>
                  </div>

                  <div
                    className={cn(
                      "text-7xl font-bold mb-4 transition-all duration-500",
                      service.textColor,
                      highlightedService === service.service && "animate-pulse text-yellow-600 dark:text-yellow-400",
                    )}
                  >
                    {service.currentNumber}
                  </div>
                </div>

                {/* Next Numbers */}
                <div className="border-t border-gray-300 dark:border-gray-600 pt-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    ANTRIAN SELANJUTNYA
                  </div>
                  <div className="flex justify-center gap-6">
                    {service.nextNumbers.map((number, index) => (
                      <div
                        key={number}
                        className={cn(
                          "px-4 py-3 rounded-xl font-bold text-lg transition-all duration-300",
                          index === 0
                            ? "bg-yellow-200 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200 border-2 border-yellow-400 shadow-lg"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
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

        {/* Bottom Information */}
        <div className="grid grid-cols-3 gap-8">
          {/* Announcements */}
          <Card className="col-span-2 bg-red-600/90 backdrop-blur-sm border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="w-8 h-8 text-white animate-pulse" />
                <h3 className="text-2xl font-bold text-white">PENGUMUMAN</h3>
              </div>
              <div className="text-2xl font-medium text-white text-center min-h-[80px] flex items-center justify-center leading-relaxed">
                {tvAnnouncements[currentAnnouncement]}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-green-600/90 backdrop-blur-sm border-green-500">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 text-center">STATISTIK HARI INI</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">127</div>
                  <div className="text-sm text-green-100">TOTAL DILAYANI</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">41</div>
                  <div className="text-sm text-green-100">SEDANG ANTRI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">12 MIN</div>
                  <div className="text-sm text-green-100">RATA-RATA TUNGGU</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 py-4 px-8 mt-8">
        <div className="text-center">
          <p className="text-xl font-medium text-white mb-1">
            DINAS PENDIDIKAN KOTA BANJARMASIN - MELAYANI DENGAN SEPENUH HATI
          </p>
          <p className="text-gray-300">Jl. Kapten Piere Tendean No.29, Banjarmasin | Telp: (0511) 3252732</p>
        </div>
      </div>
    </div>
  )
}
