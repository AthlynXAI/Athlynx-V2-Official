"""
Athlynx Revenue Forecast — Python (Build 4).
Owner: Chad A Dozier (Master Admin).

Reads paid invoices from stripe_invoices_mirror, builds a monthly
revenue series, and projects three months forward using simple
exponential smoothing. Prints a JSON summary; can be wired into a
future analytics_forecasts table.
"""
from __future__ import annotations

import json
import os
from collections import defaultdict
from datetime import datetime, timezone
from typing import Dict, List, Tuple

try:
    import psycopg
except ImportError as e:  # pragma: no cover
    raise SystemExit(
        "psycopg not installed. Run: pip install -r requirements.txt"
    ) from e


def fetch_monthly_revenue(database_url: str) -> List[Tuple[str, int]]:
    """Return [(YYYY-MM, cents), ...] ascending by month."""
    with psycopg.connect(database_url) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT to_char(paid_at, 'YYYY-MM') AS month,
                       COALESCE(SUM(amount_paid_cents), 0)::bigint
                FROM stripe_invoices_mirror
                WHERE status = 'paid' AND paid_at IS NOT NULL
                GROUP BY 1
                ORDER BY 1 ASC
                """
            )
            rows = cur.fetchall()
    return [(r[0], int(r[1])) for r in rows]


def exp_smooth(values: List[float], alpha: float = 0.5) -> List[float]:
    """Classic exponential smoothing. Returns the smoothed series."""
    if not values:
        return []
    smoothed = [values[0]]
    for v in values[1:]:
        smoothed.append(alpha * v + (1.0 - alpha) * smoothed[-1])
    return smoothed


def forecast(values: List[float], horizon: int = 3, alpha: float = 0.5) -> List[float]:
    if not values:
        return [0.0] * horizon
    smoothed = exp_smooth(values, alpha=alpha)
    last = smoothed[-1]
    return [last] * horizon


def main() -> None:
    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url:
        raise SystemExit("DATABASE_URL not set")

    series = fetch_monthly_revenue(db_url)
    values = [float(c) for _, c in series]
    fc = forecast(values, horizon=3, alpha=0.5)

    payload = {
        "history": [{"month": m, "cents": c} for m, c in series],
        "forecast_cents_next_3_months": [round(x) for x in fc],
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "note": "Iron Sharpens Iron — Proverbs 27:17",
    }
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
