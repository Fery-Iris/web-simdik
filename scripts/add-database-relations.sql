-- SQL Script untuk Menambahkan Relasi Foreign Key
-- Sesuai dengan diagram database: beritas, sekolahs, agendas, penggunas

-- ============================================
-- 1. TAMBAH KOLOM FOREIGN KEY (Jika Belum Ada)
-- ============================================

-- Tambah kolom id_sekolahs di beritas (jika belum ada)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'beritas' AND column_name = 'id_sekolahs'
  ) THEN
    ALTER TABLE "public"."beritas" 
    ADD COLUMN "id_sekolahs" BIGINT;
    
    RAISE NOTICE 'Column id_sekolahs added to beritas table';
  ELSE
    RAISE NOTICE 'Column id_sekolahs already exists in beritas table';
  END IF;
END $$;

-- Tambah kolom id_penggunas di agendas (jika belum ada)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agendas' AND column_name = 'id_penggunas'
  ) THEN
    ALTER TABLE "public"."agendas" 
    ADD COLUMN "id_penggunas" BIGINT;
    
    RAISE NOTICE 'Column id_penggunas added to agendas table';
  ELSE
    RAISE NOTICE 'Column id_penggunas already exists in agendas table';
  END IF;
END $$;

-- Tambah kolom id_sekolahs di agendas (jika belum ada)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agendas' AND column_name = 'id_sekolahs'
  ) THEN
    ALTER TABLE "public"."agendas" 
    ADD COLUMN "id_sekolahs" BIGINT;
    
    RAISE NOTICE 'Column id_sekolahs added to agendas table';
  ELSE
    RAISE NOTICE 'Column id_sekolahs already exists in agendas table';
  END IF;
END $$;

-- ============================================
-- 2. HAPUS FOREIGN KEY LAMA (Jika Ada)
-- ============================================

-- Hapus FK lama beritas -> penggunas (jika ada)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'beritas_id_penggunas_fkey' 
    AND table_name = 'beritas'
  ) THEN
    ALTER TABLE "public"."beritas" 
    DROP CONSTRAINT "beritas_id_penggunas_fkey";
    
    RAISE NOTICE 'Old FK beritas_id_penggunas_fkey dropped';
  END IF;
END $$;

-- Hapus FK lama beritas -> sekolahs (jika ada)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'beritas_id_sekolahs_fkey' 
    AND table_name = 'beritas'
  ) THEN
    ALTER TABLE "public"."beritas" 
    DROP CONSTRAINT "beritas_id_sekolahs_fkey";
    
    RAISE NOTICE 'Old FK beritas_id_sekolahs_fkey dropped';
  END IF;
END $$;

-- Hapus FK lama agendas -> penggunas (jika ada)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'agendas_id_penggunas_fkey' 
    AND table_name = 'agendas'
  ) THEN
    ALTER TABLE "public"."agendas" 
    DROP CONSTRAINT "agendas_id_penggunas_fkey";
    
    RAISE NOTICE 'Old FK agendas_id_penggunas_fkey dropped';
  END IF;
END $$;

-- Hapus FK lama agendas -> sekolahs (jika ada)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'agendas_id_sekolahs_fkey' 
    AND table_name = 'agendas'
  ) THEN
    ALTER TABLE "public"."agendas" 
    DROP CONSTRAINT "agendas_id_sekolahs_fkey";
    
    RAISE NOTICE 'Old FK agendas_id_sekolahs_fkey dropped';
  END IF;
END $$;

-- ============================================
-- 3. TAMBAH FOREIGN KEY BARU
-- ============================================

-- FK: beritas -> penggunas (id_penggunas)
ALTER TABLE "public"."beritas"
ADD CONSTRAINT "beritas_id_penggunas_fkey" 
FOREIGN KEY ("id_penggunas") 
REFERENCES "public"."penggunas"("id_penggunas") 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- FK: beritas -> sekolahs (id_sekolahs)
ALTER TABLE "public"."beritas"
ADD CONSTRAINT "beritas_id_sekolahs_fkey" 
FOREIGN KEY ("id_sekolahs") 
REFERENCES "public"."sekolahs"("id_sekolahs") 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- FK: agendas -> penggunas (id_penggunas)
ALTER TABLE "public"."agendas"
ADD CONSTRAINT "agendas_id_penggunas_fkey" 
FOREIGN KEY ("id_penggunas") 
REFERENCES "public"."penggunas"("id_penggunas") 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- FK: agendas -> sekolahs (id_sekolahs)
ALTER TABLE "public"."agendas"
ADD CONSTRAINT "agendas_id_sekolahs_fkey" 
FOREIGN KEY ("id_sekolahs") 
REFERENCES "public"."sekolahs"("id_sekolahs") 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- ============================================
-- 4. BUAT INDEX untuk Performance
-- ============================================

-- Index untuk beritas.id_sekolahs
CREATE INDEX IF NOT EXISTS "beritas_id_sekolahs_idx" 
ON "public"."beritas"("id_sekolahs");

-- Index untuk agendas.id_penggunas
CREATE INDEX IF NOT EXISTS "agendas_id_penggunas_idx" 
ON "public"."agendas"("id_penggunas");

-- Index untuk agendas.id_sekolahs
CREATE INDEX IF NOT EXISTS "agendas_id_sekolahs_idx" 
ON "public"."agendas"("id_sekolahs");

-- ============================================
-- 5. VERIFIKASI RELASI
-- ============================================

-- Tampilkan semua foreign key constraints
SELECT
  tc.table_name, 
  tc.constraint_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('beritas', 'agendas', 'sekolahs', 'penggunas')
ORDER BY tc.table_name, tc.constraint_name;

-- ============================================
-- SELESAI
-- ============================================

-- Hasil yang diharapkan:
-- 1. beritas.id_penggunas -> penggunas.id_penggunas ✓
-- 2. beritas.id_sekolahs -> sekolahs.id_sekolahs ✓
-- 3. agendas.id_penggunas -> penggunas.id_penggunas ✓
-- 4. agendas.id_sekolahs -> sekolahs.id_sekolahs ✓

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE '✅ Database relations setup completed!';
  RAISE NOTICE 'Foreign keys created:';
  RAISE NOTICE '  - beritas → penggunas';
  RAISE NOTICE '  - beritas → sekolahs';
  RAISE NOTICE '  - agendas → penggunas';
  RAISE NOTICE '  - agendas → sekolahs';
END $$;

