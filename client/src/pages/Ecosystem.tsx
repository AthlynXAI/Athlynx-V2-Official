// Ecosystem 2026 — the canonical map of the AthlynX platform.
// Brand: cobalt #1E90FF + true black + white. No gold/yellow/orange.
// Every card routes to a real page already defined in client/src/App.tsx.
// This page is the "one identity, every athlete, every platform" overview
// that ties the athlete profile, NIL portal, AXN distribution, Playbook
// content layer, the AthlynXAI OS, and the bracket/season engine into one
// readable surface for partners, investors, recruits, and operators.

import { Link } from "wouter";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import {
  UserCheck,
  ShieldCheck,
  Archive,
  Bot,
  Workflow,
  Brain,
  Mic,
  Trophy,
  ClipboardCheck,
  Network,
  Layers,
  AppWindow,
  Compass,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// ─── Pillars ───────────────────────────────────────────────────────────────
// Five lanes the entire 2026 ecosystem rolls up into. The "Identity Lane"
// is intentionally first — it is the operating thesis of AthlynX: one
// identity that travels with the athlete for life.
const PILLARS: {
  id: string;
  label: string;
  headline: string;
  copy: string;
}[] = [
  {
    id: "identity",
    label: "Identity Lane",
    headline: "One identity. Every athlete. Every platform.",
    copy: "The Real Athlete Profile is the lifelong record — youth through pro, men and women, every sport. Private by default, verified at intake, public only by consent.",
  },
  {
    id: "nil",
    label: "NIL Lane",
    headline: "Name, image, and likeness — owned by the athlete.",
    copy: "Portal, Vault, Marketplace, Jobs, and a real NIL Calculator. Compliant, athlete-first, and wired to the verified profile underneath.",
  },
  {
    id: "intelligence",
    label: "Intelligence Lane",
    headline: "AthlynXAI — the operating layer.",
    copy: "Recruiter, scouting, training, content, and sales bots that share one data layer and one identity. Built for the families and operators who use them every day.",
  },
  {
    id: "media",
    label: "Media Lane",
    headline: "AXN, Playbook, and the studio stack.",
    copy: "The Athlete's Playbook Studio Suite, Social Command, MediaOS, and AXN distribution — approved stories move from vault to audience on the athlete's terms.",
  },
  {
    id: "season",
    label: "Season Lane",
    headline: "Brackets, College World and live competition.",
    copy: "Live games, bracket intelligence, transfer portal signals, and the College World Series 2026 surface — the competition layer that proves the platform.",
  },
];

// ─── Apps grid ─────────────────────────────────────────────────────────────
// Each entry links to a page that already exists in App.tsx. Pages that are
// not yet routed here are deliberately omitted to keep this surface honest.
type AppCard = {
  title: string;
  copy: string;
  href: string;
  icon: typeof UserCheck;
  pillar: typeof PILLARS[number]["id"];
  status: "Live" | "Beta" | "Operating";
  testId: string;
  /** Lead app marker. Per OWNERSHIP.md application ranking, Diamond Grind IQ
   *  is #1. The flagship app renders first, gets a special badge, anchors the
   *  catalog. Only one app should ever hold this flag. */
  flagship?: boolean;
};

const APPS: AppCard[] = [
  // ── #1 Flagship: Diamond Grind IQ ───────────────────────────────────────
  // Per OWNERSHIP.md (2026-06-02): Diamond Grind IQ leads every catalog.
  // Baseball-first intelligence is the proof point and the model every other
  // sport vertical follows. Do not demote without Chad's written approval.
  {
    title: "Diamond Grind IQ",
    copy: "The #1 AthlynX flagship. Baseball-first athlete intelligence — recruiting, development, training, and the Diamond Grind playbook. The proof point and the model every other sport follows.",
    href: "/diamond-grind-iq",
    icon: Trophy,
    pillar: "season",
    status: "Beta",
    testId: "card-app-diamond-grind",
    flagship: true,
  },
  // ── Identity Lane ──────────────────────────────────────────────────────
  {
    title: "Real Athlete Profile",
    copy: "The verified, lifelong athlete record. Private at intake, public only by consent.",
    href: "/real-athlete-profile-flow",
    icon: UserCheck,
    pillar: "identity",
    status: "Live",
    testId: "card-app-real-athlete-profile",
  },
  {
    title: "Athlete NIL Intake",
    copy: "Captures identity, sport, guardian review, consent, and review-packet data before public use.",
    href: "/athlete-nil-intake",
    icon: ClipboardCheck,
    pillar: "identity",
    status: "Live",
    testId: "card-app-nil-intake",
  },
  {
    title: "Private Media Vault",
    copy: "Photos, videos, screenshots, documents, and sensitive story notes enter private first.",
    href: "/media-vault-rules",
    icon: Archive,
    pillar: "identity",
    status: "Live",
    testId: "card-app-media-vault",
  },
  {
    title: "Coach Onboarding",
    copy: "Guides athletes through setup, story boundaries, verification, NIL readiness, and approved distribution.",
    href: "/coach-onboarding",
    icon: ShieldCheck,
    pillar: "identity",
    status: "Live",
    testId: "card-app-coach-onboarding",
  },
  // ── NIL Lane ───────────────────────────────────────────────────────────
  {
    title: "NIL Portal",
    copy: "The athlete's NIL home. Deals, disclosures, education, and the compliant record of every approved engagement.",
    href: "/nil-portal",
    icon: AppWindow,
    pillar: "nil",
    status: "Live",
    testId: "card-app-nil-portal",
  },
  {
    title: "NIL Vault",
    copy: "Secured archive of NIL agreements, payments, and brand materials — owned by the athlete.",
    href: "/nil-vault",
    icon: Archive,
    pillar: "nil",
    status: "Live",
    testId: "card-app-nil-vault",
  },
  {
    title: "NIL Marketplace",
    copy: "Where verified athletes meet vetted brands. One profile, one consent layer, one record.",
    href: "/nil-marketplace",
    icon: Network,
    pillar: "nil",
    status: "Live",
    testId: "card-app-nil-marketplace",
  },
  {
    title: "NIL Calculator",
    copy: "Real NIL valuation grounded in audience, sport, market, and verified performance signal.",
    href: "/nil-calculator",
    icon: Layers,
    pillar: "nil",
    status: "Live",
    testId: "card-app-nil-calculator",
  },
  // ── Intelligence Lane ──────────────────────────────────────────────────
  {
    title: "AthlynXAI OS",
    copy: "The operating layer. Ties the Founder proof profile, NIL profiles, Coach, vault, AXN, podcast, and connector proof into one production lane.",
    href: "/athlynxai-os",
    icon: Workflow,
    pillar: "intelligence",
    status: "Operating",
    testId: "card-app-athlynxai-os",
  },
  {
    title: "AthlynXAI Apps Ecosystem",
    copy: "The detailed apps view — every lane, every gate, every rule for going from private intake to public production.",
    href: "/athlynxai-apps",
    icon: AppWindow,
    pillar: "intelligence",
    status: "Live",
    testId: "card-app-athlynxai-apps",
  },
  {
    title: "AI Recruiter",
    copy: "Recruiting intelligence that reads the verified profile and the season layer at the same time.",
    href: "/ai-recruiter",
    icon: Brain,
    pillar: "intelligence",
    status: "Beta",
    testId: "card-app-ai-recruiter",
  },
  {
    title: "AI Scouting Report",
    copy: "Auto-built scouting reports anchored to verified performance data and approved film.",
    href: "/ai-scouting-report",
    icon: ClipboardCheck,
    pillar: "intelligence",
    status: "Beta",
    testId: "card-app-ai-scouting",
  },
  {
    title: "AI Training Bot",
    copy: "Personalized training plans wired to the athlete's profile, sport, and competition calendar.",
    href: "/ai-training-bot",
    icon: Bot,
    pillar: "intelligence",
    status: "Beta",
    testId: "card-app-ai-training-bot",
  },
  {
    title: "AI Content",
    copy: "Content engine for approved, consent-gated athlete stories and brand-safe distribution.",
    href: "/ai-content",
    icon: Sparkles,
    pillar: "intelligence",
    status: "Beta",
    testId: "card-app-ai-content",
  },
  // ── Media Lane ─────────────────────────────────────────────────────────
  {
    title: "The Athlete's Playbook",
    copy: "The flagship podcast and content lane. Athlete-first stories from the field, the locker room, and the family table.",
    href: "/athlete-playbook",
    icon: Mic,
    pillar: "media",
    status: "Live",
    testId: "card-app-playbook",
  },
  {
    title: "MediaOS · AXN",
    copy: "Approved stories, episodes, recruiting packets, and NIL content move into distribution only after vault and consent gates pass.",
    href: "/media-os",
    icon: Trophy,
    pillar: "media",
    status: "Operating",
    testId: "card-app-mediaos",
  },
  {
    title: "Studio Suite",
    copy: "Production, editing, and publishing surface for the AthlynX content and podcast stack.",
    href: "/studio-suite",
    icon: AppWindow,
    pillar: "media",
    status: "Live",
    testId: "card-app-studio-suite",
  },
  {
    title: "Social Command Center",
    copy: "Approved distribution across social channels — one identity, one consent record, one log.",
    href: "/social-command-center",
    icon: Compass,
    pillar: "media",
    status: "Live",
    testId: "card-app-social-command",
  },
  // ── Season Lane ────────────────────────────────────────────────────────
  {
    title: "Brackets",
    copy: "Live bracket intelligence — the competition layer behind College World Series 2026 and the seasonal calendar.",
    href: "/brackets",
    icon: Trophy,
    pillar: "season",
    status: "Live",
    testId: "card-app-brackets",
  },
  {
    title: "College World Series 2026",
    copy: "The 2026 CWS surface — schedule, brackets, athlete profiles, and approved stories from the road.",
    href: "/college-world-series-2026",
    icon: Trophy,
    pillar: "season",
    status: "Live",
    testId: "card-app-cws-2026",
  },
  {
    title: "Transfer Portal Intelligence",
    copy: "Verified signal on portal entries, fits, and program reads — anchored to the athlete profile.",
    href: "/transfer-portal-intelligence",
    icon: Brain,
    pillar: "season",
    status: "Beta",
    testId: "card-app-transfer-portal",
  },
  // Diamond Grind IQ is defined at the top of this array as the flagship.
];

const STATUS_STYLES: Record<AppCard["status"], string> = {
  Live: "bg-[#1E90FF]/15 text-[#1E90FF] border-[#1E90FF]/40",
  Beta: "bg-white/5 text-white/70 border-white/20",
  Operating: "bg-[#1E90FF]/10 text-[#88a8ff] border-[#1E90FF]/30",
};

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Ecosystem() {
  return (
    <div className="min-h-screen bg-black text-white" data-testid="page-ecosystem-2026">
      <UnifiedNav />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#1E90FF]/20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(30,144,255,0.18) 0%, transparent 55%), radial-gradient(circle at 80% 60%, rgba(30,144,255,0.10) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-5 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E90FF]/40 bg-[#1E90FF]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E90FF]" />
            Ecosystem · 2026
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
            One identity.<br />
            <span className="text-[#1E90FF]">Every athlete.</span>{" "}
            <span className="text-white">Every platform.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-white/70 text-base md:text-lg leading-relaxed">
            The AthlynX 2026 Ecosystem is the canonical map of how the
            platform works end to end — identity, NIL, intelligence, media,
            and the season layer. Five lanes. One profile underneath. Every
            link below routes to a real, shipping page.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/real-athlete-profile-flow"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1E90FF] px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-[#1E90FF]/90 transition"
              data-testid="link-hero-profile"
            >
              Start with the Profile <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/athlynxai-os"
              className="inline-flex items-center gap-2 rounded-xl border border-[#1E90FF]/40 px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:border-[#1E90FF] hover:text-[#1E90FF] transition"
              data-testid="link-hero-os"
            >
              See the Operating Layer
            </Link>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
          <div className="mb-10">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
              The Five Lanes
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">
              How the ecosystem actually rolls up.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {PILLARS.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-white/10 bg-black/60 p-5 hover:border-[#1E90FF]/50 transition"
                data-testid={`pillar-${p.id}`}
              >
                <div className="text-[9px] font-black uppercase tracking-[0.22em] text-[#1E90FF] mb-2">
                  {p.label}
                </div>
                <h3 className="text-base font-black text-white tracking-tight mb-2 leading-snug">
                  {p.headline}
                </h3>
                <p className="text-[12.5px] text-white/65 leading-relaxed">
                  {p.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPS GRID — grouped by pillar for readability */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-14 md:py-20 space-y-14">
          {PILLARS.map((pillar) => {
            // Flagship app sorts to the top of its pillar grouping.
            const apps = APPS.filter((a) => a.pillar === pillar.id).sort(
              (a, b) => Number(b.flagship ?? false) - Number(a.flagship ?? false),
            );
            if (apps.length === 0) return null;
            return (
              <div key={pillar.id} data-testid={`section-${pillar.id}`}>
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
                    {pillar.label}
                  </span>
                  <span className="flex-1 h-px bg-[#1E90FF]/20" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    {apps.length} {apps.length === 1 ? "surface" : "surfaces"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {apps.map((app) => {
                    const Icon = app.icon;
                    return (
                      <Link
                        key={app.title}
                        href={app.href}
                        className={
                          app.flagship
                            ? "group block rounded-xl border-2 border-[#1E90FF] bg-gradient-to-b from-[#1E90FF]/10 to-black p-5 shadow-lg shadow-[#1E90FF]/20 hover:shadow-[#1E90FF]/40 transition"
                            : "group block rounded-xl border border-white/10 bg-black/60 p-5 hover:border-[#1E90FF]/60 transition"
                        }
                        data-testid={app.testId}
                      >
                        {app.flagship && (
                          <div className="-mt-2 -mx-2 mb-3 inline-flex items-center gap-1.5 rounded-md bg-[#1E90FF] px-2 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-white">
                            <span>★</span> Flagship · #1
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E90FF]/10 ring-1 ring-[#1E90FF]/30 text-[#1E90FF] group-hover:bg-[#1E90FF]/20 transition">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span
                            className={`text-[9px] font-black uppercase tracking-[0.22em] px-2 py-0.5 rounded border ${STATUS_STYLES[app.status]}`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white tracking-tight mb-1 leading-snug">
                          {app.title}
                        </h3>
                        <p className="text-[12.5px] text-white/65 leading-relaxed">
                          {app.copy}
                        </p>
                        <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#88a8ff] group-hover:text-[#1E90FF] transition">
                          Open surface <ArrowRight className="h-3 w-3" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OPERATING PRINCIPLES — the doctrine the ecosystem enforces */}
      <section className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-5 py-14 md:py-20">
          <div className="mb-8">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
              Operating Doctrine · 2026
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">
              The rules every lane is built on.
            </h2>
          </div>
          <ul className="space-y-3">
            {[
              "One identity per athlete. The Real Athlete Profile is the canonical record — youth through pro, every sport.",
              "Private by default. Raw intake, media, and proof live in the vault. Public placement is earned through consent and review.",
              "Consent is the gate. No NIL deal, no public story, no distribution move without an approved consent record on the profile.",
              "Verification before broadcast. AthlynXAI verifies media, facts, and identity before anything reaches the public layer.",
              "One data layer. AI Recruiter, Scouting, Training, Content, and Sales all read from the same verified profile and the same season signal.",
              "Distribution is a controlled rail. AXN, Playbook, Studio, and Social Command move approved material only — no exceptions.",
            ].map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/40 p-4"
                data-testid={`doctrine-${i}`}
              >
                <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1E90FF]/15 text-[10px] font-black text-[#1E90FF]">
                  {i + 1}
                </span>
                <p className="text-[13px] text-white/75 leading-relaxed">{line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA BAND */}
      <section>
        <div className="max-w-5xl mx-auto px-5 py-14 md:py-20">
          <div className="rounded-2xl border border-[#1E90FF]/30 bg-gradient-to-b from-[#1E90FF]/10 to-black p-7 md:p-10">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF] mb-3">
              Built for every athlete · 2026
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mb-3">
              The platform is the product. The athlete is the customer.
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl">
              AthlynX 2026 is one ecosystem with five lanes, one identity, and
              one operating doctrine. Start at the profile. Move through NIL.
              Let the intelligence and media layers do the work. The season
              proves it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E90FF] px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-[#1E90FF]/90 transition"
                data-testid="link-cta-signup"
              >
                Create the Profile <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1E90FF]/40 px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:border-[#1E90FF] hover:text-[#1E90FF] transition"
                data-testid="link-cta-team"
              >
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <UnifiedFooter />
    </div>
  );
}
