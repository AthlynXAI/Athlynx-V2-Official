/**
 * AthlynX — CONNECTOR OS LANDING
 * Entry point at /os — gateway to thesis, pricing, layer cake.
 * Build 11 — May 12, 2026
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

function ConnectorOSLandingInner() {
  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      <header className="border-b border-white/10 bg-[#050d1a]/95 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-white">AthlynX</span>
            <span className="ml-2 text-xs uppercase tracking-widest text-[#00c2ff]">Connector OS</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-[#00c2ff] mb-4">
          Different by Design · Founder-Led · The Company
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          The Connector OS.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
          We are not a me-too company. We own the rail, license the engine, and build the category-defining operating system where operators ride, end users transact, and both sides pay.
          Built on Stripe + Nebius + AthlynXAI OS — proven live since May 2026.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-5">
          <Link href="/connector-os/thesis" className="block border border-[#00c2ff]/40 rounded-xl p-6 bg-[#00c2ff]/5 hover:bg-[#00c2ff]/10 transition">
            <div className="text-xs uppercase tracking-widest text-[#00c2ff]">Read</div>
            <div className="text-2xl font-bold mt-2">The Thesis</div>
            <p className="text-white/70 mt-3 text-sm leading-relaxed">
              Why we are the lightning network for the modern internet, and why we built it inside a
              sports platform first.
            </p>
            <div className="mt-4 text-[#00c2ff] text-sm">Read thesis →</div>
          </Link>

          <Link href="/connector-os/pricing" className="block border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition">
            <div className="text-xs uppercase tracking-widest text-[#00c2ff]">See</div>
            <div className="text-2xl font-bold mt-2">The Pricing</div>
            <p className="text-white/70 mt-3 text-sm leading-relaxed">
              Dual-sided fee model. Operator tiers $99 to enterprise. End-user metered fees on every
              transaction, credit, and AI action.
            </p>
            <div className="mt-4 text-[#00c2ff] text-sm">See pricing →</div>
          </Link>

          <Link href="/connector-os/layer-cake" className="block border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition">
            <div className="text-xs uppercase tracking-widest text-[#00c2ff]">Explore</div>
            <div className="text-2xl font-bold mt-2">The Layer Cake</div>
            <p className="text-white/70 mt-3 text-sm leading-relaxed">
              Nine layers — Identity, Money, Compute, Comms, Content, Commerce, Compliance, Analytics,
              Brand. Every layer is a revenue moment.
            </p>
            <div className="mt-4 text-[#00c2ff] text-sm">Explore layers →</div>
          </Link>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5 text-center">
          <div className="border border-white/10 rounded-lg p-5 bg-white/5">
            <div className="text-3xl font-bold text-[#00c2ff]">17+</div>
            <div className="text-white/70 mt-1 text-sm">Connectors authed and bridged</div>
          </div>
          <div className="border border-white/10 rounded-lg p-5 bg-white/5">
            <div className="text-3xl font-bold text-[#00c2ff]">324</div>
            <div className="text-white/70 mt-1 text-sm">tRPC procedures live</div>
          </div>
          <div className="border border-white/10 rounded-lg p-5 bg-white/5">
            <div className="text-3xl font-bold text-[#00c2ff]">13</div>
            <div className="text-white/70 mt-1 text-sm">Production domains, one engine</div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050d1a]">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#00c2ff]">
            Iron Sharpens Iron — Proverbs 27:17
          </p>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}

export default function ConnectorOSLanding() {
  return (
    <RouteErrorBoundary>
      <ConnectorOSLandingInner />
    </RouteErrorBoundary>
  );
}
