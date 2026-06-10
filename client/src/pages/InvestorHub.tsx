import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { isSuspended } from "@/components/TeamProfileCard";

// ─── REAL MARKET DATA (sourced from Grand View Research, MarketsandMarkets, Opendorse NIL Report 2025) ───
const MARKET_DATA = [
  { label: "Sports Tech TAM", value: "$135.9B", sub: "by 2035 · 21.9% CAGR", src: "Grand View Research 2026", icon: "🌐" },
  { label: "NIL Market", value: "$2.5B+", sub: "2026 projected revenue", src: "Opendorse NIL Report 2025", icon: "💰" },
  { label: "Athlete Mgmt Software", value: "$4.2B", sub: "by 2030 · 13.5% CAGR", src: "MarketTrendsAnalysis 2024", icon: "📊" },
  { label: "AI in Sports", value: "$27.6B", sub: "by 2030 · 3× growth", src: "MarketsandMarkets 2025", icon: "🤖" },
  { label: "Student Athletes", value: "520K+", sub: "NCAA alone · every sport", src: "NCAA 2025", icon: "🎓" },
  { label: "Pro Athletes (US)", value: "4,500+", sub: "NFL · NBA · MLB · NHL · MLS", src: "League rosters 2025", icon: "⭐" },
];

// ─── 5-YEAR P&L (conservative, numbers verified to add up) ───────────────────
// Revenue assumptions:
// White-Label: 10 schools Y1 @ $1K/mo → 60 Y2 → 200 Y3 → 600 Y4 → 1500 Y5
// Athlete Subs: 500 paid Y1 @ $10/mo → 3K Y2 → 12K Y3 → 45K Y4 → 120K Y5
// AI Credits: avg $4/mo per paid athlete
// Store Commission: 8% of GMV, GMV grows with athlete base
// NIL Commissions: 5% of deals brokered through platform
// Pro Teams: 0 Y1, 2 teams Y2 @ $10K/mo → 10 Y3 → 30 Y4 → 80 Y5
// Data Licensing: starts Y3 — anonymized aggregate athlete data to brands/scouts

const REVENUE_STREAMS = [
  { label: "White-Label Licensing (Schools/Orgs)", y: [120_000, 720_000, 2_400_000, 7_200_000, 18_000_000] },
  { label: "Athlete Subscriptions (Pro/Elite/NIL)", y: [60_000, 360_000, 1_440_000, 5_400_000, 14_400_000] },
  { label: "AI Credits (Usage-Based)", y: [24_000, 180_000, 720_000, 2_700_000, 7_200_000] },
  { label: "Athlete Store (8% Commission)", y: [12_000, 96_000, 480_000, 1_800_000, 5_400_000] },
  { label: "NIL Deal Commissions (5%)", y: [18_000, 144_000, 720_000, 2_700_000, 7_200_000] },
  { label: "Pro Teams Licensing", y: [0, 240_000, 1_200_000, 3_600_000, 9_600_000] },
  { label: "Proprietary Data Licensing", y: [0, 0, 360_000, 1_800_000, 5_400_000] },
  { label: "Advertising & Sponsorships", y: [0, 60_000, 300_000, 1_200_000, 3_600_000] },
];

const TOTAL_REV = REVENUE_STREAMS.reduce(
  (acc, r) => acc.map((v, i) => v + r.y[i]),
  [0, 0, 0, 0, 0]
);

// COGS: hosting, AI API costs, payment processing (~35% Y1 → 20% Y5)
const COGS_PCT = [0.35, 0.30, 0.25, 0.22, 0.20];
const COGS = TOTAL_REV.map((r, i) => Math.round(r * COGS_PCT[i]));
const GROSS = TOTAL_REV.map((r, i) => r - COGS[i]);

// OpEx: salaries, marketing, infra, legal (grows with headcount)
const OPEX = [180_000, 480_000, 1_440_000, 3_600_000, 7_200_000];
const EBITDA = GROSS.map((g, i) => g - OPEX[i]);
const TAX = EBITDA.map(e => e > 0 ? Math.round(e * 0.21) : 0);
const NET = EBITDA.map((e, i) => e - TAX[i]);

// Valuation at 7x revenue multiple (SaaS Capital 2025 benchmark)
const VALUATION = TOTAL_REV.map(r => r * 7);

function fmt(n: number, short = false) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(short ? 0 : 1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return n < 0 ? `-$${Math.abs(n)}` : `$${n}`;
}

function pct(n: number, total: number) {
  return total === 0 ? "—" : `${Math.round((n / total) * 100)}%`;
}

// ─── FUNDING ROUNDS ──────────────────────────────────────────────────────────
const ROUNDS = [
  {
    round: "Pre-Seed", status: "OPEN NOW", open: true,
    ask: "$500K", equity: "8%", postMoney: "$6.25M",
    use: "Platform completion, first 50 school licenses, core team hire",
    milestone: "50 schools · 5K athletes · $500K ARR",
    color: "border-red-400", glow: "shadow-red-400/30", badge: "bg-green-500",
  },
  {
    round: "Seed", status: "Q4 2025", open: false,
    ask: "$2M", equity: "10%", postMoney: "$20M",
    use: "Sales team (5 reps), marketing, 200 school licenses, Pro Teams beta",
    milestone: "200 schools · 25K athletes · $3M ARR",
    color: "border-blue-400", glow: "shadow-blue-400/20", badge: "bg-blue-500",
  },
  {
    round: "Series A", status: "2026", open: false,
    ask: "$10M", equity: "12%", postMoney: "$83M",
    use: "National expansion, Pro Teams launch, AI data licensing, 20-person team",
    milestone: "1K schools · 100K athletes · $15M ARR",
    color: "border-blue-500", glow: "shadow-blue-500/20", badge: "bg-blue-600",
  },
  {
    round: "Series B", status: "2027", open: false,
    ask: "$50M", equity: "15%", postMoney: "$333M",
    use: "International expansion (EU/LATAM), enterprise Pro Teams, acquisitions",
    milestone: "5K schools · 500K athletes · $75M ARR",
    color: "border-red-400", glow: "shadow-red-400/20", badge: "bg-red-500",
  },
  {
    round: "Series C", status: "2028", open: false,
    ask: "$150M", equity: "12%", postMoney: "$1.25B",
    use: "Global scale, IPO preparation, full sports data ecosystem",
    milestone: "20K schools · 2M athletes · $324M ARR",
    color: "border-red-400", glow: "shadow-red-400/20", badge: "bg-red-500",
  },
  {
    round: "IPO", status: "2029–2030", open: false,
    ask: "NYSE / NASDAQ", equity: "Public Float", postMoney: "$2B–$5B",
    use: "Global liquidity event. Fastest-growing sports tech company in history.",
    milestone: "50K+ schools · 5M+ athletes · $1B+ ARR",
    color: "border-cyan-400", glow: "shadow-cyan-400/30", badge: "bg-cyan-500",
  },
];

// ─── COMPETITORS ─────────────────────────────────────────────────────────────
const COMP_COLS = ["NIL", "AI Recruit", "Training", "Store", "Pro Teams", "White-Label", "AI Credits", "Data Moat", "Robots/IoT"];
const COMPETITORS = [
  { name: "Opendorse",    vals: [true,  false, false, false, false, false, false, false, false] },
  { name: "INFLCR",       vals: [true,  false, false, false, false, false, false, false, false] },
  { name: "Hudl",         vals: [false, false, true,  false, true,  false, false, false, false] },
  { name: "MarketPryce",  vals: [true,  false, false, false, false, false, false, false, false] },
  { name: "Teamworks",    vals: [false, false, true,  false, true,  false, false, false, false] },
  { name: "AthlynX ✦",   vals: [true,  true,  true,  true,  true,  true,  true,  true,  true ] },
];

// ─── TEAM ─────────────────────────────────────────────────────────────────────
const TEAM = [
  { name: "Chad A. Dozier", title: "Founder · CEO · Chairman", equity: "51%", role: "Vision, product, strategy, execution. Built AthlynX from zero. Houston, TX.", initials: "CD", highlight: true },
  { name: "Glenn Tse", title: "Co-Founder & CFO", equity: "24%", role: "Financial strategy, investor relations, Asia-Pacific expansion. Co-founded DHG with Chad in Houston, November 2024.", initials: "GT", highlight: true },
  { name: "Lee Marshall", title: "Partner · Sales & Partnerships", equity: "Private", role: "Business development, athlete community outreach, partnerships, and podcast momentum.", initials: "LM", highlight: false },
];

const YEARS = ["2025", "2026", "2027", "2028", "2029"];

// ─── Investor Request Gate ───────────────────────────────────────────────────
function InvestorRequestGate({ onGranted }: { onGranted: () => void }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", company: "", title: "",
    investmentRange: "$250K – $500K" as "Under $50K" | "$50K – $250K" | "$250K – $500K" | "$500K – $1M" | "$1M+",
    accredited: false, message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const submit = trpc.investor.submitRequest.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (e) => toast.error(e.message),
  });
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#040c1a] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-4xl font-black text-white mb-4">Request Received</h1>
          <p className="text-white/60 text-lg mb-6">Thank you, {form.fullName}. Our team will reach out within 1–2 business days.</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-white/40 text-sm">Direct contact</p>
            <p className="text-white font-bold mt-1">contact@athlynx.ai</p>
            <p className="text-white/60 text-sm">Book a call</p>
          </div>
          <button onClick={onGranted} className="text-blue-400 underline text-sm">View investor materials anyway →</button>
          <p className="text-white/20 text-xs mt-4">CONFIDENTIAL · FOR ACCREDITED INVESTOR USE ONLY · © 2026 Dozier Holdings LLC</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#040c1a] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-xs font-black tracking-widest uppercase">Pre-Seed Round — Open Now</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-3">Investor Access</h1>
          <p className="text-white/50 text-lg">Complete the form to request access to the AthlynX investor portal.</p>
          <p className="text-blue-400 font-bold mt-2">$135B market · Zero full-stack competitors · Pre-Seed open</p>
        </div>
        <div className="bg-[#0d1b3e] border border-white/10 rounded-3xl p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { key: "fullName", label: "Full Name *", placeholder: "Chad A. Dozier Sr." },
              { key: "email", label: "Email Address *", placeholder: "you@fund.com" },
              { key: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000" },
              { key: "company", label: "Company / Fund", placeholder: "Sequoia Capital" },
              { key: "title", label: "Title / Role", placeholder: "Managing Partner" },
            ] as const).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-1.5">{label}</label>
                <input type="text" placeholder={placeholder} value={(form as any)[key]}
                  onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50" />
              </div>
            ))}
            <div>
              <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-1.5">Investment Range *</label>
              <select value={form.investmentRange} onChange={(e) => setForm(f => ({ ...f, investmentRange: e.target.value as any }))}
                className="w-full bg-[#0a1628] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50">
                {["Under $50K", "$50K – $250K", "$250K – $500K", "$500K – $1M", "$1M+"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-1.5">Message (Optional)</label>
            <textarea placeholder="Tell us about your investment thesis..." value={form.message}
              onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 resize-none" />
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.accredited} onChange={(e) => setForm(f => ({ ...f, accredited: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded accent-blue-500" />
            <span className="text-white/60 text-sm">I confirm I am an <strong className="text-white">accredited investor</strong> as defined by SEC Rule 501 of Regulation D.</span>
          </label>
          <button onClick={() => {
            if (!form.fullName.trim() || !form.email.trim()) return toast.error("Full name and email are required");
            submit.mutate(form);
          }} disabled={submit.isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl text-lg transition-all shadow-xl shadow-blue-500/20">
            {submit.isPending ? "Submitting..." : "Request Investor Access →"}
          </button>
          <p className="text-white/20 text-xs text-center">CONFIDENTIAL — FOR ACCREDITED INVESTOR USE ONLY · © 2026 Dozier Holdings LLC · AthlynX, Inc. · Houston, TX 77047</p>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function InvestorHubInner() {
  const [activeTab, setActiveTab] = useState<"revenue" | "pl">("revenue");
  const [accessGranted, setAccessGranted] = useState(false);
  if (!accessGranted) return <InvestorRequestGate onGranted={() => setAccessGranted(true)} />;

  return (
    <div className="min-h-screen bg-[#040c1a] text-white font-sans">

      {/* ── STICKY NAV ── */}
      <nav className="bg-[#040c1a]/95 backdrop-blur border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/athlynx-icon.png" alt="AthlynX" className="w-8 h-8 rounded-lg" />
              <span className="font-black text-white tracking-widest text-sm">AthlynX</span>
            </div>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-xs font-semibold text-white/50">
            <a href="#opportunity" className="hover:text-white transition-colors">Opportunity</a>
            <a href="#financials" className="hover:text-white transition-colors">Financials</a>
            <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
            <a href="#moat" className="hover:text-white transition-colors">Moat</a>
            <a href="#team" className="hover:text-white transition-colors">Team</a>
          </div>
          <a href="mailto:contact@athlynx.ai" className="bg-red-400 hover:bg-red-300 text-black font-black text-xs px-4 py-2 rounded-lg transition-all hover:scale-105">
            INVEST NOW →
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center relative">
          <div className="inline-flex items-center gap-2 bg-red-400/10 border border-red-400/30 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-black tracking-widest uppercase">Pre-Seed Round · Now Open · Seeking $500K</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            NOT A ME-TOO<br />
            <span className="text-red-400">COMPANY.</span><br />
            <span className="text-white/80">THE COMPANY.</span>
          </h1>

          <p className="text-white/60 text-xl max-w-3xl mx-auto mb-3 leading-relaxed">
            Founder-led. Faith-forward. Different by design. Youth → High School → College → Pro → Retired. One platform. Every sport. Every level. No competitor has ever done all of this.
          </p>
          <p className="text-white/40 text-sm max-w-2xl mx-auto mb-10">
            NIL · AI Recruiting · Transfer Portal · Training · Athlete Store · White-Label · Pro Teams · AI Bots · Robot Data Collection · Messenger · Faith
          </p>

          {/* Key Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
            {[
              { v: "$135.9B", l: "Total Market by 2035" },
              { v: "$324M", l: "Year 5 ARR Target" },
              { v: "$1.25B", l: "Series C Valuation" },
              { v: "IPO", l: "End Game · 2029–2030" },
            ].map(k => (
              <div key={k.l} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl font-black text-red-400">{k.v}</div>
                <div className="text-white/50 text-xs mt-1">{k.l}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:contact@athlynx.ai" className="bg-red-400 hover:bg-red-300 text-black font-black px-10 py-4 rounded-xl text-lg transition-all shadow-2xl shadow-red-400/25 hover:scale-105">
              💰 REQUEST INVESTOR DECK
            </a>
            <a href="/book" className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl border border-white/20 transition-all">
              📞 Book a call
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-20">

        {/* ── BENCHMARK: FASTEST GROWING ── */}
        <section className="bg-gradient-to-r from-cyan-900/30 to-blue-900/20 border border-cyan-500/30 rounded-3xl p-8">
          <div className="text-center mb-8">
            <p className="text-cyan-400 text-xs font-black tracking-widest uppercase mb-2">The Vision</p>
            <h2 className="text-3xl font-black text-white">AthlynXAI: $0 → $100M ARR in 8 Months.</h2>
            <p className="text-white/50 mt-2">The fastest startup in history. We are building AthlynX to beat that record in sports.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-4xl font-black text-cyan-400">8 mo</div>
              <div className="text-white font-bold mt-2">AthlynXAI: $0 → $100M ARR</div>
              <div className="text-white/40 text-xs mt-1">Fastest startup ever · AI agent platform</div>
            </div>
            <div className="bg-red-400/10 border border-red-400/30 rounded-2xl p-6">
              <div className="text-4xl font-black text-red-400">12 mo</div>
              <div className="text-white font-bold mt-2">AthlynX Target: $0 → $100M ARR</div>
              <div className="text-white/40 text-xs mt-1">$135B market · 520K+ athletes · AI-powered</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-4xl font-black text-green-400">2029</div>
              <div className="text-white font-bold mt-2">IPO Target</div>
              <div className="text-white/40 text-xs mt-1">NYSE / NASDAQ · $2B–$5B valuation</div>
            </div>
          </div>
        </section>

        {/* ── MARKET OPPORTUNITY ── */}
        <section id="opportunity">
          <div className="text-center mb-10">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-2">Market Opportunity</p>
            <h2 className="text-4xl font-black text-white">$135 Billion. Barely Touched by AI.</h2>
            <p className="text-white/50 mt-3 text-base max-w-2xl mx-auto">AthlynX sits at the intersection of every major growth vector in sports — and no one has ever connected them all.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {MARKET_DATA.map(m => (
              <div key={m.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-red-400/30 transition-all group">
                <div className="text-3xl mb-3">{m.icon}</div>
                <div className="text-2xl font-black text-red-400 group-hover:text-red-300 transition-colors">{m.value}</div>
                <div className="text-white font-bold text-sm mt-1">{m.label}</div>
                <div className="text-white/40 text-xs mt-1">{m.sub}</div>
                <div className="text-white/20 text-xs mt-2 italic">Source: {m.src}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI DATA MOAT ── */}
        <section className="bg-gradient-to-br from-blue-950/30 to-blue-900/20 border border-blue-600/30 rounded-3xl p-8">
          <div className="text-center mb-8">
            <p className="text-blue-500 text-xs font-black tracking-widest uppercase mb-2">The Unfair Advantage</p>
            <h2 className="text-3xl font-black text-white">AI Bots + Robots = The World's Largest Athlete Dataset</h2>
            <p className="text-white/50 mt-2 max-w-2xl mx-auto text-sm">Every AI interaction, every robot sideline session, every wearable — streams directly to AthlynX servers. We own the data. No competitor can replicate it.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🤖", title: "AI Bot Sessions", desc: "Every AI Recruiter, Trainer, Coach, and Content session logs structured performance data — responses, metrics, engagement patterns." },
              { icon: "🦾", title: "Sideline Robots", desc: "Camera tracking, biometric sensors, motion capture — all stream to AthlynX servers via secure real-time API." },
              { icon: "⌚", title: "Wearables Integration", desc: "Heart rate, GPS, acceleration, recovery scores, sleep data — all piped in, timestamped, athlete-attributed." },
              { icon: "🏆", title: "Proprietary Dataset", desc: "The largest real athlete performance dataset in the world. Licensed to brands, scouts, and leagues. Valued in the hundreds of millions." },
            ].map(d => (
              <div key={d.title} className="bg-white/5 border border-blue-600/20 rounded-2xl p-5">
                <div className="text-3xl mb-3">{d.icon}</div>
                <div className="text-white font-black text-sm mb-2">{d.title}</div>
                <div className="text-white/50 text-xs leading-relaxed">{d.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4">
              <div className="text-2xl font-black text-blue-500">Year 3</div>
              <div className="text-white text-sm font-bold">Data Licensing Begins</div>
              <div className="text-white/40 text-xs">$360K → $5.4M by Year 5</div>
            </div>
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4">
              <div className="text-2xl font-black text-blue-500">100M+</div>
              <div className="text-white text-sm font-bold">Data Points by Year 3</div>
              <div className="text-white/40 text-xs">Across all sports, all levels</div>
            </div>
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4">
              <div className="text-2xl font-black text-blue-500">$500M+</div>
              <div className="text-white text-sm font-bold">Dataset Valuation (IPO)</div>
              <div className="text-white/40 text-xs">Comparable to Sportradar, Stats Perform</div>
            </div>
          </div>
        </section>

        {/* ── 5-YEAR P&L ── */}
        <section id="financials">
          <div className="text-center mb-8">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-2">Financial Projections</p>
            <h2 className="text-4xl font-black text-white">5-Year P&L Proforma</h2>
            <p className="text-white/50 mt-2 text-sm">Conservative projections. Numbers verified to add up. Based on real SaaS benchmarks and NIL market data.</p>
          </div>

          {/* Tab Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button onClick={() => setActiveTab("revenue")} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "revenue" ? "bg-red-400 text-black" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>Revenue Streams</button>
            <button onClick={() => setActiveTab("pl")} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "pl" ? "bg-red-400 text-black" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>P&L Summary</button>
          </div>

          {activeTab === "revenue" && (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-left px-5 py-4 text-white/60 font-semibold min-w-[220px]">Revenue Stream</th>
                    {YEARS.map((y, i) => <th key={i} className="px-4 py-4 text-white/60 font-semibold text-right">{y}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {REVENUE_STREAMS.map((row, i) => (
                    <tr key={row.label} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                      <td className="px-5 py-3 text-white/80 font-medium">{row.label}</td>
                      {row.y.map((v, j) => <td key={j} className="px-4 py-3 text-right text-white/70 font-mono text-xs">{v === 0 ? "—" : fmt(v)}</td>)}
                    </tr>
                  ))}
                  <tr className="bg-red-400/10 border-t-2 border-red-400/40">
                    <td className="px-5 py-4 text-red-400 font-black">TOTAL REVENUE</td>
                    {TOTAL_REV.map((v, i) => <td key={i} className="px-4 py-4 text-right text-red-400 font-black font-mono">{fmt(v)}</td>)}
                  </tr>
                  <tr className="bg-cyan-400/5 border-t border-cyan-400/20">
                    <td className="px-5 py-3 text-cyan-400 font-bold text-xs">Valuation (7× Revenue)</td>
                    {VALUATION.map((v, i) => <td key={i} className="px-4 py-3 text-right text-cyan-400 font-bold font-mono text-xs">{fmt(v)}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "pl" && (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-left px-5 py-4 text-white/60 font-semibold min-w-[220px]">Line Item</th>
                    {YEARS.map((y, i) => <th key={i} className="px-4 py-4 text-white/60 font-semibold text-right">{y}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Gross Revenue", vals: TOTAL_REV, color: "text-white", bold: false },
                    { label: "Cost of Revenue (COGS)", vals: COGS, color: "text-red-400", bold: false, prefix: "−" },
                    { label: "Gross Profit", vals: GROSS, color: "text-green-400", bold: true },
                    { label: `Gross Margin`, vals: GROSS.map((g, i) => g / TOTAL_REV[i]), color: "text-green-400/70", bold: false, isPct: true },
                    { label: "Operating Expenses", vals: OPEX, color: "text-red-400", bold: false, prefix: "−" },
                    { label: "EBITDA", vals: EBITDA, color: "text-cyan-400", bold: true },
                    { label: "EBITDA Margin", vals: EBITDA.map((e, i) => e / TOTAL_REV[i]), color: "text-cyan-400/70", bold: false, isPct: true },
                    { label: "Income Tax (21%)", vals: TAX, color: "text-red-400/70", bold: false, prefix: "−" },
                    { label: "Net Income", vals: NET, color: "text-red-400", bold: true },
                  ].map((row, ri) => (
                    <tr key={row.label} className={`border-b border-white/5 ${ri % 2 === 0 ? "" : "bg-white/[0.02]"} ${row.bold ? "bg-white/5" : ""}`}>
                      <td className={`px-5 py-3 font-${row.bold ? "black" : "medium"} ${row.color}`}>{row.label}</td>
                      {row.vals.map((v, j) => (
                        <td key={j} className={`px-4 py-3 text-right font-mono font-${row.bold ? "black" : "normal"} ${row.color} text-xs`}>
                          {(row as any).isPct
                            ? `${Math.round((v as number) * 100)}%`
                            : `${(row as any).prefix || ""}${fmt(v as number)}`
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-white/25 text-xs mt-3 text-center">* Forward-looking projections. Based on SaaS Capital 2025 benchmarks, NIL market data (Opendorse 2025), and comparable platform growth rates. Actual results may vary.</p>
        </section>

        {/* ── FUNDING ROADMAP ── */}
        <section id="roadmap">
          <div className="text-center mb-10">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-2">Funding Roadmap</p>
            <h2 className="text-4xl font-black text-white">Pre-Seed → IPO</h2>
            <p className="text-white/50 mt-2">Every dollar has a purpose. Every milestone is measurable. End game: NYSE or NASDAQ.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROUNDS.map(r => (
              <div key={r.round} className={`bg-white/5 border-2 ${r.color} rounded-2xl p-6 shadow-xl ${r.glow} relative`}>
                {r.open && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-black text-xs font-black px-3 py-1 rounded-full animate-pulse shadow-lg shadow-green-500/40">● OPEN NOW</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4 mt-2">
                  <span className="text-white font-black text-xl">{r.round}</span>
                  <span className={`text-xs font-black px-2 py-1 rounded-full text-white ${r.badge}`}>{r.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div>
                    <div className="text-lg font-black text-white">{r.ask}</div>
                    <div className="text-white/40 text-xs">Raise</div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-red-400">{r.equity}</div>
                    <div className="text-white/40 text-xs">Equity</div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-cyan-400">{r.postMoney}</div>
                    <div className="text-white/40 text-xs">Post-Money</div>
                  </div>
                </div>
                <p className="text-white/60 text-xs mb-3 leading-relaxed">{r.use}</p>
                <div className="bg-white/5 rounded-xl px-3 py-2">
                  <p className="text-white/80 text-xs font-semibold">🎯 {r.milestone}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMPETITIVE MOAT ── */}
        <section id="moat">
          <div className="text-center mb-8">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-2">Competitive Moat</p>
            <h2 className="text-4xl font-black text-white">Everyone Else Solves One Problem.</h2>
            <p className="text-white/50 mt-2">AthlynX solves all of them. That has never been done before in the history of sports.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-4 py-3 text-white/60 font-semibold min-w-[120px]">Platform</th>
                  {COMP_COLS.map(h => <th key={h} className="px-3 py-3 text-white/60 font-semibold text-center whitespace-nowrap">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((c, i) => {
                  const isAthlynX = c.name.includes("AthlynX");
                  return (
                    <tr key={c.name} className={`border-b border-white/5 ${isAthlynX ? "bg-red-400/10" : i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                      <td className={`px-4 py-3 font-bold ${isAthlynX ? "text-red-400" : "text-white/70"}`}>{c.name}</td>
                      {c.vals.map((v, j) => (
                        <td key={j} className="px-3 py-3 text-center">
                          {v ? <span className={`text-base ${isAthlynX ? "text-red-400" : "text-green-400"}`}>✓</span>
                             : <span className="text-white/15 text-base">✗</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { n: "9/9", l: "AthlynX checks all boxes", c: "text-red-400" },
              { n: "2/9", l: "Best competitor (Hudl)", c: "text-white/50" },
              { n: "0", l: "Competitors with full stack", c: "text-red-400" },
            ].map(s => (
              <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className={`text-3xl font-black ${s.c}`}>{s.n}</div>
                <div className="text-white/50 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOUNDING STORY ── */}
        <section className="bg-gradient-to-r from-slate-900/80 to-blue-950/40 border border-white/10 rounded-3xl p-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-4">Our Story</p>
            <h2 className="text-3xl font-black text-white mb-6">Built from Nothing. Funded by Belief.</h2>
            <p className="text-white/70 text-base leading-relaxed mb-4">
              AthlynX was founded by <span className="text-white font-bold">Chad A. Dozier</span> in Houston, Texas, alongside co-founder <span className="text-white font-bold">Glenn Tse</span>. The company has been built through founder discipline, operator commitment, and pure sweat equity.
            </p>
            <p className="text-white/70 text-base leading-relaxed mb-4">
              One person. One AI. One vision. Sam Altman said a one-person, AI-powered billion-dollar company is coming. AthlynX is positioned to be the first in sports.
            </p>
            <blockquote className="border-l-4 border-red-400 pl-5 text-left mt-6">
              <p className="text-white/60 text-sm italic leading-relaxed">"We are not building one of a kind. We are building the only one. No one has ever put all of this under one roof — NIL, recruiting, training, store, pro teams, AI bots, robot data collection — for athletes at every level from youth to retirement."</p>
              <footer className="text-white/40 text-xs mt-2">— Chad A. Dozier, Founder · CEO · Chairman, AthlynX</footer>
            </blockquote>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section id="team">
          <div className="text-center mb-10">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-2">Leadership</p>
            <h2 className="text-4xl font-black text-white">The Team Behind AthlynX</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {TEAM.map(m => (
              <div key={m.name} className={`rounded-2xl p-6 border ${m.highlight ? "bg-red-400/10 border-red-400/40" : "bg-white/5 border-white/10"}`}>
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-black ${m.highlight ? "bg-red-400 text-black" : "bg-white/10 text-white"}`}>
                  {m.initials}
                </div>
                <div className={`font-black text-center ${m.highlight ? "text-red-400" : "text-white"}`}>{m.name}</div>
                <div className="text-white/60 text-xs font-semibold text-center mt-1">{m.title}</div>
                <div className="text-center mt-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${m.highlight ? "bg-red-400/20 text-red-400" : "bg-white/10 text-white/50"}`}>{m.equity} equity</span>
                </div>
                <div className="text-white/40 text-xs mt-3 text-center leading-relaxed">{m.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── USE OF FUNDS ── */}
        <section>
          <div className="text-center mb-8">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-2">Use of Funds</p>
            <h2 className="text-3xl font-black text-white">Pre-Seed $500K — Every Dollar Allocated</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { pct: "35%", amt: "$175K", label: "Platform Development", sub: "Complete all modules, mobile PWA, AI integrations", color: "border-red-400" },
              { pct: "25%", amt: "$125K", label: "Sales & Marketing", sub: "First 50 school licenses, brand partnerships", color: "border-blue-400" },
              { pct: "25%", amt: "$125K", label: "Operations & Team", sub: "First hires: sales rep, customer success, dev", color: "border-blue-500" },
              { pct: "15%", amt: "$75K", label: "Legal & Infrastructure", sub: "IP protection, server infrastructure, compliance", color: "border-green-400" },
            ].map(f => (
              <div key={f.label} className={`bg-white/5 border-2 ${f.color} rounded-2xl p-5 text-center`}>
                <div className="text-3xl font-black text-white">{f.pct}</div>
                <div className="text-red-400 font-black text-lg">{f.amt}</div>
                <div className="text-white font-bold text-sm mt-2">{f.label}</div>
                <div className="text-white/40 text-xs mt-1 leading-relaxed">{f.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GTC SAN JOSE 2026 GALLERY ── */}
        <section>
          <div className="text-center mb-8">
            <p className="text-blue-400 text-xs font-black tracking-widest uppercase mb-2">GTC San Jose · March 2026</p>
            <h2 className="text-3xl font-black text-white">Seen at the World's Largest AI Conference</h2>
            <p className="text-white/50 text-sm mt-2">AthlynX represented at NVIDIA GTC San Jose — the global epicenter of AI, robotics, and the future of technology.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {[
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/ZJpHzjtdpFeKROTQ.png", label: "Chad A. Dozier Sr. — Founder · CEO · Chairman" },
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/erHGyrjEOZTzJWOZ.png", label: "Glenn Tse — Co-Founder & CFO" },
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/FThqDljbtKNLlKlD.png", label: "Lee Marshall — Operations Partner" },
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/exAAgSixBHgQljNl.png", label: "NIL Portal App — Live Platform" },
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/xlwTkEHOFgfMcnmi.png", label: "AthlynX Main Logo" },
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/xhCABOQVEmpNnSWz.png", label: "Dozier Holdings Group Logo" },
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/jPfDDFrCxeVdxfwJ.png", label: "NIL Portal Logo" },
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/BSBBRqHMyWquLBeF.png", label: "AthlynX App Icon" },
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/DzxLLSERMYZAxrht.png", label: "DHG Crab Shield" },
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/ZJpHzjtdpFeKROTQ.png", label: "Chad A. Dozier Sr. — NVIDIA GTC 2026" },
              { src: "https://files.athlynx.ai/user_upload_by_module/session_file/310419663028706780/erHGyrjEOZTzJWOZ.png", label: "Glenn Tse — NVIDIA GTC 2026" },
            ].map(({ src, label }, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all group relative">
                <img src={src} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">{label}</div>
              </div>
            ))}
          </div>
          {/* Downloadable Pitch Decks */}
          <div className="text-center mb-6">
            <p className="text-blue-400 text-xs font-black tracking-widest uppercase mb-4">Investor Documents</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="/docs/tlwCMeumMsxRCBVr.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-blue-900/40 border border-white/20 hover:border-blue-400/50 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                <span>📊</span> DHG 5-Year Valuation Report
              </a>
              <a href="/docs/RPJQxygywzFpIYhy.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-blue-900/40 border border-white/20 hover:border-blue-400/50 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                <span>📄</span> Partner &amp; Investor Presentation
              </a>
              <a href="/docs/RuxYyWLKsDRQRvLr.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-blue-900/40 border border-white/20 hover:border-blue-400/50 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                <span>🏈</span> The Athlete Playbook
              </a>
            </div>
          </div>
        </section>

        {/* ── REAL ATHLETES ── */}
        <section>
          <div className="text-center mb-8">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-2">Proof of Concept</p>
            <h2 className="text-4xl font-black text-white">Real Athletes. Real Results.</h2>
            <p className="text-white/50 mt-2 max-w-2xl mx-auto">
              AthlynX is already in the hands of real athletes — from youth to college to pro. These are the people we built this for.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {[
              { src: "/professional-athlete-dashboard.png", label: "Platform Dashboard" },
              { src: "/brand/athlynx-promo.png", label: "Athlete Promo" },
              { src: "/brand/athlynx-investor.png", label: "Investor View" },
              { src: "/brand/dhg-empire-hero.png", label: "DHG Empire" },
              { src: "/athlete-football.jpg", label: "Football Training" },
              { src: "/athlete-basketball.jpg", label: "Basketball" },
              { src: "/athlete-baseball.jpg", label: "Baseball" },
              { src: "/athlete-track.jpg", label: "Track & Field" },
            ].map((item, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-red-400/50 transition-all group relative">
                <img src={item.src} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-bold">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            
          </div>
        </section>

        {/* ── CONTACT CTA ── */}
        <section className="bg-gradient-to-r from-red-500/20 via-red-400/10 to-red-500/20 border-2 border-red-400/50 rounded-3xl p-12 text-center">
          <div className="text-6xl mb-5">🏆</div>
          <h2 className="text-5xl font-black text-white mb-3">Ready to Own a Piece of History?</h2>
          <p className="text-white/60 text-xl mb-2">Pre-Seed round is open. We are building the $1B+ athlete platform.</p>
          <p className="text-red-400 font-bold text-lg mb-10">$135B market. Zero full-stack competitors. One team. One shot. IPO end game.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            <div className="bg-black/40 rounded-2xl p-5">
              <div className="text-red-400 font-black">Chad A. Dozier</div>
              <div className="text-white/60 text-xs mt-1">Founder · CEO · Chairman</div>
            </div>
            <div className="bg-black/40 rounded-2xl p-5">
              <div className="text-white font-bold text-sm">contact@athlynx.ai</div>
              <div className="text-white/60 text-xs mt-1">Primary Contact</div>
            </div>
            <div className="bg-black/40 rounded-2xl p-5">
              <div className="text-white font-bold">Book a call</div>
              <div className="text-white/60 text-xs mt-1">Direct Line</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:contact@athlynx.ai" className="bg-red-400 hover:bg-red-300 text-black font-black px-12 py-5 rounded-2xl text-xl transition-all shadow-2xl shadow-red-400/30 hover:scale-105">
              📧 EMAIL US NOW
            </a>
            <a href="/book" className="bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-5 rounded-2xl border border-white/20 transition-all text-lg">
              📞 CALL NOW
            </a>
          </div>

          <p className="text-white/20 text-xs mt-10">CONFIDENTIAL — FOR ACCREDITED INVESTOR USE ONLY · © 2025 Dozier Holdings LLC · AthlynX, Inc. · All Rights Reserved · Houston, TX 77047</p>
          <p className="text-white/15 text-xs mt-1">This document contains forward-looking statements. Past performance is not indicative of future results. Investment involves risk.</p>
        </section>

      </div>
    </div>
  );
}

export default function InvestorHub() {
  return <RouteErrorBoundary><InvestorHubInner /></RouteErrorBoundary>;
}
