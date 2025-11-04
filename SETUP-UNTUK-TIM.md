# 🚀 Setup untuk Tim / Developer Baru

## Prerequisites
- [x] Sudah clone repository dari GitHub
- [x] Sudah setup `.env` file dengan database credentials
- [x] Node.js sudah terinstall

---

## 📋 Langkah-Langkah Setup

### 1. Install Dependencies

```bash
npm install
```

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

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Jalankan Development Server

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

1. Cek `.env` file - pastikan `DATABASE_URL` benar
2. Cek koneksi internet
3. Cek apakah Supabase project masih aktif

### Error: Port 3000 sudah dipakai

```bash
# Stop proses yang pakai port 3000, atau:
npm run dev -- -p 3001
```

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

