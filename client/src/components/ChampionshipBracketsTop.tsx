/**
 * ChampionshipBracketsTop — LIVE MCWS + WCWS bracket trees + live scores at the
 * top of the homepage, above Diamond Grind. Both men and women, side-by-side.
 *
 * Locked by Chad 2026-05-31:
 *   "Live data only. WCWS is already underway — get that one caught up.
 *    Regionals end Monday; then Super Regionals start. Diamond Grind covers
 *    both sports. Brackets stay at the top above Diamond Grind. Everything
 *    else stays exactly the same."
 *
 * This component does NOT fetch its own data — it mounts the same live
 * ESPN-backed components used on /brackets/mcws and /brackets/wcws
 * (LiveRegionalScoreboard + RegionalBracketTree) so the homepage and the
 * dedicated bracket pages share one source of truth. As regional games
 * finish, the same hydration logic auto-rolls into Super Regionals.
 *
 * Brand-locked: cobalt #1E90FF + true black + white. No gold/yellow/orange.
 * Signoff:  */

import { useState } from "react";
import { LiveRegionalScoreboard } from "./LiveRegionalScoreboard";
import { RegionalBracketTree } from "./RegionalBracketTree";

type Tournament = "mcws" | "wcws";

const META: Record<
  Tournament,
  {
    sport: "baseball" | "softball";
    eyebrow: string;
    title: string;
    accent: string;
    sub: string;
    statusNote: string;
    liveHref: string;
    ncaaHref: string;
    badge: "MEN" | "WOMEN";
  }
> = {
  mcws: {
    sport: "baseball",
    eyebrow: "2026 NCAA DIVISION I BASEBALL CHAMPIONSHIP",
    title: "Road to Omaha",
    accent: "Omaha",
    sub: "Men's College World Series · Charles Schwab Field · Omaha, NE",
    statusNote:
      "Regionals through Mon Jun 1 · Super Regionals Fri Jun 5 · MCWS Jun 13–24",
    liveHref: "/brackets/mcws",
    ncaaHref: "https://www.ncaa.com/brackets/baseball/d1/2026",
    badge: "MEN",
  },
  wcws: {
    sport: "softball",
    eyebrow: "2026 NCAA DIVISION I SOFTBALL CHAMPIONSHIP",
    title: "Road to OKC",
    accent: "OKC",
    sub: "Women's College World Series · Devon Park · Oklahoma City, OK",
    statusNote:
      "WCWS underway since May 29 · championship series Jun 4–5 · live scores below",
    liveHref: "/brackets/wcws",
    ncaaHref: "https://www.ncaa.com/brackets/softball/d1/2026",
    badge: "WOMEN",
  },
};

function BracketBlock({ tournament }: { tournament: Tournament }) {
  const m = META[tournament];
  const isMen = tournament === "mcws";

  return (
    <article
      className="flex flex-col rounded-2xl border border-[#1E90FF]/30 bg-gradient-to-br from-[#0a1628] to-black p-4 md:p-5"
      data-testid={`bracket-top-${tournament}`}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
            {m.eyebrow}
          </div>
          <h3 className="mt-1 text-2xl md:text-3xl font-black tracking-tight text-white">
            {m.title.replace(m.accent, "")}
            <span className="text-[#1E90FF]">{m.accent}</span>
          </h3>
          <p className="mt-1 text-[12px] text-white/65">{m.sub}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#88a8ff]">
            {m.statusNote}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
            isMen
              ? "border border-[#1E90FF]/60 bg-[#1E90FF]/12 text-[#1E90FF]"
              : "border border-white/40 bg-white/10 text-white"
          }`}
        >
          {m.badge}
        </span>
      </header>

      {/* LIVE scoreboard — auto-refreshes every 60s from ESPN */}
      <div className="mb-3">
        <LiveRegionalScoreboard sport={m.sport} />
      </div>

      {/* LIVE bracket tree — fills slot-by-slot as games complete */}
      <div className="mb-3">
        <RegionalBracketTree sport={m.sport} />
      </div>

      <footer className="mt-auto flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
        <a
          href={m.liveHref}
          className="rounded-xl bg-[#1E90FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#0080FF]"
          data-testid={`bracket-top-live-${tournament}`}
        >
          Open Full {m.badge === "MEN" ? "MCWS" : "WCWS"} View →
        </a>
        <a
          href={m.ncaaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/80 transition hover:border-[#1E90FF]/60 hover:text-white"
          data-testid={`bracket-top-ncaa-${tournament}`}
        >
          Official NCAA ↗
        </a>
      </footer>
    </article>
  );
}

export default function ChampionshipBracketsTop() {
  // Mobile: tabbed (saves vertical space). Desktop: both side-by-side.
  const [active, setActive] = useState<Tournament>("mcws");

  return (
    <section
      className="relative border-b border-[#1E90FF]/20 bg-black px-3 py-5 md:py-6"
      data-testid="brackets-top-strip"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#1E90FF]">
              Championship Brackets · Live Data
            </div>
            <h2 className="mt-0.5 text-[15px] font-black uppercase tracking-[0.14em] text-white md:text-base">
              MCWS · WCWS · Auto-refresh every 60s
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            Men. Women. Every Athlete.
          </span>
        </div>

        {/* Mobile: tabbed */}
        <div className="md:hidden">
          <div className="mb-3 inline-flex rounded-xl border border-[#1E90FF]/40 bg-black p-1">
            <button
              type="button"
              onClick={() => setActive("mcws")}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                active === "mcws"
                  ? "bg-[#1E90FF] text-white"
                  : "text-white/70 hover:text-white"
              }`}
              data-testid="bracket-top-tab-mcws"
            >
              MCWS · Men
            </button>
            <button
              type="button"
              onClick={() => setActive("wcws")}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                active === "wcws"
                  ? "bg-[#1E90FF] text-white"
                  : "text-white/70 hover:text-white"
              }`}
              data-testid="bracket-top-tab-wcws"
            >
              WCWS · Women
            </button>
          </div>
          <BracketBlock tournament={active} />
        </div>

        {/* Desktop: both side-by-side */}
        <div className="hidden grid-cols-2 gap-4 md:grid">
          <BracketBlock tournament="mcws" />
          <BracketBlock tournament="wcws" />
        </div>
      </div>
    </section>
  );
}
