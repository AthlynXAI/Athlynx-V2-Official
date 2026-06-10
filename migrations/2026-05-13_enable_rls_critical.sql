-- ATHLYNX Build 25: Enable RLS on critical financial / auth / audit tables
-- Date: 2026-05-13
-- These tables hold sensitive data (financial, OAuth tokens, audit trail).
-- The server connects as neondb_owner which is a SUPERUSER / table owner and
-- bypasses RLS, so server-side queries continue to work unchanged.
-- This protects against accidental exposure if a non-owner role (e.g. Supabase
-- anon key, public read role) is ever pointed at these tables.

BEGIN;

-- Critical financial tables
ALTER TABLE public.credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Stripe mirrors (financial data)
ALTER TABLE public.stripe_customers_mirror ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_subscriptions_mirror ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_invoices_mirror ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_events_log ENABLE ROW LEVEL SECURITY;

-- Auth / audit
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- No permissive policies added: non-owner roles get zero access by default.
-- The server role (table owner) bypasses RLS and continues to function.

COMMIT;
