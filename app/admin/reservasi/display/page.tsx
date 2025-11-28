"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Reservation {
  id: string
  queueNumber: string
  name: string
  status: string
  layanan?: {
    name: string
  } | null
  service?: string
}

const SERVICE_COLORS = {
  ptk: { bg: 'bg-blue-600', text: 'text-blue-600', bgLight: 'bg-blue-50' },
  sd: { bg: 'bg-green-600', text: 'text-green-600', bgLight: 'bg-green-50' },
  smp: { bg: 'bg-yellow-600', text: 'text-yellow-600', bgLight: 'bg-yellow-50' },
  paud: { bg: 'bg-purple-600', text: 'text-purple-600', bgLight: 'bg-purple-50' },
}

const SERVICE_LABELS = {
  ptk: 'PTK (PENDIDIK DAN TENAGA KEPENDIDIKAN)',
  sd: 'SD UMUM',
  smp: 'SMP UMUM',
  paud: 'PAUD',
}

const getServiceKey = (reservation: Reservation): string => {
  const serviceName = (reservation.layanan?.name || reservation.service || '').toLowerCase()
  
  if (serviceName.includes('ptk')) return 'ptk'
  if (serviceName.includes('sd')) return 'sd'
  if (serviceName.includes('smp')) return 'smp'
  if (serviceName.includes('paud')) return 'paud'
  
  return 'ptk' // default
}

export default function DisplayAntrianPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [calledReservations, setCalledReservations] = useState<{[key: string]: Reservation[]}>({
    ptk: [],
    sd: [],
    smp: [],
    paud: [],
  })

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch reservations data
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reservations')
        if (response.ok) {
          const data = await response.json()
          const allReservations = data.data || []
          setReservations(allReservations)
          
          // Group by service and get only "called" status
          const grouped: {[key: string]: Reservation[]} = {
            ptk: [],
            sd: [],
            smp: [],
            paud: [],
          }
          
          allReservations
            .filter((r: Reservation) => r.status === 'called')
            .forEach((r: Reservation) => {
              const key = getServiceKey(r)
              grouped[key].push(r)
            })
          
          setCalledReservations(grouped)
        }
      } catch (error) {
        console.error('Error fetching reservations:', error)
      }
    }

    fetchReservations()
    // Refresh every 5 seconds
    const interval = setInterval(fetchReservations, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 p-3 flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-5 mb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              SISTEM INFORMASI MANAJEMEN PENDIDIKAN
            </h1>
            <p className="text-3xl text-gray-600">Nomor Antrian Layanan</p>
          </div>
          <div className="text-right">
            <p className="text-7xl font-bold text-blue-600">{formatTime(currentTime)}</p>
            <p className="text-2xl text-gray-600">{formatDate(currentTime)}</p>
          </div>
        </div>
      </div>

      {/* Queue Display Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        {(Object.keys(SERVICE_LABELS) as Array<keyof typeof SERVICE_LABELS>).map((serviceKey) => {
          const colors = SERVICE_COLORS[serviceKey]
          const label = SERVICE_LABELS[serviceKey]
          const currentQueue = calledReservations[serviceKey]
          const latestCalled = currentQueue[currentQueue.length - 1]

          return (
            <Card key={serviceKey} className="shadow-lg border-2 border-gray-200 flex flex-col h-full">
              <CardHeader className={`${colors.bg} text-white py-4 px-4 flex-shrink-0`}>
                <CardTitle className="text-4xl font-bold text-center leading-tight">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 flex-1 flex flex-col justify-center">
                {latestCalled ? (
                  <div className="text-center">
                    <p className="text-xl text-gray-600 font-medium mb-2">Nomor Antrian:</p>
                    <div className={`${colors.bgLight} rounded-lg p-3 border-4 border-dashed ${colors.text} border-opacity-50`}>
                      <p className={`text-9xl font-black ${colors.text} animate-pulse leading-none`}>
                        {latestCalled.queueNumber}
                      </p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <p className="text-xl font-semibold text-gray-800 truncate">{latestCalled.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xl text-gray-400 font-medium mb-2">
                      Belum ada antrian
                    </p>
                    <div className={`${colors.bgLight} rounded-lg p-3`}>
                      <p className={`text-7xl font-bold ${colors.text} opacity-30 leading-none`}>-</p>
                    </div>
                  </div>
                )}

                {/* Previous queues (last 2) */}
                {currentQueue.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-base text-gray-500 mb-1 text-center">Sebelumnya:</p>
                    <div className="flex justify-center gap-2">
                      {currentQueue.slice(-3, -1).reverse().map((res) => (
                        <Badge
                          key={res.id}
                          variant="outline"
                          className={`${colors.text} text-lg px-4 py-2`}
                        >
                          {res.queueNumber}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-2 text-center flex-shrink-0">
        <p className="text-gray-600 text-base">
          Harap perhatikan nomor antrian Anda di layar monitor
        </p>
      </div>
    </div>
  )
}
