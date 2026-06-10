"""
Athlynx CRM Scoring — Julia
Build 4. Owner: Chad A Dozier.

Computes a 0–100 health score per CRM account based on:
  - deal recency (days since last activity)
  - pipeline value (weighted)
  - contact density (number of contacts)
  - stage progression
"""
module CrmScoring

using LibPQ, Dates, Statistics

export score_all_accounts, score_account

function score_account(deals_count::Int, last_activity_days::Real, weighted_value_cents::Real, contact_count::Int)::Int
    # Simple bounded composite score, 0–100.
    recency_factor = max(0.0, 1.0 - last_activity_days / 90.0)        # decays over 90 days
    value_factor   = min(1.0, log10(max(weighted_value_cents, 1.0) / 100.0) / 6.0)  # caps at ~ $1M
    deal_factor    = min(1.0, deals_count / 5.0)
    contact_factor = min(1.0, contact_count / 3.0)
    raw = 0.40 * recency_factor + 0.30 * value_factor + 0.15 * deal_factor + 0.15 * contact_factor
    return clamp(round(Int, raw * 100), 0, 100)
end

function score_all_accounts(database_url::String)
    conn = LibPQ.Connection(database_url)
    try
        rows = LibPQ.execute(conn, """
            SELECT a.id,
                   COUNT(d.id) AS deals_count,
                   COALESCE(MAX(EXTRACT(EPOCH FROM (now() - act.occurred_at)) / 86400), 365) AS last_activity_days,
                   COALESCE(SUM(d.amount_cents * d.probability / 100), 0) AS weighted_value_cents,
                   (SELECT COUNT(*) FROM crm_contacts c WHERE c.account_id = a.id) AS contact_count
            FROM crm_accounts a
            LEFT JOIN crm_deals d ON d.account_id = a.id
            LEFT JOIN crm_activities act ON act.account_id = a.id
            GROUP BY a.id
        """)

        updated = 0
        for row in rows
            id = row[1]
            score = score_account(
                Int(row[2]),
                Float64(row[3]),
                Float64(row[4]),
                Int(row[5])
            )
            LibPQ.execute(conn, """
                UPDATE crm_accounts SET health_score = \$1, updated_at = now() WHERE id = \$2
            """, [score, id])
            updated += 1
        end
        return updated
    finally
        close(conn)
    end
end

end # module
