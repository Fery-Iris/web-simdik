# ⚡ Quick Setup - TL;DR Version

> Untuk developer baru yang ingin setup cepat tanpa baca docs panjang.

---

## 🚀 Setup dalam 5 Menit

### 1. Clone & Install
```bash
git clone https://github.com/Fery-Iris/web-simdik.git
cd web-simdik
npm install
```

### 2. Minta Credentials
Minta **Lead Developer** untuk:
- ✅ Share file `.env.local` (via DM/secure channel)
- ✅ Invite ke Supabase Dashboard

### 3. Copy `.env.local`
Copy file `.env.local` yang diberikan ke **root project** (sejajar dengan `package.json`)

**ATAU** buat manual:
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase Storage  
NEXT_PUBLIC_SUPABASE_URL="https://vqirqjfmypfwysfmfcjl.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
NEXT_PUBLIC_SUPABASE_BUCKET="SIMDIK-Uploads"
```

### 4. Generate Prisma & Run
```bash
npx prisma generate
npm run dev
```

### 5. Test
- Buka: http://localhost:3000
- Login: (minta credentials admin dari lead dev)
- Test upload foto di admin panel

---

## ✅ Checklist Verification

Terminal output harus menunjukkan:
```
✅ Supabase Storage enabled
   URL: https://vqirqjfmypfwysfmfcjl.supabase.co
Ready in 3s
```

Upload foto harus ke Supabase:
```javascript
✅ Uploaded to Supabase: https://xxx.supabase.co/storage/...
storage: "supabase"
```

---

## 🐛 Quick Troubleshooting

| Error | Fix |
|-------|-----|
| `Supabase not configured` | Restart dev server (Ctrl+C, `npm run dev`) |
| `Database connection failed` | Check `DATABASE_URL` di `.env.local` |
| Upload ke `/uploads/...` | Supabase env tidak terbaca, restart server |
| `Port 3000 in use` | `npm run dev -- -p 3001` |

---

## 📖 Dokumentasi Lengkap

Untuk setup detail dan troubleshooting lengkap, baca:
- **`SETUP-UNTUK-TIM.md`** - Setup lengkap step-by-step
- **`docs/supabase-storage-setup.md`** - Setup Supabase Storage
- **`docs/environment-variables.md`** - Penjelasan env variables

---

**Selamat Coding! 🎉**

