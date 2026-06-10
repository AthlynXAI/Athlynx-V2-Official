/**
 * AthlynX · Regional Bracket Tree
 *
 * One per regional. Full NCAA 4-team double-elimination structure with
 * up to 7 game slots:
 *   - Game 1 + Game 2 (Opening Round · Friday)
 *   - Game 3 (Winners Bracket · Saturday early)
 *   - Game 4 (Elimination Game · Saturday)
 *   - Game 5 (Elimination Game · Sunday)
 *   - Game 6 (Regional Final · Sunday)
 *   - Game 7 (If Necessary · Monday)
 *
 * Slots auto-populate from ESPN scoreboard data across multiple days
 * (Fri/Sat/Sun/Mon). Names + scores flow into next slots as games complete.
 *
 * Built May 30, 2026 · Locked May 29 · Chad A. Dozier Sr.
 * Brand-locked: cobalt #1E90FF + true black + white. No gold/yellow/orange.
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
  team?: { shortDisplayName?: string; abbreviation?: string };
};

type ESPNEvent = {
  id: string;
  date: string;
  competitions: Array<{
    status?: { type?: { state?: string; shortDetail?: string } };
    competitors?: ESPNTeam[];
    notes?: Array<{ headline?: string }>;
  }>;
};

type Game = {
  id: string;
  state: "pre" | "in" | "post";
  detail: string;
  date: string;
  ctTimeLabel: string;
  ctDateLabel: string;
  bracketTail: string;            // "Elimination Game" | "" | ...
  home: { name: string; rank?: number; score?: string };
  away: { name: string; rank?: number; score?: string };
  winner?: "home" | "away";
};

type Regional = {
  name: string;          // "Lincoln Regional"
  hostSeed?: number;     // 1-16
  games: Game[];         // chronological
};

const ESPN_BASEBALL = "https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard";
const ESPN_SOFTBALL = "https://site.api.espn.com/apis/site/v2/sports/softball/college-softball/scoreboard";

function yyyymmdd(d: Date) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function parseRegionalName(note: string): { regional: string; tail: string; round: "regional" | "super" | "cws" } {
  // Examples:
  //   "NCAA Baseball Championship - Lincoln Regional - Elimination Game"
  //   "NCAA Baseball Championship - Knoxville Super Regional - Game 1"
  //   "NCAA Baseball Championship - College World Series - Game 1"
  const parts = note.split(" - ").map((s) => s.trim());
  const superPart = parts.find((p) => /Super Regional/i.test(p));
  const cwsPart = parts.find((p) => /College World Series/i.test(p));
  const regionalPart = parts.find((p) => /Regional/i.test(p) && !/Super/i.test(p));
  const pick = superPart ?? cwsPart ?? regionalPart ?? "";
  const round: "regional" | "super" | "cws" = superPart
    ? "super"
    : cwsPart
      ? "cws"
      : "regional";
  const tail = pick ? parts.slice(parts.indexOf(pick) + 1).join(" - ") : "";
  return { regional: pick, tail, round };
}

function mapEvent(e: ESPNEvent): { regional: string; round: "regional" | "super" | "cws"; game: Game } | null {
  const comp = e.competitions?.[0] ?? {};
  const status = comp.status?.type ?? {};
  const teams = comp.competitors ?? [];
  const home = teams.find((t) => t.homeAway === "home");
  const away = teams.find((t) => t.homeAway === "away");
  const note = comp.notes?.[0]?.headline ?? "";
  if (!/Regional|College World Series/i.test(note)) return null;
  const { regional, tail, round } = parseRegionalName(note);
  const dt = new Date(e.date);
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
  const state = (status.state as Game["state"]) ?? "pre";
  const homeScore = home?.score;
  const awayScore = away?.score;
  let winner: Game["winner"] | undefined;
  if (state === "post" && homeScore != null && awayScore != null) {
    winner = Number(homeScore) > Number(awayScore) ? "home" : "away";
  }
  const game: Game = {
    id: e.id,
    state,
    detail: status.shortDetail ?? "",
    date: e.date,
    ctTimeLabel,
    ctDateLabel,
    bracketTail: tail,
    home: {
      name: home?.team?.shortDisplayName ?? "TBD",
      rank: home?.curatedRank?.current && home.curatedRank.current < 99 ? home.curatedRank.current : undefined,
      score: homeScore,
    },
    away: {
      name: away?.team?.shortDisplayName ?? "TBD",
      rank: away?.curatedRank?.current && away.curatedRank.current < 99 ? away.curatedRank.current : undefined,
      score: awayScore,
    },
    winner,
  };
  return { regional, round, game };
}

async function fetchDay(
  sport: Sport,
  date: string,
): Promise<Array<{ regional: string; round: "regional" | "super" | "cws"; game: Game }>> {
  const base = sport === "baseball" ? ESPN_BASEBALL : ESPN_SOFTBALL;
  const urls = sport === "baseball"
    ? [`${base}?dates=${date}&limit=100`]
    : [`${base}?dates=${date}`, `${base}?dates=${date}&limit=100`, base];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      const events: ESPNEvent[] = data.events ?? [];
      return events
        .map(mapEvent)
        .filter(
          (x): x is { regional: string; round: "regional" | "super" | "cws"; game: Game } =>
            x != null,
        );
    } catch {
      continue;
    }
  }
  return [];
}

function StatePill({ state, detail }: { state: Game["state"]; detail: string }) {
  if (state === "in") {
    return <span className="text-[9px] font-black tracking-wider uppercase text-white bg-[#1E90FF] px-1.5 py-0.5 rounded animate-pulse">LIVE · {detail}</span>;
  }
  if (state === "post") {
    return <span className="text-[9px] font-black tracking-wider uppercase text-[#1E90FF] border border-[#1E90FF]/60 px-1.5 py-0.5 rounded">FINAL</span>;
  }
  return <span className="text-[9px] font-bold tracking-wider uppercase text-white/55 border border-white/30 px-1.5 py-0.5 rounded">{detail || "SCHEDULED"}</span>;
}

function TeamRow({ name, rank, score, winner }: { name: string; rank?: number; score?: string; winner: boolean }) {
  return (
    <div className={`flex items-center justify-between text-xs ${winner ? "text-white font-black" : "text-white/80"}`}>
      <span className="truncate">
        {rank ? <span className="text-[#1E90FF] font-black mr-1">#{rank}</span> : null}
        {name}
      </span>
      <span className="font-mono font-bold tabular-nums shrink-0 ml-2">{score ?? "–"}</span>
    </div>
  );
}

function GameSlot({ slotLabel, slotDay, slot }: { slotLabel: string; slotDay: string; slot: Game | null }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/50 p-2.5 min-w-[180px] hover:border-[#1E90FF]/50 transition">
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <span className="text-[9px] font-black tracking-[0.18em] uppercase text-[#88a8ff] truncate">{slotLabel}</span>
        {slot ? (
          <StatePill state={slot.state} detail={slot.detail} />
        ) : (
          <span className="text-[9px] font-bold tracking-wider uppercase text-white/35 border border-white/20 px-1.5 py-0.5 rounded">TBD</span>
        )}
      </div>
      {slot ? (
        <>
          <TeamRow name={slot.away.name} rank={slot.away.rank} score={slot.away.score} winner={slot.winner === "away"} />
          <div className="my-0.5" />
          <TeamRow name={slot.home.name} rank={slot.home.rank} score={slot.home.score} winner={slot.winner === "home"} />
          {slot.state === "pre" ? (
            <div className="mt-1.5 text-[9px] tracking-wider uppercase text-white/50">
              {slot.ctDateLabel} · {slot.ctTimeLabel} CT
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="text-xs text-white/40">TBD</div>
          <div className="my-0.5" />
          <div className="text-xs text-white/40">TBD</div>
          <div className="mt-1.5 text-[9px] tracking-wider uppercase text-white/35">{slotDay}</div>
        </>
      )}
    </div>
  );
}

function assignSlots(regional: Regional): {
  game1: Game | null;
  game2: Game | null;
  game3: Game | null;       // Winners (1-0)
  game4: Game | null;       // Elim Sat
  game5: Game | null;       // Elim Sun
  game6: Game | null;       // Regional Final
  game7: Game | null;       // If necessary
} {
  // Slot games by date + tail. Friday = Opening Round (Game 1, 2). Saturday = Game 3 (Winners) + Game 4 (Elim). Sunday = Game 5 (Elim) + Game 6 (Final). Monday = Game 7 (IF).
  const sorted = [...regional.games].sort((a, b) => a.date.localeCompare(b.date));
  const result = {
    game1: null as Game | null,
    game2: null as Game | null,
    game3: null as Game | null,
    game4: null as Game | null,
    game5: null as Game | null,
    game6: null as Game | null,
    game7: null as Game | null,
  };
  // Bucket by local day-of-week in CT
  const byDay: Record<string, Game[]> = { Fri: [], Sat: [], Sun: [], Mon: [], other: [] };
  for (const g of sorted) {
    const day = new Date(g.date).toLocaleDateString("en-US", { timeZone: "America/Chicago", weekday: "short" });
    (byDay[day] ?? byDay.other).push(g);
  }
  // Friday — Game 1 + Game 2 (two opening round games, slotted by chronological order)
  if (byDay.Fri[0]) result.game1 = byDay.Fri[0];
  if (byDay.Fri[1]) result.game2 = byDay.Fri[1];
  // Saturday — Game 3 is the Winners-bracket meeting, Game 4 is the first elimination.
  // ESPN tags the elim with "Elimination Game"; the winners game has no tail or "Winners Bracket".
  for (const g of byDay.Sat) {
    if (/Elimination/i.test(g.bracketTail) && !result.game4) result.game4 = g;
    else if (!result.game3) result.game3 = g;
    else if (!result.game4) result.game4 = g;
  }
  // Sunday — Game 5 (Elim) + Game 6 (Regional Final). Final tagged with "Regional Final" or empty late slot.
  for (const g of byDay.Sun) {
    if (/Elimination/i.test(g.bracketTail) && !result.game5) result.game5 = g;
    else if (/Final/i.test(g.bracketTail) && !result.game6) result.game6 = g;
    else if (!result.game5) result.game5 = g;
    else if (!result.game6) result.game6 = g;
  }
  // Monday — Game 7 if necessary
  if (byDay.Mon[0]) result.game7 = byDay.Mon[0];
  return result;
}

function SimpleSeriesCard({ regional, label }: { regional: Regional; label: string }) {
  // For Super Regionals / CWS — just list the games chronologically. The 4-team
  // double-elim assignSlots layout doesn't fit a best-of-3 series.
  const sorted = [...regional.games].sort((a, b) => a.date.localeCompare(b.date));
  const shortName = regional.name
    .replace(/Super Regional$/, "")
    .replace(/College World Series$/, "")
    .replace(/Regional$/, "")
    .trim();
  return (
    <div className="rounded-xl border border-[#1E90FF]/25 bg-gradient-to-b from-[#0a1628] via-black to-black p-4">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
            ROAD TO OMAHA
          </span>
          <h3 className="text-sm font-black tracking-tight text-white">
            {shortName || regional.name} · {label}
          </h3>
        </div>
        <span className="text-[9px] tracking-widest uppercase text-white/40">
          {sorted.length} {sorted.length === 1 ? "game" : "games"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {sorted.map((g, i) => (
          <GameSlot
            key={g.id}
            slotLabel={`Game ${i + 1}`}
            slotDay={new Date(g.date).toLocaleDateString("en-US", {
              timeZone: "America/Chicago",
              weekday: "short",
            })}
            slot={g}
          />
        ))}
      </div>
    </div>
  );
}

function BracketCard({ regional }: { regional: Regional }) {
  const slots = useMemo(() => assignSlots(regional), [regional]);
  const shortName = regional.name.replace(/Regional$/, "").trim();
  return (
    <div className="rounded-xl border border-[#1E90FF]/25 bg-gradient-to-b from-[#0a1628] via-black to-black p-4">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
            ROAD TO OMAHA
          </span>
          <h3 className="text-sm font-black tracking-tight text-white">{shortName} Regional</h3>
        </div>
        <span className="text-[9px] tracking-widest uppercase text-white/40">Double-Elimination</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="flex flex-col gap-2">
          <GameSlot slotLabel="Game 1 · Opening" slotDay="Fri" slot={slots.game1} />
          <GameSlot slotLabel="Game 2 · Opening" slotDay="Fri" slot={slots.game2} />
        </div>
        <div className="flex flex-col gap-2">
          <GameSlot slotLabel="Game 3 · Winners 1-0" slotDay="Sat" slot={slots.game3} />
          <GameSlot slotLabel="Game 4 · Elimination" slotDay="Sat" slot={slots.game4} />
        </div>
        <div className="flex flex-col gap-2">
          <GameSlot slotLabel="Game 5 · Elimination" slotDay="Sun" slot={slots.game5} />
          <GameSlot slotLabel="Game 6 · Regional Final" slotDay="Sun" slot={slots.game6} />
        </div>
        <div className="flex flex-col gap-2">
          <GameSlot slotLabel="Game 7 · If Necessary" slotDay="Mon" slot={slots.game7} />
          <div className="rounded-md border border-[#1E90FF]/20 bg-black/50 p-2.5 min-w-[180px]">
            <span className="text-[9px] font-black tracking-[0.18em] uppercase text-[#88a8ff]">Advances To</span>
            <div className="text-xs text-white/80 font-bold mt-1.5">Super Regionals · June 5</div>
            <div className="text-[9px] tracking-wider uppercase text-white/45 mt-0.5">Top-8 seeds host</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function manualToGame(g: WcwsManualGame): Game {
  const dt = new Date(g.date);
  return {
    id: g.id,
    state: g.state,
    detail: g.detail,
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
    bracketTail: g.regional,
    home: g.home,
    away: g.away,
    winner:
      g.state === "post" && g.home.score != null && g.away.score != null
        ? Number(g.home.score) > Number(g.away.score)
          ? "home"
          : "away"
        : undefined,
  };
}

function WcwsManualBracket({ lastLabel }: { lastLabel: string }) {
  // WCWS is a different shape than regionals: 8-team double-elim → 4 bracket
  // semifinals → 2 bracket finals → best-of-3 championship series.
  // Group the manual feed into the rounds we actually have data for.
  const games = WCWS_MANUAL_FEED.map(manualToGame);
  const bySection: Record<string, Game[]> = {
    "Bracket Semifinals": [],
    "Bracket Finals": [],
    "WCWS Semifinals": [],
    "Championship Series": [],
    Other: [],
  };
  for (const g of games) {
    const t = g.bracketTail;
    if (/Championship Series/i.test(t)) bySection["Championship Series"].push(g);
    else if (/Bracket Semifinal/i.test(t)) bySection["Bracket Semifinals"].push(g);
    else if (/Bracket Final/i.test(t)) bySection["Bracket Finals"].push(g);
    else if (/Semifinal/i.test(t)) bySection["WCWS Semifinals"].push(g);
    else bySection.Other.push(g);
  }
  const sections = Object.entries(bySection).filter(([, list]) => list.length > 0);

  return (
    <div className="rounded-xl border border-[#1E90FF]/30 bg-gradient-to-b from-black via-[#0a1628] to-black p-4 md:p-6 mb-8">
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
              WOMEN'S COLLEGE WORLD SERIES
            </span>
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#88a8ff]">
              WCWS Bracket · Devon Park · OKC
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
            FULL WCWS BRACKET · DOUBLE ELIMINATION → BEST-OF-3 FINALS
          </h2>
          <p className="text-[11px] tracking-widest uppercase text-[#88a8ff] mt-1">
            {WCWS_FEED_SOURCE_LABEL}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] tracking-widest uppercase text-white/50">Last update</div>
          <div className="text-xs font-mono text-white">{lastLabel} CT</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map(([sectionName, list]) => (
          <div
            key={sectionName}
            className="rounded-xl border border-[#1E90FF]/25 bg-gradient-to-b from-[#0a1628] via-black to-black p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
                  ROAD TO OKC
                </span>
                <h3 className="text-sm font-black tracking-tight text-white">{sectionName}</h3>
              </div>
              <span className="text-[9px] tracking-widest uppercase text-white/40">
                {list.length} {list.length === 1 ? "game" : "games"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {list
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((g, i) => (
                  <GameSlot
                    key={g.id}
                    slotLabel={`Game ${i + 1}`}
                    slotDay={new Date(g.date).toLocaleDateString("en-US", {
                      timeZone: "America/Chicago",
                      weekday: "short",
                    })}
                    slot={g}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        </div>
    </div>
  );
}

type RoundKey = "regional" | "super" | "cws";

function RegionalBracketTreeInner({ sport = "baseball" }: { sport?: Sport }) {
  // Now stores ALL active rounds, keyed by round name, so the homepage shows
  // every round currently on the wire (regional + super + cws can all
  // coexist during the championship window).
  const [byRound, setByRound] = useState<Record<RoundKey, Regional[]>>({
    regional: [],
    super: [],
    cws: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let alive = true;
    const safetyTimer = setTimeout(() => {
      if (alive) setLoading(false);
    }, 8000);
    async function load() {
      try {
        const now = new Date();
        const days = [-1, 0, 1, 2, 3, 4, 5, 6, 7].map((offset) => {
          const d = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
          return yyyymmdd(d);
        });
        const results = await Promise.all(days.map((d) => fetchDay(sport, d)));
        const flat = results.flat();
        const buckets: Record<RoundKey, Map<string, Regional>> = {
          regional: new Map(),
          super: new Map(),
          cws: new Map(),
        };
        const seenIds = new Set<string>();
        for (const { regional, round, game } of flat) {
          if (!regional) continue;
          if (seenIds.has(game.id)) continue;
          seenIds.add(game.id);
          const target = buckets[round];
          if (!target.has(regional)) {
            target.set(regional, { name: regional, games: [] });
          }
          target.get(regional)!.games.push(game);
        }
        const toList = (m: Map<string, Regional>) =>
          Array.from(m.values()).sort((a, b) => a.name.localeCompare(b.name));
        if (!alive) return;
        setByRound({
          regional: toList(buckets.regional),
          super: toList(buckets.super),
          cws: toList(buckets.cws),
        });
        setLastUpdated(new Date());
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[RegionalBracketTree] load failed:", e);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
      clearTimeout(safetyTimer);
    };
  }, [sport]);

  // Back-compat shims so the existing JSX below (which references regionals,
  // activeRound) keeps working without further surgery. We pick the round that
  // has data and is the most recent (cws > super > regional) for the header,
  // but we render ALL non-empty rounds below.
  const activeRound: RoundKey =
    byRound.cws.length > 0
      ? "cws"
      : byRound.super.length > 0
        ? "super"
        : "regional";
  const regionals = byRound[activeRound];

  const lastLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-US", {
        timeZone: "America/Chicago",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

  return (
    <div className="rounded-xl border border-[#1E90FF]/30 bg-gradient-to-b from-black via-[#0a1628] to-black p-4 md:p-6 mb-8">
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
              {sport === "baseball" ? "MEN'S COLLEGE WORLD SERIES" : "WOMEN'S COLLEGE WORLD SERIES"}
            </span>
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#88a8ff]">
              {activeRound === "cws"
                ? sport === "baseball"
                  ? "MCWS in Omaha"
                  : "WCWS in OKC"
                : activeRound === "super"
                  ? "Super Regionals · Best of 3"
                  : sport === "baseball"
                    ? "16 Regional Brackets · 64 Teams"
                    : "WCWS Bracket"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
            {activeRound === "cws"
              ? "COLLEGE WORLD SERIES · LIVE GAMES"
              : activeRound === "super"
                ? "SUPER REGIONALS · BEST OF 3"
                : "FULL REGIONAL BRACKETS · DOUBLE ELIMINATION"}
          </h2>
          <p className="text-[11px] tracking-widest uppercase text-[#88a8ff] mt-1">
            {activeRound === "cws"
              ? "Pool play through Bracket Final · 60-second refresh"
              : activeRound === "super"
                ? "Top-8 seeds host · Winner advances to Omaha · 60-second refresh"
                : "Game 1–7 per regional · Auto-fills as games finish · 60-second refresh"}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] tracking-widest uppercase text-white/50">Last update</div>
          <div className="text-xs font-mono text-white">{lastLabel} CT</div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-white/60 text-sm tracking-wider uppercase">
          Loading live ESPN feed…
        </div>
      ) : regionals.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-white/70 text-sm tracking-wider uppercase">
            {sport === "softball"
              ? "WCWS bracket loaded from manual feed below."
              : activeRound === "cws"
                ? "CWS begins June 13 · Bracket auto-fills as games approach."
                : activeRound === "super"
                  ? "Super Regionals begin Friday June 5 · Bracket auto-fills as matchups lock."
                  : "ESPN scoreboard feed returned empty for this window."}
          </p>
          <p className="text-[10px] tracking-widest uppercase text-[#88a8ff] mt-3">
            Live retry in 60 seconds · Last update {lastLabel} CT
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {byRound.cws.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-[#1E90FF] px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white">
                  College World Series
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#88a8ff]">
                  {byRound.cws.length} matchups
                </span>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {byRound.cws.map((r) => (
                  <SimpleSeriesCard
                    key={`cws-${r.name}`}
                    regional={r}
                    label="College World Series"
                  />
                ))}
              </div>
            </div>
          )}
          {byRound.super.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-[#1E90FF] px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white">
                  Super Regionals · Best of 3
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#88a8ff]">
                  {byRound.super.length} super regionals
                </span>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {byRound.super.map((r) => (
                  <SimpleSeriesCard
                    key={`super-${r.name}`}
                    regional={r}
                    label="Super Regional"
                  />
                ))}
              </div>
            </div>
          )}
          {byRound.regional.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-[#1E90FF] px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white">
                  Regionals · Double-Elimination
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#88a8ff]">
                  {byRound.regional.length} regionals
                </span>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {byRound.regional.map((r) => (
                  <BracketCard key={`reg-${r.name}`} regional={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        </div>
    </div>
  );
}

/**
 * Public export. For baseball (MCWS) this is identical to the live regional
 * tree. For softball (WCWS) we additionally check whether the live ESPN feed
 * came back empty and, if so, render the WCWS_MANUAL_FEED bracket so the card
 * never goes blank during the championship.
 */
export function RegionalBracketTree({ sport = "baseball" }: { sport?: Sport }) {
  const [softballEmpty, setSoftballEmpty] = useState(false);
  const [lastLabel, setLastLabel] = useState("—");

  useEffect(() => {
    if (sport !== "softball") return;
    let alive = true;
    async function probe() {
      const now = new Date();
      const days = [-1, 0, 1, 2].map((offset) => {
        const d = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
        return yyyymmdd(d);
      });
      const results = await Promise.all(days.map((d) => fetchDay("softball", d)));
      if (!alive) return;
      const flat = results.flat();
      setSoftballEmpty(flat.length === 0);
      setLastLabel(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/Chicago",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    }
    probe();
    const id = setInterval(probe, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [sport]);

  if (sport === "softball" && softballEmpty) {
    return <WcwsManualBracket lastLabel={lastLabel} />;
  }
  return <RegionalBracketTreeInner sport={sport} />;
}
