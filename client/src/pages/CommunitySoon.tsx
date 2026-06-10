import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";

function CommunitySoonInner() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setJoined(true);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #04091a 0%, #0a1628 40%, #0d1f3c 70%, #04091a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px 80px",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top gold bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, transparent, #C9A84C, #f0d080, #C9A84C, transparent)",
      }} />

      {/* Background glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse, rgba(0,102,255,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Back link */}
      <div style={{ position: "absolute", top: "24px", left: "24px" }}>
        <Link href="/" style={{
          color: "rgba(201,168,76,0.7)",
          fontSize: "13px",
          textDecoration: "none",
          letterSpacing: "0.05em",
        }}>
          ← Back to AthlynX
        </Link>
      </div>

      {/* Badge */}
      <div style={{
        background: "rgba(0,102,255,0.15)",
        border: "1px solid rgba(0,102,255,0.4)",
        color: "#60a5fa",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        padding: "6px 16px",
        borderRadius: "20px",
        marginBottom: "24px",
      }}>
        COMING SOON
      </div>

      {/* Icon */}
      <div style={{ fontSize: "64px", marginBottom: "20px", lineHeight: 1 }}>🏟️</div>

      {/* Title */}
      <h1 style={{
        color: "#ffffff",
        fontSize: "clamp(32px, 6vw, 56px)",
        fontWeight: "900",
        letterSpacing: "-0.02em",
        margin: "0 0 12px",
        lineHeight: 1.1,
      }}>
        AthlynX COMMUNITY
      </h1>

      <p style={{
        color: "rgba(255,255,255,0.6)",
        fontSize: "clamp(15px, 2.5vw, 19px)",
        maxWidth: "520px",
        lineHeight: "1.7",
        margin: "0 0 8px",
      }}>
        The global hub where athletes connect, compete, and build their legacies together.
      </p>
      <p style={{
        color: "rgba(201,168,76,0.8)",
        fontSize: "14px",
        fontStyle: "italic",
        margin: "0 0 40px",
      }}>
        Launching with the Full Platform · July 1, 2026
      </p>

      {/* Feature previews */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "12px",
        maxWidth: "680px",
        width: "100%",
        marginBottom: "40px",
      }}>
        {[
          { icon: "💬", title: "Athlete Forums", desc: "Discuss recruiting, training, and NIL with athletes worldwide" },
          { icon: "🏆", title: "Leaderboards", desc: "Compete for top rankings in your sport and position" },
          { icon: "📅", title: "Event Hub", desc: "Showcases, combines, and signing day events near you" },
          { icon: "🤝", title: "Mentor Network", desc: "Connect with pro athletes and coaches who've been there" },
        ].map((f) => (
          <div key={f.title} style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "left",
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{f.icon}</div>
            <div style={{ color: "#ffffff", fontWeight: "700", fontSize: "14px", marginBottom: "4px" }}>{f.title}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", lineHeight: "1.5" }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Email signup */}
      {!joined ? (
        <form onSubmit={handleJoin} style={{
          display: "flex",
          gap: "8px",
          maxWidth: "440px",
          width: "100%",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          <input
            type="email"
            placeholder="Enter your email for early access"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              flex: "1",
              minWidth: "220px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "12px 16px",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button type="submit" style={{
            background: "linear-gradient(135deg, #0066ff, #0044cc)",
            color: "#ffffff",
            fontWeight: "800",
            fontSize: "14px",
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}>
            Notify Me →
          </button>
        </form>
      ) : (
        <div style={{
          background: "rgba(0,200,100,0.1)",
          border: "1px solid rgba(0,200,100,0.3)",
          borderRadius: "12px",
          padding: "16px 28px",
          color: "#4ade80",
          fontWeight: "700",
          fontSize: "15px",
        }}>
          ✅ You're on the list! We'll notify you when Community launches.
        </div>
      )}

      {/* CTA to explore */}
      <div style={{ marginTop: "40px", display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/nil-portal" style={{
          background: "rgba(201,168,76,0.1)",
          border: "1px solid rgba(201,168,76,0.3)",
          color: "#C9A84C",
          padding: "10px 20px",
          borderRadius: "10px",
          fontSize: "13px",
          fontWeight: "700",
          textDecoration: "none",
        }}>
          NIL Portal →
        </Link>
        <Link href="/transfer-portal" style={{
          background: "rgba(0,102,255,0.1)",
          border: "1px solid rgba(0,102,255,0.3)",
          color: "#60a5fa",
          padding: "10px 20px",
          borderRadius: "10px",
          fontSize: "13px",
          fontWeight: "700",
          textDecoration: "none",
        }}>
          Transfer Portal →
        </Link>
        <Link href="/feed" style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.7)",
          padding: "10px 20px",
          borderRadius: "10px",
          fontSize: "13px",
          fontWeight: "700",
          textDecoration: "none",
        }}>
          Athlete Feed →
        </Link>
      </div>

      {/* Bottom gold bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, transparent, #C9A84C, #f0d080, #C9A84C, transparent)",
      }} />
    </div>
  );
}

export default function CommunitySoon() {
  return <RouteErrorBoundary><CommunitySoonInner /></RouteErrorBoundary>;
}
