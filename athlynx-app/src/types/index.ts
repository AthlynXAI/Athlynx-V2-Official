// ─── CWS / Brackets ───────────────────────────────────────────────────────────

export interface CWSTeam {
  id: string;
  name: string;
  shortName: string;
  seed: number;
  record: string;
  conference: string;
  eliminated: boolean;
  logoUrl?: string;
}

export interface CWSGame {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'scheduled' | 'live' | 'final';
  scheduledAt: string; // ISO 8601
  venue: string;
  inning?: number;
  inningHalf?: 'top' | 'bottom';
}

export interface CWSBracket {
  teams: CWSTeam[];
  games: CWSGame[];
  lastUpdated: string;
}

// ─── Diamond Grind / D1 Baseball ─────────────────────────────────────────────

export interface ConferenceStanding {
  rank: number;
  team: string;
  conference: string;
  overallWins: number;
  overallLosses: number;
  conferenceWins: number;
  conferenceLosses: number;
  rpi: number;
}

export interface D1Conference {
  name: string;
  abbr: string;
  standings: ConferenceStanding[];
}

export interface MLBDraftProspect {
  rank: number;
  name: string;
  position: string;
  school: string;
  year: string;
  bats: string;
  throws: string;
  height: string;
  weight: number;
  notes: string;
}

// ─── NIL ──────────────────────────────────────────────────────────────────────

export interface NILDeal {
  id: string;
  brand: string;
  category: string;
  value: number;
  sport: string;
  athleteType: string;
  platform: string;
  date: string;
}

export interface NILValuationSnapshot {
  sport: string;
  avgValue: number;
  topValue: number;
  dealCount: number;
  trend: 'up' | 'down' | 'flat';
  trendPct: number;
}

// ─── AI Engines ───────────────────────────────────────────────────────────────

export interface AIEngine {
  id: string;
  name: string;
  description: string;
  category: 'nil' | 'recruiting' | 'analytics' | 'media' | 'coaching';
  status: 'live' | 'beta' | 'coming_soon';
  iconName: string;
}

// ─── Athlete Profile ──────────────────────────────────────────────────────────

export interface AthleteProfile {
  id: string;
  name: string;
  sport: string;
  position: string;
  school: string;
  year: string;
  gpa: number;
  stats: Record<string, string | number>;
  nilValue: number;
  socialFollowers: number;
  avatarUrl?: string;
}
