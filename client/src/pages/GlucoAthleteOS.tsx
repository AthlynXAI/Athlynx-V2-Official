import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Database,
  HeartPulse,
  Lock,
  Shield,
  Stethoscope,
  Utensils,
  Zap,
} from "lucide-react";

const glucoseSeries = [118, 124, 132, 141, 136, 128, 112, 96, 84, 78, 92, 108];

const systemLayers = [
  {
    title: "Libre 3 Plus / CGM Intake",
    detail: "Read-only glucose stream design for Libre, Dexcom, Tidepool, Nightscout, Apple Health, and Google Health Connect once each connector is approved and consented.",
    icon: Activity,
  },
  {
    title: "Athlete Health Data Vault",
    detail: "Time-series glucose, meals, insulin logs, symptoms, workouts, sleep, hydration, emergency contacts, consent records, and audit logs in one athlete profile.",
    icon: Database,
  },
  {
    title: "Fuel Bot Guidance",
    detail: "Nutrition, hydration, recovery, and practice-readiness prompts that support the care plan without replacing doctors, dietitians, parents, or clinicians.",
    icon: Utensils,
  },
  {
    title: "Safety Alert Engine",
    detail: "Low, high, rapid-change, stale-data, and sensor-loss awareness workflows for athlete, parent, trainer, and clinician-facing review. Emergency decisions stay with caregivers, clinicians, and emergency services.",
    icon: AlertTriangle,
  },
  {
    title: "Clinician-Documented Care Plan",
    detail: "Insulin scale or pump information is documented only from a qualified clinician's plan. Direct dosing or pump control stays on the regulated roadmap.",
    icon: Stethoscope,
  },
  {
    title: "Nebius + OpenAI Intelligence",
    detail: "Nebius powers scalable AI workloads and secure inference. OpenAI supports explainable summaries, athlete education, and provider-ready reports.",
    icon: Brain,
  },
];

const alerts = [
  { label: "Current glucose", value: "92 mg/dL", status: "Practice recovery", tone: "text-emerald-300" },
  { label: "Trend", value: "Rising slowly", status: "Fuel response detected", tone: "text-cyan-300" },
  { label: "Data freshness", value: "1 minute", status: "Primary device still required", tone: "text-blue-200" },
  { label: "Escalation", value: "Parent + trainer", status: "Consent-controlled", tone: "text-amber-200" },
];

const roadmap = [
  ["Now", "Founder-tested LibreView proof, demo CGM stream, athlete dashboard, consent screen, Fuel Bot prompts, alert scenarios, provider summary, and universal BioSignal Channel skeleton."],
  ["Next", "Approved Libre/Dexcom routes, Apple Health, Garmin, WHOOP, Oura, hydration, heat, cardiac, oxygen, brain, blood-flow, and recovery adapter lanes."],
  ["Regulated", "AthlynX Medical clinical validation, regulated decision support, pump interoperability, quality system, FDA pathway, post-market monitoring, and biomedical/robotics partner rails."],
];

const ecosystemLegs = [
  { code: "AthlynX", label: "Parent Athlete OS", detail: "The athlete operating system, account layer, recruiting, NIL, training, wellness, and data ownership hub." },
  { code: "AthlynXAI", label: "AI Operating Core", detail: "The intelligence layer for summaries, automation, vaults, agents, connectors, and Nebius/OpenAI infrastructure." },
  { code: "AXN", label: "Athlete Network", detail: "Media, podcast, recruiting visibility, sports network, and athlete storytelling lane." },
  { code: "AVN", label: "Athlete Vision Network", detail: "Video, computer vision, game film, highlights, AI clips, and future vision analytics." },
  { code: "AM", label: "AthlynX Medical", detail: "Founder-tested medical-performance lane for BioSignal OS, GlucoAthlete, safety monitoring, and regulated partner pathways." },
];

const channelSignals = ["Libre / CGM", "Dexcom", "Apple Health", "Garmin", "WHOOP", "Oura", "Heat + hydration", "Cardiac + oxygen", "Brain impact", "Blood-flow / NIRS", "Biomedical", "Robotics"];


function GlucoAthleteOSInner() {
  const points = glucoseSeries
    .map((value, index) => {
      const x = (index / (glucoseSeries.length - 1)) * 100;
      const y = 100 - ((value - 65) / 95) * 100;
      return `${x},${Math.max(8, Math.min(92, y))}`;
    })
    .join(" ");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06111f] via-[#0a1d35] to-[#123766] text-white">
      <header className="border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-black tracking-tight text-white">AthlynXAI OS v1</Link>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            <Link href="/digital-health" className="text-gray-300 hover:text-white">Digital Health</Link>
            <Link href="/fuel-bots" className="text-gray-300 hover:text-white">Fuel Bots</Link>
            <Link href="/athlete-playbook" className="text-gray-300 hover:text-white">The Athlete Playbook</Link>
            <Link href="/competition-readiness" className="rounded-xl bg-cyan-400 px-4 py-2 font-black text-[#07111f] hover:bg-cyan-300">Nebius Readiness</Link>
          </nav>
        </div>
      </header>

      <main className="px-4 py-12 md:py-16">
        <section className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
              <span className="mb-5 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1 text-sm font-black uppercase tracking-[0.24em] text-cyan-200">
              AthlynX Medical · Founder-Tested BioSignal OS
            </span>
            <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
              Medical BioSignal OS: invented from lived experience, tested by the founder, built for athlete early warning.
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl">
              GlucoAthlete is the first proof wedge inside AthlynX Medical: Chad A. Dozier Sr. used his own Libre/LibreView workflow to prove the athlete monitoring lane, then expanded it into a universal BioSignal Channel for glucose, heat, hydration, cardiac, oxygen, brain, blood-flow, recovery, biomedical, and robotics partner data. It is built to move fast without crossing the safety line: no medical advice, no diagnosis, no cure claim, no treatment direction, no emergency-response replacement, no unapproved insulin dosing, no pump control, and no substitute for the athlete's primary device, backup meter, caregivers, clinicians, athletic trainers, or emergency services.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#live-demo" className="rounded-xl bg-cyan-400 px-6 py-3 font-black text-[#07111f] transition hover:bg-cyan-300">
                View working demo surface
              </a>
              <a href="#safety" className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20">
                Review safety guardrails
              </a>
            </div>
          </div>

          <div id="live-demo" className="rounded-[2rem] border border-cyan-300/20 bg-black/35 p-5 shadow-2xl shadow-cyan-950/40">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Live demo state</p>
                <h2 className="text-3xl font-black">Practice Recovery</h2>
              </div>
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
                Safe Mode
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#071527] p-5">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <div className="text-6xl font-black text-white">92</div>
                  <div className="font-bold text-blue-200">mg/dL · rising slowly</div>
                </div>
                <HeartPulse className="h-12 w-12 text-cyan-300" />
              </div>
              <svg viewBox="0 0 100 100" className="h-40 w-full overflow-visible rounded-2xl bg-white/5 p-2" preserveAspectRatio="none">
                <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="#fbbf24" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="35" x2="100" y2="35" stroke="#60a5fa" strokeDasharray="4 4" strokeWidth="1" />
              </svg>
              <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm font-bold leading-relaxed text-amber-100">
                Safety note: AthlynXAI displays educational trend context only. The athlete must verify with the primary CGM device or backup meter, follow clinician instructions, and use caregivers, clinicians, or emergency services for urgent decisions.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-7xl rounded-[2rem] border border-cyan-300/25 bg-gradient-to-r from-cyan-400/15 via-blue-500/10 to-emerald-400/10 p-7 shadow-2xl shadow-cyan-950/40">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Universal BioSignal Channel</p>
          <h2 className="mt-2 text-3xl font-black md:text-5xl">One channel connects every device, every partner, every athlete safety signal.</h2>
          <p className="mt-4 max-w-5xl text-lg leading-relaxed text-blue-100">
            This is the AthlynX Medical connector layer: each sensor or partner becomes an adapter, and AthlynXAI normalizes the signal into consent, source, timestamp, lifecycle, alert state, escalation, and audit proof. LibreView is the founder-tested starting point; the channel is built to scale across the whole sports and medical-performance industry.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {channelSignals.map((signal) => (
              <span key={signal} className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-black text-cyan-100">{signal}</span>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-4">
          {alerts.map((item) => (
            <article key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-200">{item.label}</p>
              <h3 className={`mt-2 text-2xl font-black ${item.tone}`}>{item.value}</h3>
              <p className="mt-2 text-sm font-semibold text-gray-300">{item.status}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-14 max-w-7xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Baked into AthlynXAI OS v1</p>
              <h2 className="mt-2 text-3xl font-black md:text-5xl">AthlynX ecosystem legs</h2>
              <p className="mt-3 max-w-4xl text-blue-100">Pandora’s Box is now organized: AthlynX/AthlynXAI is the parent OS, AXN is the athlete network, AVN is the vision/video layer, and AM — AthlynX Medical — owns Medical BioSignal OS and the regulated safety roadmap.</p>
            </div>
            <Shield className="hidden h-14 w-14 text-cyan-300 md:block" />
          </div>
          <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {ecosystemLegs.map((leg) => (
              <article key={leg.code} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10 transition hover:border-cyan-300/40">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">{leg.code}</p>
                <h3 className="mt-2 text-xl font-black text-white">{leg.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{leg.detail}</p>
              </article>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {systemLayers.map((layer) => {
              const Icon = layer.icon;
              return (
                <article key={layer.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 transition hover:border-cyan-300/40">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10">
                    <Icon className="h-7 w-7 text-cyan-300" />
                  </div>
                  <h3 className="text-2xl font-black text-white">{layer.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-300">{layer.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="safety" className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/10 p-7">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-300" />
              <h2 className="text-3xl font-black">Build now</h2>
            </div>
            <p className="text-lg leading-relaxed text-emerald-50">
              Monitoring, alerting, Fuel Bot prompts, data freshness, consent, audit logs, emergency contacts, athlete/parent/coach/clinician views, and provider-ready summaries can be built as the first working layer.
            </p>
          </article>
          <article className="rounded-[2rem] border border-amber-300/20 bg-amber-400/10 p-7">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="h-8 w-8 text-amber-200" />
              <h2 className="text-3xl font-black">Regulated roadmap</h2>
            </div>
            <p className="text-lg leading-relaxed text-amber-50">
              Any direct insulin dose recommendation, sliding-scale instruction created by software, or pump-control capability must be handled as safety-critical clinical functionality with medical, legal, regulatory, cybersecurity, and validation review.
            </p>
          </article>
        </section>

        <section className="mx-auto mt-14 max-w-7xl rounded-[2rem] border border-emerald-300/20 bg-emerald-400/10 p-7">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-200">Tonight test route</p>
                        <h2 className="mt-2 text-3xl font-black md:text-5xl">API + MCP route is ready for read-only testing, and the universal channel is next.</h2>

          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-emerald-50">
            The first connector mirrors the Libre connected-app experience shown in your screenshots: create a code, connect the athlete, read the latest glucose state, evaluate alerts, and keep insulin decisions blocked unless they come from a clinician-approved care plan. The next connector layer expands the same pattern across Dexcom, Apple Health, Garmin, WHOOP, Oura, hydration, heat, cardiac, oxygen, brain, blood-flow, biomedical, and robotics partners.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <code className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-bold text-emerald-100">POST /api/glucoathlete/connections/create-code</code>
            <code className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-bold text-emerald-100">GET /api/glucoathlete/readings/latest</code>
            <code className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-bold text-emerald-100">GET /api/glucoathlete/readings/series</code>
            <code className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-bold text-emerald-100">GET /api/mcp/glucoathlete</code>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-7xl rounded-[2rem] border border-white/10 bg-black/30 p-7">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Nebius and OpenAI lanes</p>
          <h2 className="mt-2 text-3xl font-black md:text-5xl">Two folders, one operating system.</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-6">
              <Zap className="mb-4 h-9 w-9 text-cyan-300" />
              <h3 className="text-2xl font-black">Nebius lane</h3>
              <p className="mt-3 leading-relaxed text-blue-100">
                GPU training, real-time inference, time-series prediction, alert prioritization, secure model operations, and scalable Digital Health infrastructure.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-300/20 bg-blue-400/10 p-6">
              <Brain className="mb-4 h-9 w-9 text-blue-200" />
              <h3 className="text-2xl font-black">OpenAI lane</h3>
              <p className="mt-3 leading-relaxed text-blue-100">
                Explainable athlete education, care-plan summaries, report generation, non-prescriptive Fuel Bot language, and provider-ready weekly insights.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Roadmap</p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {roadmap.map(([phase, detail]) => (
              <article key={phase} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-2xl font-black text-white">{phase}</h3>
                <p className="mt-3 leading-relaxed text-gray-300">{detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default function GlucoAthleteOS() {
  return <RouteErrorBoundary><GlucoAthleteOSInner /></RouteErrorBoundary>;
}
