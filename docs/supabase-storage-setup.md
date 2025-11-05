# 📦 Supabase Storage Setup - Upload Foto Production Ready

## 🎯 Overview

Sistem upload foto sudah diupdate untuk mendukung **Supabase Storage** (production) dengan **fallback ke local storage** (development).

### ✨ Keuntungan

- ✅ **Dual Mode**: Otomatis gunakan Supabase di production, local storage di development
- ✅ **No Breaking Changes**: Frontend tidak perlu diubah sama sekali
- ✅ **Serverless Compatible**: Berfungsi di Vercel, Netlify, dan platform hosting serverless lainnya
- ✅ **Automatic Fallback**: Jika Supabase gagal, otomatis fallback ke local storage

---

## 🚀 Setup untuk Production

### 1. Setup Supabase Storage Bucket

#### Di Supabase Dashboard:

1. **Login ke Supabase** → Pilih project Anda
2. **Storage** (sidebar kiri) → **Create a new bucket**
3. **Buat bucket**:
   - Name: `SIMDIK-Uploads`
   - Public bucket: ✅ **YES**
   - File size limit: `50 MB`
   - Allowed MIME types: `image/*`

4. **Set Policies** (penting untuk public access):

```sql
-- Policy 1: Allow public read
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'SIMDIK-Uploads');

-- Policy 2: Allow authenticated insert
CREATE POLICY "Allow upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'SIMDIK-Uploads');
```

**Atau gunakan Supabase UI:**
- Klik tab **Policies**
- Add policy → **Allow public read**
- Add policy → **Allow authenticated uploads**

### 2. Get Supabase Credentials

1. **Project Settings** → **API**
2. Copy credentials:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Setup Environment Variables

#### Development (`.env.local`):

Buat file `.env.local` di root project:

```env
# Database
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-url"

# Supabase Storage (opsional untuk development)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
NEXT_PUBLIC_SUPABASE_BUCKET="SIMDIK-Uploads"
```

#### Production (Vercel/Netlify):

Di dashboard hosting (Vercel/Netlify):

1. **Settings** → **Environment Variables**
2. Tambahkan:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_BUCKET = SIMDIK-Uploads
```

3. **Redeploy** aplikasi

---

## 🔧 Cara Kerja

### Development Mode (Local Storage)

**Jika tidak ada env Supabase:**

```
User upload foto
    ↓
/api/upload
    ↓
Simpan ke public/uploads/agendas/
    ↓
Return: /uploads/agendas/agenda-xxx.jpg
```

### Production Mode (Supabase Storage)

**Jika ada env Supabase:**

```
User upload foto
    ↓
/api/upload
    ↓
Upload ke Supabase Storage
    ↓
Return: https://xxx.supabase.co/storage/v1/object/public/SIMDIK-Uploads/agendas/agenda-xxx.jpg
```

---

## 📂 Struktur Folder di Supabase

Upload akan tersimpan di bucket dengan struktur:

```
SIMDIK-Uploads/
├── agendas/
│   ├── agenda-1730649600-abc123.jpg
│   ├── agenda-1730649601-xyz789.png
│   └── ...
├── beritas/
│   ├── berita-1730649602-def456.jpg
│   └── ...
└── sekolahs/
    ├── sekolah-1730649603-ghi789.png
    └── ...
```

---

## 🧪 Testing

### Test di Development (Local Storage)

1. **Jangan set** env Supabase di `.env.local`
2. Run `npm run dev`
3. Upload foto di admin panel
4. Cek console:
   ```
   ⚠️  Supabase not configured, using local storage
   ✅ Uploaded to local: /uploads/agendas/xxx.jpg
   ```
5. File akan ada di `public/uploads/agendas/`

### Test di Development (Supabase Storage)

1. **Set** env Supabase di `.env.local`
2. Run `npm run dev`
3. Upload foto di admin panel
4. Cek console:
   ```
   ✅ Supabase Storage enabled
   ✅ Uploaded to Supabase: https://xxx.supabase.co/storage/...
   ```
5. File akan ada di Supabase Dashboard → Storage → SIMDIK-Uploads

### Test di Production

1. Deploy ke Vercel/Netlify dengan env variables
2. Buka admin panel di production
3. Upload foto
4. Cek:
   - ✅ Foto tersimpan di Supabase
   - ✅ Foto dapat diakses (public URL)
   - ✅ Preview muncul di form
   - ✅ URL tersimpan di database

---

## 🔄 Migration: Foto Lama dari Local ke Supabase

Jika Anda sudah punya foto di `public/uploads/`, ada 2 opsi:

### Opsi 1: Biarkan Mix (Quick)

- ✅ Foto lama tetap di `public/uploads/` (akan ter-deploy)
- ✅ Foto baru ke Supabase
- ✅ Database mix: local path dan Supabase URL
- ✅ Tetap berfungsi dengan baik

### Opsi 2: Migrate Semua (Clean)

```bash
# 1. Upload manual dari public/uploads/ ke Supabase
# 2. Update URL di database:

UPDATE agendas 
SET gambar_url = REPLACE(
  gambar_url, 
  '/uploads/', 
  'https://xxx.supabase.co/storage/v1/object/public/SIMDIK-Uploads/'
)
WHERE gambar_url LIKE '/uploads/%';

UPDATE beritas 
SET gambar_utama = REPLACE(
  gambar_utama, 
  '/uploads/', 
  'https://xxx.supabase.co/storage/v1/object/public/SIMDIK-Uploads/'
)
WHERE gambar_utama LIKE '/uploads/%';

UPDATE sekolahs 
SET gambar_utama = REPLACE(
  gambar_utama, 
  '/uploads/', 
  'https://xxx.supabase.co/storage/v1/object/public/SIMDIK-Uploads/'
)
WHERE gambar_utama LIKE '/uploads/%';

# 3. Hapus public/uploads/ dari repo
# 4. Add ke .gitignore:
echo "public/uploads/" >> .gitignore
```

---

## 📊 Monitoring

### Check Storage Usage

**Supabase Dashboard:**
- Storage → SIMDIK-Uploads
- Lihat file size dan jumlah file

**Free Tier Limits:**
- Storage: 1 GB
- Bandwidth: 2 GB/month
- Requests: 50,000/month

### Check Upload Success

**Console Log:**
```javascript
// Success
✅ Uploaded to Supabase: https://xxx.supabase.co/storage/...
storage: 'supabase'

// Fallback
⚠️  Supabase error, falling back to local storage
✅ Uploaded to local: /uploads/agendas/xxx.jpg
storage: 'local'
```

---

## 🐛 Troubleshooting

### 1. "Bucket not found"

**Fix:**
- Cek nama bucket di Supabase: `SIMDIK-Uploads` (case-sensitive)
- Update env: `NEXT_PUBLIC_SUPABASE_BUCKET="SIMDIK-Uploads"`

### 2. "403 Forbidden" / Cannot Access Image

**Fix:**
- Set bucket ke **Public**
- Add policy untuk public read (lihat Setup step 1)

### 3. Upload Berhasil tapi Image Tidak Muncul

**Fix:**
- Cek URL di console log
- Buka URL langsung di browser
- Pastikan CORS enabled di Supabase (default: enabled)

### 4. "Row level security policy violation"

**Fix:**
```sql
-- Di Supabase SQL Editor
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public access"
ON storage.objects FOR SELECT
USING (true);
```

---

## 📝 Summary Checklist

### Development:
- [ ] Copy `.env.example` to `.env.local`
- [ ] (Optional) Add Supabase credentials untuk test production mode
- [ ] Run `npm run dev`
- [ ] Test upload foto

### Production:
- [x] Buat bucket `SIMDIK-Uploads` di Supabase
- [ ] Set bucket ke **Public**
- [ ] Add policies untuk read/write
- [ ] Get Supabase URL dan anon key
- [ ] Add env variables di Vercel/Netlify
- [ ] Deploy aplikasi
- [ ] Test upload di production

---

## 🎓 Technical Details

### File yang Diubah

✅ **1 File Saja**: `app/api/upload/route.ts`

### Frontend Impact

❌ **TIDAK ADA PERUBAHAN** di frontend:
- `components/agenda-form.tsx` → Tetap sama
- `app/admin/schools/page.tsx` → Tetap sama
- `app/admin/news/page.tsx` → Tetap sama

### Database Impact

❌ **TIDAK ADA PERUBAHAN** di schema:
- `gambar_url`, `gambar_utama`, `foto1`, `foto2` → Tetap `String`
- URL lokal (`/uploads/...`) atau Supabase URL sama-sama berfungsi

### Response Format

Response tetap sama:

```json
{
  "success": true,
  "data": {
    "url": "https://xxx.supabase.co/storage/...", // atau "/uploads/..."
    "fileName": "agenda-1730649600-abc123.jpg",
    "originalName": "foto-kegiatan.jpg",
    "size": 102400,
    "type": "image/jpeg",
    "storage": "supabase" // atau "local"
  }
}
```

---

## 🆘 Support

Jika ada masalah:

1. Cek console log di browser dan server
2. Cek Supabase Dashboard → Storage → Logs
3. Verify bucket policies
4. Test dengan Postman/Insomnia:

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.jpg"
```

---

**Selamat! Setup Supabase Storage berhasil!** 🎉

Upload foto sekarang production-ready dan akan berfungsi dengan baik di hosting serverless!


