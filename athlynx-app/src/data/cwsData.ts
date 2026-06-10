import type { CWSTeam, CWSGame, CWSBracket } from '@/types';

export const CWS_2026_TEAMS: CWSTeam[] = [
  { id: 'tennessee', name: 'Tennessee Volunteers', shortName: 'Tennessee', seed: 1, record: '55-10', conference: 'SEC', eliminated: false },
  { id: 'lsu', name: 'LSU Tigers', shortName: 'LSU', seed: 2, record: '48-16', conference: 'SEC', eliminated: false },
  { id: 'texas', name: 'Texas Longhorns', shortName: 'Texas', seed: 3, record: '47-17', conference: 'Big 12', eliminated: false },
  { id: 'florida', name: 'Florida Gators', shortName: 'Florida', seed: 4, record: '46-18', conference: 'SEC', eliminated: false },
  { id: 'arkansas', name: 'Arkansas Razorbacks', shortName: 'Arkansas', seed: 5, record: '45-19', conference: 'SEC', eliminated: false },
  { id: 'vanderbilt', name: 'Vanderbilt Commodores', shortName: 'Vanderbilt', seed: 6, record: '44-18', conference: 'SEC', eliminated: false },
  { id: 'north-carolina', name: 'North Carolina Tar Heels', shortName: 'UNC', seed: 7, record: '43-19', conference: 'ACC', eliminated: false },
  { id: 'oregon-state', name: 'Oregon State Beavers', shortName: 'Oregon St.', seed: 8, record: '42-20', conference: 'Pac-12', eliminated: false },
];

export const CWS_2026_GAMES: CWSGame[] = [
  // Bracket 1 — Game 1
  {
    id: 'g1',
    homeTeamId: 'tennessee',
    awayTeamId: 'north-carolina',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    scheduledAt: '2026-06-13T19:00:00Z',
    venue: 'Charles Schwab Field, Omaha NE',
  },
  // Bracket 1 — Game 2
  {
    id: 'g2',
    homeTeamId: 'florida',
    awayTeamId: 'vanderbilt',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    scheduledAt: '2026-06-13T22:00:00Z',
    venue: 'Charles Schwab Field, Omaha NE',
  },
  // Bracket 2 — Game 3
  {
    id: 'g3',
    homeTeamId: 'lsu',
    awayTeamId: 'oregon-state',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    scheduledAt: '2026-06-14T19:00:00Z',
    venue: 'Charles Schwab Field, Omaha NE',
  },
  // Bracket 2 — Game 4
  {
    id: 'g4',
    homeTeamId: 'texas',
    awayTeamId: 'arkansas',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    scheduledAt: '2026-06-14T22:00:00Z',
    venue: 'Charles Schwab Field, Omaha NE',
  },
];

export const CWS_2026_BRACKET: CWSBracket = {
  teams: CWS_2026_TEAMS,
  games: CWS_2026_GAMES,
  lastUpdated: '2026-06-09T00:00:00Z',
};
