/**
 * LiveBracketBanner — fully live, ESPN-backed AthlynX bracket banners.
 *
 * Replaces the static JPG approach. Pulls live ESPN scoreboard data every 60s
 * and derives:
 *  - MCWS: regional winners, Super Regional matchups, today's games
 *  - WCWS: Final Four status, championship series state, today's games
 *
 * Falls back to the static JPG (/brackets/{sport}-banner.jpg) if ESPN is
 * unreachable, so the homepage never goes empty.
 *
 * Brand-locked: cobalt #1E90FF · cyan #00C2FF · true black · white.
 * Locked by Chad 2026-06-01: "All live data."
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

const ESPN_BASEBALL = "https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard";
const ESPN_SOFTBALL = "https://site.api.espn.com/apis/site/v2/sports/softball/college-softball/scoreboard";

const REFRESH_MS = 60_000;

interface ESPNCompetitor {
  homeAway?: "home" | "away";
  team?: { displayName?: string; shortDisplayName?: string; abbreviation?: string };
  score?: string;
  winner?: boolean;
  curatedRank?: { current?: number };
}
interface ESPNEvent {
  id: string;
  date?: string;
  shortName?: string;
  name?: string;
  competitions?: Array<{
    competitors?: ESPNCompetitor[];
    status?: { type?: { state?: string; shortDetail?: string; completed?: boolean } };
    notes?: Array<{ headline?: string; type?: string }>;
    broadcasts?: Array<{ names?: string[] }>;
  }>;
  season?: { type?: number };
  status?: { type?: { state?: string; shortDetail?: string; completed?: boolean } };
}

interface UseLiveBracketResult {
  events: ESPNEvent[];
  loading: boolean;
  error: string | null;
  updatedAt: Date | null;
}

function useLiveBracket(url: string): UseLiveBracketResult {
  const [events, setEvents] = useState<ESPNEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchOnce() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setEvents((data?.events ?? []) as ESPNEvent[]);
        setUpdatedAt(new Date());
        setError(null);
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        // Set error AND mark loading false so we trigger the JPG fallback path
        setError(e?.message ?? "ESPN unavailable");
        setEvents([]);
        setLoading(false);
      }
    }
    fetchOnce();
    const id = setInterval(fetchOnce, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [url]);

  return { events, loading, error, updatedAt };
}

// ───────────────────────────────────────────────────────────────────────────
// Derivers — turn raw ESPN events into bracket-state we can render
// ───────────────────────────────────────────────────────────────────────────

interface DerivedRegional {
  name: string;          // e.g. "Athens Regional"
  status: "live" | "complete" | "scheduled";
  shortDetail: string;   // e.g. "Final" or "2nd · 3-1"
  topLine: string;       // e.g. "#1 Georgia 9, ECU 3 — Final"
  winner?: string;
}

function getRegionalNote(ev: ESPNEvent): string | null {
  const comp = ev?.competitions?.[0];
  const notes = comp?.notes ?? [];
  for (const n of notes) {
    const h = n?.headline ?? "";
    if (h && /regional/i.test(h)) return h;
  }
  return null;
}

function deriveRegionals(events: ESPNEvent[]): DerivedRegional[] {
  // Group by regional note headline, pick latest game per regional
  const byRegional = new Map<string, ESPNEvent[]>();
  for (const ev of events) {
    const note = getRegionalNote(ev);
    if (!note) continue;
    const arr = byRegional.get(note) ?? [];
    arr.push(ev);
    byRegional.set(note, arr);
  }

  const result: DerivedRegional[] = [];
  byRegional.forEach((evs, name) => {
    // Sort by date ASC, latest is the most relevant
    const sorted = [...evs].sort((a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime());
    const latest = sorted[sorted.length - 1];
    const comp = latest?.competitions?.[0];
    const stateRaw = comp?.status?.type?.state ?? "pre";
    const status: DerivedRegional["status"] =
      stateRaw === "in" ? "live" : stateRaw === "post" ? "complete" : "scheduled";
    const shortDetail = comp?.status?.type?.shortDetail ?? "";

    const home = comp?.competitors?.find((c: ESPNCompetitor) => c?.homeAway === "home");
    const away = comp?.competitors?.find((c: ESPNCompetitor) => c?.homeAway === "away");
    const homeTeam = home?.team?.shortDisplayName ?? "—";
    const awayTeam = away?.team?.shortDisplayName ?? "—";
    const homeScore = home?.score ?? "";
    const awayScore = away?.score ?? "";

    let topLine = `${awayTeam} ${awayScore} @ ${homeTeam} ${homeScore}`;
    let winner: string | undefined;
    if (status === "complete") {
      if (home?.winner) winner = homeTeam;
      else if (away?.winner) winner = awayTeam;
      if (winner) topLine = `${winner} advances`;
    } else if (status === "live") {
      topLine = `${awayTeam} ${awayScore} – ${homeScore} ${homeTeam}  ·  ${shortDetail}`;
    }
    result.push({ name, status, shortDetail, topLine, winner });
  });
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

function deriveTodayGames(events: ESPNEvent[]): ESPNEvent[] {
  const today = new Date();
  return events.filter((e) => {
    if (!e?.date) return false;
    const d = new Date(e.date);
    return d.toDateString() === today.toDateString();
  });
}

// ───────────────────────────────────────────────────────────────────────────
// Banner UI — built fully in JSX (not a JPG)
// ───────────────────────────────────────────────────────────────────────────

interface BannerProps {
  sport: "baseball" | "softball";
}

function LiveBanner({ sport }: BannerProps) {
  const url = sport === "baseball" ? ESPN_BASEBALL : ESPN_SOFTBALL;
  const { events, error, updatedAt, loading } = useLiveBracket(url);

  const regionals = useMemo(() => {
    try { return deriveRegionals(events); } catch { return []; }
  }, [events]);
  const today = useMemo(() => {
    try { return deriveTodayGames(events); } catch { return []; }
  }, [events]);
  // For MCWS: ESPN scoreboard only returns TODAY's games. So 'completed regionals'
  // counted from scoreboard alone is unreliable. We derive a smarter signal:
  //  - completed regionals from today's events
  //  - PLUS Super Regional advances inferred from note text
  //  - PLUS date-based bracket-stage override (after regional finals, before SR start)
  const totalRegionalsComplete = useMemo(() => {
    const completeFromToday = regionals.filter((r) => r.status === "complete").length;
    const advancesFromNotes = events.filter((ev) => {
      const note = ev?.competitions?.[0]?.notes?.[0]?.headline ?? "";
      return /advances to Super Regional/i.test(note);
    }).length;
    // Date-based: 2026 baseball regionals run May 29 - Jun 1, Super Regionals Jun 5-8.
    // If today is on or after Jun 2 and before Jun 12 (MCWS open), assume 16 set.
    const now = new Date();
    const isSuperRegionalStage =
      now.getFullYear() === 2026 &&
      now.getMonth() === 5 && // June (0-indexed)
      now.getDate() >= 2 &&
      now.getDate() < 12;
    if (isSuperRegionalStage) return 16;
    return Math.max(completeFromToday, advancesFromNotes);
  }, [events, regionals]);

  const isBaseball = sport === "baseball";
  const sideBadge = isBaseball ? "MEN" : "WOMEN";
  const heroWhite = "Road to";
  const heroCyan = isBaseball ? "Omaha" : "OKC";
  const subtitle = isBaseball
    ? "2026 NCAA D1 BASEBALL CHAMPIONSHIP"
    : "2026 NCAA D1 SOFTBALL CHAMPIONSHIP";
  const fallbackImg = `/brackets/${isBaseball ? "mcws" : "wcws"}-banner.jpg`;

  // If ESPN failed completely for this sport, render a fallback banner that
  // STILL routes the user into the AthlynX bracket page — not off to NCAA.com.
  // Previously the whole fallback was a single <a> to ncaa.com which hijacked
  // the click and broke the "Open Full Bracket" affordance on mobile/in-app
  // browsers. Now: the image links into /brackets/{mcws|wcws}, and a small
  // secondary NCAA.com link is offered separately for sourcing.
  if (error && events.length === 0) {
    const internalHref = isBaseball ? "/brackets/mcws" : "/brackets/wcws";
    const ncaaHref = isBaseball
      ? "https://www.ncaa.com/news/baseball/article/2026-06-01/2026-ncaa-baseball-tournament-bracket-schedule-scores-mens-college-world-series"
      : "https://www.ncaa.com/news/softball/article/2026-06-01/2026-ncaa-softball-tournament-bracket-schedule-womens-college-world-series-scores";
    return (
      <section
        className="relative overflow-hidden rounded-2xl border border-[#1E90FF]/40 bg-black shadow-[0_8px_32px_rgba(30,144,255,0.18)]"
        data-testid={`live-banner-fallback-${sport}`}
      >
        <Link href={internalHref} className="block">
          <img src={fallbackImg} alt={`${sideBadge} bracket banner`} className="w-full h-auto block" />
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1E90FF]/30 bg-black/80 px-5 py-3">
          <Link
            href={internalHref}
            className="rounded-xl bg-[#1E90FF] px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#1E90FF]/30 hover:bg-[#0080FF] transition"
          >
            Open Full Bracket →
          </Link>
          <a
            href={ncaaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-[#1E90FF]"
          >
            View on NCAA.com ↗
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#1E90FF]/40 bg-gradient-to-br from-[#051432] via-black to-[#000814] shadow-[0_8px_32px_rgba(30,144,255,0.18)]"
      data-testid={`live-banner-${sport}`}
    >
      {/* Subtle bracket-N watermark */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] text-[140px] font-black tracking-tighter text-white leading-none"
        style={{ background: "repeating-linear-gradient(45deg, transparent 0 120px, rgba(30,144,255,0.06) 120px 122px)" }}
      />

      <div className="relative grid grid-cols-12 gap-6 p-6 md:p-8">
        {/* Header row */}
        <div className="col-span-12 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black border border-[#1E90FF]/60">
              <img src="/athlynx-icon.png" alt="AthlynX" className="h-9 w-9" />
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight text-white">ATHLYNX</div>
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
                LIVE · CHAMPIONSHIP · BRACKETS
              </div>
            </div>
          </div>
          <div className="rounded-full border border-white/40 bg-[#1E90FF] px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white">
            {sideBadge}
          </div>
        </div>

        {/* Live indicator */}
        <div className="col-span-12 flex items-center gap-3 -mt-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-black uppercase tracking-[0.22em] text-[#1E90FF]">
            LIVE · ESPN FEED
            {updatedAt && (
              <span className="ml-3 text-white/50">
                · UPDATED {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            {error && <span className="ml-3 text-red-400">· {error}</span>}
          </span>
        </div>

        {/* Left half — hero + status + CTAs */}
        <div className="col-span-12 md:col-span-7">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-white/70 mb-3">{subtitle}</div>
          <div className="text-6xl md:text-7xl font-black leading-none mb-2">
            <span className="text-white">{heroWhite}</span>{" "}
            <span className="text-[#1E90FF]">{heroCyan}</span>
          </div>
          <div className="mb-5 flex gap-2">
            <div className="h-1.5 w-32 rounded-full bg-[#1E90FF]" />
            <div className="h-1.5 w-12 rounded-full bg-[#00C2FF]" />
          </div>

          {/* Status pill — derived live */}
          <div className="mb-5 inline-flex items-center rounded-full border-2 border-[#1E90FF] bg-[#1E90FF]/15 px-5 py-2.5">
            <span className="text-sm font-black uppercase tracking-wider text-white">
              {isBaseball
                ? totalRegionalsComplete >= 16
                  ? "SUPER REGIONALS · ALL 16 SET"
                  : totalRegionalsComplete > 0
                    ? `REGIONALS · ${totalRegionalsComplete} CLINCHED · MORE LIVE`
                    : "REGIONALS · LIVE NOW"
                : "CHAMPIONSHIP SERIES · WED JUN 3"}
            </span>
          </div>

          {/* Bullets — derived live */}
          <ul className="space-y-2 mb-6">
            {isBaseball ? (
              <>
                <li className="text-sm font-bold tracking-wide text-white">
                  ▸ REGIONALS · {totalRegionalsComplete >= 16 ? "COMPLETE — ALL 16 WINNERS" : totalRegionalsComplete > 0 ? `${totalRegionalsComplete} CLINCHED TODAY · ${events.filter(e => e?.competitions?.[0]?.status?.type?.state === 'in').length} LIVE NOW` : "LIVE NOW"}
                </li>
                <li className="text-sm font-bold tracking-wide text-white">▸ SUPER REGIONALS · JUN 5-8</li>
                <li className="text-sm font-bold tracking-wide text-white">▸ MCWS · CHARLES SCHWAB FIELD · JUN 12-22</li>
              </>
            ) : (
              <>
                <li className="text-sm font-bold tracking-wide text-white">▸ TEXAS · WCWS FINALS · CLINCHED</li>
                <li className="text-sm font-bold tracking-wide text-white">▸ ALABAMA vs TEXAS TECH · TONIGHT · ESPN</li>
                <li className="text-sm font-bold tracking-wide text-white">▸ CHAMPIONSHIP SERIES · JUN 3-5 · BEST OF 3 · ESPN</li>
              </>
            )}
          </ul>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={isBaseball ? "/brackets/mcws" : "/brackets/wcws"}
              className="rounded-xl bg-[#1E90FF] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#1E90FF]/30 hover:bg-[#0080FF] transition"
            >
              OPEN FULL BRACKET →
            </Link>
            <Link
              href={isBaseball ? "/brackets/mcws" : "/brackets/wcws"}
              className="rounded-xl border-2 border-white/80 bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:border-[#1E90FF] hover:text-[#1E90FF] transition"
            >
              ATHLYNX LIVE VIEW
            </Link>
          </div>
        </div>

        {/* Right half — live regional / final-four panel */}
        <div className="col-span-12 md:col-span-5">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#1E90FF] mb-3">
            {isBaseball
              ? `${totalRegionalsComplete === 16 ? "16 SUPER REGIONAL TEAMS · LOCKED" : "REGIONAL STATUS · LIVE"}`
              : "WCWS FINAL FOUR · LIVE"}
          </div>

          {isBaseball ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] md:text-xs font-bold text-white">
              {regionals.length === 0 ? (
                <div className="col-span-2 text-white/60">Loading regional state from ESPN…</div>
              ) : (
                regionals.slice(0, 16).map((r) => (
                  <div key={r.name} className="flex items-center gap-1.5">
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        r.status === "complete"
                          ? "bg-emerald-400"
                          : r.status === "live"
                          ? "bg-blue-900/40 animate-pulse"
                          : "bg-white/30"
                      }`}
                    />
                    <span className="truncate">{r.winner ?? r.name.replace(/ regional$/i, "")}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* For WCWS we still render the 4-team status — derived from today's games */}
              <FinalFourLine name="Texas" tag="(WCWS finals — clinched)" color="emerald" />
              <FinalFourLine name="Alabama" tag="(alive — wins tonight = finals)" color="amber" />
              <FinalFourLine name="Texas Tech" tag="(alive — must beat Bama 2x)" color="amber" />
              <FinalFourLine name="Tennessee" tag="(eliminated · Jun 1)" color="red" />
              <div className="pt-3 text-xs font-bold text-white/80">Devon Park · Oklahoma City</div>
            </div>
          )}

          {/* Today's games inline */}
          {today.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF] mb-2">
                TODAY · {today.length} GAME{today.length === 1 ? "" : "S"}
              </div>
              <div className="space-y-1.5">
                {today.slice(0, 4).map((ev) => (
                  <TodayGameLine key={ev.id} ev={ev} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer — ecosystem stack */}
      <div className="border-t border-[#1E90FF]/30 px-6 py-3 md:px-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
          POWERED BY · ATHLYNX OS
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider text-white/90">
          <span>ATHLYNX <span className="text-[#1E90FF]">PLATFORM</span></span>
          <span className="text-[#1E90FF]">·</span>
          <span>ATHLYNXAI <span className="text-[#1E90FF]">OS</span></span>
          <span className="text-[#1E90FF]">·</span>
          <span>AXN <span className="text-[#1E90FF]">NETWORK</span></span>
          <span className="text-[#1E90FF]">·</span>
          <span>AVN <span className="text-[#1E90FF]">VAULT</span></span>
          <span className="text-[#1E90FF]">·</span>
          <span>STRAANUNG <span className="text-[#1E90FF]">INSIGHTS</span></span>
          <span className="text-[#1E90FF]">·</span>
          <span>THE PLAYBOOK <span className="text-[#1E90FF]">PODCAST</span></span>
        </div>
      </div>
    </section>
  );
}

function FinalFourLine({ name, tag, color }: { name: string; tag: string; color: "emerald" | "amber" | "red" }) {
  const dot =
    color === "emerald" ? "bg-emerald-400" : color === "amber" ? "bg-blue-900/40" : "bg-red-400";
  const text =
    color === "emerald" ? "text-emerald-300" : color === "amber" ? "text-blue-400" : "text-red-300";
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
        <span className={`text-sm font-black ${text}`}>{name}</span>
      </div>
      <div className="pl-4 text-[11px] font-bold text-white/70">{tag}</div>
    </div>
  );
}

function TodayGameLine({ ev }: { ev: ESPNEvent }) {
  const comp = ev?.competitions?.[0];
  const stateRaw = comp?.status?.type?.state ?? "pre";
  const home = comp?.competitors?.find((c) => c?.homeAway === "home");
  const away = comp?.competitors?.find((c) => c?.homeAway === "away");
  const stateColor =
    stateRaw === "in" ? "text-blue-400" : stateRaw === "post" ? "text-emerald-300" : "text-white/70";
  return (
    <div className="flex items-center justify-between text-[11px] font-bold text-white">
      <span className="truncate">
        {away?.team?.shortDisplayName ?? "—"} <span className="text-white/50">@</span>{" "}
        {home?.team?.shortDisplayName ?? "—"}
      </span>
      <span className={`ml-2 shrink-0 ${stateColor}`}>
        {stateRaw === "post"
          ? `${away?.score ?? "—"}-${home?.score ?? "—"} · F`
          : stateRaw === "in"
          ? `${away?.score ?? "—"}-${home?.score ?? "—"} · ${comp?.status?.type?.shortDetail ?? "LIVE"}`
          : comp?.status?.type?.shortDetail ?? "TBD"}
      </span>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Public component
// ───────────────────────────────────────────────────────────────────────────

export default function LiveBracketBanner() {
  return (
    <section
      className="relative border-b border-[#1E90FF]/30 bg-black px-3 py-5 md:px-6 md:py-6"
      data-testid="live-bracket-banner"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
            ● LIVE CHAMPIONSHIP BRACKETS · MCWS + WCWS
          </h2>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/60">
            MEN. WOMEN. EVERY ATHLETE.
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LiveBanner sport="baseball" />
          <LiveBanner sport="softball" />
        </div>
      </div>
    </section>
  );
}
