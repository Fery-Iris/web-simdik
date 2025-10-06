# Logical Data Model (LDM) - SIMDIK Kota Banjarmasin

Catatan: Ini adalah model logis (independen DBMS). Tipe data bersifat generik.

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
  - status (enum: AKTIF, NONAKTIF)
  - akreditasi (enum: A, B, C, BELUM)
  - jumlah_siswa (integer)
  - jumlah_guru (integer)
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## 3. Entitas: Berita
- PK: berita_id
- FK: dibuat_oleh -> Pengguna.pengguna_id
- Opsional: sekolah_id -> Sekolah.sekolah_id
- Atribut:
  - berita_id (integer)
  - judul (string, 200)
  - konten (text)
  - kategori (enum: PENGUMUMAN, KEGIATAN, PENDAFTARAN, KEUANGAN)
  - status (enum: DRAFT, PUBLISHED, ARCHIVED)
  - tanggal_terbit (date)
  - unggulan (boolean)
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
  - deskripsi (text)
  - tanggal (date)
  - waktu (time)
  - lokasi (string, 150)
  - status (enum: TERJADWAL, BERLANGSUNG, SELESAI, DITUNDA, DIBATALKAN)
  - kategori (string, 50)
  - peserta (string, 150)
  - sekolah_id (integer, null)
  - dibuat_oleh (integer, not null)
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## 5. Entitas: Layanan
- PK: layanan_id
- Atribut:
  - layanan_id (integer)
  - kode (string, 20, unique)  // contoh: PTK, SD, SMP, PAUD
  - nama (string, 100)
  - warna (string, 30)  // referensi warna UI opsional
  - aktif (boolean)
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## 6. Entitas: Reservasi
- PK: reservasi_id
- FK: layanan_id -> Layanan.layanan_id
- Opsional: pengguna_id -> Pengguna.pengguna_id
- Atribut:
  - reservasi_id (integer)
  - nomor_antrian (string, 20, unique)
  - layanan_id (integer, not null)
  - tanggal (date)
  - slot_waktu (string, 11)  // contoh: "08:00 - 09:00"
  - nama_pemesan (string, 100)
  - telepon (string, 25)
  - nik (string, 20, null)
  - tujuan (string, 255)
  - status (enum: MENUNGGU, SELESAI, DIBATALKAN)
  - estimasi_panggilan (time)
  - pengguna_id (integer, null)
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## 7. Entitas: LaporanPengaduan
- PK: laporan_id
- FK: sekolah_id -> Sekolah.sekolah_id
- Opsional: pelapor_id -> Pengguna.pengguna_id
- Atribut:
  - laporan_id (integer)
  - judul (string, 200)
  - kategori (string, 50) // Fasilitas, Kurikulum, Administrasi, Keuangan, dll.
  - prioritas (enum: RENDAH, SEDANG, TINGGI)
  - deskripsi (text)
  - tanggal_lapor (date)
  - status (enum: BARU, DIPROSES, SELESAI, DITOLAK)
  - kontak (string, 25)
  - bukti (string, 200)
  - sekolah_id (integer, not null)
  - pelapor_id (integer, null)
  - dibuat_pada (datetime)
  - diperbarui_pada (datetime)

## Kardinalitas
- Pengguna 1..1 — 0..* Berita (dibuat_oleh)
- Pengguna 1..1 — 0..* Agenda (dibuat_oleh)
- Pengguna 0..1 — 0..* LaporanPengaduan (pelapor_id, opsional)
- Sekolah 1..1 — 0..* LaporanPengaduan
- Layanan 1..1 — 0..* Reservasi
- Pengguna 0..1 — 0..* Reservasi (opsional)
- Sekolah 0..1 — 0..* Berita (opsional)
- Sekolah 0..1 — 0..* Agenda (opsional)

## Aturan & Constraints Logis
- email Pengguna unik.
- npsn Sekolah unik.
- nomor_antrian Reservasi unik per sistem (kombinasi kode layanan + time-based bisa dipakai di layer aplikasi).
- tanggal + slot_waktu + layanan_id pada Reservasi sebaiknya unik (mencegah double booking slot) — kandidat unique (layanan_id, tanggal, slot_waktu).
- LaporanPengaduan sekolah_id wajib, pelapor_id opsional.
- Nilai enum dibatasi sesuai daftar pada masing-masing atribut enum.
