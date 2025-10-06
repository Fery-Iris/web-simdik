-- Physical Data Model (PDM) - PostgreSQL DDL for SIMDIK
-- Schema: public
-- Safe re-create toggles

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
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'accreditation_type') THEN
    CREATE TYPE accreditation_type AS ENUM ('A','B','C','BELUM');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'news_category') THEN
    CREATE TYPE news_category AS ENUM ('PENGUMUMAN','KEGIATAN','PENDAFTARAN','KEUANGAN');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'news_status') THEN
    CREATE TYPE news_status AS ENUM ('DRAFT','PUBLISHED','ARCHIVED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agenda_status') THEN
    CREATE TYPE agenda_status AS ENUM ('TERJADWAL','BERLANGSUNG','SELESAI','DITUNDA','DIBATALKAN');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reservation_status') THEN
    CREATE TYPE reservation_status AS ENUM ('MENUNGGU','SELESAI','DIBATALKAN');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_type') THEN
    CREATE TYPE priority_type AS ENUM ('RENDAH','SEDANG','TINGGI');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
    CREATE TYPE report_status AS ENUM ('BARU','DIPROSES','SELESAI','DITOLAK');
  END IF;
END $$;

-- TABLE: pengguna
CREATE TABLE IF NOT EXISTS pengguna (
  pengguna_id         BIGSERIAL PRIMARY KEY,
  nama                VARCHAR(100) NOT NULL,
  email               VARCHAR(150) NOT NULL UNIQUE,
  password_hash       VARCHAR(255) NOT NULL,
  peran               role_type NOT NULL DEFAULT 'ADMIN',
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: sekolah
CREATE TABLE IF NOT EXISTS sekolah (
  sekolah_id          BIGSERIAL PRIMARY KEY,
  nama                VARCHAR(150) NOT NULL,
  npsn                VARCHAR(20) NOT NULL UNIQUE,
  alamat              VARCHAR(255) NOT NULL,
  kepala_sekolah      VARCHAR(100) NOT NULL,
  telepon             VARCHAR(25),
  email               VARCHAR(150),
  status              school_status NOT NULL DEFAULT 'AKTIF',
  akreditasi          accreditation_type NOT NULL DEFAULT 'BELUM',
  jumlah_siswa        INTEGER NOT NULL DEFAULT 0,
  jumlah_guru         INTEGER NOT NULL DEFAULT 0,
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: layanan
CREATE TABLE IF NOT EXISTS layanan (
  layanan_id          BIGSERIAL PRIMARY KEY,
  kode                VARCHAR(20) NOT NULL UNIQUE,
  nama                VARCHAR(100) NOT NULL,
  warna               VARCHAR(30),
  aktif               BOOLEAN NOT NULL DEFAULT TRUE,
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: berita
CREATE TABLE IF NOT EXISTS berita (
  berita_id           BIGSERIAL PRIMARY KEY,
  judul               VARCHAR(200) NOT NULL,
  konten              TEXT NOT NULL,
  kategori            news_category NOT NULL,
  status              news_status NOT NULL DEFAULT 'DRAFT',
  tanggal_terbit      DATE,
  unggulan            BOOLEAN NOT NULL DEFAULT FALSE,
  dibuat_oleh         BIGINT NOT NULL REFERENCES pengguna(pengguna_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  sekolah_id          BIGINT REFERENCES sekolah(sekolah_id) ON UPDATE CASCADE ON DELETE SET NULL,
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_berita_status ON berita(status);
CREATE INDEX IF NOT EXISTS idx_berita_kategori ON berita(kategori);
CREATE INDEX IF NOT EXISTS idx_berita_sekolah ON berita(sekolah_id);

-- TABLE: agenda
CREATE TABLE IF NOT EXISTS agenda (
  agenda_id           BIGSERIAL PRIMARY KEY,
  judul               VARCHAR(200) NOT NULL,
  deskripsi           TEXT NOT NULL,
  tanggal             DATE NOT NULL,
  waktu               TIME NOT NULL,
  lokasi              VARCHAR(150) NOT NULL,
  status              agenda_status NOT NULL DEFAULT 'TERJADWAL',
  kategori            VARCHAR(50) NOT NULL,
  peserta             VARCHAR(150) NOT NULL,
  sekolah_id          BIGINT REFERENCES sekolah(sekolah_id) ON UPDATE CASCADE ON DELETE SET NULL,
  dibuat_oleh         BIGINT NOT NULL REFERENCES pengguna(pengguna_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_agenda_tanggal ON agenda(tanggal);
CREATE INDEX IF NOT EXISTS idx_agenda_status ON agenda(status);
CREATE INDEX IF NOT EXISTS idx_agenda_sekolah ON agenda(sekolah_id);

-- TABLE: reservasi
CREATE TABLE IF NOT EXISTS reservasi (
  reservasi_id        BIGSERIAL PRIMARY KEY,
  nomor_antrian       VARCHAR(20) NOT NULL UNIQUE,
  layanan_id          BIGINT NOT NULL REFERENCES layanan(layanan_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  tanggal             DATE NOT NULL,
  slot_waktu          VARCHAR(11) NOT NULL,
  nama_pemesan        VARCHAR(100) NOT NULL,
  telepon             VARCHAR(25) NOT NULL,
  nik                 VARCHAR(20),
  tujuan              VARCHAR(255) NOT NULL,
  status              reservation_status NOT NULL DEFAULT 'MENUNGGU',
  estimasi_panggilan  TIME,
  pengguna_id         BIGINT REFERENCES pengguna(pengguna_id) ON UPDATE CASCADE ON DELETE SET NULL,
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_reservasi_slot UNIQUE (layanan_id, tanggal, slot_waktu)
);
CREATE INDEX IF NOT EXISTS idx_reservasi_status ON reservasi(status);
CREATE INDEX IF NOT EXISTS idx_reservasi_layanan ON reservasi(layanan_id);
CREATE INDEX IF NOT EXISTS idx_reservasi_tanggal ON reservasi(tanggal);

-- TABLE: laporan_pengaduan
CREATE TABLE IF NOT EXISTS laporan_pengaduan (
  laporan_id          BIGSERIAL PRIMARY KEY,
  judul               VARCHAR(200) NOT NULL,
  kategori            VARCHAR(50) NOT NULL,
  prioritas           priority_type NOT NULL DEFAULT 'SEDANG',
  deskripsi           TEXT NOT NULL,
  tanggal_lapor       DATE NOT NULL,
  status              report_status NOT NULL DEFAULT 'BARU',
  kontak              VARCHAR(25) NOT NULL,
  bukti               VARCHAR(200),
  sekolah_id          BIGINT NOT NULL REFERENCES sekolah(sekolah_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  pelapor_id          BIGINT REFERENCES pengguna(pengguna_id) ON UPDATE CASCADE ON DELETE SET NULL,
  dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_laporan_status ON laporan_pengaduan(status);
CREATE INDEX IF NOT EXISTS idx_laporan_sekolah ON laporan_pengaduan(sekolah_id);

COMMIT;
