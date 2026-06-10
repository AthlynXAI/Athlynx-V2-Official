/**
 * AthlynX — SMALL CIRCLE DOCTRINE
 * The founding five and the trust rules.
 * Build 11 — May 12, 2026
 */
import DocPage, { DocH2, DocList, DocCallout } from "./_DocPage";

export default function DoctrineSmallCircle() {
  return (
    <DocPage
      eyebrow="Doctrine · Small Circle"
      title="Small Circle. High Trust. Built by Four."
      subtitle="AthlynXAI was started by a handful of people who put their names on it before there was anything to gain. The doctrine is to keep the circle small until the platform can carry the weight."
      closer="Iron Sharpens Iron — Proverbs 27:17"
    >
      <DocH2>The Core Four</DocH2>
      <div className="grid md:grid-cols-2 gap-4 my-6">
        <a href="/chad" className="block border border-[#00c2ff]/40 rounded-lg p-5 bg-[#00c2ff]/5 hover:bg-[#00c2ff]/10 transition">
          <div className="text-xs text-[#00c2ff] uppercase tracking-widest">Founder &amp; CEO</div>
          <div className="text-xl font-bold text-white mt-1">Chad A. Dozier Sr.</div>
          <p className="text-white/60 text-sm mt-2">Built the vision, the doctrine, and the first 300 pages.</p>
        </a>
        <a href="/team/glenn-tse" className="block border border-white/10 rounded-lg p-5 bg-white/5 hover:bg-white/10 transition">
          <div className="text-xs text-[#00c2ff] uppercase tracking-widest">Co-Founder · CFO / COO</div>
          <div className="text-xl font-bold text-white mt-1">Glenn Tse</div>
          <p className="text-white/60 text-sm mt-2">Engineering discipline. Houston. November 2024.</p>
        </a>
        <a href="/team/lee-marshall" className="block border border-white/10 rounded-lg p-5 bg-white/5 hover:bg-white/10 transition">
          <div className="text-xs text-[#00c2ff] uppercase tracking-widest">Partner · Brand Director</div>
          <div className="text-xl font-bold text-white mt-1">Lee Marshall</div>
          <p className="text-white/60 text-sm mt-2">Athlete outreach, NIL partnerships, platform visibility.</p>
        </a>
      </div>

      <DocH2>The Trust Rules</DocH2>
      <DocList items={[
        "Build before you brag. Ship before you sell.",
        "Receipts in writing. Every promise has a paper trail.",
        "Equity earned is equity vested. No free rides.",
        "Family before features. Mother's Day shuts down the build.",
        "Disagreement out loud. Loyalty in private.",
        "Iron sharpens iron — we tell each other the truth even when it hurts.",
      ]} />

      <DocCallout accent="cyan">
        <p className="text-white text-lg italic">
          "If your circle is wider than your reach, the circle is the problem."
        </p>
      </DocCallout>
    </DocPage>
  );
}
