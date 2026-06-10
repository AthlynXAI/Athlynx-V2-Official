import { useEffect, useState } from "react";
import { Link } from "wouter";

const STORAGE_KEY = "athlynx_cookie_consent_v1";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      // Do not block the first mobile landing/login action. Show the notice after the page has settled.
      if (!v) timer = setTimeout(() => setVisible(true), 8000);
    } catch {
      // localStorage blocked — still avoid blocking the initial login action.
      timer = setTimeout(() => setVisible(true), 8000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: "accept", ts: Date.now() }));
    } catch {}
    setVisible(false);
  }

  function decline() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: "decline", ts: Date.now() }));
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        left: 10,
        right: 10,
        bottom: 10,
        zIndex: 60,
        maxWidth: 460,
        marginInline: "auto",
        background: "#0a1628",
        border: "1px solid rgba(0,194,255,0.25)",
        borderRadius: 12,
        padding: 10,
        color: "#e6f1ff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>Cookies on AthlynX</div>
      <div style={{ fontSize: 11, lineHeight: 1.35, color: "rgba(230,241,255,0.78)", marginBottom: 8 }}>
        We use essential cookies to keep you signed in and the platform secure. Optional cookies help us understand
        what athletes love and what to build next. Read our{" "}
        <Link href="/privacy" style={{ color: "#00c2ff", textDecoration: "underline" }}>
          Privacy Policy
        </Link>{" "}
        or tell us what you want at{" "}
        <Link href="/qa" style={{ color: "#00c2ff", textDecoration: "underline" }}>
          /qa
        </Link>
        .
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={accept}
          style={{
            background: "#1E90FF",
            color: "#000",
            border: "none",
            borderRadius: 9,
            padding: "6px 12px",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Accept all
        </button>
        <button
          onClick={decline}
          style={{
            background: "transparent",
            color: "#e6f1ff",
            border: "1px solid rgba(230,241,255,0.25)",
            borderRadius: 9,
            padding: "6px 12px",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
