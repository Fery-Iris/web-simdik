-- Physical Data Model (PDM) - PostgreSQL DDL for SIMDIK (Revised)
-- Schema: public
-- Disesuaikan dengan implementasi aktual (tanpa laporan pengaduan)

BEGIN;

-- Extensions (optional, comment out if not allowed)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM types
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
    CREATE TYPE role_type AS ENUM ('ADMIN','USER');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'school_status') THEN
    CREATE TYPE school_status AS ENUM ('AKTIF','NONAKTIF');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'school_level') THEN
    CREATE TYPE school_level AS ENUM ('PAUD','SD','SMP','SMA');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'accreditation_type') THEN
    CREATE TYPE accreditation_type AS ENUM ('A','B','C','BELUM');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'news_category') THEN
    CREATE TYPE news_category AS ENUM ('PENGUMUMAN','KEGIATAN','PENDAFTARAN','KEUANGAN','KERJASAMA','BEASISWA');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'news_status') THEN
    CREATE TYPE news_status AS ENUM ('DRAFT','PUBLISHED','ARCHIVED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agenda_status') THEN
    CREATE TYPE agenda_status AS ENUM ('TERJADWAL','BERLANGSUNG','SELESAI','DITUNDA','DIBATALKAN');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agenda_category') THEN
    CREATE TYPE agenda_category AS ENUM ('RAPAT','PELATIHAN','MONITORING','SOSIALISASI','EVALUASI');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reservation_status') THEN
    CREATE TYPE reservation_status AS ENUM ('MENUNGGU','DIPANGGIL','SELESAI','DIBATALKAN','HANGUS');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'day_type') THEN
    CREATE TYPE day_type AS ENUM ('SENIN','SELASA','RABU','KAMIS','JUMAT');
  END IF;
END $$;

-- TABLE: pengguna
-- Purpose: User management untuk admin sistem
-- Relations: Parent untuk berita dan agenda (1:M), optional parent untuk reservasi (0|1:M)
CREATE TABLE IF NOT EXISTS pengguna (
  pengguna_id         BIGSERIAL PRIMARY KEY,
  nama                VARCHAR(100) NOT NULL,
  email               VARCHAR(150) NOT NULL UNIQUE, -- Unique constraint untuk login
  password_hash       VARCHAR(255) NOT NULL,
  peran               role_type NOT NULL DEFAULT 'ADMIN',
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: sekolah  
-- Purpose: Master data profil sekolah lengkap dengan fitur pencarian
-- Relations: Optional parent untuk berita dan agenda (0|1:M)
CREATE TABLE IF NOT EXISTS sekolah (
  sekolah_id          BIGSERIAL PRIMARY KEY,
  nama                VARCHAR(150) NOT NULL,
  npsn                VARCHAR(20) NOT NULL UNIQUE, -- NPSN unik secara nasional
  alamat              VARCHAR(255) NOT NULL,
  kepala_sekolah      VARCHAR(100) NOT NULL,
  telepon             VARCHAR(25),
  email               VARCHAR(150),
  jenjang             school_level NOT NULL, -- Filter berdasarkan jenjang pendidikan
  kecamatan           VARCHAR(50) NOT NULL,  -- Filter berdasarkan geografis
  status              school_status NOT NULL DEFAULT 'AKTIF',
  akreditasi          accreditation_type NOT NULL DEFAULT 'BELUM',
  jumlah_siswa        INTEGER NOT NULL DEFAULT 0,
  jumlah_guru         INTEGER NOT NULL DEFAULT 0,
  tahun_berdiri       INTEGER,
  deskripsi           TEXT,
  fasilitas           TEXT, -- JSON atau text terstruktur
  prestasi            TEXT, -- Daftar prestasi sekolah
  foto_utama          VARCHAR(255), -- URL foto untuk tampilan
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: layanan
-- Purpose: Master data jenis layanan yang tersedia untuk reservasi
-- Relations: Parent untuk reservasi dan slot_waktu (1:M)
CREATE TABLE IF NOT EXISTS layanan (
  layanan_id          BIGSERIAL PRIMARY KEY,
  kode                VARCHAR(20) NOT NULL UNIQUE, -- PTK, SD, SMP, PAUD untuk generate nomor antrian
  nama                VARCHAR(100) NOT NULL,
  deskripsi           TEXT,
  warna               VARCHAR(30),   -- Hex color untuk UI theming
  estimasi_waktu      INTEGER DEFAULT 30, -- Estimasi waktu layanan dalam menit
  persyaratan         TEXT,          -- Dokumen yang diperlukan
  aktif               BOOLEAN NOT NULL DEFAULT TRUE,
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: slot_waktu
-- Purpose: Mengatur jadwal operasional dan kapasitas per layanan
-- Relations: Child dari layanan (M:1)
CREATE TABLE IF NOT EXISTS slot_waktu (
  slot_id             BIGSERIAL PRIMARY KEY,
  layanan_id          BIGINT NOT NULL REFERENCES layanan(layanan_id) ON UPDATE CASCADE ON DELETE CASCADE,
  hari                day_type NOT NULL,
  waktu_mulai         TIME NOT NULL,
  waktu_selesai       TIME NOT NULL,
  kapasitas           INTEGER NOT NULL DEFAULT 10, -- Maksimal reservasi per slot
  aktif               BOOLEAN NOT NULL DEFAULT TRUE,
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: berita
-- Purpose: Content management untuk publikasi berita/pengumuman
-- Relations: Child dari pengguna (M:1 mandatory), optional child dari sekolah (M:0|1)
CREATE TABLE IF NOT EXISTS berita (
  berita_id           BIGSERIAL PRIMARY KEY,
  judul               VARCHAR(200) NOT NULL,
  slug                VARCHAR(255) NOT NULL UNIQUE, -- SEO-friendly URL
  ringkasan           TEXT,          -- Excerpt untuk listing page
  konten              TEXT NOT NULL,
  kategori            news_category NOT NULL,
  status              news_status NOT NULL DEFAULT 'DRAFT', -- Workflow: DRAFT → PUBLISHED → ARCHIVED
  tanggal_terbit      DATE,
  unggulan            BOOLEAN NOT NULL DEFAULT FALSE, -- Featured article flag
  gambar_utama        VARCHAR(255),  -- URL gambar untuk thumbnail
  views               INTEGER NOT NULL DEFAULT 0, -- Counter untuk analytics
  tags                VARCHAR(255),  -- Comma-separated untuk kategorisasi
  dibuat_oleh         BIGINT NOT NULL REFERENCES pengguna(pengguna_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  sekolah_id          BIGINT REFERENCES sekolah(sekolah_id) ON UPDATE CASCADE ON DELETE SET NULL, -- Optional: berita khusus sekolah
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: agenda
-- Purpose: Event management untuk kegiatan dinas pendidikan
-- Relations: Child dari pengguna (M:1 mandatory), optional child dari sekolah (M:0|1)
CREATE TABLE IF NOT EXISTS agenda (
  agenda_id           BIGSERIAL PRIMARY KEY,
  judul               VARCHAR(200) NOT NULL,
  slug                VARCHAR(255) NOT NULL UNIQUE, -- SEO-friendly URL
  deskripsi           TEXT NOT NULL,
  tanggal             DATE NOT NULL,
  waktu               TIME NOT NULL,
  lokasi              VARCHAR(150) NOT NULL,
  alamat_lokasi       VARCHAR(255), -- Alamat lengkap untuk maps
  status              agenda_status NOT NULL DEFAULT 'TERJADWAL', -- Workflow status
  kategori            agenda_category NOT NULL,
  peserta             VARCHAR(150) NOT NULL, -- Target audience
  kapasitas           INTEGER,       -- Maksimal peserta jika ada batasan
  biaya               VARCHAR(50),   -- "Gratis" atau "Rp 50.000"
  kontak_person       VARCHAR(100),  -- PIC untuk informasi lebih lanjut
  telepon_kontak      VARCHAR(25),
  sekolah_id          BIGINT REFERENCES sekolah(sekolah_id) ON UPDATE CASCADE ON DELETE SET NULL, -- Optional: agenda di sekolah tertentu
  dibuat_oleh         BIGINT NOT NULL REFERENCES pengguna(pengguna_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: reservasi
-- Purpose: Sistem antrian online dengan tracking lengkap
-- Relations: Child dari layanan (M:1 mandatory), optional child dari pengguna (M:0|1)
CREATE TABLE IF NOT EXISTS reservasi (
  reservasi_id        BIGSERIAL PRIMARY KEY,
  nomor_antrian       VARCHAR(20) NOT NULL UNIQUE, -- Generated: {KODE_LAYANAN}-{TIMESTAMP}
  layanan_id          BIGINT NOT NULL REFERENCES layanan(layanan_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  tanggal             DATE NOT NULL,
  slot_waktu          VARCHAR(11) NOT NULL, -- "08:00 - 09:00"
  nama_pemesan        VARCHAR(100) NOT NULL,
  telepon             VARCHAR(25) NOT NULL,
  nik                 VARCHAR(20), -- Optional untuk identifikasi
  tujuan              VARCHAR(255) NOT NULL, -- Keperluan kunjungan
  status              reservation_status NOT NULL DEFAULT 'MENUNGGU', -- Queue workflow
  estimasi_panggilan  TIME,        -- Estimasi waktu dipanggil
  waktu_checkin       TIMESTAMPTZ, -- Waktu kedatangan actual
  waktu_selesai       TIMESTAMPTZ, -- Waktu selesai layanan
  catatan_admin       TEXT,        -- Internal notes untuk admin
  pengguna_id         BIGINT REFERENCES pengguna(pengguna_id) ON UPDATE CASCADE ON DELETE SET NULL, -- Optional: NULL=guest, NOT NULL=registered user
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Composite unique constraint untuk mencegah double booking
  CONSTRAINT uq_reservasi_slot UNIQUE (layanan_id, tanggal, slot_waktu)
);

-- INDEXES for performance optimization
CREATE INDEX IF NOT EXISTS idx_sekolah_jenjang ON sekolah(jenjang);
CREATE INDEX IF NOT EXISTS idx_sekolah_kecamatan ON sekolah(kecamatan);
CREATE INDEX IF NOT EXISTS idx_sekolah_status ON sekolah(status);
CREATE INDEX IF NOT EXISTS idx_sekolah_akreditasi ON sekolah(akreditasi);

CREATE INDEX IF NOT EXISTS idx_berita_status ON berita(status);
CREATE INDEX IF NOT EXISTS idx_berita_kategori ON berita(kategori);
CREATE INDEX IF NOT EXISTS idx_berita_unggulan ON berita(unggulan);
CREATE INDEX IF NOT EXISTS idx_berita_tanggal_terbit ON berita(tanggal_terbit);
CREATE INDEX IF NOT EXISTS idx_berita_slug ON berita(slug);
CREATE INDEX IF NOT EXISTS idx_berita_sekolah ON berita(sekolah_id);

CREATE INDEX IF NOT EXISTS idx_agenda_tanggal ON agenda(tanggal);
CREATE INDEX IF NOT EXISTS idx_agenda_status ON agenda(status);
CREATE INDEX IF NOT EXISTS idx_agenda_kategori ON agenda(kategori);
CREATE INDEX IF NOT EXISTS idx_agenda_slug ON agenda(slug);
CREATE INDEX IF NOT EXISTS idx_agenda_sekolah ON agenda(sekolah_id);

CREATE INDEX IF NOT EXISTS idx_reservasi_status ON reservasi(status);
CREATE INDEX IF NOT EXISTS idx_reservasi_layanan ON reservasi(layanan_id);
CREATE INDEX IF NOT EXISTS idx_reservasi_tanggal ON reservasi(tanggal);
CREATE INDEX IF NOT EXISTS idx_reservasi_nomor_antrian ON reservasi(nomor_antrian);

CREATE INDEX IF NOT EXISTS idx_slot_waktu_layanan ON slot_waktu(layanan_id);
CREATE INDEX IF NOT EXISTS idx_slot_waktu_hari ON slot_waktu(hari);

-- INSERT sample data for layanan
INSERT INTO layanan (kode, nama, deskripsi, warna, estimasi_waktu, persyaratan) VALUES
('PTK', 'PTK (Pendidik dan Tenaga Kependidikan)', 'Layanan untuk urusan sertifikat pendidik, mutasi guru, dan administrasi PTK', '#3B82F6', 45, 'KTP, Surat pengantar sekolah, Dokumen pendukung'),
('SD', 'SD Umum', 'Layanan untuk urusan sekolah dasar, zonasi, dan pendaftaran', '#10B981', 30, 'KTP, Kartu Keluarga, Akta kelahiran'),
('SMP', 'SMP Umum', 'Layanan untuk urusan sekolah menengah pertama dan mutasi siswa', '#8B5CF6', 35, 'KTP, Kartu Keluarga, Ijazah SD'),
('PAUD', 'PAUD', 'Layanan untuk urusan pendidikan anak usia dini', '#F59E0B', 25, 'KTP, Kartu Keluarga, Akta kelahiran')
ON CONFLICT (kode) DO NOTHING;

-- INSERT sample slot waktu (operational hours)
INSERT INTO slot_waktu (layanan_id, hari, waktu_mulai, waktu_selesai, kapasitas) 
SELECT l.layanan_id, d.hari, t.waktu_mulai, t.waktu_selesai, 10
FROM layanan l
CROSS JOIN (VALUES 
  ('SENIN'::day_type), ('SELASA'::day_type), ('RABU'::day_type), 
  ('KAMIS'::day_type), ('JUMAT'::day_type)
) d(hari)
CROSS JOIN (VALUES 
  ('08:00'::time, '09:00'::time),
  ('09:00'::time, '10:00'::time),
  ('10:00'::time, '11:00'::time),
  ('11:00'::time, '12:00'::time),
  ('13:00'::time, '14:00'::time),
  ('14:00'::time, '15:00'::time),
  ('15:00'::time, '16:00'::time)
) t(waktu_mulai, waktu_selesai)
ON CONFLICT DO NOTHING;

COMMIT;

-- =============================================================================
-- RELATIONSHIP DOCUMENTATION
-- =============================================================================

/*
RELASI ANTAR TABEL (Entity Relationship Details):

1. PENGGUNA sebagai Central Authority
   ├── pengguna → berita (1:M, MANDATORY)
   │   └── FK: berita.dibuat_oleh → pengguna.pengguna_id
   │   └── Constraint: ON DELETE RESTRICT (admin tidak boleh dihapus jika ada berita)
   │   └── Purpose: Tracking authorship dan accountability
   │
   ├── pengguna → agenda (1:M, MANDATORY)  
   │   └── FK: agenda.dibuat_oleh → pengguna.pengguna_id
   │   └── Constraint: ON DELETE RESTRICT (admin tidak boleh dihapus jika ada agenda)
   │   └── Purpose: PIC management dan workflow approval
   │
   └── pengguna → reservasi (0|1:M, OPTIONAL)
       └── FK: reservasi.pengguna_id → pengguna.pengguna_id (nullable)
       └── Constraint: ON DELETE SET NULL (reservasi tetap valid jika user dihapus)
       └── Purpose: Guest vs Registered user reservation

2. SEKOLAH sebagai Location Context
   ├── sekolah → berita (0|1:M, OPTIONAL)
   │   └── FK: berita.sekolah_id → sekolah.sekolah_id (nullable)
   │   └── Constraint: ON DELETE SET NULL (berita umum vs berita sekolah)
   │   └── Purpose: Spotlight berita per sekolah
   │
   └── sekolah → agenda (0|1:M, OPTIONAL)
       └── FK: agenda.sekolah_id → sekolah.sekolah_id (nullable)
       └── Constraint: ON DELETE SET NULL (agenda umum vs agenda di sekolah)
       └── Purpose: Filter agenda berdasarkan lokasi

3. LAYANAN sebagai Service Management
   ├── layanan → reservasi (1:M, MANDATORY)
   │   └── FK: reservasi.layanan_id → layanan.layanan_id
   │   └── Constraint: ON DELETE RESTRICT (layanan tidak boleh dihapus jika ada reservasi)
   │   └── Unique: (layanan_id, tanggal, slot_waktu) mencegah double booking
   │   └── Purpose: Queue management per service type
   │
   └── layanan → slot_waktu (1:M, SUPPORTING)
       └── FK: slot_waktu.layanan_id → layanan.layanan_id
       └── Constraint: ON DELETE CASCADE (hapus jadwal jika layanan dihapus)
       └── Purpose: Operational hours dan capacity management

BUSINESS RULES IMPLEMENTATION:
- RESTRICT: Data parent tidak boleh dihapus jika masih ada child (referential integrity)
- SET NULL: Data child tetap ada meski parent dihapus (optional relationship)
- CASCADE: Data child ikut terhapus jika parent dihapus (dependent relationship)

INDEXING STRATEGY:
- Primary Keys: Auto-indexed untuk fast lookups
- Foreign Keys: Manual index untuk join performance  
- Search Fields: Index pada kolom yang sering di-filter
- Unique Constraints: Auto-indexed untuk data integrity
- Composite Index: Untuk query kompleks dan unique constraints

DATA FLOW EXAMPLES:
1. Publikasi Berita:
   Admin (pengguna) → Buat berita → Optional link ke sekolah → Publish

2. Manajemen Agenda:
   Admin (pengguna) → Buat agenda → Optional lokasi di sekolah → Schedule

3. Reservasi Online:
   User/Guest → Pilih layanan → Pilih slot_waktu → Generate nomor_antrian

4. Queue Management:
   Layanan → SlotWaktu (jadwal) → Reservasi (antrian) → Status tracking
*/

-- Performance and maintenance notes:
-- 1. Regular VACUUM and ANALYZE on tables with frequent updates
-- 2. Monitor index usage and add/remove as needed
-- 3. Consider partitioning for reservasi table if data grows large
-- 4. Backup strategy should include point-in-time recovery
-- 5. Connection pooling recommended for production deployment
