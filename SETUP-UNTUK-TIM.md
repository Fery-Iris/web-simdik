# 🚀 Setup untuk Tim / Developer Baru

> **Updated:** 5 November 2025  
> Panduan lengkap setup project SIMDIK untuk developer baru.

---

## ✅ Prerequisites

Pastikan sudah terinstall:
- ✅ **Node.js** (versi 18+) - [Download](https://nodejs.org/)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

---

## 📥 1. Clone Repository

```bash
# Clone dari GitHub
git clone https://github.com/Fery-Iris/web-simdik.git

# Masuk ke folder project
cd web-simdik
```

---

## 📦 2. Install Dependencies

```bash
npm install
```

**Tunggu sampai selesai** (5-10 menit tergantung internet).

### 2. Setup Database di Supabase

#### A. Jalankan Migration (Jika Belum)

```bash
npx prisma migrate deploy
```

#### B. **PENTING: Drop Trigger yang Bermasalah**

1. **Buka Supabase Dashboard** → Pilih project Anda
2. **Klik "SQL Editor"** di sidebar
3. **Copy dan jalankan SQL ini:**

```sql
-- Drop trigger yang bikin error update berita
DROP TRIGGER IF EXISTS beritas_updated_at_trigger ON beritas CASCADE;
DROP FUNCTION IF EXISTS update_beritas_updated_at() CASCADE;
```

**ATAU** jalankan file: `scripts/FIX-TRIGGER-ONLY.sql`

#### C. Verifikasi Trigger Sudah Terhapus

Jalankan di Supabase SQL Editor:

```sql
SELECT trigger_name 
FROM information_schema.triggers
WHERE event_object_table = 'beritas';
```

**Harusnya tidak ada rows** (trigger berhasil dihapus) ✅

### 3. Setup Environment Variables

#### A. Buat file `.env.local`

Buat file `.env.local` di root project (sudah di-gitignore):

```env
# Database (WAJIB)
DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Supabase Storage (OPSIONAL untuk development, WAJIB untuk production)
NEXT_PUBLIC_SUPABASE_URL="https://[project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
NEXT_PUBLIC_SUPABASE_BUCKET="SIMDIK-Uploads"
```

**Catatan:**
- Database URL: Wajib untuk koneksi database
- Supabase Storage: Opsional untuk development (gunakan local storage)
- Untuk production/hosting: Wajib setup Supabase Storage

📖 **Panduan lengkap**: Lihat `docs/environment-variables.md`

#### B. Setup Supabase Storage (Opsional untuk Development)

Jika ingin test Supabase Storage di lokal:

1. **Buka Supabase Dashboard** → Storage
2. **Buat bucket**: `SIMDIK-Uploads` (Public)
3. **Copy credentials** dari Project Settings → API
4. **Update `.env.local`** dengan Supabase credentials

📖 **Panduan lengkap**: Lihat `docs/supabase-storage-setup.md`

**Jika tidak setup Supabase Storage:**
- ✅ Upload foto akan otomatis menggunakan local storage (`public/uploads/`)
- ✅ Berfungsi untuk development
- ⚠️  Tidak akan berfungsi di production hosting (Vercel/Netlify)

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di: http://localhost:3000

---

## 🔐 Login Admin

Default admin credentials (jika sudah seed):
- Email: Lihat di `scripts/seed-admin-v2.sql`
- Password: Yang sudah di-set saat seed

Atau buat admin baru dengan menjalankan script seed.

---

## ✅ Testing

### Test Update Berita
1. Login sebagai admin
2. Buka http://localhost:3000/admin/news
3. Edit salah satu berita
4. Klik Save
5. **Harusnya berhasil tanpa error!** ✅

---

## 🐛 Troubleshooting

### Error: "The column 'new' does not exist"

**Penyebab:** Trigger di database belum di-drop.

**Solusi:**
1. Pastikan sudah jalankan `scripts/FIX-TRIGGER-ONLY.sql` di Supabase
2. Verifikasi dengan query di Step 2.C
3. Restart dev server jika perlu

### Error: Prisma Client tidak found

```bash
npx prisma generate
```

### Error: Database connection

1. Cek `.env.local` file - pastikan `DATABASE_URL` benar
2. Cek koneksi internet
3. Cek apakah Supabase project masih aktif

### Error: Port 3000 sudah dipakai

```bash
# Stop proses yang pakai port 3000, atau:
npm run dev -- -p 3001
```

### Error: Upload foto tidak berfungsi

**Development:**
1. Cek apakah folder `public/uploads/` ada
2. Jika pakai Supabase: cek `.env.local` untuk credentials
3. Cek console log untuk error message

**Production:**
1. Pastikan Supabase Storage sudah setup
2. Verify env variables di Vercel/Netlify
3. Cek bucket `SIMDIK-Uploads` ada dan public

📖 **Troubleshooting lengkap**: Lihat `docs/supabase-storage-setup.md`

---

## 📁 Struktur Project

```
web-simdik/
├── app/                  # Next.js app router
│   ├── admin/           # Admin pages
│   ├── api/             # API routes
│   └── ...
├── components/          # React components
├── lib/                 # Utilities
├── prisma/              # Database schema & migrations
├── scripts/             # SQL & utility scripts
│   ├── FIX-TRIGGER-ONLY.sql  ← PENTING!
│   └── ...
├── public/              # Static files
└── ...
```

---

## 🔧 Database Schema Updates

Jika ada perubahan schema:

```bash
# 1. Update prisma/schema.prisma
# 2. Generate migration
npx prisma migrate dev --name nama_migration

# 3. Generate Prisma client
npx prisma generate

# 4. Restart server
```

---

## 📝 Catatan Penting

### Tentang Trigger `beritas_updated_at_trigger`

- ❌ Trigger ini **HARUS dihapus** dari database
- Trigger ini bikin error saat update berita
- Prisma sudah handle `updatedAt` otomatis dengan `@updatedAt`
- Jangan re-create trigger ini!

### File `.env`

Pastikan `.env` berisi:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

**JANGAN commit `.env` ke GitHub!** (sudah ada di `.gitignore`)

---

## 👥 Untuk Lead Developer

Jika ada developer baru join:

1. ✅ Share credentials Supabase
2. ✅ Pastikan mereka jalankan `scripts/FIX-TRIGGER-ONLY.sql`
3. ✅ Pastikan `.env` sudah dikonfigurasi
4. ✅ Test update berita untuk memastikan setup benar

---

## 📞 Need Help?

Jika ada masalah:

1. Cek dokumentasi di `docs/`
2. Cek `URGENT-FIX-BERITA-UPDATE.md` untuk troubleshooting
3. Cek `docs/berita-update-fix.md` untuk penjelasan teknis
4. Hubungi lead developer

---

## ✅ Checklist Setup Lengkap

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Setup `.env` file
- [ ] Jalankan `scripts/FIX-TRIGGER-ONLY.sql` di Supabase ⭐
- [ ] Generate Prisma client (`npx prisma generate`)
- [ ] Jalankan dev server (`npm run dev`)
- [ ] Test login admin
- [ ] Test create/edit/delete berita
- [ ] **Konfirmasi update berita BERHASIL** ✅

---

## 🎉 Success!

Jika semua checklist di atas sudah ✅, setup Anda berhasil!

Selamat coding! 🚀

