-- Build 6 / PR 53 — Social OS tenant guardrail compatibility
-- Keeps preview/local schemas aligned with production Neon, where Social OS
-- operational tables are tenant-scoped and tenant_id is required.

ALTER TABLE social_accounts
  ADD COLUMN IF NOT EXISTS tenant_id TEXT;

ALTER TABLE social_content
  ADD COLUMN IF NOT EXISTS tenant_id TEXT;

ALTER TABLE social_posts
  ADD COLUMN IF NOT EXISTS tenant_id TEXT;

UPDATE social_accounts SET tenant_id = 'athlynxai' WHERE tenant_id IS NULL;
UPDATE social_content SET tenant_id = 'athlynxai' WHERE tenant_id IS NULL;
UPDATE social_posts SET tenant_id = 'athlynxai' WHERE tenant_id IS NULL;

ALTER TABLE social_accounts
  ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE social_content
  ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE social_posts
  ALTER COLUMN tenant_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_social_accounts_tenant_status
  ON social_accounts(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_social_content_tenant_active
  ON social_content(tenant_id, is_active);

CREATE INDEX IF NOT EXISTS idx_social_posts_tenant_status_scheduled
  ON social_posts(tenant_id, status, scheduled_for);
