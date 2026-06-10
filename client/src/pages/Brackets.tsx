// Brackets — Live MCWS (men's) + WCWS (women's) tournament tracker
// Built May 29, 2026 · AthlynX — ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM. · Men. Women. Every athlete.
// Brand lock: true black + electric cobalt + white. No gold/yellow/orange. No standalone X glyph.

import { useState, useEffect, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { LiveRegionalScoreboard } from "@/components/LiveRegionalScoreboard";
import { RegionalBracketTree } from "@/components/RegionalBracketTree";
import LiveHighlightsFeed from "@/components/LiveHighlightsFeed";

// ───────────────────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────────────────

interface RegionalTeam {
  seed: number;
  name: string;
  record?: string;
}

interface RegionalGame {
  game: number;
  matchup: string;
  ctTime: string;
  network: string;
}

interface Regional {
  natlSeed: number | null;
  regional: string;
  host: string;
  venue: string;
  teams: RegionalTeam[];
  fridayGames: RegionalGame[];
}

interface WCWSGame {
  game: number;
  matchup: string;
  ctTime: string;
  date: string;
  network: string;
  result?: string;
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

// ───────────────────────────────────────────────────────────────────────────
// MCWS — Men's College World Series 2026 (Regionals begin Friday May 29)
// ───────────────────────────────────────────────────────────────────────────

const MCWS_REGIONALS: Regional[] = [
  {
    natlSeed: 1, regional: "Los Angeles Regional", host: "UCLA", venue: "Jackie Robinson Stadium",
    teams: [
      { seed: 1, name: "UCLA", record: "51-6" },
      { seed: 2, name: "Virginia Tech" },
      { seed: 3, name: "Cal Poly" },
      { seed: 4, name: "Saint Mary's" },
    ],
    fridayGames: [
      { game: 1, matchup: "#1 UCLA vs #4 Saint Mary's · FINAL: Saint Mary's 3, UCLA 2", ctTime: "FINAL", network: "ESPNU" },
      { game: 2, matchup: "#2 Virginia Tech vs #3 Cal Poly", ctTime: "7:00 PM CT", network: "ESPN+" },
    ],
  },
  {
    natlSeed: 2, regional: "Atlanta Regional", host: "Georgia Tech", venue: "Russ Chandler Stadium",
    teams: [
      { seed: 1, name: "Georgia Tech", record: "48-9" },
      { seed: 2, name: "Oklahoma" },
      { seed: 3, name: "The Citadel" },
      { seed: 4, name: "UIC" },
    ],
    fridayGames: [
      { game: 1, matchup: "#1 Georgia Tech vs #4 UIC", ctTime: "11:00 AM CT", network: "ACCN" },
      { game: 2, matchup: "#2 Oklahoma vs #3 The Citadel", ctTime: "4:00 PM CT", network: "ESPN+" },
    ],
  },
  {
    natlSeed: 3, regional: "Athens Regional", host: "Georgia", venue: "Foley Field",
    teams: [
      { seed: 1, name: "Georgia", record: "46-12" },
      { seed: 2, name: "Boston College" },
      { seed: 3, name: "Liberty" },
      { seed: 4, name: "LIU" },
    ],
    fridayGames: [
      { game: 1, matchup: "#2 Boston College vs #3 Liberty", ctTime: "1:00 PM CT", network: "ESPN+" },
      { game: 2, matchup: "#1 Georgia vs #4 LIU", ctTime: "6:00 PM CT", network: "SECN" },
    ],
  },
  {
    natlSeed: 4, regional: "Auburn Regional", host: "Auburn", venue: "Plainsman Park",
    teams: [
      { seed: 1, name: "Auburn", record: "38-19" },
      { seed: 2, name: "UCF" },
      { seed: 3, name: "NC State" },
      { seed: 4, name: "Milwaukee" },
    ],
    fridayGames: [
      { game: 1, matchup: "#1 Auburn vs #4 Milwaukee", ctTime: "12:00 PM CT", network: "ESPN+" },
      { game: 2, matchup: "#2 UCF vs #3 NC State", ctTime: "5:00 PM CT", network: "ESPNU" },
    ],
  },
  {
    natlSeed: 5, regional: "Chapel Hill Regional", host: "North Carolina", venue: "Boshamer Stadium",
    teams: [
      { seed: 1, name: "North Carolina", record: "45-11-1" },
      { seed: 2, name: "Tennessee" },
      { seed: 3, name: "East Carolina" },
      { seed: 4, name: "VCU" },
    ],
    fridayGames: [
      { game: 1, matchup: "#2 Tennessee vs #3 East Carolina", ctTime: "11:00 AM CT", network: "ESPNU" },
      { game: 2, matchup: "#1 North Carolina vs #4 VCU", ctTime: "4:00 PM CT", network: "ESPN+" },
    ],
  },
  {
    natlSeed: 6, regional: "Austin Regional", host: "Texas", venue: "UFCU Disch-Falk Field",
    teams: [
      { seed: 1, name: "Texas", record: "40-13" },
      { seed: 2, name: "UC Santa Barbara" },
      { seed: 3, name: "Tarleton State" },
      { seed: 4, name: "Holy Cross" },
    ],
    fridayGames: [
      { game: 1, matchup: "#1 Texas vs #4 Holy Cross", ctTime: "12:00 PM CT", network: "SECN" },
      { game: 2, matchup: "#2 UC Santa Barbara vs #3 Tarleton State", ctTime: "5:00 PM CT", network: "ESPN+" },
    ],
  },
  {
    natlSeed: 7, regional: "Tuscaloosa Regional", host: "Alabama", venue: "Sewell-Thomas Stadium",
    teams: [
      { seed: 1, name: "Alabama", record: "37-19" },
      { seed: 2, name: "Oklahoma State" },
      { seed: 3, name: "USC Upstate" },
      { seed: 4, name: "Alabama State" },
    ],
    fridayGames: [
      { game: 1, matchup: "#2 Oklahoma State vs #3 USC Upstate", ctTime: "1:00 PM CT", network: "ESPN+" },
      { game: 2, matchup: "#1 Alabama vs #4 Alabama State", ctTime: "6:00 PM CT", network: "ESPN+" },
    ],
  },
  {
    natlSeed: 8, regional: "Gainesville Regional", host: "Florida", venue: "Condron Ballpark",
    teams: [
      { seed: 1, name: "Florida", record: "39-19" },
      { seed: 2, name: "Miami (FL)" },
      { seed: 3, name: "Troy" },
      { seed: 4, name: "Rider" },
    ],
    fridayGames: [
      { game: 1, matchup: "#1 Florida vs #4 Rider", ctTime: "12:00 PM CT", network: "ESPN+" },
      { game: 2, matchup: "#2 Miami (FL) vs #3 Troy", ctTime: "5:00 PM CT", network: "ACCN" },
    ],
  },
  {
    natlSeed: 9, regional: "Hattiesburg Regional", host: "Southern Mississippi", venue: "Pete Taylor Park",
    teams: [
      { seed: 1, name: "Southern Mississippi", record: "44-15" },
      { seed: 2, name: "TBA" },
      { seed: 3, name: "TBA" },
      { seed: 4, name: "Little Rock" },
    ],
    fridayGames: [
      { game: 1, matchup: "#1 Southern Miss vs #4 Little Rock", ctTime: "1:00 PM CT", network: "ESPN+" },
      { game: 2, matchup: "#2 vs #3 (TBD)", ctTime: "TBD", network: "ESPN+" },
    ],
  },
  { natlSeed: 10, regional: "Tallahassee Regional", host: "Florida State", venue: "Dick Howser Stadium", teams: [{seed:1,name:"Florida State",record:"38-17"}], fridayGames: [] },
  { natlSeed: 11, regional: "Eugene Regional", host: "Oregon", venue: "PK Park", teams: [{seed:1,name:"Oregon",record:"40-16"}], fridayGames: [] },
  { natlSeed: 12, regional: "College Station Regional", host: "Texas A&M", venue: "Olsen Field", teams: [{seed:1,name:"Texas A&M",record:"39-14"}], fridayGames: [] },
  { natlSeed: 13, regional: "Lincoln Regional", host: "Nebraska", venue: "Haymarket Park", teams: [{seed:1,name:"Nebraska",record:"42-15"}], fridayGames: [] },
  { natlSeed: 14, regional: "Starkville Regional", host: "Mississippi State", venue: "Dudy Noble Field", teams: [{seed:1,name:"Mississippi State",record:"40-17"}], fridayGames: [] },
  { natlSeed: 15, regional: "Lawrence Regional", host: "Kansas", venue: "Hoglund Ballpark", teams: [{seed:1,name:"Kansas",record:"42-16"}], fridayGames: [] },
  { natlSeed: 16, regional: "Morgantown Regional", host: "West Virginia", venue: "Kendrick Family Ballpark", teams: [{seed:1,name:"West Virginia",record:"39-14"}], fridayGames: [] },
];

const MCWS_NIL: NILPlayer[] = [
  { name: "Roch Cholowsky", team: "UCLA", position: "IF", context: "#1 nat'l seed · projected top 2026 MLB Draft pick · major card deals", tier: "Elite" },
  { name: "Liam Peterson", team: "Florida", position: "P", context: "#8 nat'l seed · top-selling NIL Store jersey · ~$100K cards", tier: "Elite" },
  { name: "Drew Burress", team: "Georgia Tech", position: "OF", context: "#2 nat'l seed · Associated Credit Union deal", tier: "High" },
  { name: "Vance Honeycutt", team: "UNC", position: "OF", context: "#5 nat'l seed · On3 NIL ranked #28", tier: "High" },
  { name: "Caden Sorrell", team: "Texas A&M", position: "OF", context: "#12 nat'l seed · SportsGrid est. $850K+", tier: "Elite" },
  { name: "Travis Chestnut", team: "Texas A&M", position: "IF", context: "#12 nat'l seed · $350K+", tier: "High" },
  { name: "Tegan Kuhns", team: "Tennessee", position: "P", context: "Chapel Hill 2-seed · RallyFuel watch list", tier: "Rising" },
  { name: "Cade Brown", team: "Georgia Tech", position: "P", context: "#2 nat'l seed · On3 #23", tier: "High" },
  { name: "Gavin Grahovac", team: "Texas A&M", position: "IF", context: "#12 nat'l seed · power-bat NIL", tier: "Rising" },
];

// ───────────────────────────────────────────────────────────────────────────
// WCWS — Women's College World Series 2026 (already in OKC, started May 28)
// ───────────────────────────────────────────────────────────────────────────

const WCWS_TEAMS = [
  { seed: 1, name: "Alabama", note: "Overall #1 nat'l" },
  { seed: 2, name: "Texas", note: "Defending champion · elimination bracket · plays Nebraska 2pm CT today" },
  { seed: 4, name: "Nebraska", note: "Lost to Alabama · elimination bracket · plays Texas 2pm CT today" },
  { seed: 5, name: "Arkansas", note: "ELIMINATED · lost to UCLA 11-0" },
  { seed: 7, name: "Tennessee", note: "In semis · walk-off win over Texas Tech" },
  { seed: 8, name: "UCLA", note: "Elimination bracket · plays Texas Tech 6pm CT today" },
  { seed: 11, name: "Texas Tech", note: "Elimination bracket · plays UCLA 6pm CT today" },
  { seed: null, name: "Mississippi State", note: "ELIMINATED · lost to Texas 4-0" },
];

const WCWS_GAMES: WCWSGame[] = [
  // Thursday May 28 — completed
  { game: 1, matchup: "#11 Texas Tech vs Mississippi State", ctTime: "Final", date: "Thu May 28", network: "ESPN", result: "Texas Tech 8, Mississippi State 0" },
  { game: 2, matchup: "#7 Tennessee vs #2 Texas", ctTime: "Final", date: "Thu May 28", network: "ESPN", result: "Tennessee 6, Texas 3" },
  { game: 3, matchup: "#1 Alabama vs #8 UCLA", ctTime: "Final", date: "Thu May 28", network: "ESPN", result: "Alabama 6, UCLA 3" },
  { game: 4, matchup: "#4 Nebraska vs #5 Arkansas", ctTime: "Final", date: "Thu May 28", network: "ESPN", result: "Nebraska 5, Arkansas 3" },
  // Friday May 29 — completed
  { game: 5, matchup: "#2 Texas vs Mississippi State (elim)", ctTime: "Final", date: "Fri May 29", network: "ESPN", result: "Texas 4, Mississippi State 0 · MSU eliminated" },
  { game: 6, matchup: "#8 UCLA vs #5 Arkansas (elim)", ctTime: "Final", date: "Fri May 29", network: "ESPN2", result: "UCLA 11, Arkansas 0 (5) · Arkansas eliminated" },
  // Saturday May 30 — completed
  { game: 7, matchup: "#7 Tennessee vs #11 Texas Tech", ctTime: "Final (F/9)", date: "Sat May 30", network: "ABC", result: "Tennessee 2, Texas Tech 1 · Tennessee to semis" },
  { game: 8, matchup: "#1 Alabama vs #4 Nebraska", ctTime: "Final", date: "Sat May 30", network: "ESPN", result: "Alabama 5, Nebraska 1 · Alabama to semis" },
  // Sunday May 31 — TODAY · elimination doubleheader
  { game: 9, matchup: "#2 Texas vs #4 Nebraska (elim)", ctTime: "2:00 PM CT", date: "Sun May 31 · TODAY", network: "ABC" },
  { game: 10, matchup: "#8 UCLA vs #11 Texas Tech (elim)", ctTime: "6:00 PM CT", date: "Sun May 31 · TODAY", network: "ESPN2" },
  // Monday Jun 1 — semifinals
  { game: 11, matchup: "#7 Tennessee vs Winner G9", ctTime: "11:00 AM CT", date: "Mon Jun 1", network: "ESPN" },
  { game: 12, matchup: "Tennessee vs Winner G9 (if nec)", ctTime: "1:30 PM CT", date: "Mon Jun 1", network: "ESPN" },
  { game: 13, matchup: "#1 Alabama vs Winner G10", ctTime: "6:00 PM CT", date: "Mon Jun 1", network: "ESPN2" },
  { game: 14, matchup: "Alabama vs Winner G10 (if nec)", ctTime: "8:30 PM CT", date: "Mon Jun 1", network: "ESPN2" },
  // Finals
  { game: 15, matchup: "Championship Series Game 1", ctTime: "7:00 PM CT", date: "Wed Jun 3", network: "ESPN" },
  { game: 16, matchup: "Championship Series Game 2", ctTime: "7:00 PM CT", date: "Thu Jun 4", network: "ESPN" },
  { game: 17, matchup: "Championship Series Game 3 (if nec)", ctTime: "7:00 PM CT", date: "Fri Jun 5", network: "ESPN" },
];

const WCWS_NIL: NILPlayer[] = [
  { name: "Reese Atwood", team: "Texas", position: "C", context: "Defending champion catcher · top SEC bat", tier: "Elite" },
  { name: "Kavan Markwood", team: "Alabama", position: "IF", context: "Overall #1 seed program", tier: "Elite" },
  { name: "Megan Grant", team: "UCLA", position: "Power Bat", context: "12-time national champion program", tier: "High" },
  { name: "Bri Ellis", team: "Arkansas", position: "IF", context: "Prior WCWS standout · power bat", tier: "Elite" },
  { name: "Karlyn Pickens", team: "Tennessee", position: "P", context: "Top SEC pitcher · led Tennessee past Texas in G2", tier: "Elite" },
  { name: "Mihyia Davis", team: "Mississippi State", position: "Utility", context: "Cinderella story · Bulldogs took down Oklahoma in supers", tier: "Rising" },
];

const WCWS_ABSENT = [
  "#3 Oklahoma (4-time defending champ before 2025 · OUT — lost super to Mississippi State)",
  "#6 Florida (OUT — lost super to Texas Tech)",
  "#9 Florida State", "#10 Georgia", "#12 Duke",
  "#13 Oklahoma State", "#14 Oregon", "#15 Texas A&M", "#16 LSU",
];

// ───────────────────────────────────────────────────────────────────────────
// ESPN live scoreboard fetcher
// ───────────────────────────────────────────────────────────────────────────

function useESPNScoreboard(sport: "baseball" | "softball") {
  const [games, setGames] = useState<ESPNGame[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const path = sport === "baseball"
      ? "https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard"
      : "https://site.api.espn.com/apis/site/v2/sports/softball/college-softball/scoreboard";

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
  }, [sport]);

  return { games, updatedAt, error };
}

// ───────────────────────────────────────────────────────────────────────────
// Subcomponents
// ───────────────────────────────────────────────────────────────────────────

function TabSwitcher({ active }: { active: "mcws" | "wcws" }) {
  return (
    <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-1">
      <Link href="/brackets/mcws">
        <a className={`px-4 py-2 text-sm font-semibold tracking-wide rounded-t transition ${
          active === "mcws"
            ? "bg-[#1E90FF] text-white shadow-[0_0_24px_-4px_rgba(30,144,255,0.6)]"
            : "text-white/60 hover:text-white"
        }`}>
          MEN · ROAD TO OMAHA
        </a>
      </Link>
      <Link href="/brackets/wcws">
        <a className={`px-4 py-2 text-sm font-semibold tracking-wide rounded-t transition ${
          active === "wcws"
            ? "bg-[#1E90FF] text-white shadow-[0_0_24px_-4px_rgba(30,144,255,0.6)]"
            : "text-white/60 hover:text-white"
        }`}>
          WOMEN'S COLLEGE WORLD SERIES
        </a>
      </Link>
      <div className="ml-auto text-[10px] uppercase tracking-[0.18em] text-white/40">
        AthlynX — Men. Women. Every athlete.
      </div>
    </div>
  );
}

function ChaosBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* CHAOS — UCLA upset */}
      <div className="relative overflow-hidden rounded-lg border-2 border-[#1E90FF] bg-gradient-to-br from-[#0a1628] via-black to-[#0a1628] p-5 shadow-[0_0_32px_-8px_rgba(30,144,255,0.55)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">CHAOS IN THE BRACKET</span>
          <span className="text-[10px] tracking-widest uppercase text-white/40">Los Angeles Regional · Game 1 · FINAL</span>
        </div>
        <p className="text-2xl font-black tracking-tight text-white leading-tight mb-2">
          Saint Mary's <span className="text-[#1E90FF]">3</span>, UCLA <span className="text-white/70">2</span>
        </p>
        <p className="text-sm text-white/75 leading-snug mb-2">
          The No. 1 overall national seed went down in Game 1. First time a No. 1 national seed has lost its regional opener since seeding began in 1999.
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#88a8ff]">
          That's how fast it flips when the lights come on in late May.
        </p>
      </div>

      {/* BUSINESS — Mississippi State */}
      <div className="relative overflow-hidden rounded-lg border border-[#1E90FF]/40 bg-gradient-to-br from-black via-[#0a1628] to-black p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#1E90FF] border border-[#1E90FF] px-2 py-1 rounded">BUSINESS IN STARKVILLE</span>
          <span className="text-[10px] tracking-widest uppercase text-white/40">Dudy Noble Field · Game 1 · FINAL</span>
        </div>
        <p className="text-2xl font-black tracking-tight text-white leading-tight mb-2">
          #14 Mississippi State <span className="text-[#1E90FF]">10</span>, Lipscomb <span className="text-white/70">1</span>
        </p>
        <p className="text-sm text-white/75 leading-snug mb-2">
          Six hits allowed, bats rolling. The complete, focused start you want when the Road to Omaha runs through your own backyard.
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#88a8ff]">
          Nobody remembers the seed line in June. They remember who showed up.
        </p>
      </div>
    </div>
  );
}

function LiveBadge({ status }: { status: ESPNGame["status"] }) {
  if (status === "in")
    return <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-[#1E90FF] px-1.5 py-0.5 rounded animate-pulse">LIVE</span>;
  if (status === "post")
    return <span className="text-[10px] font-bold tracking-widest uppercase text-white/70 bg-white/10 px-1.5 py-0.5 rounded">FINAL</span>;
  return <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 bg-white/5 px-1.5 py-0.5 rounded">UPCOMING</span>;
}

function LiveScoreStrip({ sport }: { sport: "baseball" | "softball" }) {
  const { games, updatedAt, error } = useESPNScoreboard(sport);
  const liveGames = useMemo(() => games.filter((g) => g.status === "in"), [games]);
  const displayGames = liveGames.length > 0 ? liveGames : games.slice(0, 6);

  return (
    <div className="border border-white/10 rounded-lg bg-black/40 p-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#88a8ff]">
          Live Scoreboard
        </h3>
        <span className="text-[10px] text-white/40">
          {updatedAt ? `Last updated · ${updatedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })} CT` : "Loading…"}
        </span>
      </div>
      {error && (
        <div className="text-xs text-white/50 italic">Live scores will appear when games begin. ({error})</div>
      )}
      {!error && displayGames.length === 0 && (
        <div className="text-xs text-white/50 italic">No games on the wire yet — first pitch coming up.</div>
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

function NILPanel({ players, sportLabel }: { players: NILPlayer[]; sportLabel: string }) {
  return (
    <aside className="border border-[#1E90FF]/30 rounded-lg bg-gradient-to-b from-[#0a1628] to-black p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#1E90FF]">
            AthlynX NIL Overlay · {sportLabel}
          </h3>
          <p className="text-[11px] text-white/50 mt-1">Top NIL valuations of players currently in the field.</p>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-white/30">athlynx.ai</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {players.map((p) => (
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
        NIL valuations are public estimates aggregated from On3, RallyFuel, and SportsGrid — not disclosed contracts. Player names listed for editorial use only. Team logos and identifiers belong to their respective institutions.
      </p>
    </aside>
  );
}

function RegionalCard({ r }: { r: Regional }) {
  return (
    <div className="border border-white/10 rounded-lg bg-black/40 p-4 hover:border-[#1E90FF]/40 transition">
      <div className="flex items-baseline justify-between mb-2">
        <h4 className="text-base font-bold text-white">{r.regional}</h4>
        {r.natlSeed && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E90FF]">
            Nat'l #{r.natlSeed}
          </span>
        )}
      </div>
      <div className="text-[11px] text-white/50 mb-3">{r.host} · {r.venue}</div>
      <ul className="text-sm space-y-1 mb-3">
        {r.teams.map((t) => (
          <li key={t.name} className="flex items-center justify-between">
            <span className="text-white">#{t.seed} {t.name}</span>
            {t.record && <span className="text-[11px] text-white/40 font-mono">{t.record}</span>}
          </li>
        ))}
      </ul>
      {r.fridayGames.length > 0 && (
        <div className="border-t border-white/10 pt-3 space-y-1">
          {r.fridayGames.map((g) => (
            <div key={g.game} className="text-[11px] text-white/70 leading-snug">
              <span className="text-[#88a8ff] font-semibold">G{g.game}:</span> {g.matchup}
              <span className="text-white/40"> · {g.ctTime} · {g.network}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MCWSView() {
  return (
    <>
      <header className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-2">
          2026 NCAA Division I Baseball Championship · Road to Omaha
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
          MEN'S COLLEGE WORLD SERIES
        </h1>
        <div className="text-base md:text-lg font-bold text-[#00C2FF] tracking-tight mb-3">
          Regionals Live · 64 Teams · 16 Hosts · Double-Elimination
        </div>
        <p className="text-sm text-white/60 max-w-2xl">
          Tonight's games run from 11 a.m. CT through 9 p.m. CT. Live scores auto-refresh every 60 seconds during game windows. Super Regionals tip off Friday, June 5. Reigning champion LSU is OUT of the 2026 field.
        </p>
      </header>

      <LiveScoreStrip sport="baseball" />
      <NILPanel players={MCWS_NIL} sportLabel="Men's Baseball" />

      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
          ROAD TO OMAHA
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Regional Bracket · Top-16 National Seeds
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {MCWS_REGIONALS.map((r) => <RegionalCard key={r.regional} r={r} />)}
      </div>

      <div className="border border-white/10 rounded-lg bg-black/40 p-5 mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
            ROAD TO OMAHA
          </span>
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#88a8ff]">
            Super Regionals · Best-of-three
          </h3>
        </div>
        <p className="text-xs text-white/50">
          Pairings announced Monday June 1 night, after 16 regional winners are decided. Super Regionals begin Friday June 5. Top-8 national seeds host if they advance.
        </p>
      </div>

      <div className="border border-[#1E90FF]/30 rounded-lg bg-gradient-to-br from-[#0a1628] via-black to-black p-5 mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
            ROAD TO OMAHA · DESTINATION
          </span>
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#88a8ff]">
            College World Series
          </h3>
        </div>
        <p className="text-xs text-white/50">
          Eight teams arrive at Charles Schwab Field Omaha · June 13. Best-of-three Championship Finals June 22–24.
        </p>
      </div>
    </>
  );
}

function WCWSView() {
  return (
    <>
      <header className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-2">
          2026 NCAA Division I Softball Championship · Devon Park · Oklahoma City
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
          WOMEN'S COLLEGE WORLD SERIES
        </h1>
        <div className="text-base md:text-lg font-bold text-[#00C2FF] tracking-tight mb-3">
          Semifinals Loaded · 8 Teams · Double-Elimination · OKC
        </div>
        <p className="text-sm text-white/60 max-w-2xl">
          Tennessee and Alabama have punched winners-bracket tickets. Today's elimination doubleheader: Texas vs. Nebraska (2 p.m. CT, ABC) and UCLA vs. Texas Tech (6 p.m. CT, ESPN2). Live scores auto-refresh every 60 seconds. Championship Series June 3–5.
        </p>
      </header>

      <LiveScoreStrip sport="softball" />
      <NILPanel players={WCWS_NIL} sportLabel="Women's Softball" />

      <h2 className="text-lg font-bold text-white tracking-tight mb-4">
        Teams in Oklahoma City
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {WCWS_TEAMS.map((t) => (
          <div key={t.name} className="border border-white/10 rounded-lg bg-black/40 p-3 hover:border-[#1E90FF]/40 transition">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm font-bold text-white">{t.name}</span>
              {t.seed && <span className="text-[10px] font-bold text-[#1E90FF]">#{t.seed}</span>}
            </div>
            <div className="text-[10px] text-white/50 leading-snug">{t.note}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-white tracking-tight mb-4">
        Double-Elimination Bracket
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {WCWS_GAMES.map((g) => {
          const isToday = g.date.includes("TODAY");
          return (
            <div
              key={g.game}
              className={`border rounded-lg p-3 transition ${
                isToday
                  ? "border-[#1E90FF] bg-[#1E90FF]/5 shadow-[0_0_24px_-4px_rgba(30,144,255,0.5)]"
                  : "border-white/10 bg-black/40 hover:border-[#1E90FF]/40"
              }`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#88a8ff]">
                  Game {g.game} · {g.date}
                </span>
                <span className="text-[10px] text-white/40">{g.network}</span>
              </div>
              <div className="text-sm text-white mb-1">{g.matchup}</div>
              {g.result ? (
                <div className="text-[11px] font-mono text-[#88a8ff]">{g.result}</div>
              ) : (
                <div className="text-[11px] text-white/50">{g.ctTime}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border border-white/10 rounded-lg bg-black/40 p-5 mb-10">
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#88a8ff] mb-3">
          Top-16 National Seeds NOT in OKC
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-white/60">
          {WCWS_ABSENT.map((a) => (
            <li key={a} className="leading-snug">• {a}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────────

export default function Brackets() {
  const [isMCWS] = useRoute("/brackets/mcws");
  const [isWCWS] = useRoute("/brackets/wcws");

  // Default routing logic: 11a–5p CT → MCWS, else WCWS through June 5, then MCWS
  const defaultTab = useMemo<"mcws" | "wcws">(() => {
    const now = new Date();
    const ctHour = parseInt(now.toLocaleString("en-US", { timeZone: "America/Chicago", hour: "2-digit", hour12: false }), 10);
    const month = now.getMonth(); // 0-indexed
    const day = now.getDate();
    const isWCWSWindow = (month === 4 && day >= 28) || (month === 5 && day <= 5); // May 28 – Jun 5
    if (isWCWSWindow && ctHour >= 17) return "wcws";
    if (isWCWSWindow && ctHour < 11) return "wcws";
    return "mcws";
  }, []);

  const active: "mcws" | "wcws" = isMCWS ? "mcws" : isWCWS ? "wcws" : defaultTab;

  useEffect(() => {
    document.title = active === "mcws"
      ? "MCWS 2026 — Live Bracket · AthlynX"
      : "WCWS 2026 — Live Bracket · AthlynX";
  }, [active]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a1628] to-black text-white">
      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Owl mark / brand strip */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <img
                src="/athlynx-app-icon.png"
                alt="AthlynX"
                className="w-10 h-10 rounded-lg ring-1 ring-[#1E90FF]/40 group-hover:ring-[#1E90FF] transition"
              />
              <div>
                <div className="text-sm font-bold tracking-widest text-white">AthlynX<span className="text-[#1E90FF]">XAI</span></div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#1E90FF]">The Athlete's Playbook</div>
              </div>
            </a>
          </Link>
          <div className="text-[10px] uppercase tracking-widest text-white/40">athlynx.ai/brackets</div>
        </div>

        <TabSwitcher active={active} />

        <ChaosBanner />

        <LiveRegionalScoreboard sport={active === "wcws" ? "softball" : "baseball"} />

        <RegionalBracketTree sport={active === "wcws" ? "softball" : "baseball"} />

        {active === "mcws" ? <MCWSView /> : <WCWSView />}

        {/* Live Highlights Feed — official video clips + AthlynX originals (May 31, 2026) */}
        <div className="mt-10">
          <LiveHighlightsFeed mode={active === "mcws" ? "mcws" : "wcws"} compact />
        </div>

        {/* Footer signoff — brand lock (May 27 cleanup: retired 'Complete Athlete Ecosystem') */}
        <footer className="border-t border-white/10 pt-6 mt-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-1">
            ATHLYNX · THE ATHLETE'S PLAYBOOK
          </p>
          <p className="text-[11px] text-white/50 mb-3">One identity. Every athlete. Every platform.</p>
        </footer>
      </div>
    </div>
  );
}
