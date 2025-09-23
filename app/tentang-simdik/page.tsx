"use client"
import { Card, CardContent } from "@/components/ui/card"
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
} from "lucide-react"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useStaggeredScrollAnimation } from "@/hooks/use-scroll-animation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AboutSIMDIKPage() {
  const [setActivityRef, activityVisible] = useStaggeredScrollAnimation(6, { delay: 150, triggerOnce: true })

  const officeActivities = [
    {
      title: "Penyusunan Kurikulum Daerah",
      description:
        "Mengembangkan kurikulum yang relevan dengan kebutuhan lokal dan standar nasional, melibatkan pakar pendidikan dan praktisi.",
      icon: BookOpen,
      date: "Sep 2024 - Des 2024",
      location: "Dinas Pendidikan",
      image: "/curriculum-discussion.png",
    },
    {
      title: "Pelatihan Guru Berbasis Digital",
      description:
        "Program pelatihan intensif untuk meningkatkan kompetensi guru dalam pemanfaatan teknologi digital untuk pembelajaran.",
      icon: Lightbulb,
      date: "Jan 2025 - Mar 2025",
      location: "Pusat Pelatihan Guru",
      image: "/teachers-digital-training.png",
    },
    {
      title: "Evaluasi Kualitas Pendidikan Tahunan",
      description: "Melakukan evaluasi menyeluruh terhadap kualitas pendidikan di seluruh sekolah di Banjarmasin.",
      icon: CheckCircle,
      date: "Apr 2025 - Jun 2025",
      location: "Seluruh Sekolah",
      image: "/education-officials-evaluation.png",
    },
    {
      title: "Sosialisasi Program Beasiswa",
      description:
        "Mengadakan sosialisasi program beasiswa bagi siswa berprestasi dan kurang mampu di berbagai jenjang pendidikan.",
      icon: GraduationCap,
      date: "Jul 2025",
      location: "Sekolah & Online",
      image: "/scholarship-presentation.png",
    },
    {
      title: "Pengembangan Sistem Informasi Pendidikan",
      description:
        "Meningkatkan dan mengembangkan sistem informasi untuk pengelolaan data pendidikan yang lebih efisien dan terintegrasi.",
      icon: School,
      date: "Agu 2025 - Okt 2025",
      location: "Dinas Pendidikan",
      image: "/placeholder-dxit6.png",
    },
    {
      title: "Forum Komunikasi Orang Tua dan Sekolah",
      description:
        "Menyelenggarakan forum rutin untuk mempererat komunikasi antara orang tua, guru, dan pihak dinas pendidikan.",
      icon: Users,
      date: "Nov 2025",
      location: "Berbagai Lokasi",
      image: "/school-discussion-forum.png",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header - Consistent with main page */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Hero Section for About Page */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Image and Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/dinas-pendidikan-banjarmasin-real.jpeg"
            alt="Kantor Dinas Pendidikan Kota Banjarmasin"
            fill
            className="object-cover object-center animate-bg-pan"
            priority
          />
          <div className="absolute inset-0 bg-blue-900 opacity-60"></div> {/* Dark overlay for text readability */}
        </div>
        {/* Background Animation - More colorful and dynamic "pernak-pernik" */}
        <div className="absolute inset-0 opacity-30">
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
              Tentang Dinas Pendidikan Kota Banjarmasin
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200} duration={800}>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Mewujudkan pendidikan berkualitas dan merata untuk seluruh masyarakat Banjarmasin.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Back to Home Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* About Us Content */}
      <section className="py-16 bg-card shadow-sm border-y border-border firefly-container">
        {/* Firefly elements */}
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} className="firefly"></div>
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" delay={0} duration={800}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">Visi dan Misi Kami</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal animation="fade-right" delay={200} duration={800}>
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">Visi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi pelopor pendidikan inovatif dan inklusif yang menghasilkan generasi cerdas, berkarakter, dan
                  berdaya saing global di Kota Banjarmasin.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={400} duration={800}>
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">Misi</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
                  <li>Meningkatkan kualitas dan relevansi kurikulum pendidikan.</li>
                  <li>Mengembangkan kompetensi tenaga pendidik dan kependidikan.</li>
                  <li>Memfasilitasi akses pendidikan yang merata dan berkualitas.</li>
                  <li>Mendorong inovasi dan pemanfaatan teknologi dalam pembelajaran.</li>
                  <li>Membangun kemitraan strategis dengan berbagai pihak untuk kemajuan pendidikan.</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Office Activities Section */}
      <section className="py-16 bg-card shadow-sm border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal animation="fade-up" delay={0} duration={800}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Kegiatan Dinas Pendidikan</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officeActivities.map((activity, index) => {
              const Icon = activity.icon
              const slug = activity.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "")

              return (
                <div
                  key={index}
                  ref={setActivityRef(index)}
                  className={`transform transition-all duration-700 ease-out ${
                    activityVisible[index] ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-8 rotate-1"
                  }`}
                >
                  <Link href={`/tentang-simdik/kegiatan/${slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 group border-2 border-transparent hover:border-blue-400 cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={activity.image || "/placeholder.svg"}
                          alt={activity.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Lihat Detail
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-foreground transition-all duration-300 group-hover:text-blue-600">
                            {activity.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{activity.description}</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            <span>{activity.date}</span>
                          </p>
                          <p className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                            <span>{activity.location}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer - Consistent with main page */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
