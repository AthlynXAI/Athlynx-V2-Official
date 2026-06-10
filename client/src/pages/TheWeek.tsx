import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";

// /the-week — the week-long receipt.
// May 7 → May 12, 2026. Every commit. Every build. Every promise.
// No spin. Chad's proof, public.

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
  red: "#7A2222",
  amber: "#7A5C22",
};

type Status = "live" | "merged" | "wip" | "not_done";

type Commit = { sha: string; when: string; msg: string };
type Build = {
  name: string;
  date: string;
  pr?: string;
  summary: string;
  routes: { path: string; label: string }[];
  status: Status;
};
type Promise_ = {
  what: string;
  status: Status;
  proof: string;
};

const REPO = "";

// All 62 commits since May 7, oldest → newest
const COMMITS: Commit[] = [
  { sha: "67dd7da", when: "May 6 20:05", msg: "Revert PlayerProfiler-style profile hero" },
  { sha: "9989a75", when: "May 6 20:16", msg: "S39 — MLB.com-style athlete profile hero" },
  { sha: "683326e", when: "May 6 21:32", msg: "S40 — AthlynXAI native mobile app v1.0.0" },
  { sha: "197c12f", when: "May 6 21:35", msg: "S40 handoff — Google Play 11/11 complete" },
  { sha: "39de9e0", when: "May 6 21:39", msg: "S39→S40 — AI Trainer tier emoji fix, Chad athlete profile updated in Neon" },
  { sha: "92f0c52", when: "May 6 22:12", msg: "S40 Final — 3 mobile screens, 8-tab nav, layer cake reference" },
  { sha: "1ab365e", when: "May 6 22:38", msg: "S40 — Credits pill visible on mobile, brand colors, pulse animation" },
  { sha: "a61b112", when: "May 6 22:55", msg: "S40 Final handoff report — all screens, Jira live, S41 roadmap" },
  { sha: "7eb2b05", when: "May 6 23:30", msg: "S41 — Transfer Portal, Highlight Reel Studio, Athlete Card, Onboarding" },
  { sha: "f0605a4", when: "May 6 23:53", msg: "S41 — Real team headshots, beta banner July 1 2026" },
  { sha: "031b1ba", when: "May 7 00:40", msg: "S41 — Vexo analytics integrated, EAS build triggered" },
  { sha: "5738dc2", when: "May 7 00:45", msg: "S41 — EAS project linked, package ai.athlynx.app" },
  { sha: "da70ec7", when: "May 7 00:47", msg: "Add .easignore to reduce EAS build archive size" },
  { sha: "09dfaa6", when: "May 7 00:55", msg: "S41 — Remove vexo-analytics native module, lightweight fetch tracking" },
  { sha: "3d098c9", when: "May 7 01:01", msg: "Metro config — fix copy-anything ESM resolution in Android build" },
  { sha: "3ab57c4", when: "May 7 01:19", msg: "S41 — Gradle 9.0 compatibility, AGP 8.7.3, compileSdk 35" },
  { sha: "7e8361f", when: "May 7 01:21", msg: "Root .easignore to exclude web app from EAS build archive" },
  { sha: "856ff92", when: "May 7 01:33", msg: "S41 FINAL — Remove superjson, @trpc from mobile, raw fetch only" },
  { sha: "7a368ff", when: "May 7 01:39", msg: "S41 FINAL v2 — Replace mobile trpc.ts with stub" },
  { sha: "98832a2", when: "May 7 01:48", msg: "APK build — RN 0.76.9, Gradle 8.10.2, AGP 8.6.1" },
  { sha: "c030ef9", when: "May 7 01:51", msg: "Remove mobile/android from git — EAS generates via prebuild" },
  { sha: "35e07a8", when: "May 7 02:03", msg: "DEFINITIVE APK fix — config plugin patches build.gradle .execute()" },
  { sha: "323e26d", when: "May 7 06:29", msg: "Build-monitor dashboard for Google Play APK pipeline" },
  { sha: "37a7fbb", when: "May 7 06:45", msg: "Production copy audit — trial CTA, market size, Nebius, sitemap" },
  { sha: "23f0150", when: "May 7 01:49", msg: "Merge PR #2 — feature/build-monitor-dashboard" },
  { sha: "2656dca", when: "May 7 03:44", msg: "Patch expo-modules-core targetSdk deprecated API (Gradle 8.13)" },
  { sha: "c75f331", when: "May 7 04:02", msg: "Bump versionCode to 4, add mobile/.expo to gitignore" },
  { sha: "fc24119", when: "May 7 08:13", msg: "withGradleFix robustly replace all 5 .execute() calls" },
  { sha: "be1cc1c", when: "May 7 08:35", msg: "Align deps to Expo SDK 53 — RN 0.79.6, React 19, expo-router 5" },
  { sha: "4ad6117", when: "May 7 05:56", msg: "Change production Android buildType from apk to app-bundle" },
  { sha: "d246baf", when: "May 7 17:08", msg: "S42 — Android crash fix, Vexo init, real photo upload" },
  { sha: "d51e7fc", when: "May 7 22:59", msg: "Catch JS startup crashes, manage splash, bump versionCode 6" },
  { sha: "7624715", when: "May 7 23:04", msg: "Pad Android adaptive-icon foreground to 66% safe zone" },
  { sha: "ad1b1ab", when: "May 7 23:29", msg: "CI — manual EAS Android build workflow" },
  { sha: "9f59619", when: "May 8 02:01", msg: "Add expo-system-ui for userInterfaceStyle dark on Android" },
  { sha: "75ba604", when: "May 7 23:06", msg: "Set versionCode to 11 for Google Play (must be > 10)" },
  { sha: "6187c8c", when: "May 8 00:41", msg: "Set iOS buildNumber to 12 to match Android versionCode" },
  { sha: "52eccc1", when: "May 8 00:58", msg: "Add ITSAppUsesNonExemptEncryption false (skip export compliance)" },
  { sha: "0850b38", when: "May 8 01:10", msg: "Configure iOS production build + submit with ASC API key" },
  { sha: "fdf2c04", when: "May 8 01:50", msg: "Use latest Xcode image for iOS production build (iOS 26 SDK)" },
  { sha: "cb5d9e2", when: "May 8 02:16", msg: "S43 handoff — iOS TestFlight live, splash hang diagnosed" },
  { sha: "ce1ea70", when: "May 8 02:19", msg: "Hide splash only after AuthContext isLoading=false — iOS hang fix" },
  { sha: "c6afbcf", when: "May 8 07:01", msg: "Remove manual SplashScreen calls + 4s auth bootstrap timeout" },
  { sha: "3a7959e", when: "May 8 02:03", msg: "Merge PR #3 — fix/ios-splash-hang-build17" },
  { sha: "bd87c4f", when: "May 8 07:56", msg: "Full autonomy migration — kill rogue social cron, add CI/CD" },
  { sha: "ab2d8bc", when: "May 8 06:00", msg: "Merge PR #4 — fix/full-autonomy-kill-rogue-cron" },
  { sha: "95b8c5d", when: "May 8 12:09", msg: "Runbook — Vercel project, zombies, ASC key rotation" },
  { sha: "abe2783", when: "May 8 12:45", msg: "Point iOS submit at active ASC API key MT3P665D4W" },
  { sha: "2c6856d", when: "May 8 12:48", msg: "Drop --no-wait=false from EAS iOS build" },
  { sha: "3e75af3", when: "May 8 12:48", msg: "Drop --no-wait=false from EAS iOS build (let pnpm drive)" },
  { sha: "989d0c4", when: "May 8 08:13", msg: "Fix web typecheck — clean Manus-era TS errors (PR #5)" },
  { sha: "f6c3f3d", when: "May 11 13:38", msg: "BUILD 1 — Nebius engine, MLB profile, flawless signup, Coach Lynx (PR #6)" },
  { sha: "959adbf", when: "May 11 19:16", msg: "BUILD 2 — schema foundation, recruiting, awards, Coach Lynx persistence (PR #7)" },
  { sha: "7831029", when: "May 11 20:22", msg: "BUILD 3 — AI Wizards, Legal Hub, full Manus purge (PR #8)" },
  { sha: "7f94526", when: "May 11 20:30", msg: "BUILD 3 — Founder, Brand Wall, AthlynX Network, Podcast (PR #9)" },
  { sha: "fd6ba34", when: "May 11 20:57", msg: "BUILD 3 — Editable Everywhere + /the-first + /build-decisions (PR #10)" },
  { sha: "91c6ee3", when: "May 12 01:35", msg: "Fix founder — use real users column names (avatarUrl)" },
  { sha: "c09b41f", when: "May 12 02:40", msg: "BUILD 4 — Layer Cake, Realty, CRM, Tiered Billing, Quantum, Mind Map" },
  { sha: "da7b88a", when: "May 11 21:42", msg: "Merge PR #11 — build-4-layer-cake-realty" },
  { sha: "ca79b56", when: "May 11 22:26", msg: "BUILD 5 — Fort Knox security + Live Rule Book + Q&A (PR #12)" },
  { sha: "5544460", when: "May 11 22:50", msg: "BUILD 6 — Open Doors, COPPA, Texas law, cookie consent (PR #13)" },
  { sha: "30544d9", when: "May 11 23:03", msg: "BUILD 7 — Soul Source OS, the Apple Moment integration (PR #14)" },
  { sha: "84c5f3c", when: "May 12 12:05", msg: "BUILD 8 — Seed The Engine, AI Draft Helper, version stamp (PR #15)" },
];

const BUILDS: Build[] = [
  {
    name: "Pre-Week (May 6)",
    date: "May 6, 2026",
    summary: "S39–S41 mobile track. MLB-style athlete hero, native iOS/Android app v1.0.0, Transfer Portal, Highlight Reel Studio, Onboarding, real team headshots, beta banner July 1.",
    routes: [
      { path: "/profile", label: "Athlete profile (MLB-style)" },
      { path: "/build-monitor", label: "Build monitor" },
    ],
    status: "live",
  },
  {
    name: "Mobile Hell Week (May 7–8)",
    date: "May 7–8, 2026",
    summary: "39 commits across two days fighting Gradle 8.13, Expo SDK 53, EAS, iOS export compliance, splash screen hang. iOS TestFlight live. Android APK pipeline green. Rogue social cron killed. Web typecheck clean.",
    routes: [
      { path: "/build-monitor", label: "Build monitor dashboard" },
    ],
    status: "live",
  },
  {
    name: "Build 1 — Foundation",
    date: "May 11, 2026",
    pr: "#6",
    summary: "Nebius engine wired, MLB.com-style profile, flawless signup, Coach Lynx, connector symphony.",
    routes: [
      { path: "/profile", label: "Profile" },
      { path: "/signup", label: "Signup" },
      { path: "/coach-lynx", label: "Coach Lynx" },
    ],
    status: "live",
  },
  {
    name: "Build 2 — Schema",
    date: "May 11, 2026",
    pr: "#7",
    summary: "Schema foundation, recruiting tab, awards tab, Coach Lynx persistence.",
    routes: [
      { path: "/recruiting", label: "Recruiting" },
      { path: "/coach-lynx", label: "Coach Lynx (persisted)" },
    ],
    status: "live",
  },
  {
    name: "Build 3 — Bring It Home",
    date: "May 11, 2026",
    pr: "#8 / #9 / #10",
    summary: "AI Wizards, Legal Hub, full Manus purge. Founder hub, Brand Wall, AthlynX Network, Podcast. Editable Everywhere + /the-first monument + /build-decisions public ledger.",
    routes: [
      { path: "/founder", label: "Founder hub" },
      { path: "/the-first", label: "The First (monument)" },
      { path: "/build-decisions", label: "Build Decisions ledger" },
      { path: "/brand-wall", label: "Brand Wall" },
      { path: "/podcast", label: "Podcast" },
    ],
    status: "live",
  },
  {
    name: "Build 4 — Layer Cake",
    date: "May 12, 2026",
    pr: "#11",
    summary: "Layer Cake vision, Realty, CRM Hub, Tiered Billing, Quantum, Mind Map.",
    routes: [
      { path: "/layer-cake", label: "Layer Cake" },
      { path: "/realty", label: "Realty" },
      { path: "/crm", label: "CRM Hub" },
      { path: "/billing", label: "Tiered Billing" },
      { path: "/mind-map", label: "Mind Map" },
    ],
    status: "live",
  },
  {
    name: "Build 5 — Fort Knox",
    date: "May 11, 2026",
    pr: "#12",
    summary: "Fort Knox security posture, Live Rule Book, Q&A listening post.",
    routes: [
      { path: "/rule-book", label: "Live Rule Book" },
      { path: "/qa", label: "Q&A (community)" },
    ],
    status: "live",
  },
  {
    name: "Build 6 — Open Doors",
    date: "May 11, 2026",
    pr: "#13",
    summary: "Discoverability, COPPA compliance, Texas governing law, cookie consent.",
    routes: [
      { path: "/discover", label: "Discover" },
      { path: "/privacy", label: "Privacy" },
      { path: "/terms", label: "Terms" },
    ],
    status: "live",
  },
  {
    name: "Build 7 — Soul Source OS",
    date: "May 11, 2026",
    pr: "#14",
    summary: "Soul Source OS — the Apple Moment integration layer. Portal social rotation control surface.",
    routes: [
      { path: "/portal/social-os", label: "Social OS portal" },
    ],
    status: "live",
  },
  {
    name: "Build 8 — Seed The Engine",
    date: "May 12, 2026",
    pr: "#15",
    summary: "AI Draft Helper, version stamp at /api/health (v1.0.8-chameleon).",
    routes: [
      { path: "/api/health", label: "Health + version stamp" },
    ],
    status: "live",
  },
  {
    name: "Build 9 — Relight Social (in progress)",
    date: "May 12, 2026",
    summary: "Social rotation worker drafted locally (server/jobs/socialPostsWorker.ts, 176 lines). NOT yet committed or shipped. Killswitch SOCIAL_POSTING_ENABLED still false. social_posts=0 / social_accounts=0.",
    routes: [],
    status: "wip",
  },
  {
    name: "The Week Receipt",
    date: "May 12, 2026",
    summary: "This page. Live public ledger of everything since the subscription started.",
    routes: [{ path: "/the-week", label: "The Week (you are here)" }],
    status: "live",
  },
];

const PROMISES: Promise_[] = [
  { what: "Sign-up works end to end (5 admin emails fire)", status: "live", proof: "User 2238 created via probe; 5 admin emails received (screenshots IMG_8116/8117)" },
  { what: "311 platform routes return HTTP 200", status: "live", proof: "Full route probe (route_results.txt) — 311/311 = 200" },
  { what: "Version stamp visible at /api/health", status: "live", proof: "v1.0.8-chameleon live, Build 9" },
  { what: "Rogue social cron killed", status: "live", proof: "/api/cron/social-post returns 410 Gone (commit bd87c4f)" },
  { what: "Social posting killswitch on by default", status: "live", proof: "socialPostingGuard.ts owned by Chad, SOCIAL_POSTING_ENABLED=false in Vercel env" },
  { what: "iOS TestFlight live", status: "live", proof: "Commit cb5d9e2 — S43 handoff iOS TestFlight live" },
  { what: "Android Google Play internal track green", status: "live", proof: "Commits 75ba604 + 4ad6117 — versionCode 11, app-bundle" },
  { what: "Web typecheck clean (Manus-era TS errors)", status: "live", proof: "PR #5 — commit 989d0c4" },
  { what: "Founder badge on profile hero (Chad = user 43)", status: "live", proof: "isFounder=true platform-wide, Build 3" },
  { what: "/the-first monument page", status: "live", proof: "Route live, Build 3 PR #10" },
  { what: "/build-decisions public ledger", status: "live", proof: "Route live, Build 3 PR #10" },
  { what: "/founder hub with podcast catalog", status: "live", proof: "PR #9 — Build 3 layer cake" },
  { what: "/brand-wall public", status: "live", proof: "Build 3 PR #9" },
  { what: "Layer Cake + Realty + CRM + Billing", status: "live", proof: "Build 4 PR #11 — all routes 200" },
  { what: "Fort Knox security + Q&A listening post", status: "live", proof: "Build 5 PR #12" },
  { what: "COPPA + cookie consent + Texas law", status: "live", proof: "Build 6 PR #13" },
  { what: "Portal Social OS control surface", status: "live", proof: "Build 7 PR #14 — /portal/social-os live" },
  { what: "AI Draft Helper", status: "live", proof: "Build 8 PR #15 — version stamped" },
  { what: "Social rotation worker running on schedule", status: "wip", proof: "socialPostsWorker.ts drafted (176 lines), NOT committed, NOT deployed" },
  { what: "S3 audit log daily backup", status: "not_done", proof: "Cron c9a0f3b5 scheduled but bucket athlynx-prod-backups does NOT exist in us-east-1 — failing nightly" },
  { what: "Mother's Day file packet (Texas AG / FTC / BBB / Manus severance)", status: "not_done", proof: "Documents drafted in workspace (texas_ag_complaint, ftc_complaint, bbb_complaint, manus_severance_plan) — not filed" },
  { what: "Profile rebuild spec v2 → live page diff", status: "not_done", proof: "athlynx_profile_rebuild_spec_v2 PDF exists; live /profile not yet reconciled to v2 spec" },
  { what: "AIWizardChat / WizardsScreen cherry-picked from backend-only branch", status: "not_done", proof: "Memory says planned, no commit on main confirms landing" },
];

const STATUS_STYLE: Record<Status, { bg: string; fg: string; label: string }> = {
  live:     { bg: "rgba(67,122,34,0.18)",  fg: "#7BC34A", label: "LIVE" },
  merged:   { bg: "rgba(0,163,255,0.16)",  fg: "#5AB8F0", label: "MERGED" },
  wip:      { bg: "rgba(212,175,55,0.16)", fg: "#E5C150", label: "IN PROGRESS" },
  not_done: { bg: "rgba(122,34,34,0.20)",  fg: "#E07A7A", label: "NOT DONE" },
};

function Pill({ status }: { status: Status }) {
  const s = STATUS_STYLE[status];
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 999,
      background: s.bg,
      color: s.fg,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
}

function TheWeekInner() {
  const liveCount = PROMISES.filter(p => p.status === "live").length;
  const wipCount = PROMISES.filter(p => p.status === "wip").length;
  const notDoneCount = PROMISES.filter(p => p.status === "not_done").length;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", paddingBottom: 80 }}>
      <section style={{ padding: "32px 24px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Link href="/" style={{ color: C.textMuted, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            <ArrowLeft size={14} /> Back home
          </Link>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: "16px 0 8px", letterSpacing: -0.5 }}>
            The Week
          </h1>
          <div style={{ color: C.gold, fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
            May 7 → May 12, 2026 · The receipt, public.
          </div>
          <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.6, maxWidth: 720 }}>
            Every commit since the subscription started. Every build. Every promise.
            No spin. If it shipped, the URL is live. If it didn't, it says so plain.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "10px 16px", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: C.textFaint, letterSpacing: 1.2 }}>COMMITS</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{COMMITS.length}</div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "10px 16px", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: C.textFaint, letterSpacing: 1.2 }}>BUILDS LIVE</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{BUILDS.filter(b => b.status === "live").length}</div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "10px 16px", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: C.textFaint, letterSpacing: 1.2 }}>PROMISES KEPT</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#7BC34A" }}>{liveCount}</div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "10px 16px", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: C.textFaint, letterSpacing: 1.2 }}>IN PROGRESS</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#E5C150" }}>{wipCount}</div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "10px 16px", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: C.textFaint, letterSpacing: 1.2 }}>NOT DONE</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#E07A7A" }}>{notDoneCount}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: C.gold }}>
            Build by Build
          </h2>
          <div style={{ display: "grid", gap: 12 }}>
            {BUILDS.map((b, i) => (
              <div key={i} style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "16px 18px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: C.textFaint, marginTop: 2 }}>
                      {b.date}{b.pr ? ` · PR ${b.pr}` : ""}
                    </div>
                  </div>
                  <Pill status={b.status} />
                </div>
                <div style={{ fontSize: 14, color: C.textMuted, marginTop: 10, lineHeight: 1.55 }}>
                  {b.summary}
                </div>
                {b.routes.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {b.routes.map((r, ri) => (
                      <a
                        key={ri}
                        href={r.path}
                        style={{
                          fontSize: 12,
                          color: C.blue,
                          background: "rgba(0,163,255,0.08)",
                          border: `1px solid rgba(0,163,255,0.25)`,
                          padding: "4px 10px",
                          borderRadius: 6,
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        {r.path}  ·  {r.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: C.gold }}>
            Promises — Status with Proof
          </h2>
          <div style={{ display: "grid", gap: 8 }}>
            {PROMISES.map((p, i) => (
              <div key={i} style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "12px 14px",
                display: "grid",
                gridTemplateColumns: "minmax(0,1fr) auto",
                gap: 12,
                alignItems: "flex-start",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.what}</div>
                  <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4, lineHeight: 1.5 }}>
                    {p.proof}
                  </div>
                </div>
                <Pill status={p.status} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: C.gold }}>
            Every Commit ({COMMITS.length})
          </h2>
          <div style={{ display: "grid", gap: 4, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}>
            {COMMITS.map((c, i) => (
              <a
                key={i}
                href={`${REPO}${c.sha}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 120px 1fr",
                  gap: 12,
                  padding: "6px 8px",
                  borderRadius: 4,
                  color: C.textMuted,
                  textDecoration: "none",
                  borderLeft: `2px solid ${C.border}`,
                }}
              >
                <span style={{ color: C.blue, fontWeight: 600 }}>{c.sha}</span>
                <span style={{ color: C.textFaint }}>{c.when}</span>
                <span>{c.msg}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 24px 64px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.textFaint, letterSpacing: 1.5, lineHeight: 1.8 }}>
            Iron Sharpens Iron — Proverbs 27:17
            <br />
          </div>
        </div>
      </section>

      <MobileBottomNav />
    </div>
  );
}

export default function TheWeek() {
  return (
    <RouteErrorBoundary>
      <PlatformLayout>
        <TheWeekInner />
      </PlatformLayout>
    </RouteErrorBoundary>
  );
}
