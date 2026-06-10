/**
 * AthlynX — FOUNDING MANIFESTO
 * The why behind AthlynXAI.
 * Build 11 — May 12, 2026
 */
import DocPage, { DocH2, DocCallout } from "./_DocPage";

export default function DoctrineManifesto() {
  return (
    <DocPage
      eyebrow="Doctrine · Founding Manifesto"
      title="Why AthlynXAI Exists."
      subtitle="A platform built by an athlete, for athletes. Founder-led, faith-forward, different by design, and not a me-too company. Backyard to billion-dollar deal. No middleman skim. No predatory advisor. No black-box AI. Just the engine, the truth, and the path."
      closer=""
    >
      <DocCallout accent="cyan">
        <p className="text-white text-lg italic">
          "Where the rubber meets the road, that's where we live."
        </p>
        <p className="text-white/60 text-sm mt-2">— Chad A. Dozier Sr., Founder &amp; CEO</p>
      </DocCallout>

      <DocH2>The Founder's Why</DocH2>
      <p>
        I played the game. I saw the sport from the dugout, the locker room, and the bus rides. I
        watched athletes get used by agents, traded away from their families, and dropped the moment
        the body stopped delivering returns. I watched parents get sold dreams that didn't ship.
      </p>
      <p>
        AthlynXAI is the platform I needed and didn't have.
      </p>
      <p>
        We are not a me-too company. We are different by design, chosen to build differently, and disciplined enough to become The Company for athletes, families, teams, brands, and every season of an athlete's life.
      </p>

      <DocH2>What We Promise the Athlete</DocH2>
      <p>
        From backyard to professional to retirement, every season has a page. Every page has the data,
        the tools, the people, and the protection an athlete needs. The athlete owns their data. The
        athlete sets the terms. The platform serves the athlete, not the other way around.
      </p>

      <DocH2>The Small Circle</DocH2>
      <p>
        We started with five — Chad, Glenn, Andy, Lee, and the family circle. That's the doctrine. Small
        circle. High trust. Build before you brag. Ship before you sell. Receipts in writing. Iron
        sharpens iron.
      </p>

      <DocH2>What We Will Never Be</DocH2>
      <p>
        We will not be a vanity metrics machine. We will not pretend to be a media company while we sell
        the athlete's data behind their back. We will not optimize for engagement at the cost of mental
        health. We will not ship a feature we haven't tested ourselves.
      </p>

      <DocH2>The Faith Behind the Code</DocH2>
      <p>
        Every commit closes with a verse or a posture. <strong>Iron Sharpens Iron — Proverbs 27:17.</strong>{" "}
        The work is the worship.
      </p>

      <DocH2>The Mission, Plainly</DocH2>
      <CalloutMission />
    </DocPage>
  );
}

function CalloutMission() {
  return (
    <DocCallout accent="blue">
      <p className="text-white text-lg leading-relaxed">
        Build one identity, every athlete, every platform. From the first travel-ball box score to the last NIL
        contract, from the high school highlight reel to the post-career second act — one platform that
        actually serves the athlete and the family that raised them.
      </p>
    </DocCallout>
  );
}
