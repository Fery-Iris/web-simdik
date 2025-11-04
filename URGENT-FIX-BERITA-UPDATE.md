# 🚨 URGENT FIX: Berita Update Error

## Masalah
Error: `The column 'new' does not exist in the current database`
Error: `record "new" has no field "updated_at"`

## ✅ AKAR MASALAH DITEMUKAN!
Ada **TRIGGER di database** yang mencoba update kolom `updated_at`, tapi kolom sebenarnya bernama `diperbarui_pada`. 

Trigger ini konflik dengan Prisma's `@updatedAt` directive yang sudah otomatis handle timestamp updates.

## ✅ SOLUSI (MUDAH - 3 LANGKAH SAJA!)

### Langkah 1: Drop Trigger di Supabase ⭐ PENTING!

**PILIH SALAH SATU:**

#### Option A: Quick Fix (Recommended) ⚡
1. **Buka Supabase Dashboard** → Pilih project Anda
2. **Klik "SQL Editor"** di sidebar kiri
3. **Copy semua isi file** `scripts/FIX-TRIGGER-ONLY.sql`
4. **Paste ke SQL Editor** dan klik **Run**
5. Selesai! ✅

#### Option B: Full Fix (Jika Option A tidak cukup)
1. Copy semua isi file `scripts/SUPABASE-FIX-ENUMS.sql`
2. Jalankan di Supabase SQL Editor
3. Ini akan fix trigger + enum types sekaligus

### Langkah 2: Test Langsung! 

**TIDAK PERLU restart server atau regenerate!**

Setelah drop trigger di Supabase:
1. Buka admin panel: http://localhost:3000/admin/news
2. Edit salah satu berita
3. Klik Save
4. **Harusnya LANGSUNG berhasil! ✅**

### Langkah 3 (Optional): Jika Masih Error

Jika masih error setelah drop trigger:

```powershell
# Stop server (Ctrl+C)

# Run clean script
.\scripts\restart-clean.ps1

# Restart
npm run dev
```

## 🔍 Verifikasi

Cek di Supabase SQL Editor apakah trigger sudah terhapus:

```sql
-- Cek trigger di beritas table
SELECT trigger_name, event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'beritas';
```

**Harusnya KOSONG** (no rows) - artinya trigger sudah terhapus ✅

## 💡 Penjelasan Teknis

### Kenapa Trigger Bermasalah?

Di file `scripts/update-berita-table.sql` (yang mungkin pernah dijalankan sebelumnya), ada trigger:

```sql
CREATE TRIGGER beritas_updated_at_trigger
  BEFORE UPDATE ON beritas
  FOR EACH ROW
  EXECUTE FUNCTION update_beritas_updated_at();
```

Trigger ini mencoba update kolom `updated_at`, tapi:
- Kolom sebenarnya bernama `diperbarui_pada` (sudah direname)
- Prisma sudah handle ini otomatis dengan `@updatedAt`
- Trigger jadi konflik dan menyebabkan error

### Kenapa Error Message-nya "column new"?

PostgreSQL trigger menggunakan record `NEW` untuk row yang sedang di-update. Ketika trigger mencoba akses `NEW.updated_at` yang tidak ada, error message-nya jadi confusing: "record 'new' has no field 'updated_at'".

## 📞 Jika Masih Error

Kirim screenshot dari:
1. Error message lengkap di terminal
2. Output query verifikasi trigger di atas
3. Screenshot dari Supabase SQL Editor setelah jalankan script

## 📁 Files Yang Sudah Diperbaiki
- ✅ `prisma/schema.prisma` - Enum mappings added
- ✅ `app/api/news/[id]/route.ts` - Code refactored  
- ✅ `scripts/FIX-TRIGGER-ONLY.sql` - **Quick fix untuk trigger** ⭐
- ✅ `scripts/SUPABASE-FIX-ENUMS.sql` - Full fix (trigger + enums)
- ✅ `scripts/restart-clean.ps1` - Clean restart script
- ✅ `URGENT-FIX-BERITA-UPDATE.md` - Panduan ini

