"""
Athlynx Engagement Summary — Python (Build 4).

Summarizes channel engagement across scheduled_posts + connected_accounts.
Prints a JSON snapshot per user.
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone

try:
    import psycopg
except ImportError as e:  # pragma: no cover
    raise SystemExit("psycopg not installed.") from e


def summarize(database_url: str) -> dict:
    with psycopg.connect(database_url) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT user_id,
                       COUNT(*) FILTER (WHERE status = 'posted')     AS posted,
                       COUNT(*) FILTER (WHERE status = 'queued')     AS queued,
                       COUNT(*) FILTER (WHERE status = 'preempted')  AS preempted,
                       COUNT(*) FILTER (WHERE status = 'failed')     AS failed
                FROM scheduled_posts
                GROUP BY user_id
                ORDER BY posted DESC
                """
            )
            rows = cur.fetchall()
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "users": [
            {
                "user_id": int(r[0]),
                "posted": int(r[1]),
                "queued": int(r[2]),
                "preempted": int(r[3]),
                "failed": int(r[4]),
            }
            for r in rows
        ],
    }


if __name__ == "__main__":
    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url:
        raise SystemExit("DATABASE_URL not set")
    print(json.dumps(summarize(db_url), indent=2))
