"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [showReportDetail, setShowReportDetail] = useState(false)

  const router = useRouter()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.notification-dropdown') && !target.closest('.notification-button')) {
        setShowNotifications(false)
      }
      if (!target.closest('.user-menu-dropdown') && !target.closest('.user-menu-button')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Data untuk Chart.js
  const chartData = {
    labels: ['Reservasi', 'Sekolah', 'Berita', 'Agenda'],
    datasets: [
      {
        label: 'Total Data',
        data: [0, 0, 0, 0], // Data akan diisi dari API
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Sembunyikan legenda
      },
      title: {
        display: true,
        text: 'Total Data Sistem',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  }

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

  const handleExportReport = () => {
    // Simulasi export laporan
    alert('Fitur Export Laporan akan segera tersedia!\n\nLaporan akan diexport dalam format PDF/Excel.')
    // TODO: Implementasi export ke PDF/Excel
  }

  const handleImportData = () => {
    // Simulasi import data
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls,.csv'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        alert(`File "${file.name}" siap diupload!\n\nFitur import data akan segera diimplementasikan.`)
        // TODO: Implementasi upload dan parsing file
      }
    }
    input.click()
  }

  const handleViewReportDetail = (report: any) => {
    setSelectedReport(report)
    setShowReportDetail(true)
  }

  const handleCloseReportDetail = () => {
    setShowReportDetail(false)
    setSelectedReport(null)
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
      value: "0",
      icon: School,
      color: "blue",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Berita",
      value: "0",
      icon: Newspaper,
      color: "green",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Agenda",
      value: "0",
      icon: Calendar,
      color: "yellow",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Total Reservasi",
      value: "0",
      icon: FileText,
      color: "red",
      bgColor: "bg-red-100",
    },
  ]

  const reportsData: any[] = []

  return (
    <div className="flex h-screen bg-background">
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`bg-sidebar text-sidebar-foreground transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
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
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <School className="w-6 h-6 text-white" />
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
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                      item.active
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md"
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-6 h-6 flex-shrink-0" />
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
            className={`w-full ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'} text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105 transition-all duration-200`}
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
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
            <div className="flex items-center space-x-2 lg:space-x-4 relative">
              {/* Notification Button */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-accent hover:scale-105 transition-all duration-200 relative notification-button"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 notification-dropdown">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold">Notifikasi</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 hover:bg-accent cursor-pointer border-b border-border">
                        <p className="text-sm font-medium">Laporan Baru Masuk</p>
                        <p className="text-xs text-muted-foreground mt-1">Ahmad Fauzi melaporkan kerusakan atap</p>
                        <p className="text-xs text-muted-foreground mt-1">5 menit yang lalu</p>
                      </div>
                      <div className="p-4 hover:bg-accent cursor-pointer border-b border-border">
                        <p className="text-sm font-medium">Data Sekolah Diupdate</p>
                        <p className="text-xs text-muted-foreground mt-1">SDN Sungai Miai 5 memperbarui data</p>
                        <p className="text-xs text-muted-foreground mt-1">1 jam yang lalu</p>
                      </div>
                      <div className="p-4 hover:bg-accent cursor-pointer">
                        <p className="text-sm font-medium">Sistem Maintenance</p>
                        <p className="text-xs text-muted-foreground mt-1">Maintenance terjadwal besok pukul 02:00</p>
                        <p className="text-xs text-muted-foreground mt-1">3 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="p-3 border-t border-border text-center">
                      <button className="text-sm text-blue-600 hover:underline">Lihat Semua Notifikasi</button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu Button */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-accent hover:scale-105 transition-all duration-200 user-menu-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs lg:text-sm font-medium text-white">A</span>
                  </div>
                  <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 ml-1 lg:ml-2" />
                </Button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 user-menu-dropdown">
                    <div className="p-4 border-b border-border">
                      <p className="font-semibold">Admin User</p>
                      <p className="text-xs text-muted-foreground">admin@simdik.com</p>
                    </div>
                    <div className="p-2">
                      <button 
                        className="w-full text-left px-3 py-2 hover:bg-accent rounded-md text-sm"
                        onClick={() => alert('Fitur Profile akan segera tersedia')}
                      >
                        Profile Saya
                      </button>
                      <button 
                        className="w-full text-left px-3 py-2 hover:bg-accent rounded-md text-sm"
                        onClick={() => alert('Fitur Pengaturan akan segera tersedia')}
                      >
                        Pengaturan
                      </button>
                      <button 
                        className="w-full text-left px-3 py-2 hover:bg-accent rounded-md text-sm"
                        onClick={() => alert('Fitur Bantuan akan segera tersedia')}
                      >
                        Bantuan
                      </button>
                      <div className="border-t border-border my-2"></div>
                      <button 
                        className="w-full text-left px-3 py-2 hover:bg-accent rounded-md text-sm text-red-600"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              <Button 
                className="hover:scale-105 transition-all duration-200"
                onClick={handleExportReport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Laporan
              </Button>
              <Button 
                variant="outline" 
                className="hover:scale-105 transition-all duration-200 bg-transparent"
                onClick={handleImportData}
              >
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
                <Card key={index} className="hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 ${bgColor} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${textColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Chart.js Bar Chart */}
          <Card className="mb-8 bg-card text-foreground">
            <CardHeader>
              <CardTitle>Statistik Total Data Sistem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px] flex items-center justify-center">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card className="bg-card text-foreground">
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
                  {reportsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Belum ada laporan masuk
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportsData.slice(0, 5).map((report) => {
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
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.reporter}</TableCell>
                          <TableCell>{report.category}</TableCell>
                          <TableCell>
                            <Badge className={statusColor}>{report.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewReportDetail(report)}
                            >
                              Lihat Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modal Detail Laporan */}
      {showReportDetail && selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">Detail Laporan</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCloseReportDetail}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Laporan</p>
                  <p className="text-lg font-semibold">{selectedReport.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={selectedReport.statusColor}>{selectedReport.status}</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Judul Laporan</p>
                <p className="text-lg font-semibold">{selectedReport.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pelapor</p>
                  <p className="font-medium">{selectedReport.reporter}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Kontak</p>
                  <p className="font-medium">{selectedReport.contact}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sekolah</p>
                  <p className="font-medium">{selectedReport.school}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tanggal Laporan</p>
                  <p className="font-medium">{selectedReport.reportDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                  <p className="font-medium">{selectedReport.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prioritas</p>
                  <Badge variant={selectedReport.priority === 'Tinggi' ? 'destructive' : 'secondary'}>
                    {selectedReport.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Deskripsi</p>
                <p className="text-base mt-2 bg-accent/50 p-4 rounded-lg">{selectedReport.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Bukti/Lampiran</p>
                <div className="mt-2 p-3 bg-accent/50 rounded-lg flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{selectedReport.evidence}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCloseReportDetail}
              >
                Tutup
              </Button>
              <Button 
                variant="default"
                onClick={() => alert('Fitur update status akan segera tersedia')}
              >
                Update Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
