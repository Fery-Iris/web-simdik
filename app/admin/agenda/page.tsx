"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AgendaForm } from "@/components/agenda-form"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  School,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronDown,
  Home,
  Newspaper,
  Calendar,
  FileText,
} from "lucide-react"

interface Agenda {
  id: string
  title: string
  slug: string
  description: string
  date: string
  time: string
  location: string
  address?: string
  organizer: string
  capacity: number
  category: string
  registrationFee: string
  contactPerson?: string
  imageUrl?: string
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

const statusLabels = {
  SCHEDULED: 'Terjadwal',
  ONGOING: 'Berlangsung',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan'
}

const statusColors = {
  SCHEDULED: 'bg-orange-100 text-orange-800',
  ONGOING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

export default function AgendaPage() {
  const router = useRouter()
  const [agendas, setAgendas] = useState<Agenda[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingAgenda, setEditingAgenda] = useState<Agenda | null>(null)
  const [viewingAgenda, setViewingAgenda] = useState<Agenda | null>(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    date: "",
    time: "",
    location: "",
    address: "",
    organizer: "Dinas Pendidikan Kota Banjarmasin",
    capacity: 0,
    category: "Lainnya",
    registrationFee: "Gratis",
    contactPerson: "",
    imageUrl: "",
    status: "SCHEDULED" as 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED',
  })

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard", active: false },
    { icon: School, label: "Manajemen Sekolah", href: "/admin/schools", active: false },
    { icon: Newspaper, label: "Manajemen Berita", href: "/admin/news", active: false },
    { icon: Clock, label: "Manajemen Agenda", href: "/admin/agenda", active: true },
    { icon: Calendar, label: "Laporan Reservasi", href: "/admin/reservations", active: false },
    { icon: FileText, label: "Manajemen Tentang SIMDIK", href: "/admin/tentang-simdik", active: false },
  ]

  // Fetch agendas
  const fetchAgendas = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agendas')
      const result = await response.json()
      
      if (result.success) {
        setAgendas(result.data)
      } else {
        console.error('Failed to fetch agendas:', result.message)
      }
    } catch (error) {
      console.error('Error fetching agendas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgendas()
  }, [])

  // Filter agendas
  const filteredAgendas = agendas.filter(agenda => {
    const matchesSearch = agenda.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agenda.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || statusFilter === "all" || agenda.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingAgenda ? `/api/agendas/${editingAgenda.id}` : '/api/agendas'
      const method = editingAgenda ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchAgendas() // Refresh the list
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        setEditingAgenda(null)
        setFormData({
          title: "",
          slug: "",
          description: "",
          date: "",
          time: "",
          location: "",
          address: "",
          organizer: "Dinas Pendidikan Kota Banjarmasin",
          capacity: 0,
          category: "Lainnya",
          registrationFee: "Gratis",
          contactPerson: "",
          imageUrl: "",
          status: "SCHEDULED",
        })
      } else {
        console.error('Failed to save agenda:', result.message)
        alert('Gagal menyimpan agenda: ' + result.message)
      }
    } catch (error) {
      console.error('Error saving agenda:', error)
      alert('Terjadi kesalahan saat menyimpan agenda')
    }
  }

  // Handle edit
  const handleEdit = (agenda: Agenda) => {
    setEditingAgenda(agenda)
    setFormData({
      title: agenda.title,
      slug: agenda.slug,
      description: agenda.description,
      date: agenda.date.split('T')[0], // Convert to YYYY-MM-DD format
      time: agenda.time,
      location: agenda.location,
      address: agenda.address || "",
      organizer: agenda.organizer,
      capacity: agenda.capacity,
      category: agenda.category,
      registrationFee: agenda.registrationFee,
      contactPerson: agenda.contactPerson || "",
      imageUrl: agenda.imageUrl || "",
      status: agenda.status,
    })
    setIsEditDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/agendas/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        fetchAgendas() // Refresh the list
      } else {
        console.error('Failed to delete agenda:', result.message)
        alert('Gagal menghapus agenda: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting agenda:', error)
      alert('Terjadi kesalahan saat menghapus agenda')
    }
  }

  // Handle view (fetch latest from API before showing)
  const handleView = async (id: string) => {
    try {
      setViewLoading(true)
      setIsViewDialogOpen(true)
      const response = await fetch(`/api/agendas/${id}`)
      const result = await response.json()
      if (result.success) {
        setViewingAgenda(result.data)
      } else {
        console.error('Failed to fetch agenda detail:', result.message)
        alert('Gagal memuat detail agenda: ' + result.message)
        setIsViewDialogOpen(false)
      }
    } catch (error) {
      console.error('Error fetching agenda detail:', error)
      alert('Terjadi kesalahan saat memuat detail agenda')
      setIsViewDialogOpen(false)
    } finally {
      setViewLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      date: "",
      time: "",
      location: "",
      address: "",
      organizer: "Dinas Pendidikan Kota Banjarmasin",
      capacity: 0,
      category: "Lainnya",
      registrationFee: "Gratis",
      contactPerson: "",
      imageUrl: "",
      status: "SCHEDULED",
    })
    setEditingAgenda(null)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
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
                        if (item.label === "Manajemen Agenda") return
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
                  <h2 className="text-lg lg:text-xl font-semibold text-foreground">Manajemen Agenda</h2>
                  <p className="text-sm text-muted-foreground hidden sm:block">Kelola agenda dan kegiatan</p>
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
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data agenda...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
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
                      if (item.label === "Manajemen Agenda") return
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
                <h2 className="text-lg lg:text-xl font-semibold text-foreground">Manajemen Agenda</h2>
                <p className="text-sm text-muted-foreground hidden sm:block">Kelola agenda dan kegiatan</p>
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
          
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Agenda</h1>
                <p className="text-gray-600">Kelola agenda dan kegiatan pendidikan</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={resetForm}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Agenda
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Agenda Baru</DialogTitle>
                </DialogHeader>
                <AgendaForm 
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setIsAddDialogOpen(false)
                    resetForm()
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Agenda</p>
                  <p className="text-2xl font-bold text-gray-900">{agendas.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Berlangsung</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agendas.filter(a => a.status === 'ONGOING').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agendas.filter(a => a.status === 'COMPLETED').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari berdasarkan judul atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="SCHEDULED">Terjadwal</SelectItem>
                  <SelectItem value="ONGOING">Berlangsung</SelectItem>
                  <SelectItem value="COMPLETED">Selesai</SelectItem>
                  <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Agenda Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Kapasitas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgendas.map((agenda) => (
                  <TableRow key={agenda.id}>
                    <TableCell className="font-medium">{agenda.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {agenda.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(agenda.date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{agenda.time}</TableCell>
                    <TableCell>{agenda.location}</TableCell>
                    <TableCell>{agenda.capacity > 0 ? `${agenda.capacity} orang` : 'Tidak terbatas'}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[agenda.status]}>
                        {statusLabels[agenda.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 bg-transparent"
                          onClick={() => window.open(`/agenda/${agenda.slug}`, '_blank')}
                          title="Lihat di Frontend"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 bg-transparent"
                          onClick={() => handleEdit(agenda)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDelete(agenda.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Agenda</DialogTitle>
            </DialogHeader>
            <AgendaForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsEditDialogOpen(false)
                resetForm()
              }}
            />
          </DialogContent>
        </Dialog>
        
        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={(open) => {
          setIsViewDialogOpen(open)
          if (!open) setViewingAgenda(null)
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Agenda</DialogTitle>
            </DialogHeader>
            {viewLoading ? (
              <div className="py-8 text-center text-gray-600">Memuat detail...</div>
            ) : viewingAgenda ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Judul</Label>
                    <div className="font-semibold text-gray-900">{viewingAgenda.title}</div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tanggal</Label>
                    <div className="text-gray-900">{new Date(viewingAgenda.date).toLocaleDateString('id-ID')}</div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Waktu</Label>
                    <div className="text-gray-900">{viewingAgenda.time}</div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Lokasi</Label>
                    <div className="text-gray-900">{viewingAgenda.location}</div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-600">Status</Label>
                    <div>
                      <Badge className={statusColors[viewingAgenda.status]}>
                        {statusLabels[viewingAgenda.status]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-600">Data tidak tersedia</div>
            )}
            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Tutup
              </Button>
              {viewingAgenda && (
                <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                  setIsViewDialogOpen(false)
                  handleEdit(viewingAgenda)
                }}>
                  Edit
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </main>
      </div>
    </div>
  )
}

