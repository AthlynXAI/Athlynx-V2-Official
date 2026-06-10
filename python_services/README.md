# Athlynx Python Services

Build 4 layer — Python services for forecasting and analytics.

Locked by Chad A Dozier, Master Admin, on 2026-05-11:
> "All in Julia & Python & any new add it."

## Modules

- `forecast/revenue.py` — Monthly revenue forecast from `stripe_invoices_mirror`.
- `analytics/engagement.py` — Engagement summary from `scheduled_posts` + `connected_accounts`.

## Run locally

```bash
cd python_services
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m forecast.revenue
```

## Production wiring

Python services are not bundled with Vercel. They run separately and write back into Neon via `DATABASE_URL`. The Node server reads forecasts from `analytics_forecasts` (when created in a future migration).

Iron sharpens iron — Proverbs 27:17.
