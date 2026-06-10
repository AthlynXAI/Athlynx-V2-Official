-- Build 7 — Soul Source OS
-- The platform layer that owns every social/app integration. Apple Moment.
--
-- social_accounts: OAuth tokens + credentials for every platform we post to.
-- social_content:  The content pool. Every asset we want to push, with media + body + tags.
-- social_posts:    Realized posts. One row per (content × destination × attempt). Dedup by content_hash + platform.
-- social_platforms: Catalog of platforms with their rate limits and posting capabilities.

CREATE TABLE IF NOT EXISTS social_platforms (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  posts_per_day INT NOT NULL DEFAULT 1,
  supports_text BOOLEAN NOT NULL DEFAULT TRUE,
  supports_image BOOLEAN NOT NULL DEFAULT FALSE,
  supports_video BOOLEAN NOT NULL DEFAULT FALSE,
  supports_link BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_accounts (
  id SERIAL PRIMARY KEY,
  platform_slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  handle TEXT,
  external_id TEXT,
  access_token_env TEXT,
  refresh_token_env TEXT,
  webhook_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_used_at TIMESTAMPTZ,
  last_error TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform_slug);
CREATE INDEX IF NOT EXISTS idx_social_accounts_status ON social_accounts(status);

CREATE TABLE IF NOT EXISTS social_content (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'text',
  title TEXT,
  body TEXT NOT NULL,
  link_url TEXT,
  image_url TEXT,
  video_url TEXT,
  tags TEXT[],
  content_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  use_count INT NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_social_content_active ON social_content(is_active);
CREATE INDEX IF NOT EXISTS idx_social_content_hash ON social_content(content_hash);
CREATE INDEX IF NOT EXISTS idx_social_content_kind ON social_content(kind);

CREATE TABLE IF NOT EXISTS social_posts (
  id SERIAL PRIMARY KEY,
  content_id INT NOT NULL REFERENCES social_content(id) ON DELETE CASCADE,
  account_id INT NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform_slug TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  scheduled_for TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  external_post_id TEXT,
  external_post_url TEXT,
  error TEXT,
  attempt INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform_slug);
CREATE INDEX IF NOT EXISTS idx_social_posts_posted_at ON social_posts(posted_at);
-- The Apple Moment dedupe — one piece of content posted at most once per platform.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_social_posts_hash_platform_success
  ON social_posts(content_hash, platform_slug)
  WHERE status = 'posted';

-- Seed the platform catalog with everything Chad mentioned + the connectors already wired.
INSERT INTO social_platforms (slug, name, category, posts_per_day, supports_text, supports_image, supports_video, supports_link, notes) VALUES
('linkedin', 'LinkedIn', 'Professional', 3, TRUE, TRUE, TRUE, TRUE, 'Chad''s primary professional channel. Native API or via Buffer.'),
('facebook_pages', 'Facebook Pages', 'Social', 5, TRUE, TRUE, TRUE, TRUE, 'Native connector already wired (facebook_pages__pipedream).'),
('twitter_x', 'X (Twitter)', 'Social', 10, TRUE, TRUE, TRUE, TRUE, 'Via Buffer or Zapier — no native API connector here.'),
('instagram', 'Instagram', 'Social', 3, FALSE, TRUE, TRUE, FALSE, 'Image + video only. Via Buffer.'),
('tiktok', 'TikTok', 'Social', 5, FALSE, FALSE, TRUE, FALSE, 'Video only. Via Buffer.'),
('youtube', 'YouTube', 'Video', 2, FALSE, FALSE, TRUE, FALSE, 'Native connector already wired (youtube_data_api__pipedream).'),
('threads', 'Threads', 'Social', 10, TRUE, TRUE, TRUE, TRUE, 'Via Buffer.'),
('alignable', 'Alignable', 'Business', 2, TRUE, TRUE, FALSE, TRUE, 'No public API. Manual or browser automation.'),
('gravatar', 'Gravatar', 'Profile', 0, FALSE, TRUE, FALSE, FALSE, 'Profile-only sync, not a post destination. Used for avatar consistency.'),
('buffer', 'Buffer (Fanout)', 'Aggregator', 2, TRUE, TRUE, TRUE, TRUE, 'Free tier = 2 posts/day total across all connected channels.'),
('zapier', 'Zapier (Webhook)', 'Aggregator', 100, TRUE, TRUE, TRUE, TRUE, 'Free tier limited; Zaps run on webhook trigger. One zap per destination.'),
('jira', 'Jira', 'Atlassian', 50, TRUE, FALSE, FALSE, TRUE, 'Internal task creation, not a post destination.'),
('confluence', 'Confluence', 'Atlassian', 50, TRUE, TRUE, FALSE, TRUE, 'Internal doc publishing, not a post destination.'),
('slack', 'Slack', 'Internal', 100, TRUE, TRUE, TRUE, TRUE, 'Native connector already wired (slack_direct). Internal alerts.')
ON CONFLICT (slug) DO NOTHING;
