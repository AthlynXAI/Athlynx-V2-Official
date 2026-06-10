/**
 * AthlynXAI — Elite Performance Experience (EPX)
 * Premium athlete performance hub
 */
import PlatformLayout from "@/components/PlatformLayout";

export default function EPX() {
  return (
    <PlatformLayout>
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a1628 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 600 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              background: "linear-gradient(135deg, #00c2ff, #7b2ff7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 16,
              letterSpacing: "-2px",
            }}
          >
            EPX
          </div>
          <h1
            style={{
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 700,
              margin: "0 0 12px",
            }}
          >
            Elite Performance Experience
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 16,
              lineHeight: 1.6,
              margin: "0 0 32px",
            }}
          >
            The next level of athlete performance tracking, analytics, and
            elite development tools. Coming soon exclusively to AthlynXAI
            members.
          </p>
          <a
            href="/dashboard"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #00c2ff, #7b2ff7)",
              color: "#ffffff",
              padding: "14px 32px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </PlatformLayout>
  );
}
