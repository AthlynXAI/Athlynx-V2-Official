/**
 * AITrainerBuild — /ai-trainer/build
 *
 * Coach Lynx walks an athlete through:
 *   Step 1 — Tier (Youth / HS / College / Pro)
 *   Step 2 — Top 5 schools (real ESPN logos)
 *   Step 3 — Brand pack generation (colors, tagline, watermark preview)
 *   Step 4 — Confirm + save
 *
 * Doctrine: Birth to death. The AI Trainer brands every chapter.
 * NIL pipeline auto-activates when the athlete reaches HS+.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { SCHOOLS, schoolLogoUrl, schoolByAbbr } from "@/data/schools";

const TIERS = [
  { id: "youth",   label: "Youth / Travel",   note: "Club, AAU, select team brand", emoji: "🌱" },
  { id: "hs",      label: "High School",      note: "Varsity school brand",         emoji: "🏫" },
  { id: "college", label: "College",          note: "NCAA / NAIA / JUCO program",   emoji: "🎓" },
  { id: "pro",     label: "Pro",              note: "Affiliate or league brand",    emoji: "🏆" },
];

const STEPS = ["Tier", "Top 5 Schools", "Brand Pack", "Confirm"] as const;

function AITrainerBuildInner() {
  const [step, setStep] = useState(0);
  const [tier, setTier] = useState<string>("hs");
  const [top5, setTop5] = useState<string[]>([]);
  const [tagline, setTagline] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const primarySchool = useMemo(() => schoolByAbbr(top5[0] || ""), [top5]);

  const toggleSchool = (abbr: string) => {
    setTop5((prev) => {
      if (prev.includes(abbr)) return prev.filter((a) => a !== abbr);
      if (prev.length >= 5) return [...prev.slice(1), abbr];
      return [...prev, abbr];
    });
  };

  // Generate a Coach Lynx-style tagline from the primary school + tier
  const generateTagline = () => {
    if (!primarySchool) return;
    const lines = [
      `${primarySchool.abbr} bound. ${primarySchool.name} built.`,
      `Cardinal on the field. ${primarySchool.abbr} on the brain.`,
      `One brand. One profile. One platform — wearing ${primarySchool.name} colors.`,
      `Bigger than a recruit. Built like a pro.`,
      `${primarySchool.abbr} first. Highway always.`,
    ];
    setTagline(lines[Math.floor(Math.random() * lines.length)]);
  };

  const canAdvance =
    (step === 0 && !!tier) ||
    (step === 1 && top5.length > 0) ||
    (step === 2 && tagline.length > 0) ||
    step === 3;

  const handleSave = async () => {
    setSaving(true);
    try {
      // Persist to localStorage immediately so the athlete sees it on their profile
      // even if the network is shaky. Server-side persist happens server-side
      // via the trainerRouter / profileRouter once the athlete is authenticated.
      const pack = {
        tier,
        top5,
        primarySchool: primarySchool?.abbr,
        tagline,
        generatedAt: new Date().toISOString(),
        athlynx_fee_percent: 10,
      };
      try { localStorage.setItem("athlynxai_brand_pack", JSON.stringify(pack)); } catch {}
      // Also POST to /api/brand-pack for server-side persistence — non-blocking.
      fetch("/api/brand-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pack),
      }).catch(() => {});
      await new Promise((r) => setTimeout(r, 600));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const primary = primarySchool?.primary ?? "#0a1628";
  const secondary = primarySchool?.secondary ?? "#FFFFFF";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      {/* Top stripe with primary school colors */}
      <div
        className="h-2"
        style={{ background: `linear-gradient(90deg, ${primary} 0%, ${secondary} 100%)` }}
      />

      <section className="max-w-4xl mx-auto px-6 pt-10 pb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-cyan-400/30 text-xs font-bold tracking-widest text-cyan-300 mb-4">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          AI TRAINER · COACH LYNX · BUILD YOUR PROFILE
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
          Let's brand your journey.
        </h1>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
          Coach Lynx will brand your profile for every level — youth, high school, college, pro.
          When you commit, your profile re-skins overnight. NIL flows through the highway.
        </p>
      </section>

      {/* Step indicator */}
      <section className="max-w-4xl mx-auto px-6 pb-4">
        <div className="flex items-center gap-2 md:gap-4">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  i <= step
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <div className={`text-xs font-bold tracking-wider uppercase ${i <= step ? "text-cyan-300" : "text-gray-600"}`}>
                {label}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px ${i < step ? "bg-cyan-400" : "bg-gray-800"}`} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Step content */}
      <section className="max-w-4xl mx-auto px-6 py-6">
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-black mb-3">Where are you in your journey?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTier(t.id)}
                  className={`text-left rounded-2xl p-4 border transition-all ${
                    tier === t.id
                      ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400/60"
                      : "bg-gray-900/60 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="text-2xl mb-2">{t.emoji}</div>
                  <div className="text-xs font-black tracking-widest uppercase text-cyan-300">{t.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{t.note}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-xl font-black">Pick your Top 5 schools</h2>
                <p className="text-sm text-gray-400 mt-1">Tap up to 5 — your first pick becomes your primary brand.</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-cyan-300">{top5.length}/5</div>
                <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Selected</div>
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {SCHOOLS.map((s) => {
                const selected = top5.includes(s.abbr);
                const rank = selected ? top5.indexOf(s.abbr) + 1 : null;
                return (
                  <button
                    key={s.abbr}
                    onClick={() => toggleSchool(s.abbr)}
                    className={`rounded-xl overflow-hidden border-2 transition-all ${
                      selected ? "border-cyan-400 ring-2 ring-cyan-400/40 scale-[1.02]" : "border-gray-800 hover:border-gray-600"
                    }`}
                    style={{ background: `linear-gradient(135deg, ${s.primary} 0%, ${s.primary} 70%, ${s.secondary} 100%)` }}
                  >
                    <div className="aspect-square flex flex-col items-center justify-center p-2 relative">
                      <img
                        src={schoolLogoUrl(s)}
                        alt={`${s.name} logo`}
                        className="w-10 h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-1"
                        loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                      <div className="text-[10px] font-black text-white tracking-wider drop-shadow">{s.abbr}</div>
                      {rank && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-[10px] font-black text-black">
                          {rank}
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
          </div>
        )}

        {step === 2 && primarySchool && (
          <div>
            <h2 className="text-xl font-black mb-3">Your brand pack</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Colors */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
                <div className="text-xs font-black tracking-widest uppercase text-cyan-300 mb-2">Primary Colors</div>
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl shadow-lg" style={{ background: primarySchool.primary }} />
                  <div className="w-16 h-16 rounded-xl shadow-lg border border-white/10" style={{ background: primarySchool.secondary }} />
                  <div className="text-sm">
                    <div className="text-white font-bold">{primarySchool.name}</div>
                    <div className="text-gray-400 text-xs">{primarySchool.conference} · {primarySchool.state}</div>
                  </div>
                </div>
              </div>

              {/* Logo */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
                <div className="text-xs font-black tracking-widest uppercase text-cyan-300 mb-2">Watermark</div>
                <div className="flex items-center justify-center h-20 rounded-xl"
                     style={{ background: `linear-gradient(135deg, ${primarySchool.primary} 0%, ${primarySchool.secondary} 100%)` }}>
                  <img
                    src={schoolLogoUrl(primarySchool)}
                    alt={primarySchool.name}
                    className="w-14 h-14 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="md:col-span-2 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-black tracking-widest uppercase text-cyan-300">Tagline</div>
                  <button onClick={generateTagline} className="text-xs font-bold text-cyan-300 hover:text-cyan-200">
                    🎯 Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Tap Regenerate, or write your own..."
                  className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-cyan-400 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && primarySchool && (
          <div>
            <h2 className="text-xl font-black mb-3">Lock it in.</h2>
            <div className="rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
              <div
                className="p-6 md:p-8"
                style={{ background: `linear-gradient(135deg, ${primarySchool.primary} 0%, ${primarySchool.primary} 70%, ${primarySchool.secondary} 100%)` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={schoolLogoUrl(primarySchool)}
                    alt={primarySchool.name}
                    className="w-20 h-20 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  <div>
                    <div className="text-[10px] font-black text-white/70 tracking-widest uppercase">Primary Brand</div>
                    <div className="text-2xl font-black text-white">{primarySchool.name}</div>
                    <div className="text-xs text-white/80">{primarySchool.conference} · Tier: {tier.toUpperCase()}</div>
                  </div>
                </div>
                {tagline && <div className="text-base md:text-lg italic text-white/95 leading-snug">"{tagline}"</div>}
              </div>
              <div className="bg-black/60 p-5">
                <div className="text-xs font-black tracking-widest uppercase text-cyan-300 mb-2">Top 5 Recruiting Board</div>
                <div className="grid grid-cols-5 gap-2">
                  {top5.map((abbr, i) => {
                    const s = schoolByAbbr(abbr);
                    if (!s) return null;
                    return (
                      <div key={abbr} className="rounded-lg overflow-hidden border border-white/10"
                           style={{ background: `linear-gradient(135deg, ${s.primary} 0%, ${s.secondary} 100%)` }}>
                        <div className="aspect-square flex items-center justify-center p-2 relative">
                          <img src={schoolLogoUrl(s)} alt={s.name} className="w-8 h-8 object-contain"
                               onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}/>
                          <div className="absolute top-0.5 right-0.5 text-[8px] font-bold text-white/80 bg-black/40 rounded px-1">#{i+1}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {saved && (
              <div className="mt-4 rounded-2xl border border-green-400/40 bg-green-500/10 p-4 text-green-300">
                ✅ Brand pack saved. Your profile auto-skins on next sign-in. Coach Lynx will keep watch.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer nav */}
      <section className="max-w-4xl mx-auto px-6 pb-12 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-5 py-3 rounded-2xl bg-gray-900 border border-gray-800 text-gray-300 font-bold tracking-wider uppercase text-sm disabled:opacity-40"
        >
          ← Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => {
              if (step === 1 && tagline === "") generateTagline();
              setStep((s) => Math.min(STEPS.length - 1, s + 1));
            }}
            disabled={!canAdvance}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black tracking-wider uppercase text-sm disabled:opacity-40 hover:scale-[1.02] transition-transform"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-black font-black tracking-wider uppercase text-sm disabled:opacity-60 hover:scale-[1.02] transition-transform"
          >
            {saved ? "✅ Saved" : saving ? "Saving..." : "Save Brand Pack"}
          </button>
        )}
      </section>

      <footer className="text-center text-xs text-gray-600 pb-10">
        Coach Lynx · Iron Sharpens Iron — Proverbs 27:17<br />
        © 2026 AthlynXAI · Birth to Death · We Do It All
      </footer>

      <div className="text-center pb-6">
        <Link href="/branded-profile" className="text-xs text-cyan-400 hover:text-cyan-300 underline">
          See the full Branded Profile gallery →
        </Link>
      </div>
    </div>
  );
}

export default function AITrainerBuild() {
  return (
    <RouteErrorBoundary>
      <AITrainerBuildInner />
    </RouteErrorBoundary>
  );
}
