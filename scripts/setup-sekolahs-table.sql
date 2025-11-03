-- SQL Script untuk Setup/Update Table sekolahs di Supabase
-- Run this in Supabase SQL Editor

-- ========================================
-- DROP EXISTING CONSTRAINTS (if any)
-- ========================================
DO $$ 
BEGIN
    -- Drop foreign key constraints if exist
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'sekolahs_id_beritas_fkey') THEN
        ALTER TABLE "public"."sekolahs" DROP CONSTRAINT "sekolahs_id_beritas_fkey";
    END IF;
END $$;

-- ========================================
-- UPDATE/ADD COLUMNS
-- ========================================
DO $$ 
BEGIN
    -- Add id_sekolahs column if not exists (Primary Key)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'id_sekolahs') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "id_sekolahs" BIGSERIAL PRIMARY KEY;
    END IF;

    -- Add nama column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'nama') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "nama" VARCHAR(255) NOT NULL DEFAULT 'Nama Sekolah';
    END IF;

    -- Add alamat column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'alamat') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "alamat" TEXT;
    END IF;

    -- Add kecamatan column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'kecamatan') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "kecamatan" VARCHAR(100);
    END IF;

    -- Add jenjang column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'jenjang') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "jenjang" VARCHAR(50);
    END IF;

    -- Add akreditasi column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'akreditasi') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "akreditasi" VARCHAR(10);
    END IF;

    -- Add status column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'status') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "status" VARCHAR(50);
    END IF;

    -- Add telepon column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'telepon') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "telepon" VARCHAR(20);
    END IF;

    -- Add email column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'email') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "email" VARCHAR(150);
    END IF;

    -- Add tahun_berdiri column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'tahun_berdiri') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "tahun_berdiri" VARCHAR(10);
    END IF;

    -- Add deskripsi column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'deskripsi') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "deskripsi" TEXT;
    END IF;

    -- Add gambar_utama column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'gambar_utama') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "gambar_utama" VARCHAR(255);
    END IF;

    -- Add foto_1 column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'foto_1') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "foto_1" VARCHAR(255);
    END IF;

    -- Add foto_2 column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'foto_2') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "foto_2" VARCHAR(255);
    END IF;

    -- Add created_at column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'created_at') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "created_at" TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- Add updated_at column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."sekolahs" ADD COLUMN "updated_at" TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- ========================================
-- DROP UNUSED COLUMNS
-- ========================================
DO $$ 
BEGIN
    -- Drop fasilitas column if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'fasilitas') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "fasilitas";
    END IF;

    -- Drop prestasi column if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'prestasi') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "prestasi";
    END IF;

    -- Drop achievements column if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'achievements') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "achievements";
    END IF;

    -- Drop facilities column if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'facilities') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "facilities";
    END IF;

    -- Drop jumlah_siswa column if exists (statistik)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'jumlah_siswa') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "jumlah_siswa";
    END IF;

    -- Drop jumlah_guru column if exists (statistik)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'jumlah_guru') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "jumlah_guru";
    END IF;

    -- Drop students column if exists (statistik)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'students') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "students";
    END IF;

    -- Drop teachers column if exists (statistik)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'teachers') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "teachers";
    END IF;

    -- Drop kepala_sekolah column if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'kepala_sekolah') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "kepala_sekolah";
    END IF;

    -- Drop principal column if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'principal') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "principal";
    END IF;

    -- Drop latitude column if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'latitude') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "latitude";
    END IF;

    -- Drop longitude column if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'longitude') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "longitude";
    END IF;

    -- Drop foto_galeri column if exists (JSON, akan diganti dengan foto_1, foto_2)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'foto_galeri') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "foto_galeri";
    END IF;

    -- Drop id_beritas column if exists (foreign key)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sekolahs' AND column_name = 'id_beritas') THEN
        ALTER TABLE "public"."sekolahs" DROP COLUMN "id_beritas";
    END IF;
END $$;

-- ========================================
-- CREATE INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS "sekolahs_jenjang_idx" ON "public"."sekolahs"("jenjang");
CREATE INDEX IF NOT EXISTS "sekolahs_kecamatan_idx" ON "public"."sekolahs"("kecamatan");
CREATE INDEX IF NOT EXISTS "sekolahs_akreditasi_idx" ON "public"."sekolahs"("akreditasi");
CREATE INDEX IF NOT EXISTS "sekolahs_status_idx" ON "public"."sekolahs"("status");
CREATE INDEX IF NOT EXISTS "sekolahs_nama_idx" ON "public"."sekolahs"("nama");

-- ========================================
-- CREATE/UPDATE TRIGGER FOR updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_sekolahs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_sekolahs_updated_at ON "public"."sekolahs";
CREATE TRIGGER trigger_update_sekolahs_updated_at
    BEFORE UPDATE ON "public"."sekolahs"
    FOR EACH ROW
    EXECUTE FUNCTION update_sekolahs_updated_at();

-- ========================================
-- SEED SAMPLE DATA (Optional - hanya jika table kosong)
-- ========================================
INSERT INTO "public"."sekolahs" (
    nama, alamat, kecamatan, jenjang, akreditasi, status,
    telepon, email, tahun_berdiri, deskripsi, gambar_utama
)
SELECT 
    'SDN Sungai Miai 5',
    'Jl. Sungai Miai No. 45, Banjarmasin Utara',
    'Banjarmasin Utara',
    'SD',
    'A',
    'Negeri',
    '(0511) 3254789',
    'sdnsungaimiai5@gmail.com',
    '1985',
    'SDN Sungai Miai 5 adalah sekolah dasar negeri yang berlokasi di Banjarmasin Utara. Sekolah ini telah berdiri sejak tahun 1985 dan telah meluluskan ribuan siswa yang berkualitas. Dengan akreditasi A, sekolah ini berkomitmen untuk memberikan pendidikan terbaik bagi anak-anak di wilayah Sungai Miai dan sekitarnya.',
    '/placeholder.svg'
WHERE NOT EXISTS (SELECT 1 FROM "public"."sekolahs" WHERE nama = 'SDN Sungai Miai 5');

INSERT INTO "public"."sekolahs" (
    nama, alamat, kecamatan, jenjang, akreditasi, status,
    telepon, email, tahun_berdiri, deskripsi, gambar_utama
)
SELECT 
    'SMPN 1 Banjarmasin',
    'Jl. Lambung Mangkurat No. 1, Banjarmasin Tengah',
    'Banjarmasin Tengah',
    'SMP',
    'A',
    'Negeri',
    '(0511) 3251234',
    'smpn1bjm@gmail.com',
    '1962',
    'SMPN 1 Banjarmasin adalah sekolah menengah pertama negeri tertua dan terbaik di Kota Banjarmasin. Berdiri sejak tahun 1962, sekolah ini telah menjadi rujukan pendidikan menengah pertama di Kalimantan Selatan.',
    '/placeholder.svg'
WHERE NOT EXISTS (SELECT 1 FROM "public"."sekolahs" WHERE nama = 'SMPN 1 Banjarmasin');

INSERT INTO "public"."sekolahs" (
    nama, alamat, kecamatan, jenjang, akreditasi, status,
    telepon, email, tahun_berdiri, deskripsi, gambar_utama
)
SELECT 
    'SD Islam Al-Azhar',
    'Jl. A. Yani Km. 4.5, Banjarmasin Selatan',
    'Banjarmasin Selatan',
    'SD',
    'A',
    'Swasta',
    '(0511) 3256789',
    'sdislamalazhar@gmail.com',
    '1998',
    'SD Islam Al-Azhar adalah sekolah dasar swasta dengan standar pendidikan Islam modern. Sekolah ini menggabungkan kurikulum nasional dengan pendidikan agama Islam yang kuat.',
    '/placeholder.svg'
WHERE NOT EXISTS (SELECT 1 FROM "public"."sekolahs" WHERE nama = 'SD Islam Al-Azhar');

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Check columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'sekolahs'
ORDER BY ordinal_position;

-- Check data count
SELECT COUNT(*) as total_sekolah FROM "public"."sekolahs";

-- Check sample data
SELECT 
    id_sekolahs,
    nama,
    jenjang,
    akreditasi,
    kecamatan,
    status
FROM "public"."sekolahs"
ORDER BY id_sekolahs
LIMIT 5;

