import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Brain, CheckCircle, Shield, Server, Activity, Trophy, Lock, FileText, Rocket, Heart, Globe, Target, Zap, Star, ArrowRight, Calendar, MapPin } from "lucide-react";

const readinessPillars = [
  {
    title: "Nebius Digital Health",
    icon: Heart,
    body: "Nebius AI Discovery Awards 2026 Digital Health semifinalist. AthlynXAI is the full-stack athlete health OS: wearables, Fuel Bots, AI trainers, mental wellness, injury history, and a HIPAA-aligned brain engine powered by Nebius H200 compute.",
  },
  {
    title: "OpenAI Applied AI",
    icon: Brain,
    body: "Applied AI with real-world evaluation: athlete workflow automation, consent-controlled data use, human-supervised health and performance support, content and media intelligence, and domain-specific evaluation for safety, usefulness, and impact.",
  },
  {
    title: "Privacy-First Architecture",
    icon: Shield,
    body: "HIPAA-aligned by design. Consent-controlled data posture. Anonymized public-safe claims. Audit-ready workflow design. Clear boundaries around medical decision-making. No diagnostic claims, no FDA overclaims.",
  },
  {
    title: "Live Execution Proof",
    icon: Activity,
    body: "Production live at athlynx.ai. Nebius H200 inference active. Multi-engine AI cascade: Nebius primary, OpenAI fallback. 349+ live routes. iOS/Android build pipelines. Neon database connected. Real latency verified.",
  },
];

const publicProof = [
  ["Live production platform", "athlynx.ai is deployed on Vercel, returning HTTP 200 across all primary routes. Nebius AI engine health endpoint confirms activeEngine: nebius with sub-600ms latency."],
  ["Nebius H200 compute active", "Backend wired to api.studio.nebius.ai/v1 with Llama 4 Maverick, Llama 4 Scout, and Llama 3.3-70B on NVIDIA H200 GPU cluster. $5,000 OG credits confirmed active."],
  ["Digital Health MVP surfaces", "Digital Health Hub, GlucoAthlete OS, AI Trainer, Fuel Bots, Mental Wellness, Athlete Health, and HIPAA-aligned data governance surfaces are live in the platform."],
  ["Athlete intelligence OS", "Full-stack athlete operating system: health, readiness, performance, recruiting, NIL/media, wearable signals, and AI workflow support unified in one consent-controlled athlete profile."],
  ["Privacy and compliance posture", "HIPAA-aligned by design. Consent-controlled. Anonymized where public. Role-based access. Audit-ready. No diagnostic claims. No FDA overclaims. No clinician replacement."],
  ["Competition submissions sent", "Semifinalist follow-up sent to dpol@nebius.com. OpenAI applied-AI outreach sent to hello@openai.fund. Review link: athlynx.ai/competition-readiness."],
  ["Investor-grade build", "157-day build. 2,355 unified repository files. 1,030,000+ lines. Replacement-cost floor $1.92M\u2013$2.63M. Seed-ready valuation case $8M\u2013$12M."],
  ["Google AI Hackathon ready", "Gemini integration live in AthlynXAI OS. Multi-modal AI routing across Nebius, OpenAI, Anthropic, Gemini, and Perplexity rails. Orchestration layer is live today."],
];

const guardrails = [
  "No claim of HIPAA certification, FDA approval, clinical diagnosis, emergency medicine, or licensed clinician replacement.",
  "No publication of private investor decks, P&L models, internal screenshots, credentials, or unapproved partner details.",
  "No use of athlete health data in public examples unless anonymized and approved for public use.",
  "No sports betting, wagering, odds, sportsbook integration, or gambling-adjacent product language.",
  "No strategic-partner overclaims. No non-finalized partnership announcements.",
];

const competitions = [
  {
    name: "Nebius AI Discovery Awards 2026",
    status: "SEMIFINALIST",
    statusColor: "text-[#00C2FF] bg-[#00C2FF]/10 border-[#00C2FF]/30",
    category: "Digital Health",
    date: "July 1, 2026",
    location: "London, UK",
    description: "AthlynXAI advanced as a Digital Health semifinalist. The platform is the full-stack athlete health OS: wearables, Fuel Bots, AI trainers, mental wellness, and Nebius H200-powered inference.",
    link: "/nebius",
    icon: Trophy,
  },
  {
    name: "OpenAI Startup Fund",
    status: "SUBMITTED",
    statusColor: "text-green-400 bg-green-400/10 border-green-400/30",
    category: "Applied AI \u2014 Athlete Workflow Automation",
    date: "Active outreach",
    location: "Global",
    description: "Applied AI with real-world evaluation. Athlete workflow automation, consent-controlled data use, human-supervised health and performance support, and content/media intelligence.",
    link: "/competition-readiness",
    icon: Star,
  },
  {
    name: "Google AI Hackathon",
    status: "READY",
    statusColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    category: "Gemini Integration \u2014 Multi-Modal AI OS",
    date: "2026",
    location: "Global",
    description: "Gemini integration live in AthlynXAI OS. Multi-modal AI routing across Nebius, OpenAI, Anthropic, Gemini, and Perplexity rails. Full orchestration layer active in production.",
    link: "/athlynxai-os",
    icon: Zap,
  },
];

const nebiusWinStory = [
  {
    icon: Server,
    title: "Nebius H200 Compute",
    body: "AthlynXAI OS runs on Nebius NVIDIA H200 GPU infrastructure. Live inference at api.studio.nebius.ai/v1. Models: Llama 4 Maverick (quality), Llama 4 Scout (speed), Llama 3.3-70B (production), Nemotron Ultra 253B (elite analysis).",
  },
  {
    icon: Heart,
    title: "Digital Health Category Fit",
    body: "The platform collects, protects, and interprets mental and physical health data across the athlete\u2019s real environment. Medical intelligence layer: injury history, training load, nutrition, therapy notes, recovery milestones, sleep, wearable readings, robot sensor data.",
  },
  {
    icon: Globe,
    title: "Global Athlete Identity",
    body: "One identity. Every athlete. Every platform. From youth to pro to retirement. Athlete identity compounds while compute and software deprecate. The moat is the orchestration layer, not just the compute.",
  },
  {
    icon: Target,
    title: "Winning Thesis",
    body: "AthlynXAI is the full-stack Digital Health OS for athletes. It collects the right data, protects it, interprets it, and turns it into action through AI trainers and Fuel Bots \u2014 powered by Nebius H200 at scale.",
  },
];

function CompetitionReadinessInner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061120] via-[#0b2140] to-[#08111f] text-white">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/athlynx-icon.png" alt="AthlynX" className="h-11 rounded-lg" />
            <span className="text-xl font-black tracking-tight">AthlynX</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            <Link href="/nebius" className="text-gray-300 hover:text-white">Nebius Partnership</Link>
            <Link href="/digital-health" className="text-gray-300 hover:text-white">Digital Health</Link>
            <Link href="/hipaa" className="text-gray-300 hover:text-white">Privacy Posture</Link>
            <Link href="/athlynxai-os" className="text-gray-300 hover:text-white">AthlynXAI OS</Link>
            <Link href="/signin" className="rounded-xl bg-[#1E90FF] px-4 py-2 font-black text-white hover:bg-[#1565C0]">Sign In</Link>
          </nav>
        </div>
      </header>

      <main className="px-4 py-16 md:py-20">
        <section className="mx-auto mb-14 max-w-6xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/20 px-4 py-2 text-sm font-bold text-[#00C2FF]">
            <Trophy className="h-4 w-4" /> NEBIUS AI DISCOVERY AWARDS 2026 \u2014 DIGITAL HEALTH SEMIFINALIST
          </span>
          <h1 className="mx-auto mb-6 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
            The Athlete Health OS.<br />Powered by Nebius H200.
          </h1>
          <p className="mx-auto mb-8 max-w-4xl text-lg leading-relaxed text-gray-300 md:text-xl">
            AthlynXAI is a privacy-first, full-stack athlete intelligence operating system where Nebius H200-class GPU compute powers scoring, enrichment, inference, media intelligence, and autonomous workflows across athlete apps, The Athlete Playbook, NIL/recruiting tools, AXN media, and governed connector rails.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-4 py-2 text-sm font-bold text-[#00C2FF]">
              <Calendar className="h-4 w-4" />
              July 1, 2026 \u2014 London
            </div>
            <div className="flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-400">
              <Activity className="h-4 w-4" />
              Platform Live Now
            </div>
            <div className="flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm font-bold text-purple-400">
              <MapPin className="h-4 w-4" />
              Built in Laurel. HQ Houston. Live Everywhere.
            </div>
          </div>
        </section>

        {/* Competition Status Cards */}
        <section className="mx-auto mb-14 max-w-7xl">
          <h2 className="mb-8 text-3xl font-black text-center">Active Competitions</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {competitions.map((comp) => (
              <div key={comp.name} className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col">
                <div className="mb-4 flex items-start justify-between">
                  <comp.icon className="h-8 w-8 text-[#00C2FF]" />
                  <span className={`rounded-full border px-3 py-1 text-xs font-black ${comp.statusColor}`}>
                    {comp.status}
                  </span>
                </div>
                <h3 className="mb-1 text-xl font-black">{comp.name}</h3>
                <p className="mb-1 text-sm font-bold text-[#00C2FF]">{comp.category}</p>
                <div className="mb-3 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{comp.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{comp.location}</span>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-300">{comp.description}</p>
                <Link href={comp.link} className="flex items-center gap-2 text-sm font-bold text-[#00C2FF] hover:text-white">
                  View details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mb-14 grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          {readinessPillars.map((pillar) => (
            <article key={pillar.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">
              <pillar.icon className="mb-4 h-10 w-10 text-[#00C2FF]" />
              <h2 className="mb-3 text-2xl font-black text-white">{pillar.title}</h2>
              <p className="leading-relaxed text-gray-300">{pillar.body}</p>
            </article>
          ))}
        </section>

        {/* Nebius Win Story */}
        <section className="mx-auto mb-14 max-w-7xl rounded-3xl border border-[#00C2FF]/20 bg-[#00C2FF]/5 p-7">
          <div className="mb-6 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-[#00C2FF]" />
            <h2 className="text-3xl font-black">How AthlynXAI Wins with Nebius</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {nebiusWinStory.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <item.icon className="h-6 w-6 text-[#00C2FF]" />
                  <h3 className="text-lg font-black">{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-300">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-[#1E90FF]/30 bg-[#1E90FF]/10 p-5">
            <p className="text-center text-lg font-black text-[#00C2FF]">
              \u201cAthlynXAI is not just another AI app. It is a production-ready athlete intelligence network designed to scale on Nebius while operating with verified connector discipline.\u201d
            </p>
          </div>
        </section>

        <section className="mx-auto mb-14 grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-[#1E90FF]/30 bg-[#1E90FF]/20 p-7">
            <div className="mb-5 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-[#00C2FF]" />
              <h2 className="text-3xl font-black">What judges can verify now</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {publicProof.map(([label, body]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#00C2FF]">
                    <CheckCircle className="h-4 w-4" />
                    <h3 className="font-black">{label}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#1E90FF]/20 bg-[#1E90FF]/10 p-7">
            <div className="mb-5 flex items-center gap-3">
              <Lock className="h-8 w-8 text-[#00C2FF]" />
              <h2 className="text-3xl font-black">Responsible boundaries</h2>
            </div>
            <p className="mb-5 leading-relaxed text-gray-300">
              AthlynXAI is built to support athletes and the people around them. It is not presented as a diagnostic product, medical device, emergency-care system, or substitute for licensed professionals. HIPAA-aligned by design means the architecture is built for compliance \u2014 not that certification is complete.
            </p>
            <div className="space-y-3">
              {guardrails.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-relaxed text-gray-300">
                  <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00C2FF]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mb-14 max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="mb-6 flex items-center gap-3">
            <FileText className="h-8 w-8 text-[#00C2FF]" />
            <h2 className="text-3xl font-black">Competition packet alignment</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-black/20 p-5">
              <h3 className="mb-3 text-xl font-black text-[#00C2FF]">Nebius AI Awards</h3>
              <p className="leading-relaxed text-gray-300">Digital Health category. GPU-scale AI infrastructure. Athlete health OS with wearables, Fuel Bots, AI trainers, and HIPAA-aligned data governance. Nebius H200 compute live in production. Semifinalist follow-up sent to dpol@nebius.com. July 1, 2026 \u2014 London.</p>
            </div>
            <div className="rounded-2xl bg-black/20 p-5">
              <h3 className="mb-3 text-xl font-black text-[#00C2FF]">OpenAI Startup Fund</h3>
              <p className="leading-relaxed text-gray-300">Applied AI with real-world evaluation. Athlete workflow automation. Consent-controlled data use. Human-supervised health and performance support. Content and media intelligence. Outreach sent to hello@openai.fund.</p>
            </div>
            <div className="rounded-2xl bg-black/20 p-5">
              <h3 className="mb-3 text-xl font-black text-[#00C2FF]">Investor materials</h3>
              <p className="leading-relaxed text-gray-300">Decks, P&amp;L models, and detailed financials remain private, request-only, and recipient-approved. Replacement-cost floor $1.92M\u2013$2.63M. Seed-ready valuation $8M\u2013$12M. Request access at athlynx.ai/investor-access.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
          <Link href="/nebius" className="rounded-2xl border border-[#00C2FF]/20 bg-[#00C2FF]/5 p-6 transition hover:border-[#00C2FF]/50">
            <Trophy className="mb-3 h-7 w-7 text-[#00C2FF]" />
            <h3 className="mb-2 text-xl font-black">Nebius Partnership</h3>
            <p className="text-sm text-gray-300">H200 compute, Token Factory, and the full Nebius infrastructure story.</p>
          </Link>
          <Link href="/digital-health" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#1E90FF]/30">
            <Heart className="mb-3 h-7 w-7 text-[#00C2FF]" />
            <h3 className="mb-2 text-xl font-black">Digital Health Hub</h3>
            <p className="text-sm text-gray-300">Athlete wellness, GlucoAthlete OS, and the medical intelligence layer.</p>
          </Link>
          <Link href="/fuel-bots" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#1E90FF]/30">
            <Zap className="mb-3 h-7 w-7 text-[#00C2FF]" />
            <h3 className="mb-2 text-xl font-black">Fuel Bots</h3>
            <p className="text-sm text-gray-300">Physical AI, athlete-support robots, and edge data capture.</p>
          </Link>
          <Link href="/athlynxai-os" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#1E90FF]/30">
            <Server className="mb-3 h-7 w-7 text-[#00C2FF]" />
            <h3 className="mb-2 text-xl font-black">AthlynXAI OS</h3>
            <p className="text-sm text-gray-300">The operating system, media loop, and autonomous workflow foundation.</p>
          </Link>
        </section>
      </main>

      <section className="border-t border-white/10 bg-black/40 px-4 py-8 text-center text-sm text-gray-400">
        <div className="mx-auto max-w-4xl">
          Public competition-readiness summary for Nebius AI Discovery Awards 2026 (Digital Health Semifinalist), OpenAI Startup Fund, and Google AI Hackathon. Private screenshots, investor financials, API keys, user data, and internal workflow evidence remain off-page unless specifically approved for a recipient. Contact: cdozier14@athlynx.ai
        </div>
      </section>
      <MobileBottomNav />
    </div>
  );
}

export default function CompetitionReadiness() {
  return <RouteErrorBoundary><CompetitionReadinessInner /></RouteErrorBoundary>;
}
