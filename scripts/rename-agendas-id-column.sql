-- ========================================
-- RENAME AGENDAS ID COLUMN TO id_agendas
-- ========================================
-- 
-- Purpose: Rename 'id' column to 'id_agendas' in agendas table
-- This is for consistency with other tables (reservations, layanans, penggunas)
-- 
-- IMPORTANT: The code will still use 'id' (via Prisma @map("id_agendas"))
-- This only changes the database column name, not the code!
--
-- Run this in Supabase SQL Editor
-- ========================================

-- Step 1: Check current structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'agendas' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Rename column 'id' to 'id_agendas'
ALTER TABLE "public"."agendas" 
RENAME COLUMN "id" TO "id_agendas";

-- Step 3: Verify the change
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'agendas' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 4: Verify data is still intact
SELECT 
    id_agendas,
    title,
    slug,
    status,
    created_at
FROM "public"."agendas"
ORDER BY created_at DESC
LIMIT 5;

-- ✅ DONE! Column renamed successfully
-- The column is now 'id_agendas' in database
-- But your code will still use 'id' (Prisma handles the mapping)

