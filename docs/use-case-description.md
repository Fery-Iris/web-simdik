# Deskripsi Diagram Use Case - Sistem SIMDIK Kota Banjarmasin

## ACTORS (PELAKU)

### Admin
Administrator sistem yang memiliki akses penuh untuk mengelola seluruh aspek sistem SIMDIK, termasuk data sekolah, berita, agenda, reservasi, dan laporan sistem.

### Pengunjung
Pengguna umum yang mengakses sistem untuk mendapatkan informasi dan layanan pendidikan tanpa perlu login.

## USE CASES (KASUS PENGGUNAAN)

### UC1 - Kelola Dashboard
**Aktor**: Admin  
**Deskripsi**: Admin mengelola dashboard utama dengan statistik dan ringkasan data sistem  
**Kondisi Awal**: Admin telah login ke dalam sistem  
**Kondisi Akhir**: 
- Dashboard ditampilkan dengan data terkini
- Statistik sekolah, berita, agenda, dan reservasi terlihat
- Menu navigasi dapat diakses

**Alur**:
1. Admin mengakses dashboard
2. Sistem menampilkan statistik sekolah, berita, agenda, dan reservasi
3. Admin dapat melihat grafik dan data ringkasan
4. Admin dapat mengakses menu navigasi ke fitur lain

### UC2 - Kelola Data Sekolah
**Aktor**: Admin  
**Deskripsi**: Admin menambahkan, mengedit, atau menghapus data sekolah dalam sistem  
**Kondisi Awal**: Admin telah login ke dalam sistem  
**Kondisi Akhir**: 
- Data sekolah berhasil tersimpan dalam database
- Data baru muncul dalam daftar sekolah
- Perubahan data terupdate

**Alur**:
1. Admin memilih menu "Manajemen Sekolah"
2. Admin memilih tombol "Tambah Sekolah" atau "Edit Sekolah"
3. Admin melakukan pengisian data sekolah pada form (nama, NPSN, alamat, kepala sekolah, dll)
4. Admin menekan tombol "Simpan"
5. Jika valid, sistem memperbarui data dalam database

### UC3 - Kelola Berita
**Aktor**: Admin  
**Deskripsi**: Admin menambahkan, mengedit, atau menghapus berita dan pengumuman dalam sistem  
**Kondisi Awal**: Admin telah login ke dalam sistem  
**Kondisi Akhir**: 
- Berita berhasil tersimpan dalam database
- Berita baru muncul dalam daftar berita
- Berita dapat dipublikasikan

**Alur**:
1. Admin memilih menu "Manajemen Berita"
2. Admin memilih tombol "Tambah Berita" atau "Edit Berita"
3. Admin melakukan pengisian data berita pada form (judul, konten, kategori, status)
4. Admin menekan tombol "Simpan"
5. Jika valid, sistem memperbarui data dalam database

### UC4 - Kelola Agenda
**Aktor**: Admin  
**Deskripsi**: Admin menambahkan, mengedit, atau menghapus agenda dan kegiatan dalam sistem  
**Kondisi Awal**: Admin telah login ke dalam sistem  
**Kondisi Akhir**: 
- Agenda berhasil tersimpan dalam database
- Agenda baru muncul dalam daftar agenda
- Agenda dapat dilihat pengunjung

**Alur**:
1. Admin memilih menu "Manajemen Agenda"
2. Admin memilih tombol "Tambah Agenda" atau "Edit Agenda"
3. Admin melakukan pengisian data agenda pada form (judul, deskripsi, tanggal, waktu, lokasi)
4. Admin menekan tombol "Simpan"
5. Jika valid, sistem memperbarui data dalam database

### UC5 - Kelola Reservasi
**Aktor**: Admin  
**Deskripsi**: Admin mengelola dan memproses reservasi dari pengunjung  
**Kondisi Awal**: Admin telah login ke dalam sistem  
**Kondisi Akhir**: 
- Status reservasi berhasil diupdate
- Laporan reservasi terlihat
- Data reservasi dapat diekspor

**Alur**:
1. Admin memilih menu "Laporan Reservasi"
2. Admin melihat daftar reservasi
3. Admin memilih reservasi yang akan diproses
4. Admin mengubah status reservasi (menunggu, diproses, selesai)
5. Admin menekan tombol "Update Status"
6. Sistem memperbarui status reservasi dalam database

### UC6 - Lihat Laporan
**Aktor**: Admin  
**Deskripsi**: Admin melihat laporan dan statistik sistem  
**Kondisi Awal**: Admin telah login ke dalam sistem  
**Kondisi Akhir**: 
- Laporan ditampilkan dengan data terkini
- Statistik dan grafik terlihat
- Data dapat difilter berdasarkan periode

**Alur**:
1. Admin mengakses dashboard
2. Admin memilih menu "Laporan"
3. Sistem menampilkan statistik dan grafik
4. Admin dapat memfilter data berdasarkan periode
5. Admin dapat melihat laporan detail

### UC7 - Export Data
**Aktor**: Admin  
**Deskripsi**: Admin mengekspor data dalam berbagai format  
**Kondisi Awal**: Admin telah login ke dalam sistem  
**Kondisi Akhir**: 
- File ekspor tersedia untuk diunduh
- Data berhasil diekspor dalam format yang dipilih

**Alur**:
1. Admin memilih data yang akan diekspor
2. Admin memilih format ekspor (PDF, Excel, CSV)
3. Admin menekan tombol "Export"
4. Sistem memproses data
5. File ekspor dapat diunduh

### UC8 - Lihat Beranda
**Aktor**: Pengunjung  
**Deskripsi**: Pengunjung mengakses halaman utama sistem  
**Kondisi Awal**: Tidak ada  
**Kondisi Akhir**: 
- Halaman beranda ditampilkan
- Statistik pendidikan terlihat
- Menu navigasi dapat diakses

**Alur**:
1. Pengunjung mengakses website
2. Sistem menampilkan halaman beranda
3. Pengunjung dapat melihat statistik pendidikan
4. Pengunjung dapat mengakses menu navigasi

### UC9 - Reservasi Online
**Aktor**: Pengunjung  
**Deskripsi**: Pengunjung membuat reservasi layanan pendidikan  
**Kondisi Awal**: Tidak ada  
**Kondisi Akhir**: 
- Reservasi berhasil dibuat
- Nomor tiket tersedia
- Tiket dapat dicetak

**Alur**:
1. Pengunjung mengakses halaman reservasi
2. Pengunjung memilih layanan (PTK, SD, SMP, PAUD)
3. Pengunjung memilih tanggal dan waktu
4. Pengunjung mengisi data diri pada form
5. Pengunjung menekan tombol "Buat Reservasi"
6. Sistem menghasilkan nomor tiket
7. Pengunjung dapat mencetak tiket

### UC10 - Lihat Berita
**Aktor**: Pengunjung  
**Deskripsi**: Pengunjung membaca berita dan pengumuman  
**Kondisi Awal**: Tidak ada  
**Kondisi Akhir**: 
- Berita ditampilkan
- Daftar berita terlihat
- Detail berita dapat dibaca

**Alur**:
1. Pengunjung mengakses halaman berita
2. Sistem menampilkan daftar berita
3. Pengunjung dapat memfilter berita berdasarkan kategori
4. Pengunjung memilih berita yang ingin dibaca
5. Sistem menampilkan detail berita

### UC11 - Lihat Agenda
**Aktor**: Pengunjung  
**Deskripsi**: Pengunjung melihat agenda dan kegiatan  
**Kondisi Awal**: Tidak ada  
**Kondisi Akhir**: 
- Agenda ditampilkan
- Daftar agenda terlihat
- Detail agenda dapat dilihat

**Alur**:
1. Pengunjung mengakses halaman agenda
2. Sistem menampilkan daftar agenda
3. Pengunjung memilih agenda yang ingin dilihat
4. Sistem menampilkan detail agenda

### UC12 - Lihat Direktori Sekolah
**Aktor**: Pengunjung  
**Deskripsi**: Pengunjung mencari dan melihat informasi sekolah  
**Kondisi Awal**: Tidak ada  
**Kondisi Akhir**: 
- Informasi sekolah ditampilkan
- Daftar sekolah terlihat
- Detail sekolah dapat dilihat

**Alur**:
1. Pengunjung mengakses halaman direktori sekolah
2. Pengunjung dapat mencari sekolah berdasarkan nama
3. Pengunjung dapat memfilter berdasarkan jenjang dan kecamatan
4. Sistem menampilkan daftar sekolah
5. Pengunjung memilih sekolah yang ingin dilihat
6. Sistem menampilkan detail sekolah

### UC13 - Lihat Tentang SIMDIK
**Aktor**: Pengunjung  
**Deskripsi**: Pengunjung mengakses informasi tentang sistem  
**Kondisi Awal**: Tidak ada  
**Kondisi Akhir**: 
- Informasi tentang SIMDIK ditampilkan
- Visi, misi, dan kegiatan terlihat
- Detail kegiatan dapat dilihat

**Alur**:
1. Pengunjung mengakses halaman "Tentang SIMDIK"
2. Sistem menampilkan informasi visi, misi, dan kegiatan
3. Pengunjung dapat melihat detail kegiatan

### UC14 - Login Admin
**Aktor**: Admin  
**Deskripsi**: Admin melakukan autentikasi untuk mengakses sistem  
**Kondisi Awal**: Admin memiliki kredensial yang valid  
**Kondisi Akhir**: 
- Admin berhasil login
- Admin dapat mengakses fitur admin
- Dashboard admin ditampilkan

**Alur**:
1. Admin mengakses halaman login
2. Admin memasukkan email dan password
3. Admin menekan tombol "Sign In"
4. Sistem memverifikasi kredensial
5. Jika valid, admin diarahkan ke dashboard

### UC15 - Lihat Statistik Pendidikan
**Aktor**: Pengunjung  
**Deskripsi**: Pengunjung melihat data statistik pendidikan  
**Kondisi Awal**: Tidak ada  
**Kondisi Akhir**: 
- Statistik pendidikan ditampilkan
- Data sekolah, guru, dan siswa terlihat

**Alur**:
1. Pengunjung mengakses halaman beranda
2. Sistem menampilkan statistik pendidikan
3. Pengunjung dapat melihat data sekolah, guru, dan siswa

### UC16 - Lihat Kontak
**Aktor**: Pengunjung  
**Deskripsi**: Pengunjung mengakses informasi kontak  
**Kondisi Awal**: Tidak ada  
**Kondisi Akhir**: 
- Informasi kontak ditampilkan
- Alamat, telepon, dan email terlihat
- Peta lokasi dapat dilihat

**Alur**:
1. Pengunjung mengakses halaman kontak
2. Sistem menampilkan informasi alamat, telepon, dan email
3. Pengunjung dapat melihat peta lokasi

## RELASI USE CASE

### Include Relationships
- **UC2, UC3, UC4, UC5, UC6** include **UC1**: Semua fitur manajemen memerlukan akses dashboard
- **UC7** include **UC1**: Export data memerlukan akses dashboard

### Extend Relationships
- **UC9, UC10, UC11, UC12, UC13, UC15, UC16** extend **UC8**: Semua fitur pengunjung dapat diakses dari beranda

## BATASAN SISTEM

### Admin
- Hanya dapat mengakses fitur admin setelah login
- Memiliki akses penuh untuk mengelola semua data
- Dapat mengekspor data dalam berbagai format

### Pengunjung
- Dapat mengakses semua fitur publik tanpa login
- Tidak dapat mengubah data sistem
- Hanya dapat membuat reservasi dan melihat informasi

## REQUIREMENTS NON-FUNCTIONAL

- **Performance**: Sistem harus responsif dengan loading time < 3 detik
- **Usability**: Interface harus user-friendly dan mudah digunakan
- **Security**: Data admin harus terlindungi dengan autentikasi
- **Availability**: Sistem harus tersedia 24/7
- **Scalability**: Sistem harus dapat menangani peningkatan pengguna
