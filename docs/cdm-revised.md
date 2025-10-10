# Conceptual Data Model (CDM) - SIMDIK Kota Banjarmasin (Revised)

Tujuan: Mendefinisikan entitas bisnis utama dan relasi pada domain SIMDIK sesuai implementasi aktual.

## Entitas Utama
- Sekolah
- Berita
- Agenda
- Reservasi
- Pengguna
- Layanan

## Definisi Singkat Entitas
- **Sekolah**: Unit pendidikan (SD, SMP, PAUD) di wilayah Kota Banjarmasin dengan data lengkap profil sekolah.
- **Berita**: Informasi/pengumuman yang dipublikasikan oleh dinas/admin untuk masyarakat.
- **Agenda**: Kegiatan yang dijadwalkan oleh dinas (rapat, pelatihan, monitoring, sosialisasi, evaluasi).
- **Reservasi**: Pemesanan slot layanan masyarakat ke dinas (PTK/SD/SMP/PAUD) dengan sistem antrian online.
- **Pengguna**: Akun pengguna sistem (Admin untuk mengelola konten dan data).
- **Layanan**: Tipe layanan yang tersedia untuk reservasi (PTK, SD Umum, SMP Umum, PAUD).

## Relasi dan Kardinalitas

### Relasi Wajib (Mandatory)

#### **1. Pengguna (1) —— (M) Berita**
- **Deskripsi**: Setiap berita harus dibuat oleh satu admin, admin dapat membuat banyak berita
- **Kardinalitas**: One-to-Many (1:M)
- **Atribut Kunci**: `dibuat_oleh` (FK di tabel Berita)
- **Aturan Bisnis**: 
  - Berita tidak dapat dibuat tanpa admin yang bertanggung jawab
  - Admin yang dihapus tidak boleh meninggalkan berita "yatim piatu" (RESTRICT)
  - Tracking authorship untuk accountability dan audit trail

#### **2. Pengguna (1) —— (M) Agenda**
- **Deskripsi**: Setiap agenda harus dibuat/dikelola oleh satu admin, admin dapat membuat banyak agenda
- **Kardinalitas**: One-to-Many (1:M)
- **Atribut Kunci**: `dibuat_oleh` (FK di tabel Agenda)
- **Aturan Bisnis**:
  - Agenda memerlukan PIC (Person in Charge) yang jelas
  - Admin bertanggung jawab atas validitas dan update status agenda
  - Workflow approval melalui admin yang mengelola

#### **3. Layanan (1) —— (M) Reservasi**
- **Deskripsi**: Setiap reservasi harus memilih satu layanan, satu layanan dapat melayani banyak reservasi
- **Kardinalitas**: One-to-Many (1:M)
- **Atribut Kunci**: `layanan_id` (FK di tabel Reservasi)
- **Aturan Bisnis**:
  - Reservasi tidak dapat dibuat tanpa memilih layanan yang valid
  - Layanan yang dinonaktifkan tidak menerima reservasi baru
  - Nomor antrian menggunakan kode layanan sebagai prefix (PTK-001234)

### Relasi Opsional (Optional)

#### **4. Pengguna (0|1) —— (M) Reservasi**
- **Deskripsi**: Reservasi dapat dibuat oleh pengguna terdaftar atau guest (anonim)
- **Kardinalitas**: Zero-or-One-to-Many (0|1:M)
- **Atribut Kunci**: `pengguna_id` (FK nullable di tabel Reservasi)
- **Aturan Bisnis**:
  - Jika `pengguna_id` NULL = reservasi oleh guest (data manual: nama, telepon)
  - Jika `pengguna_id` ada = reservasi oleh user terdaftar (auto-fill data)
  - Pengguna terdaftar mendapat riwayat reservasi dan notifikasi

#### **5. Sekolah (0|1) —— (M) Agenda**
- **Deskripsi**: Agenda dapat berlokasi di sekolah tertentu atau di lokasi umum
- **Kardinalitas**: Zero-or-One-to-Many (0|1:M)
- **Atribut Kunci**: `sekolah_id` (FK nullable di tabel Agenda)
- **Aturan Bisnis**:
  - Jika `sekolah_id` NULL = agenda umum (di kantor dinas, hotel, dll)
  - Jika `sekolah_id` ada = agenda di sekolah tertentu (monitoring, sosialisasi)
  - Membantu filter agenda berdasarkan lokasi/sekolah

#### **6. Sekolah (0|1) —— (M) Berita**
- **Deskripsi**: Berita dapat bersifat umum atau spotlight sekolah tertentu
- **Kardinalitas**: Zero-or-One-to-Many (0|1:M)
- **Atribut Kunci**: `sekolah_id` (FK nullable di tabel Berita)
- **Aturan Bisnis**:
  - Jika `sekolah_id` NULL = berita umum (pengumuman dinas, kebijakan)
  - Jika `sekolah_id` ada = berita spotlight sekolah (prestasi, inovasi)
  - Membantu kategorisasi dan filter berita per sekolah

### Relasi Tambahan (Supporting Entities)

#### **7. Layanan (1) —— (M) SlotWaktu**
- **Deskripsi**: Setiap layanan memiliki jadwal operasional (slot waktu) yang berbeda
- **Kardinalitas**: One-to-Many (1:M)
- **Atribut Kunci**: `layanan_id` (FK di tabel SlotWaktu)
- **Aturan Bisnis**:
  - Mengatur jam operasional per layanan (PTK: 08:00-16:00, PAUD: 08:00-12:00)
  - Kapasitas maksimal reservasi per slot waktu
  - Fleksibilitas jadwal per hari (Senin-Jumat)

## Diagram Relasi Konseptual

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Pengguna   │────────▶│   Berita    │◆───────▶│   Sekolah   │
│ (Admin)     │         │             │         │ (Optional)  │
└─────────────┘         └─────────────┘         └─────────────┘
       │                                               │
       │                ┌─────────────┐               │
       └───────────────▶│   Agenda    │◆──────────────┘
                        │             │
                        └─────────────┘
                        
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Layanan   │────────▶│  Reservasi  │◆───────▶│  Pengguna   │
│             │         │             │         │ (Optional)  │
└─────────────┘         └─────────────┘         └─────────────┘
       │
       │
       ▼
┌─────────────┐
│ SlotWaktu   │
│             │
└─────────────┘

Legenda:
──────▶ = Relasi Wajib (1:M)
◆─────▶ = Relasi Opsional (0|1:M)
```

## Catatan Bisnis
- Status sekolah (Aktif/Nonaktif) dan akreditasi (A/B/C/Belum) adalah atribut bisnis yang penting untuk transparansi data pendidikan.
- Reservasi memiliki nomor antrian unik, tanggal, dan slot waktu; kapasitas per slot dikelola per layanan.
- Sistem antrian menggunakan kode layanan + timestamp untuk generate nomor antrian (contoh: PTK-001234).
- Pengguna sistem fokus pada admin dengan peran pengelolaan konten, data sekolah, berita, dan agenda.
- Website bersifat informatif dengan fitur reservasi online sebagai layanan utama kepada masyarakat.

## Scope Implementasi Aktual
Sistem ini berfokus pada:
1. **Portal Informasi**: Transparansi data pendidikan Kota Banjarmasin
2. **Direktori Sekolah**: Database lengkap profil sekolah dengan pencarian dan filter
3. **Manajemen Konten**: Publikasi berita dan agenda kegiatan dinas
4. **Sistem Reservasi**: Layanan antrian online untuk urusan administratif
5. **Dashboard Admin**: Interface pengelolaan data dan konten
