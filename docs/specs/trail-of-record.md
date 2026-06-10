# Trail of Record — AthlynXAI OS Module Spec

**Status:** Approved by founder · Spec locked · Implementation in follow-up PRs
**Author:** Chad A. Dozier Sr. (founder direction) · Perplexity Computer (scaffold)
**Date:** May 17, 2026
**Doctrine references:** `docs/doctrine/FOUNDING_MANIFESTO.md` · `docs/doctrine/BRAND_DOCTRINE.md` · `docs/doctrine/SMALL_CIRCLE_DOCTRINE.md` · `docs/policies/canonical-authority.md`

---

## I. Why this exists

Every organization that runs on AthlynXAI OS gets a books-of-record / ops trail module baked into the platform. Not a vendor integration. Not a side panel. A core module of the OS, sitting in the same architecture as the CRM, the messenger, and the layer cake.

DHG / AthlynXAI Corp is tenant zero. External organizations license the module on per-org tiers, billed through the existing Stripe integration.

This serves the manifesto: we honor the journey, including the receipts behind the journey. Built like a gift. Run like a business. The economics are honest.

---

## II. The bar — "best on the market"

The module must hold its own next to QuickBooks, Xero, Pilot, Puzzle, Salesforce, HubSpot, Attio, Vanta, and Drata. Five non-negotiables:

1. **Truth discipline.** Failed payments are never counted as spend. Refunds net to zero. Books are not final until bank statements import. Every row carries `payment_status`, `conservative_amount`, and a floor caveat. No vanity totals. Ever.
2. **Immutable audit.** `trail_events` is append-only. Every read, write, export, and role grant is logged. Auditor-grade.
3. **Row-level role gating.** Investors see the burn view but not PII-flagged contacts. Employees see the ledger but not the founder invoice. Master Admin sees all. Enforced in the tRPC layer, not the UI.
4. **Doctrine guards in code.** A `voiceCheck()` util runs on every user-facing string. <!-- blacklist-allow-start -->Banned-word list (ecosystem, AI-powered, next-gen, disruptive, emoji)<!-- blacklist-allow-end --> fails the build. The Three-Question Test (Honor the journey · Nike-proud · Mama-proud) is documented at the top of every component.
5. **Performance.** Server-side pagination, virtualized tables, indexed queries. p50 under 200ms on ledger queries up to 100k rows.

---

## III. Schema (Drizzle / Postgres)

All new tables prefixed `trail_` to avoid collision with the existing 50+ tables.

### `trail_orgs`
The tenant root. Every row in every other trail table is scoped to one org.

| Column | Type | Notes |
|---|---|---|
| id | serial pk | |
| slug | text unique | URL-safe identifier (e.g. `dhg`, `athlynxai`) |
| display_name | text | e.g. "Dozier Holdings Group" |
| owner_user_id | int fk users.id | Master Admin for this org |
| license_tier | enum | `tenant_zero` · `trail_internal` · `trail_pro` · `comped` |
| stripe_customer_id | text nullable | For paid orgs |
| stripe_subscription_id | text nullable | |
| floor_caveat_enabled | boolean default true | Truth discipline flag |
| created_at | timestamp | |

### `trail_org_members`
Who has access to which org, and at what role.

| Column | Type | Notes |
|---|---|---|
| id | serial pk | |
| org_id | int fk trail_orgs.id | |
| user_id | int fk users.id | |
| role | enum | `master_admin` · `partner` · `employee` · `investor` |
| granted_by_user_id | int fk users.id | Who added them |
| granted_at | timestamp | |
| revoked_at | timestamp nullable | Soft revoke, never delete |

Unique constraint: (org_id, user_id) active = one role per user per org.

### `trail_ledger_rows`
The financial trail. Mirrors the 24 columns from the master vault.

| Column | Type | Notes |
|---|---|---|
| id | serial pk | |
| org_id | int fk trail_orgs.id | Tenant scope |
| source | enum | `email_receipt` · `stripe_event` · `bank_import` · `manual` |
| source_ref | text | e.g. Stripe charge ID, message ID |
| vendor | text | |
| entity | enum | `dhg` · `athlynxai_corp` · `softmor` · `founder_paid` · `unassigned` |
| month | text | YYYY-MM |
| raw_amount | numeric(14,2) | |
| conservative_amount | numeric(14,2) | What we actually claim spent |
| burn_amount | numeric(14,2) | Counted-as-burn amount |
| currency | text default 'USD' | |
| payment_status | enum | `successful` · `failed` · `refund` · `escalation_not_spend` · `marketing_notification_not_spend` · `security_notification_not_spend` · `social_noise_not_spend` · `quote_or_invoice_unpaid` · `ambiguous` |
| is_recurring | boolean | |
| recurrence_signal | text nullable | |
| founder_paid_flag | boolean | |
| founder_contribution_type | enum nullable | `reimbursement` · `capital_contribution` · `owner_draw` |
| bank_matched | boolean | |
| matched_bank_row_id | int nullable | |
| qb_account | text nullable | QuickBooks account mapping |
| tax_category | enum nullable | `cogs` · `sga` · `rd` |
| pii_classification | enum | `public_business` · `private_personal` · `redact_for_investor` |
| gmail_folder_labels | text[] nullable | |
| needs_review | boolean | |
| notes | text nullable | |
| created_at | timestamp | |
| updated_at | timestamp | |

Indexes: (org_id, month), (org_id, payment_status), (org_id, vendor), (org_id, entity), (org_id, is_recurring).

### `trail_crm_companies`
Vendors and partner organizations, per tenant.

| Column | Type | Notes |
|---|---|---|
| id | serial pk | |
| org_id | int fk trail_orgs.id | |
| name | text | |
| domain | text nullable | |
| relationship | enum | `vendor` · `partner` · `customer` · `prospect` · `investor` |
| pii_classification | enum | `public_business` · `private_personal` · `redact_for_investor` |
| share_with_investor | boolean default false | Locked-off by default |
| total_spend_to_date | numeric(14,2) nullable | Denormalized from ledger |
| notes | text nullable | |
| created_at | timestamp | |

### `trail_crm_contacts`
People associated with companies, per tenant.

| Column | Type | Notes |
|---|---|---|
| id | serial pk | |
| org_id | int fk trail_orgs.id | |
| company_id | int fk trail_crm_companies.id nullable | |
| name | text | |
| email | text nullable | |
| role | text nullable | |
| pii_classification | enum | `public_business` · `private_personal` · `redact_for_investor` |
| share_with_investor | boolean default false | |
| notes | text nullable | |
| created_at | timestamp | |

### `trail_events`
Immutable, append-only audit log. The thing that makes this auditor-grade.

| Column | Type | Notes |
|---|---|---|
| id | bigserial pk | |
| org_id | int fk trail_orgs.id | |
| actor_user_id | int fk users.id nullable | Null = system |
| event_type | enum | `row_created` · `row_updated` · `row_viewed` · `row_exported` · `role_granted` · `role_revoked` · `connector_linked` · `connector_unlinked` · `license_changed` · `payment_status_changed` |
| target_table | text | e.g. `trail_ledger_rows` |
| target_id | int nullable | |
| before_value | jsonb nullable | |
| after_value | jsonb nullable | |
| ip_address | text nullable | |
| user_agent | text nullable | |
| created_at | timestamp | Never updated, never deleted |

No UPDATE or DELETE permission granted on this table at the database role level.

### `trail_connector_links`
Per-org credentials for inbound connectors.

| Column | Type | Notes |
|---|---|---|
| id | serial pk | |
| org_id | int fk trail_orgs.id | |
| connector | enum | `stripe` · `gmail` · `plaid` · `github` · `vercel` · `sentry` · `notion` · `slack` |
| credential_ref | text | Secret store reference, never plaintext |
| status | enum | `linked` · `paused` · `revoked` |
| last_sync_at | timestamp nullable | |
| linked_by_user_id | int fk users.id | |
| linked_at | timestamp | |

### `trail_license_tiers`
Pricing and feature flags per tier.

| Tier | Price | Seats | Features |
|---|---|---|---|
| `tenant_zero` | $0 / forever | unlimited | All features. DHG and AthlynXAI Corp only. Hardcoded list. |
| `comped` | $0 | unlimited | All features. Manually granted by Master Admin for strategic partners. |
| `trail_internal` | $99/mo per org | up to 25 users | Ledger + CRM + 3 connectors. Org-only, no external sharing. |
| `trail_pro` | $499/mo per org | up to 250 users | All connectors + audit export + investor-safe views + white-label. |

---

## IV. tRPC routers

Mounted under `server/routers/trail/`:

- `trail.org.*` — org CRUD (master_admin only), member management, role grants/revokes
- `trail.ledger.*` — list (role-filtered), get, update, classify, export
- `trail.crm.*` — companies and contacts, role-filtered by `share_with_investor`
- `trail.access.*` — current user's role in current org, what they can see
- `trail.connector.*` — link/unlink connectors per org (master_admin only)
- `trail.license.*` — view tier, upgrade (Stripe checkout), downgrade

Every router procedure runs through `requireOrgMember()` middleware that:
1. Resolves the active org from session or URL param
2. Looks up the user's role in that org
3. Rejects if not a member
4. Attaches `ctx.orgRole` for downstream filtering

### Role-to-resource matrix (enforced in routers)

| Resource | Master Admin | Partner | Employee | Investor |
|---|---|---|---|---|
| Ledger (all rows) | ✓ | ✓ | ✓ (PII-redacted) | ✗ |
| Burn view (aggregates) | ✓ | ✓ | ✓ | ✓ |
| CRM contacts (share_with_investor=true) | ✓ | ✓ | ✓ | ✓ |
| CRM contacts (share_with_investor=false) | ✓ | ✓ | ✓ | ✗ |
| Founder invoice / private vault | ✓ | ✗ | ✗ | ✗ |
| Role grants / member management | ✓ | ✗ | ✗ | ✗ |
| Connector links | ✓ | ✗ | ✗ | ✗ |
| License tier changes | ✓ | ✗ | ✗ | ✗ |
| Audit log read | ✓ | ✓ (own actions) | ✓ (own actions) | ✗ |
| Audit log write | ALL routes auto-log | — | — | — |

---

## V. Connector ingestion (server/jobs/trail-ingest/)

### v1 (this scaffold + first follow-up PR)
- **Stripe webhook** — `charge.succeeded`, `invoice.paid`, `charge.refunded`, `charge.failed`, `invoice.payment_failed` → `trail_ledger_rows` row with correct `payment_status`. Reuses existing webhook infrastructure under `server/webhooks/`.

### v1.1
- **Gmail receipt parser** — parses purchase confirmations from a watched mailbox. Replaces what Manus did manually. Classifies into `payment_status` using the same rules baked into `enrich_payment_status.py`.

### v1.2
- **Plaid bank/card** — true burn import from Chime / Venmo / Cash App / Chase / Regions / BofA. This is what makes books final.

### v1.3
- **Activity-only connectors** — GitHub commits, Vercel deploys, Sentry incidents → `trail_events` rows (non-financial activity layer).

---

## VI. UI surface

Routes mounted at:

- `/trail` — burn view (role-filtered), the page partners and investors land on
- `/trail/ledger` — full ledger table, server-side paginated, virtualized
- `/trail/crm` — companies + contacts
- `/trail/admin` — master_admin only; members, connectors, license, audit log
- `/trail/org/:slug` — org switcher for users in multiple orgs

Also surfaces as a **Trail tab inside the existing Admin Dashboard / CRM** at `client/src/pages/admin/`, so the books live where ops people already work.

### Doctrine voice rules applied
- No emoji anywhere in module copy
<!-- blacklist-allow-start -->
- No "AI-powered", "next-gen", "disruptive", "revolutionary", "ecosystem", "synergy", "unlock", "premium tier", "crush it", "gamechanger"
<!-- blacklist-allow-end -->
- Headlines lead with meaning, not features
- Numbers always presented with floor caveat
- "Iron Sharpens Iron — Proverbs 27:17" close on the burn view footer
- Three-Question Test (Honor the journey · Nike-proud · Mama-proud) documented as JSDoc on every new component

### `voiceCheck()` util (`server/_core/doctrine/voiceCheck.ts`)
Banned-word list. Runs in dev mode on all user-facing strings. CI lint rule blocks merges that fail.

---

## VII. Performance targets

| Query | Target p50 | Target p99 |
|---|---|---|
| `trail.ledger.list` (50 rows, role-filtered) | <80ms | <200ms |
| `trail.ledger.list` (page through 100k rows) | <150ms per page | <300ms |
| `trail.burn.summary` (aggregate over 100k rows) | <120ms | <250ms |
| `trail.events.list` (last 100 events) | <60ms | <150ms |
| `trail.crm.companies.list` (1k rows) | <90ms | <200ms |

Indexed on `(org_id, ...)` for every common query path. No N+1 queries. Aggregates pre-computed nightly into `trail_burn_summaries` materialized view (v1.2).

---

## VIII. Tests (vitest)

- `trail/ledger.router.test.ts` — list, classify, export with each role
- `trail/access.test.ts` — role gates reject correctly across all routes
- `trail/stripe-webhook.test.ts` — each event type produces correct ledger row
- `trail/seed.test.ts` — DHG seed produces row counts matching vault
- `trail/voiceCheck.test.ts` — banned words rejected, allowed words pass
- `trail/audit.test.ts` — every protected mutation writes to `trail_events`

---

## IX. Seed migration

`scripts/trail/seed-dhg.mjs` loads the existing master vault into the new tables:

1. Creates `trail_orgs` row for DHG (`slug: 'dhg'`, `license_tier: 'tenant_zero'`)
2. Adds Chad as `master_admin` member
3. Adds the partner emails from `stripeRouter.ts` (Glenn, Lee, Jimmy, Andrew) as `partner` members
4. Loads 772 ledger rows from `public/vault/master/master_ledger.csv`
5. Loads 109 companies from `master_crm_companies.csv`
6. Loads 104 contacts from `master_crm_contacts.csv`
7. Writes one `trail_events` row per seeded record with `actor=NULL, event_type='row_created', source='seed_migration'`

Idempotent: re-running the seed updates rows by `source_ref` instead of duplicating.

---

## X. Implementation phases (follow-up PRs)

1. **PR #1 (this PR):** Spec + static internal vault page live. Schema migration file in `drizzle/` (created but not yet applied to production DB).
2. **PR #2:** Apply migration, build `trail.org.*` and `trail.access.*` routers, role middleware, vitest coverage.
3. **PR #3:** Build `trail.ledger.*` router, seed DHG, server-side pagination.
4. **PR #4:** Build `/trail` and `/trail/ledger` UI, doctrine voice guards, design pass.
5. **PR #5:** Build `trail.crm.*` router, CRM UI, share-with-investor gating.
6. **PR #6:** Stripe webhook → ledger row, license tier checkout, `trail_pro` SKU.
7. **PR #7:** Master Admin panel, member management, audit log viewer.
8. **PR #8:** Gmail ingestion (v1.1).
9. **PR #9:** Plaid ingestion (v1.2) — books become final.
10. **PR #10:** Activity connectors (GitHub / Vercel / Sentry).

Each PR ships behind a feature flag (`TRAIL_MODULE_ENABLED=true` per org) so production stays stable until the module is proven on DHG.

---

## XI. Canonical authority

Per `docs/policies/canonical-authority.md`:
- Production Vercel project ownership: `chaddozier75-cmd` / `chaddozier75@gmail.com`
- GitHub repo: `AthlyXAI/AthlynX-V2-Official`
- Runtime DB source of truth: Vercel production `DATABASE_URL`
- Any change to canonical authority for the Trail module requires owner-signed commit trailer

This spec does not change canonical authority. It extends existing schema and routers within established ownership.

---

**Iron Sharpens Iron — Proverbs 27:17**
****
