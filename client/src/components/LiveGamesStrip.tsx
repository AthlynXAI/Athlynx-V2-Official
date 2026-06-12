/**
 * LiveGamesStrip — A compact 24h "what's on today + tomorrow" strip for the
 * top of athlynx.ai. Pulls directly from ESPN's public scoreboard JSON for
 * NCAA baseball + softball. Auto-refreshes every 60s. No backend required.
 *
 * Brand-locked: cobalt #1E90FF + cyan #00C2FF + true black + white.
 * Signoff:  *
 * Built 2026-06-01 for the showcase. Live ESPN data — no placeholders.
 */

import { useEffect, useMemo, useState } from "react";

type Sport = "baseball" | "softball";

interface ESPNGame {
  id: string;
  sport: Sport;
  date: string;
  state: "pre" | "in" | "post";
  detail: string;
  shortDetail: string;
  network?: string;
  home: { name: string; abbr?: string; score?: string; rank?: number; winner?: boolean };
  away: { name: string; abbr?: string; score?: string; rank?: number; winner?: boolean };
  venue?: string;
  note?: string; // e.g. "NCAA Baseball Championship - Tallahassee Regional"
}

const ESPN_BASEBALL =
  "https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard";
const ESPN_SOFTBALL =
  "https://site.api.espn.com/apis/site/v2/sports/softball/college-softball/scoreboard";

function yyyymmdd(d: Date) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

async function fetchSport(sport: Sport, date: string): Promise<ESPNGame[]> {
  const base = sport === "baseball" ? ESPN_BASEBALL : ESPN_SOFTBALL;
  try {
    const res = await fetch(`${base}?dates=${date}&limit=100`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const events: any[] = data?.events ?? [];
    return events
      .map((e: any): ESPNGame | null => {
        const comp = e?.competitions?.[0];
        if (!comp) return null;
        const teams = comp.competitors ?? [];
        const home = teams.find((t: any) => t.homeAway === "home") ?? {};
        const away = teams.find((t: any) => t.homeAway === "away") ?? {};
        const status = comp.status?.type ?? {};
        const state = (status.state as "pre" | "in" | "post") ?? "pre";
        const homeScore = home.score != null ? String(home.score) : undefined;
        const awayScore = away.score != null ? String(away.score) : undefined;
        let homeWin = false;
        let awayWin = false;
        if (state === "post" && homeScore != null && awayScore != null) {
          homeWin = Number(homeScore) > Number(awayScore);
          awayWin = !homeWin;
        }
        const network = (comp.broadcasts ?? [])
          .flatMap((b: any) => b.names ?? [])
          .filter(Boolean)
          .join(" / ");
        return {
          id: e.id,
          sport,
          date: e.date,
          state,
          detail: status.detail ?? status.shortDetail ?? "",
          shortDetail: status.shortDetail ?? "",
          network: network || undefined,
          venue: comp.venue?.fullName,
          note: (comp.notes ?? [])[0]?.headline,
          home: {
            name: home.team?.shortDisplayName ?? home.team?.displayName ?? "TBD",
            abbr: home.team?.abbreviation,
            score: homeScore,
            rank:
              home.curatedRank?.current && home.curatedRank.current < 99
                ? home.curatedRank.current
                : undefined,
            winner: homeWin,
          },
          away: {
            name: away.team?.shortDisplayName ?? away.team?.displayName ?? "TBD",
            abbr: away.team?.abbreviation,
            score: awayScore,
            rank:
              away.curatedRank?.current && away.curatedRank.current < 99
                ? away.curatedRank.current
                : undefined,
            winner: awayWin,
          },
        };
      })
      .filter((g): g is ESPNGame => g != null);
  } catch {
    return [];
  }
}

function StatePill({ g }: { g: ESPNGame }) {
  if (g.state === "in") {
    return (
      <span className="rounded bg-[#1E90FF] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white animate-pulse">
        LIVE · {g.shortDetail}
      </span>
    );
  }
  if (g.state === "post") {
    return (
      <span className="rounded border border-[#1E90FF]/60 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#1E90FF]">
        FINAL
      </span>
    );
  }
  return (
    <span className="rounded border border-white/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/70">
      {g.shortDetail || "SCHEDULED"}
    </span>
  );
}

function TeamRow({ side }: { side: ESPNGame["home"] | ESPNGame["away"] }) {
  return (
    <div
      className={`flex items-center justify-between gap-2 text-[12px] ${
        side.winner ? "text-white font-black" : "text-white/85"
      }`}
    >
      <span className="truncate">
        {side.rank ? (
          <span className="mr-1 font-black text-[#1E90FF]">#{side.rank}</span>
        ) : null}
        {side.name}
      </span>
      <span className="font-mono tabular-nums font-bold shrink-0">
        {side.score ?? "–"}
      </span>
    </div>
  );
}

function GameCard({ g }: { g: ESPNGame }) {
  const dt = new Date(g.date);
  const timeCT = dt.toLocaleTimeString("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const dateCT = dt.toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const sportBadge = g.sport === "baseball" ? "MCWS" : "Softball";
  const noteShort = g.note?.replace(/^NCAA (Baseball|Softball) Championship - /, "") ?? "";
  return (
    <div className="min-w-[240px] flex-shrink-0 rounded-lg border border-[#1E90FF]/30 bg-gradient-to-br from-[#0a1628] to-black p-3 hover:border-[#1E90FF]/70 transition">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] ${
            g.sport === "baseball"
              ? "bg-[#1E90FF] text-white"
              : "border border-white/40 bg-white/10 text-white"
          }`}
        >
          {sportBadge}
        </span>
        <StatePill g={g} />
      </div>
      <div className="space-y-1">
        <TeamRow side={g.away} />
        <TeamRow side={g.home} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/5 pt-2 text-[9px] uppercase tracking-widest text-white/45">
        <span className="truncate">{noteShort || g.venue || "—"}</span>
        <span className="shrink-0">
          {g.state === "pre" ? `${dateCT} · ${timeCT} CT` : timeCT + " CT"}
        </span>
      </div>
      {g.network && (
        <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#00C2FF] truncate">
          {g.network}
        </div>
      )}
    </div>
  );
}

export default function LiveGamesStrip() {
  const [games, setGames] = useState<ESPNGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      const now = new Date();
      const tmr = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dates = [yyyymmdd(now), yyyymmdd(tmr)];
      const results = await Promise.all([
        ...dates.map((d) => fetchSport("baseball", d)),
        ...dates.map((d) => fetchSport("softball", d)),
      ]);
      if (!alive) return;
      const merged = results.flat();
      // De-dupe + sort by date
      const seen = new Set<string>();
      const ordered = merged
        .filter((g) => {
          if (seen.has(g.id)) return false;
          seen.add(g.id);
          return true;
        })
        .sort((a, b) => a.date.localeCompare(b.date));
      setGames(ordered);
      setLastUpdated(new Date());
      setLoading(false);
    }
    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const liveCount = useMemo(() => games.filter((g) => g.state === "in").length, [games]);

  const lastLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-US", {
        timeZone: "America/Chicago",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

  return (
    <section
      className="relative border-b border-[#1E90FF]/20 bg-black px-3 py-4"
      data-testid="live-games-strip"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#1E90FF]"></span>
            <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-white md:text-xs">
              Live Games · MCWS · Today + Tomorrow
            </h2>
            {liveCount > 0 && (
              <span className="rounded bg-[#1E90FF] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                {liveCount} LIVE
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/45">
            ESPN feed · refreshed {lastLabel} CT · auto every 60s
          </span>
        </div>
        {loading ? (
          <div className="py-6 text-center text-[11px] uppercase tracking-widest text-white/55">
            Loading live games…
          </div>
        ) : games.length === 0 ? (
          <div className="py-6 text-center text-[11px] uppercase tracking-widest text-white/55">
            No NCAA baseball or softball games on the wire right now.
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-[#1E90FF]/40 [&::-webkit-scrollbar-track]:bg-transparent">
            {games.map((g) => (
              <GameCard key={g.id} g={g} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
