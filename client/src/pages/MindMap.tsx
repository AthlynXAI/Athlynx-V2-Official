/**
 * /mind-map  —  Mind Map x10
 *
 * Ten layers radiating out from the AthlynX core. Pure SVG, no libs.
 * Honors the doctrine: "People remember meaning, not features."
 * This page does not sell features. It shows the shape of the mission.
 */
import React from "react";

const GOLD = "#D4AF37";
const INK = "#0E0E0E";
const PAPER = "#F7F4EC";

const NODES = [
  { label: "The Athlete",      desc: "One identity, every platform." },
  { label: "Profile",          desc: "Real Me + Real AI Me." },
  { label: "Layer Cake",       desc: "Daily marketing machine." },
  { label: "Recruiting",       desc: "Top 5 schools + letters." },
  { label: "Brand Wall",       desc: "Deals and partners." },
  { label: "CRM",              desc: "Relationships honored." },
  { label: "Billing & Credits",desc: "Built like a gift. Run like a business." },
  { label: "Realty",           desc: "Homes for athletes on the move." },
  { label: "Network",          desc: "Coaches, family, fans." },
  { label: "Quantum",          desc: "Ready for what's next." },
];

const W = 1200;
const H = 1200;
const CX = W / 2;
const CY = H / 2;
const R = 460;
const NODE_R = 96;

export default function MindMap() {
  return (
    <main style={{ background: PAPER, color: INK, minHeight: "100vh", padding: "48px 16px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          AthlynX · Mind Map x10
        </div>
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 64,
            lineHeight: 1.05,
            fontWeight: 400,
            margin: 0,
            marginBottom: 8,
            letterSpacing: -1,
            textAlign: "center",
          }}
        >
          Ten layers. One mission.
        </h1>
        <p
          style={{
            fontFamily: "ui-sans-serif, system-ui, -apple-system",
            fontSize: 18,
            color: "#3A3A3A",
            margin: 0,
            marginBottom: 32,
            textAlign: "center",
            maxWidth: 760,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          The athlete is the hero. Every layer here radiates out from that one truth.
        </p>

        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
            {/* Background concentric rings */}
            {[1, 2, 3].map((i) => (
              <circle
                key={i}
                cx={CX}
                cy={CY}
                r={(R / 3) * i}
                fill="none"
                stroke="#00000010"
                strokeWidth={1}
              />
            ))}
            {/* Connectors */}
            {NODES.map((_, i) => {
              const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
              const x = CX + Math.cos(angle) * R;
              const y = CY + Math.sin(angle) * R;
              return (
                <line
                  key={`l-${i}`}
                  x1={CX}
                  y1={CY}
                  x2={x}
                  y2={y}
                  stroke="#0E0E0E22"
                  strokeWidth={1.2}
                />
              );
            })}
            {/* Center */}
            <circle cx={CX} cy={CY} r={140} fill={INK} />
            <circle cx={CX} cy={CY} r={140} fill="none" stroke={GOLD} strokeWidth={3} />
            <text
              x={CX}
              y={CY - 12}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize={28}
              fill={PAPER}
            >
              AthlynX
            </text>
            <text
              x={CX}
              y={CY + 22}
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui"
              fontSize={13}
              letterSpacing={2}
              fill={GOLD}
            >
              THE CORE
            </text>
            {/* Outer nodes */}
            {NODES.map((n, i) => {
              const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
              const x = CX + Math.cos(angle) * R;
              const y = CY + Math.sin(angle) * R;
              return (
                <g key={n.label}>
                  <circle cx={x} cy={y} r={NODE_R} fill={PAPER} stroke={INK} strokeWidth={2} />
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE_R}
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={1}
                    strokeDasharray="2 4"
                  />
                  <text
                    x={x}
                    y={y - 6}
                    textAnchor="middle"
                    fontFamily="Georgia, serif"
                    fontSize={18}
                    fill={INK}
                  >
                    {n.label}
                  </text>
                  <text
                    x={x}
                    y={y + 18}
                    textAnchor="middle"
                    fontFamily="ui-sans-serif, system-ui"
                    fontSize={11}
                    fill="#5A5A5A"
                  >
                    {n.desc}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div
          style={{
            marginTop: 56,
            paddingTop: 28,
            borderTop: "1px solid #00000022",
            fontSize: 13,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#6B6B6B",
            textAlign: "center",
          }}
        >
        </div>
      </div>
    </main>
  );
}
