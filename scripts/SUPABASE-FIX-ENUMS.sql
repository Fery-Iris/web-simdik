-- ========================================
-- FIX BERITA UPDATE ISSUE IN SUPABASE
-- ========================================
-- IMPORTANT: Run this in Supabase SQL Editor
-- This fixes both the trigger and enum type issues
-- ========================================

-- FIRST: Drop problematic trigger and function
DROP TRIGGER IF EXISTS beritas_updated_at_trigger ON beritas;
DROP FUNCTION IF EXISTS update_beritas_updated_at();

-- The trigger was trying to update 'updated_at' but the column is actually 'diperbarui_pada'
-- Prisma handles this automatically with @updatedAt, so we don't need the trigger

-- ========================================
-- NOW FIX ENUM TYPES
-- ========================================

-- Step 1: Check current enum types
SELECT 
    'Current Enum Types' as info,
    t.typname as enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
  AND (t.typname ILIKE '%category%' OR t.typname ILIKE '%status%')
GROUP BY t.typname
ORDER BY t.typname;

-- Step 2: Check beritas column types
SELECT 
    'Beritas Column Types' as info,
    column_name,
    udt_name as current_type,
    data_type
FROM information_schema.columns
WHERE table_name = 'beritas'
  AND column_name IN ('kategori', 'status');

-- ========================================
-- FIX STARTS HERE
-- ========================================

-- Step 3: Create temporary columns to store data
ALTER TABLE beritas ADD COLUMN IF NOT EXISTS kategori_temp TEXT;
ALTER TABLE beritas ADD COLUMN IF NOT EXISTS status_temp TEXT;

-- Step 4: Copy data to temporary columns
UPDATE beritas 
SET 
  kategori_temp = kategori::TEXT,
  status_temp = status::TEXT;

-- Step 5: Drop the problematic columns
ALTER TABLE beritas DROP COLUMN IF EXISTS kategori CASCADE;
ALTER TABLE beritas DROP COLUMN IF EXISTS status CASCADE;

-- Step 6: Drop old enum types (if they exist with any name)
DROP TYPE IF EXISTS "NewsCategory" CASCADE;
DROP TYPE IF EXISTS "newscategory" CASCADE;
DROP TYPE IF EXISTS "NewsStatus" CASCADE;
DROP TYPE IF EXISTS "newsstatus" CASCADE;

-- Step 7: Create enum types with correct names (case-sensitive)
CREATE TYPE "NewsCategory" AS ENUM (
  'PENGUMUMAN', 
  'KEGIATAN', 
  'PENDAFTARAN', 
  'KEUANGAN', 
  'KERJASAMA', 
  'BEASISWA'
);

CREATE TYPE "NewsStatus" AS ENUM (
  'DRAFT', 
  'PUBLISHED', 
  'ARCHIVED'
);

-- Step 8: Add columns back with correct types
ALTER TABLE beritas 
ADD COLUMN kategori "NewsCategory";

ALTER TABLE beritas 
ADD COLUMN status "NewsStatus" DEFAULT 'DRAFT';

-- Step 9: Restore data from temporary columns
UPDATE beritas 
SET 
  kategori = kategori_temp::"NewsCategory",
  status = COALESCE(status_temp::"NewsStatus", 'DRAFT');

-- Step 10: Drop temporary columns
ALTER TABLE beritas DROP COLUMN IF EXISTS kategori_temp;
ALTER TABLE beritas DROP COLUMN IF EXISTS status_temp;

-- Step 11: Recreate indexes
CREATE INDEX IF NOT EXISTS beritas_kategori_idx ON beritas(kategori);
CREATE INDEX IF NOT EXISTS beritas_status_idx ON beritas(status);

-- ========================================
-- VERIFICATION
-- ========================================

-- Check enum types again
SELECT 
    '✅ New Enum Types' as info,
    t.typname as enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
  AND t.typname IN ('NewsCategory', 'NewsStatus')
GROUP BY t.typname
ORDER BY t.typname;

-- Check beritas columns
SELECT 
    '✅ Beritas Columns Fixed' as info,
    column_name,
    udt_name as type_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'beritas'
  AND column_name IN ('kategori', 'status');

-- Check data
SELECT 
    '✅ Sample Data' as info,
    id_beritas,
    judul,
    kategori,
    status
FROM beritas
ORDER BY id_beritas
LIMIT 5;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
DO $$ 
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ENUM TYPES FIXED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Enum types created:';
  RAISE NOTICE '  - NewsCategory: PENGUMUMAN, KEGIATAN, PENDAFTARAN, KEUANGAN, KERJASAMA, BEASISWA';
  RAISE NOTICE '  - NewsStatus: DRAFT, PUBLISHED, ARCHIVED';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Run: npx prisma generate';
  RAISE NOTICE '  2. Restart your Next.js dev server';
  RAISE NOTICE '  3. Test the update again';
  RAISE NOTICE '========================================';
END $$;

