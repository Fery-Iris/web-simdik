"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"

export default function EditSchoolPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    npsn: "",
    address: "",
    principal: "",
    phone: "",
    email: "",
    status: "",
    accreditation: "",
    students: "",
    teachers: "",
    established: "",
    description: "",
  })

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
      students: "450",
      teachers: "18",
      established: "1965",
      accreditation: "A",
      description:
        "Sekolah Dasar Negeri Banjarmasin 1 adalah salah satu sekolah dasar tertua dan terbaik di Kota Banjarmasin.",
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const school = schoolsData.find((s) => s.id === params.id)
      if (school) {
        setFormData(school)
      }
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Updating school:", formData)
      setSaving(false)
      router.push(`/admin/schools/${params.id}`)
    }, 1000)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold">Edit Sekolah</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Sekolah</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="npsn">NPSN</Label>
                  <Input
                    id="npsn"
                    value={formData.npsn}
                    onChange={(e) => handleChange("npsn", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accreditation">Akreditasi</Label>
                  <Select
                    value={formData.accreditation}
                    onValueChange={(value) => handleChange("accreditation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih akreditasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="Belum Terakreditasi">Belum Terakreditasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telepon</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Leadership & Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Kepemimpinan & Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="principal">Kepala Sekolah</Label>
                  <Input
                    id="principal"
                    value={formData.principal}
                    onChange={(e) => handleChange("principal", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="students">Jumlah Siswa</Label>
                    <Input
                      id="students"
                      type="number"
                      value={formData.students}
                      onChange={(e) => handleChange("students", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="teachers">Jumlah Guru</Label>
                    <Input
                      id="teachers"
                      type="number"
                      value={formData.teachers}
                      onChange={(e) => handleChange("teachers", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="established">Tahun Berdiri</Label>
                  <Input
                    id="established"
                    type="number"
                    value={formData.established}
                    onChange={(e) => handleChange("established", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="description">Deskripsi Sekolah</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
