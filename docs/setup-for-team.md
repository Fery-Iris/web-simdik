# Setup Instructions for Team - SIMDIK

## 🚀 Update Code dari Git

Ikuti langkah ini setiap kali ada update code dari repository:

---

## 📋 Step-by-Step

### **1. Pull Latest Code**
```bash
git pull origin main
```

### **2. Install Dependencies (jika ada package baru)**
```bash
npm install
```

### **3. Regenerate Prisma Client**
```bash
npx prisma generate
```

**PENTING:** Jalankan ini SETIAP KALI ada perubahan di `schema.prisma`!

---

## ⚠️ Database Updates

### **Jika menggunakan SHARED DATABASE (Supabase yang sama):**
- ✅ **Tidak perlu run SQL script**
- ✅ Database sudah di-update oleh team member lain
- ✅ Tinggal pull & generate

### **Jika menggunakan DATABASE SENDIRI (local/different):**
- ⚠️ **HARUS run SQL scripts** yang ada di folder `scripts/`
- Check apakah ada file SQL baru yang perlu dijalankan

---

## 📁 SQL Scripts yang Mungkin Perlu Dijalankan

Jika ada file baru di folder `scripts/`, check apakah perlu dijalankan:

### **Untuk Update Terakhir (Januari 2025):**

#### **1. Seed Admin User** (jika belum punya akun admin)
File: `scripts/seed-admin-v2.sql`
```
Login: disdikbanjarmasin@gmail.com
Password: Admin@Disdik2024
```

#### **2. Seed Layanan** (jika tabel layanans kosong)
File: `scripts/seed-layanans-bigint.sql`

#### **3. Rename Agendas ID Column** (jika error "column id not found")
File: `scripts/rename-agendas-id-column.sql`

---

## 🔄 Restart Development Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🧪 Verification

### **Test Fitur Utama:**
1. ✅ Login ke admin panel: `http://localhost:3000/login`
2. ✅ Dashboard load tanpa error
3. ✅ CRUD Agenda berfungsi
4. ✅ Reservasi berfungsi
5. ✅ Logout berfungsi

### **Jika Ada Error:**

#### **Error: "Cannot read properties of undefined (reading 'findUnique')"**
**Solution:**
```bash
npx prisma generate
npm run dev
```

#### **Error: "Column 'id' does not exist"**
**Solution:**
- Run SQL script: `scripts/rename-agendas-id-column.sql` di Supabase
- Kemudian restart server

#### **Error: "Column 'email' does not exist" (login error)**
**Solution:**
- Run SQL script: `scripts/seed-admin-v2.sql` di Supabase
- Ini akan create/fix tabel penggunas

---

## 📞 Troubleshooting Checklist

Jika ada masalah setelah git pull:

- [ ] Sudah run `npm install`?
- [ ] Sudah run `npx prisma generate`?
- [ ] Sudah restart dev server?
- [ ] File `.env` sudah ada dan benar?
- [ ] Database connection string masih valid?
- [ ] Clear `.next` cache: `rm -rf .next` (jika Windows: `rmdir /s .next`)

---

## 🔐 Environment Variables

Pastikan file `.env` ada dan isinya benar:

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth (jika ada)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
```

**JANGAN commit file `.env` ke Git!** (sudah ada di `.gitignore`)

---

## 📝 Quick Reference

### **Setiap kali git pull:**
```bash
git pull
npm install          # (jika ada package baru)
npx prisma generate  # (WAJIB jika ada perubahan schema)
npm run dev
```

### **Jika ada error setelah pull:**
```bash
# Clear cache & restart
rm -rf .next         # Windows: rmdir /s .next
npx prisma generate
npm run dev
```

### **Jika perlu reset database:**
1. Check folder `scripts/` untuk SQL scripts terbaru
2. Run di Supabase SQL Editor
3. Restart dev server

---

## 🎯 Summary

**Minimal Steps:**
1. `git pull`
2. `npx prisma generate`
3. `npm run dev`

**If Shared Database:** ✅ Done!

**If Own Database:** 
- Run SQL scripts di `scripts/` folder
- Then restart server

---

## 💡 Tips

- ✅ Selalu komunikasi dengan team jika ada perubahan database
- ✅ Backup database sebelum run SQL scripts
- ✅ Check commit messages untuk info perubahan
- ✅ Jika bingung, tanya team lead atau check dokumentasi di `docs/`

---

## 📚 Dokumentasi Lengkap

- `docs/authentication-setup.md` - Setup login/logout
- `docs/rename-agendas-id.md` - Rename kolom ID agendas
- `docs/logout-functionality.md` - Fitur logout
- `scripts/SCRIPTS-CLEANUP-ANALYSIS.md` - Penjelasan scripts

---

**Last Updated:** Januari 2025



