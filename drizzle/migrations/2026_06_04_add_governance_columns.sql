-- ATHLYNX Build 14 — governance columns
-- Adds the doctrine-flag columns that the Drizzle schema references but
-- were never applied to the production Neon database.
-- These columns power billing-exempt, full-admin, and VIP logic.
-- Safe to run multiple times (IF NOT EXISTS / DO NOTHING pattern).
-- June 4, 2026

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_vip            BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS unlimited_credits  BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_exempt     BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_admin         BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS partner_status     TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS access_tier        TEXT;

-- Set the founder (Chad) as billing_exempt, full_admin, and Master Admin tier
-- so the admin panel renders correctly on first login.
UPDATE users
SET
  billing_exempt    = TRUE,
  unlimited_credits = TRUE,
  full_admin        = TRUE,
  access_tier       = 'Master Admin'
WHERE email IN (
  'chaddozier75@gmail.com',
  'cdozier14@athlynx.ai',
  'cdozier@dozierholdingsgroup.com'
);

-- Set the Full Admin tier for the rest of The Four
UPDATE users
SET
  billing_exempt    = TRUE,
  unlimited_credits = TRUE,
  full_admin        = TRUE,
  access_tier       = 'Full Admin'
WHERE email IN (
  'lmarshall@athlynx.ai',
  'leronious@gmail.com',
  'gtse@dozierholdingsgroup.com',
  'gtse@athlynx.ai',
  'glenn.tse@gmail.com',
  'tlockey24@athlynx.ai',
  'tlocey@athlynx.ai',
  'tonyloceybaseball@gmail.com'
);
