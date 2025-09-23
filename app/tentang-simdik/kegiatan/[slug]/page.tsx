"use client"
import {
  School,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Lightbulb,
  CheckCircle,
  GraduationCap,
  Menu,
  Instagram,
  Facebook,
  Youtube,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { notFound } from "next/navigation"

const activityDetails = {
  "penyusunan-kurikulum-daerah": {
    title: "Penyusunan Kurikulum Daerah",
    description:
      "Mengembangkan kurikulum yang relevan dengan kebutuhan lokal dan standar nasional, melibatkan pakar pendidikan dan praktisi.",
    icon: BookOpen,
    date: "Sep 2024 - Des 2024",
    location: "Dinas Pendidikan",
    fullDescription:
      "Program penyusunan kurikulum daerah merupakan inisiatif strategis Dinas Pendidikan Kota Banjarmasin untuk mengembangkan kurikulum yang tidak hanya memenuhi standar nasional, tetapi juga relevan dengan kebutuhan dan karakteristik lokal. Program ini melibatkan berbagai stakeholder termasuk pakar pendidikan, praktisi, guru berpengalaman, dan perwakilan masyarakat.",
    objectives: [
      "Mengintegrasikan nilai-nilai lokal Banjarmasin dalam kurikulum",
      "Meningkatkan relevansi pembelajaran dengan kebutuhan industri lokal",
      "Mengembangkan kompetensi siswa yang sesuai dengan potensi daerah",
      "Memperkuat identitas budaya dalam proses pembelajaran",
    ],
    photos: [
      {
        url: "/kegiatan/kurikulum-1.png",
        title: "Rapat Koordinasi Tim Penyusun",
        description:
          "Tim ahli kurikulum dari berbagai instansi berkumpul untuk membahas kerangka dasar kurikulum daerah yang akan dikembangkan.",
      },
      {
        url: "/kegiatan/kurikulum-2.png",
        title: "Workshop Pengembangan Materi",
        description:
          "Sesi workshop intensif untuk mengembangkan materi pembelajaran yang mengintegrasikan konten lokal dengan standar nasional.",
      },
      {
        url: "/kegiatan/kurikulum-3.png",
        title: "Presentasi Hasil Kajian",
        description:
          "Presentasi hasil kajian kurikulum kepada stakeholder pendidikan untuk mendapatkan masukan dan persetujuan implementasi.",
      },
    ],
  },
  "pelatihan-guru-berbasis-digital": {
    title: "Pelatihan Guru Berbasis Digital",
    description:
      "Program pelatihan intensif untuk meningkatkan kompetensi guru dalam pemanfaatan teknologi digital untuk pembelajaran.",
    icon: Lightbulb,
    date: "Jan 2025 - Mar 2025",
    location: "Pusat Pelatihan Guru",
    fullDescription:
      "Program pelatihan guru berbasis digital dirancang untuk mempersiapkan tenaga pendidik menghadapi era digitalisasi pendidikan. Pelatihan ini mencakup penggunaan platform pembelajaran online, pengembangan konten digital interaktif, dan strategi pembelajaran hybrid yang efektif.",
    objectives: [
      "Meningkatkan literasi digital guru di seluruh jenjang pendidikan",
      "Mengembangkan kemampuan membuat konten pembelajaran digital",
      "Memperkenalkan platform dan tools pembelajaran modern",
      "Membangun mindset adaptif terhadap teknologi pendidikan",
    ],
    photos: [
      {
        url: "/kegiatan/digital-1.png",
        title: "Sesi Pelatihan Platform Digital",
        description:
          "Guru-guru antusias mengikuti pelatihan penggunaan platform pembelajaran digital untuk meningkatkan kualitas mengajar.",
      },
      {
        url: "/kegiatan/digital-2.png",
        title: "Workshop Pembuatan Konten",
        description:
          "Workshop hands-on pembuatan konten pembelajaran interaktif menggunakan berbagai aplikasi dan tools digital terkini.",
      },
      {
        url: "/kegiatan/digital-3.png",
        title: "Praktik Mengajar Digital",
        description:
          "Sesi praktik mengajar dengan memanfaatkan teknologi digital, dimana guru dapat langsung menerapkan ilmu yang telah dipelajari.",
      },
    ],
  },
  "evaluasi-kualitas-pendidikan-tahunan": {
    title: "Evaluasi Kualitas Pendidikan Tahunan",
    description: "Melakukan evaluasi menyeluruh terhadap kualitas pendidikan di seluruh sekolah di Banjarmasin.",
    icon: CheckCircle,
    date: "Apr 2025 - Jun 2025",
    location: "Seluruh Sekolah",
    fullDescription:
      "Program evaluasi kualitas pendidikan tahunan merupakan kegiatan komprehensif untuk mengukur dan menilai standar pendidikan di seluruh sekolah di Kota Banjarmasin. Evaluasi ini mencakup aspek akademik, infrastruktur, kualitas pengajaran, dan pencapaian siswa.",
    objectives: [
      "Mengukur pencapaian standar pendidikan nasional",
      "Mengidentifikasi area yang perlu perbaikan",
      "Memberikan rekomendasi peningkatan kualitas",
      "Memastikan pemerataan kualitas pendidikan",
    ],
    photos: [
      {
        url: "/kegiatan/evaluasi-1.png",
        title: "Tim Evaluasi di Lapangan",
        description:
          "Tim evaluator dari Dinas Pendidikan melakukan kunjungan langsung ke sekolah-sekolah untuk menilai kondisi dan kualitas pendidikan.",
      },
      {
        url: "/kegiatan/evaluasi-2.png",
        title: "Wawancara dengan Stakeholder",
        description:
          "Sesi wawancara mendalam dengan kepala sekolah, guru, dan siswa untuk mendapatkan gambaran komprehensif kualitas pendidikan.",
      },
      {
        url: "/kegiatan/evaluasi-3.png",
        title: "Analisis Data dan Pelaporan",
        description:
          "Tim ahli melakukan analisis data hasil evaluasi untuk menyusun laporan dan rekomendasi peningkatan kualitas pendidikan.",
      },
    ],
  },
  "sosialisasi-program-beasiswa": {
    title: "Sosialisasi Program Beasiswa",
    description:
      "Mengadakan sosialisasi program beasiswa bagi siswa berprestasi dan kurang mampu di berbagai jenjang pendidikan.",
    icon: GraduationCap,
    date: "Jul 2025",
    location: "Sekolah & Online",
    fullDescription:
      "Program sosialisasi beasiswa bertujuan untuk memastikan informasi tentang berbagai program beasiswa dapat diakses oleh seluruh siswa di Kota Banjarmasin. Kegiatan ini dilakukan secara hybrid dengan kombinasi kunjungan langsung ke sekolah dan platform online.",
    objectives: [
      "Meningkatkan akses informasi beasiswa bagi siswa",
      "Membantu siswa berprestasi dan kurang mampu",
      "Mengurangi angka putus sekolah karena faktor ekonomi",
      "Mendorong peningkatan prestasi akademik siswa",
    ],
    photos: [
      {
        url: "/kegiatan/beasiswa-1.png",
        title: "Presentasi Program Beasiswa",
        description:
          "Penyampaian informasi lengkap tentang berbagai program beasiswa yang tersedia untuk siswa berprestasi dan kurang mampu.",
      },
      {
        url: "/kegiatan/beasiswa-2.png",
        title: "Sesi Tanya Jawab Siswa",
        description:
          "Siswa antusias mengajukan pertanyaan tentang persyaratan, proses pendaftaran, dan tips mendapatkan beasiswa.",
      },
      {
        url: "/kegiatan/beasiswa-3.png",
        title: "Pendampingan Pendaftaran",
        description:
          "Tim dari Dinas Pendidikan memberikan pendampingan langsung kepada siswa dalam proses pendaftaran beasiswa.",
      },
    ],
  },
  "pengembangan-sistem-informasi-pendidikan": {
    title: "Pengembangan Sistem Informasi Pendidikan",
    description:
      "Meningkatkan dan mengembangkan sistem informasi untuk pengelolaan data pendidikan yang lebih efisien dan terintegrasi.",
    icon: School,
    date: "Agu 2025 - Okt 2025",
    location: "Dinas Pendidikan",
    fullDescription:
      "Program pengembangan sistem informasi pendidikan merupakan upaya modernisasi pengelolaan data pendidikan di Kota Banjarmasin. Sistem ini dirancang untuk mengintegrasikan seluruh data pendidikan mulai dari data siswa, guru, sekolah, hingga program-program pendidikan.",
    objectives: [
      "Mengintegrasikan seluruh data pendidikan dalam satu sistem",
      "Meningkatkan efisiensi pengelolaan administrasi pendidikan",
      "Menyediakan data real-time untuk pengambilan keputusan",
      "Memudahkan akses informasi bagi stakeholder pendidikan",
    ],
    photos: [
      {
        url: "/kegiatan/sistem-1.png",
        title: "Rapat Pengembangan Sistem",
        description:
          "Tim IT dan stakeholder pendidikan membahas spesifikasi dan kebutuhan sistem informasi pendidikan yang akan dikembangkan.",
      },
      {
        url: "/kegiatan/sistem-2.png",
        title: "Testing dan Quality Assurance",
        description:
          "Proses testing menyeluruh untuk memastikan sistem berjalan dengan baik dan memenuhi kebutuhan pengguna.",
      },
      {
        url: "/kegiatan/sistem-3.png",
        title: "Pelatihan Pengguna Sistem",
        description:
          "Pelatihan intensif bagi staff Dinas Pendidikan dan sekolah-sekolah untuk menggunakan sistem informasi yang baru.",
      },
    ],
  },
  "forum-komunikasi-orang-tua-dan-sekolah": {
    title: "Forum Komunikasi Orang Tua dan Sekolah",
    description:
      "Menyelenggarakan forum rutin untuk mempererat komunikasi antara orang tua, guru, dan pihak dinas pendidikan.",
    icon: Users,
    date: "Nov 2025",
    location: "Berbagai Lokasi",
    fullDescription:
      "Forum komunikasi orang tua dan sekolah merupakan wadah dialog konstruktif antara berbagai pihak yang terlibat dalam pendidikan anak. Forum ini bertujuan untuk membangun sinergi yang kuat antara rumah, sekolah, dan dinas pendidikan.",
    objectives: [
      "Mempererat hubungan antara orang tua dan sekolah",
      "Meningkatkan partisipasi orang tua dalam pendidikan anak",
      "Membahas isu-isu pendidikan yang relevan",
      "Mencari solusi bersama untuk tantangan pendidikan",
    ],
    photos: [
      {
        url: "/kegiatan/forum-1.png",
        title: "Diskusi Panel Pendidikan",
        description:
          "Diskusi panel yang melibatkan orang tua, guru, dan perwakilan Dinas Pendidikan membahas isu-isu terkini dalam pendidikan.",
      },
      {
        url: "/kegiatan/forum-2.png",
        title: "Workshop Parenting",
        description:
          "Sesi workshop khusus untuk orang tua tentang cara mendampingi anak dalam proses belajar di era digital.",
      },
      {
        url: "/kegiatan/forum-3.png",
        title: "Networking Session",
        description:
          "Sesi networking informal yang memungkinkan orang tua, guru, dan pihak sekolah untuk saling bertukar pengalaman dan ide.",
      },
    ],
  },
}

export default function ActivityDetailPage({ params }: { params: { slug: string } }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const activity = activityDetails[params.slug as keyof typeof activityDetails]

  if (!activity) {
    notFound()
  }

  const Icon = activity.icon

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % activity.photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + activity.photos.length) % activity.photos.length)
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
                className="text-primary font-medium transition-all duration-300 relative group"
              >
                Tentang SIMDIK
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600"></span>
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

      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/tentang-simdik">
          <Button
            variant="outline"
            className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Tentang SIMDIK</span>
          </Button>
        </Link>
      </div>

      {/* Activity Header */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade-up" delay={0} duration={800}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{activity.title}</h1>
                <p className="text-blue-100 text-lg">{activity.description}</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200} duration={800}>
            <div className="flex flex-wrap gap-6 text-blue-100">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{activity.date}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{activity.location}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade-up" delay={0} duration={800}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Dokumentasi Kegiatan</h2>
          </ScrollReveal>

          {/* Main Photo Display */}
          <div className="max-w-4xl mx-auto mb-8">
            <ScrollReveal animation="scale" delay={200} duration={800}>
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={activity.photos[currentPhotoIndex].url || "/placeholder.svg"}
                  alt={activity.photos[currentPhotoIndex].title}
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
                  {currentPhotoIndex + 1} / {activity.photos.length}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Photo Info */}
          <ScrollReveal animation="fade-up" delay={400} duration={800}>
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">{activity.photos[currentPhotoIndex].title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {activity.photos[currentPhotoIndex].description}
              </p>
            </div>
          </ScrollReveal>

          {/* Photo Thumbnails */}
          <div className="max-w-2xl mx-auto">
            <ScrollReveal animation="fade-up" delay={600} duration={800}>
              <div className="flex justify-center space-x-4">
                {activity.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                      index === currentPhotoIndex
                        ? "ring-4 ring-blue-500 scale-110"
                        : "hover:scale-105 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={photo.url || "/placeholder.svg"} alt={photo.title} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Activity Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal animation="fade-up" delay={0} duration={800}>
              <h2 className="text-3xl font-bold text-foreground mb-8">Detail Kegiatan</h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200} duration={800}>
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-muted-foreground leading-relaxed text-lg">{activity.fullDescription}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={400} duration={800}>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Tujuan Kegiatan</h3>
                <ul className="space-y-4">
                  {activity.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="text-muted-foreground leading-relaxed">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer - Consistent with main page */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Logo and Mission */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <School className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SIMDIK</span>
              </div>
              <p className="text-blue-200 leading-relaxed">
                Membangun masa depan pendidikan Banjarmasin melalui inovasi, kolaborasi, dan komitmen untuk mencerdaskan
                generasi bangsa.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Tautan Cepat</h3>
              <ul className="space-y-2">
                {["Beranda", "Tentang SIMDIK", "Direktori Sekolah", "Berita", "Agenda", "Kontak"].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={
                        item === "Direktori Sekolah"
                          ? "/direktori-sekolah"
                          : item === "Tentang SIMDIK"
                            ? "/tentang-simdik"
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
                ))}
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Kontak Kami</h3>
              <div className="space-y-3 text-blue-200">
                <p>
                  Jl. Sultan Adam No. 18
                  <br />
                  Banjarmasin, Kalimantan Selatan
                  <br />
                  70122
                </p>
                <p>Telepon: (0511) 3252732</p>
                <p>Email: disdik@banjarmasinkota.go.id</p>
              </div>
            </div>

            {/* Column 4: Social Media */}
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
          </div>

          {/* Copyright */}
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; {new Date().getFullYear()} Dinas Pendidikan Kota Banjarmasin. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
