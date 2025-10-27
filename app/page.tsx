"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  School,
  Users,
  GraduationCap,
  CheckCircle,
  Instagram,
  Facebook,
  Youtube,
  Menu,
  ArrowUp,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useStaggeredScrollAnimation } from "@/hooks/use-scroll-animation"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteHeader } from "@/components/site-header"
import { ScrollingNewsCarousel } from "@/components/scrolling-news-carousel"
import { ScrollingAgendaCarousel } from "@/components/scrolling-agenda-carousel"

export default function Component() {
  const [isVisible, setIsVisible] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Staggered animations for stats cards
  const [setStatsRef, statsVisible] = useStaggeredScrollAnimation(4, { delay: 150, triggerOnce: true })

  // Staggered animations for news cards
  const [setNewsRef, newsVisible] = useStaggeredScrollAnimation(3, { delay: 200, triggerOnce: true })

  const [agendas, setAgendas] = useState<any[]>([])
  const [agendaLoading, setAgendaLoading] = useState(true)

  // Fetch agendas from API
  useEffect(() => {
    const fetchAgendas = async () => {
      try {
        const response = await fetch('/api/agendas')
        const result = await response.json()
        if (result.success) {
          setAgendas(result.data)
        }
      } catch (error) {
        console.error('Error fetching agendas:', error)
      } finally {
        setAgendaLoading(false)
      }
    }

    fetchAgendas()
  }, [])

  useEffect(() => {
    // Trigger initial animations
    setIsVisible(true)

    // Handle scroll events
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const statsData = [
    { icon: School, number: "127", label: "PAUD", chartColor: "chart-1", detail: "Pendidikan Anak Usia Dini" },
    {
      icon: GraduationCap,
      number: "112",
      label: "SD/MI",
      chartColor: "chart-2",
      detail: "Sekolah Dasar & Madrasah Ibtidaiyah",
    },
    {
      icon: Users,
      number: "75",
      label: "SMP/MTs",
      chartColor: "chart-3",
      detail: "Sekolah Menengah Pertama & Madrasah Tsanawiyah",
    },
    {
      icon: CheckCircle,
      number: "92%",
      label: "Akreditasi A/B",
      chartColor: "chart-5",
      detail: "Persentase Akreditasi Baik",
    },
  ]

  const detailedStats = [
    {
      category: "PAUD (Pendidikan Anak Usia Dini)",
      data: [
        { level: "TK Negeri", count: 15, students: "1,200" },
        { level: "TK Swasta", count: 89, students: "8,900" },
        { level: "KB/TPA", count: 23, students: "1,150" },
      ],
    },
    {
      category: "Pendidikan Dasar (SD/MI)",
      data: [
        { level: "SD Negeri", count: 89, students: "18,450" },
        { level: "SD Swasta", count: 8, students: "1,200" },
        { level: "MI", count: 15, students: "2,100" },
      ],
    },
    {
      category: "Pendidikan Menengah Pertama (SMP/MTs)",
      data: [
        { level: "SMP Negeri", count: 45, students: "12,800" },
        { level: "SMP Swasta", count: 18, students: "2,400" },
        { level: "MTs", count: 12, students: "1,800" },
      ],
    },
  ]


  const AnimatedNumber = ({ value, isVisible }: { value: string; isVisible: boolean }) => {
    const [displayNumber, setDisplayNumber] = useState(0)
    const targetNumber = Number.parseInt(value.replace(/,/g, ""), 10)

    useEffect(() => {
      if (isVisible) {
        const start = 0
        const duration = 1000 
        let startTime: number | null = null

        const animateCount = (currentTime: number) => {
          if (!startTime) startTime = currentTime
          const progress = (currentTime - startTime) / duration
          const current = Math.min(progress, 1) * targetNumber
          setDisplayNumber(Math.floor(current))

          if (progress < 1) {
            requestAnimationFrame(animateCount)
          } else {
            setDisplayNumber(targetNumber) 
          }
        }

        requestAnimationFrame(animateCount)
      } else {
        setDisplayNumber(0) 
      }
    }, [isVisible, targetNumber])

    return <>{value.includes("%") ? `${displayNumber}%` : displayNumber.toLocaleString()}</>
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Image and Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/dinas-pendidikan-banjarmasin-real.jpeg"
            alt="Kantor Dinas Pendidikan Kota Banjarmasin"
            fill
            className="object-cover object-center animate-bg-pan"
            priority
          />
          <div className="absolute inset-0 bg-blue-900 opacity-60 pointer-events-none"></div> {/* Dark overlay for text readability */}
        </div>

        {/* Background Animation - More colorful and dynamic "pernak-pernik" */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <ScrollReveal animation="scale" delay={0}>
            <div className="absolute top-10 left-10 w-24 h-24 bg-blue-400 rounded-full animate-float-strong blur-sm"></div>
          </ScrollReveal>
          <ScrollReveal animation="scale" delay={200}>
            <div className="absolute top-32 right-20 w-20 h-20 bg-blue-500 rounded-full animate-float-delayed-strong blur-sm"></div>
          </ScrollReveal>
          <ScrollReveal animation="scale" delay={400}>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-600 rounded-full animate-float-strong blur-sm"></div>
          </ScrollReveal>
          <ScrollReveal animation="scale" delay={600}>
            <div className="absolute bottom-10 right-1/3 w-12 h-12 bg-blue-700 rounded-full animate-float-delayed-strong blur-sm"></div>
          </ScrollReveal>

          {/* Additional "pernak-pernik" */}
          <ScrollReveal animation="scale" delay={100}>
            <div className="absolute top-1/2 left-5 w-16 h-16 bg-cyan-400 rounded-lg transform rotate-45 animate-float-strong blur-sm"></div>
          </ScrollReveal>
          <ScrollReveal animation="scale" delay={300}>
            <div className="absolute bottom-5 right-10 w-20 h-20 bg-purple-400 rounded-full animate-float-delayed-strong blur-sm"></div>
          </ScrollReveal>
          <ScrollReveal animation="scale" delay={500}>
            <div className="absolute top-1/4 right-1/4 w-10 h-10 bg-blue-300 rounded-full animate-float-strong blur-sm"></div>
          </ScrollReveal>
          <ScrollReveal animation="scale" delay={700}>
            <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-indigo-400 rounded-lg transform -rotate-30 animate-float-delayed-strong blur-sm"></div>
          </ScrollReveal>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal animation="fade-up" delay={0} duration={800}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Selamat Datang di Portal Resmi
              <br />
              <span className="text-blue-300 animate-gradient-text-vibrant">Dinas Pendidikan Kota Banjarmasin</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300} duration={800}>
            <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Bersama membangun pendidikan berkualitas untuk generasi emas Banjarmasin. Kami berkomitmen menciptakan
              ekosistem pendidikan yang inovatif, inklusif, dan berdaya saing tinggi untuk masa depan yang lebih cerah.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={600} duration={800}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reservasi">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg border-0 font-semibold"
                >
                  Reservasi Online
                </Button>
              </Link>
              <Link href="/tentang-simdik">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg border-0 font-semibold"
                >
                  Tentang SIMDIK
                </Button>
              </Link>
              <Link href="/direktori-sekolah">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 bg-slate-800/80 backdrop-blur-sm text-white hover:bg-slate-700/90 hover:text-white hover:border-slate-200 px-8 py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg font-semibold"
                >
                  Direktori Sekolah
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-card shadow-sm border-y border-border relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal animation="fade-up" delay={0} duration={800}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Data Pendidikan Kota Banjarmasin</h2>
              <p className="text-muted-foreground text-lg">
                Data terkini berdasarkan Dapodik Kemendikbudristek per Semester Genap 2024/2025
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {statsData.map((stat, index) => {
              const Icon = stat.icon
              const chartColorClass = `bg-${stat.chartColor}/10 text-${stat.chartColor}`
              return (
                <div
                  key={index}
                  ref={setStatsRef(index)}
                  className={`transform transition-all duration-700 ease-out ${
                    statsVisible[index] ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                  }`}
                >
                  <Card className="text-center p-6 h-full hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer border-2 border-transparent hover:border-blue-400">
                    <CardContent className="pt-6 h-full flex flex-col justify-center">
                      <div
                        className={`w-16 h-16 ${chartColorClass} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-md`}
                      >
                        <Icon className={`w-8 h-8 ${chartColorClass}`} />
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-2 transition-all duration-300 group-hover:text-blue-600">
                        <AnimatedNumber value={stat.number} isVisible={statsVisible[index]} />
                      </div>
                      <div className="text-muted-foreground font-medium">{stat.label}</div>
                      <div className="text-xs text-muted-foreground/70 mt-1">{stat.detail}</div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          <ScrollReveal animation="fade-up" delay={400} duration={800}>
            <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/80 dark:from-blue-950/40 dark:to-blue-900/40 rounded-xl p-8 mb-8 border border-blue-200/50 dark:border-blue-800/50">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                Rincian Data Sekolah per Jenjang Pendidikan
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {detailedStats.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="bg-card/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border/50 hover:shadow-xl hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300"
                  >
                    <h4 className="text-lg font-semibold text-foreground mb-4 text-center border-b border-border pb-2">
                      {category.category}
                    </h4>
                    <div className="space-y-3">
                      {category.data.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between items-center p-3 bg-muted/60 dark:bg-muted/40 rounded-lg hover:bg-muted/80 dark:hover:bg-muted/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-md border border-transparent hover:border-blue-200/50 dark:hover:border-blue-700/50"
                        >
                          <div>
                            <div className="font-medium text-foreground">{item.level}</div>
                            <div className="text-sm text-muted-foreground">{item.students} siswa</div>
                          </div>
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={600} duration={800}>
            <div className="text-center bg-gradient-to-r from-blue-50/80 to-blue-100/80 dark:from-blue-950/40 dark:to-blue-900/40 rounded-lg p-6 border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 max-w-2xl">
                  <div className="text-center p-4 bg-card/60 dark:bg-card/40 rounded-lg hover:bg-card/80 dark:hover:bg-card/60 transition-all duration-300 hover:scale-105 hover:shadow-md border border-transparent hover:border-blue-200/50 dark:hover:border-blue-700/50">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">314</div>
                    <div className="text-sm text-muted-foreground">Total Sekolah</div>
                  </div>
                  <div className="text-center p-4 bg-card/60 dark:bg-card/40 rounded-lg hover:bg-card/80 dark:hover:bg-card/60 transition-all duration-300 hover:scale-105 hover:shadow-md border border-transparent hover:border-green-200/50 dark:hover:border-green-700/50">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">2,847</div>
                    <div className="text-sm text-muted-foreground">Total Guru</div>
                  </div>
                  <div className="text-center p-4 bg-card/60 dark:bg-card/40 rounded-lg hover:bg-card/80 dark:hover:bg-card/60 transition-all duration-300 hover:scale-105 hover:shadow-md border border-transparent hover:border-purple-200/50 dark:hover:border-purple-700/50">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50,050</div>
                    <div className="text-sm text-muted-foreground">Total Siswa</div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground border-t border-border/50 pt-4">
                <p className="mb-2">
                  <strong>Sumber Data:</strong> Dapodik Kemendikbudristek, Data Pokok Pendidikan Kota Banjarmasin
                </p>
                <p>
                  <strong>Periode:</strong> Semester Genap Tahun Pelajaran 2024/2025 |
                  <strong> Terakhir Diperbarui:</strong> Januari 2025
                </p>
                <p className="mt-2 text-blue-600 dark:text-blue-400 font-medium">
                  *Data mencakup PAUD, SD/MI, dan SMP/MTs sesuai kewenangan Dinas Pendidikan Kota Banjarmasin
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* News Section */}
      <section id="berita" className="py-16 bg-card shadow-sm border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal animation="fade-up" delay={0} duration={800}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Berita Terkini</h2>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200} duration={800}>
            <ScrollingNewsCarousel />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={600} duration={800}>
            <div className="text-center mt-12">
              <Link href="/berita">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Lihat Semua Berita
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Agenda Section */}
      <section id="agenda" className="py-16 bg-card shadow-sm border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal animation="fade-up" delay={0} duration={800}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Agenda Mendatang</h2>
          </ScrollReveal>
          {agendaLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : agendas.length > 0 ? (
            <ScrollReveal animation="fade-up" delay={200} duration={800}>
              <ScrollingAgendaCarousel agendas={agendas} />
            </ScrollReveal>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada agenda tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="py-16 bg-card shadow-sm border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal animation="fade-up" delay={0} duration={800}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Hubungi Kami</h2>
          </ScrollReveal>
          {/* Contact Info */}
          <ScrollReveal animation="fade-up" delay={200} duration={800}>
            <div className="max-w-4xl mx-auto space-y-6 text-center">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan, saran, atau membutuhkan bantuan. Tim
                kami siap melayani Anda.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center space-y-2 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="w-8 h-8 text-blue-600" />
                  <p className="text-foreground text-center font-medium">Alamat</p>
                  <p className="text-muted-foreground text-sm text-center">
                    Jl. Kapten Piere Tendean No.29, RT.40, Gadang, Kec. Banjarmasin Tengah, Kota Banjarmasin, Kalimantan
                    Selatan 70231
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 bg-muted/50 rounded-lg">
                  <Phone className="w-8 h-8 text-blue-600" />
                  <p className="text-foreground font-medium">Telepon</p>
                  <p className="text-muted-foreground">(0511) 3252732</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 bg-muted/50 rounded-lg">
                  <Mail className="w-8 h-8 text-blue-600" />
                  <p className="text-foreground font-medium">Email</p>
                  <p className="text-muted-foreground">disdik@banjarmasinkota.go.id</p>
                </div>
              </div>
              <div className="w-full h-64 bg-muted rounded-lg overflow-hidden relative border-2 border-border hover:border-blue-400 transition-all duration-300">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.0234567890123!2d114.5901234567890!3d-3.3234567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2de423456789abcd%3A0x123456789abcdef0!2sJl.%20Kapten%20Piere%20Tendean%20No.29%2C%20RT.40%2C%20Gadang%2C%20Kec.%20Banjarmasin%20Tengah%2C%20Kota%20Banjarmasin%2C%20Kalimantan%20Selatan%2070231!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Dinas Pendidikan Kota Banjarmasin"
                  className="rounded-lg"
                ></iframe>
                <a
                  href="https://maps.app.goo.gl/pizxzTH98tPczi9k8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-transparent hover:bg-blue-600/10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
                >
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transform scale-95 hover:scale-100 transition-all duration-300">
                    <MapPin className="w-5 h-5 inline mr-2" />
                    Buka di Google Maps
                  </div>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Logo and Mission */}
            <ScrollReveal animation="fade-up" delay={0} duration={800}>
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12">
                    <School className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">SIMDIK</span>
                </div>
                <p className="text-blue-200 leading-relaxed">
                  Membangun masa depan pendidikan Banjarmasin melalui inovasi, kolaborasi, dan komitmen untuk
                  mencerdaskan generasi bangsa.
                </p>
              </div>
            </ScrollReveal>

            {/* Column 2: Quick Links */}
            <ScrollReveal animation="fade-up" delay={200} duration={800}>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Tautan Cepat</h3>
                <ul className="space-y-2">
                  {["Beranda", "Reservasi", "Tentang SIMDIK", "Direktori Sekolah", "Berita", "Agenda", "Kontak"].map(
                    (item, index) => (
                      <li key={index}>
                        <Link
                          href={
                            item === "Reservasi"
                              ? "/reservasi"
                              : item === "Direktori Sekolah"
                                ? "/direktori-sekolah"
                                : item === "Tentang SIMDIK"
                                  ? "/tentang-simdik"
                                  : item === "Berita"
                                    ? "#berita"
                                    : item === "Agenda"
                                      ? "#agenda"
                                      : item === "Kontak"
                                        ? "#kontak"
                                        : "#"
                          }
                          className="text-blue-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                        >
                          {item}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </ScrollReveal>

            {/* Column 3: Contact Info */}
            <ScrollReveal animation="fade-up" delay={400} duration={800}>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Kontak Kami</h3>
                <div className="space-y-3 text-blue-200">
                  <p className="transition-all duration-300 hover:text-white">
                    Jl. Kapten Piere Tendean No.29, RT.40
                    <br />
                    Gadang, Kec. Banjarmasin Tengah
                    <br />
                    Kota Banjarmasin, Kalimantan Selatan 70231
                  </p>
                  <p className="transition-all duration-300 hover:text-white">Telepon: (0511) 3252732</p>
                  <p className="transition-all duration-300 hover:text-white">Email: disdik@banjarmasinkota.go.id</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Column 4: Social Media */}
            <ScrollReveal animation="fade-up" delay={600} duration={800}>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Media Sosial</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: Instagram, color: "hover:bg-pink-600" },
                    { icon: Facebook, color: "hover:bg-blue-600" },
                    { icon: Youtube, color: "hover:bg-red-600" },
                  ].map((social, index) => {
                    const Icon = social.icon
                    return (
                      <Link
                        key={index}
                        href="#"
                        className={`w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center ${social.color} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1`}
                      >
                        <Icon className="w-5 h-5" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Copyright */}
          <ScrollReveal animation="fade-up" delay={800} duration={800}>
            <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
              <p>&copy; {new Date().getFullYear()} Dinas Pendidikan Kota Banjarmasin. Semua hak dilindungi.</p>
            </div>
          </ScrollReveal>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-110 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-6 h-6 mx-auto" />
      </button>
    </div>
  )
}
