import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

const featureAreas = [
  {
    name: "Medical BioSignal OS",
    href: "/glucoathlete",
    desc: "Founder-tested breakthrough layer for athlete monitoring and early warning: glucose, heat, hydration, cardiac, oxygen, brain, blood-flow, recovery, and future biomedical/robotics devices connected through one AthlynXAI BioSignal Channel. Monitoring only; not diagnosis, treatment, cure, emergency response, insulin dosing, or pump control.",
    icon: "",
  },
  {
    name: "GlucoAthlete OS",
    href: "/glucoathlete",
    desc: "Libre-aware trend context, Fuel Bot support, and athlete wellness planning language. Not medical advice, diagnosis, treatment, emergency response, or a substitute for a primary CGM, meter, caregiver, clinician, or emergency services.",
    icon: "G",
  },
  {
    name: "Medical",
    href: "/medical",
    desc: "Privacy-first athlete health resources and future medical journey support.",
    icon: "",
  },
  {
    name: "Mental Health",
    href: "/mental-health",
    desc: "A protected lane for athlete mindset, pressure, burnout, and support workflows.",
    icon: "",
  },
  {
    name: "AI Trainer",
    href: "/ai-trainer",
    desc: "Personalized training, preparation, and athlete guidance behind the AthlynX account layer.",
    icon: "",
  },
  {
    name: "Trainer",
    href: "/trainer",
    desc: "A focused training doorway for workouts, schedules, and athlete performance routines.",
    icon: "",
  },
  {
    name: "Fuel Bots",
    href: "/fuel-bots",
    desc: "Nutrition and fueling workflows designed to support athlete preparation and recovery.",
    icon: "",
  },
  {
    name: "Wellness",
    href: "/wellness",
    desc: "Recovery, sleep, hydration, and wellness resources for the full athlete lifecycle.",
    icon: "",
  },
  {
    name: "Mindset",
    href: "/mindset",
    desc: "Mental performance, resilience, and confidence-building for athletes at every stage.",
    icon: "",
  },
];

function DigitalHealthInner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07111f] via-[#0b1b34] to-[#102a4f] text-white">
      <header className="border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-black tracking-tight text-white">AthlynX</Link>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            <Link href="/athlete-journey" className="text-gray-300 hover:text-white">Athlete Journey</Link>
            <Link href="/ai-trainer" className="text-gray-300 hover:text-white">AI Trainer</Link>
            <Link href="/signin" className="rounded-xl bg-[#1E90FF] px-4 py-2 font-black text-[#07111f] hover:bg-[#1E90FF]">Sign In</Link>
          </nav>
        </div>
      </header>

      <main className="px-4 py-16 md:py-20">
        <section className="mx-auto mb-14 max-w-5xl text-center">
          <span className="mb-5 inline-block rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/20 px-4 py-1 text-sm font-bold text-[#00C2FF]">
            DIGITAL HEALTH · ATHLETE LIFECYCLE
          </span>
          <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
            The founder-tested Medical BioSignal OS for athlete safety and performance.
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
            AthlynX now highlights Medical BioSignal OS as a core platform pillar: a founder-tested, device-agnostic monitoring channel born from Chad A. Dozier Sr.’s own Libre/LibreView workflow and built to protect athletes through early warning, consent, escalation, and partner-ready health intelligence. The language remains medically safe: educational and operational only, with clinicians, caregivers, primary devices, and emergency services retaining medical authority.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/glucoathlete" className="rounded-xl bg-[#1E90FF] px-6 py-3 font-black text-[#07111f] transition hover:bg-[#1E90FF]">
              View Medical BioSignal OS
            </Link>
            <Link href="/competition-readiness" className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20">
              Review Nebius readiness
            </Link>
            <Link href="/hipaa" className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20">
              Privacy-first posture
            </Link>
          </div>
        </section>

        <section className="mx-auto mb-10 max-w-7xl rounded-[2rem] border border-[#1E90FF]/30 bg-gradient-to-r from-[#1E90FF]/20 via-blue-500/10 to-emerald-400/10 p-7 text-left shadow-2xl shadow-cyan-950/30">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#00C2FF]">Platform Highlight · Founder Tested</p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">Medical BioSignal OS connects every athlete device through one universal channel.</h2>
          <p className="mt-4 max-w-5xl text-lg leading-relaxed text-blue-100">
            This is the competition-grade breakthrough: GlucoAthlete proves the wedge with Libre/LibreView, while the universal BioSignal Channel expands to Dexcom, Apple Health, Garmin, WHOOP, Oura, heat and hydration patches, cardiac and oxygen wearables, brain-impact systems, blood-flow/NIRS sensors, and future biomedical or robotics partners.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {["Founder tested", "LibreView proof", "Universal channel", "Human escalation"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 font-black text-[#00C2FF]">{item}</div>
            ))}
          </div>
        </section>

        <section className="mx-auto mb-14 grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureAreas.map((feature) => (
            <article key={feature.name} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 transition hover:border-[#1E90FF]/30">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E90FF]/20 text-3xl">{feature.icon}</div>
                <div>
                  <h2 className="text-2xl font-black text-white">{feature.name}</h2>
                  <p className="mt-2 leading-relaxed text-gray-300">{feature.desc}</p>
                </div>
              </div>
              <Link href={feature.href} className="inline-flex rounded-xl bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/20">
                Sign in to access yours
              </Link>
            </article>
          ))}
        </section>

        <section className="mx-auto mb-8 max-w-5xl rounded-2xl border border-blue-300/30 bg-blue-400/10 p-6 text-left">
          <h2 className="mb-3 text-2xl font-black text-[#00C2FF]">Medical Safety Boundary</h2>
          <p className="leading-relaxed text-[#00C2FF]/90">
            Medical BioSignal OS, GlucoAthlete OS, and all AthlynX digital health surfaces are not medical devices and do not provide medical advice, diagnosis, treatment, cure, emergency response, insulin dosing, pump control, or replacement for a CGM, meter, caregiver, clinician, athletic trainer, or emergency services. Any real health-data workflow must remain authenticated, consent-based, privacy-controlled, and reviewed before operational use.
          </p>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[#1E90FF]/30 bg-[#1E90FF]/20 p-6">
            <h3 className="mb-2 text-xl font-black">Privacy-first posture</h3>
            <p className="text-gray-300">Public language is HIPAA-aligned, not overstated as audited compliance. Private data belongs behind authenticated account access.</p>
          </div>
          <div className="rounded-2xl border border-[#1E90FF]/30 bg-[#1E90FF]/20 p-6">
            <h3 className="mb-2 text-xl font-black">No mock medical data</h3>
            <p className="text-gray-300">The public hub uses safe CTAs only. No fake doctors, injuries, records, ratings, or sample PHI appear on this surface.</p>
          </div>
          <div className="rounded-2xl border border-[#1E90FF]/30 bg-[#1E90FF]/20 p-6">
            <h3 className="mb-2 text-xl font-black">Competition ready</h3>
            <p className="text-gray-300">The public readiness surface explains Nebius Digital Health fit, OpenAI applied-AI fit, MVP proof, and responsible health-tech boundaries.</p>
          </div>
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default function DigitalHealth() {
  return <RouteErrorBoundary><DigitalHealthInner /></RouteErrorBoundary>;
}
