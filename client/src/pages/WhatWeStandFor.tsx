/**
 * /what-we-stand-for — AthlynX Brand Doctrine, public.
 *
 * This is not a marketing page. This is the spine.
 * Locked from Chad's brief, May 11, 2026.
 * "People remember meaning, not features."
 */
import React from "react";

const GOLD = "#D4AF37";
const INK = "#0E0E0E";
const PAPER = "#F7F4EC";
const LINE = "#1A1A1A";

function Section({
  eyebrow,
  children,
  bg = PAPER,
  fg = INK,
}: {
  eyebrow?: string;
  children: React.ReactNode;
  bg?: string;
  fg?: string;
}) {
  return (
    <section style={{ background: bg, color: fg, padding: "96px 24px", borderTop: `1px solid ${LINE}22` }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: 24,
              fontFamily: "ui-sans-serif, system-ui, -apple-system",
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

function H({ children, size = 56 }: { children: React.ReactNode; size?: number }) {
  return (
    <h2
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: size,
        lineHeight: 1.08,
        fontWeight: 400,
        margin: 0,
        marginBottom: 28,
        letterSpacing: -0.5,
      }}
    >
      {children}
    </h2>
  );
}

function P({ children, size = 20 }: { children: React.ReactNode; size?: number }) {
  return (
    <p
      style={{
        fontSize: size,
        lineHeight: 1.55,
        margin: 0,
        marginBottom: 20,
        fontFamily: "ui-sans-serif, system-ui, -apple-system",
        fontWeight: 400,
      }}
    >
      {children}
    </p>
  );
}

const VALUES = [
  {
    n: "01",
    h: "The athlete is the hero.",
    b: "AthlynX is never the protagonist. The kid in the backyard, the walk-on, the senior nobody recruited, the pro nobody saw coming, the retired vet starting over — they are the story.",
  },
  {
    n: "02",
    h: "Meaning over features.",
    b: "We do not market speed, tokens, or comparisons. We market the journey, the truth, the calling. People remember meaning, not features.",
  },
  {
    n: "03",
    h: "Built like a gift. Run like a business.",
    b: "The mission is sacred. The economics are honest. Both are non-negotiable.",
  },
  {
    n: "04",
    h: "Real beats polished.",
    b: "A man on a porch telling the truth beats a billion-dollar production every time.",
  },
  {
    n: "05",
    h: "ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.",
    b: "Youth to pro to retirement. We own the whole arc, because no one else has the courage to.",
  },
];

export default function WhatWeStandFor() {
  return (
    <main style={{ background: PAPER, color: INK, minHeight: "100vh" }}>
      {/* HERO */}
      <Section bg={INK} fg={PAPER}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: 40,
          }}
        >
          AthlynX · What We Stand For
        </div>
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 96,
            lineHeight: 1.02,
            fontWeight: 400,
            margin: 0,
            letterSpacing: -1.5,
          }}
        >
          People remember meaning,
          <br />
          <span style={{ color: GOLD }}>not features.</span>
        </h1>
        <div style={{ height: 48 }} />
        <P size={22}>
          Marketing is about values. The world is loud. We do not get many chances to be remembered.
          So we have to be clear about who we are and what we stand for.
        </P>
      </Section>

      {/* GOT MILK / NIKE LINEAGE */}
      <Section eyebrow="The Lineage">
        <H>Got Milk sold the absence. Nike honored the athlete.</H>
        <P>
          The dairy industry tried for twenty years to convince people that milk was good for them.
          Sales kept falling. Then they ran Got Milk — a campaign that does not even talk about the product.
          It talks about the absence of it. Sales turned around.
        </P>
        <P>
          The greatest marketing the world will ever see was Nike. Nike sells a commodity. They sell shoes.
          And yet when you think of Nike, you do not feel like you are thinking about a shoe company.
          Their ads never talked about the product. Nike honored great athletes. Nike honored great athletics.
          That is who they became. That is what has kept them going for generations.
        </P>
        <P>
          AthlynX stands in that lineage. The platform is the porch. The athlete is the story.
        </P>
      </Section>

      {/* THE ONE BELIEF */}
      <Section eyebrow="The One Belief We Repeat" bg={INK} fg={PAPER}>
        <H size={64}>
          The crazy ones who think they can change the world
          <br />
          <span style={{ color: GOLD }}>are the ones who do.</span>
        </H>
        <P size={22}>
          And the journey belongs to the athlete — not to the system that gets in their way.
        </P>
        <div style={{ height: 24 }} />
        <P size={14}>
          Famously said by Steve Jobs. Lived out by every athlete we are building this for.
        </P>
      </Section>

      {/* THE FIVE VALUES */}
      <Section eyebrow="Our Core Values">
        <H>Five things that never change.</H>
        <div style={{ marginTop: 40 }}>
          {VALUES.map((v) => (
            <div
              key={v.n}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: 32,
                padding: "32px 0",
                borderTop: `1px solid ${LINE}22`,
              }}
            >
              <div
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 48,
                  color: GOLD,
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                {v.n}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: 32,
                    lineHeight: 1.15,
                    marginBottom: 12,
                    fontWeight: 400,
                  }}
                >
                  {v.h}
                </div>
                <P size={18}>{v.b}</P>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* WHERE WE FIT */}
      <Section eyebrow="Where We Fit">
        <H>In a world of AI and tokens, we build for the athlete.</H>
        <P>
          A lot of things have changed. The market is a totally different place than it was a decade ago.
          Products, distribution, manufacturing — all different.
        </P>
        <P>
          What does not change is who we serve and why. AthlynX is the AI ecosystem for the athlete's
          journey — youth to pro to retirement. Built for the kid in the backyard. Built for the senior
          nobody recruited. Built for the pro signing the deal. Built for the retired vet starting over.
        </P>
        <P>
          We are not selling speeds. We are not selling tokens. We are honoring a journey.
        </P>
      </Section>

      {/* PROMISE */}
      <Section eyebrow="Our Promise" bg={INK} fg={PAPER}>
        <H size={48}>
          Built like a gift.
          <br />
          <span style={{ color: GOLD }}>Run like a business.</span>
        </H>
        <P size={20}>
          The mission is sacred. The economics are honest. We charge so we can scale. We scale so the
          mission outlives any one of us. Both parts matter. Neither one bends.
        </P>
      </Section>

      {/* CLOSING */}
      <Section>
        <H size={42}>People remember meaning, not features.</H>
        <P>
          That is why every page we build, every post our agents send, every product we ship has to
          pass one test first: does it honor the athlete, or does it sell a spec?
        </P>
        <P>
          If it honors the athlete, it ships. If it sells a spec, it gets rewritten or killed.
        </P>
        <div style={{ height: 56 }} />
        <div
          style={{
            borderTop: `1px solid ${LINE}33`,
            paddingTop: 28,
            fontSize: 14,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#6B6B6B",
          }}
        >
        </div>
      </Section>
    </main>
  );
}
