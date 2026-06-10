/**
 * AthlynX — CONNECTOR OS THESIS
 * Investor-ready narrative for the licensable Connector OS.
 * Build 11 — May 12, 2026
 */
import DocPage, { DocH2, DocH3, DocList, DocCallout } from "./_DocPage";

export default function ConnectorOSThesis() {
  return (
    <DocPage
      eyebrow="Connector OS · Thesis"
      title="One Platform. All Companies. Full Stack Connector OS."
      subtitle="We are the lightning network for the modern internet. We own the APIs and MCPs. We license the engine. We control the traffic. We charge both sides."
      closer="Iron Sharpens Iron — Proverbs 27:17"
    >
      <p>
        The world doesn't need another SaaS tool. It needs a <strong className="text-white">connector
        operating system</strong> — one rail that ties every API, every MCP server, every payments
        provider, every compute back-end into a single licensable engine.
      </p>
      <p>
        AthlynXAI is the first proof. We built it for sports. The same engine runs any vertical.
      </p>

      <DocH2>The Engine Core</DocH2>
      <p>
        Three pieces, verified live, May 12, 2026:
      </p>
      <DocList items={[
        <><strong className="text-white">Payments</strong> — private commerce rail, production-ready.</>,
        <><strong className="text-white">Private compute</strong> — Compute floor. $5,000 Startups credit approved May 3, 2026.</>,
        <><strong className="text-white">AthlynXAI OS</strong> — The brain. <code className="text-[#00c2ff]">athlynx.ai/api/health</code> returning 200 OK, v1.0.8-chameleon.</>,
      ]} />

      <DocH2>What We Own</DocH2>
      <DocList items={[
        "17+ connectors authenticated and bridged through a single Vercel env (Payments, Vercel, GitHub, Supabase, AWS, Notion, Airtable, Slack, Outlook, Gmail+Calendar, Meet, Zoom, Trello, Calendly, Facebook Pages, YouTube Data + Analytics, Photos, GMB, Cloud Vision).",
        "324 tRPC procedures wired across 39 specialized routers — every operation an operator needs.",
        "13 production domains pointing at one engine. One commit. Every brand updates simultaneously.",
        "A licensable layer cake — 9 vertical stacks (Identity, Money, Compute, Comms, Content, Commerce, Compliance, Analytics, Brand) — that any operator can plug into.",
      ]} />

      <DocH2>The Lightning Network Move</DocH2>
      <DocCallout accent="cyan">
        <p className="text-white">
          We are not a marketplace. We are not a directory. We are the <strong>traffic itself.</strong>
        </p>
      </DocCallout>
      <p>
        Every API call, every MCP tool invocation, every Payments transaction, every AI minute consumed —
        flows through our engine. We log it in <code className="text-[#00c2ff]">traffic_ledger</code>.
        We bill the operator. We bill the end user. Both sides pay. The volume compounds.
      </p>

      <DocH2>Why Now</DocH2>
      <DocList items={[
        "MCP standardization is happening — first mover wins the registry.",
        "Cross-app authentication is broken everywhere — we solved it once, license it forever.",
        "Compute costs are collapsing — margin on compute resale is real and expanding.",
        "Every vertical wants its own AI platform — but no one wants to build the plumbing.",
      ]} />

      <DocH2>Cross-References</DocH2>
      <DocList items={[
        <a href="/connector-os/pricing" className="text-[#00c2ff] hover:underline">Pricing model — dual-sided</a>,
        <a href="/connector-os/layer-cake" className="text-[#00c2ff] hover:underline">Layer Cake — the 9-stack vision</a>,
        <a href="/doctrine/manifesto" className="text-[#00c2ff] hover:underline">Founding Manifesto</a>,
      ]} />
    </DocPage>
  );
}
