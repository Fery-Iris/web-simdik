-- ========================================
-- UPDATE BERITAS TABLE FOR NEWS SYSTEM
-- ========================================
-- 
-- Purpose: Add/update columns in existing beritas table
-- Run this in Supabase SQL Editor
-- ========================================

-- Step 1: Check current structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'beritas' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- NOTES: 
-- Existing columns: id_beritas, created_at, id_penggunas
-- We will add: judul, slug, ringkasan, konten, kategori, status, etc.

-- Step 2: Drop and recreate ENUM types to ensure correct values
DROP TYPE IF EXISTS "NewsCategory" CASCADE;
CREATE TYPE "NewsCategory" AS ENUM ('PENGUMUMAN', 'KEGIATAN', 'PENDAFTARAN', 'KEUANGAN', 'KERJASAMA', 'BEASISWA');

DROP TYPE IF EXISTS "NewsStatus" CASCADE;
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- Step 3: Add missing columns if not exists
ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "judul" VARCHAR(200);

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "slug" VARCHAR(255);

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "ringkasan" TEXT;

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "konten" TEXT;

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "kategori" "NewsCategory";

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "status" "NewsStatus" DEFAULT 'DRAFT';

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "tanggal_terbit" DATE;

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "gambar_utama" VARCHAR(255);

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "views" INTEGER DEFAULT 0;

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "unggulan" BOOLEAN DEFAULT FALSE;

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "tags" VARCHAR(255);

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "sekolah_id" BIGINT;

ALTER TABLE "public"."beritas" 
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ DEFAULT NOW();

-- Step 4: Set default values for existing rows
UPDATE "public"."beritas"
SET 
  "judul" = 'Berita ' || "id_beritas"::text,
  "slug" = "id_beritas"::text,
  "konten" = 'Konten berita',
  "kategori" = 'PENGUMUMAN',
  "status" = 'PUBLISHED',
  "views" = 0,
  "unggulan" = FALSE
WHERE "judul" IS NULL OR "slug" IS NULL OR "konten" IS NULL;

-- Step 5: Create indexes for better performance (if not exists)
CREATE INDEX IF NOT EXISTS "beritas_slug_idx" ON "public"."beritas"("slug");
CREATE INDEX IF NOT EXISTS "beritas_kategori_idx" ON "public"."beritas"("kategori");
CREATE INDEX IF NOT EXISTS "beritas_status_idx" ON "public"."beritas"("status");
CREATE INDEX IF NOT EXISTS "beritas_created_at_idx" ON "public"."beritas"("created_at" DESC);

-- Step 6: Update trigger for updated_at (if not exists)
CREATE OR REPLACE FUNCTION update_beritas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS beritas_updated_at_trigger ON "public"."beritas";
CREATE TRIGGER beritas_updated_at_trigger
  BEFORE UPDATE ON "public"."beritas"
  FOR EACH ROW
  EXECUTE FUNCTION update_beritas_updated_at();

-- Step 7: Generate slug for existing rows without slug  
UPDATE "public"."beritas"
SET "slug" = "id_beritas"::text
WHERE "slug" IS NULL;

-- Step 8: Add unique constraint on slug after populating it
DO $$ 
BEGIN
  ALTER TABLE "public"."beritas" 
  ADD CONSTRAINT "beritas_slug_key" UNIQUE ("slug");
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Step 9: Verify the updated structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'beritas' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 10: Check data
SELECT 
  "id_beritas",
  "judul",
  "slug",
  "kategori",
  "status",
  "views",
  "id_penggunas",
  "created_at"
FROM "public"."beritas"
ORDER BY "created_at" DESC
LIMIT 5;

-- ✅ DONE! Beritas table updated successfully

