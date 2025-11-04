# ⚡ Quick Start untuk Tim

## Setup Baru (First Time)

```bash
# 1. Clone & install
git clone <repo-url>
cd web-simdik
npm install

# 2. Setup .env
# Copy .env.example ke .env dan isi credentials

# 3. Generate Prisma
npx prisma generate

# 4. 🚨 WAJIB: Drop trigger di Supabase
# Buka Supabase SQL Editor dan jalankan:
```

```sql
DROP TRIGGER IF EXISTS beritas_updated_at_trigger ON beritas CASCADE;
DROP FUNCTION IF EXISTS update_beritas_updated_at() CASCADE;
```

```bash
# 5. Run dev server
npm run dev
```

**Server:** http://localhost:3000

---

## Update Code (Git Pull)

```bash
git pull
npm install              # Jika ada package baru
npx prisma generate      # WAJIB jika ada perubahan schema
npm run dev
```

---

## 🔥 Error Update Berita?

Jika error: **"The column 'new' does not exist"**

**Solusi cepat:**
1. Buka Supabase SQL Editor
2. Jalankan: `scripts/FIX-TRIGGER-ONLY.sql`
3. Done! Test lagi.

**Detail:** Lihat `URGENT-FIX-BERITA-UPDATE.md`

---

## 📚 Dokumentasi Lengkap

- **Setup lengkap:** `SETUP-UNTUK-TIM.md`
- **Fix berita:** `URGENT-FIX-BERITA-UPDATE.md`
- **Update guide:** `docs/setup-for-team.md`

---

## ✅ Checklist untuk Developer Baru

- [ ] Clone repo
- [ ] Install dependencies
- [ ] Setup `.env` file
- [ ] Generate Prisma client
- [ ] **Drop trigger di Supabase** ⭐
- [ ] Run dev server
- [ ] Test login & CRUD berita

---

**Need Help?** Lihat dokumentasi atau tanya team lead!

