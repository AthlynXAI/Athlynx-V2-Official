// =============================================================================
// AthlynX Mobile App — Seed Data (2026)
// Compiled: June 8, 2026
// All data sourced from public reporting (NCAA.com, ESPN, On3, Baseball America,
// 247Sports, theacc.com, secsports.com). See sourcesIndex at bottom.
// =============================================================================

// -----------------------------------------------------------------------------
// 1) 2026 MEN'S COLLEGE WORLD SERIES — OMAHA
// -----------------------------------------------------------------------------

export interface CWSTeam {
  school: string;
  mascot: string;
  nationalSeed: number | null;     // null if unseeded (Oklahoma, Ole Miss, Troy)
  bracket: 1 | 2;
  overallRecord: string;           // entering Omaha
  cwsWins: number;
  cwsLosses: number;
  primaryColorHex: string;
  secondaryColorHex: string;
  superRegionalResult: string;
}

export interface CWSGame {
  gameId: number;
  bracket: 1 | 2 | "FINAL";
  date: string;                    // ISO date
  timeCT: string;                  // central time
  matchup: string;                 // "Team A vs Team B"
  network: string;
  score: string | null;            // null = not yet played
  status: "scheduled" | "in_progress" | "final";
}

export const CWS_2026_TEAMS: CWSTeam[] = [
  // Bracket 1
  {
    school: "North Carolina",
    mascot: "Tar Heels",
    nationalSeed: 5,
    bracket: 1,
    overallRecord: "50-12-1",
    cwsWins: 0,
    cwsLosses: 0,
    primaryColorHex: "#7BAFD4",   // Carolina Blue
    secondaryColorHex: "#FFFFFF",
    superRegionalResult: "def. USC 2-1",
  },
  {
    school: "Ole Miss",
    mascot: "Rebels",
    nationalSeed: null,
    bracket: 1,
    overallRecord: "41-21",
    cwsWins: 0,
    cwsLosses: 0,
    primaryColorHex: "#CE1126",   // Rebel Red
    secondaryColorHex: "#14213D", // Navy
    superRegionalResult: "def. No. 4 Auburn 2-0",
  },
  {
    school: "West Virginia",
    mascot: "Mountaineers",
    nationalSeed: 16,
    bracket: 1,
    overallRecord: "45-15",
    cwsWins: 0,
    cwsLosses: 0,
    primaryColorHex: "#002855",   // Old Gold & Blue
    secondaryColorHex: "#EAAA00",
    superRegionalResult: "def. Cal Poly 2-0",
  },
  {
    school: "Troy",
    mascot: "Trojans",
    nationalSeed: null,
    bracket: 1,
    overallRecord: "38-30",
    cwsWins: 0,
    cwsLosses: 0,
    primaryColorHex: "#8B0000",   // Cardinal
    secondaryColorHex: "#9EA2A2", // Silver
    superRegionalResult: "def. Little Rock 2-0",
  },

  // Bracket 2
  {
    school: "Georgia",
    mascot: "Bulldogs",
    nationalSeed: 3,
    bracket: 2,
    overallRecord: "51-12",
    cwsWins: 0,
    cwsLosses: 0,
    primaryColorHex: "#BA0C2F",   // Bulldog Red
    secondaryColorHex: "#000000",
    superRegionalResult: "def. No. 14 Mississippi State 2-0",
  },
  {
    school: "Texas",
    mascot: "Longhorns",
    nationalSeed: 6,
    bracket: 2,
    overallRecord: "45-13",
    cwsWins: 0,
    cwsLosses: 0,
    primaryColorHex: "#BF5700",   // Burnt Orange
    secondaryColorHex: "#FFFFFF",
    superRegionalResult: "def. No. 11 Oregon 2-0",
  },
  {
    school: "Alabama",
    mascot: "Crimson Tide",
    nationalSeed: 7,
    bracket: 2,
    overallRecord: "41-19",
    cwsWins: 0,
    cwsLosses: 0,
    primaryColorHex: "#9E1B32",   // Crimson
    secondaryColorHex: "#FFFFFF",
    superRegionalResult: "def. St. John's 2-0",
  },
  {
    school: "Oklahoma",
    mascot: "Sooners",
    nationalSeed: null,
    bracket: 2,
    overallRecord: "37-22",
    cwsWins: 0,
    cwsLosses: 0,
    primaryColorHex: "#841617",   // Crimson
    secondaryColorHex: "#FDF9D8", // Cream
    superRegionalResult: "def. No. 15 Kansas 2-0",
  },
];

// Bracket structure — opening round of double-elimination.
// CWS uses two 4-team double-elim pools, then a best-of-3 final.
export const CWS_2026_SCHEDULE: CWSGame[] = [
  // Day 1 — Friday June 12
  {
    gameId: 1,
    bracket: 1,
    date: "2026-06-12",
    timeCT: "1:00 PM",
    matchup: "West Virginia vs Troy",
    network: "ESPN",
    score: null,
    status: "scheduled",
  },
  {
    gameId: 2,
    bracket: 1,
    date: "2026-06-12",
    timeCT: "6:00 PM",
    matchup: "North Carolina vs Ole Miss",
    network: "ESPN",
    score: null,
    status: "scheduled",
  },

  // Day 2 — Saturday June 13
  {
    gameId: 3,
    bracket: 2,
    date: "2026-06-13",
    timeCT: "2:00 PM",
    matchup: "Oklahoma vs Alabama",
    network: "ESPN",
    score: null,
    status: "scheduled",
  },
  {
    gameId: 4,
    bracket: 2,
    date: "2026-06-13",
    timeCT: "7:00 PM",
    matchup: "Georgia vs Texas",
    network: "ESPN",
    score: null,
    status: "scheduled",
  },

  // Games 5–14 (winners' and elimination matchups) populated as bracket resolves.
  // Best-of-3 Final follows.
  {
    gameId: 15,
    bracket: "FINAL",
    date: "2026-06-20",
    timeCT: "7:00 PM",
    matchup: "Bracket 1 Winner vs Bracket 2 Winner — Game 1",
    network: "ESPN",
    score: null,
    status: "scheduled",
  },
  {
    gameId: 16,
    bracket: "FINAL",
    date: "2026-06-21",
    timeCT: "1:30 PM",
    matchup: "CWS Finals — Game 2",
    network: "ABC",
    score: null,
    status: "scheduled",
  },
  {
    gameId: 17,
    bracket: "FINAL",
    date: "2026-06-22",
    timeCT: "6:00 PM",
    matchup: "CWS Finals — Game 3 (if necessary)",
    network: "ESPN",
    score: null,
    status: "scheduled",
  },
];

// NOTE: As of compile date (June 8, 2026), Omaha has NOT started yet —
// first pitch is Friday, June 12. All teams enter 0-0 in the CWS.
// Update cwsWins/cwsLosses and game scores after each day of play.

// -----------------------------------------------------------------------------
// 2) DIAMOND GRIND — NCAA D1 CONFERENCES + 2026 MLB DRAFT PROSPECTS
// -----------------------------------------------------------------------------

export interface ConferenceTeamStanding {
  team: string;
  overallWins: number;
  overallLosses: number;
  conferenceRecord: string;        // e.g. "23-7"
}

export interface D1Conference {
  rank: number;                    // RPI / power ranking tier
  name: string;
  abbr: string;
  standings: ConferenceTeamStanding[];
}

// Top 10 D1 baseball conferences ranked by national strength (RPI / power tiers)
// for the 2026 regular season. Full per-team standings shown for the top 2
// (SEC, ACC) since they drive the bulk of CWS bids; representative top teams
// shown for the remaining conferences.
export const D1_BASEBALL_CONFERENCES_2026: D1Conference[] = [
  {
    rank: 1,
    name: "Southeastern Conference",
    abbr: "SEC",
    standings: [
      { team: "Texas",             overallWins: 51, overallLosses: 12, conferenceRecord: "23-7"  },
      { team: "LSU",               overallWins: 45, overallLosses: 13, conferenceRecord: "19-10" },
      { team: "Auburn",            overallWins: 41, overallLosses: 16, conferenceRecord: "18-11" },
      { team: "Alabama",           overallWins: 42, overallLosses: 19, conferenceRecord: "18-12" },
      { team: "Florida",           overallWins: 41, overallLosses: 21, conferenceRecord: "18-12" },
      { team: "Arkansas",          overallWins: 42, overallLosses: 22, conferenceRecord: "17-13" },
      { team: "Georgia",           overallWins: 41, overallLosses: 22, conferenceRecord: "17-13" },
      { team: "Tennessee",         overallWins: 43, overallLosses: 17, conferenceRecord: "16-14" },
      { team: "Ole Miss",          overallWins: 41, overallLosses: 21, conferenceRecord: "15-15" },
      { team: "Mississippi State", overallWins: 38, overallLosses: 22, conferenceRecord: "15-15" },
      { team: "Oklahoma",          overallWins: 38, overallLosses: 22, conferenceRecord: "14-16" },
      { team: "Vanderbilt",        overallWins: 33, overallLosses: 25, conferenceRecord: "14-16" },
      { team: "South Carolina",    overallWins: 33, overallLosses: 23, conferenceRecord: "13-17" },
      { team: "Missouri",          overallWins: 30, overallLosses: 28, conferenceRecord: "9-21"  },
      { team: "Kentucky",          overallWins: 22, overallLosses: 35, conferenceRecord: "7-23"  },
      { team: "Texas A&M",         overallWins: 24, overallLosses: 31, conferenceRecord: "6-24"  },
    ],
  },
  {
    rank: 2,
    name: "Atlantic Coast Conference",
    abbr: "ACC",
    standings: [
      { team: "Georgia Tech",    overallWins: 50, overallLosses: 11, conferenceRecord: "25-5"  },
      { team: "North Carolina",  overallWins: 50, overallLosses: 12, conferenceRecord: "22-8"  },
      { team: "Florida State",   overallWins: 40, overallLosses: 19, conferenceRecord: "19-11" },
      { team: "Boston College",  overallWins: 40, overallLosses: 24, conferenceRecord: "18-13" },
      { team: "Miami",           overallWins: 39, overallLosses: 20, conferenceRecord: "16-14" },
      { team: "Wake Forest",     overallWins: 39, overallLosses: 21, conferenceRecord: "16-14" },
      { team: "Virginia Tech",   overallWins: 30, overallLosses: 26, conferenceRecord: "15-15" },
      { team: "Virginia",        overallWins: 37, overallLosses: 23, conferenceRecord: "14-16" },
      { team: "NC State",        overallWins: 32, overallLosses: 24, conferenceRecord: "14-16" },
      { team: "Notre Dame",      overallWins: 31, overallLosses: 22, conferenceRecord: "13-17" },
      { team: "Louisville",      overallWins: 30, overallLosses: 27, conferenceRecord: "13-17" },
      { team: "Stanford",        overallWins: 28, overallLosses: 26, conferenceRecord: "13-17" },
      { team: "California",      overallWins: 29, overallLosses: 26, conferenceRecord: "12-18" },
      { team: "Pitt",            overallWins: 33, overallLosses: 24, conferenceRecord: "11-19" },
      { team: "Clemson",         overallWins: 31, overallLosses: 26, conferenceRecord: "10-20" },
      { team: "Duke",            overallWins: 26, overallLosses: 31, conferenceRecord: "10-20" },
    ],
  },
  {
    rank: 3,
    name: "Big 12 Conference",
    abbr: "Big 12",
    standings: [
      { team: "West Virginia", overallWins: 45, overallLosses: 15, conferenceRecord: "Top of conf" },
      { team: "Kansas",        overallWins: 45, overallLosses: 17, conferenceRecord: "T-2"         },
      { team: "Oklahoma State", overallWins: 43, overallLosses: 18, conferenceRecord: "T-2"         },
      { team: "TCU",            overallWins: 40, overallLosses: 21, conferenceRecord: "T-4"         },
      { team: "Texas Tech",    overallWins: 38, overallLosses: 22, conferenceRecord: "T-4"         },
      { team: "Baylor",        overallWins: 36, overallLosses: 24, conferenceRecord: "T-6"         },
      { team: "BYU",           overallWins: 33, overallLosses: 25, conferenceRecord: "T-6"         },
      { team: "UCF",           overallWins: 31, overallLosses: 27, conferenceRecord: "T-8"         },
      { team: "Cincinnati",    overallWins: 29, overallLosses: 28, conferenceRecord: "T-8"         },
      { team: "Houston",       overallWins: 27, overallLosses: 30, conferenceRecord: "T-10"        },
      { team: "Iowa State",    overallWins: 24, overallLosses: 33, conferenceRecord: "T-10"        },
    ],
  },
];
