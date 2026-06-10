/**
 * AthletePageBackground — sitewide cinematic athlete backdrop
 *
 * Per Chad Dozier doctrine: athletes ARE the platform. Every page honors them
 * visually. Cobalt #1E90FF + true black + white. No yellow, gold, amber, or orange.
 *
 * Picks the right athlete image based on the current route, fades to true black
 * so foreground content stays fully readable. Sits behind everything via
 * z-index 0 inside a position:relative container.
 *
 * Usage: dropped automatically inside PlatformLayout. For pages that don't use
 * PlatformLayout, wrap your page root with <AthletePageBackground>.
 */
import { useLocation } from "wouter";
import { useMemo } from "react";

type BackgroundChoice = {
  /** Path under client/public */
  src: string;
  /** CSS object-position fine-tune so faces/numbers stay visible */
  objectPosition?: string;
  /** Optional darker tint for content-heavy pages */
  tintOpacity?: number;
};

const SITEWIDE_FALLBACK: BackgroundChoice = {
  src: "/media/championship-brand/episode-2/scene01-multisport-walkout.png",
  objectPosition: "50% 38%",
};

// Route → background choice. First matching prefix wins. Keep specific routes
// above generic ones. Add new routes as the platform grows.
const ROUTE_BACKGROUNDS: Array<{ match: (p: string) => boolean; bg: BackgroundChoice }> = [
  //  Sports-specific surfaces 
  { match: (p) => p.startsWith("/sports/baseball") || p.includes("baseball") || p.includes("diamond-grind"), bg: { src: "/athlete-baseball.jpg" } },
  { match: (p) => p.startsWith("/sports/football") || p.includes("football") || p.includes("gridiron"), bg: { src: "/athlete-football.jpg" } },
  { match: (p) => p.startsWith("/sports/basketball") || p.includes("basketball") || p.includes("court-kings"), bg: { src: "/athlete-basketball.jpg" } },
  { match: (p) => p.startsWith("/sports/soccer") || p.includes("soccer") || p.includes("pitch-pulse"), bg: { src: "/athlete-soccer.jpg" } },
  { match: (p) => p.startsWith("/sports/track") || p.includes("track-elite") || p.includes("cross-country"), bg: { src: "/brand/track-sprint-athlete.jpg" } },
  { match: (p) => p.startsWith("/sports/swim") || p.includes("swim-surge"), bg: { src: "/img-swimming-hero.jpg" } },
  { match: (p) => p.startsWith("/sports/tennis") || p.startsWith("/sports/pickleball") || p.includes("racket-kings"), bg: { src: "/img-tennis-hero.jpg" } },
  { match: (p) => p.startsWith("/sports/wrestling") || p.startsWith("/sports/boxing") || p.includes("mat-warriors"), bg: { src: "/img-wrestling-hero.jpg" } },
  { match: (p) => p.startsWith("/sports/volleyball") || p.includes("net-setters"), bg: { src: "/img-volleyball-hero.jpg" } },
  { match: (p) => p.startsWith("/sports/hockey") || p.includes("ice-breakers"), bg: { src: "/img-hockey-hero.jpg" } },

  //  Brackets / championship surfaces 
  { match: (p) => p.startsWith("/brackets") || p.includes("road-to-omaha") || p.includes("college-world-series"), bg: { src: "/brand/championship-ring-1.jpg" } },
  { match: (p) => p.includes("march-madness") || p.includes("draft-2026"), bg: { src: "/champion-hero.jpg" } },

  //  Athlete OS — career, journey, profile 
  { match: (p) => p.includes("athlete-journey") || p === "/journey", bg: { src: "/brand/athlete-leap.jpg", objectPosition: "50% 30%" } },
  { match: (p) => p.includes("athlete-card") || p === "/card", bg: { src: "/brand/pantheon-corporation-banner.jpg" } },
  { match: (p) => p.includes("athlete-career") || p.includes("athlete-lifecycle"), bg: { src: "/img-athlete-multisport.jpg" } },
  { match: (p) => p.includes("athlete-health") || p.includes("digital-health") || p.includes("gluco-athlete"), bg: { src: "/athlete-training.jpg" } },
  { match: (p) => p.includes("playbook"), bg: { src: "/brand/athletes-playbook-key-art.jpg" } },

  //  NIL surfaces 
  { match: (p) => p.includes("nil-vault") || p.includes("nil-portal") || p.includes("nil-calculator") || p.startsWith("/nil"), bg: { src: "/brand/ai-engine-portal.jpg", tintOpacity: 0.78 } },
  { match: (p) => p.includes("transfer-portal"), bg: { src: "/brand/pantheon-hero-1.jpg" } },
  { match: (p) => p.includes("recruiting"), bg: { src: "/brand/ai-engine-pillars.jpg" } },

  //  AI / OS surfaces 
  { match: (p) => p.includes("ai-recruiter"), bg: { src: "/brand/ai-engine-brain.jpg" } },
  { match: (p) => p.includes("ai-sales") || p.includes("ai-content"), bg: { src: "/brand/ai-engine-neural-tree.jpg" } },
  { match: (p) => p.includes("trainer-bot") || p.includes("training"), bg: { src: "/brand/ai-engine-energy.jpg" } },
  { match: (p) => p.includes("operating-layer") || p.includes("athlynxai-os") || p.includes("intelligence-os"), bg: { src: "/brand/ai-engine-pillars.jpg" } },
  { match: (p) => p.includes("connector") || p.includes("layer-cake") || p.includes("full-stack"), bg: { src: "/brand/ai-tsunami-wave.jpg" } },

  //  Studio / media surfaces 
  { match: (p) => p.includes("studio") || p.includes("podcast") || p.includes("highlight-reel") || p.includes("axn"), bg: { src: "/brand/athletes-playbook-stadium.jpg" } },

  //  Marketplace / store / gear 
  { match: (p) => p.includes("marketplace") || p === "/store" || p.includes("athlete-store") || p.includes("vendor"), bg: { src: "/brand/gear-hoodie-shoes-bottle.jpg" } },
  { match: (p) => p.includes("diamond-grind-store") || p.includes("baseball-equipment"), bg: { src: "/media/championship-brand/episode-2/scene04-baseball-softball.png" } },
  { match: (p) => p.includes("football-store") || p.includes("football-equipment"), bg: { src: "/brand/gear-helmet-pads.jpg" } },

  //  Founder / investor / corporate 
  { match: (p) => p.includes("founder") || p.includes("about"), bg: { src: "/landing/ecosystem/athlynx-team-walkout.png" } },
  { match: (p) => p.includes("investor") || p.includes("pitch-deck"), bg: { src: "/brand/pantheon-corporation-banner.jpg" } },
  { match: (p) => p.includes("dhg") || p.includes("dozier") || p.includes("doctrine"), bg: { src: "/brand/dhg-empire-hero.png" } },

  //  Admin / dashboard / settings 
  { match: (p) => p.startsWith("/admin") || p.includes("master-admin") || p.includes("crm"), bg: { src: "/img-athlete-multisport.jpg", tintOpacity: 0.82 } },
  { match: (p) => p.includes("dashboard") || p === "/feed" || p === "/profile" || p === "/me" || p.includes("settings") || p.includes("notifications") || p.includes("messages"), bg: { src: "/landing/ecosystem/athlynxai-playbook-team.png", tintOpacity: 0.78 } },
];

function pickBackground(pathname: string): BackgroundChoice {
  const lower = pathname.toLowerCase();
  for (const rule of ROUTE_BACKGROUNDS) {
    if (rule.match(lower)) return rule.bg;
  }
  return SITEWIDE_FALLBACK;
}

interface AthletePageBackgroundProps {
  /** Override the route-based choice. Use only when you need a specific image. */
  forceSrc?: string;
  /** Tint opacity 0..1 — higher = more black for content-heavy pages */
  tintOpacity?: number;
  /** Whether the radial cobalt glow appears */
  glow?: boolean;
}

export default function AthletePageBackground({ forceSrc, tintOpacity, glow = true }: AthletePageBackgroundProps) {
  const [location] = useLocation();
  const choice = useMemo(() => {
    if (forceSrc) return { src: forceSrc } as BackgroundChoice;
    return pickBackground(location || "/");
  }, [location, forceSrc]);

  const tint = tintOpacity ?? choice.tintOpacity ?? 0.72;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#000000",
      }}
    >
      <img
        src={choice.src}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: choice.objectPosition || "center",
          opacity: 0.32,
          filter: "saturate(115%) contrast(105%)",
        }}
      />
      {/* True black tint so content remains readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${tint})`,
        }}
      />
      {/* Cobalt vignette for brand cohesion */}
      {glow && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 80% at 50% 30%, rgba(30,144,255,0.10) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.85) 100%)",
          }}
        />
      )}
      {/* Subtle bottom-to-top fade so footer regions sit on pure black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(0,0,0,0.72) 85%, rgba(0,0,0,1) 100%)",
        }}
      />
    </div>
  );
}
