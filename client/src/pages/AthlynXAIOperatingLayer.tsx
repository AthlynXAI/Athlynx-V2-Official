import type { CSSProperties } from "react";
import { Link } from "wouter";
import founderSuitNilStoryAsset from "../assets/athlynxai/founder-suit-nil-story-real-asset.png";

const approvedBrands = ["AthlynX", "AthlynXAI", "AXN", "XAI"];

const founderFacts = [
  ["Founder", "Chad A. Dozier"],
  ["1993 Anchor", "R.H. Watkins High School"],
  ["Team", "Laurel Golden Tornadoes"],
  ["Football", "QB #14"],
  ["Physical", "6 ft 3 in, 225 lbs"],
  ["Baseball", "Pitcher, 3rd Base"],
  ["Bats / Throws", "Switch / Right"],
  ["Current Identity", "Businessman / Founder"],
];

const storyTimeline = [
  { era: "Youth", title: "First Passion", copy: "The story starts with the love of the game: football, baseball, competition, teamwork, discipline, and the joy that made sports feel alive." },
  { era: "High School", title: "Football and Baseball Foundation", copy: "R.H. Watkins High School, Laurel Golden Tornadoes, senior year 1993, QB #14, 6 ft 3 in, 225 lbs, with baseball as Pitcher and 3rd Base. Historical stats stay marked Verified Data Needed until records are uploaded." },
  { era: "College and Early Adult Life", title: "Transition and Lessons", copy: "The athlete journey moves into adulthood, work, pressure, setbacks, responsibility, and the hard lessons that do not show up in a highlight reel." },
  { era: "Business Career Today", title: "Purpose Rebuilt", copy: "Today Chad is a businessman and founder. AthlynXAI brings the same childhood passion back through a platform that helps athletes protect their story, identity, NIL record, and future." },
];

const dataSources = [
  { source: "Name", label: "Identity Record", use: "Official athlete name, public display name, school, class year, sport, positions, and consent status." },
  { source: "Image", label: "Real Source Media", use: "Original photos, videos, documents, and approved profile assets. Screenshots do not become production proof." },
  { source: "Likeness", label: "Athlete-Controlled", use: "Story, voice, appearance, media rights, public permissions, and NIL opportunity readiness." },
  { source: "Verified sports record", label: "Evidence Required", use: "Film, box scores, newspaper clips, coach notes, school records, camp data, and source files." },
  { source: "Truth Layer", label: "Private First", use: "Injuries, pressure, drugs, alcohol, gambling, burnout, recovery, and support stay controlled by the athlete." },
  { source: "Coach and audit trail", label: "Guided and Proved", use: "Coach guides setup while the OS logs consent, verification, approvals, and deployment proof." },
];

const liveProfiles = [
  {
    name: "Chad A. Dozier",
    status: "Real Founder Profile",
    sport: "Football QB / Baseball Pitcher and 3rd Base",
    proof: "Verified by Founder",
    metric: "1993",
    copy: "The first proof profile. Founder life story from early sports to R.H. Watkins QB #14 to businessman and AthlynXAI OS builder.",
  },
  {
    name: "Marcus Vance",
    status: "Demo Mode",
    sport: "Football Quarterback",
    proof: "Simulated Data",
    metric: "QB",
    copy: "A safe fictional profile that demonstrates live passing data, media uploads, scout summaries, and Coach guidance.",
  },
  {
    name: "Jordan Hayes",
    status: "Demo Mode",
    sport: "Baseball Pitcher / 3rd Base",
    proof: "Simulated Data",
    metric: "P / 3B",
    copy: "A safe fictional profile for a switch-hitting, right-throwing baseball athlete with pitching, hitting, fielding, and recovery modules.",
  },
];

const productionLanes = [
  { title: "Real NIL Profiles", copy: "Every athlete profile is a Name, Image, and Likeness record with identity, media, verified facts, consent, and opportunity readiness." },
  { title: "Media Vault", copy: "Original photos, videos, documents, app inventory, and source files are tagged by athlete, sport, era, consent, placement, and visibility. Screenshots guide review but do not become public proof or raw production assets." },
  { title: "Coach", copy: "Coach guides setup, asks for proof, flags missing data, protects sensitive details, and never turns unverified claims into official facts." },
  { title: "The Truth Layer", copy: "Injuries, pressure, drugs, alcohol, gambling, burnout, and recovery are handled with privacy, athlete control, and support, not sensationalism." },
  { title: "The Athlete Playbook", copy: "Education and media rail for NIL readiness, recruiting presence, athlete stories, schedules, community, and life lessons beyond the highlight reel." },
  { title: "Proof Ledger", copy: "Consent events, source labels, verification status, approvals, publishing URLs, analytics snapshots, and production health are recorded before claims are made." },
];

const h200Workloads = [
  ["Coach inference", "Profile setup, Q&A, recruiting summaries, NIL copy, and athlete story guidance."],
  ["Multimodal media analysis", "Video, images, documents, historical archive, and game-film understanding with athlete consent."],
  ["Batch profile intelligence", "Large-scale athlete profile processing, rankings, live-feed summarization, and story packaging."],
  ["Wearable and readiness models", "Privacy-first training, recovery, and workload analysis after consent and legal review."],
  ["Podcast and AXN media pipeline", "Script drafting, chaptering, clipping, metadata generation, and show-note preparation before human approval."],
];

const connectorGates = [
  { rail: "GitHub", status: "Read-only proof passed", next: "No push until explicit approval." },
  { rail: "Vercel", status: "Connector visible, project not proven", next: "Resolve project proof before deploy." },
  { rail: "Runtime database", status: "Blocked", next: "Restore secure database proof before live athlete writes." },
  { rail: "Media storage", status: "Blocked or degraded", next: "Restore storage proof before live uploads." },
  { rail: "Nebius H200", status: "Blocked", next: "Restore secure Nebius proof before H200 claims." },
  { rail: "Social and podcast distribution", status: "Blocked until proof", next: "No public post or episode queue without approval." },
];

const mediaPipeline = [
  ["Create", "Athlete, Founder, family, coach, or authorized operator shares media and story."],
  ["Vault", "AthlynXAI OS tags source, consent, placement, sport, era, and visibility."],
  ["Build", "Coach and media workflows prepare profile cards, live-feed cards, podcast notes, and AXN packages."],
  ["Approve", "Chad, athlete, guardian, or assigned operator approves before public use."],
  ["Distribute", "AXN, The Athlete Playbook, social, recruiting, NIL, and web profiles carry the story outward."],
  ["Prove", "The OS records URL, timestamp, connector identity, analytics, and audit proof."],
];


const championshipVisuals = [
  { src: "/media/championship-brand/episode-2/scene01-multisport-walkout.png", title: "Multi-sport walkout", use: "Athlete Playbook, recruiting, AXN" },
  { src: "/media/championship-brand/episode-2/scene02-branded-gear-wall.png", title: "Branded gear wall", use: "Sportswear, equipment, retail" },
  { src: "/media/championship-brand/episode-2/scene03-football-equipment.png", title: "Football equipment", use: "NIL, team store" },
  { src: "/media/championship-brand/episode-2/scene04-baseball-softball.png", title: "Baseball and softball", use: "Diamond sports and recruiting" },
  { src: "/media/championship-brand/episode-2/scene05-training-retail.png", title: "Training retail", use: "Training, marketplace, vendors" },
  { src: "/media/championship-brand/episode-2/scene06-women-led-multisport.png", title: "Women-led multi-sport", use: "Leadership, women athletes, AXN" },
  { src: "/media/championship-brand/episode-2/scene07-cleats-gloves-balls.png", title: "Cleats and gear", use: "Merchandise and equipment drops" },
  { src: "/media/championship-brand/episode-2/scene08-helmet-bag-hat-eyewear.png", title: "Helmet and accessories", use: "Accessory wall and retail" },
  { src: "/media/championship-brand/episode-2/scene09-live-store-marketplace.png", title: "Live store marketplace", use: "Vendor marketplace and OS commerce" },
  { src: "/media/championship-brand/episode-2/scene10-final-brand-wall.png", title: "All-sports brand wall", use: "Championship identity" },
];

const fullStackLanes = [
  "Athletes, coaches, teams, schools, recruiting, NIL, schedules, hype video, and athlete profiles",
  "AXN, AVN, podcasting, video, music, social distribution, Spotify Creator, and source-controlled media vaults",
  "AthlynX sportswear, equipment, retail, product drops, vendor stores, and marketplace commerce",
  "Medical, wellness, readiness, recovery, privacy-first health signals, consent gates, and human oversight",
  "Lawyers, accounting, contracts, compliance support, state-specific-law awareness, and business operations",
  "Salesforce/CRM, agents, financial advisors, sponsors, donors, partners, and relationship follow-up",
  "Faith, Devotions, Fellowship of Christian Athletes, daily devotions, motivational Founder Blog, and community encouragement",
  "Software, hardware, data, data centers, energy strategy, connector proof, automation, tokens, and deployment evidence",
];

const appInventoryRails = [
  { title: "Apps Inventory", copy: "Forty-one submitted app screenshots are treated as private source evidence for the AthlynXAI mobile app ecosystem and operating rails." },
  { title: "Private Device Proof", copy: "Device identifiers, serial numbers, account details, and setup captures stay private and never become public page content." },
  { title: "Redacted Publishing Lane", copy: "Raw screenshots are not production assets. If a visual is needed, the OS rebuilds it as a redacted branded graphic with private identifiers removed." },
  { title: "Production Ledger", copy: "Every app rail should connect to source, consent, deployment, uptime, ownership, and audit proof before it is treated as live." },
];

export default function AthlynXAIOperatingLayer() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.navRow}>
          <img src="/athlynxai-icon.png" alt="AthlynXAI" style={styles.logoMark} />
          <div>
            <div style={styles.brandName}>AthlynXAI OS v1</div>
            <div style={styles.brandSub}>Source of truth for athlete stories, data, media, Coach, AXN, and proof.</div>
          </div>
        </div>
        <div style={styles.badge}>AthlynXAI OS v1. Real NIL profiles. Proof before public claims.</div>
        <h1 style={styles.title}>Every athlete profile is a real Name, Image, and Likeness record.</h1>
        <p style={styles.lead}>
          AthlynX helps athletes control who they are, what they can prove, what media they own, what hard lessons shaped them, and where their opportunity goes next. Chad shares the first proof profile so athletes can learn how to share their own story without fake stats, placeholders, or screenshot profiles.
        </p>
        <div style={styles.brandRow}>
          {approvedBrands.map((brand) => <span key={brand} style={styles.brandPill}>{brand}</span>)}
        </div>
        <div style={styles.actions}>
          <Link href="/founder/chad-dozier" style={styles.primaryLink}>Open Founder Profile</Link>
          <Link href="/athlete-playbook" style={styles.secondaryLink}>Open The Athlete Playbook</Link>
          <Link href="/media-os" style={styles.secondaryLink}>Open Media OS</Link>
          <Link href="/connector-health" style={styles.secondaryLink}>Open Connector Health</Link>
          <Link href="/os/ledger" style={styles.secondaryLink}>Open Proof Ledger</Link>
        </div>
      </section>

      <section style={styles.commandPanel}>
        <div style={styles.deviceShell}>
          <img src={founderSuitNilStoryAsset} alt="AthlynXAI Founder NIL story asset using the real suit source photo without blurred-face reconstruction" style={styles.founderStoryImage} />
          <div style={styles.founderAssetNote}>
            Real suit-source detail is used as a supporting Founder Story asset. The blurred face is not reconstructed, and the platform narrative stays focused on the athlete NIL record.
          </div>
        </div>
        <div style={styles.panelCopy}>
          <div style={styles.sectionKicker}>Real NIL profile system</div>
          <h2 style={styles.h2}>Name, Image, Likeness, media, truth, and opportunity in one athlete-controlled record.</h2>
          <p style={styles.body}>
            Chad is not the center of attention. His story is the first proof profile: childhood passion, football and baseball, the hard realities that can pull athletes away from purpose, and the business career that brought that same passion back through AthlynXAI.
          </p>
          <div style={styles.proofStrip}>
            <span>Real media only.</span>
            <span>Verified data or clearly pending.</span>
            <span>Athlete consent before public use.</span>
          </div>
        </div>
      </section>

      <section style={styles.sectionWrap}>
        <div style={styles.sectionKicker}>Founder story flow</div>
        <h2 style={styles.h2}>The first proof profile shows the full journey, not just the highlight reel.</h2>
        <div style={styles.timelineGrid}>
          {storyTimeline.map((item) => (
            <article key={item.era} style={styles.timelineCard}>
              <div style={styles.cardLabel}>{item.era}</div>
              <h3 style={styles.h3}>{item.title}</h3>
              <p style={styles.cardText}>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.sectionWrapAlt}>
        <div style={styles.sectionKicker}>Name, Image, and Likeness record</div>
        <h2 style={styles.h2}>The hottest ticket is real identity, real media, and verified opportunity.</h2>
        <div style={styles.tableGrid}>
          {dataSources.map((item) => (
            <article key={item.source} style={styles.dataCard}>
              <div style={styles.cardLabel}>{item.label}</div>
              <h3 style={styles.h3}>{item.source}</h3>
              <p style={styles.cardText}>{item.use}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.sectionWrap}>
        <div style={styles.sectionKicker}>Profile rule</div>
        <h2 style={styles.h2}>Real athletes get real NIL records. Demo profiles stay labeled as demos.</h2>
        <div style={styles.profileGrid}>
          {liveProfiles.map((profile) => (
            <article key={profile.name} style={styles.profileCard}>
              <div style={styles.cardTopline}>{profile.status}</div>
              <div style={styles.profileMetric}>{profile.metric}</div>
              <h3 style={styles.profileCardName}>{profile.name}</h3>
              <div style={styles.profileSport}>{profile.sport}</div>
              <div style={styles.proofPill}>{profile.proof}</div>
              <p style={styles.cardText}>{profile.copy}</p>
            </article>
          ))}
        </div>
      </section>


      <section style={styles.sectionWrapAlt}>
        <div style={styles.sectionKicker}>Apps inventory and device-proof gate</div>
        <h2 style={styles.h2}>Our app ecosystem is real. Private device proof stays private.</h2>
        <p style={styles.bodyNarrow}>
          AthlynXAI OS tracks mobile app surfaces, product rails, device-proof references, and operating-system evidence without publishing raw screenshots, serial numbers, account identifiers, or private device details.
        </p>
        <div style={styles.grid}>
          {appInventoryRails.map((rail) => (
            <article key={rail.title} style={styles.card}>
              <h3 style={styles.h3}>{rail.title}</h3>
              <p style={styles.cardText}>{rail.copy}</p>
            </article>
          ))}
        </div>
      </section>


      <section style={styles.sectionWrapAlt}>
        <div style={styles.sectionKicker}>Championship app, website, and platform visuals</div>
        <h2 style={styles.h2}>Keep every approved asset, add these ten, and carry the dark-blue title look across the OS.</h2>
        <p style={styles.bodyNarrow}>
          The new AthlynXAI photos are staged as a clean championship visual system for podcast, AXN/AVN, athlete profiles,
          recruiting pages, merchandise, vendor onboarding, Faith/devotion content, and founder motivation. Existing visuals stay
          live; this set adds the premium dark-blue AthlynXAI layer Chad approved.
        </p>
        <div style={styles.visualGrid}>
          {championshipVisuals.map((visual) => (
            <article key={visual.src} style={styles.visualCard}>
              <img src={visual.src} alt={`${visual.title} AthlynXAI championship visual`} style={styles.visualImage} loading="lazy" />
              <div style={styles.visualCopy}>
                <div style={styles.cardLabel}>{visual.title}</div>
                <p style={styles.cardText}>{visual.use}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.sectionWrap}>
        <div style={styles.sectionKicker}>Full Stack Layer Cake · all here</div>
        <h2 style={styles.h2}>AthlynXAI OS is the engine for every market lane.</h2>
        <p style={styles.bodyNarrow}>
          The doctrine now includes the complete athlete, media, vendor, legal, accounting, Salesforce/CRM, agent, financial advisor,
          Faith, FCA, daily devotion, Founder Blog, software, hardware, data, data-center, and energy stack. Providers can plug in,
          but AthlynXAI OS owns the source of truth, proof, approval gates, and relationship ledger.
        </p>
        <div style={styles.fullStackGrid}>
          {fullStackLanes.map((lane) => <div key={lane} style={styles.fullStackItem}>{lane}</div>)}
        </div>
      </section>

      <section style={styles.sectionWrapAlt}>
        <div style={styles.sectionKicker}>AthlynXAI OS v1 layers</div>
        <h2 style={styles.h2}>One operating system. Multiple controlled rails.</h2>
        <div style={styles.grid}>
          {productionLanes.map((lane) => (
            <article key={lane.title} style={styles.card}>
              <h3 style={styles.h3}>{lane.title}</h3>
              <p style={styles.cardText}>{lane.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.sectionWrap}>
        <div style={styles.sectionKicker}>Nebius H200 positioning</div>
        <h2 style={styles.h2}>H200 is the high-performance AI rail after secure proof.</h2>
        <p style={styles.bodyNarrow}>
          AthlynXAI should map high-performance AI compute to Coach inference, media understanding, verified profile building,
          NIL readiness summaries, and privacy-first athlete intelligence. It should not claim active external compute access until credentials and capability proof pass.
        </p>
        <div style={styles.splitGrid}>
          {h200Workloads.map(([title, copy]) => (
            <article key={title} style={styles.compactCard}>
              <h3 style={styles.h3Small}>{title}</h3>
              <p style={styles.cardText}>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.sectionWrapAlt}>
        <div style={styles.sectionKicker}>Autonomous media and podcast OS</div>
        <h2 style={styles.h2}>Create, vault, build, approve, distribute, prove.</h2>
        <div style={styles.pipelineGrid}>
          {mediaPipeline.map(([step, copy], index) => (
            <article key={step} style={styles.pipelineCard}>
              <div style={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</div>
              <h3 style={styles.h3}>{step}</h3>
              <p style={styles.cardText}>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.sectionWrap}>
        <div style={styles.sectionKicker}>Connector gates</div>
        <h2 style={styles.h2}>Production live means proof first, then mutation.</h2>
        <div style={styles.gateGrid}>
          {connectorGates.map((gate) => (
            <article key={gate.rail} style={styles.gateCard}>
              <div style={styles.gateRail}>{gate.rail}</div>
              <div style={styles.gateStatus}>{gate.status}</div>
              <p style={styles.cardText}>{gate.next}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.finalPanel}>
        <div style={styles.sectionKicker}>Production line</div>
        <h2 style={styles.h2}>AthlynXAI OS owns the story. The world gets the approved version.</h2>
        <p style={styles.body}>
          Production is not a slogan. It is real source media, athlete consent, verified records, NIL opportunity, Coach guidance, brand control, and live deployment proof. AthlynXAI OS v1 must keep every profile truthful before it carries that athlete story to the world.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 18% 0%, rgba(0, 203, 255, 0.24), transparent 34%), radial-gradient(circle at 78% 12%, rgba(44, 101, 255, 0.18), transparent 30%), linear-gradient(135deg, #02040a 0%, #071426 45%, #02040a 100%)",
    color: "#f4f8ff",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  hero: { maxWidth: 1240, margin: "0 auto", padding: "76px 24px 42px" },
  navRow: { display: "flex", gap: 16, alignItems: "center", marginBottom: 28 },
  logoMark: { width: 58, height: 58, objectFit: "contain", filter: "drop-shadow(0 0 24px rgba(0,210,255,.52))" },
  brandName: { fontSize: 22, fontWeight: 950, letterSpacing: "-.02em" },
  brandSub: { fontSize: 14, color: "rgba(244,248,255,.62)", marginTop: 3 },
  badge: { display: "inline-flex", padding: "10px 15px", border: "1px solid rgba(104,214,255,.45)", borderRadius: 999, color: "#8fe7ff", background: "rgba(0,0,0,.34)", fontWeight: 900, letterSpacing: ".04em" },
  title: { maxWidth: 1050, fontSize: "clamp(46px, 7.6vw, 94px)", lineHeight: .91, margin: "26px 0 20px", fontWeight: 950, letterSpacing: "-.065em" },
  lead: { maxWidth: 880, fontSize: 21, lineHeight: 1.55, color: "rgba(244,248,255,.78)", margin: 0 },
  brandRow: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 },
  brandPill: { border: "1px solid rgba(255,255,255,.22)", background: "linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.05))", borderRadius: 18, padding: "10px 16px", fontSize: 16, fontWeight: 950, boxShadow: "0 0 28px rgba(0,178,255,.16)" },
  actions: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 },
  primaryLink: { color: "#00131f", background: "#72dcff", padding: "14px 18px", borderRadius: 14, fontWeight: 950, textDecoration: "none", boxShadow: "0 16px 50px rgba(0,210,255,.22)" },
  secondaryLink: { color: "#eaf7ff", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)", padding: "14px 18px", borderRadius: 14, fontWeight: 850, textDecoration: "none" },
  commandPanel: { maxWidth: 1240, margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "minmax(310px, 430px) minmax(0, 1fr)", gap: 30, alignItems: "center" },
  deviceShell: { borderRadius: 40, padding: 20, background: "linear-gradient(180deg, rgba(4,19,39,.98), rgba(2,8,19,.98))", border: "1px solid rgba(106,220,255,.34)", boxShadow: "0 30px 110px rgba(0,0,0,.52), inset 0 0 0 1px rgba(255,255,255,.04)" },
  founderStoryImage: { width: "100%", borderRadius: 28, display: "block", border: "1px solid rgba(126,231,255,.24)", boxShadow: "0 28px 88px rgba(0,0,0,.45)" },
  founderAssetNote: { marginTop: 14, color: "rgba(244,248,255,.66)", fontSize: 13.5, lineHeight: 1.5, background: "rgba(255,255,255,.055)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, padding: 14 },
  phoneTop: { height: 38, borderRadius: 18, background: "rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(244,248,255,.68)", fontSize: 12, fontWeight: 850, letterSpacing: ".06em", textTransform: "uppercase" },
  profileHeader: { display: "grid", gridTemplateColumns: "86px 1fr", gap: 16, alignItems: "center", marginTop: 18 },
  avatarFrame: { width: 86, height: 86, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg, #741e26, #e0b853)", color: "#fff", fontSize: 34, fontWeight: 950, boxShadow: "0 18px 50px rgba(0,0,0,.45)" },
  profileName: { fontSize: 23, fontWeight: 950, letterSpacing: "-.035em" },
  profileSub: { fontSize: 13.5, color: "rgba(244,248,255,.7)", marginTop: 3 },
  profileTags: { marginTop: 8, color: "#8fe7ff", fontSize: 12, fontWeight: 850 },
  metricGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginTop: 18 },
  metricCard: { border: "1px solid rgba(133,226,255,.18)", background: "rgba(255,255,255,.055)", borderRadius: 18, padding: 14, minHeight: 82 },
  metricValue: { fontSize: 16, fontWeight: 950, color: "#fff" },
  metricLabel: { fontSize: 11, color: "rgba(244,248,255,.58)", marginTop: 9, textTransform: "uppercase", letterSpacing: ".08em" },
  liveFeedCard: { marginTop: 16, border: "1px solid rgba(114,220,255,.26)", borderRadius: 22, padding: 16, background: "linear-gradient(135deg, rgba(0,151,255,.14), rgba(255,255,255,.04))" },
  coachCard: { marginTop: 12, border: "1px solid rgba(114,220,255,.42)", borderRadius: 22, padding: 16, background: "rgba(0, 20, 42, .86)" },
  feedLabel: { fontSize: 11, fontWeight: 950, color: "#7fe3ff", textTransform: "uppercase", letterSpacing: ".12em" },
  feedTitle: { fontSize: 18, fontWeight: 950, marginTop: 6 },
  feedCopy: { fontSize: 13.5, lineHeight: 1.5, color: "rgba(244,248,255,.73)", margin: "8px 0 0" },
  panelCopy: { border: "1px solid rgba(110,220,255,.18)", borderRadius: 30, background: "linear-gradient(145deg, rgba(0,0,0,.38), rgba(31,93,176,.16))", padding: 32 },
  sectionWrap: { maxWidth: 1240, margin: "0 auto", padding: "44px 24px" },
  sectionWrapAlt: { maxWidth: 1240, margin: "0 auto", padding: "46px 24px", borderTop: "1px solid rgba(126,231,255,.11)", borderBottom: "1px solid rgba(126,231,255,.11)", background: "linear-gradient(135deg, rgba(0,0,0,.2), rgba(0,132,204,.08))" },
  sectionKicker: { color: "#7fe3ff", fontSize: 13, fontWeight: 950, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 10 },
  h2: { fontSize: "clamp(30px, 4vw, 50px)", margin: "0 0 14px", letterSpacing: "-.04em", lineHeight: 1.02 },
  h3: { fontSize: 24, lineHeight: 1.05, margin: "0 0 12px", letterSpacing: "-.03em" },
  h3Small: { fontSize: 19, lineHeight: 1.1, margin: "0 0 8px", letterSpacing: "-.02em" },
  body: { fontSize: 17.5, lineHeight: 1.62, color: "rgba(244,248,255,.74)", margin: 0 },
  bodyNarrow: { maxWidth: 860, fontSize: 17.5, lineHeight: 1.62, color: "rgba(244,248,255,.74)", margin: "0 0 22px" },
  proofStrip: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 22 },
  timelineGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 22 },
  tableGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginTop: 22 },

  visualGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 22 },
  visualCard: { border: "1px solid rgba(143,231,255,.2)", borderRadius: 22, overflow: "hidden", background: "rgba(0,0,0,.32)", boxShadow: "0 20px 60px rgba(0,0,0,.28)" },
  visualImage: { width: "100%", aspectRatio: "4 / 5", objectFit: "cover", display: "block" },
  visualCopy: { padding: 16 },
  fullStackGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12, marginTop: 20 },
  fullStackItem: { border: "1px solid rgba(126,231,255,.2)", borderRadius: 18, padding: 18, background: "rgba(255,255,255,.055)", color: "rgba(243,248,255,.8)", lineHeight: 1.5, fontWeight: 700 },
  profileGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 24 },
  splitGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))", gap: 14, marginTop: 18 },
  pipelineGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 22 },
  gateGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginTop: 22 },
  card: { border: "1px solid rgba(255,255,255,.13)", borderRadius: 24, padding: 22, background: "linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.035))", minHeight: 178 },
  timelineCard: { border: "1px solid rgba(126,231,255,.18)", borderRadius: 24, padding: 20, background: "linear-gradient(180deg, rgba(0,199,255,.1), rgba(255,255,255,.035))" },
  dataCard: { border: "1px solid rgba(126,231,255,.2)", borderRadius: 22, padding: 20, background: "rgba(0,0,0,.28)" },
  profileCard: { position: "relative", overflow: "hidden", border: "1px solid rgba(126,231,255,.24)", borderRadius: 30, padding: 24, background: "linear-gradient(145deg, rgba(0,151,255,.17), rgba(0,0,0,.36))", minHeight: 300 },
  compactCard: { border: "1px solid rgba(126,231,255,.18)", borderRadius: 20, padding: 18, background: "rgba(255,255,255,.052)" },
  pipelineCard: { border: "1px solid rgba(126,231,255,.18)", borderRadius: 22, padding: 18, background: "rgba(0,0,0,.3)", minHeight: 185 },
  gateCard: { border: "1px solid rgba(255,214,102,.22)", borderRadius: 22, padding: 19, background: "linear-gradient(145deg, rgba(255,193,7,.08), rgba(255,255,255,.035))" },
  cardLabel: { color: "#78e2ff", fontWeight: 950, fontSize: 12.5, marginBottom: 11, textTransform: "uppercase", letterSpacing: ".08em" },
  cardTopline: { color: "#78e2ff", fontWeight: 950, fontSize: 12.5, textTransform: "uppercase", letterSpacing: ".09em" },
  profileMetric: { position: "absolute", right: 22, top: 22, fontSize: 42, fontWeight: 950, color: "rgba(255,255,255,.13)", letterSpacing: "-.05em" },
  profileCardName: { fontSize: 28, lineHeight: 1.02, margin: "48px 0 8px", letterSpacing: "-.04em" },
  profileSport: { color: "rgba(244,248,255,.7)", fontSize: 15, marginBottom: 14 },
  proofPill: { display: "inline-flex", padding: "8px 11px", borderRadius: 999, background: "rgba(114,220,255,.16)", border: "1px solid rgba(114,220,255,.27)", color: "#9eecff", fontSize: 12, fontWeight: 950, marginBottom: 14 },
  cardText: { fontSize: 15.5, lineHeight: 1.56, color: "rgba(244,248,255,.72)", margin: 0 },
  stepNumber: { color: "rgba(126,231,255,.5)", fontSize: 30, fontWeight: 950, marginBottom: 18, letterSpacing: "-.04em" },
  gateRail: { fontSize: 20, fontWeight: 950, marginBottom: 8 },
  gateStatus: { color: "#ffd36e", fontSize: 13, fontWeight: 950, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 },
  finalPanel: { maxWidth: 1240, margin: "0 auto", padding: "50px 24px 90px", borderTop: "1px solid rgba(126,231,255,.14)" },
};
