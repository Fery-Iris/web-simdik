"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Eye, School, Menu, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

// Extended news data for the listing page
const allNewsData = [
  {
    id: 1,
    title: "Pembangunan Sekolah Baru di Banjarmasin Timur",
    slug: "pembangunan-sekolah-baru-banjarmasin-timur",
    excerpt:
      "Dinas Pendidikan Kota Banjarmasin meresmikan pembangunan kompleks sekolah baru yang akan menampung 1.200 siswa dengan fasilitas modern dan ramah lingkungan.",
    category: "Infrastruktur",
    author: "Tim Redaksi SIMDIK",
    date: "2025-01-10",
    views: 1250,
    image: "/placeholder.svg?height=300&width=500&text=Pembangunan+Sekolah+Baru",
  },
  {
    id: 2,
    title: "Program Digitalisasi Pembelajaran Diluncurkan",
    slug: "program-digitalisasi-pembelajaran",
    excerpt:
      "Seluruh sekolah di Banjarmasin kini dilengkapi dengan platform pembelajaran digital untuk meningkatkan kualitas pendidikan dan adaptasi teknologi modern.",
    category: "Teknologi",
    author: "Redaksi SIMDIK",
    date: "2025-01-08",
    views: 980,
    image: "/placeholder.svg?height=300&width=500&text=Digitalisasi+Pembelajaran",
  },
  {
    id: 3,
    title: "Pelatihan Guru Berkelanjutan Tahun 2024",
    slug: "pelatihan-guru-berkelanjutan-2024",
    excerpt:
      "Program pelatihan komprehensif untuk 500 guru se-Kota Banjarmasin dalam meningkatkan kompetensi pedagogik dan profesional di era digital.",
    category: "Pelatihan",
    author: "Humas Disdik",
    date: "2025-01-05",
    views: 750,
    image: "/placeholder.svg?height=300&width=500&text=Pelatihan+Guru",
  },
  {
    id: 4,
    title: "Lomba Inovasi Pembelajaran Tingkat Kota",
    slug: "lomba-inovasi-pembelajaran-tingkat-kota",
    excerpt:
      "Kompetisi untuk mendorong kreativitas guru dalam mengembangkan metode pembelajaran yang inovatif dan menarik bagi siswa.",
    category: "Kompetisi",
    author: "Tim Redaksi SIMDIK",
    date: "2025-01-03",
    views: 650,
    image: "/placeholder.svg?height=300&width=500&text=Lomba+Inovasi",
  },
  {
    id: 5,
    title: "Kerjasama dengan Universitas Lambung Mangkurat",
    slug: "kerjasama-universitas-lambung-mangkurat",
    excerpt:
      "Penandatanganan MoU untuk program pengembangan kurikulum dan peningkatan kualitas tenaga pendidik di Kota Banjarmasin.",
    category: "Kerjasama",
    author: "Humas Disdik",
    date: "2025-01-01",
    views: 890,
    image: "/placeholder.svg?height=300&width=500&text=Kerjasama+ULM",
  },
  {
    id: 6,
    title: "Program Beasiswa Prestasi untuk Siswa Berprestasi",
    slug: "program-beasiswa-prestasi-siswa",
    excerpt:
      "Pemberian beasiswa kepada 100 siswa berprestasi dari keluarga kurang mampu untuk melanjutkan pendidikan ke jenjang yang lebih tinggi.",
    category: "Beasiswa",
    author: "Tim Redaksi SIMDIK",
    date: "2024-12-28",
    views: 1100,
    image: "/placeholder.svg?height=300&width=500&text=Program+Beasiswa",
  },
]

export default function BeritaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  const categories = ["Semua", "Infrastruktur", "Teknologi", "Pelatihan", "Kompetisi", "Kerjasama", "Beasiswa"]

  const filteredNews = allNewsData.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Semua" || news.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors = {
      Infrastruktur: "bg-chart-1/10 text-chart-1",
      Teknologi: "bg-chart-2/10 text-chart-2",
      Pelatihan: "bg-chart-3/10 text-chart-3",
      Kompetisi: "bg-chart-4/10 text-chart-4",
      Kerjasama: "bg-chart-5/10 text-chart-5",
      Beasiswa: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    }
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Consistent with main page */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4">
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

      <div className="max-w-6xl mx-auto px-4 py-8">
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

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Semua Berita</h1>
          <p className="text-muted-foreground text-lg">Temukan berita terbaru seputar pendidikan di Kota Banjarmasin</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cari berita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-transparent hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((news) => (
            <Card
              key={news.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 group border-2 border-transparent hover:border-blue-400"
            >
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={news.image || "/placeholder.svg"}
                  alt={news.title}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge className={getCategoryColor(news.category)}>{news.category}</Badge>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 transition-all duration-300 group-hover:text-blue-600 line-clamp-2">
                  {news.title}
                </h3>

                <p className="text-muted-foreground mb-4 line-clamp-3">{news.excerpt}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{news.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(news.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{news.views}</span>
                  </div>
                </div>

                <Link
                  href={`/berita/${news.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group-hover:translate-x-2 inline-flex items-center"
                >
                  Baca Selengkapnya
                  <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Tidak ada berita yang ditemukan.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("Semua")
              }}
              className="mt-4"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
