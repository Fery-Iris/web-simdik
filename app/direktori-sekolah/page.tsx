"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, ArrowLeft, School, Menu, Instagram, Facebook, Youtube } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollReveal } from "@/components/scroll-reveal"

// Sample school data
const schoolsData = [
  {
    id: 1,
    name: "SDN Sungai Miai 5",
    address: "Jl. Sungai Miai No. 45, Banjarmasin Utara",
    level: "SD",
    district: "Banjarmasin Utara",
    accreditation: "A",
    status: "Negeri",
    image: "/placeholder.svg?height=200&width=300&text=SDN+Sungai+Miai+5",
  },
  {
    id: 2,
    name: "SMPN 1 Banjarmasin",
    address: "Jl. Lambung Mangkurat No. 1, Banjarmasin Tengah",
    level: "SMP",
    district: "Banjarmasin Tengah",
    accreditation: "A",
    status: "Negeri",
    image: "/placeholder.svg?height=200&width=300&text=SMPN+1+Banjarmasin",
  },
  {
    id: 3,
    name: "SD Islam Al-Azhar",
    address: "Jl. A. Yani Km. 4.5, Banjarmasin Selatan",
    level: "SD",
    district: "Banjarmasin Selatan",
    accreditation: "A",
    status: "Swasta",
    image: "/placeholder.svg?height=200&width=300&text=SD+Islam+Al-Azhar",
  },
  {
    id: 4,
    name: "SDN Kelayan Tengah 1",
    address: "Jl. Kelayan Tengah No. 12, Banjarmasin Selatan",
    level: "SD",
    district: "Banjarmasin Selatan",
    accreditation: "B",
    status: "Negeri",
    image: "/placeholder.svg?height=200&width=300&text=SDN+Kelayan+Tengah+1",
  },
  {
    id: 5,
    name: "SMPN 5 Banjarmasin",
    address: "Jl. Veteran No. 128, Banjarmasin Tengah",
    level: "SMP",
    district: "Banjarmasin Tengah",
    accreditation: "A",
    status: "Negeri",
    image: "/placeholder.svg?height=200&width=300&text=SMPN+5+Banjarmasin",
  },
  {
    id: 6,
    name: "SD Muhammadiyah 1",
    address: "Jl. S. Parman No. 88, Banjarmasin Utara",
    level: "SD",
    district: "Banjarmasin Utara",
    accreditation: "A",
    status: "Swasta",
    image: "/placeholder.svg?height=200&width=300&text=SD+Muhammadiyah+1",
  },
  {
    id: 7,
    name: "SDN Antasan Kecil Timur 1",
    address: "Jl. Antasan Kecil Timur No. 25, Banjarmasin Tengah",
    level: "SD",
    district: "Banjarmasin Tengah",
    accreditation: "B",
    status: "Negeri",
    image: "/placeholder.svg?height=200&width=300&text=SDN+Antasan+Kecil+Timur+1",
  },
  {
    id: 8,
    name: "SMP Islam Sabilal Muhtadin",
    address: "Jl. Veteran No. 24, Banjarmasin Tengah",
    level: "SMP",
    district: "Banjarmasin Tengah",
    accreditation: "A",
    status: "Swasta",
    image: "/placeholder.svg?height=200&width=300&text=SMP+Islam+Sabilal+Muhtadin",
  },
  {
    id: 9,
    name: "SDN Pemurus Baru 5",
    address: "Jl. Pemurus Baru No. 67, Banjarmasin Selatan",
    level: "SD",
    district: "Banjarmasin Selatan",
    accreditation: "B",
    status: "Negeri",
    image: "/placeholder.svg?height=200&width=300&text=SDN+Pemurus+Baru+5",
  },
  {
    id: 10,
    name: "SMPN 12 Banjarmasin",
    address: "Jl. Banjarbaru No. 45, Banjarmasin Barat",
    level: "SMP",
    district: "Banjarmasin Barat",
    accreditation: "B",
    status: "Negeri",
    image: "/placeholder.svg?height=200&width=300&text=SMPN+12+Banjarmasin",
  },
  {
    id: 11,
    name: "SD Katolik Santo Antonius",
    address: "Jl. Pangeran Samudera No. 98, Banjarmasin Tengah",
    level: "SD",
    district: "Banjarmasin Tengah",
    accreditation: "A",
    status: "Swasta",
    image: "/placeholder.svg?height=200&width=300&text=SD+Katolik+Santo+Antonius",
  },
  {
    id: 12,
    name: "SDN Gadang 2",
    address: "Jl. Gadang No. 34, Banjarmasin Tengah",
    level: "SD",
    district: "Banjarmasin Tengah",
    accreditation: "B",
    status: "Negeri",
    image: "/placeholder.svg?height=200&width=300&text=SDN+Gadang+2",
  },
]

export default function SchoolDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredSchools, setFilteredSchools] = useState(schoolsData)

  const schoolsPerPage = 9
  const totalSchools = 150 // Total schools in database
  const displayedSchools = filteredSchools.length

  // Filter function
  const applyFilters = () => {
    const filtered = schoolsData.filter((school) => {
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = !selectedLevel || selectedLevel === "Semua Jenjang" || school.level === selectedLevel
      const matchesDistrict =
        !selectedDistrict || selectedDistrict === "Semua Kecamatan" || school.district === selectedDistrict

      return matchesSearch && matchesLevel && matchesDistrict
    })

    setFilteredSchools(filtered)
    setCurrentPage(1)
  }

  // Pagination
  const indexOfLastSchool = currentPage * schoolsPerPage
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage
  const currentSchools = filteredSchools.slice(indexOfFirstSchool, indexOfLastSchool)
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage)

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Consistent with main page */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <ScrollReveal animation="fade-right" delay={0} triggerOnce={false}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <School className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground transition-colors duration-300 hover:text-primary">
                  SIMDIK Kota Banjarmasin
                </span>
              </div>
            </ScrollReveal>

            {/* Navigation */}
            <ScrollReveal animation="fade-left" delay={100} triggerOnce={false}>
              <nav className="hidden md:flex items-center space-x-8">
                {["Beranda", "Tentang SIMDIK", "Direktori Sekolah", "Berita", "Agenda", "Kontak"].map((item, index) => (
                  <Link
                    key={item}
                    href={
                      item === "Direktori Sekolah"
                        ? "/direktori-sekolah"
                        : item === "Tentang SIMDIK"
                          ? "/tentang-simdik"
                          : item === "Berita"
                            ? "/#berita"
                            : item === "Agenda"
                              ? "/#agenda"
                              : item === "Kontak"
                                ? "/#kontak"
                                : "/"
                    }
                    className={`font-medium transition-all duration-300 relative group ${
                      item === "Direktori Sekolah" ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                        item === "Direktori Sekolah" ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                ))}
              </nav>
            </ScrollReveal>

            {/* Mobile Menu Button and Theme Toggle */}
            <ScrollReveal animation="fade-left" delay={200} triggerOnce={false}>
              <div className="flex items-center space-x-2">
                <button className="md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-accent">
                  <Menu className="w-6 h-6 text-foreground" />
                </button>
                <ThemeToggle />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </header>

      {/* Page Title Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScrollReveal animation="fade-up" delay={0} duration={800}>
            <h1 className="text-3xl font-bold text-foreground">Direktori Sekolah di Kota Banjarmasin</h1>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <ScrollReveal animation="fade-right" delay={100} duration={800}>
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </Button>
            </Link>
          </ScrollReveal>
        </div>

        {/* Filter Section */}
        <ScrollReveal animation="fade-up" delay={200} duration={800}>
          <Card className="mb-8 bg-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Cari berdasarkan nama sekolah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Level Select */}
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenjang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semua Jenjang">Semua Jenjang</SelectItem>
                    <SelectItem value="SD">SD</SelectItem>
                    <SelectItem value="SMP">SMP</SelectItem>
                  </SelectContent>
                </Select>

                {/* District Select */}
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semua Kecamatan">Semua Kecamatan</SelectItem>
                    <SelectItem value="Banjarmasin Timur">Banjarmasin Timur</SelectItem>
                    <SelectItem value="Banjarmasin Barat">Banjarmasin Barat</SelectItem>
                    <SelectItem value="Banjarmasin Selatan">Banjarmasin Selatan</SelectItem>
                    <SelectItem value="Banjarmasin Utara">Banjarmasin Utara</SelectItem>
                    <SelectItem value="Banjarmasin Tengah">Banjarmasin Tengah</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filter Button */}
                <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
                  Terapkan Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Results Counter */}
        <ScrollReveal animation="fade-up" delay={300} duration={800}>
          <div className="mb-6">
            <p className="text-muted-foreground">
              Menampilkan {Math.min(displayedSchools, schoolsPerPage)} dari {displayedSchools} Sekolah
            </p>
          </div>
        </ScrollReveal>

        {/* School Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentSchools.map((school, index) => (
            <ScrollReveal key={school.id} animation="fade-up" delay={400 + index * 100} duration={800}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card border-2 border-transparent hover:border-blue-400">
                {/* School Image */}
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={school.image || "/placeholder.svg"}
                    alt={school.name}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>

                <CardContent className="p-6">
                  {/* School Name */}
                  <h3 className="text-xl font-bold text-foreground mb-2 transition-all duration-300 group-hover:text-blue-600">
                    {school.name}
                  </h3>

                  {/* Address */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{school.address}</p>

                  {/* Badges */}
                  <div className="flex gap-2 mb-4">
                    <Badge className={getAccreditationColor(school.accreditation)}>
                      Akreditasi {school.accreditation}
                    </Badge>
                    <Badge className={getStatusColor(school.status)}>Status: {school.status}</Badge>
                  </div>

                  {/* Detail Button */}
                  <Link href={`/direktori-sekolah/${school.id}`}>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 transform group-hover:scale-105"
                    >
                      Lihat Detail
                      <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <ScrollReveal animation="fade-up" delay={600} duration={800}>
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNumber = index + 1
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(pageNumber)
                          }}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Footer Section */}
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
                  {["Beranda", "Tentang SIMDIK", "Direktori Sekolah", "Berita", "Agenda", "Kontak"].map(
                    (item, index) => (
                      <li key={index}>
                        <Link
                          href={
                            item === "Direktori Sekolah"
                              ? "/direktori-sekolah"
                              : item === "Tentang SIMDIK"
                                ? "/tentang-simdik"
                                : item === "Berita"
                                  ? "/#berita"
                                  : item === "Agenda"
                                    ? "/#agenda"
                                    : item === "Kontak"
                                      ? "/#kontak"
                                      : "/"
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
    </div>
  )
}
