"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  School,
  Menu,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteHeader } from "@/components/site-header"

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

interface AgendaDetailPageProps {
  params: {
    slug: string
  }
}

export default function AgendaDetailPage({ params }: AgendaDetailPageProps) {
  const [agenda, setAgenda] = useState<Agenda | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/agendas/slug/${params.slug}`)
        const result = await response.json()
        
        if (result.success) {
          setAgenda(result.data)
        } else {
          setError(result.message || 'Agenda tidak ditemukan')
        }
      } catch (error) {
        console.error('Error fetching agenda:', error)
        setError('Terjadi kesalahan saat memuat agenda')
      } finally {
        setLoading(false)
      }
    }

    fetchAgenda()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat agenda...</p>
        </div>
      </div>
    )
  }

  if (error || !agenda) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Agenda Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-4">{error || 'Agenda yang Anda cari tidak tersedia.'}</p>
          <Link href="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Workshop: "bg-chart-1/10 text-chart-1",
      Kompetisi: "bg-chart-2/10 text-chart-2",
      Seminar: "bg-chart-3/10 text-chart-3",
      Pelatihan: "bg-chart-4/10 text-chart-4",
      Rapat: "bg-chart-5/10 text-chart-5",
    }
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      "SCHEDULED": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      "ONGOING": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      "COMPLETED": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      "CANCELLED": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    }
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      "SCHEDULED": "Terjadwal",
      "ONGOING": "Berlangsung", 
      "COMPLETED": "Selesai",
      "CANCELLED": "Dibatalkan",
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <Badge className={getCategoryColor(agenda.category)}>{agenda.category}</Badge>
              <Badge className={getStatusColor(agenda.status)}>{getStatusLabel(agenda.status)}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">{agenda.title}</h1>

            {/* Share Buttons */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-medium text-foreground">Bagikan:</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={agenda.imageUrl || "/placeholder.svg"}
                  alt={agenda.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Event Description */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Tentang Acara</h2>
                  <div className="prose prose-lg max-w-none text-foreground">
                    <p className="mb-4 leading-relaxed text-muted-foreground">
                      {agenda.description}
                      </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Informasi Acara</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Tanggal</p>
                        <p className="text-sm text-muted-foreground">{new Date(agenda.date).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Waktu</p>
                        <p className="text-sm text-muted-foreground">{agenda.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Lokasi</p>
                        <p className="text-sm text-muted-foreground">{agenda.location}</p>
                        {agenda.address && (
                        <p className="text-xs text-muted-foreground mt-1">{agenda.address}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Kapasitas</p>
                        <p className="text-sm text-muted-foreground">
                          {agenda.capacity > 0 ? `${agenda.capacity} orang` : 'Tidak terbatas'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <School className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Penyelenggara</p>
                        <p className="text-sm text-muted-foreground">{agenda.organizer}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Registration Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Pendaftaran</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-foreground mb-1">Biaya</p>
                      <p className="text-lg font-bold text-blue-600">{agenda.registrationFee}</p>
                    </div>

                    {agenda.contactPerson && (
                    <div>
                      <p className="font-medium text-foreground mb-1">Kontak</p>
                        <p className="text-sm text-muted-foreground">{agenda.contactPerson}</p>
                    </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Map section removed as requested */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
