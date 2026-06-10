#!/usr/bin/env julia
# AthlynXAI connector-health sweep in Julia.
# This script checks connector configuration presence without printing secret values.
# It is intended for cloud-computer cron, CI diagnostics, or operator proof logs.

using Dates

struct ConnectorRule
    id::String
    label::String
    tier::String
    lane::String
    owner_account::String
    required_env::Vector{String}
    any_env::Vector{String}
    oauth_proof_required::Bool
    recovery_action::String
end

rules = ConnectorRule[
    ConnectorRule("github", "GitHub Source Control", "critical", "deployment", "chaddozier75@gmail.com / AthlyXAI", String[], ["GITHUB_TOKEN", "GH_TOKEN"], true, "Reconnect GitHub OAuth; do not switch repositories."),
    ConnectorRule("vercel", "Vercel Production", "critical", "deployment", "AthlynxChad / chaddozier75-cmd", String[], ["VERCEL_TOKEN", "VERCEL_PROJECT_ID"], true, "Reconnect Vercel or fix commit identity; deploy only athlynx-platform."),
    ConnectorRule("sentry", "Sentry Monitoring", "critical", "monitoring", "AthlynXAI monitoring lane", ["SENTRY_DSN"], String[], false, "Restore SENTRY_DSN in Vercel env; never commit DSN secrets."),
    ConnectorRule("nebius", "Nebius AI / H200 Compute", "critical", "athlynxai", "cdozier14@athlynx.ai", ["NEBIUS_API_KEY"], String[], false, "Restore Nebius key through secure environment management."),
    ConnectorRule("openai", "OpenAI Compute", "high", "athlynxai", "AthlynXAI business lane", ["OPENAI_API_KEY"], String[], false, "Restore OpenAI key through secure environment management."),
    ConnectorRule("gemini", "Google Gemini", "high", "athlynxai", "Google AI lane", String[], ["GEMINI_API_KEY", "GOOGLE_AI_API_KEY"], false, "Restore Gemini key through secure environment management."),
    ConnectorRule("anthropic", "Anthropic Claude", "high", "athlynxai", "AthlynXAI business lane", ["ANTHROPIC_API_KEY"], String[], false, "Restore Anthropic key through secure environment management."),
    ConnectorRule("stripe", "Stripe Payments", "critical", "payments", "AthlynXAI payments lane", ["STRIPE_SECRET_KEY"], String[], false, "Restore Stripe key through secure environment management."),
    ConnectorRule("database", "Runtime Database", "critical", "database", "Vercel runtime DATABASE_URL", String[], ["DATABASE_URL", "POSTGRES_URL"], false, "Restore runtime DB env through Vercel; never infer from console names."),
    ConnectorRule("supabase", "Supabase Realtime / Storage", "high", "storage", "Realtime/storage rail", ["SUPABASE_URL", "SUPABASE_KEY"], String[], false, "Restore Supabase env through secure environment management."),
    ConnectorRule("buffer", "Buffer Social Queue", "high", "social", "Approved social connector lane", ["BUFFER_ACCESS_TOKEN"], String[], false, "Reconnect Buffer OAuth/token; never post while identity is uncertain."),
    ConnectorRule("gmail_workspace", "Google Workspace / Gmail", "critical", "owner", "Correct business-context mailbox", String[], String[], true, "Run read-only same-session OAuth proof; stop on browser/connector mismatch."),
]

present(key::String)::Bool = haskey(ENV, key) && length(strip(ENV[key])) > 0

function json_escape(s::String)::String
    return replace(s, "\\" => "\\\\", "\"" => "\\\"", "\n" => "\\n")
end

function json_array(items::Vector{String})::String
    return "[" * join(["\"$(json_escape(i))\"" for i in items], ",") * "]"
end

function evaluate(rule::ConnectorRule)
    missing = String[]
    for key in rule.required_env
        if !present(key)
            push!(missing, key)
        end
    end
    if length(rule.any_env) > 0 && !any(present, rule.any_env)
        append!(missing, rule.any_env)
    end
    configured = length(missing) == 0
    status = "ok"
    reason = "Required secure configuration proof is present."
    if rule.oauth_proof_required
        status = "manual_review"
        reason = "Requires same-session OAuth/connector capability proof; env presence is not enough."
    elseif !configured
        status = rule.tier == "critical" ? "blocked" : "degraded"
        reason = "Missing secure configuration proof: " * join(missing, " or ")
    end
    return Dict(
        "id" => rule.id,
        "label" => rule.label,
        "tier" => rule.tier,
        "lane" => rule.lane,
        "owner_account" => rule.owner_account,
        "required_env_count" => length(rule.required_env),
        "any_env_count" => length(rule.any_env),
        "missing_env" => missing,
        "configured" => configured,
        "status" => status,
        "reason" => reason,
        "ok" => status == "ok" || status == "manual_review",
        "recovery_action" => rule.recovery_action,
    )
end

function print_payload()
    connectors = [evaluate(rule) for rule in rules]
    total = length(connectors)
    ok_count = count(c -> c["status"] == "ok", connectors)
    manual_count = count(c -> c["status"] == "manual_review", connectors)
    degraded_count = count(c -> c["status"] == "degraded", connectors)
    blocked_count = count(c -> c["status"] == "blocked", connectors)
    critical_blocked = count(c -> c["tier"] == "critical" && c["status"] == "blocked", connectors)
    println("{")
    println("  \"generated_at\": \"$(Dates.format(now(UTC), dateformat"yyyy-mm-ddTHH:MM:SS.sssZ"))\",")
    println("  \"ok\": $(critical_blocked == 0),")
    println("  \"summary\": {\"total\": $total, \"ok\": $ok_count, \"manual_review\": $manual_count, \"degraded\": $degraded_count, \"blocked\": $blocked_count, \"critical_blocked\": $critical_blocked},")
    println("  \"doctrine\": {\"production_repo\": \"AthlyXAI/Athlynx-V2-Official\", \"production_vercel_project\": \"chad-a-doziers-projects/athlynx-platform\", \"secret_rule\": \"Never print or store plaintext passwords, tokens, cookies, private keys, or .env values.\"},")
    println("  \"connectors\": [")
    for (i, c) in enumerate(connectors)
        comma = i == length(connectors) ? "" : ","
        println("    {\"id\": \"$(json_escape(c["id"]))\", \"label\": \"$(json_escape(c["label"]))\", \"tier\": \"$(json_escape(c["tier"]))\", \"lane\": \"$(json_escape(c["lane"]))\", \"owner_account\": \"$(json_escape(c["owner_account"]))\", \"missing_env\": $(json_array(c["missing_env"])), \"configured\": $(c["configured"]), \"status\": \"$(json_escape(c["status"]))\", \"reason\": \"$(json_escape(c["reason"]))\", \"ok\": $(c["ok"]), \"recovery_action\": \"$(json_escape(c["recovery_action"]))\"}$comma")
    end
    println("  ]")
    println("}")
    return critical_blocked == 0 ? 0 : 2
end

exit(print_payload())
