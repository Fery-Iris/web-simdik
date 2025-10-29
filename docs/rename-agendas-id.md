# Rename Agendas ID Column - SIMDIK

## 📋 Overview

Mengubah nama kolom `id` menjadi `id_agendas` di tabel `agendas` **hanya di database** (Supabase), tapi **tetap menggunakan `id` di code** untuk menghindari error.

---

## 🎯 Tujuan

- ✅ Konsistensi penamaan kolom di database
- ✅ Tampilan di Supabase Schema Visualizer lebih jelas
- ✅ Tidak mengubah code yang sudah ada (zero breaking changes)

---

## 🔄 Changes

### **Database (Supabase):**
```
Column Name: id → id_agendas
```

### **Code (Prisma & API):**
```typescript
// Tetap menggunakan 'id' di code
agenda.id  // ✅ Masih bisa digunakan seperti biasa
```

---

## 📝 Step-by-Step Implementation

### **1. Update Prisma Schema**

File: `prisma/schema.prisma`

```prisma
model Agenda {
  id               String   @id @default(cuid()) @map("id_agendas")  // ← Tambahkan @map
  title            String   @db.VarChar(255)
  slug             String   @unique @db.VarChar(255)
  // ... rest of fields
  
  @@map("agendas")
}
```

**Penjelasan:**
- `@map("id_agendas")` = mapping nama kolom di database
- Di code tetap gunakan `id`, bukan `id_agendas`

---

### **2. Run SQL Script di Supabase**

File: `scripts/rename-agendas-id-column.sql`

1. **Buka Supabase Dashboard**
2. **Pergi ke SQL Editor**
3. **Copy-paste script dari file di atas**
4. **Run Query**

**Script akan:**
- ✅ Check struktur tabel sebelum rename
- ✅ Rename kolom `id` → `id_agendas`
- ✅ Verify struktur tabel setelah rename
- ✅ Check data masih intact

---

### **3. Regenerate Prisma Client**

```bash
npx prisma generate
```

**Ini penting** agar Prisma client tahu mapping baru!

---

### **4. Restart Development Server**

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## ✅ Verification

### **Check 1: Supabase Schema Visualizer**
- Buka Supabase → Database → Schema Visualizer
- Tabel `agendas` sekarang punya kolom `id_agendas` ✅

### **Check 2: Test API**
```bash
# GET agendas
curl http://localhost:3000/api/agendas

# Response should still work normally
{
  "data": [
    {
      "id": "clxxx...",  // ← Masih 'id', bukan 'id_agendas'
      "title": "...",
      ...
    }
  ]
}
```

### **Check 3: Test Admin Panel**
- Buka `http://localhost:3000/admin/agenda`
- Create, Edit, Delete agenda masih berfungsi normal ✅

---

## 🔍 How It Works

### **Prisma @map Directive**

```prisma
id String @id @default(cuid()) @map("id_agendas")
     ↑                                    ↑
  Code name                        Database column name
```

**In Code:**
```typescript
// ✅ Correct - use 'id'
const agenda = await prisma.agenda.findUnique({
  where: { id: "clxxx..." }
})

console.log(agenda.id)  // ✅ Works!

// ❌ Wrong - don't use 'id_agendas'
console.log(agenda.id_agendas)  // ❌ Error!
```

**In Database:**
```sql
-- ✅ Column is 'id_agendas'
SELECT id_agendas FROM agendas;

-- ❌ Column 'id' doesn't exist anymore
SELECT id FROM agendas;  -- Error!
```

---

## 🚨 Important Notes

### **DO's ✅**
- ✅ Use `agenda.id` in TypeScript/JavaScript code
- ✅ Regenerate Prisma client after schema change
- ✅ Restart dev server after Prisma generate
- ✅ Run SQL script ONLY ONCE

### **DON'Ts ❌**
- ❌ Don't use `agenda.id_agendas` in code (will error)
- ❌ Don't run SQL script multiple times
- ❌ Don't manually edit database after mapping
- ❌ Don't skip `npx prisma generate`

---

## 🔄 Rollback (If Needed)

### **If something goes wrong:**

1. **Revert Prisma Schema:**
```prisma
id String @id @default(cuid())  // Remove @map
```

2. **Revert Database:**
```sql
ALTER TABLE "public"."agendas" 
RENAME COLUMN "id_agendas" TO "id";
```

3. **Regenerate & Restart:**
```bash
npx prisma generate
npm run dev
```

---

## 📊 Consistency Across Tables

After this change, all tables have consistent naming:

| Table | Code Field | Database Column |
|-------|------------|-----------------|
| `agendas` | `id` | `id_agendas` ✅ |
| `reservations` | `id` | `id_reservations` ✅ |
| `layanans` | `id` | `id_layanans` ✅ |
| `penggunas` | `id` | `id_penggunas` ✅ |

**Perfect consistency!** 🎯

---

## 📝 Files Modified

- ✅ `prisma/schema.prisma` - Added `@map("id_agendas")`
- ✅ `scripts/rename-agendas-id-column.sql` - SQL script untuk rename
- ✅ `docs/rename-agendas-id.md` - Dokumentasi ini

---

## 🎉 Summary

✅ **Column renamed** in database: `id` → `id_agendas`  
✅ **Code unchanged**: Still use `agenda.id`  
✅ **Zero breaking changes**: Semua API & UI tetap berfungsi  
✅ **Schema consistency**: Semua tabel punya `id_*` pattern  

---

## 🚀 Ready to Apply?

1. ✅ Prisma schema updated
2. ⏳ Run SQL script di Supabase
3. ⏳ Run `npx prisma generate`
4. ⏳ Restart dev server
5. ⏳ Test di admin panel

**Follow the steps above!** 😊



