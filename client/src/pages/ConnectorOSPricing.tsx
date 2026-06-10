/**
 * AthlynX — CONNECTOR OS PRICING
 * Dual-sided fee model: operator pays + end user pays.
 * Build 11 — May 12, 2026
 */
import DocPage, { DocH2, DocH3, DocList, DocCallout } from "./_DocPage";

export default function ConnectorOSPricing() {
  return (
    <DocPage
      eyebrow="Connector OS · Pricing"
      title="Dual-Sided Fees. Both Sides Pay."
      subtitle="Operators pay to ride the rail. End users pay to use the rail. We sit in the middle and meter every flow."
      closer="Iron Sharpens Iron — Proverbs 27:17"
    >
      <DocH2>Side A — Operator Tiers</DocH2>
      <p>Companies that license the Connector OS to run their vertical.</p>

      <div className="grid md:grid-cols-2 gap-4 my-8">
        <div className="border border-white/10 rounded-lg p-5 bg-white/5">
          <div className="text-xs text-[#00c2ff] uppercase tracking-widest">Tier 1</div>
          <div className="text-3xl font-bold mt-1">$99 / mo</div>
          <div className="text-white font-semibold mt-2">Solo</div>
          <p className="text-white/60 text-sm mt-2">1 operator seat. 10K API calls/mo. Stripe + 3 connectors. Community support.</p>
        </div>
        <div className="border border-[#00c2ff]/40 rounded-lg p-5 bg-[#00c2ff]/5">
          <div className="text-xs text-[#00c2ff] uppercase tracking-widest">Tier 2</div>
          <div className="text-3xl font-bold mt-1">$499 / mo</div>
          <div className="text-white font-semibold mt-2">Lightning</div>
          <p className="text-white/60 text-sm mt-2">5 seats. 100K API calls/mo. All 17+ connectors. Custom branding. Email support.</p>
        </div>
        <div className="border border-[#0066ff]/40 rounded-lg p-5 bg-[#0066ff]/5">
          <div className="text-xs text-[#00c2ff] uppercase tracking-widest">Tier 3</div>
          <div className="text-3xl font-bold mt-1">$2,499 / mo</div>
          <div className="text-white font-semibold mt-2">Network Node</div>
          <p className="text-white/60 text-sm mt-2">25 seats. 1M API calls/mo. Dedicated subdomain. White-label. Priority routing.</p>
        </div>
        <div className="border border-white/10 rounded-lg p-5 bg-white/5">
          <div className="text-xs text-[#00c2ff] uppercase tracking-widest">Tier 4</div>
          <div className="text-3xl font-bold mt-1">Custom</div>
          <div className="text-white font-semibold mt-2">Enterprise</div>
          <p className="text-white/60 text-sm mt-2">Unlimited seats. Volume API pricing. Dedicated infra on Nebius. Co-branded.</p>
        </div>
      </div>

      <DocH2>Side B — End User Fees</DocH2>
      <p>Riders on operator platforms pay metered fees that flow back through our rail.</p>

      <DocList items={[
        <><strong className="text-white">Transaction fee:</strong> 0.5% + $0.05 on every Stripe payment processed through the engine.</>,
        <><strong className="text-white">Credit margin:</strong> 15% margin on AI credits resold to end users (Nebius compute marked up to operator, operator marks up to user, we earn the spread).</>,
        <><strong className="text-white">Premium AI actions:</strong> $0.05 – $1.00 per scout report, recruiting query, NIL valuation, content render.</>,
        <><strong className="text-white">Syndication:</strong> $0.02 per cross-platform social post (private syndication rail).</>,
      ]} />

      <DocH2>Year 1 Conservative ARR</DocH2>
      <DocCallout accent="blue">
        <p className="text-white text-lg">
          <strong>$509K bootstrappable.</strong> Side A: $329K (operator subscriptions).
          Side B: $180K (end-user metered). No outside capital required.
        </p>
      </DocCallout>

      <DocH2>Why Both Sides Work</DocH2>
      <DocList items={[
        "Operators get instant infrastructure — they ship vertical SaaS in days, not 18 months.",
        "End users get a richer experience because the operator can spend on features instead of plumbing.",
        "We get compounding volume — every operator we sign multiplies the end-user fee surface.",
        "Switching cost is high — once 17+ connectors are wired through our engine, no one rebuilds it.",
      ]} />

      <DocH2>Cross-References</DocH2>
      <DocList items={[
        <a href="/connector-os/thesis" className="text-[#00c2ff] hover:underline">Connector OS Thesis</a>,
        <a href="/connector-os/layer-cake" className="text-[#00c2ff] hover:underline">Layer Cake Vision</a>,
      ]} />
    </DocPage>
  );
}
