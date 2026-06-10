/**
 * /nebius-partnership — AthlynXAI + Nebius Partnership Hub
 * Nebius AI Discovery Awards 2026 — Digital Health Semifinalist
 * London, July 1, 2026
 * Judge-facing public page. No private credentials or investor materials.
 */
import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import {
  Server, Cpu, Zap, Shield, Trophy, Activity, Heart,
  Globe, Target, ArrowRight, Calendar, MapPin, CheckCircle,
  Star, Brain, Lock
} from "lucide-react";

const nebiusStack = [
  {
    icon: Cpu,
    title: "NVIDIA H200 GPU Cluster",
    body: "AthlynXAI OS runs inference on Nebius NVIDIA H200 GPU infrastructure — Hopper architecture, 141 GB HBM3e RAM, up to 4.8 TB/s memory bandwidth. NVIDIA is investing $2 billion in Nebius. We are running that compute today.",
  },
  {
    icon: Server,
    title: "Nebius AI Cloud",
    body: "Live endpoint: api.studio.nebius.ai/v1. OpenAI-compatible API. Active models: Llama 4 Maverick (MoE, best quality), Llama 4 Scout (high throughput), Llama 3.3-70B (proven production), Nemotron Ultra 253B (elite analysis). $5,000 OG credits active.",
  },
  {
    icon: Zap,
    title: "Nebius Token Factory",
    body: "AthlynXAI OS is designed around a tokenized compute economy. Platform credits, premium access, AI usage credits, media access, NIL workflow credits, and tiered services — all backed by Nebius Token Factory infrastructure.",
  },
  {
    icon: Globe,
    title: "Multi-Rail AI Orchestration",
    body: "AthlynXAI OS orchestrates across Nebius, OpenAI, Anthropic, Gemini, and Perplexity rails. Nebius is the primary engine when NEBIUS_API_KEY is configured. This is not a future plan — it is live today.",
  },
];

const digitalHealthFit = [
  {
    icon: Heart,
    title: "Medical Intelligence Layer",
    body: "Physical health data, mental wellness check-ins, injury history, training load, nutrition plans, therapy notes, recovery milestones, sleep patterns, wearable readings, robot sensor data, and return-to-play readiness — all in one consent-controlled athlete profile.",
  },
  {
    icon: Shield,
    title: "HIPAA-Aligned by Design",
    body: "Privacy-first, consent-controlled, and designed for regulated deployment. Minimum-necessary access. Role-based permissions. Anonymization where required. Auditability. Human oversight. No diagnostic claims, no FDA overclaims, no clinician replacement.",
  },
  {
    icon: Target,
    title: "Fuel Bots — Physical AI Edge",
    body: "Fuel Bots are the physical edge of the AthlynXAI brain. They observe movement, collect sensor data, remind athletes about recovery routines, support AI-assisted physical therapy, guide nutrition behavior, and keep the athlete connected to the platform.",
  },
  {
    icon: Brain,
    title: "AI Trainer + Wearables",
    body: "AI Trainer workflows powered by Nebius H200 inference. Wearable signal integration. Computer vision for movement analysis. Athlete-specific recommendation models. Scalable AI inference for multimodal processing and sensor data pipelines.",
  },
];

const workloadMap = [
  ["X-Factor Scoring", "Nebius H200 inference for athlete scoring, enrichment, and profile analysis"],
  ["Long-Context Analysis", "Llama 4 Maverick for scouting reports, athlete profiles, and complex reasoning"],
  ["Bulk AI Workflows", "Llama 4 Scout for CRM enrichment, bulk content generation, and high-throughput tasks"],
  ["Elite Analysis", "Nemotron Ultra 253B for NVIDIA-aligned elite analysis and complex reasoning"],
  ["Health Check", "Llama 3.3-70B for production health checks and proven inference tasks"],
  ["Media Intelligence", "AXN network, podcast publishing, Spotify, Suno audio — all AI-assisted via Nebius"],
  ["Autonomous Workflows", "Auto-enrich, auto-score, auto-route, auto-summarize, auto-generate content plans"],
  ["Token Factory", "Platform credits, premium access, AI usage credits, and tiered services"],
];

const semifinalistEvidence = [
  "Nebius AI Discovery Awards 2026 — Digital Health Semifinalist confirmed",
  "Semifinalist follow-up sent to dpol@nebius.com with review link",
  "Platform live at athlynx.ai — HTTP 200 across all primary routes",
  "Nebius AI engine health endpoint: activeEngine: nebius, status: ok",
  "Live latency verified: sub-600ms on Llama 3.3-70B production model",
  "H200 compute active: $5,000 OG credits confirmed active (S37 May 2026)",
  "Nebius for Startups application package prepared and ready to submit",
  "Digital Health category fit: wearables, Fuel Bots, AI trainers, medical intelligence",
  "HIPAA-aligned architecture, consent-controlled, anonymized public-safe claims",
  "Active dialogue with Dmitry Polyakov regarding H200 compute allocation",
];

function NebiusPartnershipInner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061120] via-[#0b2140] to-[#08111f] text-white">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/athlynx-icon.png" alt="AthlynX" className="h-11 rounded-lg" />
            <span className="text-xl font-black tracking-tight">AthlynX</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            <Link href="/competition-readiness" className="text-gray-300 hover:text-white">Competition Readiness</Link>
            <Link href="/digital-health" className="text-gray-300 hover:text-white">Digital Health</Link>
            <Link href="/hipaa" className="text-gray-300 hover:text-white">Privacy Posture</Link>
            <Link href="/athlynxai-os" className="text-gray-300 hover:text-white">AthlynXAI OS</Link>
            <Link href="/signin" className="rounded-xl bg-[#1E90FF] px-4 py-2 font-black text-white hover:bg-[#1565C0]">Sign In</Link>
          </nav>
        </div>
      </header>

      <main className="px-4 py-16 md:py-20">

        {/* Hero */}
        <section className="mx-auto mb-14 max-w-6xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-4 py-2 text-sm font-bold text-[#00C2FF]">
            <Trophy className="h-4 w-4" /> NEBIUS AI DISCOVERY AWARDS 2026 — DIGITAL HEALTH SEMIFINALIST
          </span>
          <h1 className="mx-auto mb-6 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
            AthlynXAI + Nebius.<br />Built for the Athlete.
          </h1>
          <p className="mx-auto mb-8 max-w-4xl text-lg leading-relaxed text-gray-300 md:text-xl">
            AthlynXAI OS is built on Nebius H200-class GPU infrastructure for AI inference and training, leveraging Nebius AI Cloud and Nebius Token Factory for production workloads and compute credits. This is not a future plan — it is live today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-4 py-2 text-sm font-bold text-[#00C2FF]">
              <Calendar className="h-4 w-4" />
              July 1, 2026 — London
            </div>
            <div className="flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-400">
              <Activity className="h-4 w-4" />
              Nebius H200 Active
            </div>
            <div className="flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm font-bold text-purple-400">
              <MapPin className="h-4 w-4" />
              Digital Health Category
            </div>
          </div>
        </section>

        {/* Nebius Stack */}
        <section className="mx-auto mb-14 max-w-7xl">
          <h2 className="mb-8 text-3xl font-black text-center">Nebius Infrastructure Stack</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {nebiusStack.map((item) => (
              <div key={item.title} className="rounded-3xl border border-[#00C2FF]/20 bg-[#00C2FF]/5 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <item.icon className="h-8 w-8 text-[#00C2FF]" />
                  <h3 className="text-xl font-black">{item.title}</h3>
                </div>
                <p className="leading-relaxed text-gray-300">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Digital Health Fit */}
        <section className="mx-auto mb-14 max-w-7xl">
          <h2 className="mb-3 text-3xl font-black text-center">Digital Health Category Fit</h2>
          <p className="mb-8 text-center text-gray-400 max-w-3xl mx-auto">
            AthlynXAI is the full-stack Digital Health OS for athletes. It collects the right data, protects it, interprets it, and turns it into action through AI trainers and Fuel Bots — powered by Nebius H200 at scale.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {digitalHealthFit.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <item.icon className="h-8 w-8 text-[#00C2FF]" />
                  <h3 className="text-xl font-black">{item.title}</h3>
                </div>
                <p className="leading-relaxed text-gray-300">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nebius Workload Map */}
        <section className="mx-auto mb-14 max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="mb-6 flex items-center gap-3">
            <Server className="h-8 w-8 text-[#00C2FF]" />
            <h2 className="text-3xl font-black">Nebius Workload Map</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {workloadMap.map(([workload, description]) => (
              <div key={workload} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00C2FF]" />
                <div>
                  <p className="font-black text-white">{workload}</p>
                  <p className="text-sm text-gray-300">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Semifinalist Evidence */}
        <section className="mx-auto mb-14 max-w-7xl rounded-3xl border border-[#1E90FF]/20 bg-[#1E90FF]/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-[#00C2FF]" />
            <h2 className="text-3xl font-black">Semifinalist Evidence</h2>
          </div>
          <div className="space-y-3">
            {semifinalistEvidence.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-relaxed text-gray-300">
                <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00C2FF]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Winning Quote */}
        <section className="mx-auto mb-14 max-w-5xl text-center">
          <div className="rounded-3xl border border-[#00C2FF]/30 bg-[#00C2FF]/5 p-8">
            <p className="mb-4 text-2xl font-black leading-relaxed text-white">
              "AthlynXAI wins by becoming the athlete-centered Digital Health platform that connects medical information, performance data, mental wellness, wearable signals, robotics, and AI coaching into one HIPAA-aligned Operating System."
            </p>
            <p className="text-[#00C2FF] font-bold">— AthlynXAI Digital Health Win Strategy for Nebius</p>
          </div>
        </section>

        {/* Responsible Boundaries */}
        <section className="mx-auto mb-14 max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="mb-5 flex items-center gap-3">
            <Lock className="h-8 w-8 text-[#00C2FF]" />
            <h2 className="text-3xl font-black">Responsible boundaries</h2>
          </div>
          <p className="leading-relaxed text-gray-300">
            AthlynXAI uses precise language: HIPAA-aligned, privacy-first, consent-controlled, and designed for regulated deployment. The platform is not presented as HIPAA certified, FDA-cleared, NCAA-approved, IRS-certified, or formally partnered with NVIDIA unless separately documented. No diagnostic claims. No clinician replacement. No medical device claims.
          </p>
        </section>

        {/* Navigation */}
        <section className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <Link href="/competition-readiness" className="rounded-2xl border border-[#00C2FF]/20 bg-[#00C2FF]/5 p-6 transition hover:border-[#00C2FF]/50">
            <Trophy className="mb-3 h-7 w-7 text-[#00C2FF]" />
            <h3 className="mb-2 text-xl font-black">Competition Readiness</h3>
            <p className="text-sm text-gray-300">Full competition readiness summary for Nebius, OpenAI, and Google.</p>
          </Link>
          <Link href="/digital-health" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#1E90FF]/30">
            <Heart className="mb-3 h-7 w-7 text-[#00C2FF]" />
            <h3 className="mb-2 text-xl font-black">Digital Health Hub</h3>
            <p className="text-sm text-gray-300">Athlete wellness, GlucoAthlete OS, and the medical intelligence layer.</p>
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
          AthlynXAI + Nebius public partnership page. Nebius AI Discovery Awards 2026 Digital Health Semifinalist. No private credentials, investor financials, API keys, or unapproved partner details are published here. Contact: cdozier14@athlynx.ai
        </div>
      </section>
      <MobileBottomNav />
    </div>
  );
}

export default function NebiusPartnership() {
  return <RouteErrorBoundary><NebiusPartnershipInner /></RouteErrorBoundary>;
}
