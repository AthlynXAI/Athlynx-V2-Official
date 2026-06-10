/**
 * LivePlayerStats — pulls career stat lines from the public MLB Stats API
 * for a given player. Hydrates on mount; falls back gracefully to whatever
 * static career data the TeamProfile carries so the card never goes blank.
 *
 * Used on athlete partner profiles so the career record
 * stays authoritative — if a player signs anywhere, or any line updates,
 * the card picks it up automatically without a redeploy.
 *
 * Brand-locked: cobalt #1E90FF + true black + white.
 * Signoff:  */

import { useEffect, useState } from "react";

interface MLBStatSplit {
  season?: string;
  stat?: Record<string, string | number>;
  team?: { name?: string };
  league?: { name?: string };
}

export interface LiveCareerSnapshot {
  freeAgent: boolean;
  currentTeam?: string;
  position?: string;
  bats?: string;
  throws?: string;
  height?: string;
  weight?: string | number;
  birthDate?: string;
  birthCity?: string;
  birthCountry?: string;
  active?: boolean;
  // aggregate career line
  career?: {
    wins?: number;
    losses?: number;
    era?: string;
    games?: number;
    gamesStarted?: number;
    saves?: number;
    inningsPitched?: string;
    strikeOuts?: number;
    walks?: number;
    whip?: string;
  };
  // per-season splits (most recent first)
  seasons: Array<{
    year: string;
    team: string;
    league?: string;
    line: string;
  }>;
  fetchedAt: string;
}

const MLB_BASE = "https://statsapi.mlb.com/api/v1";

async function fetchMLBPlayer(playerId: number): Promise<LiveCareerSnapshot | null> {
  try {
    // 1. Person info
    const personRes = await fetch(`${MLB_BASE}/people/${playerId}`);
    if (!personRes.ok) return null;
    const person = (await personRes.json())?.people?.[0];
    if (!person) return null;

    // 2. Career + per-season stats (pitching)
    const statsRes = await fetch(
      `${MLB_BASE}/people/${playerId}/stats?stats=career,yearByYear&group=pitching`,
    );
    const statsJson = statsRes.ok ? await statsRes.json() : null;
    const career = statsJson?.stats?.find((s: any) => s.type?.displayName === "career")
      ?.splits?.[0]?.stat as Record<string, string | number> | undefined;
    const yearByYear: MLBStatSplit[] =
      statsJson?.stats?.find((s: any) => s.type?.displayName === "yearByYear")?.splits ?? [];

    const seasons = yearByYear
      .slice()
      .reverse()
      .map((sp) => {
        const s = sp.stat ?? {};
        const line = [
          `${s.wins ?? 0}-${s.losses ?? 0}`,
          `${s.era ?? "—"} ERA`,
          `${s.strikeOuts ?? 0} K`,
          `${s.inningsPitched ?? "0.0"} IP`,
        ].join(" · ");
        return {
          year: String(sp.season ?? ""),
          team: sp.team?.name ?? "",
          league: sp.league?.name,
          line,
        };
      });

    return {
      freeAgent: !person.currentTeam,
      currentTeam: person.currentTeam?.name,
      position: person.primaryPosition?.abbreviation,
      bats: person.batSide?.code,
      throws: person.pitchHand?.code,
      height: person.height,
      weight: person.weight,
      birthDate: person.birthDate,
      birthCity: person.birthCity,
      birthCountry: person.birthCountry,
      active: person.active,
      career: career
        ? {
            wins: Number(career.wins ?? 0),
            losses: Number(career.losses ?? 0),
            era: String(career.era ?? "—"),
            games: Number(career.gamesPlayed ?? career.games ?? 0),
            gamesStarted: Number(career.gamesStarted ?? 0),
            saves: Number(career.saves ?? 0),
            inningsPitched: String(career.inningsPitched ?? "0.0"),
            strikeOuts: Number(career.strikeOuts ?? 0),
            walks: Number(career.baseOnBalls ?? 0),
            whip: String(career.whip ?? "—"),
          }
        : undefined,
      seasons,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

interface LivePlayerStatsProps {
  /** MLB Stats API personId (e.g. player id from MLB Stats API) */
  mlbPlayerId: number;
  /** ESPN player id for the outbound link */
  espnPlayerId?: number;
  /** Display name (used in headings and links) */
  displayName: string;
  /** Slug used for data-testid hooks */
  slug: string;
}

export default function LivePlayerStats({
  mlbPlayerId,
  espnPlayerId,
  displayName,
  slug,
}: LivePlayerStatsProps) {
  const [snap, setSnap] = useState<LiveCareerSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchMLBPlayer(mlbPlayerId)
      .then((s) => {
        if (!alive) return;
        if (!s) setError("MLB Stats API unavailable — showing static career.");
        else setSnap(s);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [mlbPlayerId]);

  return (
    <div
      className="mt-4 rounded-xl border border-[#1E90FF]/30 bg-black/60 p-4"
      data-testid={`live-stats-${slug}`}
    >
      <header className="mb-3 flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#1E90FF]"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
            Live · MLB Stats API
          </span>
        </div>
        <span className="text-[10px] text-white/45">
          {loading
            ? "Hydrating…"
            : snap
              ? `Updated ${new Date(snap.fetchedAt).toLocaleString()}`
              : error
                ? "Static fallback"
                : "—"}
        </span>
      </header>

      {snap && (
        <>
          {/* Status badge */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {snap.freeAgent ? (
              <span className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                Free Agent
              </span>
            ) : (
              <span className="rounded-full border border-[#1E90FF]/60 bg-[#1E90FF]/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#1E90FF]">
                {snap.currentTeam ?? "Active"}
              </span>
            )}
            {snap.position && (
              <span className="text-[11px] font-bold text-white/70">{snap.position}</span>
            )}
            {snap.bats && snap.throws && (
              <span className="text-[11px] text-white/60">
                B/T {snap.bats}/{snap.throws}
              </span>
            )}
            {snap.height && snap.weight && (
              <span className="text-[11px] text-white/60">
                {snap.height} · {snap.weight} lb
              </span>
            )}
          </div>

          {/* Aggregate career line */}
          {snap.career && (
            <div className="mb-3 rounded-lg border border-white/10 bg-[#0a1628] p-3">
              <div className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#88a8ff]">
                Pro Career (MLB-issued)
              </div>
              <div className="text-[12px] text-white/85">
                <span className="font-bold text-white">
                  {snap.career.wins}-{snap.career.losses}
                </span>{" "}
                · <span className="font-bold">{snap.career.era}</span> ERA ·{" "}
                <span className="font-bold">{snap.career.strikeOuts}</span> K ·{" "}
                <span className="font-bold">{snap.career.inningsPitched}</span> IP ·{" "}
                <span className="font-bold">{snap.career.games}</span> G
                {snap.career.gamesStarted ? ` (${snap.career.gamesStarted} GS)` : ""}
                {snap.career.saves ? ` · ${snap.career.saves} SV` : ""}
                {snap.career.whip && snap.career.whip !== "—"
                  ? ` · ${snap.career.whip} WHIP`
                  : ""}
              </div>
            </div>
          )}

          {/* Per-season breakdown */}
          {snap.seasons.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#88a8ff]">
                Year-by-Year
              </div>
              <ul className="space-y-1">
                {snap.seasons.map((s, i) => (
                  <li key={`${s.year}-${i}`} className="text-[11.5px] text-white/75">
                    <span className="font-bold text-[#1E90FF]">{s.year}</span>{" "}
                    <span className="text-white/55">{s.team}</span>
                    {s.league ? <span className="text-white/40"> · {s.league}</span> : ""}
                    <div className="pl-3 text-white/65">{s.line}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {!snap && !loading && (
        <div className="text-[12px] text-white/60">
          MLB Stats API didn't respond — career rendered from the static
          fallback above. Card will retry on next visit.
        </div>
      )}

      <footer className="mt-3 flex flex-wrap gap-3 border-t border-white/5 pt-2">
        <a
          href={`https://www.mlb.com/player/${mlbPlayerId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60 hover:text-[#1E90FF]"
        >
          MLB.com ↗
        </a>
        {espnPlayerId && (
          <a
            href={`https://www.espn.com/mlb/player/_/id/${espnPlayerId}/${displayName.toLowerCase().replace(/\s+/g, "-")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60 hover:text-[#1E90FF]"
          >
            ESPN ↗
          </a>
        )}
        <a
          href={`https://www.milb.com/player/${mlbPlayerId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60 hover:text-[#1E90FF]"
        >
          MiLB.com ↗
        </a>
      </footer>
    </div>
  );
}
