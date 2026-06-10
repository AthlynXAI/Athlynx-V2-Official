import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";

// /build-decisions — visible product ledger.
// Every locked decision Chad made in Build 3, in his words, on the public record.

const C = {
  bg: "#0A1628",
  surface: "#0F1E36",
  border: "#1F3257",
  gold: "#D4AF37",
  blue: "#00A3FF",
  text: "#FFFFFF",
  textMuted: "#B7C3D9",
  textFaint: "#6B7A99",
  green: "#437A22",
};

type Decision = {
  category: string;
  title: string;
  decision: string;
  status: "shipped" | "in_progress" | "next";
  notes?: string;
};

const DECISIONS: Decision[] = [
  // Identity
  {
    category: "Identity",
    title: "Tagline (locked)",
    decision: "ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.",
    status: "shipped",
  },
  {
    category: "Identity",
    title: "Brand voice",
    decision: "Man on a porch telling the truth. Never marketing-speak. Never family disclosures.",
    status: "shipped",
  },
  {
    category: "Identity",
    title: "Brand closers (every page, every doc)",
    decision: "Iron Sharpens Iron — Proverbs 27:17.   Always.",
    status: "shipped",
  },

  // Founder presence
  {
    category: "Founder Presence",
    title: "Founder hub at /founder",
    decision: "Chad's stage. Pinned note, lessons feed, podcast catalog. Live in prod.",
    status: "shipped",
    notes: "PR #9",
  },
  {
    category: "Founder Presence",
    title: "/the-first monument page",
    decision: "Permanent public-record claim of the first one-man, one-AI billion-dollar brand attempt. With Asperger's framing in Chad's words.",
    status: "shipped",
  },
  {
    category: "Founder Presence",
    title: "Founder badge on profile hero",
    decision: "isFounder=true users get a visible badge platform-wide. Chad is user 43, set.",
    status: "shipped",
  },

  // Editable Everywhere
  {
    category: "Editable Everywhere",
    title: "Inline edit on hero fields",
    decision: "Click any hero field to edit in place. Enter saves. Esc cancels.",
    status: "shipped",
  },
  {
    category: "Editable Everywhere",
    title: "Pencil sheets per section",
    decision: "Identity, School, Measurements, Academics, Bio, Socials, Cover photo — each opens its own edit drawer.",
    status: "shipped",
  },
  {
    category: "Editable Everywhere",
    title: "Avatar + cover photo picker",
    decision: "Curated library (sport-aware) OR upload from device. R2-hosted. Persists avatarChoiceKey / coverChoiceKey for analytics.",
    status: "shipped",
  },

  // Top 5 Schools
  {
    category: "Top 5 Schools Ladder",
    title: "Direction toggle",
    decision: "Athlete picks countdown (5→1) or top-down (1→5). One click to flip.",
    status: "shipped",
  },
  {
    category: "Top 5 Schools Ladder",
    title: "Assign / swap from board",
    decision: "Each slot pulls from the athlete's existing recruiting board entries. Swap auto-handles rank conflicts.",
    status: "shipped",
  },
  {
    category: "Top 5 Schools Ladder",
    title: "Letter upload + visibility",
    decision: "PDF or image. Letter type (offer / commitment / interest / NCAA LOI / camp invite). Per-letter public or private toggle.",
    status: "shipped",
  },

  // AthlynX Network + Brand Wall + Podcast
  {
    category: "AthlynX Network",
    title: "Streaming hub",
    decision: "Cloudflare Stream behind a StreamProvider interface. Swappable to Mux later without touching app code.",
    status: "shipped",
    notes: "PR #9",
  },
  {
    category: "AthlynX Brand Wall",
    title: "Platform-wide endorsement board",
    decision: "Auto-tiered Iconic / Major / Regional / Local. Founder approves brand submissions.",
    status: "shipped",
    notes: "PR #9",
  },
  {
    category: "Founder Podcast",
    title: "Audio + video pipeline",
    decision: "R2 audio. Cloudflare Stream video. RSS feed at /founder/podcast/rss.xml.",
    status: "shipped",
    notes: "Podcast name still undecided: Iron Sharpens Iron / Backyard to Billion / Porch Talk.",
  },

  // AI + Legal
  {
    category: "AI Wizards",
    title: "Eight wizards live",
    decision: "Agent, Lawyer, Financial, Scholarship, Scout, Transfer, Life, Career — all behind /wizards.",
    status: "shipped",
    notes: "PR #8",
  },
  {
    category: "Legal Hub",
    title: "Full legal package",
    decision: "NCNDA, DHG Trust, Operating Agreement, Will, Partner Employment, Startup Equity, Softmor, IP Portfolio, Corporate Structure, CementCo, Master SOW, Youth Sports Analysis — all at /legal-hub.",
    status: "shipped",
    notes: "PR #8",
  },

  // Sport parity
  {
    category: "Sport Parity",
    title: "Women's + men's first-class",
    decision: "No separate flags, no separate code paths. Both treated as first-class throughout the data model.",
    status: "shipped",
  },

  // Mission
  {
    category: "Mission",
    title: "Athletes get access, not free",
    decision: "Built like a gift, run like a business. Priced so any athlete can afford it. Scales so the brand reaches a billion.",
    status: "shipped",
  },

  // What's next
  {
    category: "Doctrine",
    title: "Founder-voice narrative rewrites",
    decision: "Public-facing pages rewritten to match the small-circle doctrine — family detail stays private, work stays public, no boast.",
    status: "shipped",
  },
  {
    category: "Next Up",
    title: "Mobile app parity",
    decision: "Expo screens for Founder, Network, Brand Wall, Podcast to match web prod.",
    status: "next",
  },
  {
    category: "Next Up",
    title: "True dollar-cost ledger",
    decision: "End-of-thread deliverable: AthlynX bootstrapped valuation vs venture-funded build cost.",
    status: "next",
  },
];

function StatusPill({ status }: { status: Decision["status"] }) {
  const color =
    status === "shipped" ? C.green : status === "in_progress" ? C.gold : C.blue;
  const label =
    status === "shipped"
      ? "SHIPPED"
      : status === "in_progress"
      ? "IN PROGRESS"
      : "NEXT";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 9px",
        borderRadius: 999,
        background: status === "shipped" ? "rgba(67,122,34,0.15)" : "transparent",
        border: `1px solid ${color}`,
        color,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 1.2,
      }}
    >
      {status === "shipped" ? <CheckCircle2 style={{ width: 11, height: 11 }} /> : null}
      {label}
    </span>
  );
}

function BuildDecisionsInner() {
  // Group by category preserving array order.
  const grouped: Array<{ category: string; items: Decision[] }> = [];
  for (const d of DECISIONS) {
    const last = grouped[grouped.length - 1];
    if (last && last.category === d.category) last.items.push(d);
    else grouped.push({ category: d.category, items: [d] });
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
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
            maxWidth: 1100,
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
            The product ledger
          </div>
        </div>
      </header>

      <section style={{ padding: "56px 24px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div
            style={{
              color: C.gold,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 800,
            }}
          >
            Build Decisions
          </div>
          <h1
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 48,
              letterSpacing: -1,
              margin: "12px 0 0",
              lineHeight: 1.05,
            }}
          >
            Exactly what I chose.
          </h1>
          <p
            style={{
              marginTop: 16,
              fontSize: 18,
              color: C.textMuted,
              maxWidth: 720,
              lineHeight: 1.5,
            }}
          >
            Every decision, in plain language, on the record. Shipped means it's
            live in production right now. Next means it's queued. Nothing on this
            page is a maybe.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 24px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {grouped.map(group => (
            <div key={group.category} style={{ marginTop: 32 }}>
              <h2
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  margin: 0,
                  marginBottom: 12,
                  color: C.gold,
                  letterSpacing: -0.3,
                }}
              >
                {group.category}
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 12,
                }}
              >
                {group.items.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 700,
                          color: C.text,
                          letterSpacing: -0.2,
                        }}
                      >
                        {d.title}
                      </h3>
                      <StatusPill status={d.status} />
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: C.textMuted,
                        fontSize: 14,
                        lineHeight: 1.55,
                      }}
                    >
                      {d.decision}
                    </p>
                    {d.notes ? (
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 11,
                          color: C.textFaint,
                          letterSpacing: 0.5,
                        }}
                      >
                        {d.notes}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "32px 24px 64px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.textFaint, letterSpacing: 1.5 }}>
            Iron Sharpens Iron — Proverbs 27:17
            <br />
          </div>
        </div>
      </section>

      <MobileBottomNav />
    </div>
  );
}

export default function BuildDecisions() {
  return (
    <RouteErrorBoundary>
      <PlatformLayout>
        <BuildDecisionsInner />
      </PlatformLayout>
    </RouteErrorBoundary>
  );
}
