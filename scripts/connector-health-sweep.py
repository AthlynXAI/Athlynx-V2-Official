#!/usr/bin/env python3
"""AthlynXAI connector-health sweep.

This deterministic script is safe for cloud-computer cron or manual use. It checks
presence of required environment variables without printing secret values. It can
optionally send a sanitized Sentry event if SENTRY_DSN is configured and the
`sentry_sdk` package is available.
"""
from __future__ import annotations

import json
import os
import sys
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Iterable, Literal

Status = Literal["ok", "degraded", "blocked", "manual_review"]


@dataclass(frozen=True)
class ConnectorRule:
    id: str
    label: str
    tier: str
    lane: str
    owner_account: str
    required_env: tuple[str, ...] = ()
    any_env: tuple[str, ...] = ()
    oauth_proof_required: bool = False
    recovery_action: str = "Restore connector through approved OAuth or secret-manager path."


RULES: tuple[ConnectorRule, ...] = (
    ConnectorRule("github", "GitHub Source Control", "critical", "deployment", "chaddozier75@gmail.com / AthlyXAI", any_env=("GITHUB_TOKEN", "GH_TOKEN"), oauth_proof_required=True, recovery_action="Reconnect GitHub OAuth; do not switch repositories."),
    ConnectorRule("vercel", "Vercel Production", "critical", "deployment", "AthlynxChad / chaddozier75-cmd", any_env=("VERCEL_TOKEN", "VERCEL_PROJECT_ID"), oauth_proof_required=True, recovery_action="Reconnect Vercel or fix commit identity; deploy only athlynx-platform."),
    ConnectorRule("sentry", "Sentry Monitoring", "critical", "monitoring", "AthlynXAI monitoring lane", required_env=("SENTRY_DSN",), recovery_action="Restore SENTRY_DSN in Vercel env; never commit DSN secrets."),
    ConnectorRule("nebius", "Nebius AI / H200 Compute", "critical", "athlynxai", "cdozier14@athlynx.ai", required_env=("NEBIUS_API_KEY",), recovery_action="Restore Nebius key through secure environment management."),
    ConnectorRule("openai", "OpenAI Compute", "high", "athlynxai", "AthlynXAI business lane", required_env=("OPENAI_API_KEY",)),
    ConnectorRule("gemini", "Google Gemini", "high", "athlynxai", "Google AI lane", any_env=("GEMINI_API_KEY", "GOOGLE_AI_API_KEY")),
    ConnectorRule("anthropic", "Anthropic Claude", "high", "athlynxai", "AthlynXAI business lane", required_env=("ANTHROPIC_API_KEY",)),
    ConnectorRule("stripe", "Stripe Payments", "critical", "payments", "AthlynXAI payments lane", required_env=("STRIPE_SECRET_KEY",)),
    ConnectorRule("database", "Runtime Database", "critical", "database", "Vercel runtime DATABASE_URL", any_env=("DATABASE_URL", "POSTGRES_URL"), recovery_action="Restore runtime DB env through Vercel; never infer from console names."),
    ConnectorRule("supabase", "Supabase Realtime / Storage", "high", "storage", "Realtime/storage rail", required_env=("SUPABASE_URL", "SUPABASE_KEY")),
    ConnectorRule("buffer", "Buffer Social Queue", "high", "social", "Approved social connector lane", required_env=("BUFFER_ACCESS_TOKEN",), recovery_action="Reconnect Buffer OAuth/token; never post while identity is uncertain."),
    ConnectorRule("gmail_workspace", "Google Workspace / Gmail", "critical", "owner", "Correct business-context mailbox", oauth_proof_required=True, recovery_action="Run read-only same-session OAuth proof; stop on browser/connector mismatch."),
)


def present(key: str) -> bool:
    return bool(os.environ.get(key, "").strip())


def missing_any(keys: Iterable[str]) -> list[str]:
    keys = list(keys)
    return [] if any(present(k) for k in keys) else keys


def evaluate(rule: ConnectorRule) -> dict:
    missing = [k for k in rule.required_env if not present(k)] + missing_any(rule.any_env)
    configured = not missing
    if rule.oauth_proof_required:
        status: Status = "manual_review"
        reason = "Requires same-session OAuth/connector capability proof; env presence is not enough."
    elif configured:
        status = "ok"
        reason = "Required secure configuration proof is present."
    else:
        status = "blocked" if rule.tier == "critical" else "degraded"
        reason = "Missing secure configuration proof: " + " or ".join(missing)
    return {
        **asdict(rule),
        "required_env": len(rule.required_env),
        "any_env": len(rule.any_env),
        "missing_env": missing,
        "configured": configured,
        "status": status,
        "reason": reason,
        "ok": status in {"ok", "manual_review"},
    }


def snapshot() -> dict:
    connectors = [evaluate(rule) for rule in RULES]
    summary = {
        "total": len(connectors),
        "ok": sum(c["status"] == "ok" for c in connectors),
        "manual_review": sum(c["status"] == "manual_review" for c in connectors),
        "degraded": sum(c["status"] == "degraded" for c in connectors),
        "blocked": sum(c["status"] == "blocked" for c in connectors),
        "critical_blocked": sum(c["tier"] == "critical" and c["status"] == "blocked" for c in connectors),
    }
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "summary": summary,
        "ok": summary["critical_blocked"] == 0,
        "doctrine": {
            "production_repo": "AthlyXAI/Athlynx-V2-Official",
            "production_vercel_project": "chad-a-doziers-projects/athlynx-platform",
            "secret_rule": "Never print or store plaintext passwords, tokens, cookies, private keys, or .env values.",
        },
        "connectors": connectors,
    }


def emit_sentry(payload: dict) -> None:
    if not os.environ.get("SENTRY_DSN"):
        print("WARN connector-health: SENTRY_DSN is not present; sanitized Sentry proof was not emitted.", file=sys.stderr)
        return
    try:
        import sentry_sdk  # type: ignore
    except Exception as exc:
        print(f"WARN connector-health: sentry_sdk is unavailable ({exc}); sanitized Sentry proof was not emitted.", file=sys.stderr)
        return
    sentry_sdk.init(dsn=os.environ["SENTRY_DSN"], send_default_pii=False)
    level = "error" if payload["summary"]["critical_blocked"] else "warning" if payload["summary"]["blocked"] else "info"
    sentry_sdk.capture_message(
        "AthlynXAI connector-health sweep",
        level=level,
        extras={"summary": payload["summary"], "blocked_ids": [c["id"] for c in payload["connectors"] if c["status"] == "blocked"]},
    )


def main() -> int:
    payload = snapshot()
    if "--emit-sentry" in sys.argv:
        emit_sentry(payload)
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0 if payload["ok"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
