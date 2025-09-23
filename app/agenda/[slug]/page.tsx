"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  School,
  Menu,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

// Sample agenda data dengan slug
const agendaData = {
  "workshop-kurikulum-merdeka": {
    id: 1,
    title: "Workshop Kurikulum Merdeka",
    slug: "workshop-kurikulum-merdeka",
    date: "15 Agustus 2025",
    time: "08:00 - 16:00 WITA",
    location: "Aula Dinas Pendidikan",
    address: "Jl. Sultan Adam No. 18, Banjarmasin",
    description: "Workshop untuk guru-guru SD dan SMP mengenai implementasi Kurikulum Merdeka.",
    fullDescription: `Workshop Kurikulum Merdeka ini merupakan program pelatihan intensif yang dirancang khusus untuk membantu guru-guru SD dan SMP dalam memahami dan mengimplementasikan Kurikulum Merdeka secara efektif di kelas mereka.

Dalam workshop ini, peserta akan mendapatkan pemahaman mendalam tentang filosofi dan prinsip-prinsip dasar Kurikulum Merdeka, serta bagaimana menerapkannya dalam pembelajaran sehari-hari. Materi yang akan dibahas meliputi:

1. Pengenalan Kurikulum Merdeka dan perbedaannya dengan kurikulum sebelumnya
2. Profil Pelajar Pancasila sebagai tujuan utama pendidikan
3. Pembelajaran berbasis proyek (Project Based Learning)
4. Asesmen formatif dan sumatif dalam Kurikulum Merdeka
5. Pengembangan modul ajar yang sesuai dengan karakteristik siswa
6. Strategi diferensiasi pembelajaran

Workshop akan dipandu oleh narasumber ahli dari Kemendikbudristek dan praktisi pendidikan yang telah berpengalaman dalam implementasi Kurikulum Merdeka. Setiap peserta akan mendapatkan materi lengkap, sertifikat, dan template modul ajar yang dapat langsung digunakan.

Peserta juga akan terlibat dalam sesi praktik langsung pembuatan modul ajar dan simulasi pembelajaran menggunakan pendekatan Kurikulum Merdeka. Diharapkan setelah mengikuti workshop ini, guru-guru dapat lebih percaya diri dalam menerapkan Kurikulum Merdeka di sekolah masing-masing.`,
    category: "Workshop",
    organizer: "Dinas Pendidikan Kota Banjarmasin",
    capacity: "100 peserta",
    registration: "Gratis (wajib daftar)",
    contact: "disdik@banjarmasinkota.go.id",
    image: "/placeholder.svg?height=400&width=800&text=Workshop+Kurikulum+Merdeka",
    status: "Pendaftaran Dibuka",
  },
  "lomba-inovasi-pembelajaran": {
    id: 2,
    title: "Lomba Inovasi Pembelajaran",
    slug: "lomba-inovasi-pembelajaran",
    date: "20 September 2025",
    time: "09:00 - 15:00 WITA",
    location: "Online",
    address: "Platform Zoom Meeting",
    description: "Kompetisi bagi tenaga pendidik untuk mengembangkan metode pembelajaran inovatif.",
    fullDescription: `Lomba Inovasi Pembelajaran merupakan kompetisi tahunan yang diselenggarakan oleh Dinas Pendidikan Kota Banjarmasin untuk mendorong kreativitas dan inovasi guru dalam mengembangkan metode pembelajaran yang lebih efektif dan menyenangkan.

Kompetisi ini terbuka untuk semua guru dari jenjang SD, SMP, dan SMA/SMK di Kota Banjarmasin. Peserta dapat berpartisipasi secara individu atau tim (maksimal 3 orang).

Kategori Lomba:
1. Inovasi Pembelajaran SD
2. Inovasi Pembelajaran SMP  
3. Inovasi Pembelajaran SMA/SMK
4. Pembelajaran Berbasis Teknologi
5. Pembelajaran Karakter dan Nilai

Kriteria Penilaian:
- Kreativitas dan originalitas (30%)
- Efektivitas metode pembelajaran (25%)
- Kemudahan implementasi (20%)
- Dampak terhadap siswa (15%)
- Presentasi dan komunikasi (10%)

Hadiah yang akan diberikan:
- Juara 1: Rp 5.000.000 + Sertifikat + Piala
- Juara 2: Rp 3.000.000 + Sertifikat + Piala  
- Juara 3: Rp 2.000.000 + Sertifikat + Piala
- Juara Harapan: Rp 1.000.000 + Sertifikat

Seluruh peserta akan mendapatkan sertifikat partisipasi yang dapat digunakan untuk pengembangan karir. Karya-karya terbaik akan dipublikasikan dan dijadikan best practice untuk sekolah-sekolah lain.

Timeline:
- Pendaftaran: 1-15 September 2025
- Pengumpulan karya: 16-19 September 2025
- Presentasi dan penjurian: 20 September 2025
- Pengumuman pemenang: 25 September 2025`,
    category: "Kompetisi",
    organizer: "Dinas Pendidikan Kota Banjarmasin",
    capacity: "200 peserta",
    registration: "Gratis",
    contact: "lomba@banjarmasinkota.go.id",
    image: "/placeholder.svg?height=400&width=800&text=Lomba+Inovasi+Pembelajaran",
    status: "Segera Dibuka",
  },
  "seminar-nasional-pendidikan": {
    id: 3,
    title: "Seminar Nasional Pendidikan",
    slug: "seminar-nasional-pendidikan",
    date: "5 Oktober 2025",
    time: "08:00 - 17:00 WITA",
    location: "Hotel Banjarmasin",
    address: "Jl. Lambung Mangkurat No. 32, Banjarmasin",
    description: "Seminar dengan pembicara nasional membahas tantangan dan peluang pendidikan di era digital.",
    fullDescription: `Seminar Nasional Pendidikan 2025 dengan tema "Transformasi Pendidikan di Era Digital: Tantangan dan Peluang" merupakan acara bergengsi yang menghadirkan para ahli pendidikan terkemuka dari seluruh Indonesia.

Seminar ini bertujuan untuk memberikan wawasan dan strategi terbaru dalam menghadapi perubahan paradigma pendidikan di era digital, serta membahas berbagai inovasi dan best practices yang dapat diterapkan di sekolah-sekolah.

Narasumber Utama:
1. Prof. Dr. Anies Baswedan, M.P.P. - Mantan Menteri Pendidikan dan Kebudayaan
2. Prof. Dr. Arief Rachman, M.Pd. - Pakar Pendidikan Nasional
3. Dr. Indira Chandra - CEO Zenius Education
4. Prof. Dr. Fasli Jalal, Ph.D. - Ahli Kebijakan Pendidikan

Agenda Seminar:
08:00-09:00 : Registrasi dan Coffee Break
09:00-09:30 : Pembukaan dan Sambutan
09:30-10:30 : Keynote Speech: "Visi Pendidikan Indonesia 2045"
10:30-10:45 : Coffee Break
10:45-12:00 : Panel Diskusi: "Digitalisasi Pembelajaran"
12:00-13:00 : Ishoma
13:00-14:15 : Workshop Paralel (3 sesi)
14:15-14:30 : Coffee Break
14:30-15:45 : Panel Diskusi: "Pendidikan Karakter di Era Digital"
15:45-16:30 : Tanya Jawab dan Diskusi
16:30-17:00 : Penutupan dan Foto Bersama

Fasilitas yang akan diperoleh:
- Materi seminar lengkap
- Sertifikat 32 JP
- Lunch dan 2x coffee break
- Goodie bag
- Akses recording seminar
- Networking session

Target peserta adalah kepala sekolah, guru, dosen, mahasiswa kependidikan, dan praktisi pendidikan dari seluruh Indonesia. Seminar ini juga akan disiarkan secara live streaming untuk memperluas jangkauan peserta.`,
    category: "Seminar",
    organizer: "Dinas Pendidikan Kota Banjarmasin",
    capacity: "500 peserta",
    registration: "Rp 150.000 (Early Bird: Rp 100.000)",
    contact: "seminar@banjarmasinkota.go.id",
    image: "/placeholder.svg?height=400&width=800&text=Seminar+Nasional+Pendidikan",
    status: "Early Bird",
  },
}

interface AgendaDetailPageProps {
  params: {
    slug: string
  }
}

export default function AgendaDetailPage({ params }: AgendaDetailPageProps) {
  const agenda = agendaData[params.slug as keyof typeof agendaData]

  if (!agenda) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Agenda Tidak Ditemukan</h1>
          <Link href="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Workshop: "bg-chart-1/10 text-chart-1",
      Kompetisi: "bg-chart-2/10 text-chart-2",
      Seminar: "bg-chart-3/10 text-chart-3",
      Pelatihan: "bg-chart-4/10 text-chart-4",
      Rapat: "bg-chart-5/10 text-chart-5",
    }
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      "Pendaftaran Dibuka": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      "Segera Dibuka": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      "Early Bird": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      Ditutup: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    }
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Consistent with main page */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                <School className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground transition-colors duration-300 hover:text-primary">
                SIMDIK Kota Banjarmasin
              </span>
            </Link>

            {/* Navigation - Simplified for sub-page */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary font-medium transition-all duration-300 relative group"
              >
                Beranda
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/tentang-simdik"
                className="text-muted-foreground hover:text-primary font-medium transition-all duration-300 relative group"
              >
                Tentang SIMDIK
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/direktori-sekolah"
                className="text-muted-foreground hover:text-primary font-medium transition-all duration-300 relative group"
              >
                Direktori Sekolah
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Mobile Menu Button and Theme Toggle */}
            <div className="flex items-center space-x-2">
              <button className="md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-accent">
                <Menu className="w-6 h-6 text-foreground" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <Badge className={getCategoryColor(agenda.category)}>{agenda.category}</Badge>
              <Badge className={getStatusColor(agenda.status)}>{agenda.status}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">{agenda.title}</h1>

            {/* Share Buttons */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-medium text-foreground">Bagikan:</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={agenda.image || "/placeholder.svg"}
                  alt={agenda.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Event Description */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Tentang Acara</h2>
                  <div className="prose prose-lg max-w-none text-foreground">
                    {agenda.fullDescription.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Informasi Acara</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Tanggal</p>
                        <p className="text-sm text-muted-foreground">{agenda.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Waktu</p>
                        <p className="text-sm text-muted-foreground">{agenda.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Lokasi</p>
                        <p className="text-sm text-muted-foreground">{agenda.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">{agenda.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Kapasitas</p>
                        <p className="text-sm text-muted-foreground">{agenda.capacity}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <School className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Penyelenggara</p>
                        <p className="text-sm text-muted-foreground">{agenda.organizer}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Registration Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Pendaftaran</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-foreground mb-1">Biaya</p>
                      <p className="text-lg font-bold text-blue-600">{agenda.registration}</p>
                    </div>

                    <div>
                      <p className="font-medium text-foreground mb-1">Kontak</p>
                      <p className="text-sm text-muted-foreground">{agenda.contact}</p>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Daftar Sekarang</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Lokasi</h3>
                  <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Peta Lokasi</p>
                        <p className="text-xs mt-1">{agenda.address}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
