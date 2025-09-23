# Use Case Diagram - SIMDIK Kota Banjarmasin
## Sistem Informasi Manajemen Data dan Informasi Kependidikan

### Aktor:
1. **Admin** - Pengelola sistem yang bertanggung jawab mengelola seluruh konten dan data
2. **Pengunjung/Masyarakat** - Pengguna umum yang mengakses informasi pendidikan

---

## Use Case 1: Mengelola Data Sekolah
**Aktor:** Admin  
**Deskripsi:** Admin mengelola data sekolah, guru, dan siswa dalam sistem

**Flow Utama:**
1. Admin login ke sistem
2. Admin mengakses menu "Data Sekolah"
3. Admin dapat menambah, mengubah, atau menghapus data sekolah
4. Admin memperbarui statistik guru dan siswa
5. Sistem menyimpan perubahan data
6. Data terupdate ditampilkan di halaman publik

**Precondition:** Admin sudah login dengan hak akses yang sesuai  
**Postcondition:** Data sekolah berhasil diperbarui dan tersedia untuk publik

---

## Use Case 2: Mengelola Berita dan Agenda
**Aktor:** Admin  
**Deskripsi:** Admin mengelola konten berita dan agenda kegiatan pendidikan

**Flow Utama:**
1. Admin login ke sistem
2. Admin mengakses menu "Kelola Berita" atau "Kelola Agenda"
3. Admin membuat berita/agenda baru atau mengedit yang sudah ada
4. Admin mengisi judul, konten, gambar, dan tanggal publikasi
5. Admin mempublikasikan atau menyimpan sebagai draft
6. Konten yang dipublikasikan muncul di halaman publik

**Precondition:** Admin sudah login dengan hak akses pengelolaan konten  
**Postcondition:** Berita/agenda berhasil dipublikasikan dan dapat diakses masyarakat

---

## Use Case 3: Mengelola Sistem dan Pengguna
**Aktor:** Admin  
**Deskripsi:** Admin mengelola pengaturan sistem dan akun pengguna

**Flow Utama:**
1. Admin login sebagai Super Admin
2. Admin mengakses menu "Manajemen Pengguna"
3. Admin dapat menambah, mengubah, atau menghapus akun pengguna
4. Admin mengatur role dan hak akses pengguna
5. Admin memantau aktivitas sistem
6. Admin mengatur konfigurasi sistem

**Precondition:** Admin memiliki hak akses Super Admin  
**Postcondition:** Sistem dan pengguna berhasil dikelola sesuai kebutuhan

---

## Use Case 4: Melihat Dashboard dan Analytics
**Aktor:** Admin  
**Deskripsi:** Admin melihat dashboard dengan statistik dan analytics sistem

**Flow Utama:**
1. Admin login ke sistem
2. Admin mengakses halaman "Dashboard"
3. Admin melihat statistik real-time (jumlah sekolah, guru, siswa)
4. Admin melihat grafik perkembangan data pendidikan
5. Admin memantau aktivitas pengunjung website
6. Admin dapat mengekspor laporan dalam format PDF/Excel
7. Admin melihat tren pencarian dan halaman populer

**Precondition:** Admin sudah login dan data tersedia di sistem  
**Postcondition:** Admin mendapat insight untuk pengambilan keputusan

---

## Use Case 5: Mengelola Laporan dan Komunikasi
**Aktor:** Admin  
**Deskripsi:** Admin mengelola dan merespons laporan/pesan dari pengunjung

**Flow Utama:**
1. Admin login ke sistem
2. Admin mengakses menu "Laporan Masuk" atau "Pesan Pengunjung"
3. Admin melihat daftar laporan/pesan yang belum dibaca
4. Admin membaca detail laporan/pertanyaan dari masyarakat
5. Admin dapat mengkategorikan laporan (pengaduan, pertanyaan, saran)
6. Admin memberikan tanggapan atau tindak lanjut
7. Admin mengubah status laporan (proses, selesai, ditolak)
8. Sistem mengirim notifikasi balasan ke pengunjung (jika ada email)

**Precondition:** Ada laporan/pesan dari pengunjung yang masuk  
**Postcondition:** Laporan berhasil dikelola dan ditindaklanjuti

---

## Use Case 6: Mengakses Informasi Sekolah
**Aktor:** Pengunjung/Masyarakat  
**Deskripsi:** Masyarakat mengakses informasi data sekolah dan statistik pendidikan

**Flow Utama:**
1. Pengunjung membuka website SIMDIK
2. Pengunjung melihat dashboard dengan statistik pendidikan
3. Pengunjung dapat melihat data 314 sekolah, 2,847 guru, 50,050 siswa
4. Pengunjung mengakses direktori sekolah berdasarkan jenjang (PAUD, SD/MI, SMP/MTs)
5. Pengunjung dapat melihat detail informasi sekolah tertentu

**Precondition:** Website dapat diakses dan data tersedia  
**Postcondition:** Pengunjung mendapat informasi pendidikan yang dibutuhkan

---

## Use Case 7: Membaca Berita dan Agenda
**Aktor:** Pengunjung/Masyarakat  
**Deskripsi:** Masyarakat membaca berita terkini dan agenda kegiatan pendidikan

**Flow Utama:**
1. Pengunjung mengakses halaman "Berita" atau "Agenda"
2. Pengunjung melihat daftar berita/agenda terbaru
3. Pengunjung dapat memfilter berdasarkan kategori atau tanggal
4. Pengunjung membaca detail berita/agenda yang diminati
5. Pengunjung dapat berbagi informasi ke media sosial

**Precondition:** Konten berita/agenda sudah dipublikasikan oleh admin  
**Postcondition:** Pengunjung mendapat informasi terkini tentang pendidikan

---

## Use Case 8: Menghubungi Dinas Pendidikan dan Melaporkan
**Aktor:** Pengunjung/Masyarakat  
**Deskripsi:** Masyarakat menghubungi atau melaporkan sesuatu kepada Dinas Pendidikan

**Flow Utama:**
1. Pengunjung mengakses halaman "Kontak" atau "Lapor"
2. Pengunjung melihat informasi kontak (alamat, telepon, email)
3. Pengunjung mengisi form laporan/komunikasi dengan kategori (pengaduan, pertanyaan, saran)
4. Pengunjung melampirkan dokumen pendukung jika diperlukan
5. Pengunjung mengirim laporan/pesan
6. Sistem memberikan nomor tiket untuk tracking
7. Pengunjung dapat mengecek status laporan dengan nomor tiket

**Precondition:** Form kontak tersedia dan berfungsi  
**Postcondition:** Laporan berhasil dikirim dan dapat ditrack statusnya

---

## Diagram Hubungan Use Case

\`\`\`
                    SIMDIK Kota Banjarmasin
                           
    Admin                                    Pengunjung/Masyarakat
      |                                              |
      |-- Mengelola Data Sekolah                    |-- Mengakses Informasi Sekolah
      |-- Mengelola Berita dan Agenda               |-- Membaca Berita dan Agenda  
      |-- Mengelola Sistem dan Pengguna             |-- Menghubungi Dinas Pendidikan
      |-- Melihat Dashboard dan Analytics           |   dan Melaporkan
      |-- Mengelola Laporan dan Komunikasi          |
\`\`\`

---

## Kesimpulan
Sistem SIMDIK dirancang dengan 2 aktor utama yang memiliki peran berbeda namun saling melengkapi. Admin berperan sebagai pengelola sistem yang memastikan data dan informasi selalu terkini, serta mengelola komunikasi dengan masyarakat melalui dashboard analytics dan sistem pelaporan. Pengunjung/Masyarakat sebagai konsumen informasi yang dapat mengakses transparansi data pendidikan Kota Banjarmasin dan berkomunikasi langsung dengan Dinas Pendidikan melalui sistem pelaporan yang terstruktur.
