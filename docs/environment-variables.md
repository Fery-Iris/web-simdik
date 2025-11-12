# 🔐 Environment Variables Guide

Panduan lengkap untuk setup environment variables di project SIMDIK.

---

## 📋 Required Variables

### 1. Database (Supabase PostgreSQL)

```env
DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

**Cara mendapatkan:**
1. Supabase Dashboard → Project Settings → Database
2. Copy **Connection String** → **URI**
3. Replace `[YOUR-PASSWORD]` dengan password database

---

## 📦 Optional Variables (Supabase Storage)

### 2. Supabase Storage (untuk Production Upload)

```env
NEXT_PUBLIC_SUPABASE_URL="https://[project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
NEXT_PUBLIC_SUPABASE_BUCKET="SIMDIK-Uploads"
```

**Cara mendapatkan:**
1. Supabase Dashboard → Project Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Catatan:**
- ✅ **OPSIONAL** - Jika tidak diisi, upload akan menggunakan local storage (`public/uploads/`)
- ✅ **WAJIB untuk Production** - Jika deploy ke Vercel/Netlify/serverless hosting
- ✅ Local storage TIDAK BERFUNGSI di serverless environment

---

## 📁 File Setup

### Development (`.env.local`)

Buat file `.env.local` di **root project**:

```bash
c:\Project_Magang\web-simdik\
├── .env.local          # ← Buat file ini
├── package.json
├── prisma/
└── ...
```

**Isi `.env.local`:**

```env
# Database (WAJIB)
DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Supabase Storage (OPSIONAL untuk development, WAJIB untuk production)
NEXT_PUBLIC_SUPABASE_URL="https://[project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
NEXT_PUBLIC_SUPABASE_BUCKET="SIMDIK-Uploads"
```

### Production (Vercel/Netlify)

**Di Dashboard Hosting:**

1. **Vercel**:
   - Settings → Environment Variables
   - Add variable satu per satu

2. **Netlify**:
   - Site settings → Environment variables
   - Add variable satu per satu

**Variables yang perlu ditambahkan:**

```
DATABASE_URL = postgresql://...
DIRECT_URL = postgresql://...
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_BUCKET = SIMDIK-Uploads
```

3. **Redeploy** setelah menambahkan env variables

---

## 🔍 Verification

### Check Environment Variables

**Development:**

```bash
# Windows PowerShell
npm run dev

# Cek console output:
✅ Supabase Storage enabled    # Jika env Supabase diisi
⚠️  Supabase not configured    # Jika env Supabase kosong
```

**Production:**

```bash
# Di Vercel/Netlify build logs
# Atau cek runtime logs saat upload foto
```

### Test Upload

1. **Buka admin panel**: `/admin/agenda` atau `/admin/schools` atau `/admin/news`
2. **Upload foto**
3. **Cek console browser**:

```javascript
// Dengan Supabase
✅ Uploaded to Supabase: https://xxx.supabase.co/storage/v1/object/public/SIMDIK-Uploads/agendas/xxx.jpg
storage: "supabase"

// Tanpa Supabase (local)
✅ Uploaded to local: /uploads/agendas/xxx.jpg
storage: "local"
```

---

## 🛡️ Security Notes

### ✅ AMAN untuk Public

- `NEXT_PUBLIC_SUPABASE_URL` → Public, boleh di client-side
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Public anon key, aman untuk client-side

### ⚠️ JANGAN COMMIT

File `.env.local` sudah ada di `.gitignore`, jadi:
- ❌ **JANGAN** commit file `.env.local` ke Git
- ❌ **JANGAN** share credentials di chat/email
- ✅ **HANYA** share template (tanpa value) via docs

### 🔒 Service Role Key (JANGAN DIPAKAI)

**PERINGATAN**: Jangan pernah gunakan `service_role` key di frontend!

```env
# ❌ JANGAN PAKAI INI di NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ✅ PAKAI INI (anon key)
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Service role key** bypass semua RLS policies → **BERBAHAYA** di client-side!

---

## 🧪 Testing Scenarios

### Scenario 1: Development dengan Local Storage

```env
# .env.local
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
# Tidak ada NEXT_PUBLIC_SUPABASE_*
```

**Result:**
- ✅ Upload → `public/uploads/`
- ✅ URL → `/uploads/agendas/xxx.jpg`

### Scenario 2: Development dengan Supabase

```env
# .env.local
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
NEXT_PUBLIC_SUPABASE_BUCKET="SIMDIK-Uploads"
```

**Result:**
- ✅ Upload → Supabase Storage
- ✅ URL → `https://xxx.supabase.co/storage/v1/object/public/SIMDIK-Uploads/agendas/xxx.jpg`

### Scenario 3: Production (Vercel/Netlify)

**Env variables di dashboard hosting:**
- DATABASE_URL ✅
- DIRECT_URL ✅
- NEXT_PUBLIC_SUPABASE_URL ✅
- NEXT_PUBLIC_SUPABASE_ANON_KEY ✅
- NEXT_PUBLIC_SUPABASE_BUCKET ✅

**Result:**
- ✅ Upload → Supabase Storage (serverless compatible)
- ✅ URL → Full Supabase URL
- ✅ **Production ready!**

---

## 🔄 Migration Path

### Path 1: Start Fresh (Recommended)

1. Setup Supabase Storage dari awal
2. Set env variables
3. Deploy
4. Semua foto baru ke Supabase

### Path 2: Gradual Migration

**Phase 1: Development**
```env
# .env.local - tidak ada Supabase env
# Upload lokal untuk development
```

**Phase 2: Production**
```env
# Vercel/Netlify - ada Supabase env
# Upload ke Supabase untuk production
```

**Phase 3: Migrate Old Photos**
- Upload foto lama manual ke Supabase
- Update URL di database
- Remove `public/uploads/` dari repo

---

## 📞 Support

**Masalah Environment Variables?**

1. Cek file `.env.local` ada di root project
2. Cek typo di nama variable (case-sensitive)
3. Restart dev server setelah edit `.env.local`
4. Cek `.gitignore` untuk memastikan `.env*` ignored

**Masalah Supabase Connection?**

1. Verify credentials di Supabase Dashboard
2. Test connection dengan Prisma Studio: `npm run db:studio`
3. Cek bucket name: `SIMDIK-Uploads` (case-sensitive)
4. Verify bucket is public

---

## ✅ Checklist

### Development Setup:
- [ ] Buat file `.env.local`
- [ ] Copy database URL dari Supabase
- [ ] (Optional) Copy Supabase Storage credentials
- [ ] Run `npm run dev`
- [ ] Test connection dan upload

### Production Setup:
- [ ] Add env variables di Vercel/Netlify
- [ ] Verify Supabase bucket exists dan public
- [ ] Deploy aplikasi
- [ ] Test upload di production
- [ ] Monitor Supabase storage usage

---

**Environment Variables Setup Complete!** 🎉


