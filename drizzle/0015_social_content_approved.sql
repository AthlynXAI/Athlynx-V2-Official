-- PR #54 — Autonomous Social OS Seeder: owner-approved content approval table
--
-- Permanent doctrine ref: ATHLYNXAI_COMMUNICATIONS_DOCTRINE.md,
--   docs/specs/03-autonomous-os.md (Engines 2 + 3).
--
-- This table is the ONLY input to the autonomous seeder. The seeder will not
-- accept content unless it is present here AND has approved_at IS NOT NULL.
-- Each row represents one owner-approved content package (media + caption +
-- destination list + identity). The seeder enforces:
--   1. Brand-new content_hash only (never repost the same hash to the same
--      platform, regardless of prior status).
--   2. Platform must be in the explicit destinations[] array.
--   3. Account must be active under tenant 'athlynxai'.
--   4. Format must match platform requirements (Instagram requires image_url
--      or video_url, never text-only).
--
-- The dedupe is enforced by both the existing
--   uniq_social_posts_hash_platform_success (content_hash, platform_slug)
--     WHERE status = 'posted'
-- AND a new application-level check that refuses any content_hash that exists
-- in social_posts for that platform_slug at ANY status (per Chad's permanent
-- rule: "Never post same message video image content twice — brand new design").

CREATE TABLE IF NOT EXISTS social_content_approved (
  id SERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'athlynxai',
  kind TEXT NOT NULL DEFAULT 'image',
  title TEXT,
  body TEXT NOT NULL,
  link_url TEXT,
  image_url TEXT,
  video_url TEXT,
  tags TEXT[],
  -- The exact destination list the owner approved. Slugs must match
  -- social_platforms.slug; the seeder will reject any unknown slug.
  destinations TEXT[] NOT NULL,
  content_hash TEXT NOT NULL,
  -- Owner approval gate. Seeder ignores rows where approved_at IS NULL.
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  -- Seeding gate. Once seeded into social_content + social_posts the seeder
  -- marks this row with seeded_at to prevent re-seeding the same package.
  seeded_at TIMESTAMPTZ,
  seeded_content_id INT,
  -- Audit trail
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_social_content_approved_hash
  ON social_content_approved(tenant_id, content_hash);

CREATE INDEX IF NOT EXISTS idx_social_content_approved_pending
  ON social_content_approved(tenant_id, approved_at, seeded_at)
  WHERE approved_at IS NOT NULL AND seeded_at IS NULL;

-- Foreign-key the seeded_content_id back to social_content for traceability.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'social_content_approved_seeded_content_id_fkey'
      AND table_name = 'social_content_approved'
  ) THEN
    ALTER TABLE social_content_approved
      ADD CONSTRAINT social_content_approved_seeded_content_id_fkey
      FOREIGN KEY (seeded_content_id) REFERENCES social_content(id) ON DELETE SET NULL;
  END IF;
END $$;

-- PR #54 — Routing identity for the Buffer Profile Resolver.
-- The resolver upserts on (tenant_id, platform_slug, handle); make that
-- combination unique so ON CONFLICT works and we never write duplicate
-- routing rows for the same approved handle.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_social_accounts_tenant_platform_handle
  ON social_accounts(tenant_id, platform_slug, handle)
  WHERE handle IS NOT NULL;
