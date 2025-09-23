"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload } from "lucide-react"

export default function EditNewsPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    status: "",
    excerpt: "",
    content: "",
    tags: "",
    image: "",
  })

  // Mock data - in real app, fetch from API
  const newsData = [
    {
      id: "NEWS-001",
      title: "Pembukaan Tahun Ajaran Baru 2024/2025",
      author: "Admin Dinas",
      category: "Pengumuman",
      status: "Published",
      excerpt:
        "Dinas Pendidikan Kota Banjarmasin mengumumkan pembukaan tahun ajaran baru 2024/2025 yang akan dimulai pada tanggal 15 Juli 2024.",
      content: "Dinas Pendidikan Kota Banjarmasin dengan bangga mengumumkan pembukaan tahun ajaran baru 2024/2025...",
      tags: "Tahun Ajaran, Pengumuman, Sekolah",
      image: "/images/school-opening.jpg",
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const news = newsData.find((n) => n.id === params.id)
      if (news) {
        setFormData(news)
      }
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Updating news:", formData)
      setSaving(false)
      router.push(`/admin/news/${params.id}`)
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
          <h1 className="text-3xl font-bold">Edit Berita</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Konten Berita</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Judul Berita</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Ringkasan</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleChange("excerpt", e.target.value)}
                      rows={3}
                      placeholder="Ringkasan singkat berita..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Konten</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleChange("content", e.target.value)}
                      rows={12}
                      placeholder="Tulis konten berita lengkap di sini..."
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="image">Gambar Utama</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => handleChange("image", e.target.value)}
                        placeholder="URL gambar atau path file"
                      />
                      <Button type="button" variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Publikasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Berita">Berita</SelectItem>
                        <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                        <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                        <SelectItem value="Prestasi">Prestasi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="author">Penulis</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleChange("author", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                    <Textarea
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleChange("tags", e.target.value)}
                      rows={3}
                      placeholder="Tag1, Tag2, Tag3"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
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
