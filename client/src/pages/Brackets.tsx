// Brackets — MCWS Road to Omaha 2026 + WCWS Champions Banner
// Updated Jun 6, 2026 · AthlynX — ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.
// Brand lock: true black + electric cobalt + white. No gold/yellow/orange. No standalone X glyph.

import { useState, useEffect, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { RegionalBracketTree } from "@/components/RegionalBracketTree";
import LiveHighlightsFeed from "@/components/LiveHighlightsFeed";
import LiveBracketBanner from "@/components/LiveBracketBanner";

// ───────────────────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────────────────

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
// MCWS 2026 — 8 teams advancing to Omaha (Super Regionals complete Jun 6)
// ───────────────────────────────────────────────────────────────────────────

const MCWS_FIELD = [
  { seed: 1, name: "Georgia",        site: "Athens Super Regional",      result: "Advances to Omaha" },
  { seed: 2, name: "USC",            site: "Chapel Hill Super Regional",  result: "Advances to Omaha" },
  { seed: 3, name: "Texas",          site: "Austin Super Regional",       result: "Advances to Omaha" },
  { seed: 4, name: "Ole Miss",       site: "Auburn Super Regional",       result: "Ole Miss 6, Auburn 4 — Leads 1-0" },
  { seed: 5, name: "Kansas",         site: "Lawrence Super Regional",     result: "Advances to Omaha" },
  { seed: 6, name: "West Virginia",  site: "Morgantown Super Regional",   result: "Advances to Omaha" },
  { seed: 7, name: "Alabama",        site: "Tuscaloosa Super Regional",   result: "Advances to Omaha" },
  { seed: 8, name: "Troy",           site: "Troy Super Regional",         result: "Advances to Omaha" },
];

// ───────────────────────────────────────────────────────────────────────────
// WCWS 2026 — All 8 teams that competed in Oklahoma City
// ───────────────────────────────────────────────────────────────────────────

const WCWS_FIELD = [
  { seed: 1,    name: "Alabama",          result: "Eliminated · Semifinals",                champion: false },
  { seed: 2,    name: "Texas",            result: "🏆 2026 WCWS NATIONAL CHAMPIONS",         champion: true  },
  { seed: 4,    name: "Nebraska",         result: "Eliminated",                              champion: false },
  { seed: 5,    name: "Arkansas",         result: "Eliminated · Lost to UCLA 11-0",          champion: false },
  { seed: 7,    name: "Tennessee",        result: "Eliminated · Semifinals",                 champion: false },
  { seed: 8,    name: "UCLA",             result: "Eliminated",                              champion: false },
  { seed: 11,   name: "Texas Tech",       result: "Runner-Up · Championship Series 0-2",     champion: false },
  { seed: null, name: "Mississippi State",result: "Eliminated · Lost to Texas 4-0",          champion: false },
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
        if (!cancelled) { setGames(parsed); setUpdatedAt(new Date()); setError(null); }
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Live scores temporarily unavailable");
      }
    }

    fetchScoreboard();
    const t = setInterval(fetchScoreboard, 300_000);
    return () => { cancelled = true; clearInterval(t); };
  }, [sport]);

  return { games, updatedAt, error };
}

// ───────────────────────────────────────────────────────────────────────────
// Live Score Strip
// ───────────────────────────────────────────────────────────────────────────

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
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#88a8ff]">Live Scoreboard</h3>
        <span className="text-[10px] text-white/40">
          {updatedAt ? `Updated · ${updatedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })} CT` : "Loading…"}
        </span>
      </div>
      {error && <div className="text-xs text-white/50 italic">Live scores will appear when games begin.</div>}
      {!error && displayGames.length === 0 && <div className="text-xs text-white/50 italic">No games on the wire — first pitch coming up.</div>}
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

// ───────────────────────────────────────────────────────────────────────────
// Tab Switcher
// ───────────────────────────────────────────────────────────────────────────

function TabSwitcher({ active }: { active: "mcws" | "wcws" }) {
  return (
    <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-1">
      <Link
        href="/brackets/mcws"
        className={`px-4 py-2 text-sm font-semibold tracking-wide rounded-t transition ${
          active === "mcws"
            ? "bg-[#1E90FF] text-white shadow-[0_0_24px_-4px_rgba(30,144,255,0.6)]"
            : "text-white/60 hover:text-white"
        }`}
      >
        MEN · ROAD TO OMAHA
      </Link>
      <Link
        href="/brackets/wcws"
        className={`px-4 py-2 text-sm font-semibold tracking-wide rounded-t transition ${
          active === "wcws"
            ? "bg-[#1E90FF] text-white shadow-[0_0_24px_-4px_rgba(30,144,255,0.6)]"
            : "text-white/60 hover:text-white"
        }`}
      >
        WOMEN'S · WCWS CHAMPIONS
      </Link>
      <div className="ml-auto text-[10px] uppercase tracking-[0.18em] text-white/40">
        AthlynX — Men. Women. Every athlete.
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// MCWS View — Road to Omaha
// ───────────────────────────────────────────────────────────────────────────

function MCWSView() {
  return (
    <>
      <header className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-2">
          2026 NCAA Division I Baseball Championship · Road to Omaha
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
          MEN'S COLLEGE WORLD SERIES
        </h1>
        <div className="text-base md:text-lg font-bold text-[#00C2FF] tracking-tight mb-3">
          Super Regionals Complete · 8 Teams Advance · Charles Schwab Field · Jun 13
        </div>
        <p className="text-sm text-white/60 max-w-2xl">
          All 8 Super Regional series are complete. Eight teams advance to Charles Schwab Field Omaha for the Men's College World Series beginning June 13. Reigning champion LSU is OUT of the 2026 field.
        </p>
      </header>

      <LiveScoreStrip sport="baseball" />

      {/* MCWS Field — 8 teams */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
          OMAHA BOUND
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">
          2026 MCWS Field · Charles Schwab Field · Jun 13
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {MCWS_FIELD.map((t) => (
          <div key={t.name} className="border border-white/10 rounded-lg bg-black/40 p-4 hover:border-[#1E90FF]/50 transition flex items-center gap-4">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase bg-[#1E90FF] text-black px-1.5 py-0.5 rounded shrink-0">
              #{t.seed}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-base font-black text-white">{t.name}</div>
              <div className="text-[10px] text-white/40 truncate">{t.site}</div>
            </div>
            <div className="text-[11px] font-semibold text-[#88a8ff] text-right shrink-0">{t.result}</div>
          </div>
        ))}
      </div>

      {/* CWS Destination card */}
      <div className="border border-[#1E90FF]/30 rounded-lg bg-gradient-to-br from-[#0a1628] via-black to-black p-5 mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
            DESTINATION
          </span>
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#88a8ff]">
            Charles Schwab Field Omaha
          </h3>
        </div>
        <p className="text-xs text-white/50">
          Eight teams arrive at Charles Schwab Field Omaha · June 13. Double-elimination pool play leads to best-of-three Championship Finals June 22–24.
        </p>
      </div>
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// WCWS View — Texas Back-to-Back Champions Banner + All Teams
// ───────────────────────────────────────────────────────────────────────────

function WCWSView() {
  return (
    <>
      {/* ── CHAMPIONSHIP BANNER ── */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#1E90FF] bg-gradient-to-br from-[#000814] via-[#051432] to-black shadow-[0_0_60px_-8px_rgba(30,144,255,0.6)] mb-10 p-8 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E90FF]/10 via-transparent to-[#00C2FF]/10 pointer-events-none" />
        <div className="relative">
          <div className="text-[11px] font-black tracking-[0.3em] uppercase text-[#1E90FF] mb-3">
            2026 NCAA Division I Softball Championship · Devon Park · Oklahoma City
          </div>
          <div className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-2">
            🏆 TEXAS
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#1E90FF] tracking-tight mb-4">
            BACK-TO-BACK NATIONAL CHAMPIONS
          </div>
          <div className="text-base font-bold text-white/80 mb-2">
            2025 · 2026 · WCWS Champions
          </div>
          <div className="text-sm text-white/60 mb-6 max-w-xl mx-auto">
            The Texas Longhorns swept the Championship Series 2-0, defeating Texas Tech 7-3 and 4-1. Consecutive national titles. The standard is set.
          </div>
          <div className="inline-flex items-center gap-2 bg-[#1E90FF]/20 border border-[#1E90FF]/40 rounded-full px-5 py-2">
            <span className="text-[11px] font-black tracking-widest uppercase text-[#1E90FF]">Championship Series Final</span>
            <span className="text-[11px] font-mono font-bold text-white">Texas 2–0 Texas Tech</span>
          </div>
        </div>
      </div>

      {/* ── CONGRATULATIONS TO ALL TEAMS ── */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
          OKLAHOMA CITY 2026
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Congratulations to All 8 Teams
        </h2>
      </div>
      <p className="text-sm text-white/50 mb-5 max-w-2xl">
        Eight of the best programs in college softball competed at Devon Park. Every team, every player, every coaching staff — you represented the game at its highest level. Congratulations.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {WCWS_FIELD.map((t) => (
          <div
            key={t.name}
            className={`relative border rounded-lg p-4 transition ${
              t.champion
                ? "border-[#1E90FF] bg-gradient-to-br from-[#0a1628] to-black shadow-[0_0_32px_-4px_rgba(30,144,255,0.45)]"
                : "border-white/10 bg-black/40 hover:border-[#1E90FF]/30"
            }`}
          >
            {t.champion && (
              <div className="absolute top-3 right-3">
                <span className="text-[9px] font-black tracking-widest uppercase bg-[#1E90FF] text-white px-2 py-0.5 rounded">
                  CHAMPIONS
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              {t.seed && (
                <span className="text-[10px] font-black tracking-[0.22em] uppercase bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/30 px-1.5 py-0.5 rounded shrink-0">
                  #{t.seed}
                </span>
              )}
              <div>
                <div className={`text-base font-black ${t.champion ? "text-white" : "text-white/90"}`}>{t.name}</div>
                <div className={`text-[11px] mt-0.5 ${t.champion ? "text-[#1E90FF] font-semibold" : "text-white/50"}`}>{t.result}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── SERIES RESULTS ── */}
      <div className="border border-white/10 rounded-lg bg-black/40 p-5 mb-10">
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#88a8ff] mb-4">Championship Series Results</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <div className="text-sm font-bold text-white">Game 1 · Wed Jun 3 · ESPN</div>
              <div className="text-[11px] text-white/50">#1 Texas vs #11 Texas Tech · Devon Park · OKC</div>
            </div>
            <div className="text-sm font-mono font-bold text-[#1E90FF]">Texas 7, Texas Tech 3</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Game 2 · Thu Jun 4 · ESPN</div>
              <div className="text-[11px] text-white/50">#1 Texas vs #11 Texas Tech · Devon Park · OKC</div>
            </div>
            <div className="text-sm font-mono font-bold text-[#1E90FF]">Texas 4, Texas Tech 1 🏆</div>
          </div>
        </div>
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

  const active: "mcws" | "wcws" = isWCWS ? "wcws" : "mcws";

  useEffect(() => {
    document.title = active === "mcws"
      ? "MCWS 2026 — Road to Omaha · AthlynX"
      : "WCWS 2026 — Texas Back-to-Back Champions · AthlynX";
  }, [active]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a1628] to-black text-white">

      {/* ── HERO BANNERS ── */}
      <div className="w-full">
        {/* MCWS Hero */}
        <Link href="/brackets/mcws" className="block w-full group">
          <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#000814] via-[#051432] to-black border-b-2 border-[#1E90FF]/60 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E90FF]/10 via-transparent to-[#00C2FF]/5 pointer-events-none" />
            <div className="relative flex items-center justify-between px-5 py-5 md:px-10 md:py-7 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black tracking-[0.22em] uppercase bg-[#1E90FF] text-white px-2.5 py-1 rounded">LIVE</span>
                  <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#1E90FF]">MEN'S COLLEGE WORLD SERIES 2026</span>
                </div>
                <div className="text-2xl md:text-4xl font-black text-white tracking-tight leading-none">
                  ROAD TO <span className="text-[#1E90FF]">OMAHA</span>
                </div>
                <div className="text-xs md:text-sm font-bold text-white/60 tracking-wide">
                  8 TEAMS · CHARLES SCHWAB FIELD · BEGINS JUN 13
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#1E90FF] transition">
                  OPEN BRACKET →
                </span>
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-black border-2 border-[#1E90FF]/60 group-hover:border-[#1E90FF] transition flex items-center justify-center">
                  <img src="/athlynx-icon.png" alt="AthlynX" className="w-6 h-6 md:w-9 md:h-9" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* WCWS Champions Banner */}
        <Link href="/brackets/wcws" className="block w-full group">
          <div className="relative w-full overflow-hidden bg-gradient-to-br from-black via-[#0a0a24] to-[#000814] border-b border-[#1E90FF]/40 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E90FF]/8 via-transparent to-[#00C2FF]/5 pointer-events-none" />
            <div className="relative flex items-center justify-between px-5 py-5 md:px-10 md:py-7 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black tracking-[0.22em] uppercase bg-[#1E90FF] text-white px-2.5 py-1 rounded">🏆 FINAL</span>
                  <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#1E90FF]">WOMEN'S COLLEGE WORLD SERIES 2026</span>
                </div>
                <div className="text-2xl md:text-4xl font-black text-white tracking-tight leading-none">
                  TEXAS <span className="text-[#1E90FF]">BACK-TO-BACK</span>
                </div>
                <div className="text-xs md:text-sm font-bold text-white/60 tracking-wide">
                  2025 · 2026 NATIONAL CHAMPIONS · DEVON PARK · OKC
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#1E90FF] transition">
                  VIEW RESULTS →
                </span>
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-black border-2 border-[#1E90FF]/60 group-hover:border-[#1E90FF] transition flex items-center justify-center">
                  <img src="/athlynx-icon.png" alt="AthlynX" className="w-6 h-6 md:w-9 md:h-9" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Brand strip */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/athlynx-icon-neon.jpg"
              alt="AthlynX"
              className="w-10 h-10 rounded-lg ring-1 ring-[#1E90FF]/40 group-hover:ring-[#1E90FF] transition"
            />
            <div>
              <div className="text-sm font-bold tracking-widest text-white">AthlynX<span className="text-[#1E90FF]">XAI</span></div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#1E90FF]">The Athlete's Playbook</div>
            </div>
          </Link>
          <div className="text-[10px] uppercase tracking-widest text-white/40">athlynx.ai/brackets</div>
        </div>

        <TabSwitcher active={active} />

        {/* Visual bracket banner */}
        <div className="-mx-5 mb-6">
          <LiveBracketBanner />
        </div>

        {/* Bracket tree */}
        <RegionalBracketTree sport={active === "wcws" ? "softball" : "baseball"} />

        {/* Tab content */}
        {active === "mcws" ? <MCWSView /> : <WCWSView />}

        {/* Live Highlights */}
        <div className="mt-10">
          <LiveHighlightsFeed mode={active === "mcws" ? "mcws" : "wcws"} compact />
        </div>

        <footer className="border-t border-white/10 pt-6 mt-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-1">
            ATHLYNX · THE ATHLETE'S PLAYBOOK
          </p>
          <p className="text-[11px] text-white/50">One identity. Every athlete. Every platform.</p>
        </footer>
      </div>
    </div>
  );
}
