/**
 * /quantum  —  AthlynX Quantum-Ready Roadmap
 *
 * The world keeps changing. The mission does not.
 * Products, distribution, manufacturing — all different.
 * Values, core values — those things never change.
 *
 * This page lays out where AthlynX fits as the compute world bends toward quantum.
 */
import React from "react";

const GOLD = "#D4AF37";
const INK = "#0E0E0E";
const PAPER = "#F7F4EC";
const LINE = "#1A1A1A";

const PILLARS = [
  {
    h: "Quantum-Inspired Optimization, Today",
    b: "Realty matching, lineup construction, and recruiting fit are graph problems. We frame them so they will drop straight onto annealers and gate-based machines when latencies make sense — without changing the athlete experience.",
  },
  {
    h: "Post-Quantum Privacy",
    b: "Every athlete record, NIL deal, and letter we store assumes that today's encryption may not hold forever. We are moving toward post-quantum cryptography for long-term records, on the same timeline the federal standards do.",
  },
  {
    h: "Hybrid CPU / GPU / QPU Routing",
    b: "Our AI agents already split work across CPUs and GPUs. We are designing the agent layer so a third compute target — a quantum processor — slots in without rewriting the product. The athlete never sees the wires.",
  },
  {
    h: "Verifiable Provenance",
    b: "Highlight reels, recruiting letters, NIL contracts. The athlete should be able to prove what is theirs, when it was made, and that it was not tampered with. Quantum-resistant signatures are part of how we do that.",
  },
  {
    h: "Pattern Detection at the Edge of Complexity",
    b: "Some scouting problems are easy for classical computers. Some, like full-roster, full-season counterfactuals, are not. We are mapping which scouting questions belong on classical and which we are putting in the on-ramp for quantum.",
  },
];

function Section({
  bg = PAPER,
  fg = INK,
  eyebrow,
  children,
}: {
  bg?: string;
  fg?: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ background: bg, color: fg, padding: "96px 24px", borderTop: `1px solid ${LINE}22` }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: 24,
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

export default function Quantum() {
  return (
    <main style={{ background: PAPER, color: INK, minHeight: "100vh" }}>
      {/* HERO */}
      <Section bg={INK} fg={PAPER}>
        <div style={{ fontSize: 12, letterSpacing: 6, textTransform: "uppercase", color: GOLD, marginBottom: 32 }}>
          AthlynX · Quantum-Ready
        </div>
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 88,
            lineHeight: 1.02,
            fontWeight: 400,
            margin: 0,
            letterSpacing: -1.5,
          }}
        >
          The mission does not change.
          <br />
          <span style={{ color: GOLD }}>The compute will.</span>
        </h1>
        <div style={{ height: 40 }} />
        <p style={{ fontSize: 22, lineHeight: 1.5, maxWidth: 760 }}>
          Products, distribution, manufacturing — totally different than ten years ago.
          Values, core values — those things never change. As the world bends toward quantum
          computing, we are building AthlynX so the athlete never has to feel the wires move
          underneath them.
        </p>
      </Section>

      {/* WHY */}
      <Section eyebrow="Why We Are Saying This Out Loud">
        <h2
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 48,
            lineHeight: 1.1,
            fontWeight: 400,
            margin: 0,
            marginBottom: 24,
            letterSpacing: -0.5,
          }}
        >
          Because honest companies tell you where they are headed.
        </h2>
        <p style={{ fontSize: 20, lineHeight: 1.6 }}>
          We are not promising quantum supremacy. We are not promising a quantum chip in your phone.
          We are promising that AthlynX is being built so the next ten years of compute do not break the
          last ten years of an athlete's life. Privacy still works. Records still verify. Agents still help.
          That is the contract.
        </p>
      </Section>

      {/* FIVE PILLARS */}
      <Section eyebrow="The Five Pillars">
        <h2
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 48,
            lineHeight: 1.1,
            fontWeight: 400,
            margin: 0,
            marginBottom: 40,
            letterSpacing: -0.5,
          }}
        >
          How we are getting ready.
        </h2>
        {PILLARS.map((p, i) => (
          <div
            key={p.h}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr",
              gap: 24,
              padding: "32px 0",
              borderTop: `1px solid ${LINE}22`,
            }}
          >
            <div
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 40,
                color: GOLD,
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 28,
                  lineHeight: 1.2,
                  marginBottom: 12,
                }}
              >
                {p.h}
              </div>
              <p style={{ fontSize: 18, lineHeight: 1.55, color: "#3A3A3A", margin: 0 }}>{p.b}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* PROMISE */}
      <Section eyebrow="Our Promise" bg={INK} fg={PAPER}>
        <h2
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 56,
            lineHeight: 1.1,
            fontWeight: 400,
            margin: 0,
            marginBottom: 24,
          }}
        >
          The athlete never feels the wires move.
        </h2>
        <p style={{ fontSize: 20, lineHeight: 1.6 }}>
          When quantum compute arrives in production, your profile still loads. Your Top 5 still ranks.
          Your deals still close. The signatures on your letters still verify. The mission outlives
          the hardware.
        </p>
      </Section>

      {/* CLOSING */}
      <Section>
        <p
          style={{
            fontSize: 22,
            lineHeight: 1.5,
            color: "#3A3A3A",
            margin: 0,
            marginBottom: 32,
          }}
        >
          Built like a gift. Run like a business. Ready for whatever comes next.
        </p>
        <div
          style={{
            borderTop: `1px solid ${LINE}33`,
            paddingTop: 24,
            fontSize: 13,
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
