"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Calendar,
  MapPin,
  Filter,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

export default function AgendaManagement() {
  const [agendas, setAgendas] = useState<Agenda[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAgenda, setEditingAgenda] = useState<Agenda | null>(null)
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
        await fetchAgendas()
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
          status: "SCHEDULED" as 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED',
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
  const handleDelete = async (agendaId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/agendas/${agendaId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        await fetchAgendas()
      } else {
        console.error('Failed to delete agenda:', result.message)
        alert('Gagal menghapus agenda: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting agenda:', error)
      alert('Terjadi kesalahan saat menghapus agenda')
    }
  }

  // Statistics
  const stats = {
    total: agendas.length,
    ongoing: agendas.filter(a => a.status === 'ONGOING').length,
    completed: agendas.filter(a => a.status === 'COMPLETED').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Agenda</h1>
          <p className="text-gray-600">Kelola agenda dan kegiatan</p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari agenda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
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
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gray-800 hover:bg-gray-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Agenda
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Agenda</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Berlangsung</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.ongoing}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selesai</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agenda Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
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
                  {filteredAgendas.map((agenda, index) => (
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
                        <Badge className={cn(statusColors[agenda.status])}>
                          {statusLabels[agenda.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`/agenda/${agenda.slug}`, '_blank')}
                            title="Lihat di Frontend"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(agenda)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(agenda.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Agenda Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Agenda Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Judul Agenda *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Akan dibuat otomatis jika kosong"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Tanggal *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Waktu *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Lokasi *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="organizer">Penyelenggara</Label>
                    <Input
                      id="organizer"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="capacity">Kapasitas</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Pelatihan">Pelatihan</SelectItem>
                        <SelectItem value="Kompetisi">Kompetisi</SelectItem>
                        <SelectItem value="Rapat">Rapat</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="registrationFee">Biaya Pendaftaran</Label>
                    <Input
                      id="registrationFee"
                      value={formData.registrationFee}
                      onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactPerson">Kontak</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Email atau nomor telepon"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">URL Gambar</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Terjadwal</SelectItem>
                      <SelectItem value="ONGOING">Berlangsung</SelectItem>
                      <SelectItem value="COMPLETED">Selesai</SelectItem>
                      <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Simpan Agenda</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Agenda Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Agenda</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Judul Agenda *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-slug">Slug (URL)</Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Akan dibuat otomatis jika kosong"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Deskripsi</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-date">Tanggal *</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-time">Waktu *</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Lokasi *</Label>
                  <Input
                    id="edit-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-address">Alamat Lengkap</Label>
                  <Input
                    id="edit-address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-organizer">Penyelenggara</Label>
                    <Input
                      id="edit-organizer"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-capacity">Kapasitas</Label>
                    <Input
                      id="edit-capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Kategori</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Pelatihan">Pelatihan</SelectItem>
                        <SelectItem value="Kompetisi">Kompetisi</SelectItem>
                        <SelectItem value="Rapat">Rapat</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-registrationFee">Biaya Pendaftaran</Label>
                    <Input
                      id="edit-registrationFee"
                      value={formData.registrationFee}
                      onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-contactPerson">Kontak</Label>
                  <Input
                    id="edit-contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Email atau nomor telepon"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-imageUrl">URL Gambar</Label>
                  <Input
                    id="edit-imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Terjadwal</SelectItem>
                      <SelectItem value="ONGOING">Berlangsung</SelectItem>
                      <SelectItem value="COMPLETED">Selesai</SelectItem>
                      <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Agenda</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
