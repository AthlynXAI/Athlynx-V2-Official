/**
 * StudioCard — shared visual frame for all Studio Suite graphics.
 *
 * Build 27.1 Phase 2.1 (LineupStudio), 2.2 (MatchDayStudio), 2.3 (FinalScoreStudio).
 * All cards render at a fixed 1080x1350 export surface (Instagram portrait safe)
 * so html-to-image PNG export produces a single canonical aspect ratio.
 *
 * Doctrine: lifecycle not snapshot. The card frame is identical across studios —
 * only the inner content composition changes. This is the routing layer, not the
 * inventory layer.
 */
import { forwardRef, type ReactNode } from "react";

export interface StudioCardProps {
  /** Studio label, e.g. "Lineup", "Match Day", "Final Score". */
  studio: string;
  /** Team name displayed in the brand bar. */
  teamName: string;
  /** Optional team color (hex). Defaults to AthlynXAI gold. */
  accentColor?: string;
  /** Optional team logo URL. */
  logoUrl?: string;
  /** Card body. */
  children: ReactNode;
  /** Optional footer override (defaults to AthlynXAI watermark). */
  footer?: ReactNode;
}

/**
 * Forwarded ref so the PNG export hook can target the DOM node directly.
 */
export const StudioCard = forwardRef<HTMLDivElement, StudioCardProps>(
  function StudioCard(
    { studio, teamName, accentColor = "#FFB400", logoUrl, children, footer },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-studio-card={studio}
        style={{
          width: 1080,
          height: 1350,
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top brand bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "32px 48px",
            borderBottom: `4px solid ${accentColor}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                style={{ width: 72, height: 72, objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 12,
                  background: accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0a0a0a",
                  fontSize: 36,
                  fontWeight: 800,
                }}
              >
                {teamName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  lineHeight: 1.1,
                }}
              >
                {teamName}
              </div>
              <div
                style={{
                  fontSize: 18,
                  textTransform: "uppercase",
                  letterSpacing: 4,
                  color: accentColor,
                  marginTop: 6,
                }}
              >
                {studio}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "48px 56px", overflow: "hidden" }}>
          {children}
        </div>

        {/* Footer / watermark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 48px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            fontSize: 16,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {footer ?? (
            <>
              <span>Built with AthlynXAI</span>
              <span style={{ color: accentColor, fontWeight: 700 }}>
                athlynx.ai
              </span>
            </>
          )}
        </div>
      </div>
    );
  },
);
