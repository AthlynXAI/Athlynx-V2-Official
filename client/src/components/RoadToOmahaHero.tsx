/**
 * AthlynX · Road to Omaha Hero (Landing Page Top Slot)
 *
 * Built May 29, 2026 · Locked May 29 · Chad A. Dozier Sr.
 *
 * The very top of athlynx.ai during regional/super-regional/CWS season.
 * Pairs the live regional bracket scoreboard with the Diamond Grind launch
 * card — the first true app inside the unified AthlynX platform.
 *
 * Doctrine: One App. Many inside. Diamond Grind is the proof.
 *
 * Brand lock: cobalt #1E90FF + true black + white. No gold/yellow/orange.
 * Signoff:  */

import { Link } from "wouter";
import { LiveRegionalScoreboard } from "@/components/LiveRegionalScoreboard";
import { RegionalBracketTree } from "@/components/RegionalBracketTree";
import LiveHighlightsFeed from "@/components/LiveHighlightsFeed";

/**
 * Diamond Grind logo mark — inline SVG.
 * Cobalt diamond outline + soft inner fill + white batter's-eye core
 * + two cobalt stitching strokes that read as both a baseball seam
 * and the corners of a diamond.
 */
function DiamondGrindLogo() {
  return (
    <svg
      viewBox="0 0 64 64"
      width="56"
      height="56"
      aria-label="Diamond Grind logo"
      className="shrink-0"
    >
      <path
        d="M32 4 L60 32 L32 60 L4 32 Z"
        fill="none"
        stroke="#1E90FF"
        strokeWidth="3"
        strokeLinejoin="miter"
      />
      <path
        d="M32 14 L50 32 L32 50 L14 32 Z"
        fill="#1E90FF"
        opacity="0.18"
      />
      <circle cx="32" cy="32" r="6" fill="#ffffff" />
      <path d="M28 30 Q32 28 36 30" stroke="#1E90FF" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M28 34 Q32 36 36 34" stroke="#1E90FF" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PillarCallout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#1E90FF]/30 bg-black/40 px-3 py-2">
      <div className="text-[9px] font-black tracking-[0.22em] uppercase text-[#88a8ff]">{label}</div>
      <div className="text-xs font-bold text-white mt-0.5">{value}</div>
    </div>
  );
}

function DiamondGrindLaunchCard() {
  return (
    <div
      className="relative overflow-hidden rounded-xl border-2 border-[#1E90FF] bg-gradient-to-br from-[#0a1628] via-black to-[#0a1628] shadow-[0_0_36px_-8px_rgba(30,144,255,0.55)]"
      aria-label="Diamond Grind launch — the first true app inside the AthlynX platform"
    >
      {/* Top ribbon — doctrine line */}
      <div className="flex items-center justify-between gap-2 px-5 md:px-6 py-2 border-b border-[#1E90FF]/25 bg-black/40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1E90FF] animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#1E90FF]">
            Now Live · The First App Inside AthlynX
          </span>
        </div>
        <span className="hidden sm:inline text-[9px] font-black tracking-[0.22em] uppercase text-white/40">
          One App. Many inside.
        </span>
      </div>

      {/* Body */}
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          {/* Brand block */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <DiamondGrindLogo />
            <div className="min-w-0">
              <div className="text-[10px] font-black tracking-[0.28em] uppercase text-[#88a8ff] mb-1">
                An AthlynX Brand
              </div>
              <div className="text-3xl md:text-4xl font-black tracking-tight leading-none">
                <span className="text-white">DIAMOND</span>{" "}
                <span className="text-[#1E90FF]">GRIND</span>
              </div>
              <div className="text-[10px] font-black tracking-[0.28em] uppercase text-white/55 mt-1">
                Youth Battery Coach · Ages 8 – 14
              </div>
              <p className="text-sm text-white/85 leading-snug mt-3 max-w-xl">
                The grind happens before the lights come on. Diamond Grind is the
                first true app inside AthlynX — a COPPA-safe coaching brain for
                pitchers and catchers, built so the kid in the bullpen tonight
                can be the arm in Omaha in 2034.
              </p>
            </div>
          </div>

          {/* CTA stack */}
          <div className="flex flex-col gap-2 md:items-end shrink-0">
            <Link href="/diamond-grind-iq">
              <a className="inline-flex items-center gap-2 rounded-2xl bg-[#1E90FF] px-5 py-3 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#1E90FF]/30 transition hover:bg-[#0080FF]">
                Open Diamond Grind
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </Link>
            <Link href="/signup">
              <a className="inline-flex items-center gap-2 rounded-2xl border border-[#1E90FF]/50 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-white/85 transition hover:bg-[#1E90FF]/10 hover:text-white">
                Start Free · 7-Day Trial
              </a>
            </Link>
            <span className="text-[10px] tracking-widest uppercase text-white/45 max-w-[180px] md:text-right">
              Free today · Card after day 7
            </span>
          </div>
        </div>

        {/* Pillar callouts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
          <PillarCallout label="Safety First" value="COPPA + Pitch Smart gates" />
          <PillarCallout label="Battery Coach" value="Pitchers + catchers" />
          <PillarCallout label="Five Agents" value="One unified brain" />
          <PillarCallout label="Parent Dashboard" value="Real-time visibility" />
        </div>

        {/* Footer line — platform doctrine */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-[10px] tracking-[0.22em] uppercase text-white/45">
            Inside AthlynX · The Athlete's Playbook
          </span>
          <span className="text-[10px] tracking-[0.22em] uppercase text-[#88a8ff]">
            More brands coming · One unified platform
          </span>
        </div>
      </div>
    </div>
  );
}

function RoadToOmahaIntro() {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
      <div>
        <div className="text-[11px] tracking-[0.22em] uppercase text-[#88a8ff] mb-1">
          AthlynX · The Athlete's Playbook
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
          ROAD TO OMAHA <span className="text-[#1E90FF]">·</span> Live Regional Bracket
        </h2>
        <p className="text-sm text-white/65 mt-1 max-w-3xl">
          16 regionals · 64 teams · every score, every matchup, every day. Auto-refresh every 60 seconds.
        </p>
      </div>
      <Link href="/brackets/mcws">
        <a className="text-[11px] font-black tracking-[0.22em] uppercase text-[#1E90FF] hover:text-white transition self-start md:self-auto">
          Open full bracket →
        </a>
      </Link>
    </div>
  );
}

export function RoadToOmahaHero() {
  return (
    <section
      aria-label="Road to Omaha live bracket and Diamond Grind launch"
      className="relative w-full bg-black border-b border-[#1E90FF]/20"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Live brackets first — top of page above Diamond Grind */}
        <div className="mb-6 rounded-3xl border-2 border-[#1E90FF]/70 bg-[#020817] p-3 shadow-[0_0_34px_rgba(30,144,255,0.32)] md:p-5">
          <div className="mb-4 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">Regionals · Super Regionals · MCWS · WCWS</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/60">Live daily matchups · ESPN/NCAA scores · YouTube highlights · 60-second refresh</div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2 text-center md:grid-cols-4">
            {["REGIONALS", "SUPER REGIONALS", "MCWS", "WCWS"].map((stage) => (
              <div key={stage} className="rounded-xl border border-[#1E90FF]/35 bg-black/45 px-2 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">{stage}</div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-[#1E90FF]/35 bg-black/35 p-3">
              <Link href="/brackets/mcws"><a className="mb-3 block text-xs font-black uppercase tracking-[0.2em] text-white hover:text-[#1E90FF]">MCWS Live · Regionals to Omaha →</a></Link>
              <LiveRegionalScoreboard sport="baseball" />
              <RegionalBracketTree sport="baseball" />
            </div>
            <div className="min-w-0 rounded-2xl border border-[#1E90FF]/35 bg-black/35 p-3">
              <Link href="/brackets/wcws"><a className="mb-3 block text-xs font-black uppercase tracking-[0.2em] text-white hover:text-[#1E90FF]">WCWS Live · Regionals to OKC →</a></Link>
              <LiveRegionalScoreboard sport="softball" />
              <RegionalBracketTree sport="softball" />
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-[#1E90FF]/25 bg-black/30 p-3">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white">ESPN · NCAA · YouTube Video Highlights</div>
            <LiveHighlightsFeed mode="both" compact />
          </div>
        </div>

        {/* Diamond Grind brand-up — the first true app inside AthlynX */}
        <div className="mb-6">
          <DiamondGrindLaunchCard />
        </div>

        {/* Road to Omaha live bracket */}
        <RoadToOmahaIntro />
        <LiveRegionalScoreboard sport="baseball" />
      </div>
    </section>
  );
}

export default RoadToOmahaHero;
