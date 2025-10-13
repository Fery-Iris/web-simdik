"use client"

import type React from "react"

import { useState } from "react"
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
import { generateTicketPDF, type ReservationTicketData } from "@/lib/pdf-generator"

// Static data for services and time slots
const services = [
  {
    id: "ptk",
    name: "PTK (Pendidik dan Tenaga Kependidikan)",
    icon: Users,
    description: "Layanan untuk guru, kepala sekolah, dan tenaga kependidikan",
    color: "bg-blue-500",
  },
  {
    id: "sd",
    name: "SD Umum",
    icon: School,
    description: "Layanan untuk Sekolah Dasar",
    color: "bg-green-500",
  },
  {
    id: "smp",
    name: "SMP Umum",
    icon: GraduationCap,
    description: "Layanan untuk Sekolah Menengah Pertama",
    color: "bg-purple-500",
  },
  {
    id: "paud",
    name: "PAUD",
    icon: Baby,
    description: "Layanan untuk Pendidikan Anak Usia Dini",
    color: "bg-orange-500",
  },
]

const getTimeSlots = (selectedDate: Date | undefined) => {
  if (!selectedDate) return []

  const dayOfWeek = selectedDate.getDay()

  // Friday (5) - only 8 AM to 10 AM
  if (dayOfWeek === 5) {
    return [
      { id: "08:00", time: "08:00 - 09:00", capacity: 10, booked: 3 },
      { id: "09:00", time: "09:00 - 10:00", capacity: 10, booked: 7 },
    ]
  }

  // Normal days (Monday-Thursday) - exclude 12-14 (lunch break), include 14-15
  return [
    { id: "08:00", time: "08:00 - 09:00", capacity: 10, booked: 3 },
    { id: "09:00", time: "09:00 - 10:00", capacity: 10, booked: 7 },
    { id: "10:00", time: "10:00 - 11:00", capacity: 10, booked: 2 },
    { id: "11:00", time: "11:00 - 12:00", capacity: 10, booked: 5 },
    { id: "14:00", time: "14:00 - 15:00", capacity: 10, booked: 4 },
  ]
}

interface ReservationData {
  service: string
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

  const handleServiceSelect = (serviceId: string) => {
    setReservationData({ ...reservationData, service: serviceId })
    setStep(2)
  }

  const handleDateTimeSelect = () => {
    if (selectedDate && reservationData.timeSlot) {
      setReservationData({ ...reservationData, date: selectedDate })
      setStep(3)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate queue number (simple implementation)
    const queueNum = `${reservationData.service.toUpperCase()}-${Date.now().toString().slice(-6)}`
    const estimatedCallTime = new Date()
    estimatedCallTime.setHours(estimatedCallTime.getHours() + 2)

    setQueueNumber(queueNum)
    setEstimatedTime(format(estimatedCallTime, "HH:mm", { locale: id }))
    setStep(4)
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

  const selectedService = services.find((s) => s.id === reservationData.service)
  const timeSlots = getTimeSlots(selectedDate)
  const selectedTimeSlot = timeSlots.find((t) => t.id === reservationData.timeSlot)

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
            <Card className="shadow-lg border-0 bg-card dark:bg-card">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 p-4 sm:p-6">
                <CardTitle className="text-center text-xl sm:text-2xl text-blue-700 dark:text-blue-300">
                  Pilih Layanan
                </CardTitle>
                <p className="text-center text-sm sm:text-base text-muted-foreground">
                  Silakan pilih layanan yang Anda butuhkan
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-8 bg-card dark:bg-card">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {services.map((service) => {
                    const Icon = service.icon
                    return (
                      <Card
                        key={service.id}
                        className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-400 group bg-card dark:bg-card touch-manipulation"
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <CardContent className="p-4 sm:p-6 text-center bg-card dark:bg-card">
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
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Step 2: Date and Time Selection */}
        {step === 2 && (
          <ScrollReveal animation="fade-up" delay={200}>
            <Card className="shadow-lg border-0 bg-card dark:bg-card">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {timeSlots.map((slot) => {
                        const isAvailable = slot.booked < slot.capacity
                        const isSelected = reservationData.timeSlot === slot.id

                        return (
                          <Button
                            key={slot.id}
                            variant={isSelected ? "default" : "outline"}
                            disabled={!isAvailable}
                            className={cn(
                              "h-auto p-3 sm:p-4 flex flex-col items-center transition-all duration-300 touch-manipulation",
                              isSelected && "bg-blue-600 hover:bg-blue-700 shadow-lg text-white",
                              !isAvailable && "opacity-50 cursor-not-allowed",
                              isAvailable &&
                                !isSelected &&
                                "hover:border-blue-400 hover:shadow-md bg-background dark:bg-background border-input dark:border-input text-foreground",
                            )}
                            onClick={() => setReservationData({ ...reservationData, timeSlot: slot.id })}
                          >
                            <Clock className="w-4 h-4 mb-1" />
                            <span className="text-xs sm:text-sm font-medium">{slot.time}</span>
                          </Button>
                        )
                      })}
                    </div>
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
            <Card className="shadow-lg border-0 bg-card dark:bg-card">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 p-4 sm:p-6">
                <CardTitle className="text-center text-xl sm:text-2xl text-blue-700 dark:text-blue-300">
                  Data Diri
                </CardTitle>
                <p className="text-center text-sm sm:text-base text-muted-foreground">
                  Lengkapi data diri Anda untuk reservasi
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-8 bg-card dark:bg-card">
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
            <Card className="shadow-lg border-0 bg-card dark:bg-card">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 print:hidden p-4 sm:p-6">
                <CardTitle className="text-center text-xl sm:text-2xl text-green-600 dark:text-green-400">
                  Tiket Reservasi Anda
                </CardTitle>
                <p className="text-center text-sm sm:text-base text-muted-foreground">
                  Simpan atau cetak tiket ini sebagai bukti reservasi
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-8 bg-card dark:bg-card">
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
