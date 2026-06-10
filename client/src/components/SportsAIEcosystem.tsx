// SportsAIEcosystem — AthlynXAI Sports AI Ecosystem wall
// Built Jun 2, 2026 · AthlynX — "Nvidia of Sports" framing per Chad 2026-06-01 11:27 PM CDT.
// Visual reference: NVIDIA DSX AI Factory Ecosystem (Jensen Huang keynote).
// Brand lock: true black + electric cobalt (#1E90FF) + white. No gold/yellow/orange.
// Aspirational ecosystem labeling — "Open to integrations" — never overclaims signed deals.

import { useEffect, useState, useRef } from "react";

// ───────────────────────────────────────────────────────────────────────────
// Ecosystem data — 4 grouped rows, top → bottom
// ───────────────────────────────────────────────────────────────────────────

interface EcosystemEntity {
  name: string;
  short?: string; // optional shorter display label for narrow tiles
}

interface EcosystemRow {
  label: string;
  caption: string;
  entities: EcosystemEntity[];
}

const ROWS: EcosystemRow[] = [
  {
    label: "Leagues · Conferences · Networks",
    caption: "Where the games live",
    entities: [
      { name: "NCAA" },
      { name: "MLB" },
      { name: "MiLB" },
      { name: "NFL" },
      { name: "NBA" },
      { name: "WNBA" },
      { name: "MLS" },
      { name: "SEC" },
      { name: "ACC" },
      { name: "Big Ten", short: "B1G" },
      { name: "Big 12" },
      { name: "Pac-12" },
      { name: "ESPN" },
      { name: "FOX Sports", short: "FOX" },
      { name: "CBS Sports", short: "CBS" },
      { name: "SECN" },
      { name: "ACCN" },
      { name: "B1G+" },
    ],
  },
  {
    label: "Schools · Athletic Programs",
    caption: "Where athletes are made",
    entities: [
      { name: "Georgia" },
      { name: "UCLA" },
      { name: "Texas" },
      { name: "Tennessee" },
      { name: "Alabama" },
      { name: "Florida" },
      { name: "Mississippi State", short: "MSU" },
      { name: "Oklahoma" },
      { name: "Texas Tech" },
      { name: "Auburn" },
      { name: "Georgia Tech", short: "GT" },
      { name: "Arkansas" },
      { name: "LSU" },
      { name: "Vanderbilt" },
      { name: "Virginia" },
      { name: "North Carolina", short: "UNC" },
      { name: "Florida State", short: "FSU" },
      { name: "Clemson" },
    ],
  },
  {
    label: "Brands · NIL · Athlete Economy",
    caption: "Where the deals get done",
    entities: [
      { name: "Nike" },
      { name: "adidas" },
      { name: "Under Armour", short: "UA" },
      { name: "New Balance", short: "NB" },
      { name: "Gatorade" },
      { name: "BodyArmor" },
      { name: "Wilson" },
      { name: "Rawlings" },
      { name: "Easton" },
      { name: "Marucci" },
      { name: "Topps" },
      { name: "Panini" },
      { name: "Fanatics" },
      { name: "On3" },
      { name: "Opendorse" },
      { name: "INFLCR" },
      { name: "MarketPryce" },
      { name: "Athliance" },
    ],
  },
  {
    label: "Data · Tech · Cloud · AI",
    caption: "The Nvidia-of-Sports infrastructure layer",
    entities: [
      { name: "ESPN Stats", short: "ESPN" },
      { name: "Statcast" },
      { name: "TrackMan" },
      { name: "Rapsodo" },
      { name: "Hudl" },
      { name: "Synergy" },
      { name: "Catapult" },
      { name: "WHOOP" },
      { name: "OpenAI" },
      { name: "Anthropic" },
      { name: "NVIDIA" },
      { name: "Google Cloud", short: "GCP" },
      { name: "AWS" },
      { name: "Vercel" },
      { name: "Neon" },
      { name: "Supabase" },
      { name: "Stripe" },
      { name: "Pipedream" },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────
// Tile
// ───────────────────────────────────────────────────────────────────────────

function EcosystemTile({ name, short }: EcosystemEntity) {
  const label = short || name;
  return (
    <div
      className="
        group relative flex items-center justify-center
        rounded-md border border-white/10 bg-white/[0.03]
        px-2 py-3 md:px-3 md:py-4
        transition
        hover:border-[#1E90FF]/60 hover:bg-[#1E90FF]/[0.08] hover:shadow-[0_0_24px_-6px_rgba(30,144,255,0.55)]
      "
      title={name}
    >
      <span className="text-[10px] md:text-xs font-bold tracking-tight text-white/85 group-hover:text-white text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────────

export default function SportsAIEcosystem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Fade-in on first scroll into view (lightweight, no deps)
  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const totalCount = ROWS.reduce((n, r) => n + r.entities.length, 0);

  return (
    <section
      ref={sectionRef}
      aria-label="AthlynXAI Sports AI Ecosystem"
      className="relative overflow-hidden bg-gradient-to-b from-black via-[#040b1a] to-black border-y border-white/5"
    >
      {/* Giant faded AthlynX watermark behind the grid (Jensen-DSX style) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(30,144,255,0.10), transparent 60%)",
        }}
      >
        <div className="text-[22vw] md:text-[18vw] font-black tracking-tighter text-white/[0.025] leading-none whitespace-nowrap">
          ATHLYNX
        </div>
      </div>

      <div
        className={`relative max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20 transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Eyebrow */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-[10px] font-black tracking-[0.28em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
            ATHLYNXAI · PLATFORM LAYER
          </span>
          <span className="text-[10px] font-black tracking-[0.28em] uppercase text-[#1E90FF]">
            The Nvidia of Sports
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-3">
          AthlynXAI Sports AI <span className="text-[#1E90FF]">Ecosystem</span>
        </h2>

        {/* Subhead */}
        <p className="max-w-3xl text-sm md:text-base text-white/65 leading-relaxed mb-2">
          One identity. Every athlete. Every platform. AthlynXAI is the AI factory
          beneath modern sports — the infrastructure layer that connects leagues,
          schools, brands, networks, NIL, data, and athletes into a single rails
          system. Built for the open athlete economy of the next decade.
        </p>
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/40 mb-10">
          Ecosystem map · Open to integrations · {totalCount}+ entities and growing
        </p>

        {/* Rows */}
        <div className="space-y-10">
          {ROWS.map((row) => (
            <div key={row.label}>
              <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1E90FF]" />
                  <h3 className="text-xs md:text-sm font-bold tracking-[0.22em] uppercase text-white">
                    {row.label}
                  </h3>
                </div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                  {row.caption}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 md:gap-3">
                {row.entities.map((e) => (
                  <EcosystemTile key={`${row.label}-${e.name}`} {...e} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer signoff strip — matches LiveBracketBanner "POWERED BY ATHLYNX OS" treatment */}
        <div className="mt-12 border-t border-white/10 pt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.28em] uppercase">
            <span className="text-white/50">POWERED BY</span>
            <span className="text-[#1E90FF]">ATHLYNX&nbsp;OS</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] font-black tracking-[0.28em] uppercase text-white/55">
            <span>ATHLYNX&nbsp;PLATFORM</span>
            <span>ATHLYNXAI&nbsp;OS</span>
            <span>AXN&nbsp;NETWORK</span>
            <span>AVN&nbsp;VAULT</span>
            <span>STRAANUNG&nbsp;INSIGHTS</span>
            <span>THE&nbsp;PLAYBOOK&nbsp;PODCAST</span>
          </div>
        </div>
      </div>
    </section>
  );
}
