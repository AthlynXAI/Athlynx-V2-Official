-- ATHLYNX Build 13 — traffic_ledger
-- Meters every operator API call, MCP invocation, and revenue moment.
-- May 12, 2026

CREATE TABLE IF NOT EXISTS traffic_ledger (
  id              BIGSERIAL PRIMARY KEY,
  operator_id     TEXT,                       -- which licensee
  connector       TEXT NOT NULL,              -- 'stripe', 'nebius', 'buffer', 'zapier', 'supabase', etc.
  endpoint        TEXT,                       -- the path or procedure called
  mcp_tool        TEXT,                       -- the MCP tool name if applicable
  call_count      INTEGER NOT NULL DEFAULT 1,
  ai_minutes      NUMERIC(12, 4) DEFAULT 0,   -- compute minutes consumed (Nebius)
  stripe_revenue_cents BIGINT DEFAULT 0,      -- gross revenue passed through Stripe
  billed_at       TIMESTAMPTZ,                -- when the operator was charged for this slice
  status          TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'billed' | 'comped' | 'error'
  user_id         TEXT,                       -- end user who triggered the call
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata        JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_traffic_ledger_operator ON traffic_ledger(operator_id);
CREATE INDEX IF NOT EXISTS idx_traffic_ledger_connector ON traffic_ledger(connector);
CREATE INDEX IF NOT EXISTS idx_traffic_ledger_status ON traffic_ledger(status);
CREATE INDEX IF NOT EXISTS idx_traffic_ledger_created ON traffic_ledger(created_at DESC);

-- Convenience view: operator daily volume
CREATE OR REPLACE VIEW traffic_ledger_daily AS
SELECT
  operator_id,
  connector,
  date_trunc('day', created_at) AS day,
  SUM(call_count) AS calls,
  SUM(ai_minutes) AS ai_minutes_total,
  SUM(stripe_revenue_cents) AS revenue_cents,
  COUNT(*) FILTER (WHERE status = 'billed') AS billed_events,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_events,
  COUNT(*) FILTER (WHERE status = 'error') AS error_events
FROM traffic_ledger
GROUP BY operator_id, connector, date_trunc('day', created_at);

-- Iron Sharpens Iron — Proverbs 27:17
