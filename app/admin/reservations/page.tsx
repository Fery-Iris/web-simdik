"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  School,
  FileText,
  Menu,
  X,
  Eye,
  Download,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  Bell,
  ChevronDown,
  Home,
  Newspaper,
  Calendar,
  XCircle,
  Phone,
  User,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Save,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Reservation {
  id: string
  queueNumber: string
  service: string
  name: string
  phone: string
  nik?: string
  purpose: string
  date: string
  timeSlot: string
  status: string
  createdAt: string
  estimatedCallTime?: string
}

export default function AdminReservationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [deleteReservation, setDeleteReservation] = useState<Reservation | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")

  const router = useRouter()

  // Fetch reservations from API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reservations')
        if (response.ok) {
          const data = await response.json()
          setReservations(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching reservations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard", active: false },
    { icon: School, label: "Manajemen Sekolah", href: "/admin/schools", active: false },
    { icon: Newspaper, label: "Manajemen Berita", href: "/admin/news", active: false },
    { icon: Calendar, label: "Manajemen Agenda", href: "/admin/agenda", active: false },
    { icon: Calendar, label: "Laporan Reservasi", href: "/admin/reservations", active: true },
    { icon: FileText, label: "Manajemen Tentang SIMDIK", href: "/admin/tentang-simdik", active: false },
  ]

  // Filter reservations based on selected filters
  const filteredReservations = reservations.filter(reservation => {
    const statusMatch = statusFilter === "all" || reservation.status === statusFilter
    const serviceMatch = serviceFilter === "all" || reservation.service === serviceFilter
    return statusMatch && serviceMatch
  })

  // Calculate statistics
  const stats = {
    total: reservations.length,
    completed: reservations.filter(r => r.status === "completed").length,
    waiting: reservations.filter(r => r.status === "waiting").length,
    cancelled: reservations.filter(r => r.status === "cancelled").length,
  }

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setIsDetailOpen(true)
  }

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      })

      if (response.ok) {
        // Update local state
        setReservations(prev => 
          prev.map(res => 
            res.id === reservationId 
              ? { ...res, status: newStatus }
              : res
          )
        )
        setIsDetailOpen(false)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation({ ...reservation })
    setIsEditOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingReservation) return

    try {
      const response = await fetch(`/api/reservations/${editingReservation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingReservation.name,
          phone: editingReservation.phone,
          nik: editingReservation.nik,
          purpose: editingReservation.purpose,
          service: editingReservation.service,
          date: editingReservation.date,
          timeSlot: editingReservation.timeSlot,
          status: editingReservation.status.toUpperCase(),
        }),
      })

      if (response.ok) {
        // Update local state
        setReservations(prev => 
          prev.map(res => 
            res.id === editingReservation.id 
              ? { ...editingReservation, status: editingReservation.status.toLowerCase() }
              : res
          )
        )
        setIsEditOpen(false)
        setEditingReservation(null)
      }
    } catch (error) {
      console.error('Error updating reservation:', error)
    }
  }

  const handleDeleteReservation = (reservation: Reservation) => {
    setDeleteReservation(reservation)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteReservation) return

    try {
      const response = await fetch(`/api/reservations/${deleteReservation.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setReservations(prev => 
          prev.filter(res => res.id !== deleteReservation.id)
        )
        setIsDeleteOpen(false)
        setDeleteReservation(null)
      }
    } catch (error) {
      console.error('Error deleting reservation:', error)
    }
  }

  const getServiceName = (service: string) => {
    const serviceNames: Record<string, string> = {
      ptk: "PTK (Pendidik dan Tenaga Kependidikan)",
      sd: "SD Umum",
      smp: "SMP Umum",
      paud: "PAUD",
    }
    return serviceNames[service] || service
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "called":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Selesai"
      case "waiting":
        return "Menunggu"
      case "called":
        return "Dipanggil"
      case "cancelled":
        return "Dibatalkan"
      default:
        return status
    }
  }

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
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
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
                <h2 className="text-lg lg:text-xl font-semibold text-foreground">Laporan Reservasi</h2>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Kelola dan tindak lanjuti reservasi layanan dari masyarakat
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
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
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Laporan Reservasi</h1>
              <p className="text-muted-foreground mt-2">
                Kelola dan tindak lanjuti reservasi layanan dari masyarakat
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="border-blue-200 hover:border-blue-400 bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Reservation Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reservasi</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Selesai</p>
                    <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Menunggu</p>
                    <p className="text-2xl font-bold text-foreground">{stats.waiting}</p>
                  </div>
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dibatalkan</p>
                    <p className="text-2xl font-bold text-foreground">{stats.cancelled}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="status-filter">Filter Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="waiting">Menunggu</SelectItem>
                  <SelectItem value="called">Dipanggil</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="service-filter">Filter Layanan</Label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Layanan</SelectItem>
                  <SelectItem value="ptk">PTK</SelectItem>
                  <SelectItem value="sd">SD Umum</SelectItem>
                  <SelectItem value="smp">SMP Umum</SelectItem>
                  <SelectItem value="paud">PAUD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reservations Table */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-muted">
              <CardTitle className="text-foreground">Daftar Reservasi</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Memuat data...</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          No. Tiket
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Layanan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tanggal & Waktu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tujuan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
                      {filteredReservations.map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                            {reservation.queueNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {reservation.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                              {getServiceName(reservation.service)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">{reservation.date}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.timeSlot}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                              {reservation.purpose}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={cn(
                                "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                getStatusColor(reservation.status)
                              )}
                            >
                              {getStatusText(reservation.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 hover:text-blue-700 bg-transparent"
                                onClick={() => handleViewDetails(reservation)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700 bg-transparent"
                                onClick={() => handleEditReservation(reservation)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                                onClick={() => handleDeleteReservation(reservation)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Reservasi</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">No. Tiket</Label>
                  <p className="text-lg font-semibold text-blue-600">{selectedReservation.queueNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <span
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        getStatusColor(selectedReservation.status)
                      )}
                    >
                      {getStatusText(selectedReservation.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nama Lengkap</Label>
                  <p className="text-sm">{selectedReservation.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nomor HP</Label>
                  <p className="text-sm">{selectedReservation.phone}</p>
                </div>
              </div>

              {selectedReservation.nik && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">NIK</Label>
                  <p className="text-sm">{selectedReservation.nik}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Layanan</Label>
                <p className="text-sm">{getServiceName(selectedReservation.service)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tanggal</Label>
                  <p className="text-sm">{selectedReservation.date}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Waktu</Label>
                  <p className="text-sm">{selectedReservation.timeSlot}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tujuan Kunjungan</Label>
                <p className="text-sm">{selectedReservation.purpose}</p>
              </div>

              {selectedReservation.estimatedCallTime && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estimasi Panggilan</Label>
                  <p className="text-sm">{selectedReservation.estimatedCallTime}</p>
                </div>
              )}

              {/* Status Update Actions */}
              {selectedReservation.status === "waiting" && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-muted-foreground mb-3 block">Update Status</Label>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusUpdate(selectedReservation.id, "called")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Panggil
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedReservation.id, "completed")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Selesai
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedReservation.id, "cancelled")}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      Batalkan
                    </Button>
                  </div>
                </div>
              )}

              {selectedReservation.status === "called" && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-muted-foreground mb-3 block">Update Status</Label>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusUpdate(selectedReservation.id, "completed")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Selesai
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedReservation.id, "cancelled")}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      Batalkan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Reservasi</DialogTitle>
          </DialogHeader>
          {editingReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nama Lengkap</Label>
                  <Input
                    id="edit-name"
                    value={editingReservation.name}
                    onChange={(e) => setEditingReservation({ ...editingReservation, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Nomor HP</Label>
                  <Input
                    id="edit-phone"
                    value={editingReservation.phone}
                    onChange={(e) => setEditingReservation({ ...editingReservation, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-nik">NIK (Opsional)</Label>
                <Input
                  id="edit-nik"
                  value={editingReservation.nik || ''}
                  onChange={(e) => setEditingReservation({ ...editingReservation, nik: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-service">Layanan</Label>
                <Select
                  value={editingReservation.service}
                  onValueChange={(value) => setEditingReservation({ ...editingReservation, service: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ptk">PTK (Pendidik dan Tenaga Kependidikan)</SelectItem>
                    <SelectItem value="sd">SD Umum</SelectItem>
                    <SelectItem value="smp">SMP Umum</SelectItem>
                    <SelectItem value="paud">PAUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">Tanggal</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingReservation.date}
                    onChange={(e) => setEditingReservation({ ...editingReservation, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-time">Waktu</Label>
                  <Select
                    value={editingReservation.timeSlot}
                    onValueChange={(value) => setEditingReservation({ ...editingReservation, timeSlot: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00 - 09:00</SelectItem>
                      <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                      <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                      <SelectItem value="11:00">11:00 - 12:00</SelectItem>
                      <SelectItem value="14:00">14:00 - 15:00</SelectItem>
                      <SelectItem value="15:00">15:00 - 16:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-purpose">Tujuan Kunjungan</Label>
                <Textarea
                  id="edit-purpose"
                  value={editingReservation.purpose}
                  onChange={(e) => setEditingReservation({ ...editingReservation, purpose: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingReservation.status}
                  onValueChange={(value) => setEditingReservation({ ...editingReservation, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Menunggu</SelectItem>
                    <SelectItem value="called">Dipanggil</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          {deleteReservation && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Apakah Anda yakin ingin menghapus reservasi ini?
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-medium">{deleteReservation.queueNumber}</p>
                <p className="text-sm text-muted-foreground">{deleteReservation.name}</p>
                <p className="text-sm text-muted-foreground">{getServiceName(deleteReservation.service)}</p>
              </div>
              <p className="text-sm text-red-600">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
