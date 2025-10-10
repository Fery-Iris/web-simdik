"use client"

import { useState } from "react"
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
  School,
  FileText,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
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
  XCircle,
  Filter,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false)
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState(null)
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false)
  const [isEditNewsOpen, setIsEditNewsOpen] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [isAddAgendaOpen, setIsAddAgendaOpen] = useState(false)
  const [isEditAgendaOpen, setIsEditAgendaOpen] = useState(false)
  const [editingAgenda, setEditingAgenda] = useState(null)

  const [schoolsData, setSchoolsData] = useState([
    {
      id: "SCH-001",
      name: "SDN Sungai Miai 5",
      npsn: "30200001",
      address: "Jl. Sungai Miai No. 15, Banjarmasin Utara",
      principal: "Dra. Siti Aminah",
      phone: "0511-3256789",
      email: "sdn.sungaimiai5@gmail.com",
      status: "Aktif",
      accreditation: "A",
      studentCount: 245,
      teacherCount: 18,
    },
    {
      id: "SCH-002",
      name: "SMPN 1 Banjarmasin",
      npsn: "30200002",
      address: "Jl. Lambung Mangkurat No. 1, Banjarmasin Tengah",
      principal: "Drs. Ahmad Fauzi, M.Pd",
      phone: "0511-3354321",
      email: "smpn1bjm@gmail.com",
      status: "Aktif",
      accreditation: "A",
      studentCount: 680,
      teacherCount: 45,
    },
    {
      id: "SCH-003",
      name: "SMAN 3 Banjarmasin",
      npsn: "30200003",
      address: "Jl. Mistar Cokrokusumo No. 1A, Banjarmasin Barat",
      principal: "Dr. Budi Santoso, S.Pd, M.M",
      phone: "0511-3267890",
      email: "sman3bjm@gmail.com",
      status: "Aktif",
      accreditation: "A",
      studentCount: 920,
      teacherCount: 62,
    },
    {
      id: "SCH-004",
      name: "SDN Kelayan Tengah 2",
      npsn: "30200004",
      address: "Jl. Kelayan Tengah No. 8, Banjarmasin Selatan",
      principal: "Hj. Nurlaila, S.Pd",
      phone: "0511-3445678",
      email: "sdn.kelayantengah2@gmail.com",
      status: "Nonaktif",
      accreditation: "B",
      studentCount: 180,
      teacherCount: 12,
    },
  ])

  const [newsData, setNewsData] = useState([
    {
      id: "NEWS-001",
      title: "Pembukaan Tahun Ajaran Baru 2024/2025",
      content:
        "Dinas Pendidikan Kota Banjarmasin mengumumkan pembukaan tahun ajaran baru 2024/2025 yang akan dimulai pada tanggal 15 Juli 2024. Seluruh sekolah di wilayah Banjarmasin diharapkan sudah siap menyambut siswa baru.",
      author: "Admin SIMDIK",
      category: "Pengumuman",
      status: "Published",
      publishDate: "2024-07-01",
      views: 1250,
      featured: true,
    },
    {
      id: "NEWS-002",
      title: "Workshop Peningkatan Kompetensi Guru",
      content:
        "Akan dilaksanakan workshop peningkatan kompetensi guru se-Kota Banjarmasin pada tanggal 20-22 Juli 2024 di Gedung Dinas Pendidikan. Workshop ini bertujuan untuk meningkatkan kualitas pembelajaran.",
      author: "Tim Pengembangan",
      category: "Kegiatan",
      status: "Published",
      publishDate: "2024-06-28",
      views: 890,
      featured: false,
    },
    {
      id: "NEWS-003",
      title: "Penerimaan Peserta Didik Baru (PPDB) 2024",
      content:
        "Informasi lengkap mengenai PPDB 2024 untuk jenjang SD, SMP, dan SMA di Kota Banjarmasin. Pendaftaran dibuka mulai 1 Juni hingga 15 Juni 2024 melalui sistem online.",
      author: "Panitia PPDB",
      category: "Pendaftaran",
      status: "Draft",
      publishDate: "2024-05-25",
      views: 2100,
      featured: true,
    },
    {
      id: "NEWS-004",
      title: "Bantuan Operasional Sekolah (BOS) Tahap II",
      content:
        "Pencairan dana BOS tahap II untuk semester genap tahun 2024 telah dimulai. Sekolah dapat mengajukan pencairan melalui sistem SIMDIK dengan melengkapi dokumen yang diperlukan.",
      author: "Bagian Keuangan",
      category: "Keuangan",
      status: "Published",
      publishDate: "2024-06-15",
      views: 756,
      featured: false,
    },
  ])

  const [reportsData, setReportsData] = useState([
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
    {
      id: "RPT-006",
      title: "Permintaan Pelatihan Guru IT",
      reporter: "Dewi Lestari",
      school: "SMPN 1 Banjarmasin",
      category: "Pengembangan",
      priority: "Rendah",
      description: "Permintaan pelatihan untuk guru dalam penggunaan teknologi pembelajaran digital",
      reportDate: "2024-01-03",
      status: "Diproses",
      statusColor: "bg-yellow-100 text-yellow-800",
      contact: "081789012345",
      evidence: "proposal_pelatihan.pdf",
    },
  ])

  // Removed settingsData and related state/handlers
  // const settingsData = {
  //   general: {
  //     siteName: "SIMDIK Banjarmasin",
  //     siteDescription: "Sistem Informasi Manajemen Data dan Informasi Kependidikan Kota Banjarmasin",
  //     contactEmail: "info@simdik.banjarmasin.go.id",
  //     contactPhone: "(0511) 3252732",
  //     address: "Jl. Sultan Adam No. 18, Banjarmasin Tengah, Kota Banjarmasin, Kalimantan Selatan 70111",
  //     timezone: "Asia/Makassar",
  //     language: "id",
  //   },
  //   security: {
  //     passwordMinLength: 8,
  //     sessionTimeout: 30,
  //     maxLoginAttempts: 5,
  //     twoFactorAuth: false,
  //     passwordExpiry: 90,
  //   },
  //   notifications: {
  //     emailNotifications: true,
  //     smsNotifications: false,
  //     pushNotifications: true,
  //     reportAlerts: true,
  //     systemMaintenance: true,
  //   },
  //   backup: {
  //     autoBackup: true,
  //     backupFrequency: "daily",
  //     retentionPeriod: 30,
  //     lastBackup: "2024-01-15 02:00:00",
  //   },
  // }

  // const [settingsForm, setSettingsForm] = useState(settingsData)
  // const [activeSettingsTab, setActiveSettingsTab] = useState("general")

  // const handleSettingsChange = (section: string, field: string, value: any) => {
  //   setSettingsForm((prev) => ({
  //     ...prev,
  //     [section]: {
  //       ...prev[section as keyof typeof prev],
  //       [field]: value,
  //     },
  //   }))
  // }

  // const handleSaveSettings = () => {
  //   console.log("Saving settings:", settingsForm)
  //   alert("Pengaturan berhasil disimpan!")
  // }

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/admin", active: activeTab === "dashboard" },
    { icon: School, label: "Manajemen Sekolah", href: "/admin/schools", active: activeTab === "schools" },
    { icon: Newspaper, label: "Manajemen Berita", href: "/admin/news", active: activeTab === "news" },
    { icon: Clock, label: "Manajemen Agenda", href: "/admin/agenda", active: activeTab === "agenda" },
    { icon: Calendar, label: "Laporan Reservasi", href: "/admin/reservations", active: activeTab === "reservations" },
    // { icon: Settings, label: "Pengaturan", href: "/admin/settings" },
  ]

  const statsData = [
    {
      title: "Total Sekolah",
      value: schoolsData.length.toString(),
      icon: School,
      color: "blue",
      bgColor: "bg-blue-100",
    },
    {
      title: "Sekolah Aktif",
      value: schoolsData.filter((s) => s.status === "Aktif").length.toString(),
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-100",
    },
    {
      title: "Akreditasi A",
      value: schoolsData.filter((s) => s.accreditation === "A").length.toString(),
      icon: FileText,
      color: "yellow",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Perlu Review",
      value: schoolsData.filter((s) => s.status === "Nonaktif").length.toString(),
      icon: AlertCircle,
      color: "red",
      bgColor: "bg-red-100",
    },
  ]

  const handleAddSchool = (formData) => {
    const newSchool = {
      id: `SCH-${String(schoolsData.length + 1).padStart(3, "0")}`,
      ...formData,
    }
    setSchoolsData([...schoolsData, newSchool])
    setIsAddSchoolOpen(false)
  }

  const handleEditSchool = (school) => {
    setEditingSchool(school)
    setIsEditSchoolOpen(true)
  }

  const handleUpdateSchool = (formData) => {
    setSchoolsData(schoolsData.map((school) => (school.id === editingSchool.id ? { ...school, ...formData } : school)))
    setIsEditSchoolOpen(false)
    setEditingSchool(null)
  }

  const handleDeleteSchool = (schoolId) => {
    setSchoolsData(schoolsData.filter((school) => school.id !== schoolId))
  }

  const handleAddNews = (formData) => {
    const newNews = {
      id: `NEWS-${String(newsData.length + 1).padStart(3, "0")}`,
      views: 0,
      ...formData,
    }
    setNewsData([...newsData, newNews])
    setIsAddNewsOpen(false)
  }

  const handleEditNews = (news) => {
    setEditingNews(news)
    setIsEditNewsOpen(true)
  }

  const handleUpdateNews = (formData) => {
    setNewsData(newsData.map((news) => (news.id === editingNews.id ? { ...news, ...formData } : news)))
    setIsEditNewsOpen(false)
    setEditingNews(null)
  }

  const handleDeleteNews = (newsId) => {
    setNewsData(newsData.filter((news) => news.id !== newsId))
  }

  const [agendasData, setAgendasData] = useState([
    {
      id: "AGD-001",
      title: "Rapat Koordinasi Kepala Sekolah",
      description: "Rapat koordinasi bulanan dengan seluruh kepala sekolah se-Kota Banjarmasin",
      date: "2024-01-15",
      time: "09:00",
      location: "Aula Dinas Pendidikan",
      status: "Terjadwal",
      category: "Rapat",
      participants: "Kepala Sekolah",
    },
    {
      id: "AGD-002",
      title: "Workshop Kurikulum Merdeka",
      description: "Pelatihan implementasi kurikulum merdeka untuk guru-guru",
      date: "2024-01-20",
      time: "08:00",
      location: "SMAN 1 Banjarmasin",
      status: "Berlangsung",
      category: "Pelatihan",
      participants: "Guru",
    },
    {
      id: "AGD-003",
      title: "Monitoring Sekolah Zona 1",
      description: "Kunjungan monitoring dan evaluasi sekolah-sekolah zona 1",
      date: "2024-01-10",
      time: "10:00",
      location: "Sekolah Zona 1",
      status: "Selesai",
      category: "Monitoring",
      participants: "Tim Monitoring",
    },
  ])

  const handleAddAgenda = (formData) => {
    const newAgenda = {
      id: `AGD-${String(agendasData.length + 1).padStart(3, "0")}`,
      ...formData,
    }
    setAgendasData([...agendasData, newAgenda])
    setIsAddAgendaOpen(false)
  }

  const handleEditAgenda = (agenda) => {
    setEditingAgenda(agenda)
    setIsEditAgendaOpen(true)
  }

  const handleUpdateAgenda = (formData) => {
    setAgendasData(agendasData.map((agenda) => (agenda.id === editingAgenda.id ? { ...agenda, ...formData } : agenda)))
    setIsEditAgendaOpen(false)
    setEditingAgenda(null)
  }

  const handleDeleteAgenda = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus agenda ini?")) {
      setAgendasData(agendasData.filter((agenda) => agenda.id !== id))
    }
  }

  const SchoolForm = ({ school, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: school?.name || "",
      npsn: school?.npsn || "",
      address: school?.address || "",
      principal: school?.principal || "",
      phone: school?.phone || "",
      email: school?.email || "",
      status: school?.status || "Aktif",
      accreditation: school?.accreditation || "A",
      studentCount: school?.studentCount || 0,
      teacherCount: school?.teacherCount || 0,
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSubmit(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nama Sekolah
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="npsn" className="text-foreground">
              NPSN
            </Label>
            <Input
              id="npsn"
              value={formData.npsn}
              onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
              className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-foreground">
            Alamat
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300 min-h-[80px]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="principal" className="text-foreground">
              Kepala Sekolah
            </Label>
            <Input
              id="principal"
              value={formData.principal}
              onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
              className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Telepon
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="Aktif" className="hover:bg-accent hover:text-accent-foreground">
                  Aktif
                </SelectItem>
                <SelectItem value="Nonaktif" className="hover:bg-accent hover:text-accent-foreground">
                  Nonaktif
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accreditation" className="text-foreground">
              Akreditasi
            </Label>
            <Select
              value={formData.accreditation}
              onValueChange={(value) => setFormData({ ...formData, accreditation: value })}
            >
              <SelectTrigger className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="A" className="hover:bg-accent hover:text-accent-foreground">
                  A
                </SelectItem>
                <SelectItem value="B" className="hover:bg-accent hover:text-accent-foreground">
                  B
                </SelectItem>
                <SelectItem value="C" className="hover:bg-accent hover:text-accent-foreground">
                  C
                </SelectItem>
                <SelectItem value="Belum Terakreditasi" className="hover:bg-accent hover:text-accent-foreground">
                  Belum Terakreditasi
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentCount" className="text-foreground">
              Jumlah Siswa
            </Label>
            <Input
              id="studentCount"
              type="number"
              value={formData.studentCount}
              onChange={(e) => setFormData({ ...formData, studentCount: Number.parseInt(e.target.value) || 0 })}
              className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacherCount" className="text-foreground">
              Jumlah Guru
            </Label>
            <Input
              id="teacherCount"
              type="number"
              value={formData.teacherCount}
              onChange={(e) => setFormData({ ...formData, teacherCount: Number.parseInt(e.target.value) || 0 })}
              className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
              required
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-accent hover:text-accent-foreground transition-all duration-300 bg-transparent"
          >
            Batal
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300">
            {school ? "Update" : "Tambah"} Sekolah
          </Button>
        </DialogFooter>
      </form>
    )
  }

  const NewsForm = ({ news, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      title: news?.title || "",
      content: news?.content || "",
      author: news?.author || "",
      category: news?.category || "Pengumuman",
      status: news?.status || "Draft",
      publishDate: news?.publishDate || new Date().toISOString().split("T")[0],
      featured: news?.featured || false,
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSubmit(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground">
            Judul Berita
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="text-foreground">
            Konten Berita
          </Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300 min-h-[120px]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author" className="text-foreground">
              Penulis
            </Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Kategori
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="Pengumuman" className="hover:bg-accent hover:text-accent-foreground">
                  Pengumuman
                </SelectItem>
                <SelectItem value="Kegiatan" className="hover:bg-accent hover:text-accent-foreground">
                  Kegiatan
                </SelectItem>
                <SelectItem value="Pendaftaran" className="hover:bg-accent hover:text-accent-foreground">
                  Pendaftaran
                </SelectItem>
                <SelectItem value="Keuangan" className="hover:bg-accent hover:text-accent-foreground">
                  Keuangan
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="Draft" className="hover:bg-accent hover:text-accent-foreground">
                  Draft
                </SelectItem>
                <SelectItem value="Published" className="hover:bg-accent hover:text-accent-foreground">
                  Published
                </SelectItem>
                <SelectItem value="Archived" className="hover:bg-accent hover:text-accent-foreground">
                  Archived
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="publishDate" className="text-foreground">
              Tanggal Publikasi
            </Label>
            <Input
              id="publishDate"
              type="date"
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 text-blue-600 bg-background border-input rounded focus:ring-blue-500 focus:ring-2 transition-all duration-300"
          />
          <Label htmlFor="featured" className="text-foreground cursor-pointer">
            Jadikan berita unggulan
          </Label>
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-accent hover:text-accent-foreground transition-all duration-300 bg-transparent"
          >
            Batal
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300">
            {news ? "Update" : "Tambah"} Berita
          </Button>
        </DialogFooter>
      </form>
    )
  }

  const router = useRouter()

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
                      setActiveTab(
                        item.label === "Dashboard"
                          ? "dashboard"
                          : item.label === "Manajemen Sekolah"
                            ? "schools"
                            : item.label === "Manajemen Berita"
                              ? "news"
                              : item.label === "Manajemen Agenda"
                                ? "agenda"
                                : item.label === "Laporan Reservasi"
                                  ? "reservations"
                                  : // : item.label === "Pengaturan"
                                    //   ? "settings"
                                    "dashboard",
                      )
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
                <h2 className="text-lg lg:text-xl font-semibold text-foreground">
                  {
                    activeTab === "dashboard"
                      ? "Dashboard"
                      : activeTab === "schools"
                        ? "Manajemen Sekolah"
                        : activeTab === "news"
                          ? "Manajemen Berita"
                          : activeTab === "agenda"
                            ? "Manajemen Agenda"
                            : activeTab === "reservations"
                              ? "Laporan Reservasi"
                              : // : "Pengaturan"
                                "Dashboard" // Default to Dashboard if no active tab
                  }
                </h2>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  {
                    activeTab === "dashboard"
                      ? "Ringkasan data dan statistik sistem"
                      : activeTab === "schools"
                        ? "Kelola data sekolah dan informasi terkait"
                        : activeTab === "news"
                          ? "Kelola berita dan pengumuman"
                          : activeTab === "agenda"
                            ? "Kelola agenda dan kegiatan"
                            : activeTab === "reservations"
                              ? "Kelola laporan reservasi layanan dari masyarakat"
                              : // : "Pengaturan"
                                "Ringkasan data dan statistik sistem" // Default to Dashboard description
                  }
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
          {activeTab === "reservations" && (
            <>
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
                        <p className="text-2xl font-bold text-foreground">156</p>
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
                        <p className="text-2xl font-bold text-foreground">142</p>
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
                        <p className="text-2xl font-bold text-foreground">12</p>
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
                        <p className="text-2xl font-bold text-foreground">2</p>
                      </div>
                      <XCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reservations Table */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-muted">
                  <CardTitle className="text-foreground">Daftar Reservasi</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
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
                        {[
                          {
                            id: "PTK-123456",
                            name: "Ahmad Rizki",
                            service: "PTK (Pendidik dan Tenaga Kependidikan)",
                            date: "2024-01-15",
                            time: "09:00 - 10:00",
                            purpose: "Pengajuan sertifikat pendidik",
                            status: "Selesai",
                            phone: "081234567890",
                          },
                          {
                            id: "SD-789012",
                            name: "Siti Nurhaliza",
                            service: "SD Umum",
                            date: "2024-01-16",
                            time: "10:00 - 11:00",
                            purpose: "Konsultasi zonasi sekolah",
                            status: "Menunggu",
                            phone: "082345678901",
                          },
                          {
                            id: "SMP-345678",
                            name: "Budi Santoso",
                            service: "SMP Umum",
                            date: "2024-01-16",
                            time: "13:00 - 14:00",
                            purpose: "Pengajuan mutasi siswa",
                            status: "Menunggu",
                            phone: "083456789012",
                          },
                          {
                            id: "PAUD-901234",
                            name: "Dewi Kartika",
                            service: "PAUD",
                            date: "2024-01-17",
                            time: "08:00 - 09:00",
                            purpose: "Pendaftaran PAUD baru",
                            status: "Menunggu",
                            phone: "084567890123",
                          },
                        ].map((reservation) => (
                          <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                              {reservation.id}
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
                                {reservation.service}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-100">{reservation.date}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.time}</div>
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
                                  reservation.status === "Selesai"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : reservation.status === "Menunggu"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                                )}
                              >
                                {reservation.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 hover:text-blue-700 bg-transparent"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {reservation.status === "Menunggu" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-green-600 hover:text-green-700 bg-transparent"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:text-red-700 bg-transparent"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "dashboard" && (
            <>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground mt-2">Ringkasan data dan statistik sistem pendidikan</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="hover:scale-105 transition-all duration-200">
                    <Download className="w-4 h-4 mr-2" />
                    Export Laporan
                  </Button>
                  <Button variant="outline" className="hover:scale-105 transition-all duration-200 bg-transparent">
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
                      {reportsData.slice(0, 5).map((report) => {
                        // Show only first 5 reports in dashboard
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
                              <Button variant="outline" size="sm">
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
            </>
          )}

          {activeTab === "schools" && (
            <div>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Manajemen Sekolah</h1>
                  <p className="text-muted-foreground mt-2">Kelola data sekolah dan informasi terkait</p>
                </div>
                <Dialog open={isAddSchoolOpen} onOpenChange={setIsAddSchoolOpen}>
                  <DialogTrigger asChild>
                    <Button className="hover:scale-105 transition-all duration-200">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Sekolah
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tambah Sekolah Baru</DialogTitle>
                    </DialogHeader>
                    <SchoolForm onSubmit={handleAddSchool} onCancel={() => setIsAddSchoolOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Schools Table */}
              <Card className="bg-card text-foreground">
                <CardHeader>
                  <CardTitle>Daftar Sekolah</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nama Sekolah</TableHead>
                        <TableHead>NPSN</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Kepala Sekolah</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schoolsData.map((school) => (
                        <TableRow key={school.id}>
                          <TableCell className="font-medium">{school.id}</TableCell>
                          <TableCell>{school.name}</TableCell>
                          <TableCell>{school.npsn}</TableCell>
                          <TableCell>{school.address}</TableCell>
                          <TableCell>{school.principal}</TableCell>
                          <TableCell>
                            <Badge>{school.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/schools/${school.id}`)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Lihat
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/schools/${school.id}/edit`)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteSchool(school.id)}>
                                <Trash2 className="w-4 h-4 mr-1" />
                                Hapus
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "news" && (
            <div>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Manajemen Berita</h1>
                  <p className="text-muted-foreground mt-2">Kelola berita dan pengumuman</p>
                </div>
                <Dialog open={isAddNewsOpen} onOpenChange={setIsAddNewsOpen}>
                  <DialogTrigger asChild>
                    <Button className="hover:scale-105 transition-all duration-200">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Berita
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tambah Berita Baru</DialogTitle>
                    </DialogHeader>
                    <NewsForm onSubmit={handleAddNews} onCancel={() => setIsAddNewsOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* News Table */}
              <Card className="bg-card text-foreground">
                <CardHeader>
                  <CardTitle>Daftar Berita</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Judul Berita</TableHead>
                        <TableHead>Penulis</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsData.map((news) => (
                        <TableRow key={news.id}>
                          <TableCell className="font-medium">{news.id}</TableCell>
                          <TableCell>{news.title}</TableCell>
                          <TableCell>{news.author}</TableCell>
                          <TableCell>{news.category}</TableCell>
                          <TableCell>
                            <Badge>{news.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => router.push(`/admin/news/${news.id}`)}>
                                <Eye className="w-4 h-4 mr-1" />
                                Lihat
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/news/${news.id}/edit`)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteNews(news.id)}>
                                <Trash2 className="w-4 h-4 mr-1" />
                                Hapus
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "agenda" && (
            <>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Manajemen Agenda</h1>
                  <p className="text-muted-foreground mt-2">Kelola agenda dan kegiatan pendidikan</p>
                </div>
                <Dialog open={isAddAgendaOpen} onOpenChange={setIsAddAgendaOpen}>
                  <DialogTrigger asChild>
                    <Button className="hover:scale-105 transition-all duration-200">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Agenda
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tambah Agenda Baru</DialogTitle>
                    </DialogHeader>
                    <AgendaForm onSubmit={handleAddAgenda} onCancel={() => setIsAddAgendaOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Agenda Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
                <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Agenda</p>
                        <p className="text-2xl lg:text-3xl font-bold text-foreground">{agendasData.length}</p>
                      </div>
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-chart-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Berlangsung</p>
                        <p className="text-2xl lg:text-3xl font-bold text-foreground">
                          {agendasData.filter((a) => a.status === "Berlangsung").length}
                        </p>
                      </div>
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-chart-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Selesai</p>
                        <p className="text-2xl lg:text-3xl font-bold text-foreground">
                          {agendasData.filter((a) => a.status === "Selesai").length}
                        </p>
                      </div>
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-chart-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Agenda Table */}
              <Card className="bg-card text-foreground">
                <CardHeader>
                  <CardTitle>Daftar Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agendasData.map((agenda) => {
                        let statusColor = ""
                        switch (agenda.status) {
                          case "Terjadwal":
                            statusColor = "bg-chart-1/10 text-chart-1"
                            break
                          case "Berlangsung":
                            statusColor = "bg-chart-3/10 text-chart-3"
                            break
                          case "Selesai":
                            statusColor = "bg-chart-2/10 text-chart-2"
                            break
                          default:
                            statusColor = "bg-muted text-muted-foreground"
                        }
                        return (
                          <TableRow key={agenda.id}>
                            <TableCell className="font-medium">{agenda.id}</TableCell>
                            <TableCell>{agenda.title}</TableCell>
                            <TableCell>{agenda.date}</TableCell>
                            <TableCell>{agenda.time}</TableCell>
                            <TableCell>{agenda.location}</TableCell>
                            <TableCell>
                              <Badge className={statusColor}>{agenda.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Lihat
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEditAgenda(agenda)}>
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteAgenda(agenda.id)}>
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Hapus
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

const AgendaForm = ({ agenda, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: agenda?.title || "",
    description: agenda?.description || "",
    date: agenda?.date || new Date().toISOString().split("T")[0],
    time: agenda?.time || "08:00",
    location: agenda?.location || "",
    status: agenda?.status || "Terjadwal",
    category: agenda?.category || "Rapat",
    participants: agenda?.participants || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-foreground">
          Judul Agenda
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Deskripsi Agenda
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300 min-h-[100px]"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-foreground">
            Tanggal
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time" className="text-foreground">
            Waktu
          </Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-foreground">
          Lokasi
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status" className="text-foreground">
            Status
          </Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="Terjadwal" className="hover:bg-accent hover:text-accent-foreground">
                Terjadwal
              </SelectItem>
              <SelectItem value="Berlangsung" className="hover:bg-accent hover:text-accent-foreground">
                Berlangsung
              </SelectItem>
              <SelectItem value="Selesai" className="hover:bg-accent hover:text-accent-foreground">
                Selesai
              </SelectItem>
              <SelectItem value="Ditunda" className="hover:bg-accent hover:text-accent-foreground">
                Ditunda
              </SelectItem>
              <SelectItem value="Dibatalkan" className="hover:bg-accent hover:text-accent-foreground">
                Dibatalkan
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-foreground">
            Kategori
          </Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="Rapat" className="hover:bg-accent hover:text-accent-foreground">
                Rapat
              </SelectItem>
              <SelectItem value="Pelatihan" className="hover:bg-accent hover:text-accent-foreground">
                Pelatihan
              </SelectItem>
              <SelectItem value="Seminar" className="hover:bg-accent hover:text-accent-foreground">
                Seminar
              </SelectItem>
              <SelectItem value="Workshop" className="hover:bg-accent hover:text-accent-foreground">
                Workshop
              </SelectItem>
              <SelectItem value="Upacara" className="hover:bg-accent hover:text-accent-foreground">
                Upacara
              </SelectItem>
              <SelectItem value="Lomba" className="hover:bg-accent hover:text-accent-foreground">
                Lomba
              </SelectItem>
              <SelectItem value="Kegiatan Sekolah" className="hover:bg-accent hover:text-accent-foreground">
                Kegiatan Sekolah
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="participants" className="text-foreground">
          Peserta
        </Label>
        <Input
          id="participants"
          value={formData.participants}
          onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
          className="bg-background border-input hover:border-accent-foreground/20 focus:border-primary transition-all duration-300"
          required
        />
      </div>

      <DialogFooter className="gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-300 bg-transparent"
        >
          Batal
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300">
          {agenda ? "Update" : "Tambah"} Agenda
        </Button>
      </DialogFooter>
    </form>
  )
}
