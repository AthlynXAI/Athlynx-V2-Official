#!/usr/bin/env python3
"""
AthlynXAI OS v1 — MCWS Super Regional Real-Time Score Updater
==============================================================
Polls ESPN's public API for live MCWS super regional scores every 5 minutes.
Writes results to client/src/data/superRegionalsData.ts and pushes to GitHub.
Vercel auto-deploys from main → athlynx.ai updates in ~60 seconds.

Deployed on: Chad Dozier's Cloud Computer (cloud-pc-6zoui4fe)
Cron: */5 10-24 5-9 6 * (every 5 min, 10AM–midnight CT, Jun 5–9)
Author: AthlynXAI OS v1 · AXN Streaming & Podcast Network
"""

import subprocess
import sys
import json
import re
import os
import logging
from datetime import datetime, timezone
from pathlib import Path

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "-q"])
    import requests

# ─── Config ────────────────────────────────────────────────────────────────────
REPO_DIR = Path("/home/ubuntu/athlynx-v2")
DATA_FILE = REPO_DIR / "client/src/data/superRegionalsData.ts"
LOG_FILE = Path("/home/ubuntu/mcws_updater.log")
ESPN_API = "https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard"

# Map ESPN team abbreviations → our display names
TEAM_MAP = {
    "UGA": "Georgia", "MSST": "Mississippi State", "MSU": "Mississippi State",
    "UNC": "North Carolina", "USC": "USC",
    "TEX": "Texas", "ORE": "Oregon",
    "AUB": "Auburn", "MISS": "Ole Miss", "OLEMISS": "Ole Miss",
    "KU": "Kansas", "OU": "Oklahoma",
    "WVU": "West Virginia", "CPOLY": "Cal Poly", "CAL POLY": "Cal Poly",
    "ALA": "Alabama", "SJU": "St. John's",
    "TROY": "Troy", "UALR": "Little Rock", "LR": "Little Rock",
}

# Super regional site → home team name
SITE_HOME = {
    "Athens": "Georgia",
    "Chapel Hill": "North Carolina",
    "Austin": "Texas",
    "Auburn": "Auburn",
    "Lawrence": "Kansas",
    "Morgantown": "West Virginia",
    "Tuscaloosa": "Alabama",
    "Troy": "Troy",
}

logging.basicConfig(
    filename=str(LOG_FILE),
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S UTC",
)
log = logging.getLogger("mcws_updater")


def fetch_scores():
    """Fetch live scoreboard from ESPN public API."""
    try:
        r = requests.get(ESPN_API, timeout=10, headers={"User-Agent": "AthlynXAI-OS/1.0"})
        r.raise_for_status()
        return r.json()
    except Exception as e:
        log.error(f"ESPN API fetch failed: {e}")
        return None


def normalize_team(name: str) -> str:
    """Normalize ESPN team name to our display name."""
    upper = name.upper().strip()
    for k, v in TEAM_MAP.items():
        if k in upper or upper in k:
            return v
    return name.strip()


def parse_games(espn_data: dict) -> dict:
    """
    Parse ESPN scoreboard into a dict keyed by (home_name, away_name).
    Returns: { (home, away): { status, homeScore, awayScore, inning, result } }
    """
    parsed = {}
    if not espn_data:
        return parsed
    events = espn_data.get("events", [])
    for event in events:
        comps = event.get("competitions", [{}])
        if not comps:
            continue
        comp = comps[0]
        competitors = comp.get("competitors", [])
        if len(competitors) < 2:
            continue

        home = next((c for c in competitors if c.get("homeAway") == "home"), competitors[0])
        away = next((c for c in competitors if c.get("homeAway") == "away"), competitors[1])

        home_name = normalize_team(home.get("team", {}).get("displayName", ""))
        away_name = normalize_team(away.get("team", {}).get("displayName", ""))
        home_score = home.get("score", "0")
        away_score = away.get("score", "0")

        status_obj = event.get("status", {})
        status_type = status_obj.get("type", {}).get("name", "STATUS_SCHEDULED")
        period = status_obj.get("period", 0)
        display_clock = status_obj.get("displayClock", "")
        status_detail = status_obj.get("type", {}).get("detail", "")

        if status_type == "STATUS_FINAL":
            status = "final"
            inning = "FINAL"
            result = f"{home_name} {home_score}, {away_name} {away_score}"
        elif status_type in ("STATUS_IN_PROGRESS", "STATUS_MIDDLE_PERIOD"):
            status = "live"
            inning = status_detail or f"Inning {period}"
            result = f"LIVE — {inning} · {away_score}-{home_score}"
        else:
            status = "scheduled"
            inning = None
            result = None

        try:
            home_score_int = int(home_score)
            away_score_int = int(away_score)
        except (ValueError, TypeError):
            home_score_int = 0
            away_score_int = 0

        parsed[(home_name, away_name)] = {
            "status": status,
            "homeScore": home_score_int,
            "awayScore": away_score_int,
            "inning": inning,
            "result": result,
        }
    return parsed


def read_current_data() -> str:
    return DATA_FILE.read_text(encoding="utf-8")


def build_series_score(site: str, games_data: list, scores: dict) -> tuple:
    """
    Given the current games list and fresh scores, compute series score string and status.
    Returns (seriesStatus, seriesScore, winner)
    """
    home_name = SITE_HOME.get(site, "")
    home_wins = 0
    away_wins = 0
    away_name = ""

    for g in games_data:
        if g.get("status") == "final":
            hs = g.get("homeScore", 0)
            aws = g.get("awayScore", 0)
            if not away_name:
                # Infer away name from result string
                pass
            if hs > aws:
                home_wins += 1
            elif aws > hs:
                away_wins += 1

    if home_wins == 2:
        return "complete", f"{home_name} wins series 2-{away_wins}", home_name
    if away_wins == 2:
        return "complete", f"Away wins series 2-{home_wins}", None
    if home_wins == 0 and away_wins == 0:
        return "not_started", "Series: Not Started", None
    return "in_progress", f"Series tied {home_wins}-{away_wins}" if home_wins == away_wins else (
        f"{home_name} leads {home_wins}-{away_wins}" if home_wins > away_wins else f"Away leads {away_wins}-{home_wins}"
    ), None


def update_data_file(scores: dict) -> bool:
    """
    Read superRegionalsData.ts, update game statuses/scores, write back.
    Returns True if any changes were made.
    """
    content = read_current_data()
    original = content

    # For each super regional, find games and update scores
    # We do targeted regex replacements on the status/score fields
    changed = False
    now_utc = datetime.now(timezone.utc).strftime("%b %d, %Y %H:%M UTC")

    for (home_name, away_name), game_info in scores.items():
        if game_info["status"] == "scheduled":
            continue  # Don't touch scheduled games

        status = game_info["status"]
        hs = game_info["homeScore"]
        aws = game_info["awayScore"]
        inning = game_info.get("inning", "")
        result = game_info.get("result", "")

        # Find game blocks that reference this home/away team pair
        # Pattern: look for blocks with both team names near each other
        # We update: status, homeScore, awayScore, inning, result fields

        # Build replacement patterns
        if status == "final":
            inning_str = f'"FINAL"'
            result_str = f'"{home_name} {hs}, {away_name} {aws}"'
            status_str = '"final"'
        else:
            inning_str = f'"{inning}"'
            result_str = f'"LIVE — {inning} · {aws}-{hs}"'
            status_str = '"live"'

        # Find game entries that match this matchup
        # Look for a game block containing both team names
        # Use a conservative approach: find the super regional block first

        # Match pattern for a game entry with status: "scheduled" that we need to update
        # Only update if we find the home team in the surrounding context
        pattern = (
            r'(gameNum:\s*1[^}]*?'
            + re.escape(home_name) + r'.*?'
            + r'status:\s*")[^"]*(")'
        )

        def make_replacer(s, hs_val, aws_val, inn, res):
            def replacer(m):
                nonlocal changed
                changed = True
                return m.group(1) + s + m.group(2)
            return replacer

        # Simpler approach: find the exact game block and replace status/scores
        # Look for game blocks where the surrounding super regional has our home team
        # Find all super regional blocks
        sr_pattern = re.compile(
            r'(site:\s*"[^"]+",\s*\n\s*home:\s*\{[^}]*name:\s*"' + re.escape(home_name) + r'"[^}]*\}.*?'
            r'games:\s*\[)(.*?)(\],?\s*\},)',
            re.DOTALL
        )

        def update_sr_block(m):
            nonlocal changed
            games_block = m.group(2)
            # Find game 1 block and update it
            game_pattern = re.compile(
                r'(gameNum:\s*1,.*?status:\s*)"[^"]*"(.*?)(homeScore:\s*)\d+(.*?)(awayScore:\s*)\d+',
                re.DOTALL
            )

            def update_game(gm):
                nonlocal changed
                new_block = (
                    gm.group(1) + f'"{status}"' +
                    gm.group(2) + gm.group(3) + str(hs) +
                    gm.group(4) + gm.group(5) + str(aws)
                )
                if new_block != gm.group(0):
                    changed = True
                return new_block

            new_games = game_pattern.sub(update_game, games_block)

            # Also update inning and result if present
            if inning:
                new_games = re.sub(r'(inning:\s*)"[^"]*"', f'\\1"{inning}"', new_games)
            if result:
                new_games = re.sub(r'(result:\s*)"[^"]*"', f'\\1"{result}"', new_games)

            return m.group(1) + new_games + m.group(3)

        new_content = sr_pattern.sub(update_sr_block, content)
        if new_content != content:
            content = new_content

    # Update the "Last updated" comment
    content = re.sub(
        r'(Last updated:)[^\n]*',
        f'\\1 {now_utc} — AthlynXAI OS v1 auto-update',
        content
    )

    if content != original:
        DATA_FILE.write_text(content, encoding="utf-8")
        log.info(f"Data file updated with {len(scores)} game(s)")
        return True
    else:
        log.info("No changes detected — data file unchanged")
        return False


def git_commit_push(scores: dict):
    """Commit and push the updated data file."""
    os.chdir(REPO_DIR)

    # ── Step 1: Stash any uncommitted changes so pull is clean ──────────────
    subprocess.run(["git", "stash"], capture_output=True)

    # ── Step 2: Pull + rebase to sync with remote BEFORE committing ─────────
    pull_result = subprocess.run(
        ["git", "pull", "--rebase", "origin", "main"],
        capture_output=True, text=True
    )
    if pull_result.returncode != 0:
        log.warning(f"Rebase pull had issues: {pull_result.stderr.strip()} — aborting rebase and hard-resetting to origin")
        subprocess.run(["git", "rebase", "--abort"], capture_output=True)
        subprocess.run(["git", "fetch", "origin"], capture_output=True)
        subprocess.run(["git", "reset", "--hard", "origin/main"], capture_output=True)
    else:
        log.info("Pull --rebase succeeded")

    # ── Step 3: Restore stashed changes ─────────────────────────────────────
    subprocess.run(["git", "stash", "pop"], capture_output=True)

    # ── Step 4: Stage the data file ─────────────────────────────────────────
    subprocess.run(["git", "add", str(DATA_FILE.relative_to(REPO_DIR))], check=True)

    # Check if there's anything to commit
    result = subprocess.run(["git", "diff", "--cached", "--stat"], capture_output=True, text=True)
    if not result.stdout.strip():
        log.info("Nothing to commit — skipping push")
        return

    # ── Step 5: Build commit message ────────────────────────────────────────
    score_lines = []
    for (home, away), info in scores.items():
        if info["status"] in ("live", "final"):
            score_lines.append(f"{home} {info['homeScore']}, {away} {info['awayScore']} ({info['status']})")

    summary = " | ".join(score_lines[:4]) if score_lines else "no live games"
    now = datetime.now(timezone.utc).strftime("%H:%M UTC")
    msg = f"chore(mcws): auto-update scores {now} — {summary}"

    subprocess.run(["git", "commit", "-m", msg], check=True)

    # ── Step 6: Push with retry on divergence ───────────────────────────────
    for attempt in range(1, 4):
        push_result = subprocess.run(
            ["git", "push", "origin", "main"],
            capture_output=True, text=True
        )
        if push_result.returncode == 0:
            log.info(f"Pushed (attempt {attempt}): {msg}")
            return
        else:
            log.warning(f"Push attempt {attempt} failed: {push_result.stderr.strip()}")
            if attempt < 3:
                # Re-pull and rebase our commit on top of latest remote
                subprocess.run(["git", "fetch", "origin"], capture_output=True)
                rebase_retry = subprocess.run(
                    ["git", "rebase", "origin/main"],
                    capture_output=True, text=True
                )
                if rebase_retry.returncode != 0:
                    subprocess.run(["git", "rebase", "--abort"], capture_output=True)
                    log.error("Rebase retry aborted — push abandoned this cycle")
                    return

    log.error(f"Push failed after 3 attempts — will retry next cron cycle")


def main():
    log.info("=== AthlynXAI OS v1 MCWS Score Updater — run start ===")

    espn_data = fetch_scores()
    if not espn_data:
        log.warning("No ESPN data — exiting without update")
        return

    scores = parse_games(espn_data)
    live_count = sum(1 for v in scores.values() if v["status"] in ("live", "final"))
    log.info(f"Parsed {len(scores)} games from ESPN, {live_count} live/final")

    if not scores:
        log.info("No games found in ESPN data — nothing to update")
        return

    changed = update_data_file(scores)
    if changed:
        git_commit_push(scores)
    else:
        log.info("No data changes — no commit needed")

    log.info("=== Run complete ===")


if __name__ == "__main__":
    main()
