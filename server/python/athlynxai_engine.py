"""
AthlynXAI Backend Engine — Python
Full Layer Cake implementation:
  Layer 1 — Athlete Identity & Profile
  Layer 2 — Public Feed
  Layer 4 — NIL Deal Room
  Layer 6 — Calendar / Camps
  Layer 7 — Trusted Circle / The Stack
  Layer 8 — AI Scouting & Analytics

Design Philosophy: Honor the journey. From youth to pro to retired.
From backyard to billion-dollar deal. Once they come, they never leave.

Iron Sharpens Iron — Proverbs 27:17
Attitude of Gratitude · To God Be the Glory · Always
"""

from __future__ import annotations

import math
import json
from datetime import date, datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Any, Optional


# ─────────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────────

class CareerLevel(Enum):
    youth       = "youth"
    high_school = "hs"
    college     = "college"
    pro         = "pro"
    retired     = "retired"

class RecruitingStatus(Enum):
    available   = "available"
    committed   = "committed"
    signed      = "signed"
    transferred = "transferred"

class DealType(Enum):
    ambassador = "ambassador"
    post       = "post"
    appearance = "appearance"
    licensing  = "licensing"
    equity     = "equity"

class JourneyEventType(Enum):
    first_sport    = "first_sport"
    first_award    = "first_award"
    varsity_start  = "varsity_start"
    all_conference = "all_conference"
    college_offer  = "college_offer"
    official_visit = "official_visit"
    commitment     = "commitment"
    signing        = "signing"
    nil_deal       = "nil_deal"
    pro_contract   = "pro_contract"
    all_star       = "all_star"
    injury_return  = "injury_return"
    retirement     = "retirement"
    milestone      = "milestone"

class VerificationSource(Enum):
    maxpreps          = "maxpreps"
    espn              = "espn"
    on3               = "on3"
    rivals            = "rivals"
    stripe            = "stripe"
    brand_confirmation = "brand_confirmation"
    self_reported     = "self_reported"


# ─────────────────────────────────────────────
# BRAND CONSTANTS (spec §4)
# ─────────────────────────────────────────────

COLORS: dict[str, str] = {
    "navy_deep":     "#0a1628",
    "navy_card":     "#0d1b3e",
    "navy_elevated": "#112244",
    "electric_blue": "#00d4ff",
    "signal_green":  "#00ff88",
    "alert_red":     "#ff4d4d",
    "gold":          "#ffd700",
    "white":         "#ffffff",
}

SPORT_METRICS: dict[str, list[str]] = {
    "football":   ["40_yard_dash", "bench_press", "vertical_jump", "touchdowns", "yards", "completion_pct"],
    "basketball": ["ppg", "rpg", "apg", "fg_pct", "three_pct", "per"],
    "baseball":   ["batting_avg", "obp", "slg", "era", "whip", "exit_velocity"],
    "soccer":     ["goals", "assists", "shots_on_goal", "pass_accuracy", "key_passes", "dribbles"],
    "default":    ["stat_1", "stat_2", "stat_3", "stat_4", "stat_5", "stat_6"],
}


# ─────────────────────────────────────────────
# DATA CLASSES
# ─────────────────────────────────────────────

@dataclass
class AthleteProfile:
    user_id: int
    name: str
    sport: str
    position: str
    school: str
    career_level: CareerLevel          = CareerLevel.high_school
    height: Optional[float]            = None   # inches
    weight: Optional[float]            = None   # lbs
    gpa: Optional[float]               = None
    class_year: Optional[int]          = None
    bio: str                           = ""
    avatar_url: str                    = ""
    cover_url: str                     = ""
    nil_value: float                   = 0.0
    nil_verified: bool                 = False
    nil_open_status: bool              = False
    recruiting_status: RecruitingStatus = RecruitingStatus.available
    recruiting_score: Optional[float]  = None
    sport_stats: dict[str, Any]        = field(default_factory=dict)
    dominant_hand: Optional[str]       = None   # new field per spec §3.1
    dominant_foot: Optional[str]       = None   # new field per spec §3.1
    instagram: str                     = ""
    twitter: str                       = ""
    tiktok_handle: str                 = ""
    followers: int                     = 0
    film_room_enabled: bool            = False
    highlight_url: str                 = ""
    updated_at: datetime               = field(default_factory=datetime.utcnow)


@dataclass
class JourneyEvent:
    id: int
    athlete_id: int
    event_type: JourneyEventType
    event_date: date
    title: str
    description: str            = ""
    media_url: str              = ""
    is_verified: bool           = False
    verification_source: str    = ""
    is_public: bool             = True
    created_at: datetime        = field(default_factory=datetime.utcnow)


@dataclass
class AthleteStat:
    athlete_id: int
    sport: str
    season: str                     # e.g. "2024-2025"
    stats: dict[str, float]         = field(default_factory=dict)
    source: str                     = "self_reported"
    is_verified: bool               = False


@dataclass
class NILDeal:
    id: int
    athlete_id: int
    brand_name: str
    deal_type: DealType
    brand_logo_url: str             = ""
    deal_value: Optional[float]     = None
    deal_value_visible: bool        = False
    start_date: Optional[date]      = None
    end_date: Optional[date]        = None
    is_verified: bool               = False
    verification_source: str        = "self_reported"
    is_public: bool                 = True
    created_at: datetime            = field(default_factory=datetime.utcnow)


@dataclass
class CampAttended:
    id: int
    athlete_id: int
    event_name: str
    event_date: date
    location: str                   = ""
    organizer: str                  = ""
    is_verified: bool               = False
    result_summary: str             = ""
    ranking_at_event: Optional[str] = None
    is_public: bool                 = True


@dataclass
class TrustedCircleMember:
    athlete_id: int
    member_id: int
    role: str                       # coach|agent|scout|lawyer|financial_advisor|trainer|family
    custom_title: str               = ""
    is_active: bool                 = True
    can_view_nil: bool              = False
    can_view_recruiting: bool       = False
    can_view_academic: bool         = False
    added_at: datetime              = field(default_factory=datetime.utcnow)


@dataclass
class HighlightVideo:
    id: int
    athlete_id: int
    title: str
    video_url: str
    thumbnail_url: str              = ""
    duration_seconds: int           = 0
    is_public: bool                 = True
    is_primary: bool                = False
    uploaded_at: datetime           = field(default_factory=datetime.utcnow)
    chapters: list[tuple[int, str]] = field(default_factory=list)  # (timestamp, label)


# ─────────────────────────────────────────────
# LAYER 1 — ATHLETE IDENTITY ENGINE
# ─────────────────────────────────────────────

def get_sport_metrics(sport: str) -> list[str]:
    """Returns sport-specific KPI keys for stat tile rendering."""
    return SPORT_METRICS.get(sport.lower(), SPORT_METRICS["default"])


def gpa_range_band(gpa: float) -> str:
    """Returns privacy-safe GPA range band per spec §3.10. Never exact GPA."""
    if gpa >= 3.9:   return "3.9–4.0"
    elif gpa >= 3.7: return "3.7–3.9"
    elif gpa >= 3.5: return "3.5–3.7"
    elif gpa >= 3.0: return "3.0–3.5"
    elif gpa >= 2.5: return "2.5–3.0"
    else:            return "Below 2.5"


def percentile_color(pct: float) -> str:
    """Maps percentile to brand color token per spec §4."""
    if pct >= 90:   return COLORS["gold"]
    elif pct >= 67: return COLORS["signal_green"]
    elif pct >= 34: return COLORS["electric_blue"]
    else:           return COLORS["alert_red"]


def compute_percentile(value: float, cohort: list[float]) -> float:
    """Computes an athlete's percentile rank within their cohort."""
    if not cohort:
        return 50.0
    below = sum(1 for v in cohort if v < value)
    equal = sum(1 for v in cohort if v == value)
    return 100.0 * (below + 0.5 * equal) / len(cohort)


def build_sparkline(season_stats: list[AthleteStat], metric: str) -> list[float]:
    """Returns last 6 seasons of data for a metric sparkline."""
    sorted_stats = sorted(season_stats, key=lambda s: s.season)
    vals = [s.stats[metric] for s in sorted_stats if metric in s.stats]
    return vals[-6:] if len(vals) >= 6 else vals


def build_stat_tiles(
    profile: AthleteProfile,
    season_stats: list[AthleteStat],
    cohort_map: dict[str, list[float]],
) -> list[dict[str, Any]]:
    """Builds the full stat tile grid payload for the UI (spec §3.3)."""
    metrics = get_sport_metrics(profile.sport)
    sorted_stats = sorted(season_stats, key=lambda s: s.season, reverse=True)
    current = sorted_stats[0] if sorted_stats else None
    previous = sorted_stats[1] if len(sorted_stats) >= 2 else None
    tiles = []

    for metric in metrics:
        current_val  = current.stats.get(metric) if current else None
        prev_val     = previous.stats.get(metric) if previous else None
        delta        = (current_val - prev_val) if (current_val is not None and prev_val is not None) else None
        cohort       = cohort_map.get(metric, [])
        pct          = compute_percentile(current_val, cohort) if (current_val is not None and cohort) else None
        sparkline    = build_sparkline(season_stats, metric)

        tiles.append({
            "metric":     metric,
            "value":      current_val,
            "delta":      round(delta, 2) if delta is not None else None,
            "percentile": round(pct, 1) if pct is not None else None,
            "pct_color":  percentile_color(pct) if pct is not None else COLORS["navy_card"],
            "sparkline":  sparkline,
            "verified":   current.is_verified if current else False,
            "source":     current.source if current else "self_reported",
        })
    return tiles


def build_public_profile(
    profile: AthleteProfile,
    journey: list[JourneyEvent],
    stats: list[AthleteStat],
    nil_deals: list[NILDeal],
    camps: list[CampAttended],
    videos: list[HighlightVideo],
    cohort: dict[str, list[float]],
) -> dict[str, Any]:
    """
    Assembles the full public-facing profile payload.
    Enforces per-section visibility rules from spec §3 privacy controls.
    """
    public_nil = [d for d in nil_deals if d.is_public]
    nil_total  = sum(
        d.deal_value for d in public_nil
        if d.deal_value_visible and d.deal_value is not None
    )

    return {
        "identity": {
            "name":         profile.name,
            "sport":        profile.sport,
            "position":     profile.position,
            "school":       profile.school,
            "career_level": profile.career_level.value,
            "avatar_url":   profile.avatar_url,
            "cover_url":    profile.cover_url,
            "class_year":   profile.class_year,
            "height":       profile.height,
            "weight":       profile.weight,
            "nil_open":     profile.nil_open_status,
            "nil_verified": profile.nil_verified,
            "updated_at":   profile.updated_at.isoformat(),
        },
        "stats": {
            "tiles":   build_stat_tiles(profile, stats, cohort),
            "seasons": [s.season for s in sorted(stats, key=lambda x: x.season, reverse=True)],
        },
        "journey": [
            {
                "event_type":          e.event_type.value,
                "event_date":          e.event_date.isoformat(),
                "title":               e.title,
                "description":         e.description,
                "is_verified":         e.is_verified,
                "verification_source": e.verification_source,
                "media_url":           e.media_url,
            }
            for e in journey if e.is_public
        ],
        "nil": {
            "deals": [
                {
                    "brand_name":    d.brand_name,
                    "brand_logo":    d.brand_logo_url,
                    "deal_type":     d.deal_type.value,
                    "value_visible": d.deal_value_visible,
                    "value":         d.deal_value if d.deal_value_visible else None,
                    "is_verified":   d.is_verified,
                    "source":        d.verification_source,
                }
                for d in public_nil
            ],
            "total_nil_value": nil_total,
        },
        "camps": [
            {
                "event_name":  c.event_name,
                "event_date":  c.event_date.isoformat(),
                "location":    c.location,
                "organizer":   c.organizer,
                "is_verified": c.is_verified,
                "result":      c.result_summary,
                "ranking":     c.ranking_at_event,
                "days_until":  max(0, (c.event_date - date.today()).days),
            }
            for c in camps if c.is_public
        ],
        "highlights": [
            {
                "title":     v.title,
                "url":       v.video_url,
                "thumbnail": v.thumbnail_url,
                "duration":  v.duration_seconds,
                "is_primary": v.is_primary,
                "chapters":  [(ts, lbl) for ts, lbl in v.chapters],
            }
            for v in videos if v.is_public
        ],
    }


# ─────────────────────────────────────────────
# LAYER 8 — AI SCOUTING & ANALYTICS ENGINE
# ─────────────────────────────────────────────

def xfactor_score(stats: dict[str, float], sport: str) -> float:
    """
    Computes X-Factor composite score (0–100) from sport stats.
    Mirrors the XFactorRing in AthletePublicProfile.tsx.
      0–24  → PROSPECT
     25–49  → MID MAJOR
     50–74  → HIGH MAJOR
     75–100 → ELITE
    """
    metrics = get_sport_metrics(sport)
    vals = [stats.get(m, 0.0) for m in metrics]
    if not vals:
        return 0.0
    mn, mx = min(vals), max(vals)
    if mx == mn:
        return 50.0
    normalized = [(v - mn) / (mx - mn) * 100.0 for v in vals]
    return sum(normalized) / len(normalized)


def xfactor_tier(score: float) -> str:
    if score >= 75:   return "ELITE"
    elif score >= 50: return "HIGH MAJOR"
    elif score >= 25: return "MID MAJOR"
    else:             return "PROSPECT"


def ai_comparable_players(
    target: AthleteProfile,
    target_stats: dict[str, float],
    candidate_pool: list[tuple[AthleteProfile, dict[str, float]]],
    top_n: int = 3,
) -> list[dict[str, Any]]:
    """
    AI-powered comparable player engine (spec §3.5).
    Uses Euclidean distance in normalized stat space.
    Returns top_n matches with similarity score (100 = identical).
    """
    metrics = get_sport_metrics(target.sport)
    target_vec = [target_stats.get(m, 0.0) for m in metrics]
    max_dist = math.sqrt(len(metrics) * 100.0 ** 2)

    scores: list[tuple[float, AthleteProfile]] = []
    for candidate, c_stats in candidate_pool:
        if candidate.sport.lower() != target.sport.lower():
            continue
        c_vec = [c_stats.get(m, 0.0) for m in metrics]
        dist = math.sqrt(sum((a - b) ** 2 for a, b in zip(target_vec, c_vec)))
        similarity = max(0.0, 100.0 * (1.0 - dist / max_dist)) if max_dist > 0 else 0.0
        scores.append((similarity, candidate))

    scores.sort(key=lambda x: x[0], reverse=True)
    return [
        {
            "name":       p.name,
            "sport":      p.sport,
            "school":     p.school,
            "similarity": round(sim, 1),
        }
        for sim, p in scores[:top_n]
    ]


def radar_axes(sport: str) -> list[str]:
    """Returns sport-specific radar chart axis labels (spec §3.5). No generic axes."""
    return get_sport_metrics(sport)[:6]


def compute_radar_data(
    athlete1_stats: dict[str, float],
    athlete2_stats: dict[str, float],
    sport: str,
) -> dict[str, Any]:
    """Prepares radar chart data payload for two athletes in the same sport."""
    axes = radar_axes(sport)
    all_vals = [athlete1_stats.get(a, 0.0) for a in axes] + [athlete2_stats.get(a, 0.0) for a in axes]
    mx = max(all_vals) if all_vals else 1.0
    if mx == 0:
        mx = 1.0
    return {
        "axes":     axes,
        "athlete1": [round(athlete1_stats.get(a, 0.0) / mx * 100.0, 1) for a in axes],
        "athlete2": [round(athlete2_stats.get(a, 0.0) / mx * 100.0, 1) for a in axes],
        "max":      mx,
    }


def yoy_trend(season_stats: list[AthleteStat], metric: str) -> list[dict[str, Any]]:
    """Year-over-year trend data for a metric (spec §3.4 advanced analytics)."""
    sorted_stats = sorted(season_stats, key=lambda s: s.season)
    return [
        {
            "season":   s.season,
            "value":    s.stats[metric],
            "source":   s.source,
            "verified": s.is_verified,
        }
        for s in sorted_stats if metric in s.stats
    ]


def ai_school_recommendations(
    profile: AthleteProfile,
    stats: dict[str, float],
    school_database: list[dict[str, Any]],
    top_n: int = 5,
) -> list[dict[str, Any]]:
    """
    AI school recommendation engine (spec §3.9).
    Scores schools based on sport presence, division level vs. recruiting_score,
    geographic preference, and program strength.
    """
    score = profile.recruiting_score if profile.recruiting_score is not None else 50.0
    xf = xfactor_score(stats, profile.sport)
    composite = (score + xf) / 2.0

    results = []
    for school in school_database:
        if profile.sport.lower() not in [s.lower() for s in school.get("sports", [])]:
            continue
        prestige = float(school.get("prestige_score", 50.0))
        fit = 100.0 - abs(composite - prestige)
        results.append({
            "school":    school["name"],
            "division":  school.get("division", "D1"),
            "fit_score": round(fit, 1),
            "state":     school.get("state", ""),
        })

    results.sort(key=lambda x: x["fit_score"], reverse=True)
    return results[:top_n]


# ─────────────────────────────────────────────
# LAYER 4 — NIL DEAL ROOM
# ─────────────────────────────────────────────

def nil_portfolio_summary(deals: list[NILDeal]) -> dict[str, Any]:
    """Aggregates NIL portfolio stats for the headline display (spec §3.8)."""
    public = [d for d in deals if d.is_public]
    total_value = sum(
        d.deal_value for d in public
        if d.deal_value_visible and d.deal_value is not None
    )
    active = [d for d in public if d.end_date is None or d.end_date >= date.today()]
    by_type: dict[str, int] = {}
    for d in public:
        key = d.deal_type.value
        by_type[key] = by_type.get(key, 0) + 1

    return {
        "total_deals":     len(public),
        "active_deals":    len(active),
        "total_nil_value": total_value,
        "by_type":         by_type,
        "nil_verified":    any(d.is_verified for d in public),
    }


def validate_nil_deal(deal: NILDeal) -> tuple[bool, str]:
    """Validates a new NIL deal before write. Returns (valid, error_message)."""
    if not deal.brand_name.strip():
        return False, "brand_name is required"
    if deal.deal_value is not None and deal.deal_value < 0:
        return False, "deal_value cannot be negative"
    if deal.start_date and deal.end_date and deal.end_date < deal.start_date:
        return False, "end_date must be after start_date"
    return True, ""


# ─────────────────────────────────────────────
# LAYER 6 — CAMPS & CALENDAR ENGINE
# ─────────────────────────────────────────────

def upcoming_camps(camps: list[CampAttended], days_ahead: int = 90) -> list[CampAttended]:
    """Returns camps within the next N days, sorted by date ascending."""
    today = date.today()
    cutoff = today + timedelta(days=days_ahead)
    return sorted(
        [c for c in camps if today <= c.event_date <= cutoff],
        key=lambda c: c.event_date
    )


def camp_countdown(camp: CampAttended) -> int:
    """Returns days until camp event. 0 if today or past."""
    return max(0, (camp.event_date - date.today()).days)


# ─────────────────────────────────────────────
# LAYER 7 — TRUSTED CIRCLE
# ─────────────────────────────────────────────

def can_view_section(member: TrustedCircleMember, section: str) -> bool:
    """Enforces Trusted Circle visibility gates (spec §3.12)."""
    gates = {
        "nil":        member.can_view_nil,
        "recruiting": member.can_view_recruiting,
        "academic":   member.can_view_academic,
        "profile":    True,
    }
    return gates.get(section, False)


def gated_profile_for_member(
    profile_payload: dict[str, Any],
    member: TrustedCircleMember,
) -> dict[str, Any]:
    """Strips sections the trusted circle member does not have access to."""
    out = dict(profile_payload)
    if not can_view_section(member, "nil"):
        out.pop("nil", None)
    if not can_view_section(member, "recruiting"):
        out.pop("journey", None)
    return out


# ─────────────────────────────────────────────
# THREE-QUESTION GATE — BRAND GUARDIAN
# ─────────────────────────────────────────────

def three_question_gate(profile_payload: dict[str, Any]) -> tuple[bool, list[str]]:
    """
    Automated pre-ship check (spec §1 Three-Question Gate).
    Returns (passes, issues).
    Gate 1: Does it honor the journey?
    Gate 2: Would Nike be proud of it?
    Gate 3: Would Mama recognize her son in it?
    """
    issues: list[str] = []
    identity = profile_payload.get("identity", {})

    if not identity.get("name"):
        issues.append("Gate 1 FAIL: Athlete name missing — cannot honor the journey")
    if not identity.get("sport"):
        issues.append("Gate 1 FAIL: Sport missing")
    if not identity.get("avatar_url"):
        issues.append("Gate 3 FAIL: No athlete photo — Mama won't recognize her son")
    if not identity.get("career_level"):
        issues.append("Gate 1 FAIL: Career level not set")

    tiles = profile_payload.get("stats", {}).get("tiles", [])
    if tiles and all(t.get("value") is None for t in tiles):
        issues.append("Gate 2 FAIL: All stat tiles empty — Nike-grade requires real data")

    return (len(issues) == 0, issues)


# ─────────────────────────────────────────────
# DEMO / SMOKE TEST
# ─────────────────────────────────────────────

def run_demo() -> None:
    print("\n🏈 AthlynXAI Engine — Python — Smoke Test\n")

    profile = AthleteProfile(
        user_id          = 1,
        name             = "Chad A. Dozier Jr.",
        sport            = "football",
        position         = "QB",
        school           = "Ole Miss",
        career_level     = CareerLevel.college,
        height           = 74.0,
        weight           = 215.0,
        gpa              = 3.7,
        class_year       = 2026,
        bio              = "Born to compete. Built to lead.",
        nil_open_status  = True,
        recruiting_score = 82.5,
    )

    stats = [
        AthleteStat(
            athlete_id = 1, sport = "football", season = "2023-2024",
            stats = {
                "40_yard_dash": 4.5, "bench_press": 225.0, "vertical_jump": 32.0,
                "touchdowns": 22.0, "yards": 2800.0, "completion_pct": 64.0,
            },
            source = "self_reported", is_verified = False
        ),
        AthleteStat(
            athlete_id = 1, sport = "football", season = "2024-2025",
            stats = {
                "40_yard_dash": 4.45, "bench_press": 235.0, "vertical_jump": 34.0,
                "touchdowns": 31.0, "yards": 3600.0, "completion_pct": 68.5,
            },
            source = "self_reported", is_verified = False
        ),
    ]

    journey = [
        JourneyEvent(id=1, athlete_id=1, event_type=JourneyEventType.first_sport,
                     event_date=date(2010, 9, 1), title="First organized football game"),
        JourneyEvent(id=2, athlete_id=1, event_type=JourneyEventType.college_offer,
                     event_date=date(2022, 3, 15), title="First D1 offer — Ole Miss"),
        JourneyEvent(id=3, athlete_id=1, event_type=JourneyEventType.commitment,
                     event_date=date(2022, 6, 1), title="Committed to Ole Miss"),
    ]

    nil_deals = [
        NILDeal(id=1, athlete_id=1, brand_name="Gatorade", deal_type=DealType.ambassador,
                deal_value=15000.0, deal_value_visible=True, is_public=True,
                is_verified=False, verification_source="self_reported")
    ]

    camps = [
        CampAttended(id=1, athlete_id=1, event_name="Elite 11 QB Camp",
                     event_date=date.today() + timedelta(days=30),
                     location="Los Angeles, CA", organizer="Elite 11",
                     is_verified=False, is_public=True)
    ]

    videos = [
        HighlightVideo(id=1, athlete_id=1, title="2024-2025 Highlights",
                       video_url="https://cdn.athlynx.ai/highlights/1.mp4",
                       is_primary=True, is_public=True,
                       chapters=[(0, "Opener"), (45, "TD Pass #1"), (120, "Scramble")])
    ]

    cohort = {
        "touchdowns":     [15.0, 18.0, 22.0, 25.0, 28.0, 31.0, 35.0, 40.0],
        "yards":          [1800.0, 2200.0, 2600.0, 3000.0, 3400.0, 3800.0, 4200.0, 4600.0],
        "completion_pct": [55.0, 58.0, 61.0, 64.0, 67.0, 70.0, 73.0, 76.0],
    }

    payload   = build_public_profile(profile, journey, stats, nil_deals, camps, videos, cohort)
    xf        = xfactor_score(stats[-1].stats, "football")
    tier      = xfactor_tier(xf)
    yoy       = yoy_trend(stats, "touchdowns")
    nil_sum   = nil_portfolio_summary(nil_deals)
    passes, gate_issues = three_question_gate(payload)
    gpa_band  = gpa_range_band(profile.gpa)

    print(f"Athlete: {profile.name} | {profile.sport.upper()} | {profile.school}")
    print(f"GPA Band: {gpa_band} (never exact — privacy protected)")
    print(f"X-Factor Score: {xf:.1f} → {tier}")
    print(f"YoY TD Trend:   {[(d['season'], d['value']) for d in yoy]}")
    print(f"NIL Summary:    {nil_sum['total_deals']} deal(s) | ${nil_sum['total_nil_value']:,.0f}")
    print(f"Upcoming Camp:  {camps[0].event_name} in {camp_countdown(camps[0])} days")
    print(f"Three-Question Gate: {'✅ PASSES' if passes else '❌ FAILS'}")
    for issue in gate_issues:
        print(f"  ⚠ {issue}")
    print("\n✅ Python engine operational. Iron sharpens iron — Proverbs 27:17\n")


if __name__ == "__main__":
    run_demo()
