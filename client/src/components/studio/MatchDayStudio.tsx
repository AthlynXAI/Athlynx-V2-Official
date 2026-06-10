/**
 * <MatchDayStudio /> — Build 27.1 Phase 2.2
 *
 * Match Day announcement graphic.
 * - Calendar pull from athlete_calendar_events via studio.upcomingGames
 * - Opponent, venue (location), date, time
 * - Optional weather slot (Phase 2.2b — open hook for forecast API)
 * - PNG export at 1080x1350 via useExportPng
 * - Same StudioCard frame as LineupStudio (lifecycle not snapshot)
 *
 * Doctrine:
 * - Routing not inventory: pulls from existing athlete_calendar_events, no copy.
 * - Lifecycle not snapshot: Match Day is the pre-game node of the same lifecycle
 *   that ends at FinalScore.
 */
import { useMemo, useRef, useState } from "react";
import { StudioCard } from "./StudioCard";
import { useExportPng } from "./useExportPng";

export interface UpcomingGame {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string | null;
  type: string | null;
  location: string | null;
  description: string | null;
}

export interface MatchDaySlot {
  gameId: number | null;
  opponent: string;
  venue: string;
  date: string;
  time: string;
  isHome: boolean;
  weather: string;
}

export interface MatchDayStudioProps {
  teamName: string;
  accentColor?: string;
  logoUrl?: string;
  /** Pulled from studio.upcomingGames. */
  upcomingGames: UpcomingGame[];
  /** Called when the user saves — passes the PNG data URL and final slot data. */
  onSave?: (pngDataUrl: string, slot: MatchDaySlot) => void | Promise<void>;
}

const EMPTY_SLOT: MatchDaySlot = {
  gameId: null,
  opponent: "",
  venue: "",
  date: "",
  time: "",
  isHome: true,
  weather: "",
};

/**
 * Best-effort opponent extraction from event title. Athletes typically write
 * "Game vs Lions" or "vs. Tigers — Away". We strip "Game " / "vs" / dashes.
 */
function deriveOpponent(title: string): string {
  return title
    .replace(/^game\s+/i, "")
    .replace(/^vs\.?\s+/i, "")
    .replace(/\s*[-—–]\s*(home|away).*$/i, "")
    .trim();
}

export function MatchDayStudio({
  teamName,
  accentColor = "#FFB400",
  logoUrl,
  upcomingGames,
  onSave,
}: MatchDayStudioProps) {
  const [slot, setSlot] = useState<MatchDaySlot>(EMPTY_SLOT);
  const cardRef = useRef<HTMLDivElement>(null);
  const { exportPng, isExporting, lastError } = useExportPng(cardRef);

  const filenameBase = useMemo(() => {
    const datePart = slot.date || new Date().toISOString().slice(0, 10);
    const opp = slot.opponent ? slot.opponent.replace(/\s+/g, "_") : "matchday";
    return `${teamName}_matchday_${opp}_${datePart}`;
  }, [teamName, slot.date, slot.opponent]);

  function pickGame(gameId: number | null) {
    if (gameId == null) {
      setSlot(EMPTY_SLOT);
      return;
    }
    const game = upcomingGames.find((g) => g.id === gameId);
    if (!game) return;
    setSlot({
      gameId: game.id,
      opponent: deriveOpponent(game.title),
      venue: game.location ?? "",
      date: game.date,
      time: game.time ?? "",
      isHome: /home/i.test(game.title) || /home/i.test(game.description ?? ""),
      weather: "",
    });
  }

  function patch<K extends keyof MatchDaySlot>(key: K, value: MatchDaySlot[K]) {
    setSlot((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const dataUrl = await exportPng(filenameBase);
    if (dataUrl && onSave) {
      await onSave(dataUrl, slot);
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* ─── Control panel ─────────────────────────────────────────────── */}
      <div className="flex w-full flex-col gap-4 lg:w-80">
        <h3 className="text-lg font-bold">Match Day</h3>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-neutral-300">Pull from calendar</span>
          <select
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
            value={slot.gameId ?? ""}
            onChange={(e) =>
              pickGame(e.target.value === "" ? null : Number(e.target.value))
            }
          >
            <option value="">— Manual entry —</option>
            {upcomingGames.map((g) => (
              <option key={g.id} value={g.id}>
                {g.date} · {g.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-neutral-300">Opponent</span>
          <input
            type="text"
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
            value={slot.opponent}
            onChange={(e) => patch("opponent", e.target.value)}
            placeholder="e.g. Tupelo Tigers"
            maxLength={64}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-neutral-300">Venue</span>
          <input
            type="text"
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
            value={slot.venue}
            onChange={(e) => patch("venue", e.target.value)}
            placeholder="e.g. Trustmark Park"
            maxLength={120}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-neutral-300">Date</span>
            <input
              type="date"
              className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
              value={slot.date}
              onChange={(e) => patch("date", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-neutral-300">Time</span>
            <input
              type="time"
              className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
              value={slot.time}
              onChange={(e) => patch("time", e.target.value)}
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={slot.isHome}
            onChange={(e) => patch("isHome", e.target.checked)}
          />
          <span>Home game</span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-neutral-300">
            Weather <span className="font-normal text-neutral-500">(optional)</span>
          </span>
          <input
            type="text"
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
            value={slot.weather}
            onChange={(e) => patch("weather", e.target.value)}
            placeholder="e.g. 78°F · Clear"
            maxLength={48}
          />
        </label>

        <button
          type="button"
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-black hover:bg-blue-400 disabled:opacity-50"
          onClick={handleSave}
          disabled={isExporting || !slot.opponent || !slot.date}
        >
          {isExporting ? "Exporting…" : "Save & Export PNG"}
        </button>
        {lastError ? (
          <p className="text-sm text-red-400" role="alert">
            {lastError}
          </p>
        ) : null}
      </div>

      {/* ─── Card preview / export surface ─────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <div className="origin-top-left scale-50 lg:scale-[0.42]">
          <StudioCard
            ref={cardRef}
            studio="Match Day"
            teamName={teamName}
            accentColor={accentColor}
            logoUrl={logoUrl}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 28,
                    color: accentColor,
                    textTransform: "uppercase",
                    letterSpacing: 6,
                    fontWeight: 700,
                  }}
                >
                  {slot.isHome ? "Home Game" : "Road Game"}
                </div>
                <div
                  style={{
                    fontSize: 110,
                    fontWeight: 900,
                    letterSpacing: -3,
                    lineHeight: 1,
                    marginTop: 24,
                  }}
                >
                  vs {slot.opponent || "Opponent"}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 32,
                  marginTop: 32,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: 3,
                    }}
                  >
                    Date
                  </div>
                  <div style={{ fontSize: 46, fontWeight: 700, marginTop: 8 }}>
                    {slot.date || "—"}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: 3,
                    }}
                  >
                    First Pitch
                  </div>
                  <div style={{ fontSize: 46, fontWeight: 700, marginTop: 8 }}>
                    {slot.time || "—"}
                  </div>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <div
                    style={{
                      fontSize: 18,
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: 3,
                    }}
                  >
                    Venue
                  </div>
                  <div style={{ fontSize: 38, fontWeight: 600, marginTop: 8 }}>
                    {slot.venue || "TBD"}
                  </div>
                </div>
                {slot.weather ? (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div
                      style={{
                        fontSize: 18,
                        color: "rgba(255,255,255,0.5)",
                        textTransform: "uppercase",
                        letterSpacing: 3,
                      }}
                    >
                      Forecast
                    </div>
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 600,
                        marginTop: 8,
                        color: accentColor,
                      }}
                    >
                      {slot.weather}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </StudioCard>
        </div>
      </div>
    </div>
  );
}
