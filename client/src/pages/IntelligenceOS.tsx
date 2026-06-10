/**
 * IntelligenceOS.tsx — AthlynX Intelligence OS
 * Unified page: Analytics Dashboard + AI Framework + Architecture Diagram
 * Original AthlynX work — inspired by sports analytics education and AI methodology.
 * Push doctrine: AthlynXAI/Athlynx-V2-Official main only. Vercel team: AthlynxChad.
 */
import { useState, useEffect } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

// ─── ANALYTICS DATA ───────────────────────────────────────────────────────────
const PLATFORM_METRICS = [
  { label: "Active Athlete Profiles", value: "12,847", delta: "+3.2%", color: "#1E90FF", icon: "👤" },
  { label: "NIL Deals Tracked", value: "$4.2M", delta: "+8.1%", color: "#10B981", icon: "💰" },
  { label: "Transfer Portal Entries", value: "2,341", delta: "+12.4%", color: "#7C3AED", icon: "🔄" },
  { label: "AI Sessions Today", value: "8,902", delta: "+21.7%", color: "#1E90FF", icon: "🤖" },
  { label: "Recruiting Interactions", value: "34,120", delta: "+6.8%", color: "#EC4899", icon: "🎓" },
  { label: "Data Points Ingested", value: "1.2M", delta: "+44.3%", color: "#06B6D4", icon: "📊" },
];

const SPORT_BREAKDOWN = [
  { sport: "Baseball / Softball", athletes: 4210, nilDeals: 892, pct: 33, color: "#1E90FF" },
  { sport: "Football", athletes: 3180, nilDeals: 1240, pct: 25, color: "#1E90FF" },
  { sport: "Basketball", athletes: 2340, nilDeals: 780, pct: 18, color: "#EC4899" },
  { sport: "Soccer", athletes: 1620, nilDeals: 340, pct: 13, color: "#10B981" },
  { sport: "Track & Field", athletes: 890, nilDeals: 120, pct: 7, color: "#7C3AED" },
  { sport: "All Other Sports", athletes: 607, nilDeals: 89, pct: 4, color: "#6B7280" },
];

const AI_ENGINES = [
  { name: "Nebius AI", role: "Primary inference engine", status: "ACTIVE", latency: "42ms", color: "#1E90FF" },
  { name: "Google Gemini 3.5", role: "Agentic tasks & coding", status: "ACTIVE", latency: "68ms", color: "#10B981" },
  { name: "Anthropic Claude", role: "Long-context analysis", status: "ACTIVE", latency: "91ms", color: "#7C3AED" },
  { name: "OpenAI GPT-4o", role: "Fallback & multimodal", status: "STANDBY", latency: "110ms", color: "#1E90FF" },
];

// ─── ATHLYNX ANALYTICS FRAMEWORK ─────────────────────────────────────────────
// Original AthlynX methodology — inspired by professional sports analytics education
const FRAMEWORK_MODULES = [
  {
    id: "01",
    title: "Athlete Identity & Verification",
    icon: "🪪",
    color: "#1E90FF",
    desc: "Every athlete profile is anchored to verified identity: school enrollment, sport, position, eligibility status, and guardian context. This is the trust layer that makes every downstream data point credible.",
    tools: ["Profile Claim Engine", "Guardian Verification", "Eligibility Tracker", "School Roster Sync"],
  },
  {
    id: "02",
    title: "Performance Data Collection",
    icon: "📡",
    color: "#00C2FF",
    desc: "Multi-source data ingestion: game stats, training logs, wearable biometrics, video analysis, combine results, and AI session outputs. Every data point is timestamped and source-tagged.",
    tools: ["Wearable API Bridge", "Video Analysis Engine", "Stats Ingestion Layer", "Combine Result Parser"],
  },
  {
    id: "03",
    title: "X-Factor Scoring Model",
    icon: "⚡",
    color: "#7C3AED",
    desc: "The AthlynX proprietary 0–100 athlete rating. Combines performance metrics, recruiting activity, NIL readiness, social signal strength, and AI-assessed development trajectory. Coaches see it. Scouts track it. Brands pay for it.",
    tools: ["Performance Weighting Engine", "NIL Readiness Score", "Recruiting Signal Analyzer", "Development Trajectory AI"],
  },
  {
    id: "04",
    title: "Recruiting Intelligence",
    icon: "🎓",
    color: "#1E90FF",
    desc: "AI-powered matching between athletes and programs. Analyzes fit scores, scholarship probability, coach communication patterns, and transfer portal dynamics. Surfaces the right opportunities at the right time.",
    tools: ["Program Fit Analyzer", "Scholarship Probability Model", "Coach Outreach Tracker", "Transfer Portal Intelligence"],
  },
  {
    id: "05",
    title: "NIL Market Analytics",
    icon: "💰",
    color: "#10B981",
    desc: "Real-time NIL deal tracking, brand affinity scoring, contract value modeling, and market positioning. Agents and athletes use this to negotiate from data, not guesswork.",
    tools: ["Brand Affinity Engine", "Contract Value Model", "Market Positioning Score", "Deal Pipeline Tracker"],
  },
  {
    id: "06",
    title: "Scouting & Evaluation Framework",
    icon: "🔭",
    color: "#EC4899",
    desc: "Structured evaluation methodology used by front offices and college programs. Separates real upside from noise using the same frameworks professional teams rely on — now accessible to every athlete.",
    tools: ["Upside vs. Noise Separator", "Projection Model", "Comparison Engine", "Draft Board Simulator"],
  },
  {
    id: "07",
    title: "Contract & Agent Intelligence",
    icon: "📋",
    color: "#6366F1",
    desc: "Tools for agents and athletes to evaluate performance through the same metrics teams use to price and project talent. Smarter positioning, better contract strategies, and a clearer sense of market fit.",
    tools: ["Salary Projection Model", "Arbitration Calculator", "Service Time Tracker", "Extension Value Analyzer"],
  },
  {
    id: "08",
    title: "Media & Brand OS",
    icon: "📱",
    color: "#1E90FF",
    desc: "Every athlete is a brand. The Media OS handles athlete cards, highlight reels, podcast distribution, media kits, and social signal amplification. Turns performance into presence.",
    tools: ["Highlight Reel Studio", "Athlete Card Generator", "Media Kit Builder", "Social Signal Amplifier"],
  },
];

// ─── ARCHITECTURE DIAGRAM DATA ────────────────────────────────────────────────
const ARCH_LAYERS = [
  { layer: "L1", label: "User Interface Layer", items: ["athlynx.ai", "Mobile PWA", "Embedded Widgets", "Partner White-Label"], color: "#1E90FF" },
  { layer: "L2", label: "Application Layer", items: ["NIL Portal", "Transfer Portal", "Diamond Grind", "Gridiron Nexus", "Court Kings", "Intelligence OS"], color: "#00C2FF" },
  { layer: "L3", label: "Intelligence Layer", items: ["X-Factor Engine", "Recruiting AI", "NIL Analytics", "Scouting Model", "Contract Intelligence"], color: "#7C3AED" },
  { layer: "L4", label: "AI Inference Layer", items: ["Nebius AI (Primary)", "Gemini 3.5 (Agentic)", "Claude (Long-context)", "GPT-4o (Fallback)"], color: "#A78BFA" },
  { layer: "L5", label: "Data Layer", items: ["Neon Postgres", "Supabase Auth", "R2 Object Storage", "Real-time Streams"], color: "#10B981" },
  { layer: "L6", label: "Infrastructure Layer", items: ["Vercel Edge Network", "Cloudflare DNS + CDN", "AWS SES Email", "Node 22 Runtime"], color: "#6366F1" },
  { layer: "L7", label: "Security & Compliance", items: ["HIPAA-Aligned", "Supabase RLS", "JWT Auth", "Audit Logging"], color: "#1E90FF" },
];

// ─── LIVE ACTIVITY FEED ───────────────────────────────────────────────────────
const DEMO_ACTIVITY = [
  { type: "ai_session", sport: "Baseball", action: "X-Factor score updated: 87 → 91", time: "2m ago", color: "#1E90FF" },
  { type: "nil_deal", sport: "Football", action: "New NIL deal matched: $4,200 brand partnership", time: "5m ago", color: "#10B981" },
  { type: "recruiting", sport: "Basketball", action: "Coach outreach detected: SEC program", time: "8m ago", color: "#7C3AED" },
  { type: "transfer", sport: "Soccer", action: "Transfer portal entry: 3-star midfielder", time: "12m ago", color: "#EC4899" },
  { type: "scouting", sport: "Baseball", action: "Scouting report generated: RHP prospect", time: "15m ago", color: "#1E90FF" },
  { type: "biometric", sport: "Track", action: "Wearable sync: HRV 72 · Stress: Low", time: "18m ago", color: "#06B6D4" },
  { type: "ai_session", sport: "Football", action: "Recruiting fit score: 94/100 for target school", time: "22m ago", color: "#1E90FF" },
  { type: "media", sport: "Basketball", action: "Highlight reel published: 847 views", time: "31m ago", color: "#1E90FF" },
];

// ─── BASEBALL ANALYTICS CURRICULUM (AthlynX original) ────────────────────────
const CURRICULUM_MODULES = [
  { num: "01", title: "Front Office Fundamentals", desc: "Roles, vocabulary, and decision-making frameworks used by MLB front offices. How analytics integrates with scouting, player development, and roster construction.", icon: "🏢" },
  { num: "02", title: "Data & Technology Stack", desc: "Statcast, FanGraphs, Baseball Savant, and proprietary data pipelines. How teams collect, clean, and model performance data at scale.", icon: "🖥️" },
  { num: "03", title: "Evaluating Hitters", desc: "Exit velocity, launch angle, barrel rate, xwOBA, sprint speed. How to separate true talent from noise and project future performance.", icon: "🏏" },
  { num: "04", title: "Evaluating Pitchers", desc: "Spin rate, pitch shape, extension, whiff rate, and tunneling. How teams identify fixable mechanical issues vs. true talent ceilings.", icon: "⚾" },
  { num: "05", title: "Minor League & Draft Analysis", desc: "Age-relative performance, level adjustments, tool grades, and projection models. How to evaluate prospects with limited or uneven data.", icon: "📈" },
  { num: "06", title: "Extensions, Arbitration & Free Agency", desc: "Service time rules, arbitration salary modeling, contract value frameworks, and free agent market positioning.", icon: "📋" },
  { num: "07", title: "Trade Analysis & Roster Construction", desc: "How teams evaluate trade value, build rosters around payroll constraints, and balance short-term vs. long-term windows.", icon: "🔄" },
  { num: "08", title: "Advance Scouting & Game Planning", desc: "Opponent tendencies, platoon splits, situational analytics, and how data shifts in-game decision-making.", icon: "🔭" },
  { num: "09", title: "Player Development & Coaching", desc: "How analytics informs mechanical adjustments, pitch design, and hitting approach changes. The lab and facility ecosystem.", icon: "🏋️" },
  { num: "10", title: "Analytics for Agents & Media", desc: "How agents use analytics to negotiate contracts, and how media professionals use data to produce credible, insider-level coverage.", icon: "🎙️" },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
function IntelligenceOSInner() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<"analytics" | "framework" | "architecture" | "curriculum">("analytics");
  const [activityIndex, setActivityIndex] = useState(0);

  // Cycle live activity
  useEffect(() => {
    const id = setInterval(() => {
      setActivityIndex(i => (i + 1) % DEMO_ACTIVITY.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#020810] text-white">

      {/* ─── HEADER ─── */}
      <header className="bg-[#020810]/98 border-b border-[#7C3AED]/30 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/brand/engine-mark-white.png?v=tightcrop-c409778" alt="AthlynX" className="h-10 w-auto max-w-[140px] object-contain" />
              <span className="text-xl font-black text-[#1E90FF]">XAI</span>
            </Link>
            <span className="text-white/20 text-lg">/</span>
            <span className="text-sm font-black text-purple-300 uppercase tracking-widest">Intelligence OS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              LIVE
            </span>
            {user ? (
              <Link href="/athlete-dashboard" className="text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-1.5 rounded-lg font-black transition-all">
                My Dashboard →
              </Link>
            ) : (
              <Link href="/signup" className="text-xs bg-[#1E90FF] hover:bg-[#0080FF] text-white px-4 py-1.5 rounded-lg font-black transition-all shadow-lg shadow-[#1E90FF]/30">
                Join Free →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative bg-[#020810] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.20),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(30,144,255,0.10),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-14 pb-10">
          <div className="flex flex-col lg:flex-row items-start gap-10">
            {/* Left: title */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 mb-5">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                AthlynX Intelligence OS · v1.0
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter mb-4">
                The Brain<br />
                <span className="text-[#7C3AED]">Behind the</span><br />
                <span className="text-[#1E90FF]">Platform.</span>
              </h1>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#1E90FF]/70 mb-2">
                BE THE LEGACY.™
              </p>
              <p className="text-white/55 text-base max-w-lg leading-relaxed mb-6">
                Real-time analytics, AI-powered scouting, NIL intelligence, and the full AthlynX data framework — all in one unified OS. Built for athletes, agents, coaches, and front offices.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setActiveSection("analytics")} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSection === "analytics" ? "bg-[#1E90FF] text-white shadow-lg shadow-[#1E90FF]/30" : "border border-white/15 text-white/60 hover:text-white hover:border-white/30"}`}>
                  📊 Analytics
                </button>
                <button onClick={() => setActiveSection("framework")} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSection === "framework" ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30" : "border border-white/15 text-white/60 hover:text-white hover:border-white/30"}`}>
                  🧠 Framework
                </button>
                <button onClick={() => setActiveSection("architecture")} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSection === "architecture" ? "bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/30" : "border border-white/15 text-white/60 hover:text-white hover:border-white/30"}`}>
                  🏗️ Architecture
                </button>
                <button onClick={() => setActiveSection("curriculum")} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSection === "curriculum" ? "bg-[#1E90FF] text-white shadow-lg shadow-[#1E90FF]/30" : "border border-white/15 text-white/60 hover:text-white hover:border-white/30"}`}>
                  📚 Curriculum
                </button>
              </div>
            </div>

            {/* Right: live activity feed */}
            <div className="w-full lg:w-80 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Activity</span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-green-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {DEMO_ACTIVITY.slice(activityIndex + 4).concat(DEMO_ACTIVITY.slice(0, Math.max(0, 4 - (DEMO_ACTIVITY.length - activityIndex)))).map((item, i) => (
                  <div key={i} className="px-4 py-3 flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white leading-tight">{item.action}</div>
                      <div className="text-[10px] text-white/35 mt-0.5">{item.sport} · {item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION: ANALYTICS DASHBOARD ─── */}
      {activeSection === "analytics" && (
        <section className="px-4 py-10 bg-[#040c1a] border-t border-[#1E90FF]/15">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#1E90FF] mb-1">Platform Analytics</div>
              <h2 className="text-2xl md:text-3xl font-black text-white">Real-Time Intelligence Dashboard</h2>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {PLATFORM_METRICS.map((m) => (
                <div key={m.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 hover:border-white/15 transition-all">
                  <div className="text-xl mb-2">{m.icon}</div>
                  <div className="font-black text-2xl mb-0.5" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-white/60 text-[10px] font-bold leading-tight mb-1">{m.label}</div>
                  <div className="text-green-400 text-[9px] font-black">{m.delta} 7d</div>
                </div>
              ))}
            </div>

            {/* AI Engine status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">AI Engine Status</div>
                <div className="space-y-2">
                  {AI_ENGINES.map((e) => (
                    <div key={e.name} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.status === "ACTIVE" ? "#10B981" : "#6B7280" }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-white">{e.name}</div>
                        <div className="text-[10px] text-white/40">{e.role}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[9px] font-black uppercase tracking-widest ${e.status === "ACTIVE" ? "text-green-400" : "text-white/30"}`}>{e.status}</div>
                        <div className="text-[9px] text-white/30">{e.latency}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sport breakdown */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Sport Breakdown</div>
                <div className="space-y-2">
                  {SPORT_BREAKDOWN.map((s) => (
                    <div key={s.sport} className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-black text-white">{s.sport}</span>
                        <span className="text-[10px] font-black text-white/40">{s.athletes.toLocaleString()} athletes</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-white/30">{s.pct}% of platform</span>
                        <span className="text-[9px] font-black" style={{ color: s.color }}>{s.nilDeals} NIL deals</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-[#1E90FF]/25 bg-[#1E90FF]/5 p-6 text-center">
              <div className="text-sm font-black text-white mb-2">Your data. Your edge.</div>
              <p className="text-white/50 text-xs mb-4">Create your free profile to unlock your personal analytics dashboard, X-Factor score, and recruiting intelligence.</p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-[#1E90FF] hover:bg-[#0080FF] text-white font-black text-sm px-8 py-3 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-[#1E90FF]/25">
                Unlock My Intelligence →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── SECTION: FRAMEWORK ─── */}
      {activeSection === "framework" && (
        <section className="px-4 py-10 bg-[#040c1a] border-t border-[#7C3AED]/15">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-400 mb-1">AthlynX Intelligence Framework</div>
              <h2 className="text-2xl md:text-3xl font-black text-white">8-Module Analytics OS</h2>
              <p className="text-white/45 text-sm mt-2 max-w-2xl">
                The complete AthlynX methodology for athlete intelligence — from identity verification through contract negotiation. Every module is live in the platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {FRAMEWORK_MODULES.map((mod) => (
                <div key={mod.id} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-white/15 transition-all group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-2xl">{mod.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black tabular-nums" style={{ color: mod.color }}>{mod.id}</span>
                        <h3 className="text-base font-black text-white">{mod.title}</h3>
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed">{mod.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.tools.map((tool) => (
                      <span key={tool} className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border" style={{ borderColor: `${mod.color}30`, color: mod.color, backgroundColor: `${mod.color}10` }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-purple-500/25 bg-purple-500/5 p-6 text-center">
              <div className="text-sm font-black text-white mb-2">Every module is live in the platform.</div>
              <p className="text-white/50 text-xs mb-4">Join free to access the full Intelligence OS — your X-Factor score, recruiting analytics, NIL intelligence, and more.</p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-sm px-8 py-3 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-[#7C3AED]/25">
                Access the Framework →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── SECTION: ARCHITECTURE DIAGRAM ─── */}
      {activeSection === "architecture" && (
        <section className="px-4 py-10 bg-[#040c1a] border-t border-[#6366F1]/15">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-indigo-400 mb-1">System Architecture</div>
              <h2 className="text-2xl md:text-3xl font-black text-white">AthlynX Platform Stack</h2>
              <p className="text-white/45 text-sm mt-2 max-w-2xl">
                Seven layers from user interface to infrastructure. Every layer is purpose-built for athlete intelligence at scale.
              </p>
            </div>

            {/* Architecture diagram */}
            <div className="space-y-2 mb-8">
              {ARCH_LAYERS.map((layer, i) => (
                <div key={layer.layer} className="relative group">
                  {/* Connector line */}
                  {i < ARCH_LAYERS.length - 1 && (
                    <div className="absolute left-[26px] top-full w-0.5 h-2 z-10" style={{ backgroundColor: `${layer.color}40` }} />
                  )}
                  <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] px-5 py-4 transition-all hover:border-white/15 group-hover:shadow-lg" style={{ boxShadow: undefined }}>
                    {/* Layer badge */}
                    <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: `${layer.color}15`, border: `1px solid ${layer.color}30`, color: layer.color }}>
                      {layer.layer}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black mb-2" style={{ color: layer.color }}>{layer.label}</div>
                      <div className="flex flex-wrap gap-2">
                        {layer.items.map((item) => (
                          <span key={item} className="text-[10px] font-bold text-white/60 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Data flow arrow */}
                    <div className="shrink-0 text-white/15 group-hover:text-white/30 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 mb-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Data Flow</div>
              <div className="flex flex-wrap gap-4 text-xs text-white/50">
                <span>User requests enter at <strong className="text-[#1E90FF]">L1</strong></span>
                <span>→ Routed through <strong className="text-[#00C2FF]">L2</strong> applications</span>
                <span>→ Processed by <strong className="text-[#7C3AED]">L3</strong> intelligence models</span>
                <span>→ Inference via <strong className="text-[#A78BFA]">L4</strong> AI engines</span>
                <span>→ Persisted in <strong className="text-[#10B981]">L5</strong> data stores</span>
                <span>→ Served from <strong className="text-[#6366F1]">L6</strong> edge network</span>
                <span>→ Secured by <strong className="text-[#1E90FF]">L7</strong> compliance layer</span>
              </div>
            </div>

            <div className="text-center">
              <Link href="/infrastructure" className="inline-flex items-center gap-2 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 font-black text-sm px-8 py-3 rounded-2xl transition-all mr-3">
                View Infrastructure →
              </Link>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-black text-sm px-8 py-3 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/25">
                Join the Platform →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── SECTION: CURRICULUM ─── */}
      {activeSection === "curriculum" && (
        <section className="px-4 py-10 bg-[#040c1a] border-t border-[#1E90FF]/15">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-400 mb-1">AthlynX Analytics Curriculum</div>
              <h2 className="text-2xl md:text-3xl font-black text-white">Baseball Analytics OS</h2>
              <p className="text-white/45 text-sm mt-2 max-w-2xl">
                The complete AthlynX baseball analytics methodology — built for coaches, scouts, agents, and athletes who want to evaluate talent, build rosters, and make data-backed decisions.
              </p>
            </div>

            {/* Curriculum grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {CURRICULUM_MODULES.map((mod) => (
                <div key={mod.num} className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 hover:border-blue-500/40/25 hover:bg-white/[0.04] transition-all group">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-900/40/10 border border-blue-500/40/20 flex items-center justify-center text-lg">
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black text-blue-400/60">{mod.num}</span>
                      <h3 className="text-sm font-black text-white">{mod.title}</h3>
                    </div>
                    <p className="text-white/45 text-xs leading-relaxed">{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Who it's for */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { role: "Coaches & Player Dev", desc: "Turn numbers into clear development paths. Spot real potential, shape roles with confidence, make decisions grounded in evidence.", icon: "🏟️" },
                { role: "Scouts & Draft Specialists", desc: "Learn the evaluation frameworks front offices use to separate real upside from noise. Clearer reports, stronger arguments.", icon: "🔭" },
                { role: "Agents & Media Pros", desc: "Evaluate performance through the same metrics teams use to price talent. Smarter positioning, better contract strategies.", icon: "🎙️" },
              ].map((r) => (
                <div key={r.role} className="rounded-2xl border border-blue-500/40/15 bg-blue-900/40/5 p-5">
                  <div className="text-2xl mb-3">{r.icon}</div>
                  <div className="text-sm font-black text-white mb-2">{r.role}</div>
                  <p className="text-white/50 text-xs leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-blue-500/40/25 bg-blue-900/40/5 p-6 text-center">
              <div className="text-sm font-black text-white mb-2">The AthlynX Analytics Curriculum is live inside the platform.</div>
              <p className="text-white/50 text-xs mb-4">Join free to access the full curriculum, your personal analytics dashboard, and the AthlynX Intelligence OS.</p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-[#1E90FF] hover:bg-[#1D4ED8] text-black font-black text-sm px-8 py-3 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-[#1E90FF]/25">
                Access the Curriculum →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── BOTTOM NAV ─── */}
      <section className="bg-[#020810] border-t border-white/8 px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3">
          {[
            { href: "/", label: "← Home" },
            { href: "/diamond-grind", label: "⚾ Diamond Grind" },
            { href: "/nil-portal", label: "💰 NIL Portal" },
            { href: "/transfer-portal", label: "🔄 Transfer Portal" },
            { href: "/athlete-dashboard", label: "📊 My Dashboard" },
            { href: "/data-dashboard", label: "📡 Data Dashboard" },
            { href: "/brackets/mcws", label: "🏆 Road to Omaha" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-xs font-bold text-white/40 hover:text-[#1E90FF] transition-colors border border-white/8 hover:border-[#1E90FF]/30 px-3 py-1.5 rounded-lg">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#020810] border-t border-white/5 px-4 py-5 text-center">
        <p className="text-white/20 text-xs">
          © 2026 Chad A. Dozier Sr. / Dozier Holdings Group™ / AthlynX™. Intelligence OS is proprietary AthlynX technology.
        </p>
      </footer>
    </div>
  );
}

export default function IntelligenceOS() {
  return <RouteErrorBoundary><IntelligenceOSInner /></RouteErrorBoundary>;
}
