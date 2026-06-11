/**
 * ChampionshipBracketsTop — Seasonal championship spotlight.
 *
 * Updated 2026-06-10 per Chad's standing doctrine:
 *   "Sports go by the season. WCWS is over — Texas wins back-to-back.
 *    Remove all WCWS brackets and scores. MCWS is the live highlight —
 *    8 teams in Omaha, June 13-24. Diamond Grind stays alongside MCWS."
 *
 * Brand-locked: cobalt #1E90FF + true black + white. No gold/yellow/orange.
 */

import { LiveRegionalScoreboard } from "./LiveRegionalScoreboard";
import { RegionalBracketTree } from "./RegionalBracketTree";

/** Texas WCWS back-to-back champions banner — shown after WCWS ends */
function WCWSChampionsBanner() {
  return (
    <div
      className="rounded-2xl border border-[#1E90FF]/40 bg-gradient-to-r from-[#0a1628] via-black to-[#0a1628] p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-3"
      data-testid="wcws-champions-banner"
    >
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#1E90FF] mb-1">
          2026 NCAA Division I Softball Championship · Final
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-[0.18em] bg-[#1E90FF] text-white px-2 py-0.5 rounded">
            CHAMPIONS
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.18em] bg-white/10 text-white/70 px-2 py-0.5 rounded">
            WCWS · Devon Park · OKC
          </span>
        </div>
        <h3 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-white">
          #1 <span className="text-[#1E90FF]">Texas Longhorns</span>
        </h3>
        <p className="mt-1 text-[13px] text-white/70 font-bold">
          Back-to-Back National Champions · 2025 &amp; 2026
        </p>
        <p className="mt-0.5 text-[11px] text-white/45 uppercase tracking-[0.16em]">
          Women's College World Series · Complete
        </p>
      </div>
      <a
        href="https://www.ncaa.com/brackets/softball/d1/2026"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-xl border border-white/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/80 transition hover:border-[#1E90FF]/60 hover:text-white"
        data-testid="wcws-champions-ncaa-link"
      >
        Final Bracket ↗
      </a>
    </div>
  );
}

/** MCWS live block — 8 teams, Omaha, June 13-24 */
function MCWSLiveBlock() {
  return (
    <article
      className="flex flex-col rounded-2xl border border-[#1E90FF]/50 bg-gradient-to-br from-[#0a1628] to-black p-4 md:p-5"
      data-testid="bracket-top-mcws"
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
            2026 NCAA Division I Baseball Championship
          </div>
          <h3 className="mt-1 text-2xl md:text-3xl font-black tracking-tight text-white">
            Road to <span className="text-[#1E90FF]">Omaha</span>
          </h3>
          <p className="mt-1 text-[12px] text-white/65">
            Men's College World Series · Charles Schwab Field · Omaha, NE
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#88a8ff]">
            8 teams · Double elimination → Best-of-3 Finals · Jun 13–24
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.22em] bg-[#1E90FF] text-white px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            LIVE
          </span>
          <span className="rounded-full border border-[#1E90FF]/60 bg-[#1E90FF]/12 text-[#1E90FF] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]">
            MEN
          </span>
        </div>
      </header>

      {/* LIVE scoreboard — auto-refreshes every 60s from ESPN */}
      <div className="mb-3">
        <LiveRegionalScoreboard sport="baseball" />
      </div>

      {/* LIVE bracket tree */}
      <div className="mb-3">
        <RegionalBracketTree sport="baseball" />
      </div>

      <footer className="mt-auto flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
        <a
          href="/brackets/mcws"
          className="rounded-xl bg-[#1E90FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#0080FF]"
          data-testid="bracket-top-live-mcws"
        >
          Open Full MCWS View →
        </a>
        <a
          href="https://www.ncaa.com/brackets/baseball/d1/2026"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/80 transition hover:border-[#1E90FF]/60 hover:text-white"
          data-testid="bracket-top-ncaa-mcws"
        >
          Official NCAA ↗
        </a>
      </footer>
    </article>
  );
}

export default function ChampionshipBracketsTop() {
  return (
    <section
      className="relative border-b border-[#1E90FF]/20 bg-black px-3 py-5 md:py-6"
      data-testid="brackets-top-strip"
    >
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Section header */}
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#1E90FF]">
              Live Championship Brackets · MCWS
            </div>
            <h2 className="mt-0.5 text-[15px] font-black uppercase tracking-[0.14em] text-white md:text-base">
              College World Series · Omaha · Auto-refresh every 60s
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            Men. Women. Every Athlete.
          </span>
        </div>

        {/* WCWS Champions callout — season is over, give props */}
        <WCWSChampionsBanner />

        {/* MCWS — live now in Omaha */}
        <MCWSLiveBlock />
      </div>
    </section>
  );
}
