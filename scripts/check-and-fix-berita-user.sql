-- Script untuk cek dan fix user untuk berita
-- Run this in Supabase SQL Editor

-- Step 1: Check if there are any users in penggunas table
SELECT COUNT(*) as total_users FROM "public"."penggunas";

-- Step 2: If no users exist, the berita foreign key constraint might need to be removed temporarily
-- OR we can make idPenggunas nullable for now

-- Option A: Make id_penggunas nullable (RECOMMENDED for now)
ALTER TABLE "public"."beritas" 
ALTER COLUMN "id_penggunas" DROP NOT NULL;

-- Step 3: Verify the change
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'beritas' 
AND column_name = 'id_penggunas';

-- Step 4: Check existing beritas
SELECT 
    id_beritas,
    judul,
    id_penggunas,
    created_at
FROM "public"."beritas"
ORDER BY id_beritas DESC
LIMIT 5;

-- NOTE: After making id_penggunas nullable, you can create berita without user
-- Later when you have users in penggunas table, you can make it NOT NULL again


