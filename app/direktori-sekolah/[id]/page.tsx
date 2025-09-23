"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Users,
  GraduationCap,
  Calendar,
  Award,
  School,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

// Sample school data - in real app this would come from API/database
const schoolsData = {
  1: {
    id: 1,
    name: "SDN Sungai Miai 5",
    address: "Jl. Sungai Miai No. 45, Banjarmasin Utara",
    level: "SD",
    district: "Banjarmasin Utara",
    accreditation: "A",
    status: "Negeri",
    phone: "(0511) 3254789",
    email: "sdnsungaimiai5@gmail.com",
    principal: "Dra. Siti Aminah, M.Pd",
    founded: "1985",
    students: "450",
    teachers: "28",
    description:
      "SDN Sungai Miai 5 adalah sekolah dasar negeri yang berlokasi di Banjarmasin Utara. Sekolah ini telah berdiri sejak tahun 1985 dan telah meluluskan ribuan siswa yang berkualitas. Dengan akreditasi A, sekolah ini berkomitmen untuk memberikan pendidikan terbaik bagi anak-anak di wilayah Sungai Miai dan sekitarnya. Fasilitas yang lengkap dan tenaga pengajar yang berpengalaman menjadi keunggulan utama sekolah ini.",
    facilities: [
      "Ruang Kelas Ber-AC",
      "Perpustakaan",
      "Laboratorium Komputer",
      "Lapangan Olahraga",
      "Kantin Sehat",
      "Mushola",
      "UKS",
      "Parkir Luas",
    ],
    achievements: [
      "Juara 1 Lomba Cerdas Cermat Tingkat Kota 2023",
      "Juara 2 Festival Seni Budaya Sekolah 2023",
      "Sekolah Adiwiyata Tingkat Provinsi 2022",
    ],
    photos: [
      {
        url: "/placeholder.svg?height=500&width=800&text=Foto+Depan+Sekolah",
        title: "Foto Depan Sekolah",
        description:
          "Tampak depan SDN Sungai Miai 5 yang menunjukkan arsitektur modern dengan fasilitas yang lengkap dan lingkungan yang asri.",
      },
      {
        url: "/placeholder.svg?height=500&width=800&text=Ruang+Kelas",
        title: "Ruang Kelas",
        description:
          "Ruang kelas yang nyaman dan dilengkapi dengan AC, proyektor, dan fasilitas pembelajaran modern untuk mendukung proses belajar mengajar.",
      },
      {
        url: "/placeholder.svg?height=500&width=800&text=Lapangan+Sekolah",
        title: "Lapangan Sekolah",
        description:
          "Lapangan olahraga yang luas digunakan untuk berbagai kegiatan fisik dan upacara sekolah, mendukung pengembangan karakter siswa.",
      },
      {
        url: "/placeholder.svg?height=500&width=800&text=Perpustakaan",
        title: "Perpustakaan",
        description:
          "Perpustakaan dengan koleksi buku yang lengkap dan suasana yang kondusif untuk mendukung minat baca siswa.",
      },
      {
        url: "/placeholder.svg?height=500&width=800&text=Laboratorium+Komputer",
        title: "Laboratorium Komputer",
        description:
          "Laboratorium komputer dengan perangkat terkini untuk mendukung pembelajaran teknologi informasi dan komunikasi.",
      },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.0234567890123!2d114.5901234567890!3d-3.3234567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMTknMjQuNCJTIDExNMKwMzUnMjQuNCJF!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid",
  },
  2: {
    id: 2,
    name: "SMPN 1 Banjarmasin",
    address: "Jl. Lambung Mangkurat No. 1, Banjarmasin Tengah",
    level: "SMP",
    district: "Banjarmasin Tengah",
    accreditation: "A",
    status: "Negeri",
    phone: "(0511) 3251234",
    email: "smpn1bjm@gmail.com",
    principal: "Drs. Ahmad Fauzi, M.Pd",
    founded: "1962",
    students: "720",
    teachers: "45",
    description:
      "SMPN 1 Banjarmasin adalah sekolah menengah pertama negeri tertua dan terbaik di Kota Banjarmasin. Berdiri sejak tahun 1962, sekolah ini telah menjadi rujukan pendidikan menengah pertama di Kalimantan Selatan. Dengan akreditasi A dan berbagai prestasi gemilang, SMPN 1 Banjarmasin terus berkomitmen menghasilkan lulusan yang unggul dalam akademik maupun non-akademik. Lokasi strategis di pusat kota memudahkan akses bagi siswa dari berbagai wilayah.",
    facilities: [
      "Ruang Kelas Modern",
      "Laboratorium IPA",
      "Laboratorium Bahasa",
      "Laboratorium Komputer",
      "Perpustakaan Digital",
      "Aula Serbaguna",
      "Lapangan Basket",
      "Lapangan Voli",
      "Kantin Modern",
      "Mushola",
      "Parkir Siswa & Guru",
    ],
    achievements: [
      "Juara 1 Olimpiade Matematika Nasional 2023",
      "Juara 1 Lomba Debat Bahasa Indonesia Tingkat Provinsi 2023",
      "Juara 2 Festival Sains Nasional 2023",
      "Sekolah Rujukan Nasional 2022",
    ],
    photos: [
      {
        url: "/placeholder.svg?height=500&width=800&text=Gerbang+SMPN+1",
        title: "Gerbang SMPN 1 Banjarmasin",
        description:
          "Gerbang utama SMPN 1 Banjarmasin yang megah, mencerminkan prestise sekolah tertua dan terbaik di Kota Banjarmasin.",
      },
      {
        url: "/placeholder.svg?height=500&width=800&text=Laboratorium+IPA",
        title: "Laboratorium IPA",
        description:
          "Laboratorium IPA yang lengkap dengan peralatan modern untuk mendukung pembelajaran sains yang berkualitas tinggi.",
      },
      {
        url: "/placeholder.svg?height=500&width=800&text=Aula+Serbaguna",
        title: "Aula Serbaguna",
        description:
          "Aula serbaguna yang dapat menampung ratusan orang untuk berbagai kegiatan sekolah dan acara penting.",
      },
      {
        url: "/placeholder.svg?height=500&width=800&text=Perpustakaan+Digital",
        title: "Perpustakaan Digital",
        description: "Perpustakaan digital dengan koleksi buku fisik dan digital yang mendukung pembelajaran abad 21.",
      },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.0234567890123!2d114.5901234567890!3d-3.3234567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMTknMjQuNCJTIDExNMKwMzUnMjQuNCJF!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid",
  },
}

interface SchoolDetailPageProps {
  params: {
    id: string
  }
}

export default function SchoolDetailPage({ params }: SchoolDetailPageProps) {
  const schoolId = Number.parseInt(params.id)
  const school = schoolsData[schoolId as keyof typeof schoolsData]
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  if (!school) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sekolah Tidak Ditemukan</h1>
          <Link href="/direktori-sekolah">
            <Button>Kembali ke Direktori Sekolah</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getAccreditationColor = (accreditation: string) => {
    switch (accreditation) {
      case "A":
        return "bg-chart-2/10 text-chart-2"
      case "B":
        return "bg-chart-1/10 text-chart-1"
      case "C":
        return "bg-chart-3/10 text-chart-3"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Negeri" ? "bg-chart-4/10 text-chart-4" : "bg-chart-5/10 text-chart-5"
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % school.photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + school.photos.length) % school.photos.length)
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
                className="text-primary font-medium transition-all duration-300 relative group"
              >
                Direktori Sekolah
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600"></span>
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

      {/* Page Content Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/direktori-sekolah">
              <Button
                variant="outline"
                className="flex items-center space-x-2 hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Direktori</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{school.name}</h1>
          <div className="flex gap-2 mt-2">
            <Badge className={getAccreditationColor(school.accreditation)}>Akreditasi {school.accreditation}</Badge>
            <Badge className={getStatusColor(school.status)}>Status: {school.status}</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* School Photos - Large Display */}
            <Card>
              <CardHeader>
                <CardTitle>Foto Sekolah</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Main Photo Display */}
                <div className="mb-8">
                  <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={school.photos[currentPhotoIndex].url || "/placeholder.svg"}
                      alt={school.photos[currentPhotoIndex].title}
                      fill
                      className="object-cover"
                    />

                    {/* Navigation Arrows */}
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Photo Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentPhotoIndex + 1} / {school.photos.length}
                    </div>
                  </div>
                </div>

                {/* Photo Info */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">{school.photos[currentPhotoIndex].title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {school.photos[currentPhotoIndex].description}
                  </p>
                </div>

                {/* Photo Thumbnails */}
                <div className="flex justify-center space-x-4 overflow-x-auto pb-2">
                  {school.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 ${
                        index === currentPhotoIndex
                          ? "ring-4 ring-blue-500 scale-110"
                          : "hover:scale-105 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={photo.url || "/placeholder.svg"} alt={photo.title} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* School Description */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Sekolah</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{school.description}</p>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Fasilitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {school.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-foreground">{facility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span>Prestasi</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {school.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                    >
                      <Award className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* School Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Sekolah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Alamat</p>
                    <p className="text-sm text-muted-foreground">{school.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Telepon</p>
                    <p className="text-sm text-muted-foreground">{school.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">{school.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Kepala Sekolah</p>
                    <p className="text-sm text-muted-foreground">{school.principal}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Tahun Berdiri</p>
                    <p className="text-sm text-muted-foreground">{school.founded}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/40 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-foreground">Jumlah Siswa</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{school.students}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-950/30 rounded-lg border border-green-200/50 dark:border-green-800/30 hover:bg-green-100/50 dark:hover:bg-green-900/40 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-foreground">Jumlah Guru</span>
                  </div>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">{school.teachers}</span>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Lokasi Sekolah</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src={school.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                  {/* Fallback for when iframe doesn't load */}
                  <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Peta Lokasi Sekolah</p>
                      <p className="text-xs mt-1">{school.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
