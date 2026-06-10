import type { CSSProperties } from "react";
import { Link } from "wouter";

const approvedBrands = ["AXN", "XAI", "AthlynX", "AthlynXAI"];

const rails = [
  { title: "Podcast Engine", label: "The Athlete’s Playbook", copy: "Spotify for Creators is the distribution rail while AthlynXAI OS remains the operating brain." },
  { title: "Social Media Engine", label: "Creator Command", copy: "Shorts, reels, captions, and campaigns are governed by approved brand language before leaving the OS." },
  { title: "AXN Streaming Service", label: "Owned Sports Network", copy: "AXN is the programming layer for shows, highlights, athlete stories, and premium media drops." },
  { title: "Tokenization Layer", label: "Credits and Access", copy: "Credits, tiers, media access, and premium athlete services connect to the business engine." },
];

export default function AthlynXAIOperatingLayer() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.badge}>AthlynXAI OS · Media Layer Cake</div>
        <h1 style={styles.title}>Podcast, Social, AXN Streaming, and Tokenization in One Engine</h1>
        <p style={styles.lead}>AthlynXAI OS owns the rules. External platforms are rails.</p>
        <div style={styles.brandRow}>{approvedBrands.map((brand) => <span key={brand} style={styles.brandPill}>{brand}</span>)}</div>
        <div style={styles.actions}>
          <Link href="/media-os" style={styles.primaryLink}>Open Media OS</Link>
          <Link href="/social-os" style={styles.secondaryLink}>Open Social OS</Link>
          <Link href="/token-factory" style={styles.secondaryLink}>Open Token Factory</Link>
        </div>
      </section>
      <section style={styles.grid}>{rails.map((rail) => <article key={rail.title} style={styles.card}><div style={styles.cardLabel}>{rail.label}</div><h2 style={styles.h2}>{rail.title}</h2><p style={styles.body}>{rail.copy}</p></article>)}</section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg,#020712,#071426,#02040a)", color: "#f3f8ff", fontFamily: "Inter,system-ui,sans-serif" },
  hero: { maxWidth: 1180, margin: "0 auto", padding: "88px 24px 48px" },
  badge: { display: "inline-flex", padding: "9px 14px", border: "1px solid rgba(104,214,255,.45)", borderRadius: 999, color: "#8fe7ff", background: "rgba(0,0,0,.34)", fontWeight: 800 },
  title: { maxWidth: 920, fontSize: "clamp(42px,7vw,86px)", lineHeight: .92, margin: "24px 0 18px", fontWeight: 950, letterSpacing: "-.06em" },
  lead: { maxWidth: 820, fontSize: 20, lineHeight: 1.55, color: "rgba(243,248,255,.78)", margin: 0 },
  brandRow: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 },
  brandPill: { border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.08)", borderRadius: 18, padding: "10px 16px", fontSize: 16, fontWeight: 900 },
  actions: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 },
  primaryLink: { color: "#00121f", background: "#72dcff", padding: "13px 18px", borderRadius: 14, fontWeight: 900, textDecoration: "none" },
  secondaryLink: { color: "#eaf7ff", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)", padding: "13px 18px", borderRadius: 14, fontWeight: 850, textDecoration: "none" },
  grid: { maxWidth: 1180, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(245px,1fr))", gap: 16 },
  card: { border: "1px solid rgba(255,255,255,.13)", borderRadius: 24, padding: 22, background: "rgba(255,255,255,.07)", minHeight: 190 },
  cardLabel: { color: "#78e2ff", fontWeight: 900, fontSize: 13, marginBottom: 12 },
  h2: { fontSize: 25, lineHeight: 1.05, margin: "0 0 12px", letterSpacing: "-.03em" },
  body: { fontSize: 15.5, lineHeight: 1.55, color: "rgba(243,248,255,.72)", margin: 0 },
};
