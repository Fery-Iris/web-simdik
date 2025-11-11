"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  School,
  FileText,
  Menu,
  X,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  Bell,
  ChevronDown,
  Home,
  Newspaper,
  Calendar,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        // Redirect to login page
        router.push('/login')
      } else {
        alert('Gagal logout. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Logout error:', error)
      alert('Terjadi kesalahan saat logout.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard", active: true },
    { icon: School, label: "Manajemen Sekolah", href: "/admin/schools", active: false },
    { icon: Newspaper, label: "Manajemen Berita", href: "/admin/news", active: false },
    { icon: Calendar, label: "Manajemen Agenda", href: "/admin/agenda", active: false },
    { icon: Calendar, label: "Laporan Reservasi", href: "/admin/reservations", active: false },
    { icon: FileText, label: "Manajemen Tentang SIMDIK", href: "/admin/tentang-simdik", active: false },
  ]

  const statsData = [
    {
      title: "Total Sekolah",
      value: "156",
      icon: School,
      color: "blue",
      bgColor: "bg-blue-100",
    },
    {
      title: "Sekolah Aktif",
      value: "142",
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-100",
    },
    {
      title: "Akreditasi A",
      value: "89",
      icon: FileText,
      color: "yellow",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Perlu Review",
      value: "12",
      icon: AlertCircle,
      color: "red",
      bgColor: "bg-red-100",
    },
  ]

  const reportsData = [
    {
      id: "RPT-001",
      title: "Kerusakan Atap Ruang Kelas",
      reporter: "Ahmad Fauzi",
      school: "SDN Sungai Miai 5",
      category: "Fasilitas",
      priority: "Tinggi",
      description: "Atap ruang kelas 3A bocor saat hujan, mengganggu proses pembelajaran",
      reportDate: "2024-01-15",
      status: "Baru",
      statusColor: "bg-blue-100 text-blue-800",
      contact: "081234567890",
      evidence: "foto_atap_bocor.jpg",
    },
    {
      id: "RPT-002",
      title: "Kekurangan Buku Pelajaran",
      reporter: "Siti Nurhaliza",
      school: "SMPN 1 Banjarmasin",
      category: "Kurikulum",
      priority: "Sedang",
      description: "Kekurangan buku pelajaran Matematika untuk kelas 8, hanya tersedia 20 dari 35 yang dibutuhkan",
      reportDate: "2024-01-12",
      status: "Diproses",
      statusColor: "bg-yellow-100 text-yellow-800",
      contact: "081345678901",
      evidence: "daftar_buku.pdf",
    },
    {
      id: "RPT-003",
      title: "Guru Honorer Belum Menerima Gaji",
      reporter: "Budi Santoso",
      school: "SMAN 3 Banjarmasin",
      category: "Tenaga Pengajar",
      priority: "Tinggi",
      description: "3 guru honorer belum menerima gaji bulan Desember 2023",
      reportDate: "2024-01-10",
      status: "Selesai",
      statusColor: "bg-green-100 text-green-800",
      contact: "081456789012",
      evidence: "slip_gaji.pdf",
    },
    {
      id: "RPT-004",
      title: "Masalah Sistem Absensi Online",
      reporter: "Maya Sari",
      school: "SDN Kelayan Tengah 2",
      category: "Administrasi",
      priority: "Sedang",
      description: "Sistem absensi online sering error dan tidak dapat menyimpan data kehadiran siswa",
      reportDate: "2024-01-08",
      status: "Baru",
      statusColor: "bg-blue-100 text-blue-800",
      contact: "081567890123",
      evidence: "screenshot_error.png",
    },
    {
      id: "RPT-005",
      title: "Toilet Siswa Rusak",
      reporter: "Rizki Pratama",
      school: "SDN Sungai Miai 5",
      category: "Fasilitas",
      priority: "Tinggi",
      description: "2 dari 4 toilet siswa rusak dan tidak dapat digunakan",
      reportDate: "2024-01-05",
      status: "Ditolak",
      statusColor: "bg-red-100 text-red-800",
      contact: "081678901234",
      evidence: "foto_toilet.jpg",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`bg-sidebar text-sidebar-foreground transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        } flex flex-col fixed lg:relative z-50 h-full ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="lg:hidden absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && <span className="text-xl font-bold">SIMDIK Admin</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              return (
                <li key={index}>
                  <button
                    onClick={() => {
                      router.push(item.href)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                      item.active
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="ml-3">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex hover:bg-accent hover:scale-105 transition-all duration-200"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-lg lg:text-xl font-semibold text-foreground">Dashboard</h2>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Ringkasan data dan statistik sistem pendidikan
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="hover:bg-accent hover:scale-105 transition-all duration-200">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-accent hover:scale-105 transition-all duration-200">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs lg:text-sm font-medium text-white">A</span>
                </div>
                <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 ml-1 lg:ml-2" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Ringkasan data dan statistik sistem pendidikan</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="admin-button-hover">
                <Download className="w-4 h-4 mr-2" />
                Export Laporan
              </Button>
              <Button variant="outline" className="admin-button-hover bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {statsData.map((stat, index) => {
              const Icon = stat.icon
              let textColor = ""
              let bgColor = ""

              switch (stat.color) {
                case "blue":
                  textColor = "text-chart-1"
                  bgColor = "bg-chart-1/10"
                  break
                case "green":
                  textColor = "text-chart-2"
                  bgColor = "bg-chart-2/10"
                  break
                case "yellow":
                  textColor = "text-chart-3"
                  bgColor = "bg-chart-3/10"
                  break
                case "red":
                  textColor = "text-destructive"
                  bgColor = "bg-destructive/10"
                  break
                default:
                  textColor = "text-gray-600"
                  bgColor = "bg-gray-100"
              }
              return (
                <Card key={index} className="admin-stats-card admin-card-interactive">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 ${bgColor} rounded-lg flex items-center justify-center admin-icon-hover`}
                      >
                        <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${textColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Reports Table */}
          <Card className="bg-card text-foreground admin-content-card">
            <CardHeader>
              <CardTitle>Laporan Masuk Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Laporan</TableHead>
                    <TableHead>Pelapor</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsData.slice(0, 5).map((report, index) => {
                    let statusColor = ""
                    switch (report.status) {
                      case "Baru":
                        statusColor = "bg-blue-600 text-white"
                        break
                      case "Diproses":
                        statusColor = "bg-yellow-600 text-white"
                        break
                      case "Selesai":
                        statusColor = "bg-green-600 text-white"
                        break
                      case "Ditolak":
                        statusColor = "bg-red-600 text-white"
                        break
                      default:
                        statusColor = "bg-gray-600 text-white"
                    }
                    return (
                      <TableRow key={report.id} className="admin-table-row">
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.reporter}</TableCell>
                        <TableCell>{report.category}</TableCell>
                        <TableCell>
                          <Badge className={statusColor}>{report.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="admin-button-hover">
                            Lihat Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
