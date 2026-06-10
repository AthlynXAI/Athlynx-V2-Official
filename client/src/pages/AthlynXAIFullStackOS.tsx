import { Link } from "wouter";

// ─────────────────────────────────────────────────────────────────────────────
// AthlynXAI OS — Full Stack Layer Cake
// Eye-popping. Investor-ready. Bold black text. One cohesive engine.
// Powered by Nebius H200 · Google Gemini · Anthropic Claude · Perplexity · Manus
// ─────────────────────────────────────────────────────────────────────────────

const STACK_LAYERS = [
  {
    number: "01",
    tier: "COMPUTE FOUNDATION",
    name: "Nebius H200 GPU Cluster",
    role: "The Engine Room — Raw AI Power",
    desc: "NVIDIA H200 Tensor Core GPUs deliver the raw compute that powers every AI inference, model call, and real-time decision across the entire AthlynXAI platform. This is the foundation everything runs on.",
    accent: "#1E90FF",
    bg: "#020712",
    textColor: "#ffffff",
  },
  {
    number: "02",
    tier: "AI INTELLIGENCE",
    name: "Google Gemini 2.5",
    role: "Multimodal Reasoning & Vision",
    desc: "Gemini handles video analysis, document understanding, athlete film review, and long-context reasoning. Every piece of media that enters the platform passes through Gemini's multimodal intelligence.",
    accent: "#4285F4",
    bg: "#0a0f1a",
    textColor: "#ffffff",
  },
  {
    number: "03",
    tier: "AI INTELLIGENCE",
    name: "Anthropic Claude",
    role: "Writing, Contracts & Compliance",
    desc: "Claude powers NIL contract drafting, legal compliance checks, athlete profile writing, recruiting summaries, and every document that requires precision language and safety guardrails.",
    accent: "#D97706",
    bg: "#0a0f1a",
    textColor: "#ffffff",
  },
  {
    number: "04",
    tier: "AI INTELLIGENCE",
    name: "Perplexity Sonar",
    role: "Real-Time Research & Live Data",
    desc: "Perplexity keeps the platform current — live scores, transfer portal news, NIL market rates, recruiting rankings, and breaking sports news are sourced and verified in real time.",
    accent: "#20C997",
    bg: "#0a0f1a",
    textColor: "#ffffff",
  },
  {
    number: "05",
    tier: "AUTONOMOUS OPERATIONS",
    name: "Manus AI",
    role: "Autonomous Agent Orchestration",
    desc: "Manus is the autonomous operator — it builds, deploys, updates, and maintains the platform itself. Every page you see, every feature you use, was built and deployed by Manus without a traditional engineering team.",
    accent: "#8B5CF6",
    bg: "#0a0f1a",
    textColor: "#ffffff",
  },
  {
    number: "06",
    tier: "PRODUCTIVITY & WORKSPACE",
    name: "Google Workspace",
    role: "Collaboration, Docs & Drive",
    desc: "Google Workspace powers internal operations — Docs, Sheets, Drive, Gmail, and Calendar are all connected to the AthlynXAI OS through live integrations, keeping the business layer synchronized with the platform.",
    accent: "#34A853",
    bg: "#0a0f1a",
    textColor: "#ffffff",
  },
  {
    number: "07",
    tier: "ATHLETE PLATFORM",
    name: "AthlynX Platform",
    role: "The Complete Athlete Operating System",
    desc: "317 pages. 577 routes. NIL portal, recruiting hub, sport hubs for every sport, live scores, brackets, draft trackers, media vault, wellness, training, GlucoAthlete, and more — all running on one unified codebase.",
    accent: "#1E90FF",
    bg: "#071426",
    textColor: "#ffffff",
  },
  {
    number: "08",
    tier: "MONETIZATION",
    name: "NIL Gateway & Marketplace",
    role: "Athlete Monetization Engine",
    desc: "The NIL deal builder, marketplace, vault, calculator, and jobs board form a complete athlete monetization stack. Brands, agents, and athletes transact through a single platform with full contract and compliance support.",
    accent: "#1E90FF",
    bg: "#071426",
    textColor: "#ffffff",
  },
  {
    number: "09",
    tier: "MEDIA NETWORK",
    name: "AXN Streaming & Podcast Engine",
    role: "Owned Sports Media Network",
    desc: "AXN is the programming layer — athlete stories, highlights, The Athlete's Playbook podcast, social content, and premium media drops all flow through a single owned media rail that AthlynXAI controls.",
    accent: "#EF4444",
    bg: "#071426",
    textColor: "#ffffff",
  },
  {
    number: "10",
    tier: "COMMUNICATIONS",
    name: "Sent.dm — SMS & WhatsApp",
    role: "Multi-Channel Athlete Messaging",
    desc: "Sent.dm delivers OTP verification, NIL deal alerts, recruiting notifications, and platform updates via SMS and WhatsApp. 8,300 daily message capacity with full multi-channel delivery intelligence.",
    accent: "#25D366",
    bg: "#071426",
    textColor: "#ffffff",
  },
];

const STATS = [
  { value: "1,030,000+", label: "Lines of Code" },
  { value: "317", label: "Platform Pages" },
  { value: "577", label: "Active Routes" },
  { value: "10", label: "AI Integrations" },
  { value: "44", label: "Server Routers" },
  { value: "18.5 Mo", label: "Build Time" },
  { value: "1", label: "Founder Built It" },
  { value: "$2.95M+", label: "Market Replacement Cost" },
];

const COMPANIES = [
  {
    name: "AthlynXAI OS",
    role: "The Operating Brain",
    desc: "The autonomous AI operating system that runs everything — agents, automation, data, and intelligence across the entire ecosystem.",
    link: "/athlynxai-os",
    star: true,
  },
  {
    name: "AthlynX Platform",
    role: "The Athlete Hub",
    desc: "The full athlete experience — NIL, recruiting, sport hubs, live scores, media, wellness, and more.",
    link: "/welcome",
    star: false,
  },
  {
    name: "NIL Gateway",
    role: "Monetization Engine",
    desc: "End-to-end NIL deal flow, marketplace, vault, and compliance for athletes and brands.",
    link: "/nil-portal",
    star: false,
  },
  {
    name: "AXN Streaming",
    role: "Owned Media Network",
    desc: "The athlete-first sports media network — streaming, podcasts, highlights, and premium content.",
    link: "/axn-streaming",
    star: false,
  },
  {
    name: "Dozier Holdings Group",
    role: "Parent Company",
    desc: "The holding company structure that owns and operates the full AthlynXAI ecosystem.",
    link: "/about",
    star: false,
  },
];

export default function AthlynXAIFullStackOS() {
  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", background: "#ffffff", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(160deg, #020712 0%, #071426 60%, #0d1f3c 100%)",
        padding: "88px 24px 72px",
        textAlign: "center",
        borderBottom: "5px solid #1E90FF",
      }}>
        <div style={{
          display: "inline-block",
          background: "#1E90FF",
          color: "#ffffff",
          fontWeight: 900,
          fontSize: 14,
          letterSpacing: 4,
          padding: "10px 24px",
          borderRadius: 6,
          marginBottom: 32,
          textTransform: "uppercase",
        }}>
          AthlynXAI OS · Full Stack Layer Cake
        </div>

        <h1 style={{
          color: "#ffffff",
          fontSize: "clamp(40px, 7vw, 80px)",
          fontWeight: 900,
          lineHeight: 1.0,
          margin: "0 auto 28px",
          maxWidth: 960,
          letterSpacing: "-0.04em",
        }}>
          One Cohesive Engine.<br />
          <span style={{ color: "#1E90FF" }}>Fully Autonomous.</span><br />
          Built by One Founder.
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.82)",
          fontSize: 22,
          fontWeight: 600,
          maxWidth: 740,
          margin: "0 auto 44px",
          lineHeight: 1.55,
        }}>
          AthlynXAI OS is the operating brain of a complete sports ecosystem — running on <strong style={{ color: "#1E90FF" }}>Nebius H200 GPU servers</strong>, powered by Google Gemini, Anthropic Claude, Perplexity, and Manus AI.
        </p>

        {/* AI Power Stack Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 52 }}>
          {[
            { name: "Nebius H200", color: "#1E90FF" },
            { name: "Google Gemini", color: "#4285F4" },
            { name: "Anthropic Claude", color: "#D97706" },
            { name: "Perplexity Sonar", color: "#20C997" },
            { name: "Manus AI", color: "#8B5CF6" },
            { name: "Google Workspace", color: "#34A853" },
          ].map(ai => (
            <span key={ai.name} style={{
              background: "rgba(255,255,255,0.07)",
              border: `2px solid ${ai.color}`,
              color: "#ffffff",
              padding: "12px 22px",
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 15,
            }}>
              {ai.name}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          <Link href="/welcome" style={{
            background: "#1E90FF",
            color: "#ffffff",
            padding: "18px 40px",
            borderRadius: 12,
            fontWeight: 900,
            fontSize: 18,
            textDecoration: "none",
            display: "inline-block",
          }}>
            Enter the Platform
          </Link>
          <Link href="/investor" style={{
            background: "rgba(255,255,255,0.08)",
            border: "2px solid rgba(255,255,255,0.35)",
            color: "#ffffff",
            padding: "18px 40px",
            borderRadius: 12,
            fontWeight: 900,
            fontSize: 18,
            textDecoration: "none",
            display: "inline-block",
          }}>
            Investor Brief
          </Link>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section style={{ background: "#0d1117", padding: "0" }}>
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        }}>
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{
              textAlign: "center",
              padding: "36px 16px",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}>
              <div style={{ color: "#1E90FF", fontSize: 30, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 700, marginTop: 8, textTransform: "uppercase", letterSpacing: 1.5 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FULL STACK LAYER CAKE ─────────────────────────────────────────── */}
      <section style={{ background: "#f8f9fa", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{
              display: "inline-block",
              background: "#000000",
              color: "#1E90FF",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: 4,
              padding: "10px 24px",
              borderRadius: 6,
              marginBottom: 24,
              textTransform: "uppercase",
            }}>
              The Stack
            </div>
            <h2 style={{
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 900,
              color: "#000000",
              margin: "0 0 20px",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}>
              Full Stack Layer Cake
            </h2>
            <p style={{
              fontSize: 21,
              color: "#222222",
              fontWeight: 600,
              maxWidth: 700,
              margin: "0 auto",
              lineHeight: 1.55,
            }}>
              Every layer is live, connected, and running. From raw GPU compute at the bottom to the athlete experience at the top — this is one unified engine.
            </p>
          </div>

          {/* Layer Stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {STACK_LAYERS.map((layer) => (
              <div key={layer.number} style={{
                background: layer.bg,
                borderLeft: `8px solid ${layer.accent}`,
                borderRadius: 14,
                padding: "32px 36px",
                display: "flex",
                alignItems: "flex-start",
                gap: 28,
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Layer Number */}
                <div style={{
                  color: "rgba(255,255,255,0.06)",
                  fontSize: 80,
                  fontWeight: 900,
                  lineHeight: 1,
                  position: "absolute",
                  right: 28,
                  top: 12,
                  userSelect: "none",
                  letterSpacing: "-0.04em",
                }}>
                  {layer.number}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{
                      background: layer.accent,
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: 900,
                      padding: "5px 14px",
                      borderRadius: 5,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                    }}>
                      {layer.number}
                    </span>
                    <span style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                    }}>
                      {layer.tier}
                    </span>
                  </div>

                  <h3 style={{
                    color: "#ffffff",
                    fontSize: 26,
                    fontWeight: 900,
                    margin: "0 0 6px",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                  }}>
                    {layer.name}
                  </h3>

                  <div style={{
                    color: layer.accent,
                    fontSize: 14,
                    fontWeight: 800,
                    marginBottom: 14,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}>
                    {layer.role}
                  </div>

                  <p style={{
                    color: "rgba(255,255,255,0.78)",
                    fontSize: 17,
                    fontWeight: 500,
                    margin: 0,
                    lineHeight: 1.65,
                    maxWidth: 700,
                  }}>
                    {layer.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY ECOSYSTEM ────────────────────────────────────────────── */}
      <section style={{ background: "#ffffff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              display: "inline-block",
              background: "#000000",
              color: "#1E90FF",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: 4,
              padding: "10px 24px",
              borderRadius: 6,
              marginBottom: 24,
              textTransform: "uppercase",
            }}>
              The Ecosystem
            </div>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: "#000000",
              margin: "0 0 20px",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}>
              One Holding. Five Companies.<br />One Mission.
            </h2>
            <p style={{
              fontSize: 20,
              color: "#222222",
              fontWeight: 600,
              maxWidth: 640,
              margin: "0 auto",
              lineHeight: 1.55,
            }}>
              AthlynXAI OS is the star. Every company in the Dozier Holdings Group ecosystem runs on the same engine.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {COMPANIES.map(co => (
              <Link key={co.name} href={co.link} style={{ textDecoration: "none" }}>
                <div style={{
                  background: co.star
                    ? "linear-gradient(135deg, #020712 0%, #071426 100%)"
                    : "#f8f9fa",
                  border: co.star ? "3px solid #1E90FF" : "2px solid #e2e8f0",
                  borderRadius: 18,
                  padding: "36px 32px",
                  position: "relative",
                  cursor: "pointer",
                  minHeight: 200,
                }}>
                  {co.star && (
                    <div style={{
                      position: "absolute",
                      top: -16,
                      left: 28,
                      background: "#1E90FF",
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: 11,
                      padding: "5px 16px",
                      borderRadius: 20,
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                    }}>
                      THE STAR
                    </div>
                  )}
                  <h3 style={{
                    color: co.star ? "#ffffff" : "#000000",
                    fontSize: 24,
                    fontWeight: 900,
                    margin: "0 0 8px",
                    letterSpacing: "-0.03em",
                  }}>
                    {co.name}
                  </h3>
                  <div style={{
                    color: "#1E90FF",
                    fontSize: 13,
                    fontWeight: 800,
                    marginBottom: 14,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}>
                    {co.role}
                  </div>
                  <p style={{
                    color: co.star ? "rgba(255,255,255,0.75)" : "#444444",
                    fontSize: 16,
                    fontWeight: 500,
                    margin: 0,
                    lineHeight: 1.65,
                  }}>
                    {co.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTOR CTA ─────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(160deg, #020712 0%, #071426 100%)",
        padding: "88px 24px",
        textAlign: "center",
        borderTop: "5px solid #1E90FF",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "#1E90FF",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: 4,
            padding: "10px 24px",
            borderRadius: 6,
            marginBottom: 32,
            textTransform: "uppercase",
          }}>
            Investment Opportunity
          </div>

          <h2 style={{
            color: "#ffffff",
            fontSize: "clamp(34px, 5vw, 60px)",
            fontWeight: 900,
            margin: "0 0 28px",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}>
            Built by One Founder.<br />
            <span style={{ color: "#1E90FF" }}>Worth $12M–$15M.</span><br />
            Ready to Scale Now.
          </h2>

          <p style={{
            color: "rgba(255,255,255,0.82)",
            fontSize: 21,
            fontWeight: 600,
            margin: "0 auto 48px",
            lineHeight: 1.6,
          }}>
            Pre-seed round open. <strong style={{ color: "#1E90FF" }}>$1.5M–$2.5M raise</strong> at a $12M–$15M valuation cap via Post-Money SAFE. Chad A. Dozier Sr. built 99% of this platform — a 12-to-17-person engineering team's work, done by one founder in 18.5 months.
          </p>

          {/* Investor Targets */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 48 }}>
            {["Humain (Saudi Arabia)", "Strategic Sports VCs", "NIL-Focused Funds", "AI Infrastructure Investors", "Sports Media Groups"].map(name => (
              <span key={name} style={{
                background: "rgba(30,144,255,0.12)",
                border: "1px solid rgba(30,144,255,0.4)",
                color: "#60AFFF",
                padding: "10px 20px",
                borderRadius: 8,
                fontWeight: 800,
                fontSize: 14,
              }}>
                {name}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            <Link href="/investor" style={{
              background: "#1E90FF",
              color: "#ffffff",
              padding: "20px 44px",
              borderRadius: 12,
              fontWeight: 900,
              fontSize: 19,
              textDecoration: "none",
              display: "inline-block",
            }}>
              View Full Investor Brief
            </Link>
            <Link href="/about" style={{
              background: "rgba(255,255,255,0.08)",
              border: "2px solid rgba(255,255,255,0.3)",
              color: "#ffffff",
              padding: "20px 44px",
              borderRadius: 12,
              fontWeight: 900,
              fontSize: 19,
              textDecoration: "none",
              display: "inline-block",
            }}>
              About AthlynXAI
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div style={{ background: "#000000", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: 1.5, textTransform: "uppercase" }}>
          AthlynXAI OS · Powered by Nebius H200 · Built by Chad A. Dozier Sr. · BE THE LEGACY
        </p>
      </div>

    </div>
  );
}
