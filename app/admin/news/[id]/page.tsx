"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, User, Eye, Tag } from "lucide-react"
import Image from "next/image"

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock data - in real app, fetch from API
  const newsData = [
    {
      id: "NEWS-001",
      title: "Pembukaan Tahun Ajaran Baru 2024/2025",
      author: "Admin Dinas",
      category: "Pengumuman",
      status: "Published",
      views: 1250,
      publishDate: "2024-07-15",
      lastModified: "2024-07-15",
      excerpt:
        "Dinas Pendidikan Kota Banjarmasin mengumumkan pembukaan tahun ajaran baru 2024/2025 yang akan dimulai pada tanggal 15 Juli 2024.",
      content: `
        <p>Dinas Pendidikan Kota Banjarmasin dengan bangga mengumumkan pembukaan tahun ajaran baru 2024/2025 yang akan dimulai pada tanggal 15 Juli 2024. Seluruh sekolah di wilayah Kota Banjarmasin diharapkan untuk mempersiapkan diri dengan baik.</p>
        
        <h3>Persiapan yang Perlu Dilakukan:</h3>
        <ul>
          <li>Memastikan fasilitas sekolah dalam kondisi baik</li>
          <li>Menyiapkan kurikulum dan materi pembelajaran</li>
          <li>Koordinasi dengan komite sekolah dan orang tua siswa</li>
          <li>Implementasi protokol kesehatan yang berlaku</li>
        </ul>
        
        <p>Untuk informasi lebih lanjut, silakan menghubungi Dinas Pendidikan Kota Banjarmasin melalui telepon (0511) 3252525 atau email disdik@banjarmasinkota.go.id</p>
      `,
      image: "/images/school-opening.jpg",
      tags: ["Tahun Ajaran", "Pengumuman", "Sekolah"],
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundNews = newsData.find((n) => n.id === params.id)
      setNews(foundNews)
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

  if (!news) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h1>
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
            <h1 className="text-3xl font-bold">Detail Berita</h1>
          </div>
          <Button onClick={() => router.push(`/admin/news/${news.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Berita
          </Button>
        </div>

        {/* News Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{news.views.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-lg font-bold">{new Date(news.publishDate).toLocaleDateString("id-ID")}</p>
                  <p className="text-sm text-muted-foreground">Tanggal Publish</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Tag className="w-8 h-8 text-purple-500" />
                <div>
                  <Badge variant={news.status === "Published" ? "default" : "secondary"}>{news.status}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold leading-tight">{news.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{news.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(news.publishDate).toLocaleDateString("id-ID")}</span>
                    </div>
                    <Badge variant="outline">{news.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {news.image && (
                  <div className="mb-6">
                    <Image
                      src={news.image || "/placeholder.svg"}
                      alt={news.title}
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="prose prose-gray max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: news.content }} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID Berita</label>
                  <p className="font-mono">{news.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kategori</label>
                  <p>{news.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Penulis</label>
                  <p>{news.author}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Terakhir Dimodifikasi</label>
                  <p>{new Date(news.lastModified).toLocaleDateString("id-ID")}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{news.excerpt}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
