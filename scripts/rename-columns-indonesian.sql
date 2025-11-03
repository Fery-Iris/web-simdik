-- Script untuk rename semua column ke Bahasa Indonesia
-- Run this in Supabase SQL Editor
-- PENTING: Backup database dulu sebelum jalankan script ini!

-- ========================================
-- AGENDAS TABLE
-- ========================================
DO $$ 
BEGIN
    -- Rename columns if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'title') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "title" TO "judul";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'description') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "description" TO "deskripsi";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'date') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "date" TO "tanggal";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'time') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "time" TO "waktu";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'location') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "location" TO "lokasi";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'address') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "address" TO "alamat";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'organizer') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "organizer" TO "penyelenggara";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'capacity') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "capacity" TO "kapasitas";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'category') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "category" TO "kategori";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'registrationFee') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "registrationFee" TO "biaya_pendaftaran";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'contactPerson') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "contactPerson" TO "kontak_person";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'imageUrl') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "imageUrl" TO "gambar_url";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'created_at') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "created_at" TO "dibuat_pada";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agendas' AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."agendas" RENAME COLUMN "updated_at" TO "diperbarui_pada";
    END IF;
END $$;

-- ========================================
-- LAYANANS TABLE
-- ========================================
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'layanans' AND column_name = 'name') THEN
        ALTER TABLE "public"."layanans" RENAME COLUMN "name" TO "nama";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'layanans' AND column_name = 'description') THEN
        ALTER TABLE "public"."layanans" RENAME COLUMN "description" TO "deskripsi";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'layanans' AND column_name = 'icon') THEN
        ALTER TABLE "public"."layanans" RENAME COLUMN "icon" TO "ikon";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'layanans' AND column_name = 'color') THEN
        ALTER TABLE "public"."layanans" RENAME COLUMN "color" TO "warna";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'layanans' AND column_name = 'isActive') THEN
        ALTER TABLE "public"."layanans" RENAME COLUMN "isActive" TO "aktif";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'layanans' AND column_name = 'created_at') THEN
        ALTER TABLE "public"."layanans" RENAME COLUMN "created_at" TO "dibuat_pada";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'layanans' AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."layanans" RENAME COLUMN "updated_at" TO "diperbarui_pada";
    END IF;
END $$;

-- ========================================
-- RESERVATIONS TABLE
-- ========================================
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'queueNumber') THEN
        ALTER TABLE "public"."reservations" RENAME COLUMN "queueNumber" TO "nomor_antrian";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'service') THEN
        ALTER TABLE "public"."reservations" RENAME COLUMN "service" TO "layanan";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'name') THEN
        ALTER TABLE "public"."reservations" RENAME COLUMN "name" TO "nama";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'phone') THEN
        ALTER TABLE "public"."reservations" RENAME COLUMN "phone" TO "telepon";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'purpose') THEN
        ALTER TABLE "public"."reservations" RENAME COLUMN "purpose" TO "keperluan";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'date') THEN
        ALTER TABLE "public"."reservations" RENAME COLUMN "date" TO "tanggal";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'timeSlot') THEN
        ALTER TABLE "public"."reservations" RENAME COLUMN "timeSlot" TO "waktu_kedatangan";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'estimatedCallTime') THEN
        ALTER TABLE "public"."reservations" RENAME COLUMN "estimatedCallTime" TO "estimasi_waktu_panggilan";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'created_at') THEN
        ALTER TABLE "public"."reservations" RENAME COLUMN "created_at" TO "dibuat_pada";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."reservations" RENAME COLUMN "updated_at" TO "diperbarui_pada";
    END IF;
END $$;

-- ========================================
-- BERITAS TABLE
-- ========================================
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beritas' AND column_name = 'views') THEN
        ALTER TABLE "public"."beritas" RENAME COLUMN "views" TO "dilihat";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beritas' AND column_name = 'created_at') THEN
        ALTER TABLE "public"."beritas" RENAME COLUMN "created_at" TO "dibuat_pada";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beritas' AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."beritas" RENAME COLUMN "updated_at" TO "diperbarui_pada";
    END IF;
END $$;

-- ========================================
-- VERIFICATION
-- ========================================
-- Check hasil rename
SELECT 
    'agendas' as table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'agendas'
ORDER BY ordinal_position;

SELECT 
    'layanans' as table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'layanans'
ORDER BY ordinal_position;

SELECT 
    'reservations' as table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'reservations'
ORDER BY ordinal_position;

SELECT 
    'beritas' as table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'beritas'
ORDER BY ordinal_position;

