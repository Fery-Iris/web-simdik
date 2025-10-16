"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, Clock, MapPin, Trash2 } from "lucide-react"

interface Agenda {
  id: string
  title: string
  date: string
  time: string
  location: string
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

export default function AgendaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [agenda, setAgenda] = useState<Agenda | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const response = await fetch(`/api/agendas/${params.id}`)
        const result = await response.json()
        
        if (result.success) {
          setAgenda(result.data)
        } else {
          console.error('Failed to fetch agenda:', result.message)
        }
      } catch (error) {
        console.error('Error fetching agenda:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAgenda()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/agendas/${params.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        router.push('/admin/agendas')
      } else {
        console.error('Failed to delete agenda:', result.message)
        alert('Gagal menghapus agenda: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting agenda:', error)
      alert('Terjadi kesalahan saat menghapus agenda')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!agenda) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Agenda Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">Agenda yang Anda cari tidak ditemukan atau telah dihapus.</p>
            <Button onClick={() => router.push('/admin/agendas')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Agenda
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin/agendas')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detail Agenda</h1>
              <p className="text-gray-600">Informasi lengkap agenda</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => router.push(`/admin/agendas/${agenda.id}/edit`)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>

        {/* Agenda Details */}
        <div className="grid gap-6">
          {/* Main Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{agenda.title}</CardTitle>
                <Badge className={`${statusColors[agenda.status]} text-sm px-3 py-1`}>
                  {statusLabels[agenda.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tanggal</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(agenda.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Waktu</p>
                    <p className="text-lg font-semibold text-gray-900">{agenda.time} WIB</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Lokasi</p>
                  <p className="text-lg font-semibold text-gray-900">{agenda.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Sistem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">ID Agenda</p>
                  <p className="text-sm text-gray-900 font-mono">{agenda.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Dibuat</p>
                  <p className="text-sm text-gray-900">
                    {new Date(agenda.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Terakhir Diperbarui</p>
                  <p className="text-sm text-gray-900">
                    {new Date(agenda.updatedAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Badge className={`${statusColors[agenda.status]} text-base px-4 py-2`}>
                    {statusLabels[agenda.status]}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Status agenda menunjukkan kondisi terkini dari kegiatan yang telah direncanakan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
