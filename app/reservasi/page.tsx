"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { SimpleCalendar } from "@/components/ui/simple-calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon, Clock, Users, GraduationCap, Baby, School, Menu, Printer } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteHeader } from "@/components/site-header"
import { checkReservationStatus, isTimeSlotPassed } from "@/lib/reservation-hours"

// ⚡ Lazy load PDF generator (jsPDF library cukup besar ~100KB)
const generateTicketPDF = async (data: ReservationTicketData) => {
  const module = await import("@/lib/pdf-generator")
  return module.generateTicketPDF(data)
}

// Type import tetap normal
import type { ReservationTicketData } from "@/lib/pdf-generator"

// Icon mapping
const iconMap: { [key: string]: any } = {
  Users,
  School,
  GraduationCap,
  Baby,
}

interface LayananFromAPI {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ServiceDisplay {
  id: string
  name: string
  icon: any
  description: string
  color: string
}

// Format a JS Date to local YYYY-MM-DD (no timezone shift)
const formatLocalYmd = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const getTimeSlots = async (selectedDate: Date | undefined) => {
  if (!selectedDate) return []

  try {
    const response = await fetch(`/api/time-slots?date=${formatLocalYmd(selectedDate)}`)
    if (!response.ok) {
      throw new Error('Failed to fetch time slots')
    }
    
    const result = await response.json()
    if (result.success) {
      return result.data
    }
  } catch (error) {
    console.error('Error fetching time slots:', error)
  }

  // Fallback to static data if API fails
  const dayOfWeek = selectedDate.getDay()

  // Saturday (6) and Sunday (0) - no service
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    return []
  }

  // Friday (5) - only 8 AM to 10 AM
  if (dayOfWeek === 5) {
    return [
      { id: "08:00", time: "08:00 - 09:00", capacity: 1, booked: 0 },
      { id: "09:00", time: "09:00 - 10:00", capacity: 1, booked: 0 },
    ]
  }

  // Monday-Thursday (1-4) - 8 AM to 12 PM, then 2 PM to 4 PM (lunch break 12-2 PM, tutup jam 16:00)
  return [
    { id: "08:00", time: "08:00 - 09:00", capacity: 1, booked: 0 },
    { id: "09:00", time: "09:00 - 10:00", capacity: 1, booked: 0 },
    { id: "10:00", time: "10:00 - 11:00", capacity: 1, booked: 0 },
    { id: "11:00", time: "11:00 - 12:00", capacity: 1, booked: 0 },
    { id: "14:00", time: "14:00 - 15:00", capacity: 1, booked: 0 },
    { id: "15:00", time: "15:00 - 16:00", capacity: 1, booked: 0 },
  ]
}

interface ReservationData {
  service: string
  idLayanan: string
  date: Date | undefined
  timeSlot: string
  name: string
  phone: string
  nik: string
  purpose: string
}

export default function ReservasiPage() {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [reservationData, setReservationData] = useState<ReservationData>({
    service: "",
    idLayanan: "",
    date: undefined,
    timeSlot: "",
    name: "",
    phone: "",
    nik: "",
    purpose: "",
  })
  const [queueNumber, setQueueNumber] = useState<string>("")
  const [estimatedTime, setEstimatedTime] = useState<string>("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [timeSlots, setTimeSlots] = useState<Array<{id: string, time: string, capacity: number, booked: number}>>([])
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)
  const [services, setServices] = useState<ServiceDisplay[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [reservationStatus, setReservationStatus] = useState<{isOpen: boolean, message: string, nextOpenTime?: string} | null>(null)

  // Cek status reservasi real-time
  useEffect(() => {
    const checkStatus = () => {
      const status = checkReservationStatus()
      setReservationStatus(status)
    }
    
    // Cek langsung saat mount
    checkStatus()
    
    // Update setiap detik untuk benar-benar real-time
    // Ini penting untuk mendeteksi perubahan status tepat waktu (misalnya jam 16:00:00)
    const interval = setInterval(checkStatus, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Fetch layanans from API
  useEffect(() => {
    const fetchLayanans = async () => {
      try {
        const response = await fetch('/api/layanans')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Transform API data to ServiceDisplay format
            const transformedServices: ServiceDisplay[] = result.data.map((layanan: LayananFromAPI) => ({
              id: layanan.id,
              name: layanan.name,
              description: layanan.description || "Layanan pendidikan",
              icon: iconMap[layanan.icon || 'School'] || School,
              color: layanan.color || 'bg-blue-500',
            }))
            setServices(transformedServices)
          }
        }
      } catch (error) {
        console.error('Error fetching layanans:', error)
        // Fallback to default services if API fails
        setServices([
          {
            id: "default-1",
            name: "PTK (Pendidik dan Tenaga Kependidikan)",
            icon: Users,
            description: "Layanan untuk guru, kepala sekolah, dan tenaga kependidikan",
            color: "bg-blue-500",
          },
          {
            id: "default-2",
            name: "SD Umum",
            icon: School,
            description: "Layanan untuk Sekolah Dasar",
            color: "bg-green-500",
          },
          {
            id: "default-3",
            name: "SMP Umum",
            icon: GraduationCap,
            description: "Layanan untuk Sekolah Menengah Pertama",
            color: "bg-purple-500",
          },
          {
            id: "default-4",
            name: "PAUD",
            icon: Baby,
            description: "Layanan untuk Pendidikan Anak Usia Dini",
            color: "bg-orange-500",
          },
        ])
      } finally {
        setIsLoadingServices(false)
      }
    }

    fetchLayanans()
  }, [])

  const handleServiceSelect = (serviceId: string, serviceName: string) => {
    setReservationData({ 
      ...reservationData, 
      service: serviceName,
      idLayanan: serviceId 
    })
    setStep(2)
  }

  const loadTimeSlots = async (date: Date) => {
    setIsLoadingTimeSlots(true)
    try {
      const slots = await getTimeSlots(date)
      setTimeSlots(slots)
    } catch (error) {
      console.error('Error loading time slots:', error)
      setTimeSlots([])
    } finally {
      setIsLoadingTimeSlots(false)
    }
  }

  const handleDateTimeSelect = () => {
    if (selectedDate && reservationData.timeSlot) {
      setReservationData({ ...reservationData, date: selectedDate })
      setStep(3)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      console.log('Submitting reservation data:', {
        service: reservationData.service,
        idLayanan: reservationData.idLayanan,
        date: reservationData.date?.toISOString().split('T')[0],
        timeSlot: reservationData.timeSlot,
        name: reservationData.name,
        phone: reservationData.phone,
        nik: reservationData.nik,
        purpose: reservationData.purpose,
      })

            const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: reservationData.service,
          idLayanan: reservationData.idLayanan,
                date: reservationData.date ? formatLocalYmd(reservationData.date) : undefined,
          timeSlot: reservationData.timeSlot,
          name: reservationData.name,
          phone: reservationData.phone,
          nik: reservationData.nik,
          purpose: reservationData.purpose,
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Response error:', errorData)
        
        // Handle khusus untuk error 403 (reservasi tutup)
        if (response.status === 403) {
          const message = errorData.error || 'Reservasi sedang tutup'
          const nextOpenTime = errorData.nextOpenTime ? `\n\nBuka kembali: ${errorData.nextOpenTime}` : ''
          alert(`❌ ${message}${nextOpenTime}`)
          return
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log('Response data:', result)
      
      if (result.success) {
        setQueueNumber(result.data.queueNumber)
        setEstimatedTime(result.data.estimatedCallTime)
        setStep(4)
      } else {
        throw new Error(result.error || 'Failed to create reservation')
      }
    } catch (error) {
      console.error('Error creating reservation:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Terjadi kesalahan saat membuat reservasi: ${errorMessage}`)
    }
  }

  const handlePrint = async () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) return

    setIsGeneratingPDF(true)

    const ticketData: ReservationTicketData = {
      queueNumber,
      serviceName: selectedService.name,
      name: reservationData.name,
      date: format(selectedDate, "PPP", { locale: id }),
      time: selectedTimeSlot.time,
      estimatedTime,
      phone: reservationData.phone,
      purpose: reservationData.purpose,
    }

    try {
      await generateTicketPDF(ticketData)
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback to regular print
      window.print()
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedDate(undefined)
    setIsCalendarOpen(false)
    setReservationData({
      service: "",
      idLayanan: "",
      date: undefined,
      timeSlot: "",
      name: "",
      phone: "",
      nik: "",
      purpose: "",
    })
    setQueueNumber("")
    setEstimatedTime("")
  }

  const selectedService = services.find((s) => s.id === reservationData.idLayanan)
  const selectedTimeSlot = timeSlots.find((t) => t.id === reservationData.timeSlot)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background text-foreground overflow-x-hidden">
      <SiteHeader />

      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full animate-float-strong blur-sm"></div>
          <div className="absolute bottom-10 right-20 w-16 h-16 bg-blue-500 rounded-full animate-float-delayed-strong blur-sm"></div>
          <div className="absolute top-1/2 right-10 w-12 h-12 bg-blue-300 rounded-full animate-float-strong blur-sm"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <ScrollReveal animation="fade-up" delay={0}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Sistem Reservasi Online</h1>
            <p className="text-blue-100 text-base sm:text-lg">
              Dinas Pendidikan Kota Banjarmasin - Mudah, Cepat, dan Terpercaya
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 relative">
        {/* Status Banner - Informasi jam operasional */}
        {reservationStatus && (
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="text-center py-4 mb-6">
              <div className={`${
                reservationStatus.isOpen 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' 
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              } border rounded-lg p-4 inline-block`}>
                <span className="text-sm sm:text-base font-medium">
                  {reservationStatus.isOpen ? '✅' : 'ℹ️'} {reservationStatus.message}
                </span>
                {!reservationStatus.isOpen && (
                  <div className="text-xs mt-2 opacity-90">
                    Anda tetap dapat melakukan reservasi untuk hari-hari berikutnya
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal animation="fade-up" delay={100}>
          <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-shrink-0">
                <div
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300",
                    step >= stepNum ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-500",
                  )}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={cn(
                      "w-12 sm:w-16 h-1 mx-1 sm:mx-2 transition-all duration-300",
                      step > stepNum ? "bg-blue-600" : "bg-gray-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <ScrollReveal animation="fade-up" delay={200}>
            <Card className="shadow-lg border-0 bg-white dark:bg-card">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 p-4 sm:p-6">
                <CardTitle className="text-center text-xl sm:text-2xl text-blue-700 dark:text-blue-300">
                  Pilih Layanan
                </CardTitle>
                <p className="text-center text-sm sm:text-base text-muted-foreground">
                  Silakan pilih layanan yang Anda butuhkan
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-8 bg-white dark:bg-card">
                {isLoadingServices ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {services.map((service) => {
                      const Icon = service.icon
                      return (
                        <Card
                          key={service.id}
                          className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-400 group bg-white dark:bg-card touch-manipulation"
                          onClick={() => handleServiceSelect(service.id, service.name)}
                        >
                          <CardContent className="p-4 sm:p-6 text-center bg-white dark:bg-card">
                            <div
                              className={cn(
                                "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110",
                                service.color,
                              )}
                            >
                              <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-foreground">
                              {service.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{service.description}</p>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Step 2: Date and Time Selection */}
        {step === 2 && (
          <ScrollReveal animation="fade-up" delay={200}>
            <Card className="shadow-lg border-0 bg-white dark:bg-card">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 p-4 sm:p-6">
                <CardTitle className="text-center text-xl sm:text-2xl text-blue-700 dark:text-blue-300">
                  Pilih Tanggal & Waktu
                </CardTitle>
                <p className="text-center text-sm sm:text-base text-muted-foreground">
                  Layanan:{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedService?.name}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-8 bg-card dark:bg-card">
                {/* Date Selection */}
                <div className="relative">
                  <Label className="text-sm sm:text-base font-medium text-foreground">Pilih Tanggal</Label>
                  
                  {/* Desktop Calendar - Using Dialog as fallback */}
                  <div className="hidden sm:block relative">
                    <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-2 h-10 sm:h-12 bg-background dark:bg-background border-input dark:border-input text-sm sm:text-base touch-manipulation",
                            !selectedDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP", { locale: id }) : "Pilih tanggal"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-auto p-0 bg-background border-border max-w-fit">
                        <DialogHeader className="px-6 pt-6 pb-2">
                          <DialogTitle>Pilih Tanggal</DialogTitle>
                        </DialogHeader>
                        <div className="px-6 pb-6">
                          <SimpleCalendar
                            selected={selectedDate}
                            onSelect={(date) => {
                              console.log("Date selected:", date)
                              setSelectedDate(date)
                              setReservationData({ ...reservationData, date: date, timeSlot: "" })
                              setIsCalendarOpen(false)
                              if (date) {
                                loadTimeSlots(date)
                              }
                            }}
                            disabled={(date) => {
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              if (date < today) return true
                              const dayOfWeek = date.getDay()
                              return dayOfWeek === 0 || dayOfWeek === 6
                            }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Mobile Calendar */}
                  <div className="sm:hidden">
                    <SimpleCalendar
                      selected={selectedDate}
                      onSelect={(date) => {
                        console.log("Mobile date selected:", date)
                        setSelectedDate(date)
                        setReservationData({ ...reservationData, date: date, timeSlot: "" })
                        if (date) {
                          loadTimeSlots(date)
                        }
                      }}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        if (date < today) return true
                        const dayOfWeek = date.getDay()
                        return dayOfWeek === 0 || dayOfWeek === 6
                      }}
                      className="mt-2"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    *Layanan tidak tersedia pada hari Sabtu dan Minggu
                  </p>
                  {selectedDate && selectedDate.getDay() === 5 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium">
                      *Hari Jumat: Layanan hanya tersedia jam 08:00 - 10:00
                    </p>
                  )}
                  {selectedDate && selectedDate.getDay() >= 1 && selectedDate.getDay() <= 4 && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                      *Istirahat siang: 12:00 - 14:00 (layanan tutup)
                    </p>
                  )}
                </div>

                {selectedDate && (
                  <div>
                    <Label className="text-sm sm:text-base font-medium text-foreground">Pilih Waktu</Label>
                    {isLoadingTimeSlots ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-muted-foreground">Memuat slot waktu...</div>
                      </div>
                    ) : timeSlots.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <div className="text-muted-foreground font-medium">Layanan tidak tersedia</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {selectedDate && selectedDate.getDay() === 0 && "Hari Minggu"}
                            {selectedDate && selectedDate.getDay() === 6 && "Hari Sabtu"}
                            {selectedDate && (selectedDate.getDay() !== 0 && selectedDate.getDay() !== 6) && "Tidak ada slot waktu tersedia"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                        {timeSlots.map((slot) => {
                        const isAvailable = slot.booked < slot.capacity
                        const isSelected = reservationData.timeSlot === slot.id
                        const isPassed = selectedDate ? isTimeSlotPassed(selectedDate, slot.id) : false
                        const isDisabled = !isAvailable || isPassed

                        return (
                          <Button
                            key={slot.id}
                            variant={isSelected ? "default" : "outline"}
                            disabled={isDisabled}
                            className={cn(
                              "h-auto p-3 sm:p-4 flex flex-col items-center transition-all duration-300 touch-manipulation",
                              isSelected && "bg-blue-600 hover:bg-blue-700 shadow-lg text-white",
                              isDisabled && "opacity-50 cursor-not-allowed",
                              isAvailable &&
                                !isSelected &&
                                !isPassed &&
                                "hover:border-blue-400 hover:shadow-md bg-background dark:bg-background border-input dark:border-input text-foreground",
                            )}
                            onClick={() => {
                              if (!isDisabled) {
                                setReservationData({ ...reservationData, timeSlot: slot.id })
                              }
                            }}
                            title={isPassed ? "Slot waktu ini sudah lewat" : !isAvailable ? "Slot sudah dipesan" : undefined}
                          >
                            <Clock className="w-4 h-4 mb-1" />
                            <span className="text-xs sm:text-sm font-medium">{slot.time}</span>
                            {isPassed && (
                              <span className="text-xs text-red-600 dark:text-red-400 mt-1">Sudah lewat</span>
                            )}
                            {!isPassed && !isAvailable && (
                              <span className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">Penuh</span>
                            )}
                          </Button>
                        )
                      })}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full sm:flex-1 h-10 sm:h-12 bg-transparent touch-manipulation"
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={handleDateTimeSelect}
                    disabled={!selectedDate || !reservationData.timeSlot}
                    className="w-full sm:flex-1 h-10 sm:h-12 bg-blue-600 hover:bg-blue-700 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lanjutkan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Step 3: Personal Information */}
        {step === 3 && (
          <ScrollReveal animation="fade-up" delay={200}>
            <Card className="shadow-lg border-0 bg-white dark:bg-card">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 p-4 sm:p-6">
                <CardTitle className="text-center text-xl sm:text-2xl text-blue-700 dark:text-blue-300">
                  Data Diri
                </CardTitle>
                <p className="text-center text-sm sm:text-base text-muted-foreground">
                  Lengkapi data diri Anda untuk reservasi
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-8 bg-white dark:bg-card">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm sm:text-base font-medium text-foreground">
                        Nama Lengkap *
                      </Label>
                      <Input
                        id="name"
                        required
                        value={reservationData.name}
                        onChange={(e) => setReservationData({ ...reservationData, name: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                        className="mt-2 h-10 sm:h-12 bg-background dark:bg-background border-input dark:border-input text-foreground text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm sm:text-base font-medium text-foreground">
                        Nomor HP *
                      </Label>
                      <Input
                        id="phone"
                        required
                        type="tel"
                        value={reservationData.phone}
                        onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                        className="mt-2 h-10 sm:h-12 bg-background dark:bg-background border-input dark:border-input text-foreground text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="nik" className="text-sm sm:text-base font-medium text-foreground">
                      NIK (Opsional)
                    </Label>
                    <Input
                      id="nik"
                      value={reservationData.nik}
                      onChange={(e) => setReservationData({ ...reservationData, nik: e.target.value })}
                      placeholder="Nomor Induk Kependudukan"
                      className="mt-2 h-10 sm:h-12 bg-background dark:bg-background border-input dark:border-input text-foreground text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="purpose" className="text-sm sm:text-base font-medium text-foreground">
                      Tujuan Kunjungan *
                    </Label>
                    <Textarea
                      id="purpose"
                      required
                      value={reservationData.purpose}
                      onChange={(e) => setReservationData({ ...reservationData, purpose: e.target.value })}
                      placeholder="Jelaskan secara singkat tujuan kunjungan Anda"
                      rows={3}
                      className="mt-2 bg-background dark:bg-background border-input dark:border-input text-foreground text-sm sm:text-base resize-none"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 p-4 sm:p-6 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-300 text-sm sm:text-base">
                      Ringkasan Reservasi:
                    </h4>
                    <div className="text-xs sm:text-sm space-y-2 text-foreground">
                      <p>
                        <span className="font-medium">Layanan:</span> {selectedService?.name}
                      </p>
                      <p>
                        <span className="font-medium">Tanggal:</span>{" "}
                        {selectedDate && format(selectedDate, "PPP", { locale: id })}
                      </p>
                      <p>
                        <span className="font-medium">Waktu:</span> {selectedTimeSlot?.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="w-full sm:flex-1 h-10 sm:h-12 bg-transparent touch-manipulation"
                    >
                      Kembali
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:flex-1 h-10 sm:h-12 bg-blue-600 hover:bg-blue-700 touch-manipulation"
                    >
                      Buat Reservasi
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Step 4: Ticket Display with Print Option */}
        {step === 4 && (
          <ScrollReveal animation="fade-up" delay={200}>
            <Card className="shadow-lg border-0 bg-white dark:bg-card">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 print:hidden p-4 sm:p-6">
                <CardTitle className="text-center text-xl sm:text-2xl text-green-600 dark:text-green-400">
                  Tiket Reservasi Anda
                </CardTitle>
                <p className="text-center text-sm sm:text-base text-muted-foreground">
                  Simpan atau cetak tiket ini sebagai bukti reservasi
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-8 bg-white dark:bg-card">
                <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 sm:p-8 rounded-lg print:border-black print:shadow-none shadow-inner mb-4 sm:mb-6">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium print:text-black">
                      DINAS PENDIDIKAN KOTA BANJARMASIN
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400 print:text-black">
                      TIKET RESERVASI ONLINE
                    </div>

                    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 sm:py-6 print:border-black">
                      <div className="text-3xl sm:text-5xl font-bold text-blue-600 mb-2 sm:mb-3 print:text-black break-all">
                        {queueNumber}
                      </div>
                      <div className="text-base sm:text-xl font-medium text-blue-700 dark:text-blue-300 print:text-black">
                        {selectedService?.name}
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between py-1 sm:py-2 border-b border-gray-100 dark:border-gray-800 print:border-black">
                        <span className="font-medium print:text-black">Nama:</span>
                        <span className="print:text-black text-right break-words max-w-[60%]">
                          {reservationData.name}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 sm:py-2 border-b border-gray-100 dark:border-gray-800 print:border-black">
                        <span className="font-medium print:text-black">Tanggal:</span>
                        <span className="print:text-black text-right">
                          {reservationData.date && format(reservationData.date, "PPP", { locale: id })}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 sm:py-2 border-b border-gray-100 dark:border-gray-800 print:border-black">
                        <span className="font-medium print:text-black">Waktu:</span>
                        <span className="print:text-black text-right">{selectedTimeSlot?.time}</span>
                      </div>
                      <div className="flex justify-between py-1 sm:py-2 border-b border-gray-100 dark:border-gray-800 print:border-black">
                        <span className="font-medium print:text-black">Est. Panggilan:</span>
                        <span className="font-bold text-blue-600 print:text-black text-right">{estimatedTime}</span>
                      </div>
                      <div className="flex justify-between py-1 sm:py-2">
                        <span className="font-medium print:text-black">No. HP:</span>
                        <span className="print:text-black text-right">{reservationData.phone}</span>
                      </div>
                      <div className="flex justify-between py-1 sm:py-2">
                        <span className="font-medium print:text-black">Tujuan:</span>
                        <span className="print:text-black text-right break-words max-w-[60%]">{reservationData.purpose}</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground border-t pt-3 sm:pt-4 space-y-1 print:text-black">
                      <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                        <strong>Penting:</strong> Simpan atau cetak tiket ini sebagai bukti reservasi Anda.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 print:hidden">
                  <Button
                    onClick={handlePrint}
                    disabled={isGeneratingPDF}
                    className="w-full sm:flex-1 h-10 sm:h-12 bg-green-600 hover:bg-green-700 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    <Printer className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isGeneratingPDF ? "Membuat PDF..." : "Unduh Tiket"}
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="w-full sm:flex-1 h-10 sm:h-12 border-blue-200 hover:border-blue-400 bg-transparent touch-manipulation"
                    size="lg"
                  >
                    Buat Reservasi Baru
                  </Button>
                </div>

                <div className="text-xs sm:text-sm text-muted-foreground print:hidden bg-blue-50 dark:bg-blue-950/20 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4 border border-blue-200/50 dark:border-blue-800/50">
                  <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                    <strong>Penting:</strong> Simpan atau cetak tiket ini sebagai bukti reservasi Anda.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}
