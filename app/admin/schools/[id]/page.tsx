"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, MapPin, Phone, Mail, Users, Calendar } from "lucide-react"

export default function SchoolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [school, setSchool] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock data - in real app, fetch from API
  const schoolsData = [
    {
      id: "SCH-001",
      name: "SDN Banjarmasin 1",
      npsn: "30201010",
      address: "Jl. Lambung Mangkurat No. 1, Banjarmasin",
      principal: "Dra. Siti Aminah, M.Pd",
      status: "Aktif",
      phone: "0511-3252525",
      email: "sdn.bjm1@gmail.com",
      students: 450,
      teachers: 18,
      established: "1965",
      accreditation: "A",
      description:
        "Sekolah Dasar Negeri Banjarmasin 1 adalah salah satu sekolah dasar tertua dan terbaik di Kota Banjarmasin. Dengan fasilitas lengkap dan tenaga pengajar yang berkualitas.",
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundSchool = schoolsData.find((s) => s.id === params.id)
      setSchool(foundSchool)
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sekolah tidak ditemukan</h1>
          <Button onClick={() => router.back()}>Kembali</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold">Detail Sekolah</h1>
          </div>
          <Button onClick={() => router.push(`/admin/schools/${school.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Sekolah
          </Button>
        </div>

        {/* School Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nama Sekolah</label>
                <p className="text-lg font-semibold">{school.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">NPSN</label>
                <p>{school.npsn}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={school.status === "Aktif" ? "default" : "secondary"}>{school.status}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Akreditasi</label>
                <p className="text-lg font-semibold">{school.accreditation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Alamat</label>
                  <p>{school.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telepon</label>
                  <p>{school.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{school.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{school.students}</p>
                  <p className="text-sm text-muted-foreground">Siswa</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{school.teachers}</p>
                  <p className="text-sm text-muted-foreground">Guru</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{school.established}</p>
                  <p className="text-sm text-muted-foreground">Tahun Berdiri</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leadership & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Kepemimpinan</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Kepala Sekolah</label>
                <p className="text-lg font-semibold">{school.principal}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deskripsi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{school.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
