-- ========================================
-- FIX ENUM TYPES IN DATABASE
-- ========================================
-- This script checks and fixes the enum type names in PostgreSQL

-- Step 1: Check current enum types
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value,
    e.enumsortorder
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
  AND (t.typname ILIKE '%news%' OR t.typname ILIKE '%category%' OR t.typname ILIKE '%status%')
ORDER BY t.typname, e.enumsortorder;

-- Step 2: Check what type beritas.kategori and beritas.status are using
SELECT 
    column_name,
    udt_name as enum_type_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'beritas'
  AND column_name IN ('kategori', 'status');

-- Step 3: If the enum names are wrong, we need to fix them
-- First, let's see what we have
DO $$
DECLARE
    kategori_type TEXT;
    status_type TEXT;
BEGIN
    -- Get current type names
    SELECT udt_name INTO kategori_type
    FROM information_schema.columns
    WHERE table_name = 'beritas' AND column_name = 'kategori';
    
    SELECT udt_name INTO status_type
    FROM information_schema.columns
    WHERE table_name = 'beritas' AND column_name = 'status';
    
    RAISE NOTICE 'kategori column uses type: %', kategori_type;
    RAISE NOTICE 'status column uses type: %', status_type;
    
    -- If types don't match, we need to recreate them
    -- This will be done in the next steps
END $$;

-- ========================================
-- IMPORTANT: If the enum types have wrong names, run this:
-- ========================================

-- Step 4: Backup data first
CREATE TEMP TABLE beritas_backup AS
SELECT * FROM beritas;

-- Step 5: Drop the columns (this will also drop the constraints)
-- ALTER TABLE beritas DROP COLUMN IF EXISTS kategori CASCADE;
-- ALTER TABLE beritas DROP COLUMN IF EXISTS status CASCADE;

-- Step 6: Drop old enum types if they exist with wrong names
-- DROP TYPE IF EXISTS "NewsCategory" CASCADE;
-- DROP TYPE IF EXISTS "NewsStatus" CASCADE;

-- Step 7: Create new enum types with correct names
-- CREATE TYPE "NewsCategory" AS ENUM ('PENGUMUMAN', 'KEGIATAN', 'PENDAFTARAN', 'KEUANGAN', 'KERJASAMA', 'BEASISWA');
-- CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- Step 8: Add columns back
-- ALTER TABLE beritas ADD COLUMN kategori "NewsCategory";
-- ALTER TABLE beritas ADD COLUMN status "NewsStatus" DEFAULT 'DRAFT';

-- Step 9: Restore data
-- UPDATE beritas b
-- SET 
--     kategori = bb.kategori::TEXT::"NewsCategory",
--     status = bb.status::TEXT::"NewsStatus"
-- FROM beritas_backup bb
-- WHERE b.id_beritas = bb.id_beritas;

-- Step 10: Clean up
-- DROP TABLE IF EXISTS beritas_backup;

RAISE NOTICE '========================================';
RAISE NOTICE 'Check the output above to see current enum types';
RAISE NOTICE 'If they are incorrect, uncomment and run steps 4-10';
RAISE NOTICE '========================================';

