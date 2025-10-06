# Conceptual Data Model (CDM) - SIMDIK Kota Banjarmasin

Tujuan: Mendefinisikan entitas bisnis utama dan relasi pada domain SIMDIK tanpa detail implementasi teknis.

## Entitas Utama
- Sekolah
- Berita
- Agenda
- Reservasi
- LaporanPengaduan
- Pengguna
- Layanan

## Definisi Singkat Entitas
- Sekolah: Unit pendidikan (SD, SMP, PAUD) di wilayah Kota Banjarmasin.
- Berita: Informasi/pengumuman yang dipublikasikan oleh dinas/admin.
- Agenda: Kegiatan yang dijadwalkan oleh dinas (rapat, pelatihan, monitoring, dll.).
- Reservasi: Pemesanan slot layanan masyarakat ke dinas (PTK/SD/SMP/PAUD) dengan tanggal dan waktu.
- LaporanPengaduan: Laporan/aduan dari masyarakat terkait fasilitas/administrasi/kurikulum, dsb.
- Pengguna: Akun pengguna sistem (Admin dan Pengunjung terdaftar bila diperlukan).
- Layanan: Tipe layanan yang tersedia untuk reservasi (PTK, SD Umum, SMP Umum, PAUD, dst.).

## Relasi dan Kardinalitas
- Pengguna (1) — (M) Berita
  Setiap berita dibuat oleh tepat satu pengguna (admin), satu pengguna dapat membuat banyak berita.

- Pengguna (1) — (M) Agenda
  Setiap agenda dibuat/dikelola oleh satu admin; satu admin dapat membuat banyak agenda.

- Pengguna (1) — (M) LaporanPengaduan
  Opsional: jika pelapor terautentikasi. Satu pengguna dapat membuat banyak laporan; laporan juga dapat dibuat anonim (tanpa relasi).

- Sekolah (1) — (M) LaporanPengaduan
  Satu sekolah dapat memiliki banyak laporan; satu laporan terkait tepat satu sekolah (target lokasi).

- Layanan (1) — (M) Reservasi
  Satu layanan dapat memiliki banyak reservasi; setiap reservasi memilih tepat satu layanan.

- Reservasi (M) — (1) Pengguna
  Opsional: jika reservasi dibuat oleh pengguna terdaftar. Jika tidak, reservasi berisi identitas mandiri (nama/telepon).

- Agenda (1) — (M) Sekolah
  Opsional: sebuah agenda dapat terkait satu sekolah (lokasi) atau umum (tidak wajib). Satu sekolah dapat memiliki banyak agenda.

- Sekolah (1) — (M) Berita
  Opsional: berita bisa bertema umum atau diarahkan ke sekolah tertentu (mis. spotlight). Satu sekolah dapat terkait banyak berita.

## Catatan Bisnis
- Status sekolah (Aktif/Nonaktif) dan akreditasi (A/B/C/Belum) adalah atribut bisnis, tidak memengaruhi relasi CDM.
- Reservasi memiliki nomor antrian, tanggal, dan slot waktu; kapasitas per slot dikelola per layanan (aturan bisnis waktu kerja).
- LaporanPengaduan memiliki status proses (Baru/Diproses/Selesai/Ditolak).
- Pengguna minimal memiliki peran (Admin, Opsional: Staf/Operator jika dibutuhkan di masa depan).
