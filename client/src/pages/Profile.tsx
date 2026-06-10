import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useRoute } from "wouter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  PencilButton,
  InlineField,
  PencilSheet,
  PhotoPicker,
} from "@/components/profile/EditableProfile";
import { Top5Ladder } from "@/components/profile/Top5Ladder";
import ProfileAutomationHub from "@/components/ProfileAutomationHub";

// AthlynX Build 2 — MLB.com / PlayerProfiler-style athlete profile.
// Hero bar + tab nav + Summary tab + Recruiting tab + Awards tab live.
// Stats, News, NIL, Media, Performance remain TabPlaceholder until their PRs land.

const COLORS = {
  base: "#000000",
  card: "#0a1628",
  elevated: "#0f2038",
  border: "#1E90FF55",
  blue: "#1E90FF",
  blueHover: "#0080FF",
  gold: "#1E90FF",
  white: "#FFFFFF",
  textSecondary: "#B7C3D9",
  textMuted: "#6B7A99",
};

const TABS = [
  { id: "summary", label: "Summary" },
  { id: "stats", label: "Stats" },
  { id: "news", label: "News" },
  { id: "awards", label: "Awards" },
  { id: "recruiting", label: "Recruiting" },
  { id: "nil", label: "NIL" },
  { id: "media", label: "Media" },
  { id: "performance", label: "Performance" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function useUrlHashTab(defaultTab: TabId): [TabId, (t: TabId) => void] {
  const [tab, setTab] = useState<TabId>(() => {
    if (typeof window === "undefined") return defaultTab;
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    return (TABS.find(x => x.id === t)?.id as TabId) ?? defaultTab;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }, [tab]);

  return [tab, setTab];
}

function initialsFor(name?: string | null): string {
  if (!name) return "AX";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Headshot({
  avatarUrl,
  name,
}: {
  avatarUrl?: string | null;
  name?: string | null;
}) {
  return (
    <div
      style={{
        width: 160,
        height: 160,
        borderRadius: "50%",
        background: COLORS.elevated,
        border: `4px solid ${COLORS.blue}`,
        boxShadow: `0 0 0 4px ${COLORS.base}, 0 8px 24px rgba(0,0,0,0.5)`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {avatarUrl ? (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          src={avatarUrl}
          alt={name ?? "Athlete headshot"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        // NIL doctrine: 160px headshot — silhouette + Identity pending, no colored initials.
        <svg viewBox="0 0 24 24" style={{ width: "60%", height: "60%", color: "#64748b" }} fill="currentColor" aria-hidden="true">
          <title>Identity pending — add your headshot</title>
          <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z"/>
        </svg>
      )}
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        background: COLORS.elevated,
        border: `1px solid ${COLORS.gold}`,
        padding: "10px 16px",
        borderRadius: 6,
        minWidth: 96,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 11,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: COLORS.white,
          fontSize: 22,
          fontWeight: 800,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function HeroBar({
  profile,
  isOwner,
}: {
  profile: any;
  isOwner: boolean;
}) {
  const name = profile?.name ?? "Athlete";
  const position = profile?.position ?? "—";
  const classYear = profile?.classYear ?? "—";
  const school = profile?.school ?? "—";
  const state = profile?.state ?? "";
  const height = profile?.height ?? "—";
  const weight = profile?.weight ? `${profile.weight} lbs` : "—";
  const dominantHand = profile?.dominantHand ?? "—";
  const jersey = profile?.jerseyNumber ?? "—";
  const headshotSrc =
    profile?.headshotUrl ??
    profile?.actionPhotoUrl ??
    profile?.coverUrl ??
    null;

  const sportStats: Record<string, any> = (profile?.sportStats ?? {}) as Record<
    string,
    any
  >;
  const chipEntries: Array<[string, string | number]> = [];
  for (const k of Object.keys(sportStats)) {
    if (chipEntries.length >= 5) break;
    const v = sportStats[k];
    if (typeof v === "string" || typeof v === "number") {
      chipEntries.push([k, v]);
    }
  }
  while (chipEntries.length < 5) {
    chipEntries.push([
      ["GAMES", "WINS", "PTS", "AVG", "RANK"][chipEntries.length] ?? "—",
      "—",
    ]);
  }

  return (
    <section
      style={{
        background: COLORS.base,
        padding: "32px 24px 24px",
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative" }}>
          <Headshot avatarUrl={headshotSrc ?? profile?.avatarUrl} name={name} />
          {isOwner ? (
            <div style={{ position: "absolute", bottom: -8, right: -8 }}>
              <PhotoPicker
                kind="avatar"
                field="headshotUrl"
                choiceKeyField="avatarChoiceKey"
                currentUrl={headshotSrc ?? profile?.avatarUrl}
                trigger={
                  <button
                    type="button"
                    aria-label="Edit profile photo"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      background: COLORS.blue,
                      color: COLORS.white,
                      border: `2px solid ${COLORS.base}`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    ✎
                  </button>
                }
              />
            </div>
          ) : null}
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 48,
              color: COLORS.white,
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            {name}
          </h1>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <CapsLine>
              {position} · CLASS OF {classYear}
            </CapsLine>
            <CapsLine>
              {school}
              {state ? ` · ${state}` : ""}
            </CapsLine>
            <CapsLine>
              {height} · {weight} · {dominantHand}
            </CapsLine>
          </div>
        </div>
        <div style={{ textAlign: "right", minWidth: 120 }}>
          <div
            style={{
              fontFamily: "'Bebas Neue', 'Anton', sans-serif",
              fontSize: 120,
              lineHeight: 0.85,
              color: COLORS.gold,
              fontWeight: 700,
              textShadow: `4px 4px 0 ${COLORS.base}`,
            }}
          >
            {jersey}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "24px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 12,
        }}
      >
        {chipEntries.map(([label, value], i) => (
          <StatChip
            key={`${label}-${i}`}
            label={String(label).replace(/_/g, " ")}
            value={value}
          />
        ))}
      </div>
    </section>
  );
}

function CapsLine({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: COLORS.textSecondary,
        fontSize: 12,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: 20,
      }}
    >
      <h2
        style={{
          color: COLORS.white,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          margin: 0,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatGrid({ rows }: { rows: Array<[string, string | number]> }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        gap: 16,
      }}
    >
      {rows.map(([label, value], i) => (
        <div key={`${label}-${i}`}>
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 11,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            {label}
          </div>
          <div
            style={{
              color: COLORS.white,
              fontWeight: 800,
              fontSize: 22,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryTab({ profile }: { profile: any }) {
  const sport: string = profile?.sport ?? "—";
  const currentSeasonRows = useMemo<Array<[string, string | number]>>(() => {
    const stats: Record<string, any> = (profile?.sportStats ?? {}) as Record<
      string,
      any
    >;
    const entries = Object.entries(stats)
      .filter(([, v]) => typeof v === "string" || typeof v === "number")
      .slice(0, 6) as Array<[string, string | number]>;
    if (entries.length === 0) {
      return [
        ["G", "—"],
        ["W-L", "—"],
        ["AVG", "—"],
        ["PTS", "—"],
        ["RANK", "—"],
        ["NOTES", "—"],
      ];
    }
    return entries;
  }, [profile]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 16,
        marginTop: 16,
      }}
    >
      <Card title={`Current Season`}>
        <StatGrid rows={currentSeasonRows} />
      </Card>

      <Card title="Career Totals">
        {/* TODO: wire to athleteCareerStats once Build 2 migration lands */}
        <StatGrid
          rows={[
            ["GP", "—"],
            ["W-L", "—"],
            ["AVG", "—"],
            ["PTS", "—"],
            ["AWARDS", "—"],
            ["SEASONS", "—"],
          ]}
        />
      </Card>

      <Card title="Bio">
        <p
          style={{
            color: COLORS.textSecondary,
            fontSize: 14,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {profile?.bio ??
            "Bio coming soon. Coach Lynx will help you fill this out — one question at a time."}
        </p>
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            rowGap: 8,
            columnGap: 16,
            fontSize: 13,
          }}
        >
          <Label>Name</Label>
          <Value>{profile?.name ?? "—"}</Value>
          <Label>Class</Label>
          <Value>{profile?.classYear ?? "—"}</Value>
          <Label>School</Label>
          <Value>{profile?.school ?? "—"}</Value>
          <Label>State</Label>
          <Value>{profile?.state ?? "—"}</Value>
          <Label>Instagram</Label>
          <Value>{profile?.instagram ?? "—"}</Value>
          <Label>X / Twitter</Label>
          <Value>{profile?.twitter ?? "—"}</Value>
        </div>
      </Card>

      <Card title="Splits — Last 7 / 15 / 30">
        {/* TODO: wire to gameLogs aggregation */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {(["Last 7", "Last 15", "Last 30"] as const).map(label => (
            <div
              key={label}
              style={{
                background: COLORS.elevated,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{
                  color: COLORS.textMuted,
                  fontSize: 11,
                  letterSpacing: 1.2,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  color: COLORS.white,
                  fontSize: 22,
                  fontWeight: 800,
                  marginTop: 6,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                —
              </div>
              <div
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                placeholder
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Last 3 Games">
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: COLORS.textSecondary,
              fontSize: 13,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <Th>Date</Th>
                <Th>Opponent</Th>
                <Th>Result</Th>
                <Th>Key Stat</Th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map(i => (
                <tr key={i} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <Td>—</Td>
                  <Td>—</Td>
                  <Td>—</Td>
                  <Td>—</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        color: COLORS.textMuted,
        textTransform: "uppercase",
        fontWeight: 700,
        letterSpacing: 1,
        fontSize: 11,
      }}
    >
      {children}
    </span>
  );
}
function Value({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: COLORS.white, fontWeight: 600 }}>{children}</span>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: "8px 12px",
        color: COLORS.textMuted,
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        fontWeight: 700,
      }}
    >
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{ padding: "10px 12px", color: COLORS.white }}>{children}</td>
  );
}

// ─── Recruiting tab ───────────────────────────────────────────────────────────────────────────────────
function RecruitingTab({
  athleteId,
  isOwner,
}: {
  athleteId?: number | null;
  isOwner?: boolean;
}) {
  if (!athleteId) return <TabPlaceholder build="2" sectionLabel="Recruiting" />;
  const boardQuery = trpc.recruiting.getBoardForAthlete.useQuery({ athleteId });
  const viewsQuery = trpc.recruiting.getCoachViewCount.useQuery({ athleteId });
  const topFiveQuery = trpc.recruiting.getTopFive.useQuery({ athleteId });

  const board = boardQuery.data ?? [];
  const coachViews = viewsQuery.data?.count ?? 0;
  const topFive = topFiveQuery.data?.topFive ?? [];

  return (
    <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
      {/* Build 3 — athlete-controlled Top 5 ladder with letter uploads */}
      <Top5Ladder athleteId={athleteId} isOwner={!!isOwner} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title={`Colleges Showing Interest (${board.length})`}>
          {board.length === 0 ? (
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>
              Nothing yet. When coaches view this profile, they show up here.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {board.map((entry: any) => (
                <div
                  key={entry.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: COLORS.elevated,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: COLORS.white,
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {entry.collegeName}
                    </div>
                    <div
                      style={{
                        color: COLORS.textMuted,
                        fontSize: 11,
                        marginTop: 2,
                      }}
                    >
                      {[entry.division, entry.conference]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </div>
                  </div>
                  <InterestBadge level={entry.level} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Top 5 Signing Day Board">
          {topFive.length === 0 ? (
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>
              Locked at onboarding. Update it any time from your profile
              settings.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {topFive.map((college: string, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    background: COLORS.elevated,
                    border: `1px solid ${COLORS.gold}`,
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      background: COLORS.gold,
                      color: COLORS.base,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{
                      color: COLORS.white,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {college}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card title="Coaches Viewed">
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <div
            style={{
              color: COLORS.gold,
              fontWeight: 800,
              fontSize: 48,
              lineHeight: 1,
              fontFamily: "'Bebas Neue', 'Anton', sans-serif",
            }}
          >
            {coachViews}
          </div>
          <div
            style={{
              color: COLORS.textSecondary,
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            Verified coach views of this profile.
            <div
              style={{ color: COLORS.textMuted, marginTop: 4, fontSize: 11 }}
            >
              Every view logged with timestamp, coach name, and college.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function InterestBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    watching: { bg: "#1F3257", fg: COLORS.textSecondary, label: "Watching" },
    interested: { bg: "#0080FF", fg: "#fff", label: "Interested" },
    offer_extended: { bg: COLORS.gold, fg: COLORS.base, label: "Offer" },
    committed: { bg: "#16a34a", fg: "#fff", label: "Committed" },
  };
  const m = map[level] ?? map.watching;
  return (
    <span
      style={{
        background: m.bg,
        color: m.fg,
        fontSize: 11,
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 999,
        letterSpacing: 0.5,
        textTransform: "uppercase",
      }}
    >
      {m.label}
    </span>
  );
}

// ─── Awards tab ─────────────────────────────────────────────────────────────────────────────────────
function AwardsTab({ athleteId }: { athleteId?: number | null }) {
  if (!athleteId) return <TabPlaceholder build="2" sectionLabel="Awards" />;
  const awardsQuery = trpc.recruiting.getAwards.useQuery({ athleteId });
  const awards = awardsQuery.data ?? [];

  if (awards.length === 0) {
    return (
      <div style={{ marginTop: 16 }}>
        <Card title="Awards & Recognition">
          <div style={{ color: COLORS.textMuted, fontSize: 13 }}>
            Add awards from your profile settings or let Coach Lynx pull them
            from your stats screenshot.
          </div>
        </Card>
      </div>
    );
  }

  const grouped: Record<string, any[]> = {};
  for (const a of awards) {
    const k = a.category ?? "team";
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(a);
  }
  const order = [
    "national",
    "state",
    "regional",
    "conference",
    "team",
    "academic",
    "media",
    "combine",
  ];
  return (
    <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
      {order
        .filter(k => grouped[k])
        .map(k => (
          <Card
            key={k}
            title={k.charAt(0).toUpperCase() + k.slice(1) + " Awards"}
          >
            <div style={{ display: "grid", gap: 10 }}>
              {grouped[k].map((a: any) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    background: COLORS.elevated,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: COLORS.white,
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {a.title}
                    </div>
                    <div
                      style={{
                        color: COLORS.textMuted,
                        fontSize: 11,
                        marginTop: 2,
                      }}
                    >
                      {[a.organization, a.season].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  {a.verified && (
                    <span
                      style={{
                        background: COLORS.gold,
                        color: COLORS.base,
                        padding: "3px 9px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 0.5,
                      }}
                    >
                      VERIFIED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
    </div>
  );
}

function TabPlaceholder({
  build,
  sectionLabel,
}: {
  build: string;
  sectionLabel: string;
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <Card title={sectionLabel}>
        <div
          style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.6 }}
        >
          Coming in Build {build}. Honest work takes a beat. We are wiring this
          section to the data athletes already have — no fabrication, no
          inflation.
        </div>
      </Card>
    </div>
  );
}

function Footer() {
  return (
    <footer
      style={{
        maxWidth: 1200,
        margin: "48px auto 0",
        padding: "24px",
        color: COLORS.textMuted,
        fontSize: 12,
        lineHeight: 1.8,
        borderTop: `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{ color: COLORS.textSecondary, fontWeight: 700 }}>
        Built once, never rebuild.
      </div>
      <div>Iron Sharpens Iron — Proverbs 27:17</div>
      <div style={{ marginTop: 8 }}>
        © {new Date().getFullYear()} AthlynXAI Corporation
      </div>
    </footer>
  );
}

// Owner-only edit bar sitting just under the hero. Surfaces a pencil sheet for
// each section so the athlete can edit every field on their profile without
// leaving the page. Build 3 — Editable Everywhere.
function HeroEditBar({ profile }: { profile: any }) {
  const cv = (k: string) => (profile as any)?.[k];
  return (
    <div
      style={{
        background: COLORS.card,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "12px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: COLORS.gold,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 800,
            marginRight: 6,
          }}
        >
          Edit your profile
        </span>

        <PencilSheet
          title="Identity"
          currentValues={profile}
          fields={[
            { field: "position", label: "Position", placeholder: "e.g. QB, Forward, Shortstop" },
            { field: "classYear", label: "Class year", placeholder: "e.g. 2027" },
            { field: "jerseyNumber", label: "Jersey number", placeholder: "e.g. 12" },
            { field: "dominantHand", label: "Dominant hand", placeholder: "R / L / Switch" },
          ]}
          trigger={<span><PencilButton ariaLabel="Edit identity" label="Identity" /></span>}
        />

        <PencilSheet
          title="School & Location"
          currentValues={profile}
          fields={[
            { field: "school", label: "School" },
            { field: "state", label: "State" },
            { field: "sport", label: "Sport" },
          ]}
          trigger={<span><PencilButton ariaLabel="Edit school" label="School" /></span>}
        />

        <PencilSheet
          title="Measurements"
          currentValues={profile}
          fields={[
            { field: "height", label: "Height", placeholder: "e.g. 6'2\"" },
            { field: "weight", label: "Weight (lbs)", type: "number" },
          ]}
          trigger={<span><PencilButton ariaLabel="Edit measurements" label="Measurements" /></span>}
        />

        <PencilSheet
          title="Academic"
          currentValues={profile}
          fields={[
            { field: "gpa", label: "GPA", placeholder: "e.g. 3.85" },
          ]}
          trigger={<span><PencilButton ariaLabel="Edit academics" label="Academics" /></span>}
        />

        <PencilSheet
          title="Bio & Story"
          currentValues={profile}
          fields={[
            { field: "bio", label: "Bio", type: "textarea", placeholder: "Tell your story in your own words." },
          ]}
          trigger={<span><PencilButton ariaLabel="Edit bio" label="Bio" /></span>}
        />

        <PencilSheet
          title="Socials"
          currentValues={profile}
          fields={[
            { field: "instagram", label: "Instagram handle" },
            { field: "twitter", label: "X / Twitter handle" },
            { field: "tiktokHandle", label: "TikTok handle" },
            { field: "youtubeUrl", label: "YouTube URL" },
            { field: "linkedinUrl", label: "LinkedIn URL" },
          ]}
          trigger={<span><PencilButton ariaLabel="Edit socials" label="Socials" /></span>}
        />

        <PhotoPicker
          kind="cover"
          field="coverUrl"
          choiceKeyField="coverChoiceKey"
          currentUrl={cv("coverUrl")}
          trigger={<span><PencilButton ariaLabel="Edit cover photo" label="Cover photo" /></span>}
        />
      </div>
    </div>
  );
}

function ProfileInner() {
  const { user } = useAuth();
  const [, params] = useRoute<{ id?: string }>("/profile/:id?");
  const routeId = params?.id ? Number(params.id) : null;

  const myProfileQuery = trpc.profile.getMyProfile.useQuery(undefined, {
    enabled: !!user && !routeId,
  });
  const byIdQuery = trpc.profile.getProfile.useQuery(
    { userId: routeId ?? 0 },
    { enabled: !!routeId }
  );

  const profile = (routeId ? byIdQuery.data : myProfileQuery.data) as any;
  const loading =
    (routeId ? byIdQuery.isLoading : myProfileQuery.isLoading) && !profile;

  const [tab, setTab] = useUrlHashTab("summary");

  if (loading) {
    return (
      <PlatformLayout>
        <div
          style={{
            background: COLORS.base,
            minHeight: "100vh",
            padding: 48,
            color: COLORS.textSecondary,
          }}
        >
          Loading profile…
        </div>
      </PlatformLayout>
    );
  }

  // Owner gate: am I viewing my own profile?
  const isOwner =
    !!user &&
    !!profile &&
    Number((profile as any)?.userId ?? -1) === Number((user as any)?.id ?? -2);

  return (
    <PlatformLayout>
      <div
        style={{
          background: COLORS.base,
          minHeight: "100vh",
          paddingBottom: 48,
        }}
      >
        <HeroBar profile={profile ?? {}} isOwner={isOwner} />
        {isOwner ? <HeroEditBar profile={profile ?? {}} /> : null}

        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: COLORS.base,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <Tabs value={tab} onValueChange={v => setTab(v as TabId)}>
            <div
              style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}
            >
              <TabsList
                style={{
                  background: "transparent",
                  borderRadius: 0,
                  padding: 0,
                  gap: 4,
                  overflowX: "auto",
                  display: "flex",
                }}
              >
                {TABS.map(t => (
                  <TabsTrigger
                    key={t.id}
                    value={t.id}
                    style={{
                      background: "transparent",
                      color: tab === t.id ? COLORS.white : COLORS.textMuted,
                      borderBottom: `3px solid ${tab === t.id ? COLORS.blue : "transparent"}`,
                      borderRadius: 0,
                      padding: "14px 16px",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div
              style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}
            >
              <TabsContent value="summary">
                <SummaryTab profile={profile ?? {}} />
              </TabsContent>
              <TabsContent value="stats">
                <TabPlaceholder build="2" sectionLabel="Stats" />
              </TabsContent>
              <TabsContent value="news">
                <TabPlaceholder build="2" sectionLabel="News" />
              </TabsContent>
              <TabsContent value="awards">
                <AwardsTab athleteId={profile?.id} />
              </TabsContent>
              <TabsContent value="recruiting">
                <RecruitingTab
                  athleteId={profile?.id}
                  isOwner={isOwner}
                />
              </TabsContent>
              <TabsContent value="nil">
                <TabPlaceholder build="2" sectionLabel="NIL" />
              </TabsContent>
              <TabsContent value="media">
                <TabPlaceholder build="2" sectionLabel="Media" />
              </TabsContent>
              <TabsContent value="performance">
                <TabPlaceholder build="2" sectionLabel="Performance" />
              </TabsContent>
            </div>
          </Tabs>

          {/* Layer Cake — owner-only automation hub */}
          {isOwner ? (
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
              <ProfileAutomationHub />
            </div>
          ) : null}
        </div>

        <Footer />
      </div>
    </PlatformLayout>
  );
}

export default function Profile() {
  return (
    <RouteErrorBoundary>
      <ProfileInner />
    </RouteErrorBoundary>
  );
}
