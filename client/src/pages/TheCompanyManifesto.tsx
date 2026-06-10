import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

function TheCompanyManifestoInner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#06142b] to-[#020711] text-white">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-20">
        <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
          Chosen to build differently
        </div>
        <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tighter md:text-8xl">
          Not a me-too company.<br />
          <span className="text-cyan-300">The Company.</span>
        </h1>
        <p className="mt-8 max-w-4xl text-xl font-bold leading-relaxed text-white/75 md:text-2xl">
          AthlynXAI is founder-led, faith-forward, and different by design. We do not build to be accepted by the old category. We build the operating system that makes the old category answer to athletes, families, teams, brands, and every season of an athlete's life.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Different by Design", "The platform is intentionally built as one ecosystem, not scattered tools."],
            ["Founder-Led", "The operating doctrine comes from lived sports, family, faith, and execution."],
            ["Category-Defining", "AthlynX is built to be the athlete operating system, not another app in the pile."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
              <h2 className="mb-3 text-2xl font-black text-white">{title}</h2>
              <p className="leading-relaxed text-white/65">{body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/signup" className="rounded-2xl bg-cyan-300 px-8 py-4 text-lg font-black text-[#061120] transition hover:bg-white">
            Build With Us →
          </Link>
          <Link href="/athlynxai-os" className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-black text-white transition hover:bg-white/10">
            Open AthlynXAI OS
          </Link>
        </div>
        <p className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-white/45">
          Iron Sharpens Iron — Proverbs 27:17 · 
        </p>
      </main>
      <MobileBottomNav />
    </div>
  );
}

export default function TheCompanyManifesto() {
  return (
    <RouteErrorBoundary>
      <TheCompanyManifestoInner />
    </RouteErrorBoundary>
  );
}
