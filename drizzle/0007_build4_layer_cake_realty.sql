-- Build 4 — Social Media Layer Cake + AthlyXAI Realty
-- Owner-authorized by Chad A Dozier (Master Admin) on 2026-05-11
-- Locks in: profile automation hub, connected accounts, scheduled posts (Real Me / Real AI Me),
--           Atlassian (Jira/Confluence) + Alignable tracking, realty listings + inquiries.

-- ─── Connected social/work accounts (Buffer, Zapier, Gravatar, Jira, Confluence, Alignable, etc.) ─────────
CREATE TABLE IF NOT EXISTS connected_accounts (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL,            -- buffer, zapier, gravatar, jira, confluence, atlassian, alignable, linkedin, x, ig, facebook, tiktok, youtube
  account_label   TEXT,                     -- human display name
  external_id     TEXT,                     -- remote account id / channel id / page id
  api_endpoint    TEXT,                     -- webhook url for zapier, base url for jira/confluence
  is_active       BOOLEAN NOT NULL DEFAULT true,
  is_owner_only   BOOLEAN NOT NULL DEFAULT false,  -- when true, only Master Admin can post from it
  metadata        JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMP NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_user     ON connected_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_provider ON connected_accounts(provider);

-- ─── Scheduled posts the daily agent will fan out ─────────────────────────────
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  voice             TEXT NOT NULL DEFAULT 'real_ai',         -- 'real_me' | 'real_ai'
  body              TEXT NOT NULL,
  media_url         TEXT,
  link_url          TEXT,
  channels          JSONB NOT NULL DEFAULT '[]'::jsonb,      -- ['linkedin','x','facebook',...]
  status            TEXT NOT NULL DEFAULT 'queued',          -- queued | sent | failed | preempted | cancelled
  scheduled_for     TIMESTAMP NOT NULL,
  sent_at           TIMESTAMP,
  source            TEXT NOT NULL DEFAULT 'agent',           -- 'agent' | 'owner_override' | 'manual'
  source_note       TEXT,                                    -- if owner_override, why
  external_ids      JSONB DEFAULT '{}'::jsonb,               -- {linkedin:'urn:...', buffer:'id'}
  error             TEXT,
  created_at        TIMESTAMP NOT NULL DEFAULT now(),
  updated_at        TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user    ON scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status  ON scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_when    ON scheduled_posts(scheduled_for);

-- ─── Profile automation settings (one row per user) ───────────────────────────
CREATE TABLE IF NOT EXISTS profile_automation (
  user_id              INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  enabled              BOOLEAN NOT NULL DEFAULT false,
  daily_target_count   INTEGER NOT NULL DEFAULT 1,
  default_voice        TEXT NOT NULL DEFAULT 'real_ai',     -- 'real_me' | 'real_ai'
  brand_voice_note     TEXT,                                -- "man on a porch telling the truth"
  channels             JSONB NOT NULL DEFAULT '[]'::jsonb,
  quiet_hours_start    INTEGER DEFAULT 22,                  -- 24h, user local
  quiet_hours_end      INTEGER DEFAULT 6,
  last_post_at         TIMESTAMP,
  master_admin         BOOLEAN NOT NULL DEFAULT false,      -- pre-empt rights
  created_at           TIMESTAMP NOT NULL DEFAULT now(),
  updated_at           TIMESTAMP NOT NULL DEFAULT now()
);

-- ─── AthlyXAI Realty (athlete-first housing layer) ────────────────────────────
CREATE TABLE IF NOT EXISTS realty_listings (
  id                SERIAL PRIMARY KEY,
  owner_user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  kind              TEXT NOT NULL DEFAULT 'rental',         -- rental | host_family | team_housing | shared | for_sale
  title             TEXT NOT NULL,
  description       TEXT,
  city              TEXT NOT NULL,
  state             TEXT NOT NULL,
  zip               TEXT,
  lat               DOUBLE PRECISION,
  lng               DOUBLE PRECISION,
  monthly_rent      INTEGER,                                -- USD cents/month, null for non-rental
  sale_price        INTEGER,                                -- USD cents, null for non-sale
  bedrooms          NUMERIC(3,1),
  bathrooms         NUMERIC(3,1),
  square_feet       INTEGER,
  near_schools      JSONB DEFAULT '[]'::jsonb,              -- ['Texas A&M','UT Austin']
  near_team         TEXT,
  nil_friendly      BOOLEAN NOT NULL DEFAULT false,         -- short lease / no-credit / coach-vouched friendly
  photos            JSONB DEFAULT '[]'::jsonb,
  amenities         JSONB DEFAULT '[]'::jsonb,
  available_from    DATE,
  available_until   DATE,
  status            TEXT NOT NULL DEFAULT 'active',         -- active | paused | filled | closed
  contact_email     TEXT,
  contact_phone     TEXT,
  created_at        TIMESTAMP NOT NULL DEFAULT now(),
  updated_at        TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_realty_listings_city   ON realty_listings(city);
CREATE INDEX IF NOT EXISTS idx_realty_listings_state  ON realty_listings(state);
CREATE INDEX IF NOT EXISTS idx_realty_listings_kind   ON realty_listings(kind);
CREATE INDEX IF NOT EXISTS idx_realty_listings_status ON realty_listings(status);

CREATE TABLE IF NOT EXISTS realty_inquiries (
  id              SERIAL PRIMARY KEY,
  listing_id      INTEGER NOT NULL REFERENCES realty_listings(id) ON DELETE CASCADE,
  inquirer_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  inquirer_name   TEXT,
  inquirer_email  TEXT,
  inquirer_phone  TEXT,
  message         TEXT,
  move_in_date    DATE,
  party_size      INTEGER,
  status          TEXT NOT NULL DEFAULT 'new',              -- new | responded | toured | declined | accepted
  created_at      TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_realty_inquiries_listing ON realty_inquiries(listing_id);

-- ─── CRM: accounts, contacts, deals, activities, pipelines ───────────────────
CREATE TABLE IF NOT EXISTS crm_accounts (
  id              SERIAL PRIMARY KEY,
  owner_user_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  kind            TEXT NOT NULL DEFAULT 'org',          -- org | athlete | family | brand | school | team | investor | vendor
  website         TEXT,
  industry        TEXT,
  city            TEXT,
  state           TEXT,
  country         TEXT DEFAULT 'USA',
  size_label      TEXT,                                 -- 1-10, 11-50, 51-200, ...
  health_score    INTEGER DEFAULT 50,                   -- 0-100, computed by python_services/crm_scorer
  stage           TEXT DEFAULT 'prospect',              -- prospect | engaged | active | customer | churned
  notes           TEXT,
  tags            JSONB DEFAULT '[]'::jsonb,
  metadata        JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMP NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_accounts_owner ON crm_accounts(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_crm_accounts_stage ON crm_accounts(stage);
CREATE INDEX IF NOT EXISTS idx_crm_accounts_kind  ON crm_accounts(kind);

CREATE TABLE IF NOT EXISTS crm_hub_contacts (
  id              SERIAL PRIMARY KEY,
  account_id      INTEGER REFERENCES crm_accounts(id) ON DELETE CASCADE,
  owner_user_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  first_name      TEXT,
  last_name       TEXT,
  full_name       TEXT,
  email           TEXT,
  phone           TEXT,
  title           TEXT,
  role_label      TEXT,                                 -- coach | athlete | parent | exec | investor | partner | recruiter
  linkedin_url    TEXT,
  is_primary      BOOLEAN NOT NULL DEFAULT false,
  metadata        JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMP NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_hub_contacts_account ON crm_hub_contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_hub_contacts_email   ON crm_hub_contacts(email);

CREATE TABLE IF NOT EXISTS crm_pipelines (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  stages          JSONB NOT NULL DEFAULT '["lead","qualified","proposal","committed","closed_won","closed_lost"]'::jsonb,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm_deals (
  id                 SERIAL PRIMARY KEY,
  account_id         INTEGER REFERENCES crm_accounts(id) ON DELETE CASCADE,
  contact_id         INTEGER REFERENCES crm_hub_contacts(id) ON DELETE SET NULL,
  owner_user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  pipeline_id        INTEGER REFERENCES crm_pipelines(id) ON DELETE SET NULL,
  name               TEXT NOT NULL,
  stage              TEXT NOT NULL DEFAULT 'lead',
  amount_cents       BIGINT NOT NULL DEFAULT 0,
  currency           TEXT NOT NULL DEFAULT 'USD',
  probability        INTEGER NOT NULL DEFAULT 10,        -- 0-100
  expected_close     DATE,
  closed_at          TIMESTAMP,
  won                BOOLEAN,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  source             TEXT,                                -- inbound | outbound | partner | event | brand_wall | recruiting
  tags               JSONB DEFAULT '[]'::jsonb,
  notes              TEXT,
  metadata           JSONB DEFAULT '{}'::jsonb,
  created_at         TIMESTAMP NOT NULL DEFAULT now(),
  updated_at         TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_deals_account  ON crm_deals(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_owner    ON crm_deals(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage    ON crm_deals(stage);
CREATE INDEX IF NOT EXISTS idx_crm_deals_close    ON crm_deals(expected_close);

CREATE TABLE IF NOT EXISTS crm_activities (
  id              SERIAL PRIMARY KEY,
  account_id      INTEGER REFERENCES crm_accounts(id) ON DELETE CASCADE,
  contact_id      INTEGER REFERENCES crm_hub_contacts(id) ON DELETE SET NULL,
  deal_id         INTEGER REFERENCES crm_deals(id) ON DELETE SET NULL,
  user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
  kind            TEXT NOT NULL,                         -- note | call | email | meeting | task | post | dm | stripe_event
  subject         TEXT,
  body            TEXT,
  occurred_at     TIMESTAMP NOT NULL DEFAULT now(),
  due_at          TIMESTAMP,
  completed       BOOLEAN NOT NULL DEFAULT false,
  metadata        JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_activities_account ON crm_activities(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_deal    ON crm_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user    ON crm_activities(user_id);

-- Seed the default pipeline if none exists.
INSERT INTO crm_pipelines (name, stages, is_default)
SELECT 'Athlynx Default', '["lead","qualified","proposal","committed","closed_won","closed_lost"]'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM crm_pipelines WHERE is_default = true);

-- ─── Stripe mirror (read-side cache + event log) ──────────────────────────────
-- We do not store secrets here. Just a mirror of objects we read frequently
-- so the CRM can render fast without round-tripping every page load.
CREATE TABLE IF NOT EXISTS stripe_customers_mirror (
  stripe_customer_id  TEXT PRIMARY KEY,
  user_id             INTEGER REFERENCES users(id) ON DELETE SET NULL,
  account_id          INTEGER REFERENCES crm_accounts(id) ON DELETE SET NULL,
  email               TEXT,
  name                TEXT,
  delinquent          BOOLEAN,
  livemode            BOOLEAN,
  balance_cents       BIGINT DEFAULT 0,
  currency            TEXT DEFAULT 'usd',
  created             TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stripe_subscriptions_mirror (
  stripe_subscription_id TEXT PRIMARY KEY,
  stripe_customer_id     TEXT REFERENCES stripe_customers_mirror(stripe_customer_id) ON DELETE CASCADE,
  status                 TEXT,
  current_period_start   TIMESTAMP,
  current_period_end     TIMESTAMP,
  cancel_at              TIMESTAMP,
  canceled_at            TIMESTAMP,
  price_id               TEXT,
  product_id             TEXT,
  amount_cents           BIGINT,
  currency               TEXT DEFAULT 'usd',
  interval               TEXT,
  livemode               BOOLEAN,
  updated_at             TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_stripe_subs_customer ON stripe_subscriptions_mirror(stripe_customer_id);

CREATE TABLE IF NOT EXISTS stripe_invoices_mirror (
  stripe_invoice_id   TEXT PRIMARY KEY,
  stripe_customer_id  TEXT,
  status              TEXT,
  amount_due_cents    BIGINT,
  amount_paid_cents   BIGINT,
  amount_remaining_cents BIGINT,
  currency            TEXT DEFAULT 'usd',
  number              TEXT,
  hosted_invoice_url  TEXT,
  invoice_pdf_url     TEXT,
  period_start        TIMESTAMP,
  period_end          TIMESTAMP,
  paid_at             TIMESTAMP,
  livemode            BOOLEAN,
  updated_at          TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_stripe_invoices_customer ON stripe_invoices_mirror(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_invoices_status   ON stripe_invoices_mirror(status);

CREATE TABLE IF NOT EXISTS stripe_events_log (
  id              SERIAL PRIMARY KEY,
  stripe_event_id TEXT UNIQUE,
  type            TEXT NOT NULL,
  livemode        BOOLEAN,
  payload         JSONB NOT NULL,
  received_at     TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON stripe_events_log(type);

-- ─── Tiered plans + credit ledger (the survival layer) ──────────────────────
CREATE TABLE IF NOT EXISTS plan_tiers (
  id                   SERIAL PRIMARY KEY,
  key                  TEXT NOT NULL UNIQUE,            -- backyard | varsity | pro | franchise | enterprise
  name                 TEXT NOT NULL,
  description          TEXT,
  monthly_price_cents  BIGINT NOT NULL DEFAULT 0,
  yearly_price_cents   BIGINT NOT NULL DEFAULT 0,
  monthly_credits      INTEGER NOT NULL DEFAULT 0,      -- recurring grant per billing cycle
  bonus_credits        INTEGER NOT NULL DEFAULT 0,      -- one-time grant on first subscribe
  ai_credits_monthly   INTEGER NOT NULL DEFAULT 0,      -- separate pool for AI workloads
  features             JSONB NOT NULL DEFAULT '[]'::jsonb,
  audience             TEXT,                            -- athlete | brand | school | agent | family
  is_active            BOOLEAN NOT NULL DEFAULT true,
  sort_order           INTEGER NOT NULL DEFAULT 0,
  stripe_product_id    TEXT,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly  TEXT,
  metadata             JSONB DEFAULT '{}'::jsonb,
  created_at           TIMESTAMP NOT NULL DEFAULT now(),
  updated_at           TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_plan_tiers_audience ON plan_tiers(audience);
CREATE INDEX IF NOT EXISTS idx_plan_tiers_active   ON plan_tiers(is_active);

CREATE TABLE IF NOT EXISTS credit_packs (
  id                   SERIAL PRIMARY KEY,
  key                  TEXT NOT NULL UNIQUE,            -- pack_100, pack_500, pack_2000, pack_10000
  name                 TEXT NOT NULL,
  credits              INTEGER NOT NULL,
  price_cents          BIGINT NOT NULL,
  bonus_credits        INTEGER NOT NULL DEFAULT 0,
  stripe_product_id    TEXT,
  stripe_price_id      TEXT,
  is_active            BOOLEAN NOT NULL DEFAULT true,
  sort_order           INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credit_ledger (
  id                   BIGSERIAL PRIMARY KEY,
  user_id              INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id           INTEGER REFERENCES crm_accounts(id) ON DELETE SET NULL,
  kind                 TEXT NOT NULL,                   -- grant_plan | grant_bonus | pack_purchase | spend | refund | adjustment | rollover_expired
  pool                 TEXT NOT NULL DEFAULT 'general', -- general | ai | beta
  delta                INTEGER NOT NULL,                -- positive = grant/purchase/refund, negative = spend
  balance_after        INTEGER NOT NULL,                -- snapshot of pool balance after this entry
  reason               TEXT,                            -- short human label, e.g. 'wizard:transfer_portal' or 'plan:varsity_monthly'
  reference_id         TEXT,                            -- stripe_invoice_id | wizard_run_id | post_id | etc
  stripe_invoice_id    TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  metadata             JSONB DEFAULT '{}'::jsonb,
  created_at           TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user        ON credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_pool   ON credit_ledger(user_id, pool);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_stripe_inv  ON credit_ledger(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_kind        ON credit_ledger(kind);

CREATE TABLE IF NOT EXISTS credit_balances (
  user_id              INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pool                 TEXT NOT NULL DEFAULT 'general',
  balance              INTEGER NOT NULL DEFAULT 0,
  lifetime_granted     BIGINT NOT NULL DEFAULT 0,
  lifetime_spent       BIGINT NOT NULL DEFAULT 0,
  current_tier_key     TEXT,
  next_grant_at        TIMESTAMP,
  updated_at           TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, pool)
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id                       SERIAL PRIMARY KEY,
  user_id                  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier_key                 TEXT REFERENCES plan_tiers(key) ON DELETE SET NULL,
  stripe_customer_id       TEXT,
  stripe_subscription_id   TEXT UNIQUE,
  status                   TEXT NOT NULL DEFAULT 'incomplete',  -- incomplete | active | trialing | past_due | canceled | unpaid
  cadence                  TEXT NOT NULL DEFAULT 'monthly',     -- monthly | yearly
  current_period_start     TIMESTAMP,
  current_period_end       TIMESTAMP,
  trial_end                TIMESTAMP,
  cancel_at_period_end     BOOLEAN NOT NULL DEFAULT false,
  canceled_at              TIMESTAMP,
  created_at               TIMESTAMP NOT NULL DEFAULT now(),
  updated_at               TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_subs_user   ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subs_status ON user_subscriptions(status);

-- Seed the five Athlynx tiers (truth over hype; prices in cents, USD)
INSERT INTO plan_tiers (key, name, description, audience, monthly_price_cents, yearly_price_cents,
                        monthly_credits, bonus_credits, ai_credits_monthly, features, sort_order, is_active)
VALUES
  ('backyard',   'Backyard',   'For the kid in the backyard. Start the journey, free forever for the basics.',
     'athlete',          0,        0,    50,   100,    20,
     '["Profile","Top 5 schools tracker","Brand wall view","Limited AI wizard runs","Community feed"]'::jsonb,
     10, true),
  ('varsity',    'Varsity',    'For the athlete competing for a roster spot. Recruiting, NIL, AI scouting.',
     'athlete',       1900,    18000,   600,   250,   300,
     '["Everything in Backyard","Full recruiting hub","NIL marketplace","AI scouting reports","Top 5 letters","Coach DMs"]'::jsonb,
     20, true),
  ('pro',        'Pro',        'For the pro and the agent. Brand wall, deal flow, Layer Cake automation.',
     'athlete',       4900,    49000,  2500,  1000,  1500,
     '["Everything in Varsity","Layer Cake daily posting","CRM","Brand deal pipeline","Priority AI","Realty alerts"]'::jsonb,
     30, true),
  ('franchise',  'Franchise',  'For schools, teams, and agencies running rosters of athletes.',
     'school',       19900,   199000, 12000,  5000,  6000,
     '["Everything in Pro","Roster seats","Team housing tools","Compliance dashboards","Shared CRM","Group analytics"]'::jsonb,
     40, true),
  ('enterprise', 'Enterprise', 'Brands, leagues, and partners. Custom credit grants, SSO, white-glove onboarding.',
     'brand',        99900,   999000, 100000, 25000, 50000,
     '["Everything in Franchise","SSO","Dedicated success manager","Custom integrations","Volume credit grants","SLA"]'::jsonb,
     50, true)
ON CONFLICT (key) DO NOTHING;

INSERT INTO credit_packs (key, name, credits, price_cents, bonus_credits, sort_order, is_active)
VALUES
  ('pack_100',    '100 credits',     100,    900,    0, 10, true),
  ('pack_500',    '500 credits',     500,   3900,   50, 20, true),
  ('pack_2000',   '2,000 credits',  2000,  12900,  300, 30, true),
  ('pack_10000',  '10,000 credits',10000,  49900, 2000, 40, true)
ON CONFLICT (key) DO NOTHING;
