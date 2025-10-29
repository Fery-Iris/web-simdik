# Scripts Cleanup Analysis - SIMDIK

## 📊 Analisis File Script

### ✅ **KEEP - Scripts yang Masih Berguna**

| File | Status | Alasan |
|------|--------|---------|
| `generate-password-hash.js` | ✅ KEEP | **PENTING**: Utility untuk generate password hash admin baru |
| `seed-admin-v2.sql` | ✅ KEEP | **TERBARU**: Script untuk seed admin user (paling update) |
| `seed-layanans-bigint.sql` | ✅ KEEP | **AKTIF**: Seed data layanan dengan BigInt (sesuai schema) |

### ⚠️ **ARCHIVE - Scripts untuk Reference/Backup**

| File | Status | Alasan |
|------|--------|---------|
| `check-penggunas-structure.sql` | ⚠️ ARCHIVE | Reference untuk struktur tabel penggunas |
| `check-layanans-structure.sql` | ⚠️ ARCHIVE | Reference untuk struktur tabel layanans |
| `check-reservations-structure.sql` | ⚠️ ARCHIVE | Reference untuk struktur tabel reservations |

### ❌ **DELETE - Scripts yang Aman Dihapus**

#### **Testing Scripts (sudah tidak diperlukan):**
| File | Alasan Hapus |
|------|--------------|
| `test-agenda-api.js` | Test manual, sudah ada di aplikasi |
| `test-direct-db.js` | Test koneksi database, tidak perlu lagi |
| `test-edit-delete.js` | Test CRUD, sudah diimplementasikan |
| `test-friday-reservation.js` | Test spesifik, tidak relevan |
| `test-frontend-api.js` | Test manual frontend |
| `test-reservation-api.js` | Test API reservasi |
| `test-time-slots.js` | Test time slots |

#### **Migration/Setup Scripts (sudah dijalankan):**
| File | Alasan Hapus |
|------|--------------|
| `check-database.js` | Check koneksi DB, tidak perlu lagi |
| `migrate-to-database.js` | Migrasi mock data → DB, sudah selesai |
| `setup-agenda-db.js` | Setup awal agenda DB, sudah selesai |

#### **Old/Superseded SQL Scripts:**
| File | Alasan Hapus |
|------|--------------|
| `seed-admin-simple.sql` | **SUPERSEDED** by `seed-admin-v2.sql` |
| `seed-admin-user.sql` | **SUPERSEDED** by `seed-admin-v2.sql` |
| `seed-admin-user-fixed.sql` | **SUPERSEDED** by `seed-admin-v2.sql` |
| `seed-admin-user.js` | **SUPERSEDED** by `seed-admin-v2.sql` |
| `fix-penggunas-table.sql` | Fix sudah dijalankan, tidak perlu lagi |
| `fix-all-reservations-issues.sql` | Fix sudah dijalankan |
| `rename-id-to-id-reservations.sql` | Rename sudah selesai |

---

## 📁 Recommended Folder Structure

```
scripts/
├── 🟢 ACTIVE (simpan)
│   ├── generate-password-hash.js       ← Utility aktif
│   ├── seed-admin-v2.sql               ← Seed admin terbaru
│   └── seed-layanans-bigint.sql        ← Seed layanan terbaru
│
├── 📦 REFERENCE (optional - bisa archive/hapus)
│   ├── check-penggunas-structure.sql
│   ├── check-layanans-structure.sql
│   └── check-reservations-structure.sql
│
└── ❌ DELETE (hapus sekarang)
    ├── test-*.js (7 files)             ← Test scripts
    ├── check-database.js               ← Setup scripts
    ├── migrate-to-database.js
    ├── setup-agenda-db.js
    ├── seed-admin-*.sql (3 old versions)
    ├── seed-admin-user.js
    ├── fix-*.sql (2 files)
    └── rename-*.sql
```

---

## 🗑️ Files to Delete (Total: 17 files)

### Testing Scripts (7 files):
1. `test-agenda-api.js`
2. `test-direct-db.js`
3. `test-edit-delete.js`
4. `test-friday-reservation.js`
5. `test-frontend-api.js`
6. `test-reservation-api.js`
7. `test-time-slots.js`

### Migration/Setup Scripts (3 files):
8. `check-database.js`
9. `migrate-to-database.js`
10. `setup-agenda-db.js`

### Outdated SQL Scripts (7 files):
11. `seed-admin-simple.sql`
12. `seed-admin-user.sql`
13. `seed-admin-user-fixed.sql`
14. `seed-admin-user.js`
15. `fix-penggunas-table.sql`
16. `fix-all-reservations-issues.sql`
17. `rename-id-to-id-reservations.sql`

---

## ✅ Files to Keep (3 files)

1. **`generate-password-hash.js`** ✅
   - **Purpose**: Generate bcrypt hash untuk password admin baru
   - **Usage**: `node scripts/generate-password-hash.js YourPasswordHere`
   - **Status**: AKTIF - masih sering digunakan

2. **`seed-admin-v2.sql`** ✅
   - **Purpose**: Seed admin user terbaru dengan semua kolom
   - **Usage**: Jalankan di Supabase SQL Editor
   - **Status**: TERBARU - paling update

3. **`seed-layanans-bigint.sql`** ✅
   - **Purpose**: Seed data layanan dengan BigInt ID
   - **Usage**: Jalankan di Supabase SQL Editor
   - **Status**: TERBARU - sesuai schema

---

## 📋 Optional: Archive for Reference (3 files)

Jika ingin simpan untuk referensi struktur database:
- `check-penggunas-structure.sql`
- `check-layanans-structure.sql`
- `check-reservations-structure.sql`

**Recommendation**: Bisa dihapus juga, karena struktur tabel sudah ada di `prisma/schema.prisma`

---

## 🚀 Cleanup Commands

### Option 1: Manual Delete (Recommended)
Delete files satu per satu untuk kontrol lebih baik.

### Option 2: Batch Delete
```bash
# Delete all test scripts
rm scripts/test-*.js

# Delete migration scripts
rm scripts/check-database.js
rm scripts/migrate-to-database.js
rm scripts/setup-agenda-db.js

# Delete outdated SQL scripts
rm scripts/seed-admin-simple.sql
rm scripts/seed-admin-user.sql
rm scripts/seed-admin-user-fixed.sql
rm scripts/seed-admin-user.js
rm scripts/fix-penggunas-table.sql
rm scripts/fix-all-reservations-issues.sql
rm scripts/rename-id-to-id-reservations.sql
```

---

## 📌 Summary

**Total Scripts**: 23 files  
**Keep**: 3 files (13%)  
**Optional Archive**: 3 files (13%)  
**Delete**: 17 files (74%)

**Disk Space**: Cleaning up ~17 files akan menghemat space dan membuat repo lebih clean!

---

## ⚡ Quick Decision

**Delete sekarang**: Semua 17 files yang marked for deletion  
**Keep**: Hanya 3 files yang masih aktif digunakan  
**Result**: Repo lebih clean, maintainable, dan mudah dipahami! ✨

