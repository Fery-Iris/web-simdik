# Database Relations Setup - Documentation

## 📋 Overview

Menambahkan relasi foreign key antara tabel-tabel utama sesuai dengan diagram database:
- `beritas` → `penggunas`
- `beritas` → `sekolahs`
- `agendas` → `penggunas`

## 🗺️ Database Diagram

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  penggunas  │       │   sekolahs   │       │   agendas   │
├─────────────┤       ├──────────────┤       ├─────────────┤
│id_penggunas │◄──┐   │ id_sekolahs  │◄──┐   │ id_agendas  │
│ nama        │   │   │ nama         │   │   │ judul       │
│ email       │   │   │ alamat       │   │   │ deskripsi   │
│password_hash│   │   │ kecamatan    │   │   │ tanggal     │
│ peran       │   │   │ jenjang      │   │   │ waktu       │
│ ...         │   │   │ ...          │   │   │id_penggunas │─┐
└─────────────┘   │   └──────────────┘   │   └─────────────┘ │
                  │                       │                    │
                  │   ┌──────────────┐   │                    │
                  └───│   beritas    │───┘                    │
                      ├──────────────┤                        │
                      │ id_beritas   │                        │
                      │ judul        │                        │
                      │ konten       │                        │
                      │id_penggunas  │←───────────────────────┘
                      │id_sekolahs   │
                      │ ...          │
                      └──────────────┘
```

## 🔗 Foreign Key Relations

### 1. beritas → penggunas
```sql
ALTER TABLE "public"."beritas"
ADD CONSTRAINT "beritas_id_penggunas_fkey" 
FOREIGN KEY ("id_penggunas") 
REFERENCES "public"."penggunas"("id_penggunas") 
ON DELETE SET NULL 
ON UPDATE CASCADE;
```

**Meaning**: Setiap berita dapat memiliki satu penulis (pengguna). Jika pengguna dihapus, `id_penggunas` pada berita akan di-set `NULL`.

### 2. beritas → sekolahs
```sql
ALTER TABLE "public"."beritas"
ADD CONSTRAINT "beritas_id_sekolahs_fkey" 
FOREIGN KEY ("id_sekolahs") 
REFERENCES "public"."sekolahs"("id_sekolahs") 
ON DELETE SET NULL 
ON UPDATE CASCADE;
```

**Meaning**: Setiap berita dapat terkait dengan satu sekolah. Jika sekolah dihapus, `id_sekolahs` pada berita akan di-set `NULL`.

### 3. agendas → penggunas
```sql
ALTER TABLE "public"."agendas"
ADD CONSTRAINT "agendas_id_penggunas_fkey" 
FOREIGN KEY ("id_penggunas") 
REFERENCES "public"."penggunas"("id_penggunas") 
ON DELETE SET NULL 
ON UPDATE CASCADE;
```

**Meaning**: Setiap agenda dapat memiliki satu pembuat (pengguna). Jika pengguna dihapus, `id_penggunas` pada agenda akan di-set `NULL`.

## 📊 Prisma Schema Updates

### Agenda Model
```prisma
model Agenda {
  // ... existing fields
  idPenggunas BigInt? @map("id_penggunas")
  
  // Relation
  pengguna Pengguna? @relation(fields: [idPenggunas], references: [id], onDelete: SetNull)
  
  @@index([idPenggunas])
}
```

### Pengguna Model
```prisma
model Pengguna {
  // ... existing fields
  
  // Relations (1-to-many)
  agendas Agenda[]
  beritas Berita[]
}
```

### Berita Model
```prisma
model Berita {
  // ... existing fields
  idPenggunas BigInt? @map("id_penggunas")
  idSekolahs  BigInt? @map("id_sekolahs")
  
  // Relations
  pengguna Pengguna? @relation(fields: [idPenggunas], references: [id], onDelete: SetNull)
  sekolah  Sekolah?  @relation(fields: [idSekolahs], references: [id], onDelete: SetNull)
  
  @@index([idPenggunas])
  @@index([idSekolahs])
}
```

### Sekolah Model
```prisma
model Sekolah {
  // ... existing fields
  
  // Relations (1-to-many)
  beritas Berita[]
}
```

## 📝 New Columns Added

| Table | Column | Type | Nullable | Description |
|-------|--------|------|----------|-------------|
| `agendas` | `id_penggunas` | BIGINT | YES | FK to penggunas.id_penggunas |
| `beritas` | `id_sekolahs` | BIGINT | YES | FK to sekolahs.id_sekolahs |

**Note**: `beritas.id_penggunas` sudah ada sebelumnya, hanya ditambahkan FK constraint.

## 🔍 Indexes Created

```sql
-- Performance indexes untuk FK
CREATE INDEX "beritas_id_sekolahs_idx" ON "beritas"("id_sekolahs");
CREATE INDEX "agendas_id_penggunas_idx" ON "agendas"("id_penggunas");
```

## 🚀 Implementation Steps

### Step 1: Run SQL Script in Supabase

```bash
# Copy contents of scripts/add-database-relations.sql
# Paste and run in Supabase SQL Editor
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Verify Relations

Check in Supabase:
1. Go to Database → Schema Visualizer
2. You should see arrows between:
   - beritas → penggunas
   - beritas → sekolahs
   - agendas → penggunas

## 📐 Cardinality

| Relation | Type | Description |
|----------|------|-------------|
| Pengguna → Agenda | 1-to-many | Satu pengguna dapat membuat banyak agenda |
| Pengguna → Berita | 1-to-many | Satu pengguna dapat menulis banyak berita |
| Sekolah → Berita | 1-to-many | Satu sekolah dapat memiliki banyak berita |

## 🔐 Referential Integrity

### ON DELETE SET NULL
Jika parent record dihapus, FK di child akan di-set `NULL` (tidak akan menghapus child record).

**Example**:
```sql
-- Jika pengguna dengan id=1 dihapus
DELETE FROM penggunas WHERE id_penggunas = 1;

-- Semua berita dan agenda yang dibuat user tersebut:
-- - TIDAK akan dihapus
-- - id_penggunas akan di-set NULL
```

### ON UPDATE CASCADE
Jika PK parent berubah, FK di child akan otomatis update.

**Example**:
```sql
-- Jika id_sekolahs berubah (jarang terjadi karena auto-increment)
UPDATE sekolahs SET id_sekolahs = 999 WHERE id_sekolahs = 1;

-- Semua berita yang terkait:
-- - id_sekolahs akan otomatis update menjadi 999
```

## ⚠️ Important Notes

1. **Nullable FK**: Semua FK bersifat optional (`BigInt?`)
   - Agenda boleh tidak punya pengguna
   - Berita boleh tidak punya pengguna/sekolah

2. **Existing Data**: Data yang sudah ada tidak akan terpengaruh
   - FK yang NULL akan tetap NULL
   - Tidak ada data yang hilang

3. **No Breaking Changes**: 
   - Kode yang ada tetap berfungsi
   - Hanya menambah relasi, tidak mengubah struktur existing

## 🧪 Testing

### Verify FK in Supabase SQL Editor

```sql
-- Check all FK constraints
SELECT
  tc.table_name, 
  tc.constraint_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('beritas', 'agendas', 'sekolahs', 'penggunas')
ORDER BY tc.table_name;
```

### Expected Output

```
table_name | constraint_name             | column_name  | foreign_table_name | foreign_column_name
-----------|-----------------------------|--------------|--------------------|--------------------
agendas    | agendas_id_penggunas_fkey   | id_penggunas | penggunas          | id_penggunas
beritas    | beritas_id_penggunas_fkey   | id_penggunas | penggunas          | id_penggunas
beritas    | beritas_id_sekolahs_fkey    | id_sekolahs  | sekolahs           | id_sekolahs
```

## 📁 Files Modified

- ✅ `scripts/add-database-relations.sql` - SQL script untuk Supabase
- ✅ `prisma/schema.prisma` - Updated models dengan relasi
- ✅ `docs/database-relations-setup.md` - Documentation

## 🎯 Benefits

1. **Data Integrity**: Database ensures valid references
2. **Better Queries**: Can join tables easily
3. **Prisma Relations**: Can use `.include({ pengguna: true })`
4. **Schema Visualization**: Clear diagram in Supabase
5. **Referential Actions**: Auto-cleanup with SET NULL

## 💡 Usage Examples

### Query with Relations (Prisma)

```typescript
// Get berita with pengguna and sekolah
const berita = await prisma.berita.findUnique({
  where: { id: 1 },
  include: {
    pengguna: true,
    sekolah: true
  }
})

// Get agenda with pengguna
const agenda = await prisma.agenda.findMany({
  include: {
    pengguna: true
  }
})

// Get all beritas of a school
const school = await prisma.sekolah.findUnique({
  where: { id: 1 },
  include: {
    beritas: true
  }
})
```

## ✅ Checklist

- [ ] Run SQL script in Supabase
- [ ] Verify FK constraints in Schema Visualizer
- [ ] Run `npx prisma generate`
- [ ] Test existing code (should work without changes)
- [ ] Optionally: Update API to include relations

## 🔄 Rollback (If Needed)

```sql
-- Remove FK constraints
ALTER TABLE "beritas" DROP CONSTRAINT IF EXISTS "beritas_id_penggunas_fkey";
ALTER TABLE "beritas" DROP CONSTRAINT IF EXISTS "beritas_id_sekolahs_fkey";
ALTER TABLE "agendas" DROP CONSTRAINT IF EXISTS "agendas_id_penggunas_fkey";

-- Remove columns (optional)
ALTER TABLE "beritas" DROP COLUMN IF EXISTS "id_sekolahs";
ALTER TABLE "agendas" DROP COLUMN IF EXISTS "id_penggunas";
```

