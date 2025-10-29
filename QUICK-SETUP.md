# 🚀 Quick Setup - SIMDIK (untuk Team)

## Untuk Update Code Terbaru

### **Jika pakai DATABASE YANG SAMA:**

```bash
git pull
npx prisma generate
npm run dev
```

✅ **SELESAI!**

---

### **Jika pakai DATABASE SENDIRI:**

```bash
git pull
npx prisma generate
# ⚠️ Run SQL script: scripts/rename-agendas-id-column.sql di Supabase
npm run dev
```

---

## ⚠️ Jika Ada Error

### Error 1: `Cannot read properties of undefined`
```bash
npx prisma generate
npm run dev
```

### Error 2: `Column 'id' does not exist`
- Run: `scripts/rename-agendas-id-column.sql` di Supabase
- Restart server

### Error 3: Cache issue
```bash
# Delete .next folder
# Windows PowerShell:
Remove-Item -Recurse -Force .next

npx prisma generate
npm run dev
```

---

## 📝 Update Terakhir

- ✅ Logout functionality
- ✅ Rename kolom `id` → `id_agendas` di tabel agendas
- ✅ Scripts cleanup (17 files dihapus)

---

**Dokumentasi lengkap:** `docs/setup-for-team.md`



