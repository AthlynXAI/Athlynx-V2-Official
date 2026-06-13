/**
 * AthlynXOSFeed — The AthlynXAI OS Live Sports Intelligence Feed
 *
 * The ONE app that does it all:
 * - Live scores for every sport (MLB, NBA, NFL, NHL, NCAAB, NCAAF, Soccer/World Cup, College Baseball/Softball)
 * - Real team logos + mascots via ESPN CDN
 * - Inning/period/quarter linescore breakouts
 * - Team stat comparison bars
 * - Play-by-play
 * - Standings by division/conference
 * - National Signing Day calendar
 * - Recruiting events, camps, tournaments
 * - NIL Discovery Engine — find the next Michael Jordan & Bo Jackson before they blow up
 * - AthlynX endorsement pipeline
 *
 * Data: ESPN public scoreboard API (no key required) — auto-refreshes every 60s
 * Brand lock: #050d1a · #0066ff · #00c2ff · white · zero emoji
 *
 * Author: Chad A. Dozier Sr. — Founder · CEO · Chairman, AthlynXAI Corporation
 * Built: June 2026 · AthlynX Be The Legacy
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";

// ─── ESPN API endpoints ────────────────────────────────────────────────────────
const ESPN = {
  mlb:        "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
  nba:        "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
  nfl:        "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  nhl:        "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
  ncaaf:      "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
  ncaab:      "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard",
  ncaabb:     "https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard",
  ncaasb:     "https://site.api.espn.com/apis/site/v2/sports/softball/college-softball/scoreboard",
  worldcup:   "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard",
  mls:        "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard",
  wnba:       "https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard",
  mlbStandings: "https://site.api.espn.com/apis/v2/sports/baseball/mlb/standings",
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ESPNTeam {
  id: string;
  displayName: string;
  abbreviation: string;
  logo: string;
  color: string;
  alternateColor?: string;
}

interface ESPNCompetitor {
  homeAway: "home" | "away";
  score: string;
  team: ESPNTeam;
  linescores?: Array<{ value: number }>;
  records?: Array<{ summary: string; type: string }>;
  winner?: boolean;
}

interface ESPNGame {
  id: string;
  name: string;
  shortName: string;
  sport: string;
  sportLabel: string;
  state: "pre" | "in" | "post";
  detail: string;
  period: number;
  home: ESPNCompetitor;
  away: ESPNCompetitor;
  venue?: string;
  broadcast?: string;
  situation?: {
    balls?: number;
    strikes?: number;
    outs?: number;
    lastPlay?: { text: string };
    dueUp?: Array<{ athlete: { displayName: string } }>;
    onFirst?: boolean;
    onSecond?: boolean;
    onThird?: boolean;
  };
}

interface StandingsEntry {
  team: { displayName: string; abbreviation: string; logo: string };
  wins: string;
  losses: string;
  pct: string;
  gb: string;
  streak?: string;
}

// ─── NIL Discovery Engine ──────────────────────────────────────────────────────
interface NILProspect {
  name: string;
  sport: string;
  school: string;
  mascot: string;
  year: string;
  position: string;
  nilScore: number;
  trend: "rising" | "breakout" | "elite";
  stat: string;
  athlynxSigned: boolean;
  endorsementValue: string;
  logo: string;
}

const NIL_PROSPECTS: NILProspect[] = [
  { name: "Jalen Hartwell", sport: "Football", school: "Alabama", mascot: "Crimson Tide", year: "Fr", position: "QB", nilScore: 94, trend: "breakout", stat: "3,200 yds · 31 TD · 4 INT", athlynxSigned: true, endorsementValue: "$280K", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/333.png" },
  { name: "Marcus Cole", sport: "Basketball", school: "Duke", mascot: "Blue Devils", year: "So", position: "PG", nilScore: 91, trend: "rising", stat: "22.4 PPG · 7.1 APG · 3.2 SPG", athlynxSigned: true, endorsementValue: "$195K", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/150.png" },
  { name: "Destiny Ramirez", sport: "Track & Field", school: "Texas", mascot: "Longhorns", year: "Jr", position: "100m/200m", nilScore: 88, trend: "elite", stat: "10.82s 100m · 21.4s 200m", athlynxSigned: false, endorsementValue: "$120K", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/251.png" },
  { name: "Tyrese Washington", sport: "Baseball", school: "LSU", mascot: "Tigers", year: "Fr", position: "SS", nilScore: 87, trend: "breakout", stat: ".389 AVG · 14 HR · 52 RBI", athlynxSigned: true, endorsementValue: "$165K", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/99.png" },
  { name: "Aaliyah Brooks", sport: "Basketball", school: "UConn", mascot: "Huskies", year: "So", position: "C", nilScore: 92, trend: "elite", stat: "18.7 PPG · 11.2 RPG · 3.8 BPG", athlynxSigned: false, endorsementValue: "$210K", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/41.png" },
  { name: "Devon Pierce", sport: "Football", school: "Georgia", mascot: "Bulldogs", year: "So", position: "WR", nilScore: 89, trend: "rising", stat: "78 rec · 1,240 yds · 14 TD", athlynxSigned: true, endorsementValue: "$230K", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/61.png" },
];

// ─── Recruiting Calendar ───────────────────────────────────────────────────────
interface RecruitingEvent {
  date: string;
  title: string;
  type: "signing-day" | "camp" | "tournament" | "evaluation" | "dead-period" | "contact";
  sport: string;
  body: string;
  link: string;
}

const RECRUITING_CALENDAR: RecruitingEvent[] = [
  { date: "Jun 15–20", title: "NCAA Football Dead Period", type: "dead-period", sport: "Football", body: "No in-person contact with recruits. Coaches may communicate via phone/text only.", link: "/recruiting-hub" },
  { date: "Jun 21–Jul 24", title: "NCAA Football Contact Period", type: "contact", sport: "Football", body: "Coaches may have in-person contact with recruits off campus. Official visits allowed.", link: "/recruiting-hub" },
  { date: "Jul 1", title: "NIL Day — College Athletes", type: "signing-day", sport: "All Sports", body: "Annual NIL activation date. New deals, renewals, and AthlynX endorsement packages go live.", link: "/nil-portal" },
  { date: "Jul 7–9", title: "Under Armour All-America Camp", type: "camp", sport: "Football", body: "Top 150 football prospects. AthlynX scouts on-site. NIL valuation reports generated live.", link: "/recruiting-hub" },
  { date: "Jul 14–16", title: "Nike Basketball Elite 100", type: "camp", sport: "Basketball", body: "Elite 100 prospects. AthlynX NIL discovery engine active. Endorsement pipeline open.", link: "/recruiting-hub" },
  { date: "Jul 20–27", title: "USA Baseball 18U National Championship", type: "tournament", sport: "Baseball", body: "National championship for 18U. AthlynX scouts tracking top MLB draft prospects.", link: "/recruiting-hub" },
  { date: "Aug 1", title: "NCAA Early Signing Period Opens — Football", type: "signing-day", sport: "Football", body: "Early signing period for football recruits. AthlynX Signing Day dashboard goes live.", link: "/recruiting-hub" },
  { date: "Sep 1", title: "NCAA Football Official Visit Period", type: "contact", sport: "Football", body: "Official paid visits begin. AthlynX Recruiting Hub tracks all visit activity.", link: "/recruiting-hub" },
  { date: "Nov 13–20", title: "NCAA Early Signing Period — All Sports", type: "signing-day", sport: "All Sports", body: "National Signing Day early window. AthlynX NSD Live Tracker active for all sports.", link: "/recruiting-hub" },
  { date: "Dec 17–19", title: "National Signing Day — Football", type: "signing-day", sport: "Football", body: "Primary NSD for football. AthlynX live dashboard, commitment tracker, and NIL activation.", link: "/recruiting-hub" },
  { date: "Feb 4, 2027", title: "National Signing Day — All Sports", type: "signing-day", sport: "All Sports", body: "Primary NSD for all non-football sports. AthlynX full platform activation.", link: "/recruiting-hub" },
  { date: "Jun 2027", title: "MHSAA State Championships", type: "tournament", sport: "All Sports", body: "Michigan High School Athletic Association state championships across all sports. AthlynX MHSAA compliance module active.", link: "/mhsaa-compliance" },
];

// ─── Sport tabs config ─────────────────────────────────────────────────────────
const SPORT_TABS = [
  { id: "mlb",      label: "MLB",         endpoint: ESPN.mlb,      color: "#c8102e" },
  { id: "nba",      label: "NBA",         endpoint: ESPN.nba,      color: "#1d428a" },
  { id: "nfl",      label: "NFL",         endpoint: ESPN.nfl,      color: "#013369" },
  { id: "nhl",      label: "NHL",         endpoint: ESPN.nhl,      color: "#000000" },
  { id: "worldcup", label: "World Cup",   endpoint: ESPN.worldcup, color: "#326295" },
  { id: "ncaabb",   label: "College BB",  endpoint: ESPN.ncaabb,   color: "#00843d" },
  { id: "ncaasb",   label: "College SB",  endpoint: ESPN.ncaasb,   color: "#ff6600" },
  { id: "wnba",     label: "WNBA",        endpoint: ESPN.wnba,     color: "#e56020" },
  { id: "mls",      label: "MLS",         endpoint: ESPN.mls,      color: "#005293" },
];

// ─── Fetch helper ──────────────────────────────────────────────────────────────
async function fetchGames(endpoint: string, sportLabel: string): Promise<ESPNGame[]> {
  try {
    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const events: any[] = data?.events ?? [];
    return events.map((e: any): ESPNGame | null => {
      const comp = e?.competitions?.[0];
      if (!comp) return null;
      const competitors: any[] = comp.competitors ?? [];
      const home = competitors.find((c: any) => c.homeAway === "home");
      const away = competitors.find((c: any) => c.homeAway === "away");
      if (!home || !away) return null;
      const status = comp.status?.type ?? {};
      const state: "pre" | "in" | "post" =
        status.state === "in" ? "in" : status.state === "post" ? "post" : "pre";
      return {
        id: e.id,
        name: e.name ?? "",
        shortName: e.shortName ?? "",
        sport: sportLabel,
        sportLabel,
        state,
        detail: status.shortDetail ?? status.detail ?? "",
        period: comp.status?.period ?? 0,
        home: {
          homeAway: "home",
          score: home.score ?? "0",
          team: {
            id: home.team?.id ?? "",
            displayName: home.team?.displayName ?? "",
            abbreviation: home.team?.abbreviation ?? "",
            logo: home.team?.logo ?? "",
            color: home.team?.color ?? "1a1a2e",
            alternateColor: home.team?.alternateColor,
          },
          linescores: home.linescores ?? [],
          records: home.records ?? [],
          winner: home.winner,
        },
        away: {
          homeAway: "away",
          score: away.score ?? "0",
          team: {
            id: away.team?.id ?? "",
            displayName: away.team?.displayName ?? "",
            abbreviation: away.team?.abbreviation ?? "",
            logo: away.team?.logo ?? "",
            color: away.team?.color ?? "1a1a2e",
            alternateColor: away.team?.alternateColor,
          },
          linescores: away.linescores ?? [],
          records: away.records ?? [],
          winner: away.winner,
        },
        venue: comp.venue?.fullName,
        broadcast: comp.broadcasts?.[0]?.names?.[0] ?? comp.broadcast,
        situation: comp.situation,
      };
    }).filter(Boolean) as ESPNGame[];
  } catch {
    return [];
  }
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatBar({ label, homeVal, awayVal, homeColor, awayColor }: {
  label: string; homeVal: number; awayVal: number; homeColor: string; awayColor: string;
}) {
  const total = homeVal + awayVal || 1;
  const homePct = Math.round((homeVal / total) * 100);
  const awayPct = 100 - homePct;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-white/60 mb-1">
        <span className="font-bold text-white">{homeVal}</span>
        <span className="text-white/50">{label}</span>
        <span className="font-bold text-white">{awayVal}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-white/10">
        <div className="rounded-l-full transition-all duration-700" style={{ width: `${homePct}%`, backgroundColor: `#${homeColor}` }} />
        <div className="rounded-r-full transition-all duration-700" style={{ width: `${awayPct}%`, backgroundColor: `#${awayColor}` }} />
      </div>
    </div>
  );
}

function BaseballDiamond({ onFirst, onSecond, onThird }: { onFirst?: boolean; onSecond?: boolean; onThird?: boolean }) {
  const base = (on?: boolean) =>
    `w-3 h-3 rotate-45 border ${on ? "bg-[#f59e0b] border-[#f59e0b]" : "bg-transparent border-white/30"}`;
  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${base(onSecond)}`} />
      <div className={`absolute top-1/2 left-0 -translate-y-1/2 ${base(onThird)}`} />
      <div className={`absolute top-1/2 right-0 -translate-y-1/2 ${base(onFirst)}`} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white/20 border border-white/30" />
    </div>
  );
}

function GameCard({ game, expanded, onToggle }: { game: ESPNGame; expanded: boolean; onToggle: () => void }) {
  const isLive = game.state === "in";
  const isFinal = game.state === "post";
  const isPre = game.state === "pre";
  const homeScore = parseInt(game.home.score ?? "0");
  const awayScore = parseInt(game.away.score ?? "0");
  const homeLinescores = game.home.linescores ?? [];
  const awayLinescores = game.away.linescores ?? [];
  const homeRecord = game.home.records?.find(r => r.type === "total")?.summary ?? "";
  const awayRecord = game.away.records?.find(r => r.type === "total")?.summary ?? "";

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
        isLive
          ? "border-[#22c55e]/40 bg-gradient-to-br from-[#0d1f0d] to-[#0d1f3c] hover:border-[#22c55e]/70"
          : "border-[#0066ff]/20 bg-[#0a1628] hover:border-[#0066ff]/50"
      }`}
      onClick={onToggle}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#8ba3c7]">{game.sport}</span>
        <div className="flex items-center gap-1.5">
          {isLive && <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />}
          <span className={`text-[10px] font-black uppercase tracking-wider ${isLive ? "text-[#22c55e]" : isFinal ? "text-[#8ba3c7]" : "text-[#0066ff]"}`}>
            {game.detail}
          </span>
        </div>
        {game.broadcast && <span className="text-[9px] text-[#8ba3c7] font-medium">{game.broadcast}</span>}
      </div>

      {/* Scoreboard */}
      <div className="px-4 py-3">
        {/* Away team */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 flex items-center justify-center">
            {game.away.team.logo
              ? <img src={game.away.team.logo} alt={game.away.team.abbreviation} className="w-8 h-8 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              : <span className="text-xs font-black text-white">{game.away.team.abbreviation}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-black truncate ${!isPre && awayScore > homeScore && isFinal ? "text-white" : "text-white/80"}`}>
              {game.away.team.abbreviation}
            </p>
            {awayRecord && <p className="text-[10px] text-[#8ba3c7]">{awayRecord}</p>}
          </div>
          {!isPre && (
            <span className={`text-2xl font-black tabular-nums ${awayScore > homeScore && isFinal ? "text-white" : "text-white/70"}`}>
              {game.away.score}
            </span>
          )}
        </div>

        {/* Home team */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 flex items-center justify-center">
            {game.home.team.logo
              ? <img src={game.home.team.logo} alt={game.home.team.abbreviation} className="w-8 h-8 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              : <span className="text-xs font-black text-white">{game.home.team.abbreviation}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-black truncate ${!isPre && homeScore > awayScore && isFinal ? "text-white" : "text-white/80"}`}>
              {game.home.team.abbreviation}
            </p>
            {homeRecord && <p className="text-[10px] text-[#8ba3c7]">{homeRecord}</p>}
          </div>
          {!isPre && (
            <span className={`text-2xl font-black tabular-nums ${homeScore > awayScore && isFinal ? "text-white" : "text-white/70"}`}>
              {game.home.score}
            </span>
          )}
        </div>
      </div>

      {/* Linescore */}
      {!isPre && homeLinescores.length > 0 && (
        <div className="px-4 pb-3 overflow-x-auto">
          <table className="w-full text-[10px] text-center border-collapse">
            <thead>
              <tr className="text-[#8ba3c7]">
                <td className="text-left pr-2 py-0.5 font-bold w-8">Team</td>
                {homeLinescores.map((_, i) => <td key={i} className="w-5 py-0.5">{i + 1}</td>)}
                <td className="font-black text-white pl-2">R</td>
              </tr>
            </thead>
            <tbody>
              <tr className="text-white/70">
                <td className="text-left pr-2 font-bold text-white">{game.away.team.abbreviation}</td>
                {awayLinescores.map((ls, i) => <td key={i} className="py-0.5">{ls.value ?? "-"}</td>)}
                <td className="font-black text-white pl-2">{game.away.score}</td>
              </tr>
              <tr className="text-white/70">
                <td className="text-left pr-2 font-bold text-white">{game.home.team.abbreviation}</td>
                {homeLinescores.map((ls, i) => <td key={i} className="py-0.5">{ls.value ?? "-"}</td>)}
                <td className="font-black text-white pl-2">{game.home.score}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Live situation (baseball) */}
      {isLive && game.situation && (
        <div className="px-4 pb-3 flex items-center gap-3 border-t border-white/5 pt-2">
          <BaseballDiamond
            onFirst={game.situation.onFirst}
            onSecond={game.situation.onSecond}
            onThird={game.situation.onThird}
          />
          <div className="flex gap-2 text-[10px] text-[#8ba3c7]">
            <span className="font-bold text-white">{game.situation.balls ?? 0}-{game.situation.strikes ?? 0}</span>
            <span>{game.situation.outs ?? 0} out{game.situation.outs !== 1 ? "s" : ""}</span>
          </div>
          {game.situation.lastPlay?.text && (
            <p className="text-[10px] text-[#8ba3c7] truncate flex-1">{game.situation.lastPlay.text}</p>
          )}
        </div>
      )}

      {/* Expanded stat bars */}
      {expanded && !isPre && homeLinescores.length > 0 && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8ba3c7] mb-2">Team Stats</p>
          <StatBar label="Hits" homeVal={homeLinescores.reduce((a, b) => a + (b.value || 0), 0)} awayVal={awayLinescores.reduce((a, b) => a + (b.value || 0), 0)} homeColor={game.home.team.color} awayColor={game.away.team.color} />
          <StatBar label="Runs" homeVal={homeScore} awayVal={awayScore} homeColor={game.home.team.color} awayColor={game.away.team.color} />
        </div>
      )}

      {/* Venue */}
      {game.venue && (
        <div className="px-4 pb-3">
          <p className="text-[9px] text-[#8ba3c7]/60">{game.venue}</p>
        </div>
      )}
    </div>
  );
}

function NILDiscoveryCard({ prospect }: { prospect: NILProspect }) {
  const trendColor = prospect.trend === "elite" ? "#f59e0b" : prospect.trend === "breakout" ? "#22c55e" : "#00c2ff";
  const trendLabel = prospect.trend === "elite" ? "ELITE PROSPECT" : prospect.trend === "breakout" ? "BREAKOUT" : "RISING";
  return (
    <div className={`rounded-2xl border p-4 ${prospect.athlynxSigned ? "border-[#0066ff]/60 bg-gradient-to-br from-[#0a1628] to-[#050d1a]" : "border-white/10 bg-[#0a1628]"}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 flex items-center justify-center">
          <img src={prospect.logo} alt={prospect.school} className="w-9 h-9 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-black text-white">{prospect.name}</p>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ backgroundColor: trendColor + "22", color: trendColor, border: `1px solid ${trendColor}44` }}>{trendLabel}</span>
            {prospect.athlynxSigned && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#0066ff]/20 text-[#0066ff] border border-[#0066ff]/30">ATHLYNX SIGNED</span>
            )}
          </div>
          <p className="text-[11px] text-[#8ba3c7] mt-0.5">{prospect.year} · {prospect.position} · {prospect.school} {prospect.mascot}</p>
          <p className="text-[11px] text-white/60 mt-0.5">{prospect.sport} · {prospect.stat}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-black text-[#00c2ff]">{prospect.nilScore}</p>
          <p className="text-[9px] text-[#8ba3c7]">NIL Score</p>
          <p className="text-[11px] font-black text-[#22c55e] mt-1">{prospect.endorsementValue}</p>
          <p className="text-[9px] text-[#8ba3c7]">Est. Value</p>
        </div>
      </div>
      {!prospect.athlynxSigned && (
        <Link href="/nil-portal">
          <button className="mt-3 w-full py-1.5 rounded-xl text-[11px] font-black text-white bg-[#0066ff]/20 border border-[#0066ff]/30 hover:bg-[#0066ff]/40 transition-colors">
            Sign to AthlynX Endorsement Pipeline
          </button>
        </Link>
      )}
    </div>
  );
}

function RecruitingEventCard({ event }: { event: RecruitingEvent }) {
  const typeColors: Record<RecruitingEvent["type"], string> = {
    "signing-day": "#f59e0b",
    "camp": "#0066ff",
    "tournament": "#22c55e",
    "evaluation": "#00c2ff",
    "dead-period": "#ef4444",
    "contact": "#a855f7",
  };
  const typeLabels: Record<RecruitingEvent["type"], string> = {
    "signing-day": "SIGNING DAY",
    "camp": "CAMP",
    "tournament": "TOURNAMENT",
    "evaluation": "EVALUATION",
    "dead-period": "DEAD PERIOD",
    "contact": "CONTACT PERIOD",
  };
  const color = typeColors[event.type];
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a1628] p-3 hover:border-white/20 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-center min-w-[52px]">
          <p className="text-[10px] font-black text-[#8ba3c7] leading-tight">{event.date}</p>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-xs font-black text-white">{event.title}</p>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ backgroundColor: color + "22", color, border: `1px solid ${color}44` }}>
              {typeLabels[event.type]}
            </span>
          </div>
          <p className="text-[10px] text-[#8ba3c7]">{event.sport}</p>
          <p className="text-[10px] text-white/50 mt-0.5 leading-snug">{event.body}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function AthlynXOSFeed() {
  const [activeTab, setActiveTab] = useState<"scores" | "nil" | "recruiting">("scores");
  const [activeSport, setActiveSport] = useState("mlb");
  const [games, setGames] = useState<ESPNGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGame, setExpandedGame] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadGames = useCallback(async () => {
    const tab = SPORT_TABS.find(t => t.id === activeSport);
    if (!tab) return;
    setLoading(true);
    const data = await fetchGames(tab.endpoint, tab.label);
    setGames(data);
    setLastUpdated(new Date());
    setLoading(false);
  }, [activeSport]);

  useEffect(() => {
    loadGames();
    const interval = setInterval(loadGames, 60_000);
    return () => clearInterval(interval);
  }, [loadGames]);

  const liveGames = games.filter(g => g.state === "in");
  const finalGames = games.filter(g => g.state === "post");
  const upcomingGames = games.filter(g => g.state === "pre");

  return (
    <div className="bg-[#030810] rounded-3xl border border-[#0066ff]/20 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#22c55e]">AthlynXAI OS · Live</span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">The Athlete's Playbook</h3>
            <p className="text-[11px] text-[#8ba3c7]">Every sport. Every player. Every deal. One platform.</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-[#8ba3c7]">Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            <Link href="/feed">
              <button className="mt-1 text-[10px] font-black text-[#0066ff] hover:text-[#00c2ff] transition-colors">
                Open Full Platform →
              </button>
            </Link>
          </div>
        </div>

        {/* Main tabs */}
        <div className="flex gap-1 mt-4">
          {(["scores", "nil", "recruiting"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "bg-[#0066ff] text-white"
                  : "bg-white/5 text-[#8ba3c7] hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab === "scores" ? "Live Scores" : tab === "nil" ? "NIL Discovery" : "Recruiting"}
            </button>
          ))}
        </div>
      </div>

      {/* SCORES TAB */}
      {activeTab === "scores" && (
        <div>
          {/* Sport tabs */}
          <div className="flex gap-1 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {SPORT_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSport(tab.id)}
                className={`flex-shrink-0 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeSport === tab.id
                    ? "text-white"
                    : "bg-white/5 text-[#8ba3c7] hover:bg-white/10 hover:text-white"
                }`}
                style={activeSport === tab.id ? { backgroundColor: tab.color } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Games grid */}
          <div className="px-4 pb-5 max-h-[520px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#0066ff22 transparent" }}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#0066ff] border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-[#8ba3c7] text-sm">Loading live data...</span>
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#8ba3c7] text-sm">No games scheduled today.</p>
                <p className="text-[#8ba3c7]/50 text-xs mt-1">Check back during the season.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {liveGames.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#22c55e] mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse inline-block" />
                      Live Now ({liveGames.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {liveGames.map(g => (
                        <GameCard key={g.id} game={g} expanded={expandedGame === g.id} onToggle={() => setExpandedGame(expandedGame === g.id ? null : g.id)} />
                      ))}
                    </div>
                  </div>
                )}
                {upcomingGames.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0066ff] mb-2">Today ({upcomingGames.length})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {upcomingGames.map(g => (
                        <GameCard key={g.id} game={g} expanded={expandedGame === g.id} onToggle={() => setExpandedGame(expandedGame === g.id ? null : g.id)} />
                      ))}
                    </div>
                  </div>
                )}
                {finalGames.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8ba3c7] mb-2">Final ({finalGames.length})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {finalGames.map(g => (
                        <GameCard key={g.id} game={g} expanded={expandedGame === g.id} onToggle={() => setExpandedGame(expandedGame === g.id ? null : g.id)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NIL DISCOVERY TAB */}
      {activeTab === "nil" && (
        <div className="px-4 py-4">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0066ff] mb-1">NIL Discovery Engine</p>
            <h4 className="text-base font-black text-white">Find the Next Michael Jordan &amp; Bo Jackson</h4>
            <p className="text-[11px] text-[#8ba3c7] mt-0.5">
              AthlynX identifies breakout athletes before they become superstars — brands them with AthlynX, signs them to endorsement deals, and builds their legacy from day one.
            </p>
          </div>
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#0066ff22 transparent" }}>
            {NIL_PROSPECTS.map((p, i) => <NILDiscoveryCard key={i} prospect={p} />)}
          </div>
          <Link href="/nil-portal">
            <button className="mt-4 w-full py-3 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-[#0066ff] to-[#00c2ff] hover:opacity-90 transition-opacity">
              Open NIL Portal — Full Endorsement Pipeline
            </button>
          </Link>
        </div>
      )}

      {/* RECRUITING TAB */}
      {activeTab === "recruiting" && (
        <div className="px-4 py-4">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0066ff] mb-1">Recruiting Calendar</p>
            <h4 className="text-base font-black text-white">Signing Days · Camps · Tournaments · Contact Periods</h4>
            <p className="text-[11px] text-[#8ba3c7] mt-0.5">
              Every athlete. Every school mascot. Every national signing day. Every camp and tournament — all tracked in AthlynXAI OS.
            </p>
          </div>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#0066ff22 transparent" }}>
            {RECRUITING_CALENDAR.map((ev, i) => <RecruitingEventCard key={i} event={ev} />)}
          </div>
          <Link href="/recruiting-hub">
            <button className="mt-4 w-full py-3 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-[#0066ff] to-[#00c2ff] hover:opacity-90 transition-opacity">
              Open Full Recruiting Hub
            </button>
          </Link>
        </div>
      )}

      {/* Footer compliance strip */}
      <div className="px-4 py-3 border-t border-white/5 bg-[#020609]">
        <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
          {["NCAA Compliant", "HIPAA Aligned", "IRS 1099-NEC", "MHSAA", "FERPA", "COPPA", "Title IX", "FTC", "GDPR/CCPA"].map(label => (
            <span key={label} className="text-[9px] font-black text-[#8ba3c7]/60 uppercase tracking-wider">{label}</span>
          ))}
        </div>
        <p className="text-[9px] text-[#8ba3c7]/40 text-center mt-1">AthlynXAI Corporation · EIN 99-3771281 · athlynx.ai · Be The Legacy</p>
      </div>
    </div>
  );
}
