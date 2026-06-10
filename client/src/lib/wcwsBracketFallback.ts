/**
 * WCWS 2026 manual bracket override.
 *
 * Reason this exists: ESPN's public college-softball scoreboard endpoint
 * (the one LiveRegionalScoreboard pulls from for sport="softball") has
 * been returning zero events for the duration of the 2026 WCWS \u2014 the
 * platform's primary live feed is dark for softball even though games
 * are actually being played and broadcast on ESPN linear TV. NCAA.com's
 * JSON endpoints 404 on the public paths we've tried.
 *
 * This file is the human-curated truth, updated as games finish. Used
 * only when the live ESPN feed returns empty for softball, and clearly
 * labeled in the UI as "Manual feed \u00b7 ESPN softball API unavailable".
 *
 * SOURCE OF RECORD: NCAA.com WCWS bracket page (May 28 \u2013 June 5, 2026).
 * Updated 2026-05-31 23:50 CT by Chad.
 *
 * As ESPN's feed recovers OR a better live source is wired, this file
 * shrinks to zero entries and the UI silently flips back to live.
 */
export interface WcwsManualGame {
  id: string;
  state: "pre" | "in" | "post";
  detail: string;            // "FINAL", "12:00 PM EDT", etc.
  date: string;              // ISO
  away: { name: string; rank?: number; score?: string };
  home: { name: string; rank?: number; score?: string };
  /** WCWS pool / round label, e.g. "WCWS \u00b7 Bracket Final" */
  regional: string;
  /** Set when this game clinched a WCWS Championship Series berth. */
  advancesToSuper?: string;
}

export const WCWS_MANUAL_FEED: WcwsManualGame[] = [
  // May 30 \u2014 Bracket semifinals
  {
    id: "wcws-2026-05-30-bama-neb",
    state: "post",
    detail: "FINAL",
    date: "2026-05-30T22:00:00Z",
    regional: "WCWS \u00b7 Bracket Semifinal",
    away: { name: "Alabama", rank: 1, score: "5" },
    home: { name: "Nebraska", rank: 1, score: "1" },
  },
  {
    id: "wcws-2026-05-30-ttu-tenn",
    state: "post",
    detail: "FINAL",
    date: "2026-05-30T20:00:00Z",
    regional: "WCWS \u00b7 Bracket Semifinal",
    away: { name: "Texas Tech", rank: 3, score: "1" },
    home: { name: "Tennessee", rank: 2, score: "2" },
  },
  // May 31 \u2014 Bracket finals (clinch Championship Series)
  {
    id: "wcws-2026-05-31-tex-neb",
    state: "post",
    detail: "FINAL",
    date: "2026-05-31T22:00:00Z",
    regional: "WCWS \u00b7 Bracket Final",
    away: { name: "Nebraska", rank: 1, score: "1" },
    home: { name: "Texas", rank: 1, score: "3" },
    advancesToSuper: "Texas",
  },
  {
    id: "wcws-2026-05-31-ttu-ucla",
    state: "post",
    detail: "FINAL",
    date: "2026-05-31T23:00:00Z",
    regional: "WCWS \u00b7 Bracket Final",
    away: { name: "Texas Tech", rank: 3, score: "8" },
    home: { name: "UCLA", rank: 2, score: "7" },
  },
  // Jun 1 \u2014 Semifinal (TTU plays Tennessee; Alabama plays Texas Tech)
  {
    id: "wcws-2026-06-01-tenn-tex",
    state: "pre",
    detail: "12:00 PM EDT \u00b7 ESPN",
    date: "2026-06-01T16:00:00Z",
    regional: "WCWS \u00b7 Semifinal",
    away: { name: "Tennessee", rank: 2, score: undefined },
    home: { name: "Texas", rank: 1, score: undefined },
  },
  {
    id: "wcws-2026-06-01-bama-ttu",
    state: "pre",
    detail: "7:00 PM EDT \u00b7 ESPN",
    date: "2026-06-01T23:00:00Z",
    regional: "WCWS \u00b7 Semifinal",
    away: { name: "Alabama", rank: 1, score: undefined },
    home: { name: "Texas Tech", rank: 3, score: undefined },
  },
  // Jun 3-5 \u2014 Championship Series (Best of 3)
  {
    id: "wcws-2026-06-03-cs-g1",
    state: "pre",
    detail: "8:00 PM EDT \u00b7 ESPN",
    date: "2026-06-03T00:00:00Z",
    regional: "WCWS Championship Series \u00b7 Game 1",
    away: { name: "TBD" },
    home: { name: "TBD" },
  },
  {
    id: "wcws-2026-06-04-cs-g2",
    state: "pre",
    detail: "8:00 PM EDT \u00b7 ESPN",
    date: "2026-06-04T00:00:00Z",
    regional: "WCWS Championship Series \u00b7 Game 2",
    away: { name: "TBD" },
    home: { name: "TBD" },
  },
  {
    id: "wcws-2026-06-05-cs-g3",
    state: "pre",
    detail: "8:00 PM EDT \u00b7 ESPN \u00b7 If Necessary",
    date: "2026-06-05T00:00:00Z",
    regional: "WCWS Championship Series \u00b7 Game 3",
    away: { name: "TBD" },
    home: { name: "TBD" },
  },
];

export const WCWS_FEED_SOURCE_LABEL =
  "Manual feed \u00b7 ESPN softball API unavailable \u00b7 source: NCAA.com WCWS bracket";
