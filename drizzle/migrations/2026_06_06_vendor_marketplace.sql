-- ============================================================
-- Migration: 2026_06_06_vendor_marketplace.sql
-- AthlynX Vendor Marketplace & CRM Vendor Module
-- Adds vendor_partners, vendor_products, vendor_deals tables
-- ============================================================

-- ─── Vendor Partners Registry ────────────────────────────────
CREATE TABLE IF NOT EXISTS vendor_partners (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(128) NOT NULL,
  slug                VARCHAR(64)  UNIQUE NOT NULL,
  category            VARCHAR(64),           -- apparel | equipment | nutrition | tech | media | other
  contact_name        VARCHAR(128),
  contact_email       VARCHAR(320),
  contact_phone       VARCHAR(20),
  website             VARCHAR(256),
  shopify_vendor_tag  VARCHAR(128),          -- must match Shopify product vendor field exactly
  commission_pct      NUMERIC(5,2) DEFAULT 0,
  status              VARCHAR(32)  DEFAULT 'active',  -- active | paused | pending | ended
  notes               TEXT,
  logo_url            VARCHAR(512),
  created_at          TIMESTAMPTZ  DEFAULT now(),
  updated_at          TIMESTAMPTZ  DEFAULT now()
);

-- Seed ICC-USA as the first vendor partner
INSERT INTO vendor_partners
  (name, slug, category, shopify_vendor_tag, commission_pct, status, notes)
VALUES
  ('ICC-USA', 'icc-usa', 'equipment', 'ICC-USA', 0.00, 'active',
   'Primary hardware, equipment, and apparel fulfillment partner for AthlynX. All physical products fulfilled through ICC-USA.')
ON CONFLICT (slug) DO NOTHING;

-- ─── Vendor Products (Shopify catalog mirror) ────────────────
CREATE TABLE IF NOT EXISTS vendor_products (
  id                  SERIAL PRIMARY KEY,
  vendor_id           INTEGER REFERENCES vendor_partners(id) ON DELETE CASCADE,
  shopify_product_id  VARCHAR(128),
  title               VARCHAR(256) NOT NULL,
  handle              VARCHAR(256),
  price_cents         INTEGER,
  collection          VARCHAR(128),
  tags                JSONB DEFAULT '[]'::jsonb,
  status              VARCHAR(32)  DEFAULT 'active',
  synced_at           TIMESTAMPTZ  DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vendor_products_vendor_id_idx ON vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS vendor_products_shopify_id_idx ON vendor_products(shopify_product_id);

-- ─── Vendor Deals Pipeline ───────────────────────────────────
CREATE TABLE IF NOT EXISTS vendor_deals (
  id              SERIAL PRIMARY KEY,
  vendor_id       INTEGER REFERENCES vendor_partners(id) ON DELETE CASCADE,
  name            VARCHAR(256) NOT NULL,
  stage           VARCHAR(64)  DEFAULT 'outreach',
  -- outreach | negotiating | contracted | active | paused | ended
  deal_type       VARCHAR(64)  DEFAULT 'marketplace',
  -- marketplace | exclusive | co-brand | sponsorship | white-label
  amount_cents    INTEGER      DEFAULT 0,
  commission_pct  NUMERIC(5,2),
  start_date      DATE,
  end_date        DATE,
  notes           TEXT,
  created_by      INTEGER,     -- user id
  created_at      TIMESTAMPTZ  DEFAULT now(),
  updated_at      TIMESTAMPTZ  DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vendor_deals_vendor_id_idx ON vendor_deals(vendor_id);
CREATE INDEX IF NOT EXISTS vendor_deals_stage_idx ON vendor_deals(stage);

-- Seed ICC-USA initial deal
INSERT INTO vendor_deals
  (vendor_id, name, stage, deal_type, notes)
SELECT
  id, 'ICC-USA Primary Fulfillment Agreement', 'active', 'marketplace',
  'Primary fulfillment partner — all AthlynX physical products. Onboarded June 6, 2026.'
FROM vendor_partners WHERE slug = 'icc-usa'
ON CONFLICT DO NOTHING;
