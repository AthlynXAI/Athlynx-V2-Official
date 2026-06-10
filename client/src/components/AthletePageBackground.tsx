/**
 * AthletePageBackground.tsx
 * Global background system — applied to ALL 252+ pages automatically.
 *
 * PALETTE: Cobalt #0047AB · Granite #1c2333 · Electric Blue #00c2ff · Stadium Lights #e8f4ff
 * DOCTRINE: Iron Sharpens Iron — Proverbs 27:17 — Be The Legacy
 *
 * © 2026 Chad Allen Dozier Sr.
 * AthlynX™ · AthlynXAI™ · AXN™ · AVN™ · Diamond Grind™ · Dozier Holdings Group™
 * All Rights Reserved. The Dozier name is on every page. Forever.
 *
 * SEASONAL INTELLIGENCE:
 *   Summer 2026  → Baseball/Softball · Road to Omaha · MCWS · Diamond Grind (HERO NOW)
 *   Fall 2026    → Football · Volleyball · Soccer · Gymnastics · Cheer
 *   Winter 2026  → Basketball · Wrestling · Ice Hockey · Band
 *   Spring 2027  → Baseball returns · Lacrosse · Tennis · Rowing
 */

import { useMemo } from "react";
import { useLocation } from "wouter";

// ─── BRAND CONSTANTS ──────────────────────────────────────────────────────────
const COBALT        = "#0047AB";
const COBALT_DARK   = "#002f7a";
const GRANITE_DARK  = "#0d1117";
const GRANITE       = "#1c2333";
const ELECTRIC      = "#0066ff";
const BRIGHT        = "#00c2ff";
const STADIUM       = "#e8f4ff";

// ─── SEASONAL DETECTION ───────────────────────────────────────────────────────
function getCurrentSeason(): "baseball" | "football" | "basketball" | "spring" {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 7)  return "baseball";   // Mar–Jul: Diamond Grind / Road to Omaha
  if (month >= 8 && month <= 11) return "football";   // Aug–Nov: Gridiron Nexus
  if (month === 12 || month <= 2) return "basketball"; // Dec–Feb: Court Kings
  return "spring";
}

// ─── BACKGROUND CHOICE TYPE ───────────────────────────────────────────────────
interface BackgroundChoice {
  src: string;
  tintOpacity?: number;
  objectPosition?: string;
  season?: string;
}

// ─── SITEWIDE FALLBACK — Stadium Lights + Athletes ────────────────────────────
const SITEWIDE_FALLBACK: BackgroundChoice = {
  src: "/media/championship-brand/episode-2/scene01-multisport-walkout.png",
  tintOpacity: 0.72,
  objectPosition: "center top",
};

// ─── ROUTE → BACKGROUND RULES ─────────────────────────────────────────────────
// Priority: first match wins.
// Images used: all 10 championship-brand scenes + brand folder + public root
const ROUTE_BACKGROUNDS: Array<{ match: (p: string) => boolean; bg: BackgroundChoice }> = [

  // ── HERO / HOME / LANDING ──────────────────────────────────────────────────
  { match: (p) => p === "/" || p === "/home" || p === "/welcome" || p === "/landing",
    bg: { src: "/media/championship-brand/episode-2/scene01-multisport-walkout.png", tintOpacity: 0.65, objectPosition: "center top" } },

  // ── ROAD TO OMAHA / MCWS / DIAMOND GRIND — THE HONEY ─────────────────────
  { match: (p) => p.includes("road-to-omaha") || p.includes("mcws") || p.includes("college-world-series"),
    bg: { src: "/media/championship-brand/episode-2/scene04-baseball-softball.png", tintOpacity: 0.60, objectPosition: "center" } },
  { match: (p) => p.includes("diamond-grind"),
    bg: { src: "/media/championship-brand/episode-2/scene04-baseball-softball.png", tintOpacity: 0.62, objectPosition: "center" } },
  { match: (p) => p.includes("baseball") || p.includes("softball") || p.includes("pitch-pulse"),
    bg: { src: "/media/championship-brand/episode-2/scene04-baseball-softball.png", tintOpacity: 0.68, objectPosition: "center" } },

  // ── FOOTBALL ──────────────────────────────────────────────────────────────
  { match: (p) => p.includes("gridiron") || p.includes("football"),
    bg: { src: "/media/championship-brand/episode-2/scene03-football-equipment.png", tintOpacity: 0.65, objectPosition: "center" } },

  // ── BASKETBALL ────────────────────────────────────────────────────────────
  { match: (p) => p.includes("court-kings") || p.includes("basketball"),
    bg: { src: "/brand/gear-basketball-jersey.jpg", tintOpacity: 0.68, objectPosition: "center" } },

  // ── CHEERLEADING / GYMNASTICS / BAND ──────────────────────────────────────
  { match: (p) => p.includes("cheer") || p.includes("gymnastics") || p.includes("band") || p.includes("marching"),
    bg: { src: "/media/championship-brand/episode-2/scene06-women-led-multisport.png", tintOpacity: 0.65, objectPosition: "center top" } },

  // ── ALL WOMEN-LED / FEMALE SPORTS ─────────────────────────────────────────
  { match: (p) => p.includes("softball") || p.includes("volleyball") || p.includes("field-hockey") || p.includes("net-setters"),
    bg: { src: "/media/championship-brand/episode-2/scene06-women-led-multisport.png", tintOpacity: 0.68, objectPosition: "center" } },

  // ── GEAR / EQUIPMENT ──────────────────────────────────────────────────────
  { match: (p) => p.includes("gear") || p.includes("equipment") || p.includes("cleats") || p.includes("gloves"),
    bg: { src: "/media/championship-brand/episode-2/scene07-cleats-gloves-balls.png", tintOpacity: 0.68, objectPosition: "center" } },
  { match: (p) => p.includes("helmet") || p.includes("bag") || p.includes("hat") || p.includes("eyewear") || p.includes("eye-black"),
    bg: { src: "/media/championship-brand/episode-2/scene08-helmet-bag-hat-eyewear.png", tintOpacity: 0.68, objectPosition: "center" } },

  // ── STORE / MARKETPLACE / VENDOR ──────────────────────────────────────────
  { match: (p) => p.includes("store") || p.includes("marketplace") || p.includes("vendor") || p.includes("commerce") || p.includes("shop"),
    bg: { src: "/media/championship-brand/episode-2/scene09-live-store-marketplace.png", tintOpacity: 0.68, objectPosition: "center" } },

  // ── BRAND WALL / FINAL BRAND ──────────────────────────────────────────────
  { match: (p) => p.includes("brand") || p.includes("doctrine") || p.includes("manifesto") || p.includes("legacy"),
    bg: { src: "/media/championship-brand/episode-2/scene10-final-brand-wall.png", tintOpacity: 0.65, objectPosition: "center" } },

  // ── TRAINING / RETAIL ─────────────────────────────────────────────────────
  { match: (p) => p.includes("training") || p.includes("trainer") || p.includes("workout") || p.includes("fitness"),
    bg: { src: "/media/championship-brand/episode-2/scene05-training-retail.png", tintOpacity: 0.70, objectPosition: "center" } },

  // ── BRANDED GEAR WALL ─────────────────────────────────────────────────────
  { match: (p) => p.includes("gear-wall") || p.includes("collection") || p.includes("apparel"),
    bg: { src: "/media/championship-brand/episode-2/scene02-branded-gear-wall.png", tintOpacity: 0.68, objectPosition: "center" } },

  // ── NIL / PORTAL / FINANCIAL ──────────────────────────────────────────────
  { match: (p) => p.includes("nil") || p.startsWith("/nil") || p.includes("financial") || p.includes("billing") || p.includes("pricing"),
    bg: { src: "/brand/ai-engine-portal.jpg", tintOpacity: 0.78 } },

  // ── TRANSFER PORTAL ───────────────────────────────────────────────────────
  { match: (p) => p.includes("transfer-portal"),
    bg: { src: "/brand/pantheon-hero-1.jpg", tintOpacity: 0.72 } },

  // ── RECRUITING ────────────────────────────────────────────────────────────
  { match: (p) => p.includes("recruiting") || p.includes("recruiter") || p.includes("browse-athletes"),
    bg: { src: "/brand/ai-engine-pillars.jpg", tintOpacity: 0.72 } },

  // ── AI / OS SURFACES ──────────────────────────────────────────────────────
  { match: (p) => p.includes("athlynxai-os") || p.includes("operating-layer") || p.includes("intelligence-os"),
    bg: { src: "/brand/ai-engine-pillars.jpg", tintOpacity: 0.75 } },
  { match: (p) => p.includes("ai-recruiter") || p.includes("ai-sales") || p.includes("ai-content") || p.includes("ai-trainer"),
    bg: { src: "/brand/ai-engine-brain.jpg", tintOpacity: 0.75 } },
  { match: (p) => p.includes("connector") || p.includes("layer-cake") || p.includes("full-stack"),
    bg: { src: "/brand/ai-tsunami-wave.jpg", tintOpacity: 0.75 } },
  { match: (p) => p.includes("engine") || p.includes("athlynx-engine"),
    bg: { src: "/brand/ai-engine-energy.jpg", tintOpacity: 0.75 } },

  // ── STUDIO / MEDIA / PODCAST / AXN / AVN ─────────────────────────────────
  { match: (p) => p.includes("studio") || p.includes("podcast") || p.includes("highlight-reel") || p.includes("axn") || p.includes("avn") || p.includes("network") || p.includes("broadcast"),
    bg: { src: "/brand/athletes-playbook-stadium.jpg", tintOpacity: 0.68, objectPosition: "center top" } },

  // ── SOCIAL / FEED / REELS / MESSAGES ─────────────────────────────────────
  { match: (p) => p === "/feed" || p.includes("social") || p.includes("reels") || p.includes("messages") || p.includes("messenger"),
    bg: { src: "/media/championship-brand/episode-2/scene01-multisport-walkout.png", tintOpacity: 0.72, objectPosition: "center top" } },

  // ── EVENTS / TOURNAMENTS / COMPETITIONS / SHOWCASES ──────────────────────
  { match: (p) => p.includes("event") || p.includes("tournament") || p.includes("competition") || p.includes("showcase") || p.includes("signing-day") || p.includes("brackets"),
    bg: { src: "/brand/athletes-playbook-stadium.jpg", tintOpacity: 0.68, objectPosition: "center" } },

  // ── CALENDAR / SCHEDULE ───────────────────────────────────────────────────
  { match: (p) => p.includes("calendar") || p.includes("schedule") || p.includes("booking"),
    bg: { src: "/brand/stadium-architecture-1.jpg", tintOpacity: 0.75 } },

  // ── ATHLETE PROFILE / DASHBOARD / JOURNEY ────────────────────────────────
  { match: (p) => p.includes("dashboard") || p.includes("profile") || p === "/me" || p.includes("athlete-journey") || p.includes("athlete-life"),
    bg: { src: "/media/championship-brand/episode-2/scene01-multisport-walkout.png", tintOpacity: 0.75, objectPosition: "center top" } },

  // ── STATS / ANALYTICS / DATA ──────────────────────────────────────────────
  { match: (p) => p.includes("stats") || p.includes("analytics") || p.includes("data") || p.includes("scouting") || p.includes("rankings"),
    bg: { src: "/brand/ai-engine-neural-tree.jpg", tintOpacity: 0.75 } },

  // ── HEALTH / WELLNESS / MEDICAL ───────────────────────────────────────────
  { match: (p) => p.includes("health") || p.includes("wellness") || p.includes("medical") || p.includes("gluco"),
    bg: { src: "/brand/ai-engine-orb.jpg", tintOpacity: 0.78 } },

  // ── FAITH / MINDSET ───────────────────────────────────────────────────────
  { match: (p) => p.includes("faith") || p.includes("mindset") || p.includes("serenity") || p.includes("memorial"),
    bg: { src: "/brand/speed-rocket-launch.jpg", tintOpacity: 0.80 } },

  // ── FOUNDER / ABOUT / DOZIER LEGACY ──────────────────────────────────────
  { match: (p) => p.includes("founder") || p.includes("about") || p.includes("dozier") || p.includes("chad"),
    bg: { src: "/landing/ecosystem/athlynx-team-walkout.png", tintOpacity: 0.65, objectPosition: "center top" } },

  // ── INVESTOR / PITCH / CORPORATE ──────────────────────────────────────────
  { match: (p) => p.includes("investor") || p.includes("pitch") || p.includes("corporate") || p.includes("empire"),
    bg: { src: "/brand/pantheon-corporation-banner.jpg", tintOpacity: 0.72 } },

  // ── DHG / DOZIER HOLDINGS ─────────────────────────────────────────────────
  { match: (p) => p.includes("dhg") || p.includes("dozier-holdings") || p.includes("doctrine"),
    bg: { src: "/brand/dhg-empire-hero.png", tintOpacity: 0.70 } },

  // ── ADMIN / CRM / BACK OFFICE ─────────────────────────────────────────────
  { match: (p) => p.startsWith("/admin") || p.includes("master-admin") || p.includes("crm") || p.includes("employee"),
    bg: { src: "/media/championship-brand/episode-2/scene10-final-brand-wall.png", tintOpacity: 0.82 } },

  // ── LEGAL / COMPLIANCE / PRIVACY ──────────────────────────────────────────
  { match: (p) => p.includes("legal") || p.includes("privacy") || p.includes("terms") || p.includes("compliance") || p.includes("hipaa"),
    bg: { src: "/brand/stadium-architecture-2.jpg", tintOpacity: 0.85 } },

  // ── SIGN IN / SIGN UP / ONBOARDING ────────────────────────────────────────
  { match: (p) => p.includes("sign") || p.includes("login") || p.includes("register") || p.includes("onboarding") || p.includes("early-access"),
    bg: { src: "/media/championship-brand/episode-2/scene01-multisport-walkout.png", tintOpacity: 0.70, objectPosition: "center top" } },

  // ── VETERANS / MILITARY ───────────────────────────────────────────────────
  { match: (p) => p.includes("veteran") || p.includes("military"),
    bg: { src: "/brand/speed-jet-trail.jpg", tintOpacity: 0.75 } },

  // ── MULTISPORT / ALL SPORTS HUB ───────────────────────────────────────────
  { match: (p) => p.includes("all-sports") || p.includes("multisport") || p.includes("sports"),
    bg: { src: "/media/championship-brand/episode-2/scene01-multisport-walkout.png", tintOpacity: 0.68, objectPosition: "center top" } },

  // ── TRACK / SWIMMING / CROSS COUNTRY ─────────────────────────────────────
  { match: (p) => p.includes("track") || p.includes("swim") || p.includes("cross-country"),
    bg: { src: "/brand/track-sprint-athlete.jpg", tintOpacity: 0.68 } },

  // ── WRESTLING / MAT WARRIORS ──────────────────────────────────────────────
  { match: (p) => p.includes("wrestling") || p.includes("mat-warriors"),
    bg: { src: "/media/championship-brand/episode-2/scene03-football-equipment.png", tintOpacity: 0.70 } },

  // ── LACROSSE / FIELD HOCKEY / RUGBY / ROWING ─────────────────────────────
  { match: (p) => p.includes("lacrosse") || p.includes("field-hockey") || p.includes("rugby") || p.includes("rowing"),
    bg: { src: "/media/championship-brand/episode-2/scene06-women-led-multisport.png", tintOpacity: 0.68 } },

  // ── GOLF / TENNIS / RACKET ────────────────────────────────────────────────
  { match: (p) => p.includes("golf") || p.includes("fairway") || p.includes("tennis") || p.includes("racket"),
    bg: { src: "/brand/speed-rocket-car.jpg", tintOpacity: 0.72 } },

  // ── FISHING / HUNTING / OUTDOOR ───────────────────────────────────────────
  { match: (p) => p.includes("reel-masters") || p.includes("hunt-pro") || p.includes("outdoor"),
    bg: { src: "/brand/ai-engine-energy.jpg", tintOpacity: 0.75 } },

  // ── ESPORTS / ROBOTICS / TECH ─────────────────────────────────────────────
  { match: (p) => p.includes("esports") || p.includes("robotics") || p.includes("quantum") || p.includes("bitcoin"),
    bg: { src: "/brand/ai-wave-vortex.jpg", tintOpacity: 0.75 } },

  // ── NOTIFICATIONS / SETTINGS ──────────────────────────────────────────────
  { match: (p) => p.includes("notification") || p.includes("settings"),
    bg: { src: "/brand/stadium-architecture-3.jpg", tintOpacity: 0.82 } },

  // ── COMMS / MESSAGES ──────────────────────────────────────────────────────
  { match: (p) => p.includes("comms") || p.includes("message"),
    bg: { src: "/media/championship-brand/episode-2/scene01-multisport-walkout.png", tintOpacity: 0.75 } },

  // ── REALTY / BLUE COLLAR / VETERANS ──────────────────────────────────────
  { match: (p) => p.includes("realty") || p.includes("blue-collar") || p.includes("softmor"),
    bg: { src: "/brand/dhg-empire-hero.png", tintOpacity: 0.75 } },
];

// ─── ROUTE PICKER ─────────────────────────────────────────────────────────────
function pickBackground(pathname: string): BackgroundChoice {
  const lower = pathname.toLowerCase();
  for (const rule of ROUTE_BACKGROUNDS) {
    if (rule.match(lower)) return rule.bg;
  }
  return SITEWIDE_FALLBACK;
}

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface AthletePageBackgroundProps {
  forceSrc?: string;
  tintOpacity?: number;
  glow?: boolean;
  showWatermark?: boolean;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function AthletePageBackground({
  forceSrc,
  tintOpacity,
  glow = true,
  showWatermark = true,
}: AthletePageBackgroundProps) {
  const [location] = useLocation();
  const season = getCurrentSeason();

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
        backgroundColor: GRANITE_DARK,
      }}
    >
      {/* ── ATHLETE PHOTO LAYER ─────────────────────────────────────────── */}
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
          opacity: 0.38,
          filter: "saturate(120%) contrast(108%) brightness(0.92)",
        }}
      />

      {/* ── COBALT GRANITE BASE TINT ────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(13, 17, 23, ${tint})`,
        }}
      />

      {/* ── STADIUM LIGHTS — top beam effect ────────────────────────────── */}
      {glow && (
        <>
          {/* Left stadium beam */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              width: "3px",
              height: "60%",
              background: `linear-gradient(180deg, ${BRIGHT}30 0%, transparent 100%)`,
              transform: "rotate(-8deg)",
              transformOrigin: "top center",
              filter: "blur(8px)",
            }}
          />
          {/* Center stadium beam */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "48%",
              width: "4px",
              height: "55%",
              background: `linear-gradient(180deg, ${STADIUM}20 0%, transparent 100%)`,
              transform: "rotate(2deg)",
              transformOrigin: "top center",
              filter: "blur(10px)",
            }}
          />
          {/* Right stadium beam */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: "15%",
              width: "3px",
              height: "60%",
              background: `linear-gradient(180deg, ${BRIGHT}30 0%, transparent 100%)`,
              transform: "rotate(8deg)",
              transformOrigin: "top center",
              filter: "blur(8px)",
            }}
          />
          {/* Cobalt radial glow from top */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(120% 70% at 50% 0%, ${COBALT}25 0%, rgba(0,0,0,0) 65%)`,
            }}
          />
          {/* Electric blue horizon line */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: 0,
              right: 0,
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, ${BRIGHT}15 30%, ${ELECTRIC}20 50%, ${BRIGHT}15 70%, transparent 100%)`,
            }}
          />
        </>
      )}

      {/* ── BOTTOM FADE TO PURE GRANITE ─────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, transparent 0%, transparent 50%, ${GRANITE_DARK}b0 80%, ${GRANITE_DARK} 100%)`,
        }}
      />

      {/* ── DOZIER / ATHLYNX WATERMARK MURAL ───────────────────────────── */}
      {showWatermark && (
        <>
          {/* AthlynX wordmark — large diagonal watermark */}
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              right: "-2%",
              fontSize: "clamp(48px, 10vw, 120px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: `${BRIGHT}06`,
              fontFamily: "system-ui, -apple-system, sans-serif",
              userSelect: "none",
              whiteSpace: "nowrap",
              transform: "rotate(-8deg)",
              transformOrigin: "bottom right",
              lineHeight: 1,
            }}
          >
            ATHLYNX™
          </div>

          {/* DOZIER name — center mural */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-12deg)",
              fontSize: "clamp(60px, 14vw, 180px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: `${COBALT}08`,
              fontFamily: "system-ui, -apple-system, sans-serif",
              userSelect: "none",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            DOZIER
          </div>

          {/* "Be The Legacy" — bottom left */}
          <div
            style={{
              position: "absolute",
              bottom: "4%",
              left: "2%",
              fontSize: "clamp(10px, 1.5vw, 18px)",
              fontWeight: 900,
              letterSpacing: "0.3em",
              color: `${BRIGHT}18`,
              fontFamily: "system-ui, -apple-system, sans-serif",
              userSelect: "none",
              textTransform: "uppercase",
            }}
          >
            BE THE LEGACY™ · IRON SHARPENS IRON · PROVERBS 27:17
          </div>

          {/* © copyright line — very bottom */}
          <div
            style={{
              position: "absolute",
              bottom: "1%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "clamp(8px, 0.9vw, 11px)",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: `${STADIUM}12`,
              fontFamily: "system-ui, -apple-system, sans-serif",
              userSelect: "none",
              whiteSpace: "nowrap",
              textTransform: "uppercase",
            }}
          >
            © 2026 Chad Allen Dozier Sr. · AthlynX™ · AthlynXAI™ · AXN™ · AVN™ · Dozier Holdings Group™ · All Rights Reserved
          </div>

          {/* Seasonal badge — top right corner */}
          <div
            style={{
              position: "absolute",
              top: "2%",
              right: "2%",
              fontSize: "clamp(8px, 0.9vw, 11px)",
              fontWeight: 900,
              letterSpacing: "0.2em",
              color: season === "baseball"
                ? `${BRIGHT}25`
                : season === "football"
                  ? `#ff6b0025`
                  : `${ELECTRIC}20`,
              fontFamily: "system-ui, -apple-system, sans-serif",
              userSelect: "none",
              textTransform: "uppercase",
            }}
          >
            {season === "baseball" && "⚾ ROAD TO OMAHA · DIAMOND GRIND SEASON"}
            {season === "football" && "🏈 GRIDIRON NEXUS · FOOTBALL SEASON"}
            {season === "basketball" && "🏀 COURT KINGS · BASKETBALL SEASON"}
            {season === "spring" && "🌱 SPRING SEASON · ALL SPORTS LIVE"}
          </div>

          {/* Sport equipment silhouettes — decorative SVG layer */}
          <svg
            style={{
              position: "absolute",
              bottom: "10%",
              left: "3%",
              width: "clamp(80px, 12vw, 160px)",
              opacity: 0.04,
              pointerEvents: "none",
            }}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Baseball bat silhouette */}
            <rect x="90" y="10" width="12" height="120" rx="6" fill={BRIGHT} />
            <ellipse cx="96" cy="145" rx="28" ry="14" fill={BRIGHT} />
            {/* Baseball */}
            <circle cx="150" cy="60" r="22" fill={STADIUM} />
            <path d="M132 52 Q150 42 168 52" stroke={GRANITE} strokeWidth="2" fill="none" />
            <path d="M132 68 Q150 78 168 68" stroke={GRANITE} strokeWidth="2" fill="none" />
            {/* Football helmet outline */}
            <ellipse cx="50" cy="80" rx="30" ry="35" fill={COBALT} />
            <rect x="30" y="100" width="40" height="8" rx="4" fill={BRIGHT} />
          </svg>

          {/* Female athlete silhouette — right side */}
          <svg
            style={{
              position: "absolute",
              bottom: "8%",
              right: "4%",
              width: "clamp(60px, 8vw, 100px)",
              opacity: 0.05,
              pointerEvents: "none",
            }}
            viewBox="0 0 100 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simplified female athlete running silhouette */}
            <circle cx="50" cy="20" r="16" fill={STADIUM} />
            <path d="M50 36 L40 90 L30 160 M50 36 L60 90 L70 160" stroke={STADIUM} strokeWidth="8" strokeLinecap="round" />
            <path d="M40 90 L20 120 M60 90 L80 120" stroke={STADIUM} strokeWidth="6" strokeLinecap="round" />
          </svg>

          {/* Male athlete silhouette — left side */}
          <svg
            style={{
              position: "absolute",
              bottom: "8%",
              left: "4%",
              width: "clamp(60px, 8vw, 100px)",
              opacity: 0.05,
              pointerEvents: "none",
            }}
            viewBox="0 0 100 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simplified male athlete jumping silhouette */}
            <circle cx="50" cy="18" r="18" fill={STADIUM} />
            <path d="M50 36 L42 95 L28 165 M50 36 L58 95 L72 165" stroke={STADIUM} strokeWidth="9" strokeLinecap="round" />
            <path d="M42 95 L18 115 M58 95 L82 115" stroke={STADIUM} strokeWidth="7" strokeLinecap="round" />
          </svg>
        </>
      )}
    </div>
  );
}
