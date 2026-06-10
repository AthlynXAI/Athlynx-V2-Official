import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Brain, CheckCircle, Shield, Server, Activity, Trophy, Lock, FileText, Users, Rocket } from "lucide-react";

const readinessPillars = [
  {
    title: "Nebius Digital Health fit",
    icon: Trophy,
    body: "AthlynXAI is positioned in Digital Health as an AI-native athlete operating system for real-world data intelligence, wellness support, recovery guidance, and return-to-play readiness language that remains human-supervised and non-diagnostic.",
  },
  {
    title: "OpenAI applied-AI fit",
    icon: Brain,
    body: "The platform applies AI to athlete health, performance, media, recruiting, and workflow automation with a focus on useful evaluation, responsible model routing, and practical human outcomes rather than novelty demos.",
  },
  {
    title: "Privacy-first architecture",
    icon: Shield,
    body: "Public health surfaces use HIPAA-aligned wording, consent-controlled data posture, anonymized/public-safe claims, audit-ready workflow design, and clear boundaries around medical decision-making.",
  },
  {
    title: "Execution proof",
    icon: Activity,
    body: "The platform has working public routes, mobile build pipelines, Nebius/OpenAI infrastructure hooks, app-store internal-track workflow evidence, and a repaired Neon/Pipedream automation layer for database-driven operations.",
  },
];

const publicProof = [
  ["Functioning website", "athlynx.ai and related AthlynXAI routes are built as public platform surfaces for athletes, families, schools, judges, and partners."],
  ["Product MVP", "Digital Health, Athlete Playbook, AI Trainer, Fuel Bots, recruiting, media, and operating-system surfaces exist in the source platform."],
  ["GTM strategy", "The model is built around schools, clubs, athletes, families, trainers, media loops, and future enterprise/institutional deployments."],
  ["AI infrastructure", "The backend includes a multi-engine LLM cascade with Nebius as a primary AI compute lane and OpenAI as a fallback layer where appropriate."],
  ["Privacy posture", "Health-sensitive data flows are framed as HIPAA-aligned by design, consent-controlled, anonymized where used publicly, and restricted behind account access."],
  ["Build proof", "Recent CI Gate, EAS iOS, and EAS Android reruns reached green status after the billing blocker was cleared."],
];

const guardrails = [
  "No claim of HIPAA certification, FDA approval, diagnosis, emergency medicine performance, or clinician replacement.",
  "No publication of private investor decks, P&L models, internal screenshots, credentials, or unapproved partner details.",
  "No use of athlete health data in public examples unless anonymized and approved for public use.",
  "No sports betting, wagering, odds, sportsbook integration, or gambling-adjacent product language.",
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
            <Link href="/digital-health" className="text-gray-300 hover:text-white">Digital Health</Link>
            <Link href="/medical" className="text-gray-300 hover:text-white">Medical</Link>
            <Link href="/hipaa" className="text-gray-300 hover:text-white">Privacy Posture</Link>
            <Link href="/signin" className="rounded-xl bg-cyan-400 px-4 py-2 font-black text-[#07111f] hover:bg-cyan-300">Sign In</Link>
          </nav>
        </div>
      </header>

      <main className="px-4 py-16 md:py-20">
        <section className="mx-auto mb-14 max-w-6xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200">
            <Rocket className="h-4 w-4" /> OPENAI + NEBIUS READINESS
          </span>
          <h1 className="mx-auto mb-6 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
            Different by design. Built to be The Company.
          </h1>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-300 md:text-xl">
            AthlynXAI is a founder-led, faith-forward, AI-native athlete operating system built for athlete health, performance, recruiting visibility, media, and long-term development. This page summarizes the public evidence judges can review without exposing private investor materials or overstating medical claims.
          </p>
        </section>

        <section className="mx-auto mb-14 grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          {readinessPillars.map((pillar) => (
            <article key={pillar.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">
              <pillar.icon className="mb-4 h-10 w-10 text-cyan-300" />
              <h2 className="mb-3 text-2xl font-black text-white">{pillar.title}</h2>
              <p className="leading-relaxed text-gray-300">{pillar.body}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto mb-14 grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-7">
            <div className="mb-5 flex items-center gap-3">
              <Server className="h-8 w-8 text-cyan-300" />
              <h2 className="text-3xl font-black">What judges can verify now</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {publicProof.map(([label, body]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-cyan-200">
                    <CheckCircle className="h-4 w-4" />
                    <h3 className="font-black">{label}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-7">
            <div className="mb-5 flex items-center gap-3">
              <Lock className="h-8 w-8 text-emerald-300" />
              <h2 className="text-3xl font-black">Responsible boundaries</h2>
            </div>
            <p className="mb-5 leading-relaxed text-gray-300">
              AthlynXAI is built to support athletes and the people around them. It is not presented as a diagnostic product, medical device, emergency-care system, or substitute for licensed professionals.
            </p>
            <div className="space-y-3">
              {guardrails.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-relaxed text-gray-300">
                  <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mb-14 max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="mb-6 flex items-center gap-3">
            <FileText className="h-8 w-8 text-cyan-300" />
            <h2 className="text-3xl font-black">Competition packet alignment</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-black/20 p-5">
              <h3 className="mb-3 text-xl font-black text-cyan-200">OpenAI packet</h3>
              <p className="leading-relaxed text-gray-300">Prepared around applied AI, domain-specific evaluation, athlete-workflow automation, safety boundaries, and human-supervised platform outcomes.</p>
            </div>
            <div className="rounded-2xl bg-black/20 p-5">
              <h3 className="mb-3 text-xl font-black text-cyan-200">Nebius packet</h3>
              <p className="leading-relaxed text-gray-300">Prepared around Digital Health, real-world data intelligence, MVP proof, GPU-scale AI infrastructure, anonymized data posture, and June finalist review readiness.</p>
            </div>
            <div className="rounded-2xl bg-black/20 p-5">
              <h3 className="mb-3 text-xl font-black text-cyan-200">Investor materials</h3>
              <p className="leading-relaxed text-gray-300">Decks, P&L models, and detailed financials remain private, request-only, and recipient-approved. They are not published on this public page.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <Link href="/digital-health" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/40">
            <h3 className="mb-2 text-2xl font-black">Digital Health Hub</h3>
            <p className="text-gray-300">Review the athlete wellness and lifecycle doorway.</p>
          </Link>
          <Link href="/fuel-bots" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/40">
            <h3 className="mb-2 text-2xl font-black">Fuel Bots</h3>
            <p className="text-gray-300">Review the future physical-AI and athlete-support lane.</p>
          </Link>
          <Link href="/athlynxai-os" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/40">
            <h3 className="mb-2 text-2xl font-black">AthlynXAI OS</h3>
            <p className="text-gray-300">Review the operating-system and media-loop foundation.</p>
          </Link>
        </section>
      </main>

      <section className="border-t border-white/10 bg-black/40 px-4 py-8 text-center text-sm text-gray-400">
        <div className="mx-auto max-w-4xl">
          Public competition-readiness summary. Private screenshots, investor financials, API keys, user data, and internal workflow evidence remain off-page unless specifically approved for a recipient.
        </div>
      </section>
      <MobileBottomNav />
    </div>
  );
}

export default function CompetitionReadiness() {
  return <RouteErrorBoundary><CompetitionReadinessInner /></RouteErrorBoundary>;
}
