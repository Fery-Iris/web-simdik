"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AgendaFormProps {
  formData: {
    title: string
    slug: string
    description: string
    date: string
    time: string
    location: string
    address: string
    organizer: string
    capacity: number
    category: string
    registrationFee: string
    contactPerson: string
    imageUrl: string
    status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  }
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string
    slug: string
    description: string
    date: string
    time: string
    location: string
    address: string
    organizer: string
    capacity: number
    category: string
    registrationFee: string
    contactPerson: string
    imageUrl: string
    status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  }>>
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function AgendaForm({ formData, setFormData, onSubmit, onCancel }: AgendaFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        <Select value={formData.status} onValueChange={(value: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED') => setFormData({ ...formData, status: value })}>
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

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Simpan Agenda
        </Button>
      </div>
    </form>
  )
}
