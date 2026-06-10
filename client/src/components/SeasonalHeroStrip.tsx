// SeasonalHeroStrip — rotates with the current sports season.
// Mission: AthlynX exists to help all sports, all ages, men and women — every athlete.
// Brand lock: cobalt #1E90FF + true black + white. No gold/yellow/orange.

import { Link } from "wouter";
import { useMemo } from "react";

interface SeasonalSlot {
  label: string;        // e.g. "MCWS REGIONALS"
  subLabel: string;     // e.g. "Men's College World Series · Live"
  href: string;
  status: "LIVE" | "TONIGHT" | "THIS WEEK" | "UP NEXT";
  accentNote: string;   // e.g. "16 regionals · 64 teams"
}

/**
 * Returns the seasonal lineup for today.
 * The platform exists for ALL sports, ALL ages, men + women — this strip
 * surfaces whichever championships and seasons are live RIGHT NOW.
 */
function getSeasonalSlots(now: Date): SeasonalSlot[] {
  const month = now.getMonth(); // 0 = Jan, 4 = May, 5 = June
  const day = now.getDate();

  const slots: SeasonalSlot[] = [];

  //  BASEBALL / SOFTBALL POSTSEASON (mid-May → late June) 
  const inBaseballPostseason = (month === 4 && day >= 15) || month === 5 || (month === 6 && day <= 5);
  if (inBaseballPostseason) {
    // MCWS — Regionals begin May 29, Supers June 5-8, Omaha June 13-24
    if ((month === 4 && day >= 29) || (month === 5 && day <= 24)) {
      slots.push({
        label: "MCWS · MEN",
        subLabel: "Road to Omaha — Regionals → Supers → CWS",
        href: "/brackets/mcws",
        status: month === 5 && day >= 13 ? "LIVE" : (month === 4 && day === 29 ? "LIVE" : "THIS WEEK"),
        accentNote: "16 regionals · 64 teams · live ESPN scores",
      });
    }
    // WCWS — Devon Park, May 28 → June 5
    if ((month === 4 && day >= 28) || (month === 5 && day <= 5)) {
      slots.push({
        label: "WCWS · WOMEN",
        subLabel: "Oklahoma City — Devon Park",
        href: "/brackets/wcws",
        status: "LIVE",
        accentNote: "8 teams · double-elimination · ESPN",
      });
    }
  }

  //  DIAMOND GRIND — youth pipeline, the lifeblood lane, always present in baseball/softball season 
  if (inBaseballPostseason || (month >= 1 && month <= 7)) {
    slots.push({
      label: "DIAMOND GRIND IQ",
      subLabel: "Youth Battery IQ — Pitcher + Catcher",
      href: "/diamond-grind-iq",
      status: "LIVE",
      accentNote: "Where we find the diamonds in the rough",
    });
  }

  //  NBA PLAYOFFS / FINALS (mid-April → mid-June) 
  if ((month === 3 && day >= 15) || month === 4 || (month === 5 && day <= 22)) {
    slots.push({
      label: "NBA · COURT KINGS",
      subLabel: month === 5 ? "NBA Finals — Larry O'Brien Trophy" : "NBA Playoffs",
      href: "/court-kings",
      status: month === 5 && day >= 5 ? "LIVE" : "THIS WEEK",
      accentNote: "Men's pro basketball postseason",
    });
  }

  //  NHL STANLEY CUP (mid-April → mid-June) 
  if ((month === 3 && day >= 15) || month === 4 || (month === 5 && day <= 22)) {
    slots.push({
      label: "STANLEY CUP",
      subLabel: month === 5 ? "Stanley Cup Final" : "NHL Playoffs",
      href: "/sports",
      status: month === 5 && day >= 4 ? "LIVE" : "THIS WEEK",
      accentNote: "Men's pro hockey postseason",
    });
  }

  //  WNBA SEASON (May → October, Finals October) 
  if ((month === 4 && day >= 15) || month === 5 || month === 6 || month === 7 || month === 8 || (month === 9 && day <= 20)) {
    slots.push({
      label: "WNBA",
      subLabel: month === 9 ? "WNBA Finals" : "WNBA Season",
      href: "/court-kings",
      status: "THIS WEEK",
      accentNote: "Women's pro basketball",
    });
  }

  //  COLLEGE FOOTBALL (Aug 24 → Jan 20) 
  if ((month === 7 && day >= 24) || month === 8 || month === 9 || month === 10 || month === 11 || (month === 0 && day <= 20)) {
    slots.push({
      label: "CFB",
      subLabel: month === 11 || month === 0 ? "College Football Playoff" : "College Football Season",
      href: "/sports",
      status: "THIS WEEK",
      accentNote: "Men's college football · all divisions",
    });
  }

  //  NFL SEASON (Sep → Feb) 
  if (month === 8 || month === 9 || month === 10 || month === 11 || month === 0 || (month === 1 && day <= 14)) {
    slots.push({
      label: "NFL",
      subLabel: month === 1 ? "Super Bowl" : (month === 0 ? "NFL Playoffs" : "NFL Season"),
      href: "/sports",
      status: "THIS WEEK",
      accentNote: "Men's pro football",
    });
  }

  //  COLLEGE BASKETBALL / MARCH MADNESS (Nov → early April) 
  if (month === 10 || month === 11 || month === 0 || month === 1 || (month === 2 && day <= 31) || (month === 3 && day <= 8)) {
    slots.push({
      label: "MARCH MADNESS",
      subLabel: month === 2 || month === 3 ? "NCAA Tournament — Men & Women" : "College Basketball Season",
      href: "/court-kings",
      status: month === 2 && day >= 17 ? "LIVE" : "THIS WEEK",
      accentNote: "Both brackets · men's + women's",
    });
  }

  //  MLB SEASON (late March → early November) 
  if ((month === 2 && day >= 24) || month === 3 || month === 4 || month === 5 || month === 6 || month === 7 || month === 8 || (month === 9 && day <= 5)) {
    slots.push({
      label: "MLB",
      subLabel: month === 9 || (month === 8 && day >= 28) ? "MLB Postseason" : "MLB Season",
      href: "/sports",
      status: month === 9 ? "LIVE" : "THIS WEEK",
      accentNote: "Major League Baseball",
    });
  }

  //  PGA / GOLF MAJORS (April Masters, May PGA, June US Open, July Open) 
  if (month === 3 || month === 4 || month === 5 || month === 6) {
    const majorName =
      month === 3 ? "The Masters" :
      month === 4 ? "PGA Championship" :
      month === 5 ? "U.S. Open" :
      "The Open Championship";
    slots.push({
      label: "FAIRWAY ELITE",
      subLabel: majorName,
      href: "/fairway-elite",
      status: "THIS WEEK",
      accentNote: "Men's + women's pro golf",
    });
  }

  //  SOCCER (year-round, World Cup summer 2026, NWSL Mar–Nov) 
  if (month === 5 || month === 6) {
    slots.push({
      label: "PITCH PULSE",
      subLabel: "FIFA World Cup 2026 · USA · CAN · MEX",
      href: "/pitch-pulse",
      status: "UP NEXT",
      accentNote: "Men's and women's global soccer",
    });
  }

  // De-duplicate by label
  const seen = new Set<string>();
  return slots.filter((s) => {
    if (seen.has(s.label)) return false;
    seen.add(s.label);
    return true;
  });
}

function StatusPill({ status }: { status: SeasonalSlot["status"] }) {
  if (status === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.22em] bg-[#1E90FF] text-white px-1.5 py-0.5 rounded">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> LIVE
      </span>
    );
  }
  if (status === "TONIGHT") {
    return <span className="text-[9px] font-black uppercase tracking-[0.22em] bg-[#1E90FF]/30 text-[#88a8ff] px-1.5 py-0.5 rounded">TONIGHT</span>;
  }
  if (status === "THIS WEEK") {
    return <span className="text-[9px] font-black uppercase tracking-[0.22em] bg-white/10 text-white/80 px-1.5 py-0.5 rounded">THIS WEEK</span>;
  }
  return <span className="text-[9px] font-black uppercase tracking-[0.22em] bg-white/5 text-white/50 px-1.5 py-0.5 rounded">UP NEXT</span>;
}

export default function SeasonalHeroStrip() {
  const slots = useMemo(() => getSeasonalSlots(new Date()), []);
  if (slots.length === 0) return null;

  // Featured = first slot (highest priority — what's most "in season" right now)
  const featured = slots[0];
  const rest = slots.slice(1);

  return (
    <section
      aria-label="In-Season Championships and Sports"
      className="relative border-b border-[#1E90FF]/30 bg-gradient-to-b from-black via-[#0a1628] to-black"
    >
      <div className="max-w-7xl mx-auto px-4 py-5">
        {/* Mission line */}
        <div className="text-center mb-4">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#1E90FF] font-black">
            IN SEASON · ALL SPORTS · ALL AGES · MEN & WOMEN
          </p>
          <p className="text-[10px] text-white/40 mt-1 italic">
            The top of this page rotates with the season. Whatever is live right now lives here.
          </p>
        </div>

        {/* Featured slot — large card */}
        <Link href={featured.href}>
          <a
            className="block group border border-[#1E90FF]/50 rounded-xl bg-gradient-to-r from-[#1E90FF]/15 via-black to-black p-4 md:p-5 mb-3 hover:border-[#1E90FF] hover:shadow-[0_0_32px_-8px_rgba(30,144,255,0.6)] transition"
            data-testid="link-seasonal-featured"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusPill status={featured.status} />
                  <span className="text-[10px] uppercase tracking-[0.22em] text-white/50 font-black truncate">
                    {featured.label}
                  </span>
                </div>
                <div className="text-base md:text-xl font-black text-white tracking-tight truncate group-hover:text-[#1E90FF] transition">
                  {featured.subLabel}
                </div>
                <div className="text-[11px] text-white/60 mt-0.5 truncate">{featured.accentNote}</div>
              </div>
              <div className="text-[#1E90FF] text-2xl font-black flex-shrink-0">→</div>
            </div>
          </a>
        </Link>

        {/* Other in-season slots — horizontal scroll on mobile */}
        {rest.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-[#1E90FF]/40 [&::-webkit-scrollbar-track]:bg-transparent">
            {rest.map((s) => (
              <Link key={s.label} href={s.href}>
                <a
                  className="flex-shrink-0 min-w-[200px] md:min-w-[220px] border border-white/10 rounded-lg bg-black/60 p-3 hover:border-[#1E90FF]/60 hover:bg-[#1E90FF]/5 transition group"
                  data-testid={`link-seasonal-${s.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <StatusPill status={s.status} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-white/80 mb-0.5">
                    {s.label}
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-[#1E90FF] transition truncate">
                    {s.subLabel}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5 truncate">{s.accentNote}</div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
