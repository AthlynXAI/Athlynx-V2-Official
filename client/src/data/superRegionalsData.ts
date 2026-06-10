/**
 * ============================================================
 * SUPER REGIONALS DATA — 2026 MCWS
 * ============================================================
 * MANUAL UPDATE HERE — Chad, update this file for live scores.
 * No component logic changes needed. Just update scores/status below.
 *
 * Status options: "scheduled" | "live" | "final"
 * Series status: "not_started" | "in_progress" | "complete"
 * ============================================================
 * Last updated: Jun 09, 2026 03:55 UTC — AthlynXAI OS v1 auto-update
 * ============================================================
 */

export type GameStatus = "scheduled" | "live" | "final";
export type SeriesStatus = "not_started" | "in_progress" | "complete";

export interface SuperRegionalGame {
  gameNum: 1 | 2 | 3;
  date: string;
  ctTime: string;
  network: string;
  status: GameStatus;
  homeScore?: number;
  awayScore?: number;
  inning?: string; // e.g. "Bot 1st", "Top 5th", "F/9"
  result?: string; // e.g. "WVU 12, Cal Poly 2"
}

export interface SuperRegional {
  num: number;
  site: string;
  home: { name: string; dsr: number; record: string };
  away: { name: string; dsr: number; record: string };
  seriesStatus: SeriesStatus;
  seriesScore: string; // e.g. "WVU leads 1-0" | "Tied 0-0" | "WVU wins 2-0"
  winner?: string;
  featured?: boolean;
  featuredNote?: string;
  games: SuperRegionalGame[];
}

// ============================================================
// ▼▼▼  MANUAL UPDATE ZONE — EDIT SCORES/STATUS HERE  ▼▼▼
// ============================================================

export const SUPER_REGIONALS_2026: SuperRegional[] = [
  // ── #1 ATHENS — Georgia vs Mississippi State ──────────────
  {
    num: 1, site: "Athens",
    home: { name: "Georgia", dsr: 4, record: "49-12" },
    away: { name: "Mississippi State", dsr: 12, record: "43-17" },
    seriesStatus: "not_started",
    seriesScore: "Series: Sat–Mon",
    featured: true,
    featuredNote: "THE MUST WATCH SERIES · #HailState",
    games: [
      { gameNum: 1, date: "Sat Jun 7", ctTime: "11:00 AM CT", network: "ESPN", status: "scheduled" },
      { gameNum: 2, date: "Sun Jun 8", ctTime: "12:00 PM CT", network: "ESPN", status: "scheduled" },
      { gameNum: 3, date: "Mon Jun 9", ctTime: "TBD", network: "ESPN", status: "scheduled" },
    ],
  },

  // ── #2 CHAPEL HILL — North Carolina vs USC ────────────────
  {
    num: 2, site: "Chapel Hill",
    home: { name: "North Carolina", dsr: 3, record: "48-11-1" },
    away: { name: "USC", dsr: 23, record: "47-16" },
    seriesStatus: "in_progress",
    seriesScore: "USC Leads 1-0",
    games: [
      {
        gameNum: 1, date: "Fri Jun 6", ctTime: "FINAL", network: "ESPN2",
        status: "final",
        homeScore: 5, awayScore: 9,
        inning: "Final",
        result: "USC 9, North Carolina 5 — FINAL · USC leads series 1-0",
      },
      { gameNum: 2, date: "Sat Jun 7", ctTime: "2:00 PM CT", network: "ESPN", status: "scheduled" },
      { gameNum: 3, date: "Sun Jun 8", ctTime: "TBD", network: "ESPN", status: "scheduled" },
    ],
  },

  // ── #3 AUSTIN — Texas vs Oregon ───────────────────────────
  {
    num: 3, site: "Austin",
    home: { name: "Texas", dsr: 6, record: "43-19" },
    away: { name: "Oregon", dsr: 18, record: "43-16" },
    seriesStatus: "not_started",
    seriesScore: "Series: Sat–Mon",
    games: [
      { gameNum: 1, date: "Sat Jun 7", ctTime: "8:00 PM CT", network: "ESPN", status: "scheduled" },
      { gameNum: 2, date: "Sun Jun 8", ctTime: "9:00 PM CT", network: "ESPN", status: "scheduled" },
      { gameNum: 3, date: "Mon Jun 9", ctTime: "TBD", network: "ESPN", status: "scheduled" },
    ],
  },

  // ── #4 AUBURN — Auburn vs Ole Miss ────────────────────────
  {
    num: 4, site: "Auburn",
    home: { name: "Auburn", dsr: 5, record: "41-20" },
    away: { name: "Ole Miss", dsr: 20, record: "39-21" },
    seriesStatus: "in_progress",
    seriesScore: "Ole Miss leads 1-0",
    games: [
      {
        gameNum: 1, date: "Fri Jun 6", ctTime: "FINAL", network: "ESPN2",
        status: "final",
        homeScore: 4, awayScore: 6,
        inning: "FINAL",
        result: "Auburn 4, Ole Miss 6",
      },
      { gameNum: 2, date: "Sat Jun 7", ctTime: "5:00 PM CT", network: "ESPN", status: "scheduled" },
      { gameNum: 3, date: "Sun Jun 8", ctTime: "TBD", network: "ESPN", status: "scheduled" },
    ],
  },

  // ── #5 LAWRENCE — Kansas vs Oklahoma ──────────────────────
  {
    num: 5, site: "Lawrence",
    home: { name: "Kansas", dsr: 9, record: "45-16" },
    away: { name: "Oklahoma", dsr: 31, record: "39-22" },
    seriesStatus: "not_started",
    seriesScore: "Series: Sat–Mon",
    games: [
      { gameNum: 1, date: "Sat Jun 7", ctTime: "6:00 PM CT", network: "ESPN2", status: "scheduled" },
      { gameNum: 2, date: "Sun Jun 8", ctTime: "6:00 PM CT", network: "TBD", status: "scheduled" },
      { gameNum: 3, date: "Mon Jun 9", ctTime: "TBD", network: "TBD", status: "scheduled" },
    ],
  },

  // ── #6 MORGANTOWN — West Virginia vs Cal Poly ─────────────
  {
    num: 6, site: "Morgantown",
    home: { name: "West Virginia", dsr: 10, record: "43-15" },
    away: { name: "Cal Poly", dsr: 79, record: "39-22" },
    seriesStatus: "in_progress",
    seriesScore: "WVU leads 1-0",
    games: [
      {
        gameNum: 1, date: "Fri Jun 6", ctTime: "FINAL", network: "ESPN2",
        status: "final",
        homeScore: 12, awayScore: 2,
        result: "West Virginia 12, Cal Poly 2 — WVU leads series 1-0",
      },
      { gameNum: 2, date: "Sat Jun 7", ctTime: "12:00 PM CT", network: "ESPN2", status: "scheduled" },
      { gameNum: 3, date: "Sun Jun 8", ctTime: "TBD", network: "ESPN2", status: "scheduled" },
    ],
  },

  // ── #7 TUSCALOOSA — Alabama vs St. John's ─────────────────
  {
    num: 7, site: "Tuscaloosa",
    home: { name: "Alabama", dsr: 15, record: "40-19" },
    away: { name: "St. John's", dsr: 95, record: "36-24" },
    seriesStatus: "not_started",
    seriesScore: "Series: Sat–Mon",
    games: [
      { gameNum: 1, date: "Sat Jun 7", ctTime: "9:00 PM CT", network: "ESPN2", status: "scheduled" },
      { gameNum: 2, date: "Sun Jun 8", ctTime: "3:00 PM CT", network: "TBD", status: "scheduled" },
      { gameNum: 3, date: "Mon Jun 9", ctTime: "TBD", network: "TBD", status: "scheduled" },
    ],
  },

  // ── #8 TROY — Troy vs Little Rock ─────────────────────────
  {
    num: 8, site: "Troy",
    home: { name: "Troy", dsr: 52, record: "36-30" },
    away: { name: "Little Rock", dsr: 108, record: "39-26" },
    seriesStatus: "in_progress",
    seriesScore: "Series: 0-0",
    games: [
      {
        gameNum: 1, date: "Fri Jun 6", ctTime: "5:00 PM CT", network: "ESPNU",
        status: "final",
        homeScore: 12, awayScore: 2,
        inning: "FINAL",
        result: "Troy 12, Little Rock Trojans 2",
      },
      { gameNum: 2, date: "Sat Jun 7", ctTime: "3:00 PM CT", network: "ESPNU", status: "scheduled" },
      { gameNum: 3, date: "Sun Jun 8", ctTime: "TBD", network: "ESPNU", status: "scheduled" },
    ],
  },
];

// ============================================================
// ▲▲▲  END MANUAL UPDATE ZONE  ▲▲▲
// ============================================================
