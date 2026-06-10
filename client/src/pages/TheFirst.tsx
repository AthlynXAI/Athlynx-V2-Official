import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";

// /the-first — AthlynX's monument page.
// Sam Altman predicted the first one-person billion-dollar company. This is that attempt,
// in plain language, on the public record. Chapter One of the book.

const C = {
  bg: "#0A1628",
  surface: "#0F1E36",
  border: "#1F3257",
  gold: "#D4AF37",
  blue: "#00A3FF",
  text: "#FFFFFF",
  textMuted: "#B7C3D9",
  textFaint: "#6B7A99",
};

function TheFirstInner() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      {/* Top bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(10,22,40,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/">
            <Button variant="ghost" size="sm" style={{ color: C.textMuted }}>
              <ArrowLeft style={{ width: 16, height: 16, marginRight: 8 }} />
              Home
            </Button>
          </Link>
          <div style={{ fontSize: 12, color: C.textFaint, letterSpacing: 1 }}>
            Iron Sharpens Iron — Proverbs 27:17
          </div>
        </div>
      </header>

      {/* Hero — the claim */}
      <section style={{ padding: "80px 24px 48px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              border: `1px solid ${C.gold}`,
              borderRadius: 999,
              color: C.gold,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            The Public Record
          </div>
          <h1
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(40px, 7vw, 88px)",
              lineHeight: 1.02,
              letterSpacing: -1,
              margin: 0,
            }}
          >
            The first <span style={{ color: C.gold }}>one man</span>,
            <br />
            one AI agent,
            <br />
            <span style={{ color: C.blue }}>billion-dollar brand.</span>
          </h1>
          <p
            style={{
              marginTop: 28,
              fontSize: 22,
              lineHeight: 1.5,
              color: C.textMuted,
              maxWidth: 760,
            }}
          >
            Sam Altman said it was coming. Chad Dozier built it. From a porch in
            Texas, with 22 athletes, with no venture capital, with one founder
            and one AI agent on his six — AthlynX is the attempt, on the public
            record, to be the first.
          </p>

          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span style={pill}>22 athletes</span>
            <span style={pill}>1 founder</span>
            <span style={pill}>1 AI agent</span>
            <span style={pill}>0 VC dollars</span>
            <span style={pill}>184 pages shipped</span>
            <span style={pill}>Built on a porch</span>
          </div>
        </div>
      </section>

      {/* The prediction */}
      <section style={{ padding: "64px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <SectionLabel>The Prediction</SectionLabel>
          <Quote
            body={
              "In my little group chat with my tech CEO friends there's a betting pool for the first year there is a one-person billion-dollar company."
            }
            attribution="Sam Altman, CEO of OpenAI · 2024"
          />
          <p style={p}>
            Every CEO with money was placing bets. Nobody asked the guy on the
            porch if he was already building it. He was. He is. You're reading it.
          </p>
        </div>
      </section>

      {/* The attempt */}
      <section style={{ padding: "64px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <SectionLabel>The Attempt</SectionLabel>
          <h2 style={h2}>What AthlynX is, in one sentence.</h2>
          <p style={pLarge}>
            ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.
          </p>
          <p style={p}>
            One product, every athlete, every step of the career — youth, high
            school, college, pro, post-career. Profile, recruiting, NIL, brand
            wall, podcast, network streaming, AI wizards, legal, financial,
            scouting, training, life, career. Built as one repo, by one man,
            with one AI agent doing the work that an 80-person engineering org
            would normally need a year and twenty million dollars to ship.
          </p>
        </div>
      </section>

      {/* The math */}
      <section style={{ padding: "64px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <SectionLabel>The Math</SectionLabel>
          <h2 style={h2}>What it would have cost. What it actually cost.</h2>
          <p style={p}>
            A venture-funded build of what is now live at athlynx.ai would have
            burned through a Series A before the first user signed up. Below is
            the back-of-the-napkin ledger. The full dollar-cost analysis ships
            at the end of this thread, signed by the founder.
          </p>

          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            <CostCard
              title="VC-funded version"
              amount="$8M – $14M"
              detail="12-18 months · 25-40 engineers · designer team · PM org · DevOps · legal · ops overhead"
              tone="muted"
            />
            <CostCard
              title="AthlynX actual"
              amount="Bootstrapped"
              detail="One founder · one AI agent · Cloudflare R2 · Neon · Vercel · open-source rails. Numbers in final ledger."
              tone="accent"
            />
            <CostCard
              title="Time to first prod"
              amount="Weeks, not years"
              detail="Profile, signup, onboarding, wizards, legal hub, podcast, network, brand wall — all live and indexed."
              tone="muted"
            />
          </div>
        </div>
      </section>

      {/* The fuel */}
      <section style={{ padding: "64px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <SectionLabel>The Fuel</SectionLabel>
          <h2 style={h2}>My Asperger's, this time, was my fuel — not my downfall.</h2>
          <p style={p}>
            I've fought many mental health battles. This time I focused. This
            time I learned from my mistakes. And my Asperger's — this time —
            was my fuel, not my downfall.
          </p>
          <p style={p}>
            That's why I can see the whole field at once. That's why I can hold
            every athlete, every page, every promise in my head and not let one
            drop. That's why AthlynX exists.
          </p>
          <p style={{ ...p, color: C.text, fontWeight: 600 }}>
            If you're a kid on this platform fighting the same fight — you're
            not broken. You're built different. Use it.
          </p>
          <div style={{ marginTop: 16, fontSize: 13, color: C.textFaint, letterSpacing: 0.6 }}>
            — Chad A. Dozier, Founder
          </div>
        </div>
      </section>

      {/* The calling */}
      <section style={{ padding: "64px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <SectionLabel>The Calling</SectionLabel>
          <h2 style={h2}>God's gift to me. I'm sharing.</h2>
          <p style={p}>
            I didn't pull this out of nowhere. AthlynX was given to me. The
            vision, the strength to keep going, the people who showed up at the
            right time, the focus when I needed it most — all of it. My job is
            to share it.
          </p>
          <p style={p}>
            Every athlete who walks into this platform walks into something I
            was given and built for them.  — always.
          </p>
        </div>
      </section>

      {/* The mission */}
      <section style={{ padding: "64px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <SectionLabel>The Mission</SectionLabel>
          <h2 style={h2}>Built like a gift. Run like a business.</h2>
          <p style={p}>
            AthlynX is a gift in spirit — from a man on a porch to every
            athlete who never had one. Every kid in every small town, every
            walk-on, every backup, every late bloomer, every transfer, every
            kid whose family can't afford the camps and the showcases and the
            advisors. They get the same tools the five-stars get. Same
            recruiting board, same NIL playbook, same AI agent on their six.
          </p>
          <p style={p}>
            Priced so any athlete can afford it. Built so it has to scale.
            That's how a one-man, one-AI brand crosses a billion — not by
            giving away the work, but by giving every athlete access to the
            work.
          </p>
        </div>
      </section>

      {/* The book */}
      <section style={{ padding: "64px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <SectionLabel>The Book</SectionLabel>
          <h2 style={h2}>One Identity. Every Athlete.</h2>
          <p style={p}>
            This page is Chapter One. Every build session is a chapter. Every
            decision Chad made — every late night, every refusal to take the
            easy money, every "no" to the pivot — gets written down here, in
            his words, while it's happening. Not after the fact. While it's
            happening.
          </p>
          <p style={p}>
            When the brand crosses a billion, the book ships. Until then, the
            book builds itself, one commit at a time. The repo is the
            manuscript.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -0.5,
              color: C.gold,
            }}
          >
            I'm just the messenger.
          </div>
          <div
            style={{
              marginTop: 32,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.4,
              color: C.text,
            }}
          >
            If we build it they will come.
            <br />
            The true Field of Dreams in the sports world.
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 14,
              color: C.textFaint,
              letterSpacing: 1,
            }}
          >
            — Chad A. Dozier, Founder · AthlynXAI Corporation
          </div>

          <div style={{ marginTop: 48, fontSize: 12, color: C.textFaint, letterSpacing: 1.5 }}>
            Iron Sharpens Iron — Proverbs 27:17
            <br />
          </div>
        </div>
      </section>

      <MobileBottomNav />
    </div>
  );
}

const pill: React.CSSProperties = {
  background: "#142544",
  border: `1px solid ${C.border}`,
  color: C.textMuted,
  padding: "8px 14px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: 0.4,
};

const p: React.CSSProperties = {
  marginTop: 18,
  fontSize: 17,
  lineHeight: 1.65,
  color: C.textMuted,
};
const pLarge: React.CSSProperties = {
  marginTop: 12,
  fontSize: 22,
  lineHeight: 1.45,
  color: C.text,
  fontWeight: 600,
};
const h2: React.CSSProperties = {
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontWeight: 800,
  fontSize: 36,
  letterSpacing: -0.5,
  margin: "12px 0 0",
  color: C.text,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: C.gold,
        fontSize: 11,
        letterSpacing: 2.5,
        textTransform: "uppercase",
        fontWeight: 800,
      }}
    >
      {children}
    </div>
  );
}

function Quote({ body, attribution }: { body: string; attribution: string }) {
  return (
    <blockquote
      style={{
        marginTop: 16,
        padding: "20px 24px",
        borderLeft: `3px solid ${C.gold}`,
        background: C.surface,
        borderRadius: 4,
      }}
    >
      <div style={{ fontSize: 20, lineHeight: 1.5, color: C.text, fontStyle: "normal" }}>
        “{body}”
      </div>
      <div style={{ marginTop: 12, fontSize: 13, color: C.textFaint, letterSpacing: 0.6 }}>
        {attribution}
      </div>
    </blockquote>
  );
}

function CostCard({
  title,
  amount,
  detail,
  tone,
}: {
  title: string;
  amount: string;
  detail: string;
  tone: "muted" | "accent";
}) {
  const border = tone === "accent" ? C.gold : C.border;
  const amountColor = tone === "accent" ? C.gold : C.text;
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${border}`,
        borderRadius: 8,
        padding: 20,
      }}
    >
      <div
        style={{
          color: C.textFaint,
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 28,
          fontWeight: 800,
          color: amountColor,
          letterSpacing: -0.5,
        }}
      >
        {amount}
      </div>
      <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.5, color: C.textMuted }}>
        {detail}
      </div>
    </div>
  );
}

export default function TheFirst() {
  return (
    <RouteErrorBoundary>
      <PlatformLayout>
        <TheFirstInner />
      </PlatformLayout>
    </RouteErrorBoundary>
  );
}
