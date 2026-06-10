import type { CSSProperties } from "react";
import { Link } from "wouter";

const resources = [
  ["Skill file", "/skill-assets/athlynxai-production-os-workflow/SKILL.md"],
  ["Source-only brand script", "/skill-assets/athlynxai-production-os-workflow/source_only_brand_pass.py"],
  ["Connector checklist", "/skill-assets/athlynxai-production-os-workflow/connector_deployment_checklist.md"],
  ["OS page template", "/skill-assets/athlynxai-production-os-workflow/AthlynXAIOperatingLayer.template.tsx"],
];

const steps = [
  "Prove the exact connector and account path before any push, deployment, post, upload, or data mutation.",
  "Lock source-only media and approved brand rules before editing any asset.",
  "Use deterministic edits for darkening, 9:16 formatting, contact sheets, and approved overlays.",
  "Bake podcast, social media, AXN streaming, and tokenization into AthlynXAI OS as operating layers.",
  "Validate build, brand language, secrets, and diff scope before committing.",
  "Commit, push, deploy, and close with evidence or a clear blocker.",
];

export default function SkillAthlynXProductionOS() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.badge}>Reusable Skill · AthlynXAI OS</div>
        <h1 style={styles.title}>AthlynXAI Production OS Workflow</h1>
        <p style={styles.lead}>
          Connector-first production workflow for podcast, social media, AXN streaming, tokenization, source-only media,
          GitHub commits, and Vercel deployment verification.
        </p>
        <div style={styles.brandRow}>
          {['AXN', 'XAI', 'AthlynX', 'AthlynXAI'].map((brand) => <span key={brand} style={styles.pill}>{brand}</span>)}
        </div>
        <div style={styles.actions}>
          <Link href="/athlynxai-os" style={styles.primary}>Open AthlynXAI OS Layer</Link>
          <Link href="/axn-streaming" style={styles.secondary}>Open AXN Streaming</Link>
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.h2}>What this skill enforces</h2>
        <div style={styles.grid}>
          {steps.map((step, index) => (
            <article key={step} style={styles.card}>
              <div style={styles.step}>0{index + 1}</div>
              <p style={styles.cardText}>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.h2}>Bundled resources</h2>
        <div style={styles.downloads}>
          {resources.map(([label, href]) => <a key={href} href={href} style={styles.download}>{label}</a>)}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "radial-gradient(circle at top left,rgba(0,163,255,.25),transparent 35%),linear-gradient(135deg,#020712,#071426 55%,#02040a)", color: "#f3f8ff", fontFamily: "Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" },
  hero: { maxWidth: 1120, margin: "0 auto", padding: "80px 24px 44px" },
  badge: { display: "inline-flex", padding: "9px 14px", border: "1px solid rgba(104,214,255,.45)", borderRadius: 999, color: "#8fe7ff", background: "rgba(0,0,0,.34)", fontWeight: 850, letterSpacing: ".04em" },
  title: { maxWidth: 900, fontSize: "clamp(42px,7vw,82px)", lineHeight: .92, margin: "24px 0 18px", fontWeight: 950, letterSpacing: "-.06em" },
  lead: { maxWidth: 860, fontSize: 21, lineHeight: 1.55, color: "rgba(243,248,255,.78)", margin: 0 },
  brandRow: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 },
  pill: { border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.08)", borderRadius: 18, padding: "10px 16px", fontSize: 16, fontWeight: 900 },
  actions: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 },
  primary: { color: "#00121f", background: "#72dcff", padding: "13px 18px", borderRadius: 14, fontWeight: 900, textDecoration: "none" },
  secondary: { color: "#eaf7ff", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)", padding: "13px 18px", borderRadius: 14, fontWeight: 850, textDecoration: "none" },
  panel: { maxWidth: 1120, margin: "0 auto", padding: "28px 24px" },
  h2: { fontSize: "clamp(30px,4vw,48px)", margin: "0 0 18px", letterSpacing: "-.04em" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 },
  card: { border: "1px solid rgba(255,255,255,.13)", borderRadius: 22, padding: 20, background: "rgba(255,255,255,.07)" },
  step: { color: "#78e2ff", fontWeight: 950, fontSize: 16, marginBottom: 10 },
  cardText: { fontSize: 17, lineHeight: 1.55, color: "rgba(243,248,255,.80)", margin: 0 },
  downloads: { display: "flex", flexWrap: "wrap", gap: 12 },
  download: { display: "inline-flex", padding: "13px 16px", borderRadius: 14, background: "rgba(114,220,255,.14)", border: "1px solid rgba(114,220,255,.3)", color: "#eaf7ff", textDecoration: "none", fontWeight: 850 },
};
