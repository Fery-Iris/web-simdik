"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// News data from berita page
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

export function ScrollingNewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout>()

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % allNewsData.length)
      }, 4000) // Change slide every 4 seconds
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
      }
    }
  }, [isAutoScrolling])

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoScrolling(false)
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? allNewsData.length - 1 : currentIndex - 1
    goToSlide(newIndex)
  }

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % allNewsData.length
    goToSlide(newIndex)
  }

  // Handle mouse events for auto-scroll control
  const handleMouseEnter = () => {
    setIsAutoScrolling(false)
  }

  const handleMouseLeave = () => {
    setIsAutoScrolling(true)
  }

  return (
    <div className="relative overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Scrolling Container */}
      <div
        ref={scrollContainerRef}
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / 3)}%)`,
          width: `${(allNewsData.length * 100) / 3}%`,
        }}
      >
        {allNewsData.map((news, index) => (
          <div key={news.id} className="w-1/3 px-3 flex-shrink-0">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 group border-2 border-transparent hover:border-blue-400 h-full">
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
                <h3 className="text-xl font-bold text-foreground mb-3 transition-all duration-300 group-hover:text-blue-600 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{news.excerpt}</p>
                <Link
                  href={`/berita/${news.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group-hover:translate-x-2 inline-flex items-center"
                >
                  Baca Selengkapnya
                  <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300"
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300"
        onClick={goToNext}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {allNewsData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Auto-scroll indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isAutoScrolling ? "bg-green-500 animate-pulse" : "bg-gray-400"
          }`}
        />
      </div>
    </div>
  )
}
