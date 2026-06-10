/**
 * AthlynX — BRAND DOCTRINE
 * Voice, color, posture, and rules of the brand.
 * Build 11 — May 12, 2026
 */
import DocPage, { DocH2, DocList } from "./_DocPage";

export default function DoctrineBrand() {
  return (
    <DocPage
      eyebrow="Doctrine · Brand"
      title="The Brand Doctrine."
      subtitle="What we sound like, what we look like, and what we will never do."
      closer="Iron Sharpens Iron — Proverbs 27:17"
    >
      <DocH2>Voice</DocH2>
      <DocList items={[
        <><strong className="text-white">Plainspoken.</strong> Short sentences. No corporate fog. No filler.</>,
        <><strong className="text-white">Earned.</strong> Every claim has receipts. We show the work.</>,
        <><strong className="text-white">Faithful.</strong> Closers in writing: "Iron Sharpens Iron" and ""</>,
        <><strong className="text-white">Not flashy.</strong> No exclamation points. No emojis on official pages. No hype.</>,
      ]} />

      <DocH2>Color Palette</DocH2>
      <div className="grid grid-cols-3 gap-3 my-6">
        <div className="border border-white/10 rounded-lg p-4 bg-[#050d1a]">
          <div className="w-full h-16 bg-[#050d1a] border border-white/20 rounded mb-2" />
          <div className="text-white text-sm font-bold">Navy</div>
          <code className="text-white/60 text-xs">#050d1a</code>
        </div>
        <div className="border border-white/10 rounded-lg p-4 bg-white/5">
          <div className="w-full h-16 bg-[#0066ff] rounded mb-2" />
          <div className="text-white text-sm font-bold">AthlynX Blue</div>
          <code className="text-white/60 text-xs">#0066ff</code>
        </div>
        <div className="border border-white/10 rounded-lg p-4 bg-white/5">
          <div className="w-full h-16 bg-[#00c2ff] rounded mb-2" />
          <div className="text-white text-sm font-bold">Lightning Cyan</div>
          <code className="text-white/60 text-xs">#00c2ff</code>
        </div>
      </div>
      <p className="text-white/70">No yellow. No gold. No purple. Navy + blue + cyan. Period.</p>

      <DocH2>Beta Watermark</DocH2>
      <p>
        Until July 1, 2026, every page carries the BETA banner. Athletes know they're shaping the
        platform. Feedback is the feature.
      </p>

      <DocH2>What We Will Never Do</DocH2>
      <DocList items={[
        "Use stock photos of athletes who aren't on the platform.",
        "Inflate user counts or fake testimonials.",
        "Hide pricing or bury fees.",
        "Bury the founder's name. The team is the trust.",
        "Use the words 'crush', 'kill', 'dominate' in copy about another platform. We win on the work.",
      ]} />

      <DocH2>Closers</DocH2>
      <p>
        Every commit, every notification, every official page closes with one of two postures:
      </p>
      <ul className="space-y-2 mt-3">
        <li className="text-[#00c2ff] font-bold tracking-widest uppercase text-sm">Iron Sharpens Iron — Proverbs 27:17</li>
      </ul>
    </DocPage>
  );
}
