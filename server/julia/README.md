# AthlynXAI — Julia Backend Engine

## Overview
This is the Julia implementation of the AthlynXAI Layer Cake backend engine.
It mirrors the Python implementation in `../python/athlynxai_engine.py` and
covers all layers of the AthlynXAI platform architecture.

## Layers Implemented
| Layer | Name | Status |
|-------|------|--------|
| Layer 1 | Athlete Identity & Profile | ✅ |
| Layer 2 | Public Feed (payload assembly) | ✅ |
| Layer 4 | NIL Deal Room | ✅ |
| Layer 6 | Camps & Calendar | ✅ |
| Layer 7 | Trusted Circle / The Stack | ✅ |
| Layer 8 | AI Scouting & Analytics | ✅ |

## Key Functions

### Layer 1 — Identity
- `gpa_range_band(gpa)` — Privacy-safe GPA display per spec §3.10
- `get_sport_metrics(sport)` — Sport-specific KPI keys for stat tiles
- `percentile_color(pct)` — Brand color for percentile rings
- `compute_percentile(value, cohort)` — Cohort ranking engine
- `build_stat_tiles(profile, stats, cohort)` — Full stat grid payload
- `build_public_profile(...)` — Full public profile payload assembler

### Layer 8 — AI Scouting
- `xfactor_score(stats, sport)` — X-Factor composite (0–100)
- `xfactor_tier(score)` — PROSPECT / MID MAJOR / HIGH MAJOR / ELITE
- `ai_comparable_players(...)` — Euclidean-distance comparable finder
- `compute_radar_data(...)` — Radar chart payload for two athletes
- `yoy_trend(stats, metric)` — Year-over-year trend data
- `ai_school_recommendations(...)` — AI school fit scoring

### Layer 4 — NIL
- `nil_portfolio_summary(deals)` — Portfolio aggregate stats
- `validate_nil_deal(deal)` — Pre-write validation

### Brand Guardian
- `three_question_gate(payload)` — Automated pre-ship brand check
  - Gate 1: Does it honor the journey?
  - Gate 2: Would Nike be proud of it?
  - Gate 3: Would Mama recognize her son in it?

## Usage
```julia
using Pkg
Pkg.add(["JSON3", "HTTP", "SQLite"])

include("athlynxai_engine.jl")
AthlynXAI.run_demo()
```

## Design Notes
- All color tokens match the `ATHLETE_PROFILE_REBUILD_SPEC.md` §4 palette
- Sport metrics match the 6-metric-per-sport system in `AthletePublicProfile.tsx`
- GPA is **never** returned as exact — always as a range band
- Privacy gates are enforced at the data layer, not just the UI layer
- Percentile rings: <34th = alert-red, 34-66 = electric-blue, 67-89 = signal-green, 90+ = gold

---
*Iron Sharpens Iron — Proverbs 27:17*  
*Attitude of Gratitude · To God Be the Glory · Always*
