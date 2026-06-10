/**
 * AthlynX — CONNECTOR OS LAYER CAKE
 * 9-layer vision of the licensable Connector OS.
 * Build 11 — May 12, 2026
 */
import DocPage, { DocH2, DocList, DocCallout } from "./_DocPage";

const LAYERS = [
  { n: 1, name: "Identity", desc: "Auth0, custom auth, Apple/Google/Email signin. Single sign-on for every operator-tenanted user." },
  { n: 2, name: "Money", desc: "Stripe Connect, escrow, NIL deals, credit ledger, subscription tiers, multi-currency." },
  { n: 3, name: "Compute", desc: "Nebius H200 GPU floor, AI inference routing, model load balancing, token metering." },
  { n: 4, name: "Communications", desc: "Slack, Outlook, Gmail+Calendar, Zoom, Meet, push notifications, SMS." },
  { n: 5, name: "Content", desc: "Posts, stories, highlight reels, podcast episodes, brand walls, AI scouting reports." },
  { n: 6, name: "Commerce", desc: "Athlete store, gear, NIL portal, partner deals, license agreements." },
  { n: 7, name: "Compliance", desc: "Audit logs, encrypted S3 backups, GDPR/CCPA, app store data safety, NIL state-by-state rules." },
  { n: 8, name: "Analytics", desc: "Build monitor, traffic ledger, customer events, founder follows, feedback votes." },
  { n: 9, name: "Brand", desc: "Multi-domain routing (13 domains live), white-label theming, custom subdomains for licensees." },
];

export default function ConnectorOSLayerCake() {
  return (
    <DocPage
      eyebrow="Connector OS · Layer Cake"
      title="The 9-Layer Stack."
      subtitle="Every layer is a connector category. Every connector is a revenue moment. Operators license the whole cake. End users taste every slice."
      closer="Iron Sharpens Iron — Proverbs 27:17"
    >
      <DocCallout accent="cyan">
        <p className="text-white">
          Engine Core verified live May 12, 2026: <strong>Stripe + Nebius + AthlynXAI OS</strong> —
          the three pieces every layer rides on.
        </p>
      </DocCallout>

      <DocH2>The Nine Layers</DocH2>
      <div className="space-y-3 my-6">
        {LAYERS.map(l => (
          <div key={l.n} className="border border-white/10 rounded-lg p-5 bg-white/5 hover:bg-white/10 transition">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#00c2ff]">{l.n}</span>
              <span className="text-xl font-bold text-white">{l.name}</span>
            </div>
            <p className="text-white/70 mt-2 text-sm leading-relaxed">{l.desc}</p>
          </div>
        ))}
      </div>

      <DocH2>How Layers Stack to Make Money</DocH2>
      <p>
        An operator signs up at the Lightning tier ($499/mo, Tier 2). They get all 9 layers configured to
        their vertical — say, esports. Their users transact through Stripe (Side B fee: 0.5%+$0.05),
        consume AI scouting reports (Side B fee: $0.10 each), and the operator markets across 5 connected
        social channels (Side B fee: $0.02 per syndicated post).
      </p>
      <p>
        That one operator drives ~$2,400 in dual-sided revenue in their first 30 days. We have capacity
        for 1,000+ operators on the current Nebius floor. The math compounds.
      </p>

      <DocH2>Cross-References</DocH2>
      <DocList items={[
        <a href="/connector-os/thesis" className="text-[#00c2ff] hover:underline">Connector OS Thesis</a>,
        <a href="/connector-os/pricing" className="text-[#00c2ff] hover:underline">Connector OS Pricing</a>,
        <a href="/doctrine/manifesto" className="text-[#00c2ff] hover:underline">Founding Manifesto</a>,
      ]} />
    </DocPage>
  );
}
