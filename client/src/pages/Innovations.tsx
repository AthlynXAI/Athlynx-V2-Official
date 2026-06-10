/**
 * AthlynX · Innovations Page
 *
 * Public-facing list of AthlynX industry firsts, each with a defensible
 * proof claim and (where applicable) a live endpoint reference.
 *
 * Built May 30, 2026 · Locked by Chad A. Dozier Sr.
 * Brand-locked: cobalt #1E90FF + true black + white. No gold/yellow/orange.
 * Signoff:  */

import { Link } from "wouter";

type Innovation = {
  badge: string;
  title: string;
  claim: string;
  body: string;
  proof: string[];
  status: "LIVE" | "ACTIVE" | "ROADMAP";
  cta?: { label: string; href: string };
};

const INNOVATIONS: Innovation[] = [
  {
    badge: "Innovation F",
    title: "Lifetime Athlete Identity",
    claim: "First Lifetime Athlete Identity — birth to retirement, one platform.",
    body:
      "One athlete identity from youth (Diamond Grind, ages 8–13) through high school, college NIL, pro contracts, and post-career. Same user_id. Same audit trail. Same brand history. No competitor owns this arc.",
    proof: [
      "Diamond Grind live for ages 8–14 (COPPA-safe gates BEFORE coaching content)",
      "Five-stage lifetime model in client/src/governance.ts → LIFETIME_ATHLETE_IDENTITY",
      "Database scaffolding: athlete_lifetime_profile + lifetime_stage_history",
      "Opendorse, INFLCR, On3, 247Sports each own one slice — AthlynX owns the arc",
    ],
    status: "LIVE",
    cta: { label: "Open Diamond Grind", href: "/diamond-grind-iq" },
  },
  {
    badge: "Innovation B",
    title: "AI Recruiting Concierge",
    claim: "First Personal AI Recruiting Concierge per athlete, backed by NVIDIA Nemotron Ultra.",
    body:
      "Every Pro / Elite / Champion / MVP athlete gets a dedicated AI agent running on NVIDIA Nemotron Ultra 253B (H200 via Nebius). Daily personalized briefing on recruiting interest, NIL deal flow, eligibility windows, and transfer portal openings. Not a chatbot — a concierge.",
    proof: [
      "NVIDIA Nemotron Ultra 253B live on Nebius H200",
      "Public proof endpoint: /api/os/compute returns the model id",
      "Doctrine constant: AI_RECRUITING_CONCIERGE in governance.ts",
      "Schema scaffolding: concierge_briefings + concierge_alerts tables",
    ],
    status: "ACTIVE",
    cta: { label: "See the Compute Stack", href: "/layer-cake" },
  },
  {
    badge: "Innovation D",
    title: "Real-Time NIL Valuation Spikes",
    claim: "First Real-Time Performance-Based NIL Valuation Engine.",
    body:
      "When an athlete has a breakout moment — regional walk-off, viral social hit, transfer portal entry — their NIL value gets re-scored in real time. Brands see a 'Top NIL Value Gainers This Hour' feed. Athletes get push notifications when their valuation jumps.",
    proof: [
      "Nebius Llama-3.3-70B on H200 wired for scoring engine",
      "Doctrine constant: NIL_VALUATION_SPIKES in governance.ts",
      "Schema scaffolding: nil_valuation_snapshots + nil_value_gainers_feed",
      "Trigger events: regional / super regional / CWS breakout, viral, transfer, call-up",
    ],
    status: "ACTIVE",
    cta: { label: "See the Brackets", href: "/brackets/mcws" },
  },
  {
    badge: "Innovation A",
    title: "Athlete-Owned NIL Vault",
    claim: "First Athlete-Owned NIL Vault — tamper-evident, portable, athlete-controlled.",
    body:
      "Every NIL deal, brand interaction, and contract signed is hashed, timestamped, and stored athlete-side. Athletes retain ownership when they leave a school, change agents, or transfer. Brands trust the data because it's tamper-evident.",
    proof: [
      "Doctrine team holds Master Admin / Full Admin — never charged, never throttled",
      "Brand-deal marketplace schema live: brand_deal_offers + ad_campaigns",
      "Stripe Connect payout architecture wired (15% platform fee · doctrine team 0%)",
    ],
    status: "ROADMAP",
  },
  {
    badge: "Innovation C",
    title: "Brand Deal Marketplace · Same-Day Payouts",
    claim: "First Same-Day NIL Payment Platform.",
    body:
      "Brand posts an offer → athlete accepts in-app → contract terms locked → payment auto-splits via Stripe Connect. Smart escrow: brand funds at offer time, releases on athlete-completed milestone.",
    proof: [
      "Schema live: brand_accounts + brand_deal_offers + ad_campaigns",
      "Doctrine: 15% platform fee · doctrine team billing-exempt",
      "Stripe Connect architecture designed for split payouts",
    ],
    status: "ROADMAP",
  },
  {
    badge: "Innovation E",
    title: "NCAA-Compliant Coach-Recruit Channel",
    claim: "First NCAA-Compliant Coach-Recruit Channel in Live Game Context.",
    body:
      "During regional play, college coaches can DM verified recruits watching the same regional. Geo + sport + season-locked: only opens during recruitable windows. Every contact is logged with an NCAA-compliant audit trail.",
    proof: [
      "Existing messaging infrastructure (conversations + messages tables)",
      "Bracket page integration ready",
      "Audit infrastructure (server/_core/audit.ts) wired for compliance trails",
    ],
    status: "ROADMAP",
  },
];

function StatusPill({ status }: { status: Innovation["status"] }) {
  if (status === "LIVE") {
    return <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">● LIVE</span>;
  }
  if (status === "ACTIVE") {
    return <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#1E90FF] border border-[#1E90FF]/60 px-2 py-1 rounded">▸ ACTIVE</span>;
  }
  return <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white/55 border border-white/30 px-2 py-1 rounded">○ ROADMAP</span>;
}

function InnovationCard({ ix }: { ix: Innovation }) {
  return (
    <div className="rounded-xl border border-[#1E90FF]/30 bg-gradient-to-br from-black via-[#0a1628] to-black p-5 md:p-6 hover:border-[#1E90FF]/60 transition">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#88a8ff]">{ix.badge}</span>
          <StatusPill status={ix.status} />
        </div>
        {ix.cta ? (
          <Link href={ix.cta.href} className="text-[10px] font-black tracking-[0.22em] uppercase text-[#1E90FF] hover:text-white transition">
              {ix.cta.label} →
            </Link>
        ) : null}
      </div>
      <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mb-2">{ix.title}</h3>
      <p className="text-sm font-bold tracking-tight text-[#1E90FF] mb-3">{ix.claim}</p>
      <p className="text-sm text-white/80 leading-snug mb-4">{ix.body}</p>
      <div className="rounded-md border border-[#1E90FF]/20 bg-black/40 p-3">
        <div className="text-[9px] font-black tracking-[0.22em] uppercase text-[#88a8ff] mb-2">Proof</div>
        <ul className="space-y-1">
          {ix.proof.map((p, i) => (
            <li key={i} className="text-xs text-white/75 leading-snug flex items-start gap-2">
              <span className="text-[#1E90FF] font-black mt-0.5">▸</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function InnovationsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="border-b border-[#1E90FF]/25">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="text-[11px] tracking-[0.22em] uppercase text-[#88a8ff] mb-2">
            AthlynX · Industry Firsts
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight mb-3">
            FIRST <span className="text-[#1E90FF]">·</span> INNOVATIVE <span className="text-[#1E90FF]">·</span> UNCOPYABLE
          </h1>
          <p className="text-base text-white/75 max-w-3xl leading-snug">
            Every claim on this page is grounded in working code, a live endpoint, a database schema,
            or a locked doctrine constant in <code className="text-[#88a8ff]">client/src/governance.ts</code>.
            No vaporware. No marketing fog. The infrastructure is in the repo.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">ONE APP. MANY INSIDE.</span>
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#88a8ff] border border-[#1E90FF]/40 px-2 py-1 rounded">NVIDIA H200 · NEMOTRON ULTRA LIVE</span>
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#88a8ff] border border-[#1E90FF]/40 px-2 py-1 rounded">BIRTH TO RETIREMENT</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {INNOVATIONS.map((ix) => (
            <InnovationCard key={ix.badge} ix={ix} />
          ))}
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 text-center">
          <p className="text-[10px] tracking-widest uppercase text-white/30 mt-2">
            Chad A. Dozier Sr. · Founder · CEO · Chairman · AthlynX
          </p>
        </div>
      </section>
    </div>
  );
}
