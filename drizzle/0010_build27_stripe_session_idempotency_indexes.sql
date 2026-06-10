-- Build 27: Stripe webhook idempotency hardening
-- Purpose: prevent duplicate Stripe Checkout Session processing at the database layer.
-- Safety: partial unique indexes allow NULL stripeSessionId values for non-Stripe/manual credit movements.

CREATE UNIQUE INDEX IF NOT EXISTS credit_transactions_stripe_session_id_unique_idx
  ON credit_transactions ("stripeSessionId")
  WHERE "stripeSessionId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS credit_package_purchases_stripe_session_id_unique_idx
  ON credit_package_purchases ("stripeSessionId")
  WHERE "stripeSessionId" IS NOT NULL;
