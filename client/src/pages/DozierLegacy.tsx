import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useEffect, useState } from "react";

const CREST_URL = "/athlynx-icon.png";

function DozierLegacyInner() {
  const [revealed, setRevealed] = useState(false);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    document.title = "The Dozier Legacy | AthlynX";
    const timer = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #04091a 0%, #0a1628 40%, #0d1f3c 70%, #04091a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 16px 80px",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        overflowX: "hidden",
      }}
    >
      {/* Gold filigree top border */}
      <div style={{
        width: "100%",
        height: "4px",
        background: "linear-gradient(90deg, transparent, #C9A84C, #f0d080, #C9A84C, transparent)",
        marginBottom: "0",
      }} />

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginTop: "48px",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(20px)",
          transition: "all 1.2s ease",
        }}
      >
        <p style={{
          color: "#C9A84C",
          letterSpacing: "0.35em",
          fontSize: "11px",
          textTransform: "uppercase",
          marginBottom: "8px",
          opacity: 0.8,
        }}>
          DOZIER HOLDINGS GROUP · FOUNDER'S LEGACY
        </p>
        <h1 style={{
          color: "#ffffff",
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: "700",
          letterSpacing: "0.05em",
          margin: "0 0 6px",
          textShadow: "0 0 40px rgba(201,168,76,0.3)",
        }}>
          THE DOZIER NAME
        </h1>
        <p style={{
          color: "#C9A84C",
          fontSize: "clamp(13px, 2vw, 17px)",
          letterSpacing: "0.2em",
          fontStyle: "italic",
          margin: 0,
        }}>
          Strength · Peace · Family · Humble
        </p>
      </div>

      {/* Crest */}
      <div
        style={{
          marginTop: "40px",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "scale(1)" : "scale(0.92)",
          transition: "all 1.6s ease 0.3s",
          position: "relative",
        }}
      >
        {/* Glow behind crest */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "340px",
          height: "420px",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.18) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        <img
          src={CREST_URL}
          alt="Dozier Family Crest — Alpha Lion"
          style={{
            width: "clamp(260px, 55vw, 420px)",
            height: "auto",
            display: "block",
            position: "relative",
            zIndex: 1,
            filter: "drop-shadow(0 8px 40px rgba(201,168,76,0.35)) drop-shadow(0 2px 8px rgba(0,0,0,0.8))",
          }}
        />
      </div>

      {/* Four Pillars */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          maxWidth: "600px",
          width: "100%",
          marginTop: "48px",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(30px)",
          transition: "all 1.4s ease 0.6s",
        }}
      >
        {[
          { icon: "", title: "STRENGTH", desc: "Built through every battle. Forged in fire. Unbreakable." },
          { icon: "", title: "PEACE", desc: "The calm of a man who knows who he is and whose he is." },
          { icon: "", title: "FAMILY", desc: "The reason for every sacrifice. The legacy that outlives us all." },
          { icon: "", title: "HUMBLE", desc: "Quietly confident. Loudly grateful. Never above the work or the people who do it." },
        ].map((pillar) => (
          <div
            key={pillar.title}
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.25)",
              borderRadius: "12px",
              padding: "20px 18px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{pillar.icon}</div>
            <div style={{
              color: "#C9A84C",
              fontSize: "11px",
              letterSpacing: "0.3em",
              fontWeight: "700",
              marginBottom: "8px",
            }}>
              {pillar.title}
            </div>
            <div style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "13px",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}>
              {pillar.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Origin Story */}
      <div
        style={{
          maxWidth: "620px",
          width: "100%",
          marginTop: "48px",
          padding: "32px 28px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "16px",
          textAlign: "center",
          opacity: revealed ? 1 : 0,
          transition: "all 1.4s ease 0.9s",
        }}
      >
        <p style={{
          color: "#C9A84C",
          fontSize: "11px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          THE ORIGIN STORY
        </p>
        <p style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: "clamp(14px, 2.2vw, 17px)",
          lineHeight: "1.9",
          fontStyle: "italic",
          margin: "0 0 20px",
        }}>
          "Two men. Houston, Texas. November 2024. One had a vision that wouldn't let him sleep. The other had the engineering mind to build it. Nobody understood it. Nobody believed it. So they built it themselves — for every athlete who was ever told they weren't good enough. For every family that sacrificed everything. For the glory of God."
        </p>
        <p style={{
          color: "#C9A84C",
          fontSize: "13px",
          letterSpacing: "0.15em",
          margin: 0,
        }}>
          — Chad A. Dozier &amp; Glenn Tse · Founders, AthlynX
        </p>
      </div>

      {/* The Empire */}
      <div
        style={{
          maxWidth: "620px",
          width: "100%",
          marginTop: "40px",
          textAlign: "center",
          opacity: revealed ? 1 : 0,
          transition: "all 1.4s ease 1.1s",
        }}
      >
        <p style={{
          color: "#C9A84C",
          fontSize: "11px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}>
          THE EMPIRE
        </p>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}>
          {[
            "AthlynX", "NIL Portal™", "Transfer Portal™", "Diamond Grind™",
            "Warriors Playbook™", "NIL Vault™", "AI Sales™", "Faith™",
            "AI Recruiter™", "AI Content™", "Gridiron Nexus™", "Court Kings™",
            "Pitch Pulse™", "Reel Masters™", "Marketplace™", "Dozier Holdings Group",
          ].map((name) => (
            <span
              key={name}
              style={{
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
                color: "rgba(255,255,255,0.75)",
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "11px",
                letterSpacing: "0.05em",
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Generational Wealth Statement */}
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          marginTop: "48px",
          textAlign: "center",
          opacity: revealed ? 1 : 0,
          transition: "all 1.4s ease 1.3s",
        }}
      >
        <div style={{
          width: "60px",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
          margin: "0 auto 24px",
        }} />
        <p style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "12px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}>
          Generational Wealth · Recurring Revenue · Built to Last
        </p>
        <p style={{
          color: "rgba(201,168,76,0.4)",
          fontSize: "11px",
          marginTop: "24px",
          letterSpacing: "0.1em",
        }}>
          © {year} Dozier Holdings Group · AthlynXAI Corporation · Houston, TX
        </p>
      </div>

      {/* Bottom gold border */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, transparent, #C9A84C, #f0d080, #C9A84C, transparent)",
      }} />
    </div>
  );
}

export default function DozierLegacy() {
  return <RouteErrorBoundary><DozierLegacyInner /></RouteErrorBoundary>;
}
