# Run: julia --project=. scripts/crm_score_all.jl
include("../src/crm_scoring.jl")
using .CrmScoring

db_url = get(ENV, "DATABASE_URL", "")
if isempty(db_url)
    error("DATABASE_URL not set")
end

n = CrmScoring.score_all_accounts(db_url)
println("Scored $n CRM accounts.")
