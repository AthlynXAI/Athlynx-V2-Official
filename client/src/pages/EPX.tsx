/**
 * EPX™ — Elite Performance Experience
 * AthlynXAI's proprietary athlete rating system.
 * 0–100 AI-powered score built from combine metrics, game film,
 * stats, recruiting interest, and intangibles.
 * 90–100 = Elite Pro Prospect. Coaches see it. Brands pay for it.
 */
import { useState } from "react";
import { Link } from "wouter";
import PlatformLayout from "@/components/PlatformLayout";

const EPX_TIERS = [
  { range: "90–100", label: "Elite Pro Prospect",  color: "#00ff88", score: 94, desc: "You are on the radar of D1 coaches, pro scouts, and national brands. Your EPX is your proof." },
  { range: "75–89",  label: "Rising Prospect",     color: "#00c2ff", score: 82, desc: "Trending up. Coaches are watching. One breakout performance away from Elite." },
  { range: "60–74",  label: "Developing Athlete",  color: "#f59e0b", score: 67, desc: "Solid foundation. Keep stacking reps, film, and stats. The score follows the work." },
  { range: "0–59",   label: "Building",            color: "#ef4444", score: 45, desc: "Every elite started here. Your EPX grows every time you compete, train, and show up." },
];

const EPX_INPUTS = [
  { icon: "LIVE", label: "Combine Metrics",      desc: "Speed, strength, agility, vertical, wingspan — the measurables that define your physical ceiling." },
  { icon: "VIDEO", label: "Game Film",            desc: "AI-analyzed highlight reels and full game footage. Every rep counted. Every play graded." },
  { icon: "STATS", label: "Stats & Performance",  desc: "Season stats, tournament results, rankings, and head-to-head performance data." },
  { icon: "TARGET", label: "Recruiting Interest",  desc: "Coach contact frequency, campus visits, scholarship offers, and portal activity." },
  { icon: "AI", label: "IQ & Intangibles",     desc: "Leadership, coachability, mental toughness, and competitive instinct — the things scouts can't measure but always talk about." },
  { icon: "CHAMP", label: "Championship Moments", desc: "How you perform when it matters most. Clutch factor is real. AthlynXAI tracks it." },
];

const SPORTS_WITH_EPX = [
  "Football","Basketball","Baseball","Softball","Soccer",
  "Track & Field","Wrestling","Swimming","Tennis","Golf",
  "Volleyball","Gymnastics","Lacrosse","Hockey","Rugby",
  "Rowing","Cross Country","Field Hockey","Cheerleading","MMA",
];

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = size * 0.43;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  const color = score >= 90 ? "#00ff88" : score >= 75 ? "#00c2ff" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label = score >= 90 ? "ELITE" : score >= 75 ? "RISING" : score >= 60 ? "DEVELOPING" : "BUILDING";
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#0a1628" strokeWidth="10" />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1.2s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black text-white" style={{ fontSize: size * 0.22 }}>{score}</span>
          <span className="font-black tracking-widest" style={{ color, fontSize: size * 0.065 }}>{label}</span>
        </div>
      </div>
    </div>
  );
}

export default function EPX() {
  const [activeTab, setActiveTab] = useState<"overview" | "score" | "sports" | "how">("overview");

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#050d1a] text-white" style={{ fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif" }}>

        {/* HERO */}
        <section className="relative overflow-hidden bg-[#020713] px-5 pt-24 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,102,255,0.18),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(0,194,255,0.12),transparent_50%)]" />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
              <div className="flex-1 mb-12 lg:mb-0">
                <div className="inline-flex items-center gap-2 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full px-5 py-2 mb-6">
                  <span className="w-2 h-2 bg-[#0066ff] rounded-full animate-pulse" />
                  <span className="text-xs font-black text-[#0066ff] tracking-[0.3em] uppercase">AthlynXAI Original · Proprietary</span>
                </div>
                <h1 className="text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-4">
                  <span className="text-white">EP</span><span className="text-[#0066ff]">X™</span>
                </h1>
                <p className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">Elite Performance Experience</p>
                <p className="text-lg text-[#8ba3c7] leading-relaxed mb-6 max-w-xl">
                  Your EPX score (0–100) is your AI-powered athlete rating — built from combine metrics, game film, stats, recruiting interest, and intangibles. It grows as you perform.{" "}
                  <span className="text-white font-bold">90–100 is Elite Pro Prospect.</span> Coaches see it. Brands pay for it.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/signup">
                    <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-base px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#0066ff]/40">
                      GET YOUR EPX SCORE →
                    </button>
                  </Link>
                  <Link href="/portal">
                    <button className="bg-white/5 hover:bg-white/10 text-white font-bold text-base px-8 py-4 rounded-2xl border border-white/20 transition-all">
                      ENTER PLATFORM
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col items-center gap-6">
                <ScoreRing score={94} size={192} />
                <div className="text-center">
                  <p className="text-white font-black text-lg">Sample EPX Score</p>
                  <p className="text-[#8ba3c7] text-sm">Your score updates in real time</p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                  {[
                    { label: "44",   sub: "Sports Tracked" },
                    { label: "213+", sub: "Data Points" },
                    { label: "4",    sub: "AI Engines" },
                    { label: "24/7", sub: "Live Updates" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                      <p className="text-white font-black text-xl">{s.label}</p>
                      <p className="text-[#8ba3c7] text-[10px] font-semibold mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TABS */}
        <div className="sticky top-0 z-40 bg-[#050d1a]/95 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: "none" }}>
              {(["overview","score","sports","how"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full font-black text-xs tracking-widest uppercase transition-all ${
                    activeTab === tab ? "bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/30" : "text-[#8ba3c7] hover:text-white hover:bg-white/5"
                  }`}>
                  {tab === "overview" ? "Overview" : tab === "score" ? "Score Tiers" : tab === "sports" ? "All Sports" : "How It Works"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <section className="px-5 py-16 max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] mb-3">What Goes Into Your Score</p>
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-4">BUILT FROM <span className="text-[#0066ff]">EVERYTHING</span></h2>
              <p className="text-[#8ba3c7] text-lg max-w-2xl mx-auto">No single number tells your story. EPX combines six dimensions of athletic performance into one score that coaches, brands, and scouts actually trust.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
              {EPX_INPUTS.map((item) => (
                <div key={item.label} className="bg-[#0a1628] border border-[#0066ff]/20 rounded-3xl p-6 hover:border-[#0066ff]/50 transition-all group">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="text-white font-black text-lg mb-2 group-hover:text-[#0066ff] transition-colors">{item.label}</h3>
                  <p className="text-[#8ba3c7] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[2rem] border border-[#0066ff]/30 bg-gradient-to-br from-[#0a1628] to-[#050d1a] p-8 lg:p-12 text-center">
              <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] mb-3">Ready to Know Your Number?</p>
              <h3 className="text-3xl lg:text-5xl font-black text-white mb-4">YOUR EPX SCORE IS <span className="text-[#0066ff]">WAITING</span></h3>
              <p className="text-[#8ba3c7] text-lg mb-8 max-w-xl mx-auto">Create your free athlete profile in 30 seconds. No card required. Your EPX score generates automatically as you add data.</p>
              <Link href="/signup">
                <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-xl px-12 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#0066ff]/40">
                  START FREE — GET MY EPX SCORE →
                </button>
              </Link>
              <p className="text-[#8ba3c7] text-sm mt-4">athlynx.ai · 44 Sports · Men's & Women's · Free 7-Day Trial</p>
            </div>
          </section>
        )}

        {/* SCORE TIERS */}
        {activeTab === "score" && (
          <section className="px-5 py-16 max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] mb-3">EPX Score Tiers</p>
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-4">WHERE DO YOU <span className="text-[#0066ff]">RANK?</span></h2>
              <p className="text-[#8ba3c7] text-lg max-w-2xl mx-auto">Every athlete starts somewhere. Every elite was once building. Your EPX score is a live reflection of your work.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {EPX_TIERS.map((tier) => (
                <div key={tier.range} className="rounded-[2rem] border bg-[#0a1628] p-8 flex items-start gap-6" style={{ borderColor: tier.color + "40" }}>
                  <div className="flex-shrink-0"><ScoreRing score={tier.score} size={128} /></div>
                  <div className="flex-1 pt-2">
                    <p className="text-3xl font-black mb-1" style={{ color: tier.color }}>{tier.range}</p>
                    <p className="text-white font-black text-xl mb-3">{tier.label}</p>
                    <p className="text-[#8ba3c7] text-sm leading-relaxed">{tier.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/signup">
                <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-lg px-10 py-4 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-[#0066ff]/30">
                  GET YOUR EPX SCORE FREE →
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* ALL SPORTS */}
        {activeTab === "sports" && (
          <section className="px-5 py-16 max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] mb-3">EPX Coverage</p>
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-4">44 SPORTS. <span className="text-[#0066ff]">EVERY LEVEL.</span></h2>
              <p className="text-[#8ba3c7] text-lg max-w-2xl mx-auto">Men's and women's. Youth through pro. If you compete, you have an EPX score.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-12">
              {SPORTS_WITH_EPX.map((sport) => (
                <div key={sport} className="bg-[#0a1628] border border-[#0066ff]/20 rounded-2xl px-4 py-3 text-center hover:border-[#0066ff]/60 transition-all">
                  <p className="text-white font-bold text-sm">{sport}</p>
                  <p className="text-[#0066ff] text-[10px] font-black tracking-widest mt-1">EPX LIVE</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/signup">
                <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-lg px-10 py-4 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-[#0066ff]/30">
                  CLAIM YOUR FREE PROFILE →
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* HOW IT WORKS */}
        {activeTab === "how" && (
          <section className="px-5 py-16 max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] mb-3">The Process</p>
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-4">HOW EPX <span className="text-[#0066ff]">WORKS</span></h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 mb-12">
              {[
                { step:"01", icon:"PROFILE", title:"Build Your Profile",      desc:"Add your sport, position, school, stats, and upload your highlight film. Takes 30 seconds to start." },
                { step:"02", icon:"AI", title:"AI Analyzes Everything",  desc:"Four AI engines process your data — combine metrics, film, stats, recruiting activity, and intangibles — in real time." },
                { step:"03", icon:"LIVE", title:"Your Score Goes Live",    desc:"Your EPX score generates automatically and updates every time you add data, compete, or get recruiting contact." },
                { step:"04", icon:"TARGET", title:"Coaches See It",          desc:"Verified coaches and scouts on AthlynXAI can search by EPX score, sport, position, and class year." },
                { step:"05", icon:"NIL", title:"Brands Pay For It",       desc:"NIL deals are tied to EPX. Higher score = higher NIL value. Your EPX is your negotiating power." },
                { step:"06", icon:"CHAMP", title:"It Grows With You",       desc:"From youth to pro to retirement. Your EPX score follows your entire athletic career — one identity, forever." },
              ].map((s) => (
                <div key={s.step} className="bg-[#0a1628] border border-[#0066ff]/20 rounded-3xl p-6 hover:border-[#0066ff]/50 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{s.icon}</span>
                    <span className="text-[#0066ff] font-black text-sm tracking-widest">{s.step}</span>
                  </div>
                  <h3 className="text-white font-black text-lg mb-2 group-hover:text-[#0066ff] transition-colors">{s.title}</h3>
                  <p className="text-[#8ba3c7] text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[2rem] border border-[#0066ff]/30 bg-gradient-to-br from-[#0a1628] to-[#050d1a] p-8 text-center">
              <h3 className="text-3xl font-black text-white mb-3">IQ BEFORE TALENT.</h3>
              <p className="text-[#8ba3c7] text-lg mb-6 max-w-xl mx-auto">AthlynXAI was built on one belief: the smartest athlete wins. EPX is the proof of that belief — a score that rewards work, intelligence, and character, not just raw talent.</p>
              <Link href="/signup">
                <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-lg px-10 py-4 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-[#0066ff]/30">
                  START FREE — 7 DAYS →
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* FOOTER STRIP */}
        <section className="border-t border-white/10 px-5 py-10 bg-[#020713]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-black text-lg">EPX™ · AthlynXAI</p>
              <p className="text-[#8ba3c7] text-sm">Proprietary. Exclusive. Built for every athlete.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/cfactor">
                <button className="bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all">C-Factor Hub →</button>
              </Link>
              <Link href="/signup">
                <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all">Join Free →</button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PlatformLayout>
  );
}
