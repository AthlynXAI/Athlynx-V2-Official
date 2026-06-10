/**
 * WCWS 2026 manual bracket override.
 *
 * ESPN's public college-softball scoreboard endpoint has been returning
 * zero events for the duration of the 2026 WCWS. This file is the
 * human-curated truth, updated as games finish.
 *
 * CHAMPIONSHIP SERIES: #1 Texas vs #3 Texas Tech
 *   Game 1 (Jun 3): Texas 7, Texas Tech 3 — Texas leads series 1-0
 *   Game 2 (Jun 4): Texas 4, Texas Tech 1 — TEXAS WINS 2-0 SWEEP 🏆
 *   Game 3: NOT PLAYED — Texas sweeps
 *
 * 🏆 TEXAS IS BACK-TO-BACK WCWS NATIONAL CHAMPIONS 2025-2026
 *
 * Updated 2026-06-05 by AthlynXAI.
 */
export interface WcwsManualGame {
  id: string;
  state: "pre" | "in" | "post";
  detail: string;
  date: string;
  away: { name: string; rank?: number; score?: string };
  home: { name: string; rank?: number; score?: string };
  regional: string;
  advancesToSuper?: string;
}

export const WCWS_MANUAL_FEED: WcwsManualGame[] = [
  // May 28 — Opening round
  {
    id: "wcws-2026-05-28-ttu-msu",
    state: "post", detail: "FINAL",
    date: "2026-05-28T22:00:00Z",
    regional: "WCWS · Opening Round",
    away: { name: "Texas Tech", rank: 11, score: "8" },
    home: { name: "Mississippi State", score: "0" },
  },
  {
    id: "wcws-2026-05-28-tenn-tex",
    state: "post", detail: "FINAL",
    date: "2026-05-28T20:00:00Z",
    regional: "WCWS · Opening Round",
    away: { name: "Tennessee", rank: 7, score: "6" },
    home: { name: "Texas", rank: 2, score: "3" },
  },
  {
    id: "wcws-2026-05-28-bama-ucla",
    state: "post", detail: "FINAL",
    date: "2026-05-28T18:00:00Z",
    regional: "WCWS · Opening Round",
    away: { name: "Alabama", rank: 1, score: "6" },
    home: { name: "UCLA", rank: 8, score: "3" },
  },
  {
    id: "wcws-2026-05-28-neb-ark",
    state: "post", detail: "FINAL",
    date: "2026-05-28T16:00:00Z",
    regional: "WCWS · Opening Round",
    away: { name: "Nebraska", rank: 4, score: "5" },
    home: { name: "Arkansas", rank: 5, score: "3" },
  },
  // May 29 — Elimination round
  {
    id: "wcws-2026-05-29-tex-msu",
    state: "post", detail: "FINAL",
    date: "2026-05-29T22:00:00Z",
    regional: "WCWS · Elimination",
    away: { name: "Texas", rank: 2, score: "4" },
    home: { name: "Mississippi State", score: "0" },
    advancesToSuper: "Texas",
  },
  {
    id: "wcws-2026-05-29-ucla-ark",
    state: "post", detail: "FINAL (5)",
    date: "2026-05-29T20:00:00Z",
    regional: "WCWS · Elimination",
    away: { name: "UCLA", rank: 8, score: "11" },
    home: { name: "Arkansas", rank: 5, score: "0" },
    advancesToSuper: "UCLA",
  },
  // May 30 — Bracket semifinals
  {
    id: "wcws-2026-05-30-ttu-tenn",
    state: "post", detail: "FINAL",
    date: "2026-05-30T20:00:00Z",
    regional: "WCWS · Bracket Semifinal",
    away: { name: "Texas Tech", rank: 11, score: "1" },
    home: { name: "Tennessee", rank: 7, score: "2" },
  },
  {
    id: "wcws-2026-05-30-bama-neb",
    state: "post", detail: "FINAL",
    date: "2026-05-30T22:00:00Z",
    regional: "WCWS · Bracket Semifinal",
    away: { name: "Alabama", rank: 1, score: "5" },
    home: { name: "Nebraska", rank: 4, score: "1" },
  },
  // May 31 — Bracket finals (clinch Championship Series)
  {
    id: "wcws-2026-05-31-tex-neb",
    state: "post", detail: "FINAL",
    date: "2026-05-31T22:00:00Z",
    regional: "WCWS · Bracket Final",
    away: { name: "Nebraska", rank: 4, score: "1" },
    home: { name: "Texas", rank: 2, score: "3" },
    advancesToSuper: "Texas",
  },
  {
    id: "wcws-2026-05-31-ttu-ucla",
    state: "post", detail: "FINAL (9)",
    date: "2026-05-31T23:00:00Z",
    regional: "WCWS · Bracket Final",
    away: { name: "Texas Tech", rank: 11, score: "8" },
    home: { name: "UCLA", rank: 8, score: "7" },
    advancesToSuper: "Texas Tech",
  },
  // Jun 1 — Semifinals
  {
    id: "wcws-2026-06-01-tenn-tex-g1",
    state: "post", detail: "FINAL",
    date: "2026-06-01T16:00:00Z",
    regional: "WCWS · Semifinal",
    away: { name: "Tennessee", rank: 7, score: "2" },
    home: { name: "Texas", rank: 1, score: "5" },
    advancesToSuper: "Texas",
  },
  {
    id: "wcws-2026-06-01-tenn-tex-g2",
    state: "post", detail: "FINAL",
    date: "2026-06-01T20:00:00Z",
    regional: "WCWS · Semifinal",
    away: { name: "Tennessee", rank: 7, score: "0" },
    home: { name: "Texas", rank: 1, score: "4" },
    advancesToSuper: "Texas",
  },
  {
    id: "wcws-2026-06-01-bama-ttu-g1",
    state: "post", detail: "FINAL",
    date: "2026-06-01T22:00:00Z",
    regional: "WCWS · Semifinal",
    away: { name: "Alabama", rank: 1, score: "4" },
    home: { name: "Texas Tech", rank: 3, score: "5" },
    advancesToSuper: "Texas Tech",
  },
  {
    id: "wcws-2026-06-01-bama-ttu-g2",
    state: "post", detail: "FINAL",
    date: "2026-06-02T00:00:00Z",
    regional: "WCWS · Semifinal",
    away: { name: "Alabama", rank: 1, score: "0" },
    home: { name: "Texas Tech", rank: 3, score: "2" },
    advancesToSuper: "Texas Tech",
  },
  // Jun 3-5 — Championship Series (Best of 3)
  // GAME 1 RESULT: Texas 7, Texas Tech 3 — Texas leads 1-0
  {
    id: "wcws-2026-06-03-cs-g1",
    state: "post",
    detail: "FINAL · Texas leads series 1-0",
    date: "2026-06-04T01:00:00Z",
    regional: "WCWS Championship Series · Game 1",
    away: { name: "Texas Tech", rank: 3, score: "3" },
    home: { name: "Texas", rank: 1, score: "7" },
    advancesToSuper: "Texas leads 1-0",
  },
  // GAME 2 RESULT: Texas 4, Texas Tech 1 — TEXAS SWEEPS 2-0 🏆
  {
    id: "wcws-2026-06-04-cs-g2",
    state: "post",
    detail: "FINAL · Texas sweeps series 2-0 · 🏆 BACK-TO-BACK NATIONAL CHAMPIONS",
    date: "2026-06-05T00:00:00Z",
    regional: "WCWS Championship Series · Game 2",
    away: { name: "Texas Tech", rank: 3, score: "1" },
    home: { name: "Texas", rank: 1, score: "4" },
    advancesToSuper: "Texas — 2026 WCWS National Champions 🏆",
  },
  // GAME 3: NOT PLAYED — Texas swept the series
  {
    id: "wcws-2026-06-05-cs-g3",
    state: "post",
    detail: "NOT PLAYED · Texas swept the series 2-0",
    date: "2026-06-06T00:00:00Z",
    regional: "WCWS Championship Series · Game 3",
    away: { name: "Texas Tech", rank: 3, score: undefined },
    home: { name: "Texas", rank: 1, score: undefined },
  },
];

export const WCWS_FEED_SOURCE_LABEL =
  "Manual feed · ESPN softball API unavailable · source: NCAA.com WCWS bracket";
