// Build 3: Single source of truth for sports across the entire platform.
// Used by onboarding, profile, search, leaderboards, Brand Wall, Coach Lynx
// context, and the stats router. Women's and men's are first-class peers.
// Alphabetical. No "major sports" hierarchy.

export type Gender = "men" | "women" | "coed" | "any";

export interface Sport {
  /** Stable slug stored in athlete_profiles.sport */
  key: string;
  /** Human-facing label as shown in pickers and headers */
  label: string;
  /** Optional short tag, e.g. "W" / "M" for split sports */
  genderTag?: "W" | "M";
  gender: Gender;
  /** Group label for analytics + Coach Lynx prompts */
  group:
    | "baseball_softball"
    | "basketball"
    | "cross_country"
    | "football"
    | "golf"
    | "gymnastics"
    | "lacrosse"
    | "hockey"
    | "rowing"
    | "soccer"
    | "swim_dive"
    | "tennis"
    | "track_field"
    | "volleyball"
    | "water_polo"
    | "wrestling";
  /** NCAA divisions where this sport is sanctioned at any level */
  ncaaDivisions: Array<"D1" | "D2" | "D3" | "NAIA" | "JUCO">;
  /** Common high-school equivalent name (for HS athletes) */
  highSchoolName?: string;
  /** Sport-specific stat keys surfaced on the Stats tab in this order */
  primaryStats: string[];
}

export const SPORTS: Sport[] = [
  // Baseball / Softball
  {
    key: "baseball",
    label: "Baseball",
    gender: "men",
    group: "baseball_softball",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA", "JUCO"],
    primaryStats: ["AVG", "OBP", "SLG", "HR", "RBI", "SB", "ERA", "K9"],
  },
  // Basketball
  {
    key: "basketball_m",
    label: "Basketball (M)",
    genderTag: "M",
    gender: "men",
    group: "basketball",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA", "JUCO"],
    primaryStats: ["PPG", "RPG", "APG", "SPG", "BPG", "FG%", "3P%", "FT%"],
  },
  {
    key: "basketball_w",
    label: "Basketball (W)",
    genderTag: "W",
    gender: "women",
    group: "basketball",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA", "JUCO"],
    primaryStats: ["PPG", "RPG", "APG", "SPG", "BPG", "FG%", "3P%", "FT%"],
  },
  // Cross Country
  {
    key: "cross_country_m",
    label: "Cross Country (M)",
    genderTag: "M",
    gender: "men",
    group: "cross_country",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA"],
    primaryStats: ["5K", "8K", "10K", "PR", "STATE_RANK"],
  },
  {
    key: "cross_country_w",
    label: "Cross Country (W)",
    genderTag: "W",
    gender: "women",
    group: "cross_country",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA"],
    primaryStats: ["5K", "6K", "PR", "STATE_RANK"],
  },
  // Football
  {
    key: "football",
    label: "Football",
    gender: "men",
    group: "football",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA", "JUCO"],
    primaryStats: ["PASS_YDS", "RUSH_YDS", "REC_YDS", "TD", "TKL", "INT", "SACKS"],
  },
  // Golf
  {
    key: "golf_m",
    label: "Golf (M)",
    genderTag: "M",
    gender: "men",
    group: "golf",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA"],
    primaryStats: ["AVG_SCORE", "BIRDIES", "EAGLES", "STATE_RANK"],
  },
  {
    key: "golf_w",
    label: "Golf (W)",
    genderTag: "W",
    gender: "women",
    group: "golf",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA"],
    primaryStats: ["AVG_SCORE", "BIRDIES", "EAGLES", "STATE_RANK"],
  },
  // Gymnastics
  {
    key: "gymnastics_w",
    label: "Gymnastics (W)",
    genderTag: "W",
    gender: "women",
    group: "gymnastics",
    ncaaDivisions: ["D1", "D2", "D3"],
    primaryStats: ["VAULT", "BARS", "BEAM", "FLOOR", "ALL_AROUND"],
  },
  {
    key: "gymnastics_m",
    label: "Gymnastics (M)",
    genderTag: "M",
    gender: "men",
    group: "gymnastics",
    ncaaDivisions: ["D1"],
    primaryStats: [
      "FLOOR",
      "POMMEL",
      "RINGS",
      "VAULT",
      "PARALLEL_BARS",
      "HIGH_BAR",
      "ALL_AROUND",
    ],
  },
  // Hockey (Ice)
  {
    key: "hockey_m",
    label: "Hockey (M)",
    genderTag: "M",
    gender: "men",
    group: "hockey",
    ncaaDivisions: ["D1", "D3"],
    primaryStats: ["G", "A", "PTS", "+/-", "PIM", "SV%"],
  },
  {
    key: "hockey_w",
    label: "Hockey (W)",
    genderTag: "W",
    gender: "women",
    group: "hockey",
    ncaaDivisions: ["D1", "D3"],
    primaryStats: ["G", "A", "PTS", "+/-", "PIM", "SV%"],
  },
  // Lacrosse
  {
    key: "lacrosse_m",
    label: "Lacrosse (M)",
    genderTag: "M",
    gender: "men",
    group: "lacrosse",
    ncaaDivisions: ["D1", "D2", "D3"],
    primaryStats: ["G", "A", "PTS", "GB", "FO%"],
  },
  {
    key: "lacrosse_w",
    label: "Lacrosse (W)",
    genderTag: "W",
    gender: "women",
    group: "lacrosse",
    ncaaDivisions: ["D1", "D2", "D3"],
    primaryStats: ["G", "A", "PTS", "DC", "GB"],
  },
  // Rowing (women's championship sport; men's club at most schools)
  {
    key: "rowing_w",
    label: "Rowing (W)",
    genderTag: "W",
    gender: "women",
    group: "rowing",
    ncaaDivisions: ["D1", "D2", "D3"],
    primaryStats: ["2K_ERG", "5K_ERG", "BOAT", "SEAT_RACE"],
  },
  // Soccer
  {
    key: "soccer_m",
    label: "Soccer (M)",
    genderTag: "M",
    gender: "men",
    group: "soccer",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA", "JUCO"],
    primaryStats: ["G", "A", "PTS", "SH", "GA", "SV%", "CS"],
  },
  {
    key: "soccer_w",
    label: "Soccer (W)",
    genderTag: "W",
    gender: "women",
    group: "soccer",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA", "JUCO"],
    primaryStats: ["G", "A", "PTS", "SH", "GA", "SV%", "CS"],
  },
  // Softball
  {
    key: "softball",
    label: "Softball",
    gender: "women",
    group: "baseball_softball",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA", "JUCO"],
    primaryStats: ["AVG", "OBP", "SLG", "HR", "RBI", "SB", "ERA", "K7"],
  },
  // Swim & Dive
  {
    key: "swim_dive_m",
    label: "Swim & Dive (M)",
    genderTag: "M",
    gender: "men",
    group: "swim_dive",
    ncaaDivisions: ["D1", "D2", "D3"],
    primaryStats: ["50_FREE", "100_FREE", "200_IM", "100_BACK", "100_BREAST", "100_FLY"],
  },
  {
    key: "swim_dive_w",
    label: "Swim & Dive (W)",
    genderTag: "W",
    gender: "women",
    group: "swim_dive",
    ncaaDivisions: ["D1", "D2", "D3"],
    primaryStats: ["50_FREE", "100_FREE", "200_IM", "100_BACK", "100_BREAST", "100_FLY"],
  },
  // Tennis
  {
    key: "tennis_m",
    label: "Tennis (M)",
    genderTag: "M",
    gender: "men",
    group: "tennis",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA"],
    primaryStats: ["UTR", "SINGLES_W", "SINGLES_L", "DOUBLES_W", "DOUBLES_L"],
  },
  {
    key: "tennis_w",
    label: "Tennis (W)",
    genderTag: "W",
    gender: "women",
    group: "tennis",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA"],
    primaryStats: ["UTR", "SINGLES_W", "SINGLES_L", "DOUBLES_W", "DOUBLES_L"],
  },
  // Track & Field
  {
    key: "track_field_m",
    label: "Track & Field (M)",
    genderTag: "M",
    gender: "men",
    group: "track_field",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA"],
    primaryStats: ["100M", "200M", "400M", "LONG_JUMP", "HIGH_JUMP", "SHOT", "EVENT_PR"],
  },
  {
    key: "track_field_w",
    label: "Track & Field (W)",
    genderTag: "W",
    gender: "women",
    group: "track_field",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA"],
    primaryStats: ["100M", "200M", "400M", "LONG_JUMP", "HIGH_JUMP", "SHOT", "EVENT_PR"],
  },
  // Volleyball
  {
    key: "volleyball_w",
    label: "Volleyball (W)",
    genderTag: "W",
    gender: "women",
    group: "volleyball",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA", "JUCO"],
    primaryStats: ["K", "ASSISTS", "DIGS", "BLOCKS", "ACES", "HIT%"],
  },
  {
    key: "volleyball_m",
    label: "Volleyball (M)",
    genderTag: "M",
    gender: "men",
    group: "volleyball",
    ncaaDivisions: ["D1", "D2", "D3"],
    primaryStats: ["K", "ASSISTS", "DIGS", "BLOCKS", "ACES", "HIT%"],
  },
  // Water Polo
  {
    key: "water_polo_m",
    label: "Water Polo (M)",
    genderTag: "M",
    gender: "men",
    group: "water_polo",
    ncaaDivisions: ["D1", "D3"],
    primaryStats: ["G", "A", "PTS", "STEALS", "SV%"],
  },
  {
    key: "water_polo_w",
    label: "Water Polo (W)",
    genderTag: "W",
    gender: "women",
    group: "water_polo",
    ncaaDivisions: ["D1", "D2", "D3"],
    primaryStats: ["G", "A", "PTS", "STEALS", "SV%"],
  },
  // Wrestling
  {
    key: "wrestling_m",
    label: "Wrestling (M)",
    genderTag: "M",
    gender: "men",
    group: "wrestling",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA", "JUCO"],
    primaryStats: ["WEIGHT", "RECORD", "PINS", "STATE_PLACE"],
  },
  {
    key: "wrestling_w",
    label: "Wrestling (W)",
    genderTag: "W",
    gender: "women",
    group: "wrestling",
    ncaaDivisions: ["D1", "D2", "D3", "NAIA"],
    primaryStats: ["WEIGHT", "RECORD", "PINS", "STATE_PLACE"],
  },
];

/** Alphabetical-by-label list for pickers. Women's and men's interleave naturally. */
export const SPORTS_ALPHA: Sport[] = [...SPORTS].sort((a, b) =>
  a.label.localeCompare(b.label)
);

export function findSport(key: string | null | undefined): Sport | undefined {
  if (!key) return undefined;
  return SPORTS.find((s) => s.key === key);
}

export function primaryStatsFor(sportKey: string | null | undefined): string[] {
  return findSport(sportKey)?.primaryStats ?? ["G", "W-L", "AVG", "PTS", "RANK"];
}
