import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

const pillars = [
  {
    title: "AI Trainer",
    desc: "A judge-visible training assistant surface for sport-specific plans, preparation questions, NIL review prompts, coach outreach, and burnout support.",
    href: "/ai-trainer",
    cta: "Open AI Trainer",
    icon: "",
  },
  {
    title: "Mental Performance",
    desc: "A safe public doorway for athlete mindset, resilience, pressure management, and support resources without claiming clinical diagnosis or treatment.",
    href: "/mindset",
    cta: "Explore Mindset",
    icon: "",
  },
  {
    title: "Athlete Journey",
    desc: "A lifecycle surface that frames athlete development from high school through college, transfer decisions, professional opportunities, and legacy planning.",
    href: "/athlete-journey",
    cta: "View Journey",
    icon: "",
  },
  {
    title: "Wellness Resources",
    desc: "A privacy-first hub for recovery, nutrition, wellness planning, and athlete support workflows that can be wired to deeper data after approval.",
    href: "/wellness",
    cta: "Open Wellness",
    icon: "",
  },
];

const proofPoints = [
  "Nebius AI health endpoint is responding in production.",
  "The public AI Trainer surface is live and judge-visible.",
  "Athlete Journey is live as the lifecycle narrative surface.",
  "Health pages now avoid fake provider listings and unsupported medical claims.",
];

function MedicalInner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07111f] via-[#0b1b34] to-[#0f3460] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-white">AthlynX</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/home" className="text-gray-400 hover:text-white">Platform</Link>
            <Link href="/ai-trainer" className="text-gray-400 hover:text-white">AI Trainer</Link>
            <Link href="/athlete-journey" className="text-gray-400 hover:text-white">Athlete Journey</Link>
            <Link href="/medical" className="text-[#00C2FF] font-semibold">Digital Health</Link>
          </nav>
        </div>
      </header>

      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <section className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-[#1E90FF]/20 text-[#00C2FF] rounded-full text-sm font-semibold mb-4 border border-[#1E90FF]/30">
              DIGITAL HEALTH HUB
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-5">
              Athlete Health, Wellness, and <span className="text-[#00C2FF]">AI Support</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              A clean public doorway for Nebius judges and athletes to see how AthlynX connects AI training, mental performance, wellness resources, and the athlete lifecycle without overstating clinical or medical-device claims.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-5 mb-12">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-[#1E90FF]/30 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E90FF]/20 flex items-center justify-center text-3xl">
                    {pillar.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{pillar.title}</h2>
                    <p className="text-gray-300 leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
                <Link href={pillar.href} className="inline-flex items-center justify-center px-5 py-3 bg-[#1E90FF] text-[#07111f] font-bold rounded-xl hover:bg-[#1E90FF] transition-colors">
                  {pillar.cta}
                </Link>
              </div>
            ))}
          </section>

          <section className="bg-gradient-to-r from-[#1E90FF]/20 to-blue-500/10 rounded-2xl border border-[#1E90FF]/30 p-7 mb-12">
            <h2 className="text-2xl md:text-3xl font-black mb-4">What is verified today</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {proofPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 bg-black/20 rounded-xl p-4">
                  <span className="text-[#00C2FF] mt-0.5"></span>
                  <p className="text-gray-200">{point}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-5 mb-12">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-2">Privacy-first language</h3>
              <p className="text-gray-300">AthlynX uses HIPAA-aligned wording for public health surfaces until deeper compliance evidence is verified and approved.</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-2">No fake providers</h3>
              <p className="text-gray-300">The public hub avoids hardcoded doctor/provider cards and routes visitors toward real product surfaces and owner-approved next steps.</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-2">Phase 2 ready</h3>
              <p className="text-gray-300">Deeper AI/router wiring can begin only after Chad approves the next implementation phase.</p>
            </div>
          </section>

          <section className="text-center bg-black/25 rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl md:text-3xl font-black mb-3">Need the full platform?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Start with the public AI Trainer or athlete journey, then sign in when you are ready to manage your full AthlynX profile.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/ai-trainer" className="px-6 py-3 bg-[#1E90FF] text-[#07111f] font-bold rounded-xl hover:bg-[#1E90FF] transition-colors">Open AI Trainer</Link>
              <Link href="/signup" className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">Create Account</Link>
            </div>
          </section>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default function Medical() {
  return <RouteErrorBoundary><MedicalInner /></RouteErrorBoundary>;
}
