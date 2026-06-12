import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  signInWithGoogle,
  signInWithApple,
  signInWithFacebook,
  loginWithRedirect,
  isAuthConfigured,
} from "@/lib/okta";
import { captureGrowthAttribution, getGrowthAttribution } from "@/lib/growthTracking";

// Build 2 — Auth0 PKCE auth shell used by SignIn.tsx and SignUp.tsx.
// All social and email flows redirect to Auth0 Universal Login via PKCE.

const COLORS = {
  base: "#0A1628",
  card: "#0F1E36",
  border: "#1F3257",
  blue: "#00A3FF",
  blueHover: "#0084CC",
  white: "#FFFFFF",
  textSecondary: "#B7C3D9",
  textMuted: "#6B7A99",
};

const TAGLINE = "ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.";

type Mode = "signin" | "signup";

export function AuthShell({ mode }: { mode: Mode }) {
  const [, setLocation] = useLocation();
  const trackGrowthMutation = trpc.crm.trackGrowthEvent.useMutation();

  function trackGrowth(eventType: Parameters<typeof trackGrowthMutation.mutate>[0]["eventType"], extra?: Record<string, unknown>) {
    if (mode !== "signup" || typeof window === "undefined") return;
    trackGrowthMutation.mutate({
      eventType,
      path: `${window.location.pathname}${window.location.search}`,
      metadata: getGrowthAttribution(extra),
    });
  }

  useEffect(() => {
    if (mode !== "signup" || typeof window === "undefined") return;
    const attribution = captureGrowthAttribution();
    trackGrowthMutation.mutate({
      eventType: "signup_page_view",
      path: `${window.location.pathname}${window.location.search}`,
      metadata: attribution,
    });
    // Fire only once for this page visit; mutation object is intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Smooth handoff: already signed in? Don't bounce — synchronous redirect to /welcome.
  // Skip-the-form rule from Manus spec 01-Welcome-Screen.md §6.
  // Using window.location.replace so the URL bar actually updates and /signin or /signup
  // is removed from history (no Back-button loop).
  const { data: existingUser, isLoading: authLoading } = trpc.auth.me.useQuery(
    undefined,
    { retry: false, staleTime: 15_000 },
  );
  if (!authLoading && existingUser && typeof window !== "undefined") {
    window.location.replace("/welcome");
    return null;
  }

  const [view, setView] = useState<"doors" | "email">("doors");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [tiktokHandle, setTiktokHandle] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<null | "google" | "apple" | "facebook" | "email">(null);

  // Unified handoff: every authenticated path now lands on /welcome.
  // /welcome chooses the next door (App vs Web) and routes onward.
  const syncMutation = trpc.auth.syncUser.useMutation({
    onSuccess: () => {
      window.location.href = "/welcome";
    },
    onError: err => {
      setError(err.message || "Sign-in failed.");
      setBusy(null);
    },
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      window.location.href = "/welcome";
    },
    onError: err => {
      setError(err.message || "Sign-in failed.");
      setBusy(null);
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      window.location.href = "/welcome";
    },
    onError: err => {
      const msg = err.message ?? "";
      if (msg.toLowerCase().includes("already exists")) {
        loginMutation.mutate({ email: email.trim(), password: password.trim() });
      } else {
        setError(msg || "Sign-up failed.");
        setBusy(null);
      }
    },
  });

  function socialHandleMetadata() {
    return {
      instagramHandle: instagramHandle.trim() || undefined,
      tiktokHandle: tiktokHandle.trim() || undefined,
    };
  }

  async function door(provider: "google" | "apple" | "facebook") {
    if (!isAuthConfigured) {
      setError("Social sign-in is temporarily unavailable. Use email instead.");
      return;
    }
    setError("");
    trackGrowth("signup_started", { provider, ...socialHandleMetadata() });
    trackGrowth("signup_social_started", { provider, ...socialHandleMetadata() });
    setBusy(provider);
    try {
      // Auth0 PKCE: all social flows trigger a full-page redirect.
      // The result comes back at /auth/callback — AuthCallback.tsx handles token exchange.
      if (provider === "google") await signInWithGoogle();
      else if (provider === "apple") await signInWithApple();
      else await signInWithFacebook();
      // Browser is already navigating — no further action needed here.
      return;
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("popup-closed") || msg.includes("cancelled") || msg.includes("popup_closed")) {
        setBusy(null);
        return;
      }
      setError(msg || "Sign-in failed.");
      setBusy(null);
    }
  }

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (mode === "signup") {
      if (!name.trim()) {
        setError("Name is required.");
        return;
      }
      if (!dob) {
        setError("Date of birth is required.");
        return;
      }
      // COPPA age gate: 13+ to use AthlynX (parent consent flow handles 13-17 later)
      const birth = new Date(dob);
      if (isNaN(birth.getTime())) {
        setError("Please enter a valid date of birth.");
        return;
      }
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age < 13) {
        setError("You must be 13 or older to create an AthlynX account. Children under 13 are protected by COPPA and cannot sign up directly. A parent or guardian can contact us at hello@athlynx.ai.");
        return;
      }
      if (password.trim().length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      setError("");
      trackGrowth("signup_started", { provider: "email", ...socialHandleMetadata() });
      trackGrowth("signup_email_started", { provider: "email", ...socialHandleMetadata() });
      setBusy("email");
      registerMutation.mutate({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        attribution: getGrowthAttribution({ provider: "email", ...socialHandleMetadata() }),
      });
    } else {
      if (!password.trim()) {
        setError("Password is required.");
        return;
      }
      setError("");
      setBusy("email");
      loginMutation.mutate({ email: email.trim(), password: password.trim() });
    }
  }

  const heading = mode === "signin" ? "Welcome back." : "Claim your free athlete profile.";
  const cta = mode === "signin" ? "Sign in" : "Claim Your Free Profile";
  const socialProof = mode === "signup" ? "No card. No catch. Your athlete owns the profile. Takes 30 seconds." : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.base} 0%, #0d1b3e 50%, ${COLORS.base} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 900,
            fontSize: 28,
            color: COLORS.white,
            letterSpacing: 2,
          }}
        >
          AthlynX
        </div>
        <h1
          style={{
            color: COLORS.white,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 26,
            margin: "16px 0 8px",
          }}
        >
          {heading}
        </h1>
        <p style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.5, margin: 0 }}>{TAGLINE}</p>
        {socialProof && (
          <p style={{ color: "#00A3FF", fontSize: 13, lineHeight: 1.5, marginTop: 8, fontWeight: 600 }}>{socialProof}</p>
        )}
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 28,
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        }}
      >
        {error && (
          <div
            style={{
              background: "rgba(229, 85, 108, 0.15)",
              border: "1px solid rgba(229, 85, 108, 0.4)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              color: "#fca5a5",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {view === "doors" ? (
          <>
            <button
              type="button"
              onClick={() => door("apple")}
              disabled={!!busy}
              style={doorButtonStyle("#000", COLORS.white, "1px solid rgba(255,255,255,0.15)")}
            >
              {busy === "apple" ? "Connecting to Apple…" : "Continue with Apple"}
            </button>
            <button
              type="button"
              onClick={() => door("google")}
              disabled={!!busy}
              style={doorButtonStyle("#FFFFFF", "#1F2937", `1px solid ${COLORS.border}`)}
            >
              {busy === "google" ? "Connecting to Google…" : "Continue with Google"}
            </button>
            <button
              type="button"
              onClick={() => door("facebook")}
              disabled={!!busy}
              style={doorButtonStyle("#1877F2", COLORS.white, "none")}
            >
              {busy === "facebook" ? "Connecting to Facebook…" : "Continue with Facebook"}
            </button>
            {mode === "signup" && <SocialHandleFields instagramHandle={instagramHandle} setInstagramHandle={setInstagramHandle} tiktokHandle={tiktokHandle} setTiktokHandle={setTiktokHandle} />}
            <button
              type="button"
              onClick={async () => {
                trackGrowth("landing_signup_cta_click", { cta: "continue_with_email", ...socialHandleMetadata() });
                // Auth0: redirect to Universal Login email screen
                await loginWithRedirect();
              }}
              disabled={!!busy}
              style={doorButtonStyle(COLORS.blue, COLORS.white, "none")}
            >
              Continue with Email
            </button>
          </>
        ) : (
          <form onSubmit={submitEmail}>
            {mode === "signup" && (
              <>
                <Field label="Full name">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Date of birth (13+ to join)">
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    style={inputStyle}
                  />
                </Field>
                <SocialHandleFields instagramHandle={instagramHandle} setInstagramHandle={setInstagramHandle} tiktokHandle={tiktokHandle} setTiktokHandle={setTiktokHandle} />
              </>
            )}
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@athlynx.ai"
                style={inputStyle}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </Field>
            <button
              type="submit"
              disabled={!!busy}
              style={{ ...doorButtonStyle(COLORS.blue, COLORS.white, "none"), marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {busy === "email" ? (
                <>
                  <span className="animate-spin" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
                  Working…
                </>
              ) : cta}
            </button>
            <button
              type="button"
              onClick={() => setView("doors")}
              disabled={!!busy}
              style={{
                width: "100%",
                marginTop: 12,
                background: "transparent",
                color: COLORS.textSecondary,
                border: "none",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Back to all options
            </button>
          </form>
        )}

        <p style={{ color: COLORS.textMuted, fontSize: 11, textAlign: "center", margin: "20px 0 0", lineHeight: 1.6 }}>
          By continuing you agree to our{" "}
          <a href="/terms" style={{ color: COLORS.blue, textDecoration: "none" }}>
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" style={{ color: COLORS.blue, textDecoration: "none" }}>
            Privacy Policy
          </a>
          .
        </p>
      </div>

      <p style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 20 }}>
        {mode === "signin" ? (
          <>
            New to AthlynX?{" "}
            <span
              onClick={() => setLocation("/signup")}
              style={{ color: COLORS.blue, cursor: "pointer", fontWeight: 600 }}
            >
              Start here
            </span>
          </>
        ) : (
          <>
            Already on AthlynX?{" "}
            <span
              onClick={() => setLocation("/signin")}
              style={{ color: COLORS.blue, cursor: "pointer", fontWeight: 600 }}
            >
              Sign in
            </span>
          </>
        )}
      </p>
    </div>
  );
}

function SocialHandleFields({
  instagramHandle,
  setInstagramHandle,
  tiktokHandle,
  setTiktokHandle,
}: {
  instagramHandle: string;
  setInstagramHandle: (value: string) => void;
  tiktokHandle: string;
  setTiktokHandle: (value: string) => void;
}) {
  return (
    <div style={{ margin: "4px 0 14px" }}>
      <p style={{ color: COLORS.textMuted, fontSize: 12, lineHeight: 1.45, margin: "0 0 10px", textAlign: "center" }}>
        Optional: add your IG and TikTok handles now so AthlynX can pre-fill your profile when social import goes live.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <input
          type="text"
          value={instagramHandle}
          onChange={e => setInstagramHandle(e.target.value)}
          placeholder="Instagram @"
          autoComplete="off"
          style={{ ...inputStyle, fontSize: 13 }}
        />
        <input
          type="text"
          value={tiktokHandle}
          onChange={e => setTiktokHandle(e.target.value)}
          placeholder="TikTok @"
          autoComplete="off"
          style={{ ...inputStyle, fontSize: 13 }}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          color: COLORS.textMuted,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: COLORS.base,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  color: COLORS.white,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

function doorButtonStyle(bg: string, color: string, border: string): React.CSSProperties {
  return {
    width: "100%",
    padding: "13px",
    background: bg,
    color,
    border,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 10,
  };
}
