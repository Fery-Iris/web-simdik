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

---

## 🔐 3. Minta Credentials dari Lead Developer

**⚠️ PENTING:** Jangan skip step ini!

Minta credentials berikut dari **Lead Developer / Project Owner**:

### Yang Perlu Diminta:

1. **Database URL** (2 string):
   - `DATABASE_URL`
   - `DIRECT_URL`

2. **Supabase Storage** (3 string):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_BUCKET` (biasanya: `SIMDIK-Uploads`)

3. **Akses Supabase Dashboard** (optional tapi recommended):
   - Email untuk diinvite ke Supabase project
   - Untuk bisa lihat database dan storage

### Cara Lead Developer Bisa Share:

**Opsi 1: Via File (Secure)**
```bash
# Lead developer bisa share file .env.local via secure method
# (Slack DM, Teams, encrypted email, etc)
```

**Opsi 2: Via Documentation**
```
Lead developer share credentials via Google Docs / Notion (private link)
```

❌ **JANGAN share via:**
- Public chat
- Screenshot di grup
- Commit ke Git
- Share screen recording

---

## 🔧 4. Setup Environment Variables

### A. Buat File `.env.local`

Di **root project** (sejajar dengan `package.json`), buat file bernama `.env.local`:

```
web-simdik/
├── .env.local          ← BUAT FILE INI
├── package.json
├── app/
└── ...
```

### B. Isi File `.env.local`

Copy-paste credentials yang diberikan lead developer:

```env
# Database (WAJIB)
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Supabase Storage (WAJIB untuk upload foto)
NEXT_PUBLIC_SUPABASE_URL="https://vqirqjfmypfwysfmfcjl.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
NEXT_PUBLIC_SUPABASE_BUCKET="SIMDIK-Uploads"
```

**⚠️ Ganti dengan credentials ASLI yang diberikan lead developer!**

### C. Verify File

**Check:**
- ✅ File bernama `.env.local` (ada titik di depan)
- ✅ Lokasi di root project
- ✅ Tidak ada di `git status` (sudah di-gitignore)

```bash
# Cek apakah file di-gitignore
git status

# .env.local TIDAK boleh muncul di list!
```

---

## 🗄️ 5. Setup Database

### A. Generate Prisma Client

```bash
npx prisma generate
```

### B. Verifikasi Database Connection

Test koneksi database (optional tapi recommended):

```bash
npx prisma db pull
```

**Jika berhasil:** Tidak ada error  
**Jika gagal:** Cek `.env.local`, pastikan `DATABASE_URL` benar

### C. Drop Trigger yang Bermasalah (PENTING!)

**⚠️ Skip step ini jika sudah pernah dijalankan oleh orang lain**

Jika ini **first time setup untuk tim**, salah satu orang perlu jalankan ini:

1. **Buka Supabase Dashboard** (minta akses dari lead developer)
2. **SQL Editor** (sidebar kiri)
3. **Copy dan jalankan SQL ini:**

```sql
-- Drop trigger yang bikin error update berita
DROP TRIGGER IF EXISTS beritas_updated_at_trigger ON beritas CASCADE;
DROP FUNCTION IF EXISTS update_beritas_updated_at() CASCADE;
```

4. **Verify:**

```sql
SELECT trigger_name 
FROM information_schema.triggers
WHERE event_object_table = 'beritas';
```

**Expected:** Tidak ada rows (trigger berhasil dihapus) ✅

---

## 🚀 6. Jalankan Development Server

```bash
npm run dev
```

### Output yang Diharapkan:

```
🔍 DEBUG Environment Variables:
  NEXT_PUBLIC_SUPABASE_URL: ✅ Set
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ✅ Set
  NEXT_PUBLIC_SUPABASE_BUCKET: SIMDIK-Uploads
✅ Supabase Storage enabled
   URL: https://vqirqjfmypfwysfmfcjl.supabase.co
   Bucket: SIMDIK-Uploads

Ready in 3.5s
```

**✅ Jika muncul "Supabase Storage enabled"** → Setup berhasil!  
**⚠️ Jika muncul "Supabase not configured"** → Cek `.env.local`, ada yang salah

### Buka Browser:

http://localhost:3000

---

## 🔐 7. Login Admin

Default admin credentials (jika sudah seed):
- Email: Lihat di `scripts/seed-admin-v2.sql`
- Password: Yang sudah di-set saat seed

Atau buat admin baru dengan menjalankan script seed.

---

---

## ✅ 8. Testing

### Test 1: Login
1. Buka http://localhost:3000/login
2. Login dengan credentials admin
3. **Harusnya redirect ke dashboard** ✅

### Test 2: Upload Foto
1. Buka http://localhost:3000/admin/agenda
2. Klik "Tambah Agenda"
3. Upload foto
4. **Cek Console browser** (F12 → Console tab)
5. **Expected:**
   ```javascript
   ✅ Uploaded to Supabase: https://xxx.supabase.co/storage/...
   storage: "supabase"
   ```
6. **NOT this:**
   ```javascript
   ✅ Uploaded to local: /uploads/...
   storage: "local"
   ```

### Test 3: CRUD Operations
1. **Create:** Tambah agenda/berita/sekolah → ✅ Berhasil
2. **Read:** Lihat list data → ✅ Muncul
3. **Update:** Edit data → ✅ Berhasil update
4. **Delete:** Hapus data → ✅ Berhasil delete

---

---

## 🐛 Troubleshooting

### ❌ Error: Environment variables tidak terbaca

**Gejala:**
```
⚠️ Supabase not configured, using local storage
```

**Solusi:**
1. Cek file bernama **`.env.local`** (ada titik di depan!)
2. Cek lokasi file di **root project** (sejajar dengan `package.json`)
3. **Restart dev server** (Ctrl+C, lalu `npm run dev`)
4. **Hard refresh browser** (Ctrl+Shift+R)

---

### ❌ Error: Database connection failed

**Gejala:**
```
Error: connect ECONNREFUSED
```

**Solusi:**
1. Cek `DATABASE_URL` di `.env.local` benar
2. Cek koneksi internet
3. Test connection: `npx prisma db pull`
4. Minta credentials ulang dari lead developer

---

### ❌ Error: Upload foto masih ke local

**Gejala:**
```
✅ Uploaded to local: /uploads/...
storage: "local"
```

**Solusi:**
1. Cek `.env.local` ada 3 variable Supabase (URL, KEY, BUCKET)
2. **Restart dev server** setelah edit `.env.local`
3. Cek terminal, harus ada "✅ Supabase Storage enabled"
4. Jika masih error, cek policies di Supabase (lihat docs)

---

### ❌ Error: Row Level Security Policy

**Gejala:**
```
StorageApiError: new row violates row-level security policy
```

**Solusi:**
1. Buka **Supabase Dashboard** → Storage → SIMDIK-Uploads → Policies
2. Pastikan ada policies untuk INSERT, SELECT, UPDATE, DELETE
3. Jika belum ada, jalankan SQL di `docs/supabase-storage-setup.md`

---

### ❌ Error: Port 3000 sudah dipakai

**Solusi:**
```bash
# Opsi 1: Pakai port lain
npm run dev -- -p 3001

# Opsi 2: Kill process di port 3000 (Windows)
npx kill-port 3000
```

---

### ❌ Error: Module not found

**Solusi:**
```bash
# Delete node_modules dan install ulang
rm -rf node_modules
npm install

# Atau
npm ci
```

---

### 🆘 Masih Error?

1. **Check docs lengkap:**
   - `docs/supabase-storage-setup.md` - Setup storage
   - `docs/environment-variables.md` - Env variables
   
2. **Tanya Lead Developer:**
   - Share screenshot error
   - Share terminal output
   - Share `.env.local` (SENSOR credentials!)

3. **Check Git Issues:**
   - Lihat apakah ada issue serupa
   - Buat issue baru jika perlu

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

