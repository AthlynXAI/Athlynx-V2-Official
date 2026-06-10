/**
 * PartnerProfilePage — shared layout for public partner / family profile pages.
 * Routes: /team/glenn-tse · /team/lee-marshall · /team/
 *
 * Locked rules:
 * - Public. No auth wall. No PlatformLayout.
 * - Headshot rule: full frame, blue ring OUTSIDE the photo container, object-fit contain
 *   (never crop the jacket, jersey, shoulders, or top of the head). 240px minimum.
 * - Beta watermark in soft gold.
 * - Closers: "Iron Sharpens Iron — Proverbs 27:17" + ""
 * - Voice: man on a porch telling the truth.
 * - No CEO. No empire. No emojis. No personal/medical/family disclosures.
 *
 * Visual tokens (locked):
 *   bg #0A1828 · primary #2563EB · accent #D4AF37 · text #E6EEF8 · surface #13243A
 */
import { Link } from "wouter";

export interface PartnerProfileConfig {
  // Routing
  routeBack: string;                  // e.g. "/team" or "/about"
  routeBackLabel: string;             // e.g. "Back to Team"

  // Identity
  name: string;                       // "David Roland Ford Sr."
  honor: string;                      // "Uncle · Family"  |  "Co-Founder & CFO"
  role: string;                       // "Trusted Advisor · Board of Directors"
  photoSrc: string | null;            // public path; null = show initials placeholder
  initials: string;                   // "DRF" — used when photoSrc is null

  // Plaque
  plaqueCaption: string;              // the locked-in headline quote
  plaqueAttribution?: string;         // "— Chad, on private family support"

  // Body content (each block is optional; render in this order)
  whoTheyAre: string[];               // ["Private family support stays off public operator rosters...", ...]
  whatTheyDo: string[];               // bullet points
  whyTheyMatter?: string[];           // optional paragraphs
  lockedSentence?: string;            // the verbatim sentence in a callout

  // Locale + meta
  locationLine?: string;              // "Houston, TX" or "Eastern Shore"
  signatureChip?: string;             // "First Signature · Family Side of the Door"
}

const COLORS = {
  bg: "#0A1828",
  primary: "#2563EB",
  accent: "#D4AF37",
  text: "#E6EEF8",
  surface: "#13243A",
  subtle: "#94A3B8",
};

function HeadshotBlock({ photoSrc, initials, name }: { photoSrc: string | null; initials: string; name: string }) {
  // Headshot rule: blue ring lives OUTSIDE the photo container.
  // Use object-contain so we never crop. Square aspect, rounded corners, gold beta watermark below.
  return (
    <div className="flex flex-col items-center">
      <div
        className="p-1.5 rounded-3xl"
        style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)` }}
      >
        <div
          className="rounded-3xl overflow-hidden flex items-center justify-center"
          style={{
            background: COLORS.surface,
            width: "min(72vw, 280px)",
            height: "min(72vw, 280px)",
            minWidth: 240,
            minHeight: 240,
          }}
        >
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={name}
              className="w-full h-full"
              style={{ objectFit: "contain" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="text-6xl font-black tracking-wider" style={{ color: COLORS.accent }}>
              {initials}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: COLORS.accent }}>
        BETA
      </div>
    </div>
  );
}

export default function PartnerProfilePage({ config }: { config: PartnerProfileConfig }) {
  return (
    <div className="min-h-screen w-full" style={{ background: COLORS.bg, color: COLORS.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Top nav */}
      <header className="border-b" style={{ borderColor: "rgba(230,238,248,0.08)" }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <div className="text-lg font-black tracking-wide" style={{ color: COLORS.text }}>AthlynX</div>
              <div className="text-xs uppercase tracking-widest" style={{ color: COLORS.subtle }}>AI</div>
            </a>
          </Link>
          <Link href={config.routeBack}>
            <a className="text-sm font-semibold hover:opacity-80" style={{ color: COLORS.primary }}>
              {config.routeBackLabel}
            </a>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8">
        <div className="grid md:grid-cols-[auto,1fr] gap-10 items-start">
          <HeadshotBlock photoSrc={config.photoSrc} initials={config.initials} name={config.name} />
          <div>
            <div className="text-xs uppercase tracking-[0.3em] font-bold mb-3" style={{ color: COLORS.accent }}>
              {config.honor}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-3" style={{ color: COLORS.text }}>
              {config.name}
            </h1>
            <div className="text-base sm:text-lg mb-6" style={{ color: COLORS.subtle }}>
              {config.role}
            </div>
            {config.locationLine && (
              <div className="text-sm mb-6" style={{ color: COLORS.subtle }}>
                {config.locationLine}
              </div>
            )}
            {config.signatureChip && (
              <div
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ background: `${COLORS.primary}22`, color: COLORS.primary, border: `1px solid ${COLORS.primary}55` }}
              >
                {config.signatureChip}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Plaque */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{ background: COLORS.surface, borderLeft: `4px solid ${COLORS.accent}` }}
        >
          <div className="text-xs uppercase tracking-[0.3em] font-bold mb-4" style={{ color: COLORS.accent }}>
            The Plaque
          </div>
          <blockquote className="text-2xl sm:text-3xl font-bold leading-snug" style={{ color: COLORS.text }}>
            &ldquo;{config.plaqueCaption}&rdquo;
          </blockquote>
          {config.plaqueAttribution && (
            <div className="mt-4 text-sm" style={{ color: COLORS.subtle }}>
              {config.plaqueAttribution}
            </div>
          )}
        </div>
      </section>

      {/* Who they are */}
      {config.whoTheyAre.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-6" style={{ color: COLORS.text }}>
            Who he is to us
          </h2>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed" style={{ color: COLORS.subtle }}>
            {config.whoTheyAre.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* What they do */}
      {config.whatTheyDo.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-6" style={{ color: COLORS.text }}>
            What he does for the circle
          </h2>
          <ul className="space-y-3">
            {config.whatTheyDo.map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-base sm:text-lg leading-relaxed" style={{ color: COLORS.subtle }}>
                <span style={{ color: COLORS.accent, fontWeight: 900 }} className="mt-0.5">—</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Why they matter */}
      {config.whyTheyMatter && config.whyTheyMatter.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-6" style={{ color: COLORS.text }}>
            Why he matters
          </h2>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed" style={{ color: COLORS.subtle }}>
            {config.whyTheyMatter.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* Locked sentence callout */}
      {config.lockedSentence && (
        <section className="max-w-5xl mx-auto px-6 py-10">
          <div
            className="rounded-3xl p-8 sm:p-10 text-center"
            style={{ background: `linear-gradient(135deg, ${COLORS.surface} 0%, ${COLORS.bg} 100%)`, border: `1px solid ${COLORS.primary}55` }}
          >
            <div className="text-xs uppercase tracking-[0.3em] font-bold mb-4" style={{ color: COLORS.accent }}>
              For the record
            </div>
            <p className="text-xl sm:text-2xl font-bold leading-relaxed max-w-3xl mx-auto" style={{ color: COLORS.text }}>
              &ldquo;{config.lockedSentence}&rdquo;
            </p>
          </div>
        </section>
      )}

      {/* Testimony line */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center italic text-sm sm:text-base" style={{ color: COLORS.subtle }}>
          If my testimony helps 1 person I did my job.
        </div>
      </section>

      {/* Closers + footer */}
      <footer className="max-w-5xl mx-auto px-6 py-10 mt-6 border-t" style={{ borderColor: "rgba(230,238,248,0.08)" }}>
        <div className="text-center space-y-2">
          <div className="text-sm font-black" style={{ color: COLORS.text }}>
            Iron Sharpens Iron — Proverbs 27:17
          </div>
          <div className="text-xs font-semibold tracking-wide" style={{ color: COLORS.accent }}>
          </div>
          <div className="text-xs mt-4" style={{ color: COLORS.subtle }}>
            AthlynXAI · BETA · Verified by AthlynX · E2EE encrypted profile
          </div>
        </div>
      </footer>
    </div>
  );
}
