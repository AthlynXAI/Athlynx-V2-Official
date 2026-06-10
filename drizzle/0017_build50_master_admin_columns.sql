-- ─── Build 50 · Master Admin Doctrine columns ────────────────────────────────
-- Source of truth: drizzle/schema.ts users table (Build 50 · May 29, 2026)
-- These 6 columns were added to schema.ts but never pushed to the live Neon DB.
-- Using ADD COLUMN IF NOT EXISTS so this migration is idempotent / safe to
-- re-run if any column was added manually.

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "is_vip"             boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "unlimited_credits"  boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "billing_exempt"     boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "full_admin"         boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "partner_status"     text,
  ADD COLUMN IF NOT EXISTS "access_tier"        text;

-- Back-fill Chad Dozier (the founder) as Master Admin.
-- Safe: only updates the single row whose email matches; no-op if already set.
UPDATE "users"
SET
  "is_vip"            = true,
  "unlimited_credits" = true,
  "billing_exempt"    = true,
  "full_admin"        = true,
  "isFounder"         = true,
  "partner_status"    = 'Partner & Team Member',
  "access_tier"       = 'Master Admin'
WHERE "email" = 'chaddozier75@gmail.com';
