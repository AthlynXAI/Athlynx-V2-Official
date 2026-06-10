-- Build 51 — /api/auth/me audit log
-- Append-only structured log for every /api/auth/me request, used by
-- the Auth Audit Dashboard at /admin/audit/auth-me.
-- No raw cookies, headers, or tokens are stored — only sanitized flags.

CREATE TABLE IF NOT EXISTS auth_me_events (
  id                BIGSERIAL PRIMARY KEY,
  occurred_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status            INTEGER NOT NULL,                  -- 200 | 401
  route             TEXT NOT NULL DEFAULT '/api/auth/me',
  session_id        TEXT,                              -- hashed session id (sha256 prefix)
  user_id           INTEGER,                           -- present on 200s only
  user_email        TEXT,                              -- present on 200s only
  ip                TEXT,                              -- req.ip (trust proxy on)
  user_agent        TEXT,
  auth_provider     TEXT NOT NULL DEFAULT 'unknown',   -- supabase | nextauth | clerk | custom_jwt | none | unknown
  token_state       TEXT NOT NULL DEFAULT 'unknown',   -- missing | malformed | expired | invalid | valid | unknown
  failure_reason    TEXT,                              -- e.g. 'no_session_cookie' | 'jwt_expired' | 'jwt_invalid_signature'
  headers_present   JSONB NOT NULL DEFAULT '{}'::jsonb,-- { authorization:bool, cookie:bool, x_forwarded_for:bool, origin:bool, sb_access_token:bool, next_auth_session:bool, clerk_session:bool }
  origin            TEXT,
  referer           TEXT,
  is_logout_marker  BOOLEAN NOT NULL DEFAULT FALSE,    -- TRUE rows are written by the logout handler to signal an intentional session end
  metadata          JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS auth_me_events_occurred_at_idx ON auth_me_events (occurred_at DESC);
CREATE INDEX IF NOT EXISTS auth_me_events_status_idx       ON auth_me_events (status);
CREATE INDEX IF NOT EXISTS auth_me_events_session_idx      ON auth_me_events (session_id, occurred_at);
CREATE INDEX IF NOT EXISTS auth_me_events_provider_idx     ON auth_me_events (auth_provider);
CREATE INDEX IF NOT EXISTS auth_me_events_ip_idx           ON auth_me_events (ip);
