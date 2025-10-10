# Logical Data Model (LDM) - SIMDIK Kota Banjarmasin (Revised)

Catatan: Model logis yang disesuaikan dengan implementasi aktual sistem (tanpa laporan pengaduan).

## 1. Entitas: Pengguna
- PK: pengguna_id
- Atribut:
  - pengguna_id (integer)
  - nama (string, 100)
  - email (string, 150, unique)
  - password_hash (string, 255)
  - peran (enum: ADMIN, USER)
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## 2. Entitas: Sekolah
- PK: sekolah_id
- Atribut:
  - sekolah_id (integer)
  - nama (string, 150)
  - npsn (string, 20, unique)
  - alamat (string, 255)
  - kepala_sekolah (string, 100)
  - telepon (string, 25)
  - email (string, 150)
  - jenjang (enum: PAUD, SD, SMP, SMA) // Untuk filter direktori
  - kecamatan (string, 50) // Untuk filter geografis
  - status (enum: AKTIF, NONAKTIF)
  - akreditasi (enum: A, B, C, BELUM)
  - jumlah_siswa (integer)
  - jumlah_guru (integer)
  - tahun_berdiri (integer) // Informasi tambahan
  - deskripsi (text) // Profil sekolah
  - fasilitas (text) // JSON array atau text terstruktur
  - prestasi (text) // Daftar prestasi sekolah
  - foto_utama (string, 255) // URL foto sekolah
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## 3. Entitas: Berita
- PK: berita_id
- FK: dibuat_oleh -> Pengguna.pengguna_id
- Opsional: sekolah_id -> Sekolah.sekolah_id
- Atribut:
  - berita_id (integer)
  - judul (string, 200)
  - slug (string, 255, unique) // URL-friendly identifier
  - ringkasan (text) // Excerpt untuk listing
  - konten (text)
  - kategori (enum: PENGUMUMAN, KEGIATAN, PENDAFTARAN, KEUANGAN, KERJASAMA, BEASISWA)
  - status (enum: DRAFT, PUBLISHED, ARCHIVED)
  - tanggal_terbit (date)
  - unggulan (boolean) // Featured article
  - gambar_utama (string, 255) // URL gambar
  - views (integer) // Counter views
  - tags (string, 255) // Comma-separated tags
  - dibuat_oleh (integer, not null)
  - sekolah_id (integer, null)
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## 4. Entitas: Agenda
- PK: agenda_id
- FK: dibuat_oleh -> Pengguna.pengguna_id
- Opsional: sekolah_id -> Sekolah.sekolah_id
- Atribut:
  - agenda_id (integer)
  - judul (string, 200)
  - slug (string, 255, unique) // URL-friendly identifier
  - deskripsi (text)
  - tanggal (date)
  - waktu (time)
  - lokasi (string, 150)
  - alamat_lokasi (string, 255) // Alamat lengkap
  - status (enum: TERJADWAL, BERLANGSUNG, SELESAI, DITUNDA, DIBATALKAN)
  - kategori (enum: RAPAT, PELATIHAN, MONITORING, SOSIALISASI, EVALUASI)
  - peserta (string, 150) // Target peserta
  - kapasitas (integer) // Maksimal peserta
  - biaya (string, 50) // Informasi biaya (Gratis/Berbayar)
  - kontak_person (string, 100) // PIC agenda
  - telepon_kontak (string, 25)
  - sekolah_id (integer, null)
  - dibuat_oleh (integer, not null)
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## 5. Entitas: Layanan
- PK: layanan_id
- Atribut:
  - layanan_id (integer)
  - kode (string, 20, unique)  // PTK, SD, SMP, PAUD
  - nama (string, 100)
  - deskripsi (text) // Penjelasan layanan
  - warna (string, 30)  // Hex color untuk UI
  - estimasi_waktu (integer) // Estimasi waktu layanan (menit)
  - persyaratan (text) // Dokumen yang diperlukan
  - aktif (boolean)
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## 6. Entitas: Reservasi
- PK: reservasi_id
- FK: layanan_id -> Layanan.layanan_id
- Opsional: pengguna_id -> Pengguna.pengguna_id
- Atribut:
  - reservasi_id (integer)
  - nomor_antrian (string, 20, unique) // Generated: LAYANAN-TIMESTAMP
  - layanan_id (integer, not null)
  - tanggal (date)
  - slot_waktu (string, 11)  // "08:00 - 09:00"
  - nama_pemesan (string, 100)
  - telepon (string, 25)
  - nik (string, 20, null) // Opsional
  - tujuan (string, 255) // Keperluan kunjungan
  - status (enum: MENUNGGU, DIPANGGIL, SELESAI, DIBATALKAN, HANGUS)
  - estimasi_panggilan (time) // Estimasi waktu dipanggil
  - waktu_checkin (datetime, null) // Waktu kedatangan
  - waktu_selesai (datetime, null) // Waktu selesai layanan
  - catatan_admin (text, null) // Catatan internal
  - pengguna_id (integer, null)
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## 7. Entitas: SlotWaktu (Tambahan untuk management)
- PK: slot_id
- FK: layanan_id -> Layanan.layanan_id
- Atribut:
  - slot_id (integer)
  - layanan_id (integer, not null)
  - hari (enum: SENIN, SELASA, RABU, KAMIS, JUMAT)
  - waktu_mulai (time)
  - waktu_selesai (time)
  - kapasitas (integer) // Maksimal reservasi per slot
  - aktif (boolean)
  - dibuat_pada (datetime)

## Kardinalitas dan Relasi Detail

### Relasi Primer (Primary Relationships)

#### **1. Pengguna → Berita (1:M)**
- **Foreign Key**: `dibuat_oleh` di tabel Berita
- **Constraint**: NOT NULL, ON DELETE RESTRICT
- **Index**: CREATE INDEX idx_berita_dibuat_oleh ON berita(dibuat_oleh)
- **Business Rules**:
  - Setiap berita harus memiliki author yang valid
  - Admin yang dihapus akan memblokir penghapusan jika masih memiliki berita
  - Tracking untuk audit dan accountability

#### **2. Pengguna → Agenda (1:M)**
- **Foreign Key**: `dibuat_oleh` di tabel Agenda  
- **Constraint**: NOT NULL, ON DELETE RESTRICT
- **Index**: CREATE INDEX idx_agenda_dibuat_oleh ON agenda(dibuat_oleh)
- **Business Rules**:
  - Setiap agenda harus memiliki PIC (Person in Charge)
  - Workflow approval melalui admin yang bertanggung jawab
  - Tracking untuk manajemen event

#### **3. Layanan → Reservasi (1:M)**
- **Foreign Key**: `layanan_id` di tabel Reservasi
- **Constraint**: NOT NULL, ON DELETE RESTRICT  
- **Index**: CREATE INDEX idx_reservasi_layanan ON reservasi(layanan_id)
- **Unique Constraint**: (layanan_id, tanggal, slot_waktu) untuk mencegah double booking
- **Business Rules**:
  - Reservasi tidak dapat dibuat tanpa layanan yang valid
  - Layanan nonaktif tidak menerima reservasi baru
  - Nomor antrian generated berdasarkan kode layanan

#### **4. Layanan → SlotWaktu (1:M)**
- **Foreign Key**: `layanan_id` di tabel SlotWaktu
- **Constraint**: NOT NULL, ON DELETE CASCADE
- **Index**: CREATE INDEX idx_slot_waktu_layanan ON slot_waktu(layanan_id)
- **Business Rules**:
  - Mengatur jadwal operasional per layanan
  - Kapasitas maksimal per slot waktu
  - Fleksibilitas jadwal per hari kerja

### Relasi Sekunder (Optional Relationships)

#### **5. Pengguna → Reservasi (0|1:M)**
- **Foreign Key**: `pengguna_id` di tabel Reservasi
- **Constraint**: NULL allowed, ON DELETE SET NULL
- **Index**: CREATE INDEX idx_reservasi_pengguna ON reservasi(pengguna_id)
- **Business Rules**:
  - NULL = reservasi oleh guest (data manual)
  - NOT NULL = reservasi oleh user terdaftar (auto-fill)
  - User terdaftar mendapat riwayat dan notifikasi

#### **6. Sekolah → Agenda (0|1:M)**
- **Foreign Key**: `sekolah_id` di tabel Agenda
- **Constraint**: NULL allowed, ON DELETE SET NULL
- **Index**: CREATE INDEX idx_agenda_sekolah ON agenda(sekolah_id)
- **Business Rules**:
  - NULL = agenda umum (kantor dinas, hotel, dll)
  - NOT NULL = agenda di sekolah tertentu
  - Filter agenda berdasarkan lokasi

#### **7. Sekolah → Berita (0|1:M)**
- **Foreign Key**: `sekolah_id` di tabel Berita
- **Constraint**: NULL allowed, ON DELETE SET NULL
- **Index**: CREATE INDEX idx_berita_sekolah ON berita(sekolah_id)
- **Business Rules**:
  - NULL = berita umum dinas
  - NOT NULL = berita spotlight sekolah
  - Kategorisasi konten per sekolah

## Integritas Data (Data Integrity)

### Primary Keys
- Semua tabel menggunakan **BIGSERIAL** untuk auto-incrementing primary key
- Format: `{table_name}_id` (contoh: pengguna_id, sekolah_id)

### Unique Constraints
- **pengguna.email** - Mencegah duplikasi akun
- **sekolah.npsn** - NPSN adalah identifier unik sekolah secara nasional
- **layanan.kode** - Kode layanan unik (PTK, SD, SMP, PAUD)
- **berita.slug** - SEO-friendly URL unik
- **agenda.slug** - SEO-friendly URL unik
- **reservasi.nomor_antrian** - Nomor antrian unik sistem
- **reservasi(layanan_id, tanggal, slot_waktu)** - Mencegah double booking

### Referential Integrity
- **RESTRICT**: Mencegah penghapusan jika masih ada data terkait
  - Pengguna dengan berita/agenda tidak dapat dihapus
  - Layanan dengan reservasi tidak dapat dihapus
- **SET NULL**: Tetap mempertahankan data utama jika referensi dihapus
  - Agenda tetap ada meski sekolah dihapus
  - Berita tetap ada meski sekolah dihapus
  - Reservasi tetap valid meski user dihapus
- **CASCADE**: Hapus data terkait secara otomatis
  - SlotWaktu dihapus jika layanan dihapus

### Indexes untuk Performance
```sql
-- Pencarian dan Filter
CREATE INDEX idx_sekolah_jenjang ON sekolah(jenjang);
CREATE INDEX idx_sekolah_kecamatan ON sekolah(kecamatan);
CREATE INDEX idx_berita_kategori ON berita(kategori);
CREATE INDEX idx_agenda_kategori ON agenda(kategori);

-- Status dan Workflow
CREATE INDEX idx_berita_status ON berita(status);
CREATE INDEX idx_agenda_status ON agenda(status);
CREATE INDEX idx_reservasi_status ON reservasi(status);

-- Date-based Queries
CREATE INDEX idx_berita_tanggal_terbit ON berita(tanggal_terbit);
CREATE INDEX idx_agenda_tanggal ON agenda(tanggal);
CREATE INDEX idx_reservasi_tanggal ON reservasi(tanggal);

-- SEO dan Routing
CREATE INDEX idx_berita_slug ON berita(slug);
CREATE INDEX idx_agenda_slug ON agenda(slug);
```

## Aturan & Constraints Logis
- email Pengguna unik.
- npsn Sekolah unik.
- nomor_antrian Reservasi unik per sistem.
- slug Berita dan Agenda unik untuk SEO-friendly URLs.
- Kombinasi (layanan_id, tanggal, slot_waktu) pada Reservasi sebaiknya memiliki batasan kapasitas.
- SlotWaktu membantu mengatur jadwal operasional per layanan.
- Status reservasi mengikuti flow: MENUNGGU → DIPANGGIL → SELESAI/DIBATALKAN.
- Views counter pada Berita untuk analytics sederhana.

## Fitur Tambahan yang Diimplementasikan
- **Search & Filter**: Sekolah dapat dicari berdasarkan nama, jenjang, kecamatan, akreditasi.
- **Slug System**: Berita dan Agenda menggunakan slug untuk URL yang SEO-friendly.
- **View Counter**: Tracking popularitas berita.
- **Categorization**: Kategori yang lebih spesifik untuk berita dan agenda.
- **Queue Management**: Sistem antrian dengan estimasi waktu dan status tracking.
- **Capacity Management**: Slot waktu dengan batasan kapasitas untuk efisiensi layanan.
