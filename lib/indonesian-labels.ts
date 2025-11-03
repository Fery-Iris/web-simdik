// Helper untuk translate label dari Bahasa Inggris ke Indonesia
// Ini hanya untuk tampilan, tidak mengubah database

export const statusLabels = {
  // Agenda Status
  SCHEDULED: "Terjadwal",
  ONGOING: "Berlangsung",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  
  // News Status
  DRAFT: "Draf",
  PUBLISHED: "Dipublikasikan",
  ARCHIVED: "Diarsipkan",
}

export const categoryLabels = {
  // Agenda Categories
  Seminar: "Seminar",
  Workshop: "Workshop",
  Pelatihan: "Pelatihan",
  Sosialisasi: "Sosialisasi",
  Rapat: "Rapat",
  Lainnya: "Lainnya",
  
  // News Categories
  PENGUMUMAN: "Pengumuman",
  KEGIATAN: "Kegiatan",
  PENDAFTARAN: "Pendaftaran",
  KEUANGAN: "Keuangan",
  KERJASAMA: "Kerjasama",
  BEASISWA: "Beasiswa",
}

export const fieldLabels = {
  // Common Fields
  title: "Judul",
  slug: "Slug",
  description: "Deskripsi",
  content: "Konten",
  category: "Kategori",
  status: "Status",
  createdAt: "Dibuat Pada",
  updatedAt: "Diperbarui Pada",
  
  // Agenda Fields
  date: "Tanggal",
  time: "Waktu",
  location: "Lokasi",
  address: "Alamat",
  organizer: "Penyelenggara",
  capacity: "Kapasitas",
  registrationFee: "Biaya Pendaftaran",
  contactPerson: "Kontak Person",
  imageUrl: "Gambar",
  
  // News Fields
  judul: "Judul",
  ringkasan: "Ringkasan",
  konten: "Konten",
  kategori: "Kategori",
  tanggalTerbit: "Tanggal Terbit",
  gambarUtama: "Gambar Utama",
  views: "Dilihat",
  tags: "Tag",
  unggulan: "Unggulan",
  
  // Reservation Fields
  queueNumber: "Nomor Antrian",
  service: "Layanan",
  name: "Nama",
  phone: "Telepon",
  nik: "NIK",
  purpose: "Keperluan",
  timeSlot: "Waktu Kedatangan",
  estimatedCallTime: "Estimasi Waktu Panggilan",
}

export const serviceLabels = {
  "Pendaftaran Siswa Baru": "Pendaftaran Siswa Baru",
  "Mutasi Siswa": "Mutasi Siswa",
  "Legalisir Ijazah": "Legalisir Ijazah",
  "Surat Keterangan": "Surat Keterangan",
  "Konsultasi": "Konsultasi",
  "Pengaduan": "Pengaduan",
  "Lainnya": "Lainnya",
}

// Helper function to get Indonesian label
export function getIndonesianLabel(key: string, type: 'status' | 'category' | 'field' | 'service' = 'field'): string {
  switch (type) {
    case 'status':
      return statusLabels[key as keyof typeof statusLabels] || key
    case 'category':
      return categoryLabels[key as keyof typeof categoryLabels] || key
    case 'service':
      return serviceLabels[key as keyof typeof serviceLabels] || key
    case 'field':
    default:
      return fieldLabels[key as keyof typeof fieldLabels] || key
  }
}

// Format date to Indonesian
export function formatDateIndonesian(dateString: string, format: 'short' | 'long' = 'long'): string {
  const date = new Date(dateString)
  
  if (format === 'short') {
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

