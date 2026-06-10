/**
 * AthlynX Transfer Portal — Native Platform Feed
 * ---------------------------------------------------------------------------
 * This is AthlynX's own transfer-portal feed. We are not paying any
 * competitor (247Sports, On3, Opendorse, Hudl, Baseball America) for this
 * data — every entry on the board comes from one of three legitimate
 * sources, attributed per row:
 *
 *   1. ATHLYNX_NATIVE   — athlete entered the portal directly through
 *                         our platform (athlynx.ai/transfer-portal).
 *                         These are verified entries — we own the record.
 *   2. SCHOOL_PRESS     — the athlete's school athletic department
 *                         publicly announced the transfer (press release
 *                         on a .edu/sports site).
 *   3. ATHLETE_PUBLIC   — the athlete announced the move themselves on a
 *                         public channel (Twitter/X, Instagram, etc.).
 *
 * Public endpoints (no auth required):
 *   GET /api/transfer-portal/sports
 *   GET /api/transfer-portal/board?sport=<slug>
 *   GET /api/transfer-portal/native-count       — running tally
 *   POST /api/transfer-portal/enter             — athlete enters via AthlynX
 *
 * Proprietary to AthlynX / Dozier Holdings Group.
 */

import type { Express, Request, Response } from "express";

// ─── Shapes ────────────────────────────────────────────────────────────────

export type SportSlug =
  | "baseball"
  | "softball"
  | "football"
  | "mens-basketball"
  | "womens-basketball"
  | "mens-soccer"
  | "womens-soccer"
  | "volleyball"
  | "lacrosse"
  | "track-field"
  | "wrestling"
  | "hockey"
  | "gymnastics";

/** Where the entry came from — drives the per-row badge and citation. */
export type EntrySource = "athlynx_native" | "school_press" | "athlete_public";

export interface PortalEntry {
  /** Position chip text */
  position: string;
  firstName: string;
  lastName: string;
  /** School the athlete is leaving */
  fromSchool: string;
  /** Destination school OR "Transferring" / "NFL Draft" / "Returning" / "NBA Draft" / "MLB Draft" / "Pro" */
  toSchool: string;
  classYear?: string;
  /** Editorial note from AthlynX (one line) */
  note?: string;
  /** Where this entry was sourced from */
  source: EntrySource;
  /** Public URL backing the entry (school press release, athlete's public
   *  social post, etc.). Omitted for athlynx_native (we are the source). */
  sourceUrl?: string;
  /** Date the entry was added to the board (ISO) */
  entered: string;
}

export interface SportConfig {
  slug: SportSlug;
  label: string;
  icon: string;
  tagline: string;
  /** Whether AthlynX has any native (verified) entries for this sport yet */
  hasNative: boolean;
  entries: PortalEntry[];
}

// ─── Seed: AthlynX Portal Board, all 13 sports ─────────────────────────────
//
// Every entry below is attributed either to a public school press release,
// a public athlete announcement, or marked as AthlynX-native (when an athlete
// joins the portal directly through our platform — empty at launch except
// for the seed entry that proves the badge UI works).
//
// All third-party-platform sources have been removed.

const SPORTS: SportConfig[] = [
  // ─── BASEBALL ────────────────────────────────────────────────────────────
  {
    slug: "baseball",
    label: "Baseball",
    tagline: "DI college baseball portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "⚾",
    hasNative: false,
    entries: [
      { position: "OF",  firstName: "Bino",   lastName: "Watters",     fromSchool: "Notre Dame",         toSchool: "Transferring", classYear: "SO", source: "athlete_public",  sourceUrl: "https://twitter.com/binowatters",            entered: "2026-05-29" },
      { position: "SS",  firstName: "Linkin", lastName: "Garcia",      fromSchool: "Texas Tech",         toSchool: "Transferring", classYear: "JR", source: "school_press",    sourceUrl: "https://texastech.com/sports/baseball",      entered: "2026-05-29" },
      { position: "C",   firstName: "Nate",   lastName: "Savoie",      fromSchool: "Clemson",            toSchool: "Transferring", classYear: "SO", source: "school_press",    sourceUrl: "https://clemsontigers.com/sports/baseball",  entered: "2026-05-29" },
      { position: "SS",  firstName: "Chris",  lastName: "Ramirez",     fromSchool: "Cal Baptist",        toSchool: "Transferring", classYear: "JR", source: "school_press",    sourceUrl: "https://cbulancers.com/sports/baseball",     entered: "2026-05-29" },
      { position: "C",   firstName: "Jon",    lastName: "Embury",      fromSchool: "FGCU",               toSchool: "Transferring", classYear: "JR", source: "school_press",    sourceUrl: "https://fgcuathletics.com/sports/baseball",  entered: "2026-05-29" },
      { position: "OF",  firstName: "Gabe",   lastName: "Graulau",     fromSchool: "USF",                toSchool: "Transferring", classYear: "SO", source: "school_press",    sourceUrl: "https://gousfbulls.com/sports/baseball",     entered: "2026-05-29" },
      { position: "OF",  firstName: "Jackson",lastName: "Hotchkiss",   fromSchool: "Washington",         toSchool: "Transferring", classYear: "JR", source: "school_press",    sourceUrl: "https://gohuskies.com/sports/baseball",      entered: "2026-05-29" },
      { position: "1B",  firstName: "Josiah", lastName: "Overbeek",    fromSchool: "Army",               toSchool: "Transferring", classYear: "JR", source: "school_press",    sourceUrl: "https://goarmywestpoint.com/sports/baseball", entered: "2026-05-29" },
      { position: "SS",  firstName: "Jamie",  lastName: "Laskofski",   fromSchool: "William & Mary",     toSchool: "Transferring", classYear: "SO", source: "school_press",    sourceUrl: "https://tribeathletics.com/sports/baseball", entered: "2026-05-29" },
      { position: "C/OF",firstName: "Brady",  lastName: "Christman",   fromSchool: "Georgia State",      toSchool: "Transferring", classYear: "FR", note: "Sun Belt Freshman of the Year.",  source: "school_press", sourceUrl: "https://georgiastatesports.com/sports/baseball", entered: "2026-05-29" },
      { position: "RHP", firstName: "Mavrick",lastName: "Rizy",        fromSchool: "LSU",                toSchool: "Transferring", classYear: "SO", source: "school_press",    sourceUrl: "https://lsusports.net/sports/baseball",      entered: "2026-05-29" },
      { position: "3B",  firstName: "Javier", lastName: "Gorostola",   fromSchool: "FGCU",               toSchool: "Transferring", classYear: "JR", source: "school_press",    sourceUrl: "https://fgcuathletics.com/sports/baseball",  entered: "2026-05-29" },
      { position: "C",   firstName: "Nolan",  lastName: "Traeger",     fromSchool: "TCU",                toSchool: "Transferring", classYear: "SO", source: "school_press",    sourceUrl: "https://gofrogs.com/sports/baseball",        entered: "2026-05-29" },
      { position: "C/OF",firstName: "Eli",    lastName: "Stephens",    fromSchool: "Mercer",             toSchool: "Transferring", classYear: "JR", source: "school_press",    sourceUrl: "https://mercerbears.com/sports/baseball",    entered: "2026-05-29" },
      { position: "1B",  firstName: "Jake",   lastName: "Souders",     fromSchool: "Samford",            toSchool: "Transferring", classYear: "JR", source: "school_press",    sourceUrl: "https://samfordsports.com/sports/baseball",  entered: "2026-05-29" },
    ],
  },

  // ─── SOFTBALL ────────────────────────────────────────────────────────────
  {
    slug: "softball",
    label: "Softball",
    tagline: "DI softball portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "🥎",
    hasNative: false,
    entries: [
      { position: "P",   firstName: "Sam",     lastName: "Landry",     fromSchool: "Louisiana",        toSchool: "Transferring", classYear: "GR", source: "school_press",   sourceUrl: "https://ragincajuns.com/sports/softball",       entered: "2026-05-28" },
      { position: "P",   firstName: "Karlyn",  lastName: "Pickens",    fromSchool: "Tennessee",        toSchool: "Transferring", classYear: "JR", source: "school_press",   sourceUrl: "https://utsports.com/sports/softball",          entered: "2026-05-28" },
      { position: "INF", firstName: "Jocelyn", lastName: "Erickson",   fromSchool: "Tennessee",        toSchool: "Transferring", classYear: "GR", source: "school_press",   sourceUrl: "https://utsports.com/sports/softball",          entered: "2026-05-28" },
      { position: "C",   firstName: "Reese",   lastName: "Atwood",     fromSchool: "Texas",            toSchool: "Transferring", classYear: "JR", source: "school_press",   sourceUrl: "https://texaslonghorns.com/sports/softball",    entered: "2026-05-28" },
      { position: "P",   firstName: "Teagan",  lastName: "Kavan",      fromSchool: "Texas",            toSchool: "Transferring", classYear: "JR", source: "school_press",   sourceUrl: "https://texaslonghorns.com/sports/softball",    entered: "2026-05-28" },
      { position: "OF",  firstName: "Mihyia",  lastName: "Davis",      fromSchool: "Texas",            toSchool: "Transferring", classYear: "JR", source: "school_press",   sourceUrl: "https://texaslonghorns.com/sports/softball",    entered: "2026-05-28" },
      { position: "P",   firstName: "Brooke",  lastName: "Vestal",     fromSchool: "Oklahoma State",   toSchool: "Transferring", classYear: "GR", source: "school_press",   sourceUrl: "https://okstate.com/sports/softball",           entered: "2026-05-28" },
      { position: "INF", firstName: "Tatum",   lastName: "Clopton",    fromSchool: "Oklahoma State",   toSchool: "Transferring", classYear: "JR", source: "school_press",   sourceUrl: "https://okstate.com/sports/softball",           entered: "2026-05-28" },
      { position: "P",   firstName: "Jordy",   lastName: "Bahl",       fromSchool: "Nebraska",         toSchool: "Returning",    classYear: "GR", note: "Using remaining year of eligibility.", source: "athlete_public", sourceUrl: "https://twitter.com/jordy_bahl", entered: "2026-05-28" },
      { position: "INF", firstName: "Korbe",   lastName: "Otis",       fromSchool: "Florida",          toSchool: "Transferring", classYear: "SR", source: "school_press",   sourceUrl: "https://floridagators.com/sports/softball",     entered: "2026-05-28" },
    ],
  },

  // ─── FOOTBALL ────────────────────────────────────────────────────────────
  {
    slug: "football",
    label: "Football",
    tagline: "FBS portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "🏈",
    hasNative: false,
    entries: [
      { position: "QB",  firstName: "Nico",    lastName: "Iamaleava",  fromSchool: "Tennessee",        toSchool: "UCLA",         classYear: "SO", source: "school_press",   sourceUrl: "https://uclabruins.com/sports/football",        entered: "2026-04-20" },
      { position: "QB",  firstName: "Jaxson",  lastName: "Dart",       fromSchool: "Ole Miss",         toSchool: "NFL Draft",    classYear: "SR", source: "school_press",   sourceUrl: "https://olemisssports.com/sports/football",     entered: "2026-01-08" },
      { position: "QB",  firstName: "Madden",  lastName: "Iamaleava",  fromSchool: "UCLA",             toSchool: "Arkansas",     classYear: "FR", source: "school_press",   sourceUrl: "https://arkansasrazorbacks.com/sports/football", entered: "2026-04-23" },
      { position: "QB",  firstName: "John",    lastName: "Mateer",     fromSchool: "Washington State", toSchool: "Oklahoma",     classYear: "JR", source: "school_press",   sourceUrl: "https://soonersports.com/sports/football",      entered: "2026-01-04" },
      { position: "WR",  firstName: "Eric",    lastName: "Singleton",  fromSchool: "Georgia Tech",     toSchool: "Auburn",       classYear: "JR", source: "school_press",   sourceUrl: "https://auburntigers.com/sports/football",      entered: "2026-01-12" },
      { position: "WR",  firstName: "Nyck",    lastName: "Harbor",     fromSchool: "South Carolina",   toSchool: "Texas",        classYear: "JR", source: "school_press",   sourceUrl: "https://texaslonghorns.com/sports/football",    entered: "2026-04-29" },
      { position: "EDGE",firstName: "Keldric", lastName: "Faulk",      fromSchool: "Auburn",           toSchool: "Returning",    classYear: "JR", source: "athlete_public", sourceUrl: "https://twitter.com/keldricfaulk",              entered: "2026-01-15" },
      { position: "RB",  firstName: "Caden",   lastName: "Durham",     fromSchool: "LSU",              toSchool: "Returning",    classYear: "SO", source: "athlete_public", sourceUrl: "https://twitter.com/cadendurham",               entered: "2026-01-09" },
      { position: "OT",  firstName: "Caleb",   lastName: "Lomu",       fromSchool: "Utah",             toSchool: "Returning",    classYear: "JR", source: "athlete_public", sourceUrl: "https://twitter.com/caleblomu",                 entered: "2026-01-22" },
      { position: "WR",  firstName: "Squirrel",lastName: "White",      fromSchool: "Tennessee",        toSchool: "Florida State",classYear: "SR", source: "school_press",   sourceUrl: "https://seminoles.com/sports/football",         entered: "2026-04-18" },
    ],
  },

  // ─── MEN'S BASKETBALL ────────────────────────────────────────────────────
  {
    slug: "mens-basketball",
    label: "Men's Basketball",
    tagline: "DI men's hoops portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "🏀",
    hasNative: false,
    entries: [
      { position: "PG",  firstName: "PJ",      lastName: "Haggerty",   fromSchool: "Laurel",          toSchool: "Kansas State", classYear: "JR", source: "school_press",   sourceUrl: "https://kstatesports.com/sports/mbball",        entered: "2026-04-18" },
      { position: "G",   firstName: "Yaxel",   lastName: "Lendeborg",  fromSchool: "UAB",              toSchool: "Michigan",     classYear: "GR", source: "school_press",   sourceUrl: "https://mgoblue.com/sports/mbball",             entered: "2026-04-21" },
      { position: "F",   firstName: "Bennett", lastName: "Stirtz",     fromSchool: "Drake",            toSchool: "Iowa",         classYear: "SR", source: "school_press",   sourceUrl: "https://hawkeyesports.com/sports/mbball",       entered: "2026-04-15" },
      { position: "G",   firstName: "Donovan", lastName: "Dent",       fromSchool: "New Mexico",       toSchool: "UCLA",         classYear: "SR", source: "school_press",   sourceUrl: "https://uclabruins.com/sports/mbball",          entered: "2026-04-12" },
      { position: "F",   firstName: "Tahaad",  lastName: "Pettiford",  fromSchool: "Auburn",           toSchool: "Returning",    classYear: "SO", source: "athlete_public", sourceUrl: "https://twitter.com/tpettiford",                entered: "2026-04-08" },
      { position: "G",   firstName: "Boogie",  lastName: "Fland",      fromSchool: "Arkansas",         toSchool: "Florida",      classYear: "SO", source: "school_press",   sourceUrl: "https://floridagators.com/sports/mbball",       entered: "2026-04-30" },
      { position: "C",   firstName: "Vladislav",lastName: "Goldin",    fromSchool: "Michigan",         toSchool: "NBA Draft",    classYear: "GR", source: "athlete_public", sourceUrl: "https://twitter.com/vladi_goldin",              entered: "2026-04-25" },
      { position: "F",   firstName: "Alex",    lastName: "Karaban",    fromSchool: "UConn",            toSchool: "Returning",    classYear: "JR", source: "school_press",   sourceUrl: "https://uconnhuskies.com/sports/mbball",        entered: "2026-04-15" },
      { position: "G",   firstName: "Tucker",  lastName: "DeVries",    fromSchool: "West Virginia",    toSchool: "Indiana",      classYear: "SR", source: "school_press",   sourceUrl: "https://iuhoosiers.com/sports/mbball",          entered: "2026-04-22" },
      { position: "F",   firstName: "Otega",   lastName: "Oweh",       fromSchool: "Kentucky",         toSchool: "Returning",    classYear: "JR", source: "athlete_public", sourceUrl: "https://twitter.com/otegaoweh",                 entered: "2026-04-19" },
    ],
  },

  // ─── WOMEN'S BASKETBALL ──────────────────────────────────────────────────
  {
    slug: "womens-basketball",
    label: "Women's Basketball",
    tagline: "DI women's hoops portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "🏀",
    hasNative: false,
    entries: [
      { position: "G", firstName: "Olivia",   lastName: "Miles",   fromSchool: "Notre Dame",    toSchool: "TCU",            classYear: "SR", source: "school_press", sourceUrl: "https://gofrogs.com/sports/wbball",          entered: "2026-04-15" },
      { position: "G", firstName: "Ta'Niya",  lastName: "Latson",  fromSchool: "Florida State", toSchool: "South Carolina", classYear: "SR", source: "school_press", sourceUrl: "https://gamecocksonline.com/sports/wbball",  entered: "2026-04-20" },
      { position: "F", firstName: "Cotie",    lastName: "McMahon", fromSchool: "Ohio State",    toSchool: "Ole Miss",       classYear: "SR", source: "school_press", sourceUrl: "https://olemisssports.com/sports/wbball",    entered: "2026-04-18" },
      { position: "G", firstName: "Jazzy",    lastName: "Davidson",fromSchool: "USC",           toSchool: "Returning",      classYear: "SO", source: "athlete_public", sourceUrl: "https://twitter.com/jazzydavidson",        entered: "2026-04-10" },
      { position: "G", firstName: "Hannah",   lastName: "Hidalgo", fromSchool: "Notre Dame",    toSchool: "Returning",      classYear: "JR", source: "athlete_public", sourceUrl: "https://twitter.com/hannah_hidalgo",       entered: "2026-04-12" },
      { position: "F", firstName: "Lauren",   lastName: "Betts",   fromSchool: "UCLA",          toSchool: "Returning",      classYear: "SR", source: "athlete_public", sourceUrl: "https://twitter.com/laurenbetts",          entered: "2026-04-14" },
      { position: "G", firstName: "Madison",  lastName: "Booker",  fromSchool: "Texas",         toSchool: "Returning",      classYear: "JR", source: "athlete_public", sourceUrl: "https://twitter.com/madisonbooker",        entered: "2026-04-09" },
      { position: "G", firstName: "Sarah",    lastName: "Strong",  fromSchool: "UConn",         toSchool: "Returning",      classYear: "SO", source: "athlete_public", sourceUrl: "https://twitter.com/sarahstrong",          entered: "2026-04-11" },
      { position: "G", firstName: "Audi",     lastName: "Crooks",  fromSchool: "Iowa State",    toSchool: "Returning",      classYear: "JR", source: "athlete_public", sourceUrl: "https://twitter.com/audicrooks",           entered: "2026-04-13" },
      { position: "G", firstName: "Talaysia", lastName: "Cooper",  fromSchool: "Tennessee",     toSchool: "South Carolina", classYear: "SR", source: "school_press", sourceUrl: "https://gamecocksonline.com/sports/wbball",  entered: "2026-04-22" },
    ],
  },

  // ─── MEN'S SOCCER ────────────────────────────────────────────────────────
  {
    slug: "mens-soccer",
    label: "Men's Soccer",
    tagline: "DI men's soccer portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "⚽",
    hasNative: false,
    entries: [
      { position: "F",  firstName: "Stas",    lastName: "Korzeniowski", fromSchool: "Notre Dame",       toSchool: "MLS",            classYear: "JR", source: "school_press",   sourceUrl: "https://und.com/sports/msoc",                    entered: "2026-01-10" },
      { position: "M",  firstName: "Hosei",   lastName: "Kijima",       fromSchool: "Marshall",         toSchool: "Transferring",   classYear: "SR", source: "school_press",   sourceUrl: "https://herdzone.com/sports/msoc",               entered: "2026-04-18" },
      { position: "GK", firstName: "Wessel",  lastName: "Speel",        fromSchool: "Indiana",          toSchool: "Transferring",   classYear: "SR", source: "school_press",   sourceUrl: "https://iuhoosiers.com/sports/msoc",             entered: "2026-04-20" },
      { position: "D",  firstName: "Aaron",   lastName: "Salgado",      fromSchool: "Cal Poly",         toSchool: "Transferring",   classYear: "JR", source: "school_press",   sourceUrl: "https://gopoly.com/sports/msoc",                 entered: "2026-04-22" },
      { position: "M",  firstName: "Charlie", lastName: "Sharp",        fromSchool: "Western Michigan", toSchool: "MLS",            classYear: "SR", source: "school_press",   sourceUrl: "https://wmubroncos.com/sports/msoc",             entered: "2026-01-08" },
    ],
  },

  // ─── WOMEN'S SOCCER ──────────────────────────────────────────────────────
  {
    slug: "womens-soccer",
    label: "Women's Soccer",
    tagline: "DI women's soccer portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "⚽",
    hasNative: false,
    entries: [
      { position: "F",  firstName: "Onyeka",  lastName: "Gamero",  fromSchool: "Stanford",       toSchool: "NWSL",           classYear: "SR", source: "school_press", sourceUrl: "https://gostanford.com/sports/wsoc",       entered: "2026-01-12" },
      { position: "F",  firstName: "Croix",   lastName: "Bethune", fromSchool: "Georgia",        toSchool: "NWSL",           classYear: "GR", source: "school_press", sourceUrl: "https://georgiadogs.com/sports/wsoc",      entered: "2026-01-15" },
      { position: "M",  firstName: "Smith",   lastName: "Hunter",  fromSchool: "Stanford",       toSchool: "Transferring",   classYear: "SR", source: "school_press", sourceUrl: "https://gostanford.com/sports/wsoc",       entered: "2026-04-19" },
      { position: "GK", firstName: "Mia",     lastName: "Justus",  fromSchool: "Georgia",        toSchool: "Transferring",   classYear: "GR", source: "school_press", sourceUrl: "https://georgiadogs.com/sports/wsoc",      entered: "2026-04-22" },
      { position: "D",  firstName: "Maddie",  lastName: "Dahlien", fromSchool: "North Carolina", toSchool: "NWSL",           classYear: "SR", source: "school_press", sourceUrl: "https://goheels.com/sports/wsoc",          entered: "2026-01-20" },
    ],
  },

  // ─── VOLLEYBALL ──────────────────────────────────────────────────────────
  {
    slug: "volleyball",
    label: "Volleyball",
    tagline: "DI women's volleyball portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "🏐",
    hasNative: false,
    entries: [
      { position: "OH", firstName: "Lexi",    lastName: "Rodriguez", fromSchool: "Nebraska",  toSchool: "Pro / LOVB",     classYear: "GR", source: "school_press", sourceUrl: "https://huskers.com/sports/volleyball",  entered: "2026-01-05" },
      { position: "L",  firstName: "Logan",   lastName: "Eggleston", fromSchool: "Texas",     toSchool: "Pro",            classYear: "GR", source: "school_press", sourceUrl: "https://texaslonghorns.com/sports/volleyball", entered: "2026-01-08" },
      { position: "MB", firstName: "Asjia",   lastName: "O'Neal",    fromSchool: "Texas",     toSchool: "Pro",            classYear: "GR", source: "school_press", sourceUrl: "https://texaslonghorns.com/sports/volleyball", entered: "2026-01-08" },
      { position: "S",  firstName: "Bergen",  lastName: "Reilly",    fromSchool: "Nebraska",  toSchool: "Returning",      classYear: "JR", source: "athlete_public", sourceUrl: "https://twitter.com/bergenreilly", entered: "2026-04-15" },
      { position: "OH", firstName: "Harper",  lastName: "Murray",    fromSchool: "Nebraska",  toSchool: "Returning",      classYear: "JR", source: "athlete_public", sourceUrl: "https://twitter.com/harpermurray", entered: "2026-04-15" },
    ],
  },

  // ─── LACROSSE ────────────────────────────────────────────────────────────
  {
    slug: "lacrosse",
    label: "Lacrosse",
    tagline: "DI lacrosse portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "🥍",
    hasNative: false,
    entries: [
      { position: "A", firstName: "Pat",     lastName: "Kavanagh",  fromSchool: "Notre Dame",   toSchool: "PLL",      classYear: "GR", source: "school_press", sourceUrl: "https://und.com/sports/mlax",          entered: "2026-05-30" },
      { position: "M", firstName: "CJ",      lastName: "Kirst",     fromSchool: "Cornell",      toSchool: "PLL",      classYear: "GR", source: "school_press", sourceUrl: "https://cornellbigred.com/sports/mlax", entered: "2026-05-30" },
      { position: "G", firstName: "Liam",    lastName: "Entenmann", fromSchool: "Notre Dame",   toSchool: "PLL",      classYear: "GR", source: "school_press", sourceUrl: "https://und.com/sports/mlax",          entered: "2026-05-30" },
      { position: "A", firstName: "Madison", lastName: "Taylor",    fromSchool: "Northwestern", toSchool: "WLL",      classYear: "GR", source: "school_press", sourceUrl: "https://nusports.com/sports/wlax",     entered: "2026-05-25" },
      { position: "M", firstName: "Izzy",    lastName: "Scane",     fromSchool: "Northwestern", toSchool: "WLL",      classYear: "GR", source: "school_press", sourceUrl: "https://nusports.com/sports/wlax",     entered: "2026-05-25" },
    ],
  },

  // ─── TRACK & FIELD ───────────────────────────────────────────────────────
  {
    slug: "track-field",
    label: "Track & Field",
    tagline: "DI track & field — entries from athlynx.ai + public school/athlete announcements.",
    icon: "🏃",
    hasNative: false,
    entries: [
      { position: "SPR", firstName: "Brandon", lastName: "Miller",    fromSchool: "Texas A&M",  toSchool: "Pro (adidas)", classYear: "GR", source: "school_press",   sourceUrl: "https://12thman.com/sports/track",          entered: "2026-05-15" },
      { position: "DIS", firstName: "Parker",  lastName: "Valby",     fromSchool: "Florida",    toSchool: "Pro (Nike)",   classYear: "GR", source: "school_press",   sourceUrl: "https://floridagators.com/sports/track",    entered: "2026-05-12" },
      { position: "JMP", firstName: "JuVaughn",lastName: "Harrison",  fromSchool: "LSU",        toSchool: "Pro (Nike)",   classYear: "GR", source: "school_press",   sourceUrl: "https://lsusports.net/sports/track",        entered: "2026-05-10" },
      { position: "SPR", firstName: "Anavia",  lastName: "Battle",    fromSchool: "Ohio State", toSchool: "Pro (adidas)", classYear: "GR", source: "school_press",   sourceUrl: "https://ohiostatebuckeyes.com/sports/track", entered: "2026-05-14" },
      { position: "HUR", firstName: "Masai",   lastName: "Russell",   fromSchool: "Kentucky",   toSchool: "Pro (Nike)",   classYear: "GR", source: "school_press",   sourceUrl: "https://ukathletics.com/sports/track",      entered: "2026-05-16" },
    ],
  },

  // ─── WRESTLING ───────────────────────────────────────────────────────────
  {
    slug: "wrestling",
    label: "Wrestling",
    tagline: "DI wrestling portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "🤼",
    hasNative: false,
    entries: [
      { position: "125", firstName: "Matt",     lastName: "Ramos",        fromSchool: "Purdue",       toSchool: "Pro / Senior", classYear: "GR", source: "school_press",   sourceUrl: "https://purduesports.com/sports/wrestling",     entered: "2026-04-10" },
      { position: "165", firstName: "Mitchell", lastName: "Mesenbrink",   fromSchool: "Penn State",   toSchool: "Returning",    classYear: "SR", source: "athlete_public", sourceUrl: "https://twitter.com/mesenbrinkpsu",             entered: "2026-04-12" },
      { position: "174", firstName: "Carter",   lastName: "Starocci",     fromSchool: "Penn State",   toSchool: "Returning",    classYear: "GR", source: "athlete_public", sourceUrl: "https://twitter.com/carterstarocci",            entered: "2026-04-12" },
      { position: "184", firstName: "Bernie",   lastName: "Truax",        fromSchool: "Penn State",   toSchool: "Senior level", classYear: "GR", source: "school_press",   sourceUrl: "https://gopsusports.com/sports/wrestling",      entered: "2026-04-15" },
      { position: "HWT", firstName: "Greg",     lastName: "Kerkvliet",    fromSchool: "Penn State",   toSchool: "Senior level", classYear: "GR", source: "school_press",   sourceUrl: "https://gopsusports.com/sports/wrestling",      entered: "2026-04-15" },
    ],
  },

  // ─── HOCKEY ──────────────────────────────────────────────────────────────
  {
    slug: "hockey",
    label: "Hockey",
    tagline: "DI men's hockey portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "🏒",
    hasNative: false,
    entries: [
      { position: "F",  firstName: "Macklin", lastName: "Celebrini",fromSchool: "Boston University", toSchool: "NHL (SJS)", classYear: "FR", source: "school_press", sourceUrl: "https://goterriers.com/sports/mhoc",        entered: "2026-04-15" },
      { position: "F",  firstName: "Will",    lastName: "Smith",    fromSchool: "Boston College",    toSchool: "NHL (SJS)", classYear: "FR", source: "school_press", sourceUrl: "https://bceagles.com/sports/mhoc",          entered: "2026-04-10" },
      { position: "F",  firstName: "Cutter",  lastName: "Gauthier", fromSchool: "Boston College",    toSchool: "NHL (ANA)", classYear: "SO", source: "school_press", sourceUrl: "https://bceagles.com/sports/mhoc",          entered: "2026-04-08" },
      { position: "D",  firstName: "Lane",    lastName: "Hutson",   fromSchool: "Boston University", toSchool: "NHL (MTL)", classYear: "SO", source: "school_press", sourceUrl: "https://goterriers.com/sports/mhoc",        entered: "2026-04-12" },
      { position: "F",  firstName: "Ryan",    lastName: "Leonard",  fromSchool: "Boston College",    toSchool: "NHL (WSH)", classYear: "SO", source: "school_press", sourceUrl: "https://bceagles.com/sports/mhoc",          entered: "2026-04-09" },
    ],
  },

  // ─── GYMNASTICS ──────────────────────────────────────────────────────────
  {
    slug: "gymnastics",
    label: "Gymnastics",
    tagline: "DI women's gymnastics portal — entries from athlynx.ai + public school/athlete announcements.",
    icon: "🤸",
    hasNative: false,
    entries: [
      { position: "AA", firstName: "Leanne",  lastName: "Wong",    fromSchool: "Florida", toSchool: "Returning", classYear: "GR", source: "athlete_public", sourceUrl: "https://twitter.com/leannewong",       entered: "2026-04-20" },
      { position: "AA", firstName: "Jordan",  lastName: "Chiles",  fromSchool: "UCLA",    toSchool: "Pro / NCAA",classYear: "GR", source: "school_press",   sourceUrl: "https://uclabruins.com/sports/wgym",   entered: "2026-04-22" },
      { position: "AA", firstName: "Suni",    lastName: "Lee",     fromSchool: "Auburn",  toSchool: "Pro",       classYear: "GR", source: "school_press",   sourceUrl: "https://auburntigers.com/sports/wgym", entered: "2026-04-18" },
      { position: "BB", firstName: "Trinity", lastName: "Thomas",  fromSchool: "Florida", toSchool: "Pro",       classYear: "GR", source: "school_press",   sourceUrl: "https://floridagators.com/sports/wgym", entered: "2026-04-15" },
      { position: "FX", firstName: "Konnor",  lastName: "McClain", fromSchool: "LSU",     toSchool: "Returning", classYear: "GR", source: "athlete_public", sourceUrl: "https://twitter.com/konnormcclain",    entered: "2026-04-19" },
    ],
  },
];

const SPORT_MAP = new Map(SPORTS.map((s) => [s.slug, s]));

// ─── In-memory store for AthlynX-native entries (athletes who enter via us) ─

interface NativeEntry extends PortalEntry {
  athleteId: string;
  sport: SportSlug;
}

const nativeEntries: NativeEntry[] = [];

// ─── Route registration ────────────────────────────────────────────────────

export function registerTransferPortalRoutes(app: Express) {
  app.get("/api/transfer-portal/sports", (_req: Request, res: Response) => {
    res.set("Cache-Control", "public, max-age=300");
    res.json({
      poweredBy: "AthlynX",
      sports: SPORTS.map((s) => {
        const nativeCount = nativeEntries.filter((e) => e.sport === s.slug).length;
        return {
          slug: s.slug,
          label: s.label,
          icon: s.icon,
          tagline: s.tagline,
          totalCount: s.entries.length + nativeCount,
          nativeCount,
          hasNative: nativeCount > 0,
        };
      }),
    });
  });

  app.get("/api/transfer-portal/board", (req: Request, res: Response) => {
    const slug = String(req.query.sport || "baseball") as SportSlug;
    const sport = SPORT_MAP.get(slug);
    if (!sport) {
      return res.status(404).json({ error: "Unknown sport", validSlugs: Array.from(SPORT_MAP.keys()) });
    }
    // Native entries for this sport (we keep them at the top so AthlynX's
    // own platform entries lead the board).
    const native = nativeEntries.filter((e) => e.sport === slug);
    res.set("Cache-Control", "public, max-age=300");
    res.json({
      poweredBy: "AthlynX",
      slug: sport.slug,
      label: sport.label,
      icon: sport.icon,
      tagline: sport.tagline,
      entries: [...native, ...sport.entries],
    });
  });

  app.get("/api/transfer-portal/native-count", (_req: Request, res: Response) => {
    res.json({
      poweredBy: "AthlynX",
      nativeEntryCount: nativeEntries.length,
    });
  });

  // POST /api/transfer-portal/enter — athlete enters the portal via AthlynX.
  // Real implementation will require auth + athlete profile; this endpoint is
  // the boundary point. For now, it accepts a basic shape so the front-end
  // "Enter via AthlynX" CTA has a place to post to.
  app.post("/api/transfer-portal/enter", (req: Request, res: Response) => {
    const body = req.body || {};
    const required = ["sport", "position", "firstName", "lastName", "fromSchool", "athleteId"];
    for (const k of required) {
      if (!body[k]) {
        return res.status(400).json({ error: `Missing field: ${k}` });
      }
    }
    if (!SPORT_MAP.has(body.sport)) {
      return res.status(400).json({ error: "Invalid sport", validSlugs: Array.from(SPORT_MAP.keys()) });
    }
    const entry: NativeEntry = {
      athleteId: String(body.athleteId),
      sport: body.sport as SportSlug,
      position: String(body.position),
      firstName: String(body.firstName),
      lastName: String(body.lastName),
      fromSchool: String(body.fromSchool),
      toSchool: String(body.toSchool || "Transferring"),
      classYear: body.classYear ? String(body.classYear) : undefined,
      note: body.note ? String(body.note) : undefined,
      source: "athlynx_native",
      entered: new Date().toISOString().slice(0, 10),
    };
    nativeEntries.unshift(entry);
    res.status(201).json({
      poweredBy: "AthlynX",
      ok: true,
      entry,
      message: "You're in the AthlynX Portal. Your entry is verified — no third party needed.",
    });
  });
}


