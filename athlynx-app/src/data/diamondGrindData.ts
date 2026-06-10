import type { D1Conference, MLBDraftProspect } from '@/types';

export const D1_BASEBALL_CONFERENCES_2026: D1Conference[] = [
  {
    name: 'Southeastern Conference',
    abbr: 'SEC',
    standings: [
      { rank: 1, team: 'Tennessee', conference: 'SEC', overallWins: 55, overallLosses: 10, conferenceWins: 22, conferenceLosses: 8, rpi: 0.6812 },
      { rank: 2, team: 'LSU', conference: 'SEC', overallWins: 48, overallLosses: 16, conferenceWins: 19, conferenceLosses: 11, rpi: 0.6540 },
      { rank: 3, team: 'Florida', conference: 'SEC', overallWins: 46, overallLosses: 18, conferenceWins: 18, conferenceLosses: 12, rpi: 0.6320 },
      { rank: 4, team: 'Arkansas', conference: 'SEC', overallWins: 45, overallLosses: 19, conferenceWins: 17, conferenceLosses: 13, rpi: 0.6210 },
      { rank: 5, team: 'Vanderbilt', conference: 'SEC', overallWins: 44, overallLosses: 18, conferenceWins: 17, conferenceLosses: 13, rpi: 0.6190 },
      { rank: 6, team: 'Ole Miss', conference: 'SEC', overallWins: 42, overallLosses: 20, conferenceWins: 16, conferenceLosses: 14, rpi: 0.6050 },
      { rank: 7, team: 'Georgia', conference: 'SEC', overallWins: 40, overallLosses: 22, conferenceWins: 15, conferenceLosses: 15, rpi: 0.5890 },
      { rank: 8, team: 'Alabama', conference: 'SEC', overallWins: 38, overallLosses: 24, conferenceWins: 14, conferenceLosses: 16, rpi: 0.5720 },
    ],
  },
  {
    name: 'Atlantic Coast Conference',
    abbr: 'ACC',
    standings: [
      { rank: 1, team: 'North Carolina', conference: 'ACC', overallWins: 43, overallLosses: 19, conferenceWins: 20, conferenceLosses: 10, rpi: 0.6280 },
      { rank: 2, team: 'Clemson', conference: 'ACC', overallWins: 41, overallLosses: 21, conferenceWins: 18, conferenceLosses: 12, rpi: 0.6100 },
      { rank: 3, team: 'Virginia', conference: 'ACC', overallWins: 39, overallLosses: 23, conferenceWins: 17, conferenceLosses: 13, rpi: 0.5950 },
      { rank: 4, team: 'NC State', conference: 'ACC', overallWins: 37, overallLosses: 25, conferenceWins: 15, conferenceLosses: 15, rpi: 0.5780 },
      { rank: 5, team: 'Miami', conference: 'ACC', overallWins: 35, overallLosses: 27, conferenceWins: 14, conferenceLosses: 16, rpi: 0.5620 },
    ],
  },
  {
    name: 'Big 12 Conference',
    abbr: 'Big 12',
    standings: [
      { rank: 1, team: 'Texas', conference: 'Big 12', overallWins: 47, overallLosses: 17, conferenceWins: 21, conferenceLosses: 9, rpi: 0.6450 },
      { rank: 2, team: 'TCU', conference: 'Big 12', overallWins: 44, overallLosses: 18, conferenceWins: 19, conferenceLosses: 11, rpi: 0.6290 },
      { rank: 3, team: 'Oklahoma State', conference: 'Big 12', overallWins: 41, overallLosses: 21, conferenceWins: 17, conferenceLosses: 13, rpi: 0.6080 },
      { rank: 4, team: 'West Virginia', conference: 'Big 12', overallWins: 38, overallLosses: 24, conferenceWins: 15, conferenceLosses: 15, rpi: 0.5870 },
      { rank: 5, team: 'Kansas State', conference: 'Big 12', overallWins: 36, overallLosses: 26, conferenceWins: 13, conferenceLosses: 17, rpi: 0.5650 },
      { rank: 6, team: 'Baylor', conference: 'Big 12', overallWins: 34, overallLosses: 28, conferenceWins: 12, conferenceLosses: 18, rpi: 0.5430 },
      { rank: 7, team: 'Texas Tech', conference: 'Big 12', overallWins: 32, overallLosses: 30, conferenceWins: 11, conferenceLosses: 19, rpi: 0.5210 },
      { rank: 8, team: 'Kansas', conference: 'Big 12', overallWins: 29, overallLosses: 33, conferenceWins: 9, conferenceLosses: 21, rpi: 0.4980 },
      { rank: 9, team: 'Iowa State', conference: 'Big 12', overallWins: 26, overallLosses: 36, conferenceWins: 7, conferenceLosses: 23, rpi: 0.4720 },
    ],
  },
];

export const MLB_DRAFT_2026_PROSPECTS: MLBDraftProspect[] = [
  { rank: 1, name: 'Bryce Rainer', position: 'RHP', school: 'Tennessee', year: 'Jr.', bats: 'R', throws: 'R', height: '6\'4"', weight: 220, notes: '99 mph fastball, elite spin rate' },
  { rank: 2, name: 'Cole Hutchinson', position: 'SS', school: 'LSU', year: 'Jr.', bats: 'R', throws: 'R', height: '6\'1"', weight: 195, notes: 'Plus arm, 70-grade speed' },
  { rank: 3, name: 'Marcus Webb', position: '1B', school: 'Texas', year: 'Jr.', bats: 'L', throws: 'L', height: '6\'3"', weight: 230, notes: '.412 BA, 24 HR in 2026' },
  { rank: 4, name: 'Jaylen Cross', position: 'CF', school: 'Florida', year: 'So.', bats: 'S', throws: 'R', height: '6\'0"', weight: 185, notes: 'Elite defender, 30+ SB pace' },
  { rank: 5, name: 'Tyler Malone', position: 'LHP', school: 'Vanderbilt', year: 'Jr.', bats: 'L', throws: 'L', height: '6\'2"', weight: 200, notes: '94 mph, plus changeup' },
  { rank: 6, name: 'Darius King', position: 'C', school: 'Arkansas', year: 'Jr.', bats: 'R', throws: 'R', height: '6\'1"', weight: 210, notes: '2.0s pop time, .385 BA' },
  { rank: 7, name: 'Preston Holt', position: 'RHP', school: 'North Carolina', year: 'Jr.', bats: 'R', throws: 'R', height: '6\'5"', weight: 225, notes: '97 mph, 14.2 K/9' },
  { rank: 8, name: 'Ethan Vasquez', position: '3B', school: 'TCU', year: 'Jr.', bats: 'R', throws: 'R', height: '6\'2"', weight: 205, notes: '18 HR, .360 BA, Gold Glove candidate' },
  { rank: 9, name: 'Noah Castillo', position: 'RHP', school: 'Oregon State', year: 'Jr.', bats: 'R', throws: 'R', height: '6\'3"', weight: 215, notes: 'Plus slider, 11.8 K/9' },
  { rank: 10, name: 'Aiden Brooks', position: '2B', school: 'Clemson', year: 'Jr.', bats: 'L', throws: 'R', height: '5\'11"', weight: 180, notes: '.398 OBP, elite contact' },
];
