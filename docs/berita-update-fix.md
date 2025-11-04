# Fix: Berita Update Error

## Problem
When trying to update a berita (news) entry, the API was throwing an error:
```
The column `new` does not exist in the current database.
```

This error occurred even though:
- Create operations worked fine
- Delete operations worked fine  
- Only UPDATE operations failed

## Root Cause
The issue was caused by a **PostgreSQL trigger** that was trying to update a column named `updated_at` which doesn't exist in the database.

### The Real Problem
In `scripts/update-berita-table.sql`, a trigger was created:
```sql
CREATE TRIGGER beritas_updated_at_trigger
  BEFORE UPDATE ON beritas
  EXECUTE FUNCTION update_beritas_updated_at();
```

This trigger tried to set `NEW.updated_at = CURRENT_TIMESTAMP`, but:
1. The column was renamed from `updated_at` to `diperbarui_pada`
2. Prisma's `@updatedAt` directive already handles this automatically
3. The trigger caused a conflict: "record 'new' has no field 'updated_at'"

### Why the Confusing Error Message?
PostgreSQL triggers use a `NEW` record to represent the row being updated. When the trigger tried to access `NEW.updated_at` (which doesn't exist), the error message was: "record 'new' has no field 'updated_at'".

This was confusingly reported by Prisma as: "The column `new` does not exist" - making it seem like there was a column literally named "new".

## Solution Applied

### 1. Drop the Problematic Trigger (PRIMARY FIX)
Created SQL script to remove the conflicting trigger:

**File: `scripts/FIX-TRIGGER-ONLY.sql`**
```sql
DROP TRIGGER IF EXISTS beritas_updated_at_trigger ON beritas CASCADE;
DROP FUNCTION IF EXISTS update_beritas_updated_at() CASCADE;
```

This removes the trigger that was causing the conflict. Prisma's `@updatedAt` directive will handle timestamp updates automatically.

### 2. Added `@@map` Directives to Enums (BONUS FIX)
Added explicit mapping for enum types in `prisma/schema.prisma`:

```prisma
enum NewsCategory {
  PENGUMUMAN
  KEGIATAN
  PENDAFTARAN
  KEUANGAN
  KERJASAMA
  BEASISWA

  @@map("NewsCategory")
}

enum NewsStatus {
  DRAFT
  PUBLISHED
  ARCHIVED

  @@map("NewsStatus")
}
```

### 3. Refactored Update API Route
Rewrote `app/api/news/[id]/route.ts` to:

- Use explicit type definitions for the update data object
- Avoid using `any` type which can cause issues
- Use typed enums for `kategori` and `status` fields
- Add better logging for debugging
- Handle Date objects properly

Key changes:
```typescript
// Before: Using any type
const updateData: any = {}

// After: Using explicit types
const prismaUpdateData: {
  judul?: string
  slug?: string
  ringkasan?: string
  konten?: string
  kategori?: "PENGUMUMAN" | "KEGIATAN" | "PENDAFTARAN" | "KEUANGAN" | "KERJASAMA" | "BEASISWA"
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  tanggalTerbit?: Date
  unggulan?: boolean
  gambarUtama?: string | null
  tags?: string | null
} = {}
```

### 3. Improved Field Assignment
Changed from using computed properties to explicit conditional assignments:

```typescript
// Explicitly check each field and assign
if (validatedData.judul) prismaUpdateData.judul = validatedData.judul
if (validatedData.slug) prismaUpdateData.slug = validatedData.slug
// ... and so on
```

## Testing
Created and ran a test script to verify the Prisma client could update the berita table directly, confirming that the database schema was correct and the issue was with the API route implementation or cache.

## Steps to Apply The Fix

### Step 1: Run SQL in Supabase
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `scripts/FIX-TRIGGER-ONLY.sql`
3. Paste and click Run
4. Verify: Query `information_schema.triggers WHERE event_object_table = 'beritas'` should return no rows

### Step 2: Test Immediately
No need to restart! Try updating a berita immediately after dropping the trigger.

### Step 3 (Optional): Clean Restart
If still having issues:
```bash
# Windows PowerShell
.\scripts\restart-clean.ps1
npm run dev
```

## Verification

Check if trigger is gone:
```sql
SELECT trigger_name 
FROM information_schema.triggers
WHERE event_object_table = 'beritas';
```

Expected result: **No rows** (trigger successfully removed)

## Prevention
- **DON'T create manual triggers for `updated_at`** - Prisma's `@updatedAt` handles this automatically
- If you rename columns, make sure to drop any old triggers that reference the old column names
- Always use `@@map` directives when column/enum names in database differ from Prisma models
- Test database changes in development before applying to production
- Document any manual database changes (triggers, functions, constraints)

## Files Modified
- ✅ `scripts/FIX-TRIGGER-ONLY.sql` - Quick script to drop problematic trigger
- ✅ `scripts/SUPABASE-FIX-ENUMS.sql` - Full fix including trigger and enum fixes
- ✅ `prisma/schema.prisma` - Added `@@map` directives to enums
- ✅ `app/api/news/[id]/route.ts` - Refactored PUT handler  
- ✅ `URGENT-FIX-BERITA-UPDATE.md` - Step-by-step fix guide
- ✅ `docs/berita-update-fix.md` - This technical documentation

## Related Documentation
- [Prisma Client Generation](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Zod Validation](https://zod.dev/)

