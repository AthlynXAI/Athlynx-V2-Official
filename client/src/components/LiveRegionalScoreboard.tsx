/**
 * AthlynX · Live Regional Scoreboard
 *
 * Always-on, auto-refreshing scoreboard for NCAA Baseball + Softball
 * championship play. Sits at the top of every brackets route during
 * regional, super-regional, and CWS/WCWS weeks.
 *
 * Built May 29, 2026 · Brand-locked: cobalt #1E90FF + true black + white.
 * No gold, no yellow, no orange. No standalone X glyph.
 *
 * Author: Chad A. Dozier Sr. <chaddozier75@gmail.com>
 * Signoff:  */

import { useEffect, useMemo, useState } from "react";
import {
  WCWS_MANUAL_FEED,
  WCWS_FEED_SOURCE_LABEL,
  type WcwsManualGame,
} from "@/lib/wcwsBracketFallback";

type Sport = "baseball" | "softball";

type ESPNTeam = {
  homeAway: "home" | "away";
  score?: string;
  curatedRank?: { current?: number };
  team?: {
    shortDisplayName?: string;
    displayName?: string;
    abbreviation?: string;
    logo?: string;
  };
};

type ESPNEvent = {
  id: string;
  date: string;
  competitions: Array<{
    status?: { type?: { state?: string; shortDetail?: string; detail?: string } };
    competitors?: ESPNTeam[];
    notes?: Array<{ headline?: string }>;
    venue?: { fullName?: string };
  }>;
};

type GameRow = {
  id: string;
  state: "pre" | "in" | "post";
  detail: string;
  regional: string;
  bracketType: "Winners" | "Elimination" | "Final" | "Game";
  /** Team that punched their Super Regional ticket in this game (per ESPN note). */
  advancesToSuper?: string;
  date: string;
  ctDateLabel: string;
  ctTimeLabel: string;
  home: { name: string; rank?: number; score?: string };
  away: { name: string; rank?: number; score?: string };
};

const ESPN_BASEBALL = "https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard";
const ESPN_SOFTBALL = "https://site.api.espn.com/apis/site/v2/sports/softball/college-softball/scoreboard";

function yyyymmdd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function parseRegional(note: string): { regional: string; bracketType: GameRow["bracketType"] } {
  // Notes look like: "NCAA Baseball Championship - Starkville Regional - Elimination Game"
  const parts = note.split(" - ").map((s) => s.trim());
  const regional = parts.find((p) => /Regional|Super|World Series/i.test(p)) ?? "";
  const tail = parts[parts.length - 1] ?? "";
  let bracketType: GameRow["bracketType"] = "Game";
  if (/Elimination/i.test(tail)) bracketType = "Elimination";
  else if (/Winners/i.test(tail)) bracketType = "Winners";
  else if (/Final|Championship/i.test(tail)) bracketType = "Final";
  return { regional, bracketType };
}

function mapEvent(e: ESPNEvent): GameRow {
  const comp = e.competitions?.[0] ?? {};
  const status = comp.status?.type ?? {};
  const teams = comp.competitors ?? [];
  const home = teams.find((t) => t.homeAway === "home");
  const away = teams.find((t) => t.homeAway === "away");
  const note = comp.notes?.[0]?.headline ?? "";
  const { regional, bracketType } = parseRegional(note);
  // ESPN appends "— <Team> advances to Super Regional" once a regional is
  // clinched. Surface that team name as the ticket holder.
  const advanceMatch = note.match(/[—\-]\s*([^—\-]+?)\s+advances\s+to\s+Super\s+Regional/i);
  const advancesToSuper = advanceMatch ? advanceMatch[1].trim() : undefined;
  const date = e.date;
  const dt = new Date(date);
  const ctDateLabel = dt.toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const ctTimeLabel = dt.toLocaleTimeString("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const state = ((status.state as GameRow["state"]) ?? "pre");
  return {
    id: e.id,
    state,
    detail: status.shortDetail ?? "",
    regional,
    bracketType,
    advancesToSuper,
    date,
    ctDateLabel,
    ctTimeLabel,
    home: {
      name: home?.team?.shortDisplayName ?? "TBD",
      rank: home?.curatedRank?.current && home.curatedRank.current < 99 ? home.curatedRank.current : undefined,
      score: home?.score,
    },
    away: {
      name: away?.team?.shortDisplayName ?? "TBD",
      rank: away?.curatedRank?.current && away.curatedRank.current < 99 ? away.curatedRank.current : undefined,
      score: away?.score,
    },
  };
}

async function fetchScoreboard(sport: Sport, date: string): Promise<GameRow[]> {
  const base = sport === "baseball" ? ESPN_BASEBALL : ESPN_SOFTBALL;
  // Baseball API accepts ?limit, softball API 400s on it — build per-sport url.
  const url = sport === "baseball" ? `${base}?dates=${date}&limit=100` : `${base}?dates=${date}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      // Fallback: retry without query params on 4xx
      if (res.status >= 400 && res.status < 500) {
        const fallback = await fetch(base, { cache: "no-store" });
        if (!fallback.ok) return [];
        const fbData = await fallback.json();
        const fbEvents: ESPNEvent[] = fbData.events ?? [];
        return fbEvents.map(mapEvent);
      }
      return [];
    }
    const data = await res.json();
    const events: ESPNEvent[] = data.events ?? [];
    return events.map(mapEvent);
  } catch {
    return [];
  }
}

function StatePill({ state, detail }: { state: GameRow["state"]; detail: string }) {
  if (state === "in") {
    return <span className="text-[10px] font-black tracking-wider uppercase text-white bg-[#1E90FF] px-1.5 py-0.5 rounded animate-pulse">LIVE · {detail}</span>;
  }
  if (state === "post") {
    return <span className="text-[10px] font-black tracking-wider uppercase text-[#1E90FF] border border-[#1E90FF]/60 px-1.5 py-0.5 rounded">{detail || "FINAL"}</span>;
  }
  return <span className="text-[10px] font-bold tracking-wider uppercase text-white/70 border border-white/30 px-1.5 py-0.5 rounded">{detail || "SCHEDULED"}</span>;
}

function GameCard({ g }: { g: GameRow }) {
  const winnerIsHome = g.state === "post" && Number(g.home.score) > Number(g.away.score);
  const winnerIsAway = g.state === "post" && Number(g.away.score) > Number(g.home.score);
  return (
    <div className="rounded-md border border-white/10 bg-black/40 hover:border-[#1E90FF]/50 transition p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] tracking-widest uppercase text-white/50 truncate" title={g.regional}>
          {g.regional || "NCAA"}{g.bracketType !== "Game" ? ` · ${g.bracketType}` : ""}
        </span>
        <StatePill state={g.state} detail={g.detail} />
      </div>

      <div className={`flex items-center justify-between text-sm ${winnerIsAway ? "text-white font-bold" : "text-white/85"}`}>
        <span className="truncate">
          {g.away.rank ? <span className="text-[#1E90FF] font-black mr-1">#{g.away.rank}</span> : null}
          {g.away.name}
        </span>
        <span className="font-mono font-bold tabular-nums">{g.away.score ?? "–"}</span>
      </div>

      <div className={`flex items-center justify-between text-sm mt-1 ${winnerIsHome ? "text-white font-bold" : "text-white/85"}`}>
        <span className="truncate">
          {g.home.rank ? <span className="text-[#1E90FF] font-black mr-1">#{g.home.rank}</span> : null}
          {g.home.name}
        </span>
        <span className="font-mono font-bold tabular-nums">{g.home.score ?? "–"}</span>
      </div>

      {g.state === "pre" ? (
        <div className="mt-2 text-[10px] tracking-wider uppercase text-white/55">
          {g.ctDateLabel} · {g.ctTimeLabel} CT
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3 mb-3 px-1">
        <h3 className="text-sm font-black tracking-[0.22em] uppercase text-white">{title}</h3>
        <span className="text-[10px] tracking-widest uppercase text-[#1E90FF]">{count} {count === 1 ? "GAME" : "GAMES"}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {children}
      </div>
    </div>
  );
}

export function LiveRegionalScoreboard({ sport = "baseball" }: { sport?: Sport }) {
  const [today, setToday] = useState<GameRow[]>([]);
  const [tomorrow, setTomorrow] = useState<GameRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [feedSource, setFeedSource] = useState<"live" | "manual">("live");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const now = new Date();
      const tmr = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const [t, tm] = await Promise.all([
        fetchScoreboard(sport, yyyymmdd(now)),
        fetchScoreboard(sport, yyyymmdd(tmr)),
      ]);
      if (!mounted) return;

      // ESPN softball endpoint has been returning empty during 2026 WCWS.
      // Fall back to the human-curated NCAA bracket data so the panel
      // never goes blank. Clearly labeled in the UI when this fires.
      if (sport === "softball" && t.length === 0 && tm.length === 0) {
        const manualMapped: GameRow[] = WCWS_MANUAL_FEED.map((g: WcwsManualGame) => {
          const dt = new Date(g.date);
          return {
            id: g.id,
            state: g.state,
            detail: g.detail,
            regional: g.regional,
            bracketType: g.regional.includes("Final") ? "Final" : "Game",
            advancesToSuper: g.advancesToSuper,
            date: g.date,
            ctDateLabel: dt.toLocaleDateString("en-US", {
              timeZone: "America/Chicago",
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
            ctTimeLabel: dt.toLocaleTimeString("en-US", {
              timeZone: "America/Chicago",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            home: g.home,
            away: g.away,
          };
        });
        const todayKey = yyyymmdd(now);
        const tmrKey = yyyymmdd(tmr);
        setToday(
          manualMapped.filter(
            (g) => yyyymmdd(new Date(g.date)) === todayKey || g.state === "post",
          ),
        );
        setTomorrow(
          manualMapped.filter((g) => yyyymmdd(new Date(g.date)) === tmrKey),
        );
        setFeedSource("manual");
      } else {
        setToday(t);
        setTomorrow(tm);
        setFeedSource("live");
      }
      setLastUpdated(new Date());
      setLoading(false);
    }
    load();
    const id = setInterval(load, 60_000); // refresh every 60s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [sport]);

  const live = useMemo(() => today.filter((g) => g.state === "in"), [today]);
  const finals = useMemo(() => today.filter((g) => g.state === "post"), [today]);
  const todaysScheduled = useMemo(() => today.filter((g) => g.state === "pre"), [today]);
  const tomorrowScheduled = useMemo(() => tomorrow.filter((g) => g.state !== "post"), [tomorrow]);

  /** Teams who punched their Super Regional ticket today — read straight off
   *  ESPN's "<Team> advances to Super Regional" headline. Deduped + sorted. */
  const ticketsPunched = useMemo(() => {
    const teams = new Set<string>();
    for (const g of [...today, ...tomorrow]) {
      if (g.advancesToSuper) teams.add(g.advancesToSuper);
    }
    return Array.from(teams).sort((a, b) => a.localeCompare(b));
  }, [today, tomorrow]);

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      timeZone: "America/Chicago",
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-US", {
        timeZone: "America/Chicago",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

  return (
    <div className="rounded-xl border border-[#1E90FF]/30 bg-gradient-to-b from-[#0a1628] via-black to-black p-4 md:p-6 mb-8">
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
              {sport === "baseball" ? "MEN'S COLLEGE WORLD SERIES" : "WOMEN'S COLLEGE WORLD SERIES"}
            </span>
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#88a8ff]">
              {sport === "baseball" ? "64 TEAMS · 16 REGIONALS" : "8 TEAMS · WCWS"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
            LIVE REGIONAL SCOREBOARD
          </h2>
          <p className="text-[11px] tracking-widest uppercase text-[#88a8ff] mt-1">
            {todayLabel} · {sport === "baseball" ? "Men's College Baseball" : "Women's College Softball"} · Auto-refresh every 60s
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] tracking-widest uppercase text-white/50">Last update</div>
          <div className="text-xs font-mono text-white">{lastUpdatedLabel} CT</div>
          {feedSource === "manual" && (
            <div className="text-[9px] uppercase tracking-[0.18em] text-[#00C2FF] mt-1 max-w-[200px]">
              {WCWS_FEED_SOURCE_LABEL}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-white/60 text-sm tracking-wider uppercase">Loading scoreboard…</div>
      ) : (
        <>
          {/* TICKETS PUNCHED — pinned at the top whenever ESPN flags advancers */}
          {ticketsPunched.length > 0 && (
            <div
              className="mb-6 rounded-xl border-2 border-[#1E90FF]/60 bg-gradient-to-br from-[#1E90FF]/15 to-black p-4"
              data-testid="tickets-punched"
            >
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base" role="img" aria-label="ticket">
                    
                  </span>
                  <h3 className="text-sm font-black tracking-[0.22em] uppercase text-white">
                    Super Regional Tickets Punched
                  </h3>
                </div>
                <span className="rounded-full bg-[#1E90FF] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  {ticketsPunched.length} of {sport === "baseball" ? 16 : 8}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ticketsPunched.map((team) => (
                  <span
                    key={team}
                    className="rounded-md border border-[#1E90FF]/40 bg-black/60 px-2.5 py-1 text-[11.5px] font-bold text-white"
                  >
                    {team}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#88a8ff]">
                Live from ESPN · auto-updates as games finish
              </p>
            </div>
          )}

          <Section title="Live Now" count={live.length}>
            {live.map((g) => <GameCard key={g.id} g={g} />)}
          </Section>

          <Section title="Today · Final" count={finals.length}>
            {finals.map((g) => <GameCard key={g.id} g={g} />)}
          </Section>

          <Section title="Today · Upcoming" count={todaysScheduled.length}>
            {todaysScheduled.map((g) => <GameCard key={g.id} g={g} />)}
          </Section>

          <Section title="Tomorrow's Matchups" count={tomorrowScheduled.length}>
            {tomorrowScheduled.map((g) => <GameCard key={g.id} g={g} />)}
          </Section>

          {today.length === 0 && tomorrow.length === 0 ? (
            <div className="text-center py-10 text-white/60 text-sm tracking-wider uppercase">
              No games scheduled. Off-day.
            </div>
          ) : null}
        </>
      )}

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        </div>
    </div>
  );
}
