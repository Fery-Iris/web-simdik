-- Rename columns in otp_resets table to use Indonesian naming convention
-- This migration renames columns to be consistent with other tables

-- Rename expires_at to berlaku_sampai
ALTER TABLE "otp_resets" 
RENAME COLUMN "expires_at" TO "berlaku_sampai";

-- Rename used to digunakan
ALTER TABLE "otp_resets" 
RENAME COLUMN "used" TO "digunakan";

-- Rename created_at to dibuat_pada
ALTER TABLE "otp_resets" 
RENAME COLUMN "created_at" TO "dibuat_pada";

-- Drop old index and create new one with new column name
DROP INDEX IF EXISTS "otp_resets_expires_at_idx";
CREATE INDEX IF NOT EXISTS "otp_resets_berlaku_sampai_idx" ON "otp_resets"("berlaku_sampai");

