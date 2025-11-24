-- Create OTP Reset Table
CREATE TABLE IF NOT EXISTS "otp_resets" (
  "id_otp_resets" BIGSERIAL PRIMARY KEY,
  "email" VARCHAR(150) NOT NULL,
  "otp" VARCHAR(6) NOT NULL,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "used" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "otp_resets_email_idx" ON "otp_resets"("email");
CREATE INDEX IF NOT EXISTS "otp_resets_otp_idx" ON "otp_resets"("otp");
CREATE INDEX IF NOT EXISTS "otp_resets_expires_at_idx" ON "otp_resets"("expires_at");

