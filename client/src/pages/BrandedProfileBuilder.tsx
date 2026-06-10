/**
 * BrandedProfileBuilder — /branded-profile
 * AthlynXAI AI Trainer builds each athlete a school/college/pro branded profile.
 * Top 5 schools (with team logos) appear on the first page during recruiting.
 * NIL pipeline integrated — AthlynXAI takes a percentage.
 *
 * Doctrine: Birth to death. We do it all.
 */
import { useState } from "react";
import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { SCHOOLS, schoolLogoUrl, type School } from "@/data/schools";

const TIERS = [
  { id: "youth",   label: "Youth / Travel",   note: "Club, AAU, select team brand" },
  { id: "hs",      label: "High School",      note: "Varsity school brand" },
  { id: "college", label: "College",          note: "NCAA / NAIA / JUCO program brand" },
  { id: "pro",     label: "Pro",              note: "Affiliate or league brand" },
];

function BrandedProfileBuilderInner() {
  const [tier, setTier] = useState("hs");
  const [top5, setTop5] = useState<string[]>(["MSU", "BAMA", "LSU", "UGA", "UT"]);

  const toggleSchool = (abbr: string) => {
    setTop5((prev) => {
      if (prev.includes(abbr)) return prev.filter((a) => a !== abbr);
      if (prev.length >= 5) return [...prev.slice(1), abbr];
      return [...prev, abbr];
    });
  };

  const top5Schools = top5
    .map((abbr) => SCHOOLS.find((s) => s.abbr === abbr))
    .filter(Boolean) as School[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      {/* Hero */}
      <section className="relative px-6 pt-14 pb-10 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 to-[#0a1628]/20 border border-[#1E90FF]/30 text-xs font-bold tracking-widest text-[#00C2FF] mb-5">
          <span className="w-2 h-2 bg-[#1E90FF] rounded-full animate-pulse"></span>
          AI TRAINER · BRANDED PROFILE · BIRTH TO DEATH
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
          <span className="bg-gradient-to-r from-white via-blue-200 to-[#0a1628] bg-clip-text text-transparent">
            Your Brand.
          </span>{" "}
          <span className="bg-gradient-to-r from-blue-500 via-[#1E90FF] to-teal-400 bg-clip-text text-transparent">
            Their Logos.
          </span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Your AthlynXAI AI Trainer builds you a profile branded for every level of your journey —
          youth, high school, college, pro. Your <span className="text-[#00C2FF] font-bold">Top 5 schools</span> live
          on page one during recruiting. NIL deals flow through the highway. We run every connector.
        </p>
      </section>

      {/* Tier picker */}
      <section className="max-w-5xl mx-auto px-6 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTier(t.id)}
              className={`text-left rounded-2xl p-4 border transition-all ${
                tier === t.id
                  ? "bg-gradient-to-br from-[#1E90FF]/20 to-blue-600/20 border-[#1E90FF]/30"
                  : "bg-gray-900/60 border-gray-800 hover:border-gray-700"
              }`}
            >
              <div className="text-xs font-black tracking-widest uppercase text-[#00C2FF]">{t.label}</div>
              <div className="text-xs text-gray-400 mt-1">{t.note}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Live Profile Preview — Top 5 schools on page one */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="rounded-3xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-black shadow-2xl">
          {/* Phone Frame */}
          <div className="bg-gradient-to-r from-gray-900 to-black px-4 py-2 flex items-center justify-between border-b border-gray-800">
            <span className="text-xs text-gray-500 font-mono">athlynx.ai/u/your-handle</span>
            <span className="text-[10px] text-[#00C2FF] font-bold tracking-widest">LIVE PREVIEW</span>
          </div>

          <div className="p-6 md:p-8">
            <div className="text-xs font-black tracking-widest uppercase text-[#00C2FF] mb-3">
              Page 1 · Top 5 Schools Recruiting Me
            </div>

            <div className="grid grid-cols-5 gap-3 mb-6">
              {top5Schools.map((s, i) => (
                <div key={s.abbr} className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg group">
                  <div
                    className="aspect-square flex flex-col items-center justify-center p-2 relative"
                    style={{
                      background: `linear-gradient(135deg, ${s.primary} 0%, ${s.primary} 70%, ${s.secondary} 100%)`,
                    }}
                  >
                    <img src={schoolLogoUrl(s)} alt={`${s.name} logo`} className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-1" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    <div className="text-[10px] md:text-xs font-black text-white tracking-wider drop-shadow">
                      {s.abbr}
                    </div>
                    <div className="absolute top-1 right-1 text-[8px] font-bold text-white/70 bg-black/30 rounded px-1">
                      #{i + 1}
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-black/80 text-center">
                    <div className="text-[9px] text-gray-300 font-bold truncate">{s.name}</div>
                  </div>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 5 - top5Schools.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600 text-2xl">
                  +
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-3">
                <div className="text-2xl font-black text-[#00C2FF]">12.4K</div>
                <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Profile Views</div>
              </div>
              <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-3">
                <div className="text-2xl font-black text-[#00C2FF]">38</div>
                <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Coach Visits</div>
              </div>
              <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-3">
                <div className="text-2xl font-black text-[#00C2FF]">$24K</div>
                <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">NIL Pipeline</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School picker — choose your Top 5 */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-[#00C2FF]">Step 1</div>
            <h2 className="text-2xl md:text-3xl font-black">Pick Your Top 5 Schools</h2>
            <p className="text-sm text-gray-400 mt-1">Tap up to 5. Your AI Trainer auto-brands every page in their colors.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-[#00C2FF]">{top5.length}/5</div>
            <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Selected</div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {SCHOOLS.map((s) => {
            const selected = top5.includes(s.abbr);
            return (
              <button
                key={s.abbr}
                onClick={() => toggleSchool(s.abbr)}
                className={`rounded-xl overflow-hidden border-2 transition-all ${
                  selected ? "border-[#1E90FF] ring-2 ring-cyan-400/40 scale-[1.02]" : "border-gray-800 hover:border-gray-600"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${s.primary} 0%, ${s.primary} 70%, ${s.secondary} 100%)`,
                }}
              >
                <div className="aspect-square flex flex-col items-center justify-center p-2 relative">
                  <img src={schoolLogoUrl(s)} alt={`${s.name} logo`} className="w-10 h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-1" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  <div className="text-[10px] font-black text-white tracking-wider drop-shadow">{s.abbr}</div>
                  {selected && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-[#1E90FF] rounded-full flex items-center justify-center text-[10px] font-black text-black">
                      
                    </div>
                  )}
                </div>
                <div className="bg-black/70 py-0.5">
                  <div className="text-[8px] text-gray-300 font-bold text-center truncate px-1">{s.conference}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* AI Trainer — what we build */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-xs font-black tracking-widest uppercase text-[#00C2FF] mb-3">Step 2</div>
        <h2 className="text-2xl md:text-3xl font-black mb-6">Your AI Trainer Builds The Rest</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { t: "School Brand Pack", d: "Logo, colors, font, watermark across every post, reel, and highlight." },
            { t: "College Brand Pack", d: "Auto-switches the day you commit. Profile re-skins overnight." },
            { t: "Pro Brand Pack",    d: "Affiliate or league mark applied the moment you sign." },
            { t: "NIL Pipeline",      d: "Deals flow through the AthlynXAI highway. We connect the brands." },
            { t: "Top 5 Live Tracker",d: "Coach visits, scholarship offers, ranking shifts — all on page one." },
            { t: "Birth to Death",    d: "Youth → HS → College → Pro → Legacy. One brand. One profile. One platform." },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
              <div className="text-sm font-black text-[#00C2FF] mb-1">{c.t}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NIL revenue strip */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-3xl border border-[#1E90FF]/30 bg-gradient-to-r from-[#1E90FF]/20 via-blue-600/10 to-[#00C2FF]/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-[#00C2FF] mb-1">NIL Pipeline</div>
            <div className="text-xl md:text-2xl font-black">We help you cash. We take a percentage. That's it.</div>
            <div className="text-sm text-gray-400 mt-2">No managers. No middlemen. The highway runs the trucks.</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/ai-trainer/build" className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00C2FF] to-[#00C2FF] text-black font-black tracking-wider uppercase text-sm hover:scale-[1.02] transition-transform">
              Start AI Trainer →
            </Link>
            <Link href="/nil-portal" className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E90FF] to-blue-600 text-black font-black tracking-wider uppercase text-sm hover:scale-[1.02] transition-transform">
              Open NIL Portal →
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-600 pb-10">
        Iron Sharpens Iron — Proverbs 27:17<br />
        © 2026 AthlynXAI · Birth to Death · We Do It All
      </footer>
    </div>
  );
}

export default function BrandedProfileBuilder() {
  return (
    <RouteErrorBoundary>
      <BrandedProfileBuilderInner />
    </RouteErrorBoundary>
  );
}
