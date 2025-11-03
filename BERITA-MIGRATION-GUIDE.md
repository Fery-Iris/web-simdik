# 🔄 Migrasi dari Tabel `news` ke Tabel `berita`

## 📋 Summary

Sistem berita sudah diubah untuk menggunakan **tabel `berita` yang sudah ada** di database, bukan membuat tabel baru `news`.

---

## ✅ Yang Sudah Diupdate

### 1. **Prisma Schema** (`prisma/schema.prisma`)
- ✅ Model `News` → `Berita`
- ✅ Field names sesuai dengan kolom database (`berita_id`, `judul`, `ringkasan`, `konten`, dll)
- ✅ Enum `NewsCategory` (PENGUMUMAN, KEGIATAN, PENDAFTARAN, KEUANGAN, KERJASAMA, BEASISWA)
- ✅ Enum `NewsStatus` (DRAFT, PUBLISHED, ARCHIVED)
- ✅ Mapping ke tabel `berita` dengan `@@map("berita")`

### 2. **API Routes**
- ✅ `app/api/news/route.ts` - Update untuk model `Berita`
- ✅ `app/api/news/[id]/route.ts` - Update untuk model `Berita`
- ✅ `app/api/news/slug/[slug]/route.ts` - Update untuk model `Berita`
- ✅ BigInt serialization untuk `berita_id`, `dibuat_oleh`, `sekolah_id`

### 3. **SQL Script**
- ✅ `scripts/update-berita-table.sql` - ALTER table untuk tambah kolom yang diperlukan
- ✅ `scripts/create-news-table.sql` - **DIHAPUS/TIDAK DIPAKAI LAGI**

---

## 🔧 Setup Steps (WAJIB DIJALANKAN)

### **Step 1: Generate Prisma Client**
```bash
npx prisma generate
```

### **Step 2: Run SQL Script di Supabase**

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy-paste isi file: `scripts/update-berita-table.sql`
3. Klik **RUN**

Script ini akan:
- ✅ Add kolom `slug` (jika belum ada)
- ✅ Add kolom `ringkasan` (jika belum ada)
- ✅ Add kolom `gambar_utama` (jika belum ada)
- ✅ Add kolom `views` (jika belum ada)
- ✅ Add kolom `unggulan` (jika belum ada)
- ✅ Add kolom `sekolah_id` (jika belum ada)
- ✅ Create indexes
- ✅ Update trigger untuk `diperbarui_pada`
- ✅ Generate slug otomatis untuk data existing

### **Step 3: Restart Dev Server**
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🗄️ Struktur Tabel Berita

| Kolom Database | Field Prisma | Type | Description |
|----------------|--------------|------|-------------|
| `berita_id` | `id` | BigInt | Primary key (autoincrement) |
| `judul` | `judul` | String | Judul berita |
| `slug` | `slug` | String | URL-friendly identifier (unique) |
| `ringkasan` | `ringkasan` | String? | Excerpt/ringkasan |
| `konten` | `konten` | String | Konten lengkap |
| `kategori` | `kategori` | NewsCategory | Enum kategori |
| `status` | `status` | NewsStatus | Status publikasi |
| `tanggal_terbit` | `tanggalTerbit` | DateTime? | Tanggal terbit |
| `unggulan` | `unggulan` | Boolean | Featured flag |
| `gambar_utama` | `gambarUtama` | String? | URL gambar |
| `views` | `views` | Int | Jumlah views |
| `tags` | `tags` | String? | Comma-separated tags |
| `dibuat_oleh` | `dibuatOleh` | BigInt | Foreign key ke penggunas |
| `sekolah_id` | `sekolahId` | BigInt? | Foreign key ke sekolah (optional) |
| `dibuat_pada` | `createdAt` | DateTime | Timestamp created |
| `diperbarui_pada` | `updatedAt` | DateTime | Timestamp updated |

---

## 📝 Mapping Field (Database vs Code)

### **Admin Form → Database**
```typescript
// Form input
{
  judul: "Pembangunan Sekolah Baru",
  slug: "pembangunan-sekolah-baru",
  ringkasan: "Ringkasan berita...",
  konten: "Konten lengkap...",
  kategori: "KEGIATAN",
  status: "PUBLISHED",
  gambarUtama: "/uploads/...",
  tags: "pendidikan, banjarmasin"
}

// Disimpan ke database
{
  berita_id: 1,
  judul: "Pembangunan Sekolah Baru",
  slug: "pembangunan-sekolah-baru",
  ringkasan: "Ringkasan berita...",
  konten: "Konten lengkap...",
  kategori: "KEGIATAN",
  status: "PUBLISHED",
  gambar_utama: "/uploads/...",
  tags: "pendidikan, banjarmasin",
  dibuat_oleh: 1,
  sekolah_id: null
}
```

---

## 🎯 Kategori Berita

Sesuai dengan database yang ada:

```typescript
enum NewsCategory {
  PENGUMUMAN    // Pengumuman umum
  KEGIATAN      // Kegiatan/event
  PENDAFTARAN   // Info pendaftaran
  KEUANGAN      // Keuangan/beasiswa
  KERJASAMA     // Kerjasama/partnership
  BEASISWA      // Beasiswa khusus
}
```

---

## 🔄 Perubahan dari Design Sebelumnya

### **Sebelumnya (news table):**
- Table: `news`
- ID: `id_news` (TEXT/CUID)
- Fields: `title`, `excerpt`, `content`, `author`, `category`
- Tags: `String[]` (array)

### **Sekarang (berita table):**
- Table: `berita`
- ID: `berita_id` (BIGINT)
- Fields: `judul`, `ringkasan`, `konten`, `kategori`
- Tags: `String` (comma-separated)
- Extra: `dibuat_oleh` (foreign key), `sekolah_id` (optional FK)

---

## 📁 Files yang Perlu Diupdate (BELUM SELESAI)

Karena kompleksitas, berikut files yang **BELUM diupdate** dan perlu disesuaikan manual:

### ❌ **Admin Page** (`app/admin/news/page.tsx`)
Perlu update:
- Interface `News` → field names
- Form fields (`title` → `judul`, `excerpt` → `ringkasan`, dll)
- API calls (sesuaikan dengan response format baru)
- Tags handling (array → comma-separated string)

### ❌ **Frontend Listing** (`app/berita/page.tsx`)
Perlu update:
- Interface `News` → field names
- `title` → `judul`
- `excerpt` → `ringkasan`
- `imageUrl` → `gambarUtama`

### ❌ **Frontend Detail** (`app/berita/[slug]/page.tsx`)
Perlu update:
- Interface `News` → field names
- Field mappings
- Tags handling

---

## 🔧 Quick Field Mapping Reference

| Old (news) | New (berita) |
|------------|--------------|
| `title` | `judul` |
| `excerpt` | `ringkasan` |
| `content` | `konten` |
| `category` | `kategori` |
| `author` | *(removed, use `dibuatOleh`)* |
| `imageUrl` | `gambarUtama` |
| `tags` (array) | `tags` (comma-separated string) |
| `id` (string) | `id` (BigInt → toString()) |
| `createdAt` | `createdAt` (dibuat_pada) |

---

## ⚠️ Important Notes

1. **BigInt Serialization**: 
   - Database menggunakan `BIGINT` untuk IDs
   - Harus convert ke `string` untuk JSON: `id.toString()`

2. **Tags Format**:
   - Database: `"pendidikan, banjarmasin, sekolah"`
   - Frontend: Split by comma menjadi array

3. **Foreign Keys**:
   - `dibuat_oleh`: Required, reference ke `penggunas.id_penggunas`
   - `sekolah_id`: Optional, reference ke `sekolah.sekolah_id`
   - Default `dibuat_oleh = 1` (admin user)

4. **Kategori**:
   - Gunakan enum `NewsCategory` yang sudah didefinisikan
   - Bukan free text seperti "Infrastruktur", "Teknologi"

---

## 🧪 Testing Checklist

- [ ] Run `npx prisma generate`
- [ ] Run SQL script `update-berita-table.sql`
- [ ] Restart dev server
- [ ] Test API `/api/news` (GET)
- [ ] Test API `/api/news` (POST)
- [ ] Test API `/api/news/[id]` (GET/PUT/DELETE)
- [ ] Test API `/api/news/slug/[slug]` (GET)
- [ ] Update admin page fields
- [ ] Update frontend fields
- [ ] Test CRUD lengkap
- [ ] Test BigInt serialization
- [ ] Test tags handling

---

## 🚀 Next Steps

1. ✅ Generate Prisma client
2. ✅ Run SQL script
3. ✅ Restart server
4. ⏳ **Update admin page** (field names & interface)
5. ⏳ **Update frontend pages** (field names & interface)
6. ⏳ Test CRUD functionality
7. ⏳ Test dengan data real

---

## 📞 Need Help?

Jika ada error:
1. Check Prisma client: `npx prisma generate`
2. Check database: SQL script sudah dijalankan?
3. Check BigInt serialization dalam API responses
4. Check field mappings: `title` vs `judul`, dll

---

**Status:** ⏳ **IN PROGRESS**  
**Priority:** 🔥 **HIGH** - Perlu update admin & frontend pages


