# Athlynx Julia Services

Build 4 layer — Julia services for high-performance analytics, forecasting, and CRM scoring.

Locked by Chad A Dozier, Master Admin, on 2026-05-11:
> "All in Julia & Python & any new add it."

## Modules

- `crm_scoring.jl` — Account health scoring (logistic regression over deal stage, recency, contact density).
- `forecast.jl` — Monthly revenue forecast using exponential smoothing on stripe_invoices_mirror.
- `engagement.jl` — Engagement decay model: how warm is a contact?

## Run locally

```bash
cd julia
julia --project=. -e 'using Pkg; Pkg.instantiate()'
julia --project=. scripts/crm_score_all.jl
```

## Production wiring

Julia services are not bundled with Vercel. They run as a separate process and write into the same Neon DB (`empty-lake-01820888`) via env `DATABASE_URL`. The Node server reads the scored output from `crm_accounts.health_score` and `crm_contacts.engagement_score`.

This is the spine — not the surface. Iron sharpens iron.
