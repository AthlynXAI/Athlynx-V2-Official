// Brackets — Live MCWS 2026 · 8 Teams · Charles Schwab Field · Omaha, Nebraska
// Updated June 10, 2026 · AthlynX — ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.
// Brand lock: true black + electric cobalt + white. No gold/yellow/orange. No standalone X glyph.

import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { LiveRegionalScoreboard } from "@/components/LiveRegionalScoreboard";
import { RegionalBracketTree } from "@/components/RegionalBracketTree";
import LiveHighlightsFeed from "@/components/LiveHighlightsFeed";

// 
// Types
// 

interface MCWSTeam {
  seed: number | null;
  name: string;
  record: string;
  natlSeed?: number;
  bracket: "bracket1" | "bracket2";
  status?: string;
}

interface MCWSGame {
  game: number;
  matchup: string;
  ctTime: string;
  date: string;
  network: string;
  result?: string;
  isToday?: boolean;
}

interface NILPlayer {
  name: string;
  team: string;
  position: string;
  context: string;
  tier: string;
}

interface ESPNGame {
  id: string;
  status: "pre" | "in" | "post";
  shortDetail: string;
  homeTeam: string;
  homeScore: string;
  awayTeam: string;
  awayScore: string;
}

// 
// 2026 MCWS — 8 Teams · Charles Schwab Field · Omaha, Nebraska · June 12–22
// 

// Bracket 1: North Carolina (5), West Virginia (16), Ole Miss, Troy
// Bracket 2: Georgia (3), Texas (6), Alabama (7), Oklahoma
// Source: NCAA.com June 8, 2026

const MCWS_TEAMS: MCWSTeam[] = [
  // Bracket 1
  { seed: 1, natlSeed: 5,  name: "North Carolina",  record: "50-12-1", bracket: "bracket1", status: "2-0 · Winners bracket" },
  { seed: 2, natlSeed: 16, name: "West Virginia",   record: "45-15",   bracket: "bracket1", status: "First-ever MCWS appearance" },
  { seed: 3, natlSeed: undefined, name: "Ole Miss",       record: "41-21",   bracket: "bracket1" },
  { seed: 4, natlSeed: undefined, name: "Troy",           record: "38-30",   bracket: "bracket1", status: "First-ever MCWS appearance" },
  // Bracket 2
  { seed: 1, natlSeed: 3,  name: "Georgia",         record: "51-12",   bracket: "bracket2" },
  { seed: 2, natlSeed: 6,  name: "Texas",           record: "45-13",   bracket: "bracket2" },
  { seed: 3, natlSeed: 7,  name: "Alabama",         record: "41-19",   bracket: "bracket2" },
  { seed: 4, natlSeed: undefined, name: "Oklahoma",      record: "37-22",   bracket: "bracket2" },
];

const MCWS_SCHEDULE: MCWSGame[] = [
  // Friday June 12 — Opening Day
  { game: 1, matchup: "#16 West Virginia vs Troy",            ctTime: "1:00 PM CT",  date: "Fri Jun 12", network: "ESPN",  isToday: true },
  { game: 2, matchup: "#5 North Carolina vs Ole Miss",        ctTime: "6:00 PM CT",  date: "Fri Jun 12", network: "ESPN",  isToday: true },
  // Saturday June 13
  { game: 3, matchup: "Alabama/St. John's vs Kansas/Oklahoma",ctTime: "2:00 PM CT",  date: "Sat Jun 13", network: "ESPN" },
  { game: 4, matchup: "#3 Georgia vs #6 Texas",               ctTime: "7:00 PM CT",  date: "Sat Jun 13", network: "ESPN" },
  // Sunday June 14 — Elimination Round
  { game: 5, matchup: "Losers G1 vs Losers G2",               ctTime: "1:00 PM CT",  date: "Sun Jun 14", network: "ESPN" },
  { game: 6, matchup: "Winners G1 vs Winners G2",             ctTime: "6:00 PM CT",  date: "Sun Jun 14", network: "ESPN" },
  // Monday June 15 — Elimination Round
  { game: 7, matchup: "Losers G3 vs Losers G4",               ctTime: "1:00 PM CT",  date: "Mon Jun 15", network: "ESPN" },
  { game: 8, matchup: "Winners G3 vs Winners G4",             ctTime: "6:00 PM CT",  date: "Mon Jun 15", network: "ESPN" },
  // Championship Finals — Best of 3
  { game: 15, matchup: "Championship Series Game 1",          ctTime: "7:00 PM CT",  date: "Sat Jun 20", network: "ESPN" },
  { game: 16, matchup: "Championship Series Game 2",          ctTime: "1:30 PM CT",  date: "Sun Jun 21", network: "ABC" },
  { game: 17, matchup: "Championship Series Game 3 (if nec)", ctTime: "6:00 PM CT",  date: "Mon Jun 22", network: "ESPN" },
];

const MCWS_NIL: NILPlayer[] = [
  { name: "Liam Doyle",       team: "North Carolina",  position: "P",   context: "#5 nat'l seed · ace starter · walk-off hero vs USC", tier: "Elite" },
  { name: "Tre' Morgan",      team: "Georgia",         position: "1B",  context: "#3 nat'l seed · SEC Player of the Year candidate",   tier: "Elite" },
  { name: "Jace LaViolette",  team: "Texas",           position: "OF",  context: "#6 nat'l seed · top MLB draft prospect 2026",        tier: "Elite" },
  { name: "Armani Guzman",    team: "West Virginia",   position: "P",   context: "First-ever MCWS · Big 12 ace · 5 HR shutout vs Cal Poly", tier: "High" },
  { name: "Ben Lumsden",      team: "West Virginia",   position: "OF",  context: "Power bat · WVU's first Omaha trip",                 tier: "High" },
  { name: "Hunter Hines",     team: "Ole Miss",        position: "IF",  context: "SEC standout · Ole Miss back in Omaha",              tier: "High" },
  { name: "Owen Halls",       team: "North Carolina",  position: "OF",  context: "4 doubles in G3 vs USC · walk-off hero",             tier: "High" },
  { name: "Tanner Hall",      team: "Alabama",         position: "P",   context: "#7 nat'l seed · SEC tournament ace",                 tier: "Rising" },
];

// 
// ESPN live scoreboard fetcher
// 

function useESPNScoreboard() {
  const [games, setGames] = useState<ESPNGame[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const path = "https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard";

    async function fetchScoreboard() {
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const events = (data?.events ?? []) as any[];
        const parsed: ESPNGame[] = events.map((e) => {
          const comp = e?.competitions?.[0];
          const home = comp?.competitors?.find((c: any) => c?.homeAway === "home");
          const away = comp?.competitors?.find((c: any) => c?.homeAway === "away");
          const stateRaw = comp?.status?.type?.state as string | undefined;
          const state: ESPNGame["status"] = stateRaw === "in" ? "in" : stateRaw === "post" ? "post" : "pre";
          return {
            id: e?.id,
            status: state,
            shortDetail: comp?.status?.type?.shortDetail ?? "",
            homeTeam: home?.team?.shortDisplayName ?? home?.team?.displayName ?? "—",
            homeScore: home?.score ?? "—",
            awayTeam: away?.team?.shortDisplayName ?? away?.team?.displayName ?? "—",
            awayScore: away?.score ?? "—",
          };
        });
        if (!cancelled) {
          setGames(parsed);
          setUpdatedAt(new Date());
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Live scores temporarily unavailable");
      }
    }

    fetchScoreboard();
    const live = games.some((g) => g.status === "in");
    const interval = live ? 60_000 : 300_000;
    const t = setInterval(fetchScoreboard, interval);
    return () => { cancelled = true; clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { games, updatedAt, error };
}

// 
// Subcomponents
// 

function LiveBadge({ status }: { status: ESPNGame["status"] }) {
  if (status === "in")
    return <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-[#1E90FF] px-1.5 py-0.5 rounded animate-pulse">LIVE</span>;
  if (status === "post")
    return <span className="text-[10px] font-bold tracking-widest uppercase text-white/70 bg-white/10 px-1.5 py-0.5 rounded">FINAL</span>;
  return <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 bg-white/5 px-1.5 py-0.5 rounded">UPCOMING</span>;
}

function LiveScoreStrip() {
  const { games, updatedAt, error } = useESPNScoreboard();
  const liveGames = useMemo(() => games.filter((g) => g.status === "in"), [games]);
  const displayGames = liveGames.length > 0 ? liveGames : games.slice(0, 6);

  return (
    <div className="border border-white/10 rounded-lg bg-black/40 p-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#88a8ff]">
          Live Scoreboard · Omaha
        </h3>
        <span className="text-[10px] text-white/40">
          {updatedAt
            ? `Updated · ${updatedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })} CT`
            : "Loading…"}
        </span>
      </div>
      {error && (
        <div className="text-xs text-white/50 italic">Live scores appear when games begin. ({error})</div>
      )}
      {!error && displayGames.length === 0 && (
        <div className="text-xs text-white/50 italic">No games on the wire yet — first pitch June 12 at 1 PM CT.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {displayGames.map((g) => (
          <div key={g.id} className="border border-white/10 rounded p-3 bg-black/60">
            <div className="flex items-center justify-between mb-2">
              <LiveBadge status={g.status} />
              <span className="text-[10px] text-white/40">{g.shortDetail}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">{g.awayTeam}</span>
              <span className="text-[#88a8ff] font-mono font-bold">{g.awayScore}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">{g.homeTeam}</span>
              <span className="text-[#88a8ff] font-mono font-bold">{g.homeScore}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NILPanel() {
  return (
    <aside className="border border-[#1E90FF]/30 rounded-lg bg-gradient-to-b from-[#0a1628] to-black p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#1E90FF]">
            AthlynX NIL Overlay · Men's Baseball
          </h3>
          <p className="text-[11px] text-white/50 mt-1">Top NIL valuations of players in the 2026 MCWS field.</p>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-white/30">athlynx.ai</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {MCWS_NIL.map((p) => (
          <div key={`${p.name}-${p.team}`} className="border border-white/10 rounded p-3 bg-black/40 hover:border-[#1E90FF]/50 transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-white">{p.name}</span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#1E90FF] bg-[#1E90FF]/10 px-1.5 py-0.5 rounded">
                {p.tier}
              </span>
            </div>
            <div className="text-xs text-white/60 mb-1">{p.team} · {p.position}</div>
            <div className="text-[11px] text-white/50 leading-snug">{p.context}</div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-white/40 mt-4 italic leading-snug">
        NIL valuations are public estimates from On3, RallyFuel, and SportsGrid — not disclosed contracts.
      </p>
    </aside>
  );
}

function BracketCard({ team }: { team: MCWSTeam }) {
  return (
    <div className="border border-white/10 rounded-lg bg-black/40 p-4 hover:border-[#1E90FF]/50 transition">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-base font-bold text-white">{team.name}</span>
        {team.natlSeed && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E90FF]">
            Nat'l #{team.natlSeed}
          </span>
        )}
      </div>
      <div className="text-xs text-white/50 font-mono mb-2">{team.record}</div>
      {team.status && (
        <div className="text-[11px] text-[#88a8ff] leading-snug">{team.status}</div>
      )}
    </div>
  );
}

function ScheduleCard({ game }: { game: MCWSGame }) {
  return (
    <div className={`border rounded-lg p-3 transition ${
      game.isToday
        ? "border-[#1E90FF] bg-[#1E90FF]/5 shadow-[0_0_24px_-4px_rgba(30,144,255,0.5)]"
        : "border-white/10 bg-black/40 hover:border-[#1E90FF]/40"
    }`}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#88a8ff]">
          Game {game.game} · {game.date}
        </span>
        <span className="text-[10px] text-white/40">{game.network}</span>
      </div>
      <div className="text-sm text-white mb-1">{game.matchup}</div>
      {game.result ? (
        <div className="text-[11px] font-mono text-[#88a8ff]">{game.result}</div>
      ) : (
        <div className="text-[11px] text-white/50">{game.ctTime}</div>
      )}
      {game.isToday && (
        <div className="mt-1">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-[#1E90FF] px-1.5 py-0.5 rounded animate-pulse">TODAY</span>
        </div>
      )}
    </div>
  );
}

// 
// Main page
// 

export default function Brackets() {
  const bracket1 = MCWS_TEAMS.filter((t) => t.bracket === "bracket1");
  const bracket2 = MCWS_TEAMS.filter((t) => t.bracket === "bracket2");

  useEffect(() => {
    document.title = "MCWS 2026 — Live Bracket · Omaha · AthlynX";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a1628] to-black text-white">
      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Brand strip */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <img
                src="/athlynx-app-icon.png"
                alt="AthlynX"
                className="w-10 h-10 rounded-lg ring-1 ring-[#1E90FF]/40 group-hover:ring-[#1E90FF] transition"
              />
              <div>
                <div className="text-sm font-bold tracking-widest text-white">Athlyn<span className="text-[#1E90FF]">X</span></div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#1E90FF]">The Athlete's Playbook</div>
              </div>
            </a>
          </Link>
          <div className="text-[10px] uppercase tracking-widest text-white/40">athlynx.ai/brackets</div>
        </div>

        {/* Hero */}
        <header className="mb-8">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-2">
            2026 NCAA Division I Baseball Championship · Charles Schwab Field · Omaha, Nebraska
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            MEN'S COLLEGE WORLD SERIES
          </h1>
          <div className="text-base md:text-xl font-bold text-[#00C2FF] tracking-tight mb-3">
            8 Teams · Omaha · June 12–22, 2026
          </div>
          <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
            The field is set. Eight teams have earned their spot at Charles Schwab Field in Omaha. 
            Double-elimination format through the semifinals. Championship Finals best-of-three June 20–22.
            Live scores auto-refresh every 60 seconds during game windows.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-3 py-1.5 rounded">ROAD TO OMAHA</span>
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#1E90FF] border border-[#1E90FF] px-3 py-1.5 rounded">79TH MCWS</span>
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white/60 border border-white/20 px-3 py-1.5 rounded">OPENS JUNE 12</span>
          </div>
        </header>

        {/* Live Scoreboard */}
        <LiveScoreStrip />

        {/* NIL Overlay */}
        <NILPanel />

        {/* Bracket 1 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">BRACKET 1</span>
            <h2 className="text-lg font-bold text-white tracking-tight">North Carolina · West Virginia · Ole Miss · Troy</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {bracket1.map((t) => <BracketCard key={t.name} team={t} />)}
          </div>
          <div className="border border-white/10 rounded-lg bg-black/30 p-4 text-sm text-white/60">
            <span className="text-[#1E90FF] font-semibold">Bracket 1 Opening Games:</span>{" "}
            Fri Jun 12 — #16 West Virginia vs Troy (1 PM CT, ESPN) · #5 North Carolina vs Ole Miss (6 PM CT, ESPN)
          </div>
        </div>

        {/* Bracket 2 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">BRACKET 2</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Georgia · Texas · Alabama · Oklahoma</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {bracket2.map((t) => <BracketCard key={t.name} team={t} />)}
          </div>
          <div className="border border-white/10 rounded-lg bg-black/30 p-4 text-sm text-white/60">
            <span className="text-[#1E90FF] font-semibold">Bracket 2 Opening Games:</span>{" "}
            Sat Jun 13 — Alabama/St. John's vs Kansas/Oklahoma (2 PM CT, ESPN) · #3 Georgia vs #6 Texas (7 PM CT, ESPN)
          </div>
        </div>

        {/* Full Schedule */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">FULL SCHEDULE</span>
            <h2 className="text-lg font-bold text-white tracking-tight">June 12–22 · All Times CT · ESPN/ABC</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MCWS_SCHEDULE.map((g) => <ScheduleCard key={g.game} game={g} />)}
          </div>
        </div>

        {/* Live Regional Scoreboard component */}
        <LiveRegionalScoreboard sport="baseball" />

        {/* Bracket Tree */}
        <RegionalBracketTree sport="baseball" />

        {/* Live Highlights */}
        <div className="mt-10">
          <LiveHighlightsFeed mode="mcws" compact />
        </div>

        {/* Championship Finals callout */}
        <div className="border border-[#1E90FF]/40 rounded-lg bg-gradient-to-br from-[#0a1628] via-black to-black p-6 my-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">CHAMPIONSHIP FINALS</span>
            <h3 className="text-sm font-bold tracking-widest uppercase text-[#88a8ff]">Best of Three · June 20–22</h3>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            The winners of Bracket 1 and Bracket 2 meet in a best-of-three Championship Series.
            Game 1: Saturday June 20 at 7 PM CT on ESPN.
            Game 2: Sunday June 21 at 1:30 PM CT on ABC.
            Game 3 (if necessary): Monday June 22 at 6 PM CT on ESPN.
          </p>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-6 mt-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-1">
            ATHLYNX · THE ATHLETE'S PLAYBOOK
          </p>
          <p className="text-[11px] text-white/50 mb-3">One identity. Every athlete. Every platform.</p>
          <div className="flex justify-center gap-4 text-[10px] text-white/30 uppercase tracking-widest">
            <Link href="/"><a className="hover:text-white transition">Home</a></Link>
            <Link href="/sports"><a className="hover:text-white transition">All Sports</a></Link>
            <Link href="/nil"><a className="hover:text-white transition">NIL</a></Link>
            <Link href="/recruiting"><a className="hover:text-white transition">Recruiting</a></Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
