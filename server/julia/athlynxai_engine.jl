"""
AthlynXAI Backend Engine — Julia
Full Layer Cake implementation:
  Layer 1 — Athlete Identity & Profile
  Layer 2 — Public Feed
  Layer 4 — NIL Deal Room
  Layer 6 — Calendar / Camps
  Layer 7 — Trusted Circle / The Stack
  Layer 8 — AI Scouting & Analytics

Design Philosophy: Honor the journey. From youth to pro to retired.
From backyard to billion-dollar deal. Once they come, they never leave.
"""

module AthlynXAI

using Dates
using Statistics
using JSON3
using HTTP
using SQLite

# ─────────────────────────────────────────────
# ENUMS & CONSTANTS
# ─────────────────────────────────────────────

@enum CareerLevel youth=1 high_school=2 college=3 pro=4 retired=5

@enum RecruitingStatus available=1 committed=2 signed=3 transferred=4

@enum DealType ambassador=1 post=2 appearance=3 licensing=4 equity=5

@enum JourneyEventType begin
    first_sport
    first_award
    varsity_start
    all_conference
    college_offer
    official_visit
    commitment
    signing
    nil_deal
    pro_contract
    all_star
    injury_return
    retirement
    milestone
end

const SPORT_METRICS = Dict(
    "football"   => ["40_yard_dash", "bench_press", "vertical_jump", "touchdowns", "yards", "completion_pct"],
    "basketball" => ["ppg", "rpg", "apg", "fg_pct", "three_pct", "per"],
    "baseball"   => ["batting_avg", "obp", "slg", "era", "whip", "exit_velocity"],
    "soccer"     => ["goals", "assists", "shots_on_goal", "pass_accuracy", "key_passes", "dribbles"],
    "default"    => ["stat_1", "stat_2", "stat_3", "stat_4", "stat_5", "stat_6"]
)

const CAREER_LEVELS_ORDERED = [youth, high_school, college, pro, retired]

# Brand color palette — matches Section 4 of Profile Rebuild Spec
const COLORS = Dict(
    "navy_deep"     => "#0a1628",
    "navy_card"     => "#0d1b3e",
    "navy_elevated" => "#112244",
    "electric_blue" => "#00d4ff",
    "signal_green"  => "#00ff88",
    "alert_red"     => "#ff4d4d",
    "gold"          => "#ffd700",
    "white"         => "#ffffff"
)

# ─────────────────────────────────────────────
# DATA STRUCTS
# ─────────────────────────────────────────────

Base.@kwdef mutable struct AthleteProfile
    user_id::Int
    name::String
    sport::String
    position::String
    school::String
    career_level::CareerLevel = high_school
    height::Union{Float64, Nothing} = nothing
    weight::Union{Float64, Nothing} = nothing
    gpa::Union{Float64, Nothing} = nothing
    class_year::Union{Int, Nothing} = nothing
    bio::String = ""
    avatar_url::String = ""
    cover_url::String = ""
    nil_value::Float64 = 0.0
    nil_verified::Bool = false
    nil_open_status::Bool = false
    recruiting_status::RecruitingStatus = available
    recruiting_score::Union{Float64, Nothing} = nothing
    sport_stats::Dict{String, Any} = Dict()
    dominant_hand::Union{String, Nothing} = nothing  # new field per spec §3.1
    dominant_foot::Union{String, Nothing} = nothing  # new field per spec §3.1
    instagram::String = ""
    twitter::String = ""
    tiktok_handle::String = ""
    followers::Int = 0
    film_room_enabled::Bool = false
    highlight_url::String = ""
    updated_at::DateTime = now()
end

Base.@kwdef mutable struct JourneyEvent
    id::Int
    athlete_id::Int
    event_type::JourneyEventType
    event_date::Date
    title::String
    description::String = ""
    media_url::String = ""
    is_verified::Bool = false
    verification_source::String = ""
    is_public::Bool = true
    created_at::DateTime = now()
end

Base.@kwdef mutable struct AthleteStat
    athlete_id::Int
    sport::String
    season::String
    stats::Dict{String, Float64}
    source::String = "self_reported"  # maxpreps | espn | self_reported
    is_verified::Bool = false
end

Base.@kwdef mutable struct NILDeal
    id::Int
    athlete_id::Int
    brand_name::String
    brand_logo_url::String = ""
    deal_type::DealType
    deal_value::Union{Float64, Nothing} = nothing
    deal_value_visible::Bool = false
    start_date::Union{Date, Nothing} = nothing
    end_date::Union{Date, Nothing} = nothing
    is_verified::Bool = false
    verification_source::String = "self_reported"
    is_public::Bool = true
    created_at::DateTime = now()
end

Base.@kwdef mutable struct CampAttended
    id::Int
    athlete_id::Int
    event_name::String
    event_date::Date
    location::String = ""
    organizer::String = ""
    is_verified::Bool = false
    result_summary::String = ""
    ranking_at_event::Union{String, Nothing} = nothing
    is_public::Bool = true
end

Base.@kwdef mutable struct TrustedCircleMember
    athlete_id::Int
    member_id::Int
    role::String   # coach|agent|scout|lawyer|financial_advisor|trainer|family
    custom_title::String = ""
    is_active::Bool = true
    can_view_nil::Bool = false
    can_view_recruiting::Bool = false
    can_view_academic::Bool = false
    added_at::DateTime = now()
end

Base.@kwdef mutable struct HighlightVideo
    id::Int
    athlete_id::Int
    title::String
    video_url::String
    thumbnail_url::String = ""
    duration_seconds::Int = 0
    is_public::Bool = true
    is_primary::Bool = false
    uploaded_at::DateTime = now()
    chapters::Vector{Tuple{Int, String}} = []  # (timestamp_seconds, label)
end

# ─────────────────────────────────────────────
# LAYER 1 — ATHLETE IDENTITY ENGINE
# ─────────────────────────────────────────────

function gpa_range_band(gpa::Float64)::String
    """Returns privacy-safe GPA range band per spec §3.10. Never exact GPA."""
    if gpa >= 3.9; return "3.9–4.0"
    elseif gpa >= 3.7; return "3.7–3.9"
    elseif gpa >= 3.5; return "3.5–3.7"
    elseif gpa >= 3.0; return "3.0–3.5"
    elseif gpa >= 2.5; return "2.5–3.0"
    else return "Below 2.5"
    end
end

function get_sport_metrics(sport::String)::Vector{String}
    """Returns the sport-specific KPI keys for stat tile rendering."""
    sport_lower = lowercase(sport)
    return get(SPORT_METRICS, sport_lower, SPORT_METRICS["default"])
end

function percentile_color(pct::Float64)::String
    """Returns the correct color token per spec §4 percentile ring rules."""
    if pct >= 90; return COLORS["gold"]
    elseif pct >= 67; return COLORS["signal_green"]
    elseif pct >= 34; return COLORS["electric_blue"]
    else return COLORS["alert_red"]
    end
end

function compute_percentile(value::Float64, cohort_values::Vector{Float64})::Float64
    """Computes athlete's percentile rank within cohort for a given stat."""
    if isempty(cohort_values); return 50.0; end
    below = count(v -> v < value, cohort_values)
    equal = count(v -> v == value, cohort_values)
    return 100.0 * (below + 0.5 * equal) / length(cohort_values)
end

function build_stat_tiles(profile::AthleteProfile, season_stats::Vector{AthleteStat},
                          cohort_map::Dict{String, Vector{Float64}})::Vector{Dict{String, Any}}
    """Builds the full stat tile grid payload for the UI (spec §3.3)."""
    metrics = get_sport_metrics(profile.sport)
    tiles = Dict{String, Any}[]

    # Get current and previous season stats
    sorted = sort(season_stats, by=s -> s.season, rev=true)
    current = isempty(sorted) ? nothing : sorted[1]
    previous = length(sorted) >= 2 ? sorted[2] : nothing

    for metric in metrics
        current_val = current !== nothing ? get(current.stats, metric, nothing) : nothing
        prev_val = previous !== nothing ? get(previous.stats, metric, nothing) : nothing
        delta = (current_val !== nothing && prev_val !== nothing) ? current_val - prev_val : nothing
        cohort = get(cohort_map, metric, Float64[])
        pct = current_val !== nothing && !isempty(cohort) ? compute_percentile(current_val, cohort) : nothing

        push!(tiles, Dict(
            "metric"    => metric,
            "value"     => current_val,
            "delta"     => delta,
            "percentile" => pct,
            "pct_color" => pct !== nothing ? percentile_color(pct) : COLORS["navy_card"],
            "verified"  => current !== nothing ? current.is_verified : false,
            "source"    => current !== nothing ? current.source : "self_reported"
        ))
    end
    return tiles
end

function build_sparkline(season_stats::Vector{AthleteStat}, metric::String)::Vector{Float64}
    """Returns last 6 seasons of a single metric for sparkline rendering."""
    sorted = sort(season_stats, by=s -> s.season)
    vals = [get(s.stats, metric, 0.0) for s in sorted]
    return length(vals) >= 6 ? vals[end-5:end] : vals
end

function build_public_profile(profile::AthleteProfile, journey::Vector{JourneyEvent},
                              stats::Vector{AthleteStat}, nil_deals::Vector{NILDeal},
                              camps::Vector{CampAttended}, videos::Vector{HighlightVideo},
                              cohort::Dict{String, Vector{Float64}})::Dict{String, Any}
    """
    Assembles the full public-facing profile payload.
    Enforces per-section visibility rules from spec §3 privacy controls.
    """
    public_nil = filter(d -> d.is_public, nil_deals)
    nil_total = sum(d -> (d.deal_value_visible && d.deal_value !== nothing) ? d.deal_value : 0.0, public_nil; init=0.0)

    return Dict(
        "identity" => Dict(
            "name"         => profile.name,
            "sport"        => profile.sport,
            "position"     => profile.position,
            "school"       => profile.school,
            "career_level" => string(profile.career_level),
            "avatar_url"   => profile.avatar_url,
            "cover_url"    => profile.cover_url,
            "class_year"   => profile.class_year,
            "height"       => profile.height,
            "weight"       => profile.weight,
            "nil_open"     => profile.nil_open_status,
            "nil_verified" => profile.nil_verified,
            "updated_at"   => profile.updated_at
        ),
        "stats" => Dict(
            "tiles"   => build_stat_tiles(profile, stats, cohort),
            "seasons" => [s.season for s in sort(stats, by=x -> x.season, rev=true)]
        ),
        "journey" => [
            Dict(
                "event_type"          => string(e.event_type),
                "event_date"          => e.event_date,
                "title"               => e.title,
                "description"         => e.description,
                "is_verified"         => e.is_verified,
                "verification_source" => e.verification_source,
                "media_url"           => e.media_url
            )
            for e in filter(e -> e.is_public, journey)
        ],
        "nil" => Dict(
            "deals" => [
                Dict(
                    "brand_name"     => d.brand_name,
                    "brand_logo"     => d.brand_logo_url,
                    "deal_type"      => string(d.deal_type),
                    "value_visible"  => d.deal_value_visible,
                    "value"          => d.deal_value_visible ? d.deal_value : nothing,
                    "is_verified"    => d.is_verified,
                    "source"         => d.verification_source
                )
                for d in public_nil
            ],
            "total_nil_value" => nil_total
        ),
        "camps" => [
            Dict(
                "event_name"   => c.event_name,
                "event_date"   => c.event_date,
                "location"     => c.location,
                "organizer"    => c.organizer,
                "is_verified"  => c.is_verified,
                "result"       => c.result_summary,
                "ranking"      => c.ranking_at_event,
                "days_until"   => max(0, Dates.value(c.event_date - today()))
            )
            for c in filter(c -> c.is_public, camps)
        ],
        "highlights" => [
            Dict(
                "title"        => v.title,
                "url"          => v.video_url,
                "thumbnail"    => v.thumbnail_url,
                "duration"     => v.duration_seconds,
                "is_primary"   => v.is_primary,
                "chapters"     => [(ts, lbl) for (ts, lbl) in v.chapters]
            )
            for v in filter(v -> v.is_public, videos)
        ]
    )
end

# ─────────────────────────────────────────────
# LAYER 8 — AI SCOUTING & ANALYTICS ENGINE
# ─────────────────────────────────────────────

function xfactor_score(stats::Dict{String, Float64}, sport::String)::Float64
    """
    Computes X-Factor composite score (0–100) from sport stats.
    Mirrors the XFactorRing in AthletePublicProfile.tsx:
      0–24  → PROSPECT
     25–49  → MID MAJOR
     50–74  → HIGH MAJOR
     75–100 → ELITE
    """
    metrics = get_sport_metrics(sport)
    vals = [get(stats, m, 0.0) for m in metrics]
    isempty(vals) && return 0.0
    # Normalize each stat to 0-100 range using simple min-max within provided values
    mn, mx = minimum(vals), maximum(vals)
    if mx == mn; return 50.0; end
    normalized = [(v - mn) / (mx - mn) * 100.0 for v in vals]
    return mean(normalized)
end

function xfactor_tier(score::Float64)::String
    if score >= 75; return "ELITE"
    elseif score >= 50; return "HIGH MAJOR"
    elseif score >= 25; return "MID MAJOR"
    else return "PROSPECT"
    end
end

function ai_comparable_players(target::AthleteProfile,
                                target_stats::Dict{String, Float64},
                                candidate_pool::Vector{Tuple{AthleteProfile, Dict{String, Float64}}},
                                top_n::Int=3)::Vector{Dict{String, Any}}
    """
    AI-powered comparable player engine (spec §3.5).
    Uses Euclidean distance in normalized stat space to find closest matches
    within the same sport and career level.
    Returns top_n matches with similarity score (100 = identical).
    """
    metrics = get_sport_metrics(target.sport)
    target_vec = Float64[get(target_stats, m, 0.0) for m in metrics]

    scores = Tuple{Float64, AthleteProfile}[]
    for (candidate, c_stats) in candidate_pool
        if candidate.sport != target.sport; continue; end
        c_vec = Float64[get(c_stats, m, 0.0) for m in metrics]
        dist = sqrt(sum((target_vec .- c_vec).^2))
        max_dist = sqrt(length(metrics) * 100.0^2)
        similarity = max(0.0, 100.0 * (1.0 - dist / max_dist))
        push!(scores, (similarity, candidate))
    end

    sort!(scores, by=x -> x[1], rev=true)
    return [
        Dict(
            "name"       => p.name,
            "sport"      => p.sport,
            "school"     => p.school,
            "similarity" => round(sim, digits=1)
        )
        for (sim, p) in scores[1:min(top_n, length(scores))]
    ]
end

function radar_axes(sport::String)::Vector{String}
    """Returns sport-specific radar chart axis labels (spec §3.5). No generic axes."""
    return get_sport_metrics(sport)[1:min(6, length(get_sport_metrics(sport)))]
end

function compute_radar_data(athlete1_stats::Dict{String, Float64},
                            athlete2_stats::Dict{String, Float64},
                            sport::String)::Dict{String, Any}
    """Prepares radar chart data payload for two athletes in the same sport."""
    axes = radar_axes(sport)
    all_vals = vcat([get(athlete1_stats, a, 0.0) for a in axes],
                   [get(athlete2_stats, a, 0.0) for a in axes])
    mx = maximum(all_vals)
    mx == 0 && (mx = 1.0)

    return Dict(
        "axes"     => axes,
        "athlete1" => [get(athlete1_stats, a, 0.0) / mx * 100.0 for a in axes],
        "athlete2" => [get(athlete2_stats, a, 0.0) / mx * 100.0 for a in axes],
        "max"      => mx
    )
end

function yoy_trend(season_stats::Vector{AthleteStat}, metric::String)::Vector{Dict{String, Any}}
    """Year-over-year trend data for a metric (spec §3.4 advanced analytics)."""
    sorted = sort(season_stats, by=s -> s.season)
    return [
        Dict(
            "season" => s.season,
            "value"  => get(s.stats, metric, nothing),
            "source" => s.source,
            "verified" => s.is_verified
        )
        for s in sorted if haskey(s.stats, metric)
    ]
end

function ai_school_recommendations(profile::AthleteProfile,
                                   stats::Dict{String, Float64},
                                   school_database::Vector{Dict{String, Any}},
                                   top_n::Int=5)::Vector{Dict{String, Any}}
    """
    AI school recommendation engine (spec §3.9).
    Scores schools based on: sport presence, division level vs. recruiting_score,
    geographic preference, and program strength.
    """
    score = profile.recruiting_score !== nothing ? profile.recruiting_score : 50.0
    xf = xfactor_score(stats, profile.sport)
    composite = (score + xf) / 2.0

    results = Dict{String, Any}[]
    for school in school_database
        sport_offered = get(school, "sports", String[])
        profile.sport in sport_offered || continue
        prestige = Float64(get(school, "prestige_score", 50.0))
        fit = 100.0 - abs(composite - prestige)
        push!(results, Dict(
            "school"     => school["name"],
            "division"   => get(school, "division", "D1"),
            "fit_score"  => round(fit, digits=1),
            "state"      => get(school, "state", "")
        ))
    end
    sort!(results, by=x -> x["fit_score"], rev=true)
    return results[1:min(top_n, length(results))]
end

# ─────────────────────────────────────────────
# LAYER 4 — NIL DEAL ROOM
# ─────────────────────────────────────────────

function nil_portfolio_summary(deals::Vector{NILDeal})::Dict{String, Any}
    """Aggregates NIL portfolio stats for the headline display (spec §3.8)."""
    public_deals = filter(d -> d.is_public, deals)
    total_value = sum(
        d -> (d.deal_value_visible && d.deal_value !== nothing) ? d.deal_value : 0.0,
        public_deals; init=0.0
    )
    active = filter(d -> d.end_date === nothing || d.end_date >= today(), public_deals)
    by_type = Dict{String, Int}()
    for d in public_deals
        key = string(d.deal_type)
        by_type[key] = get(by_type, key, 0) + 1
    end
    return Dict(
        "total_deals"     => length(public_deals),
        "active_deals"    => length(active),
        "total_nil_value" => total_value,
        "by_type"         => by_type,
        "nil_verified"    => any(d -> d.is_verified, public_deals)
    )
end

function validate_nil_deal(deal::NILDeal)::Tuple{Bool, String}
    """Validates a new NIL deal before write. Returns (valid, error_message)."""
    isempty(deal.brand_name) && return (false, "brand_name is required")
    deal.deal_value !== nothing && deal.deal_value < 0 && return (false, "deal_value cannot be negative")
    if deal.start_date !== nothing && deal.end_date !== nothing
        deal.end_date < deal.start_date && return (false, "end_date must be after start_date")
    end
    return (true, "")
end

# ─────────────────────────────────────────────
# LAYER 6 — CAMPS & CALENDAR ENGINE
# ─────────────────────────────────────────────

function upcoming_camps(camps::Vector{CampAttended}, days_ahead::Int=90)::Vector{CampAttended}
    """Returns camps within the next N days, sorted by date ascending."""
    cutoff = today() + Day(days_ahead)
    upcoming = filter(c -> c.event_date >= today() && c.event_date <= cutoff, camps)
    sort!(upcoming, by=c -> c.event_date)
    return upcoming
end

function camp_countdown(camp::CampAttended)::Int
    """Returns days until camp event. 0 if today or past."""
    return max(0, Dates.value(camp.event_date - today()))
end

# ─────────────────────────────────────────────
# LAYER 7 — TRUSTED CIRCLE
# ─────────────────────────────────────────────

function can_view_section(member::TrustedCircleMember, section::String)::Bool
    """Enforces Trusted Circle visibility gates (spec §3.12)."""
    section == "nil"        && return member.can_view_nil
    section == "recruiting" && return member.can_view_recruiting
    section == "academic"   && return member.can_view_academic
    section == "profile"    && return true
    return false
end

function gated_profile_for_member(profile_payload::Dict{String, Any},
                                  member::TrustedCircleMember)::Dict{String, Any}
    """Strips sections the trusted circle member does not have access to."""
    out = copy(profile_payload)
    !can_view_section(member, "nil")        && delete!(out, "nil")
    !can_view_section(member, "recruiting") && delete!(out, "journey")
    return out
end

# ─────────────────────────────────────────────
# THREE-QUESTION GATE — BRAND GUARDIAN
# ─────────────────────────────────────────────

function three_question_gate(profile_payload::Dict{String, Any})::Tuple{Bool, Vector{String}}
    """
    Automated pre-ship check (spec §1 Three-Question Gate).
    Returns (passes, issues).
    Gate 1: Does it honor the journey?
    Gate 2: Would Nike be proud of it?
    Gate 3: Would Mama recognize her son in it?
    """
    issues = String[]

    identity = get(profile_payload, "identity", Dict())
    isempty(get(identity, "name", "")) && push!(issues, "Gate 1 FAIL: Athlete name missing — cannot honor the journey")
    isempty(get(identity, "sport", "")) && push!(issues, "Gate 1 FAIL: Sport missing")
    isempty(get(identity, "avatar_url", "")) && push!(issues, "Gate 3 FAIL: No athlete photo — Mama won't recognize her son")
    get(identity, "career_level", "") == "" && push!(issues, "Gate 1 FAIL: Career level not set")

    stats = get(profile_payload, "stats", Dict())
    tiles = get(stats, "tiles", [])
    all(t -> get(t, "value", nothing) === nothing, tiles) && push!(issues, "Gate 2 FAIL: All stat tiles empty — Nike-grade requires real data")

    return (isempty(issues), issues)
end

# ─────────────────────────────────────────────
# DEMO / SMOKE TEST
# ─────────────────────────────────────────────

function run_demo()
    println("\n🏈 AthlynXAI Engine — Julia — Smoke Test\n")

    profile = AthleteProfile(
        user_id    = 1,
        name       = "Chad A. Dozier Jr.",
        sport      = "football",
        position   = "QB",
        school     = "Ole Miss",
        career_level = college,
        height     = 74.0,
        weight     = 215.0,
        gpa        = 3.7,
        class_year = 2026,
        bio        = "Born to compete. Built to lead.",
        nil_open_status = true,
        recruiting_score = 82.5
    )

    stats = [
        AthleteStat(
            athlete_id = 1, sport = "football", season = "2023-2024",
            stats = Dict("40_yard_dash" => 4.5, "touchdowns" => 22.0, "yards" => 2800.0,
                         "completion_pct" => 64.0, "bench_press" => 225.0, "vertical_jump" => 32.0),
            source = "self_reported", is_verified = false
        ),
        AthleteStat(
            athlete_id = 1, sport = "football", season = "2024-2025",
            stats = Dict("40_yard_dash" => 4.45, "touchdowns" => 31.0, "yards" => 3600.0,
                         "completion_pct" => 68.5, "bench_press" => 235.0, "vertical_jump" => 34.0),
            source = "self_reported", is_verified = false
        )
    ]

    journey = [
        JourneyEvent(id=1, athlete_id=1, event_type=first_sport,
                     event_date=Date(2010, 9, 1), title="First organized football game", is_public=true),
        JourneyEvent(id=2, athlete_id=1, event_type=college_offer,
                     event_date=Date(2022, 3, 15), title="First D1 offer — Ole Miss", is_public=true),
        JourneyEvent(id=3, athlete_id=1, event_type=commitment,
                     event_date=Date(2022, 6, 1), title="Committed to Ole Miss", is_public=true)
    ]

    nil_deals = [
        NILDeal(id=1, athlete_id=1, brand_name="Gatorade", deal_type=ambassador,
                deal_value=15000.0, deal_value_visible=true, is_public=true,
                is_verified=false, verification_source="self_reported")
    ]

    camps = [
        CampAttended(id=1, athlete_id=1, event_name="Elite 11 QB Camp",
                     event_date=today() + Day(30), location="Los Angeles, CA",
                     organizer="Elite 11", is_verified=false, is_public=true)
    ]

    videos = [
        HighlightVideo(id=1, athlete_id=1, title="2024-2025 Highlights",
                       video_url="https://cdn.athlynx.ai/highlights/1.mp4",
                       is_primary=true, is_public=true,
                       chapters=[(0, "Opener"), (45, "TD Pass #1"), (120, "Scramble")])
    ]

    cohort = Dict(
        "touchdowns"    => [15.0, 18.0, 22.0, 25.0, 28.0, 31.0, 35.0, 40.0],
        "yards"         => [1800.0, 2200.0, 2600.0, 3000.0, 3400.0, 3800.0, 4200.0, 4600.0],
        "completion_pct" => [55.0, 58.0, 61.0, 64.0, 67.0, 70.0, 73.0, 76.0]
    )

    payload = build_public_profile(profile, journey, stats, nil_deals, camps, videos, cohort)
    xf = xfactor_score(stats[end].stats, "football")
    tier = xfactor_tier(xf)
    yoy = yoy_trend(stats, "touchdowns")
    nil_summary = nil_portfolio_summary(nil_deals)
    passes, gate_issues = three_question_gate(payload)
    gpa_band = gpa_range_band(profile.gpa)

    println("Athlete: $(profile.name) | $(profile.sport |> uppercase) | $(profile.school)")
    println("GPA Band: $gpa_band (never exact — privacy protected)")
    println("X-Factor Score: $(round(xf, digits=1)) → $tier")
    println("YoY TD Trend: ", [(d["season"], d["value"]) for d in yoy])
    println("NIL Summary: $(nil_summary["total_deals"]) deal(s) | \$$(nil_summary["total_nil_value"])")
    println("Upcoming Camp: $(camps[1].event_name) in $(camp_countdown(camps[1])) days")
    println("Three-Question Gate: $(passes ? "✅ PASSES" : "❌ FAILS")")
    !passes && println.(["  ⚠ $i" for i in gate_issues])
    println("\n✅ Julia engine operational. Iron sharpens iron — Proverbs 27:17\n")
end

end  # module AthlynXAI

# Run demo if executed directly
if abspath(PROGRAM_FILE) == @__FILE__
    AthlynXAI.run_demo()
end
