# Rename Column Database ke Bahasa Indonesia

## 📝 Overview

Perubahan ini menggunakan Prisma `@map` directive untuk rename semua column di database menjadi Bahasa Indonesia, **TANPA** mengubah field name di application code.

## ✅ Keuntungan Approach Ini

1. **Code tetap pakai bahasa Inggris** - Lebih mudah untuk developer
2. **Database pakai bahasa Indonesia** - Lebih mudah dibaca di Supabase Schema Visualizer
3. **Tidak ada breaking changes** - Application code tidak perlu diubah sama sekali
4. **Safe** - Menggunakan Prisma mapping, bukan rename langsung

## 🗂️ Perubahan Schema

### Table: `agendas`

| Field Name (Code) | Column Name (DB) |
|-------------------|------------------|
| `title` | `judul` |
| `description` | `deskripsi` |
| `date` | `tanggal` |
| `time` | `waktu` |
| `location` | `lokasi` |
| `address` | `alamat` |
| `organizer` | `penyelenggara` |
| `capacity` | `kapasitas` |
| `category` | `kategori` |
| `registrationFee` | `biaya_pendaftaran` |
| `contactPerson` | `kontak_person` |
| `imageUrl` | `gambar_url` |
| `createdAt` | `dibuat_pada` |
| `updatedAt` | `diperbarui_pada` |

### Table: `layanans`

| Field Name (Code) | Column Name (DB) |
|-------------------|------------------|
| `name` | `nama` |
| `description` | `deskripsi` |
| `icon` | `ikon` |
| `color` | `warna` |
| `isActive` | `aktif` |
| `createdAt` | `dibuat_pada` |
| `updatedAt` | `diperbarui_pada` |

### Table: `reservations`

| Field Name (Code) | Column Name (DB) |
|-------------------|------------------|
| `queueNumber` | `nomor_antrian` |
| `service` | `layanan` |
| `name` | `nama` |
| `phone` | `telepon` |
| `purpose` | `keperluan` |
| `date` | `tanggal` |
| `timeSlot` | `waktu_kedatangan` |
| `estimatedCallTime` | `estimasi_waktu_panggilan` |
| `createdAt` | `dibuat_pada` |
| `updatedAt` | `diperbarui_pada` |

### Table: `beritas`

| Field Name (Code) | Column Name (DB) |
|-------------------|------------------|
| `views` | `dilihat` |
| `createdAt` | `dibuat_pada` |
| `updatedAt` | `diperbarui_pada` |

*(Note: Field lain sudah bahasa Indonesia sejak awal)*

## 🚀 Cara Deploy

### Step 1: Update Prisma Schema (✅ DONE)

Schema sudah di-update dengan `@map` directive.

### Step 2: Run SQL Script di Supabase

1. Buka Supabase SQL Editor
2. Copy-paste isi file `scripts/rename-columns-indonesian.sql`
3. Run script
4. Verifikasi hasilnya di Schema Visualizer

### Step 3: Generate Prisma Client (✅ DONE)

```bash
npx prisma generate
```

### Step 4: Restart Development Server

```bash
npm run dev
```

## 🔍 Verification

Setelah run SQL script, jalankan query ini untuk verifikasi:

```sql
-- Check agendas
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'agendas' 
ORDER BY ordinal_position;

-- Check layanans
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'layanans' 
ORDER BY ordinal_position;

-- Check reservations
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'reservations' 
ORDER BY ordinal_position;

-- Check beritas
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'beritas' 
ORDER BY ordinal_position;
```

## 📋 Checklist untuk Team

Jika team member lain mau sync:

1. ✅ `git pull` untuk update Prisma schema
2. ✅ `npx prisma generate` untuk regenerate Prisma client
3. ✅ **OPTIONAL**: Run SQL script di Supabase (jika belum dijalankan)
4. ✅ `npm run dev` untuk restart server

**PENTING**: SQL script hanya perlu dijalankan **SEKALI** di Supabase. Team member lain cukup `git pull` + `npx prisma generate`.

## ⚠️ Troubleshooting

### Error saat `npx prisma generate`

**Problem**: `EPERM: operation not permitted`

**Solution**: Stop development server dulu:
```bash
# PowerShell
Get-Process node | Where-Object {$_.MainWindowTitle -eq ''} | Stop-Process -Force

# Lalu jalankan lagi
npx prisma generate
```

### Application masih error setelah rename

1. Clear Next.js cache: hapus folder `.next`
2. Restart development server
3. Check Prisma Client sudah di-generate ulang

### SQL script error

**Problem**: Column sudah di-rename sebelumnya

**Solution**: Script sudah pakai `IF EXISTS`, jadi aman dijalankan berkali-kali. Kalau ada error, skip aja.

## 🎯 Testing

Setelah deploy, test semua fitur:

- ✅ Create agenda baru
- ✅ Edit agenda
- ✅ Create reservasi
- ✅ View reservasi di admin panel
- ✅ Create berita
- ✅ View berita di frontend

## 📚 Reference

- [Prisma `@map` Directive](https://www.prisma.io/docs/concepts/components/prisma-schema/names-in-underlying-database#using-map-and-map-to-rename-fields-and-models-in-the-prisma-client-api)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)

