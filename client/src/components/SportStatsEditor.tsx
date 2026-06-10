/**
 * SportStatsEditor — AthlynXAI
 * Sport-specific stats input for all 20+ sports
 * Feeds the X-Factor AI score (Nebius + Gemini)
 * Every sport. Every stat. All on AthlynXAI.
 */

interface StatField {
  label: string;
  key: string;
  placeholder: string;
  unit?: string;
}

const SPORT_STATS: Record<string, StatField[]> = {
  // ── Football ──────────────────────────────────────────────────────────────
  Football: [
    { label: "40-Yd Dash", key: "fortyYardDash", placeholder: "4.62", unit: "sec" },
    { label: "Vertical Leap", key: "verticalLeap", placeholder: "36", unit: "inches" },
    { label: "Bench Press", key: "benchPress", placeholder: "225", unit: "lbs" },
    { label: "QB Rating", key: "qbRating", placeholder: "105.6" },
    { label: "Completion %", key: "completionPct", placeholder: "68.5", unit: "%" },
    { label: "Passing Yards", key: "passingYards", placeholder: "2,800" },
    { label: "Touchdowns", key: "touchdowns", placeholder: "24" },
    { label: "Tackles", key: "tackles", placeholder: "87" },
    { label: "Sacks", key: "sacks", placeholder: "12" },
    { label: "Rushing Yards", key: "rushingYards", placeholder: "1,200" },
    { label: "Receiving Yards", key: "receivingYards", placeholder: "850" },
  ],
  // ── Basketball ────────────────────────────────────────────────────────────
  Basketball: [
    { label: "Points Per Game", key: "pointsPerGame", placeholder: "22.4", unit: "PPG" },
    { label: "Assists Per Game", key: "assistsPerGame", placeholder: "6.8", unit: "APG" },
    { label: "Rebounds Per Game", key: "reboundsPerGame", placeholder: "8.2", unit: "RPG" },
    { label: "3-Point %", key: "threePointPct", placeholder: "38.5", unit: "%" },
    { label: "FG %", key: "fieldGoalPct", placeholder: "48.2", unit: "%" },
    { label: "FT %", key: "freeThrowPct", placeholder: "82.1", unit: "%" },
    { label: "Steals Per Game", key: "stealsPerGame", placeholder: "1.8", unit: "SPG" },
    { label: "Blocks Per Game", key: "blocksPerGame", placeholder: "1.2", unit: "BPG" },
    { label: "Vertical Leap", key: "verticalLeap", placeholder: "38", unit: "inches" },
    { label: "40-Yd Dash", key: "fortyYardDash", placeholder: "4.55", unit: "sec" },
  ],
  // ── Baseball ──────────────────────────────────────────────────────────────
  Baseball: [
    { label: "Batting Average", key: "battingAvg", placeholder: ".342" },
    { label: "Home Runs", key: "homeRuns", placeholder: "18" },
    { label: "RBI", key: "rbi", placeholder: "67" },
    { label: "OBP", key: "obp", placeholder: ".412" },
    { label: "Slugging %", key: "sluggingPct", placeholder: ".589" },
    { label: "ERA", key: "era", placeholder: "2.84" },
    { label: "Pitching Velocity", key: "pitchingVelocity", placeholder: "94", unit: "MPH" },
    { label: "Strikeouts", key: "strikeouts", placeholder: "124" },
    { label: "WHIP", key: "whip", placeholder: "1.12" },
    { label: "Stolen Bases", key: "stolenBases", placeholder: "22" },
    { label: "60-Yd Dash", key: "sixtyYardDash", placeholder: "6.8", unit: "sec" },
    { label: "Exit Velocity", key: "exitVelocity", placeholder: "98", unit: "MPH" },
  ],
  // ── Soccer ────────────────────────────────────────────────────────────────
  Soccer: [
    { label: "Goals Per Game", key: "goalsPerGame", placeholder: "0.8" },
    { label: "Assists Per Game", key: "assistsSoccer", placeholder: "0.5" },
    { label: "Save Percentage", key: "savePercentage", placeholder: "74.2", unit: "%" },
    { label: "Pass Accuracy", key: "passAccuracy", placeholder: "87.5", unit: "%" },
    { label: "Shots On Target", key: "shotsOnTarget", placeholder: "42" },
    { label: "Tackles Won", key: "tacklesWon", placeholder: "68" },
    { label: "Distance Per Game", key: "distancePerGame", placeholder: "9.8", unit: "km" },
    { label: "Dribble Success", key: "dribbleSuccess", placeholder: "62", unit: "%" },
  ],
  // ── Track & Field ─────────────────────────────────────────────────────────
  "Track & Field": [
    { label: "100m", key: "hundredMeter", placeholder: "10.87", unit: "sec" },
    { label: "200m", key: "twoHundredMeter", placeholder: "21.34", unit: "sec" },
    { label: "400m", key: "fourHundredMeter", placeholder: "46.82", unit: "sec" },
    { label: "800m", key: "eightHundredMeter", placeholder: "1:48.23", unit: "min" },
    { label: "1500m", key: "fifteenHundredMeter", placeholder: "3:52.14", unit: "min" },
    { label: "Mile", key: "mileTime", placeholder: "4:12.34", unit: "min" },
    { label: "5K", key: "fiveKTime", placeholder: "14:28", unit: "min" },
    { label: "110m Hurdles", key: "hurdles110m", placeholder: "13.42", unit: "sec" },
    { label: "High Jump", key: "highJump", placeholder: "6'8\"", unit: "ft" },
    { label: "Long Jump", key: "longJump", placeholder: "23'4\"", unit: "ft" },
    { label: "Triple Jump", key: "tripleJump", placeholder: "48'2\"", unit: "ft" },
    { label: "Shot Put", key: "shotPut", placeholder: "58'6\"", unit: "ft" },
    { label: "Discus", key: "discus", placeholder: "168'4\"", unit: "ft" },
    { label: "Javelin", key: "javelin", placeholder: "198'8\"", unit: "ft" },
    { label: "Pole Vault", key: "poleVault", placeholder: "16'6\"", unit: "ft" },
  ],
  // ── Swimming ──────────────────────────────────────────────────────────────
  Swimming: [
    { label: "50 Free", key: "fiftyFreeStyle", placeholder: "21.34", unit: "sec" },
    { label: "100 Free", key: "hundredFreeStyle", placeholder: "46.82", unit: "sec" },
    { label: "200 Free", key: "twoHundredFreeStyle", placeholder: "1:44.23", unit: "min" },
    { label: "100 Back", key: "hundredBackstroke", placeholder: "51.24", unit: "sec" },
    { label: "100 Breast", key: "hundredBreaststroke", placeholder: "58.34", unit: "sec" },
    { label: "100 Fly", key: "hundredButterfly", placeholder: "50.12", unit: "sec" },
    { label: "200 IM", key: "twoHundredIM", placeholder: "1:54.67", unit: "min" },
    { label: "400 IM", key: "fourHundredIM", placeholder: "4:08.21", unit: "min" },
    { label: "1500 Free", key: "fifteenHundredFree", placeholder: "15:24.56", unit: "min" },
  ],
  // ── Wrestling ─────────────────────────────────────────────────────────────
  Wrestling: [
    { label: "Record (W-L)", key: "wrestlingRecord", placeholder: "42-3" },
    { label: "Takedowns", key: "takedowns", placeholder: "87" },
    { label: "Pins", key: "pins", placeholder: "18" },
    { label: "Tech Falls", key: "techFalls", placeholder: "12" },
    { label: "Major Decisions", key: "majorDecisions", placeholder: "8" },
    { label: "Riding Time", key: "ridingTime", placeholder: "4:32", unit: "min" },
    { label: "Escapes", key: "escapes", placeholder: "24" },
    { label: "Reversals", key: "reversals", placeholder: "15" },
  ],
  // ── Tennis ────────────────────────────────────────────────────────────────
  Tennis: [
    { label: "Serve Speed", key: "serveSpeed", placeholder: "128", unit: "MPH" },
    { label: "1st Serve %", key: "firstServePct", placeholder: "64", unit: "%" },
    { label: "Aces Per Match", key: "acesPerMatch", placeholder: "8.2" },
    { label: "Win %", key: "winPct", placeholder: "72", unit: "%" },
    { label: "ITF Ranking", key: "tennisRanking", placeholder: "142" },
    { label: "UTR Rating", key: "utrRating", placeholder: "12.4" },
    { label: "Double Faults", key: "doubleFaults", placeholder: "2.1" },
  ],
  // ── Volleyball ────────────────────────────────────────────────────────────
  Volleyball: [
    { label: "Attack %", key: "attackPct", placeholder: ".342", unit: "%" },
    { label: "Kills Per Set", key: "killsPerSet", placeholder: "4.2" },
    { label: "Blocks Per Set", key: "blocksPer", placeholder: "1.1" },
    { label: "Digs Per Set", key: "digs", placeholder: "3.8" },
    { label: "Aces Per Set", key: "acesVB", placeholder: "0.4" },
    { label: "Assists Per Set", key: "assistsVB", placeholder: "10.2" },
    { label: "Service Errors", key: "serviceErrors", placeholder: "0.8" },
    { label: "Vertical Leap", key: "verticalLeap", placeholder: "28", unit: "inches" },
  ],
  // ── Hockey ────────────────────────────────────────────────────────────────
  Hockey: [
    { label: "Goals", key: "goalsHockey", placeholder: "28" },
    { label: "Assists", key: "assistsHockey", placeholder: "42" },
    { label: "Points", key: "pointsHockey", placeholder: "70" },
    { label: "+/-", key: "plusMinus", placeholder: "+18" },
    { label: "Shots On Goal", key: "shotsOnGoal", placeholder: "187" },
    { label: "Shot %", key: "shotPct", placeholder: "14.9", unit: "%" },
    { label: "Save %", key: "savePct", placeholder: ".924", unit: "%" },
    { label: "GAA", key: "goalsAgainstAvg", placeholder: "2.14" },
    { label: "PIM", key: "penaltyMinutes", placeholder: "24" },
    { label: "Faceoff %", key: "faceoffPct", placeholder: "52.3", unit: "%" },
  ],
  // ── Golf ──────────────────────────────────────────────────────────────────
  Golf: [
    { label: "Handicap", key: "handicap", placeholder: "+2.4" },
    { label: "Scoring Average", key: "scoringAvg", placeholder: "71.2" },
    { label: "Driving Distance", key: "drivingDistance", placeholder: "298", unit: "yds" },
    { label: "Driving Accuracy", key: "drivingAccuracy", placeholder: "68.4", unit: "%" },
    { label: "GIR %", key: "girPct", placeholder: "72.1", unit: "%" },
    { label: "Putts Per Round", key: "puttsPerRound", placeholder: "28.4" },
    { label: "Sand Save %", key: "sandSavePct", placeholder: "54.2", unit: "%" },
    { label: "Eagles", key: "eagles", placeholder: "4" },
  ],
  // ── Lacrosse ──────────────────────────────────────────────────────────────
  Lacrosse: [
    { label: "Goals", key: "goalsLax", placeholder: "42" },
    { label: "Assists", key: "assistsLax", placeholder: "28" },
    { label: "Ground Balls", key: "groundBalls", placeholder: "67" },
    { label: "Shots On Goal", key: "shotsOnGoalLax", placeholder: "124" },
    { label: "Shot %", key: "shotPctLax", placeholder: "33.9", unit: "%" },
    { label: "Save %", key: "savePctLax", placeholder: "58.4", unit: "%" },
    { label: "Caused Turnovers", key: "causedTurnovers", placeholder: "34" },
    { label: "Faceoff %", key: "faceoffPctLax", placeholder: "58.2", unit: "%" },
  ],
  // ── Softball ──────────────────────────────────────────────────────────────
  Softball: [
    { label: "Batting Average", key: "battingAvg", placeholder: ".412" },
    { label: "Home Runs", key: "homeRuns", placeholder: "14" },
    { label: "RBI", key: "rbi", placeholder: "52" },
    { label: "OBP", key: "obp", placeholder: ".482" },
    { label: "ERA", key: "era", placeholder: "1.84" },
    { label: "Pitching Velocity", key: "pitchingVelocity", placeholder: "68", unit: "MPH" },
    { label: "Strikeouts", key: "strikeouts", placeholder: "187" },
    { label: "Stolen Bases", key: "stolenBases", placeholder: "28" },
    { label: "Fielding %", key: "fieldingPct", placeholder: ".982", unit: "%" },
  ],
  // ── Gymnastics ────────────────────────────────────────────────────────────
  Gymnastics: [
    { label: "All-Around Score", key: "allAroundScore", placeholder: "55.650" },
    { label: "Vault Score", key: "vaultScore", placeholder: "14.300" },
    { label: "Uneven Bars", key: "barsScore", placeholder: "14.100" },
    { label: "Balance Beam", key: "beamScore", placeholder: "13.800" },
    { label: "Floor Exercise", key: "floorScore", placeholder: "13.450" },
    { label: "J.O. Level", key: "joLevel", placeholder: "Level 10" },
    { label: "Difficulty Score", key: "difficultyScore", placeholder: "5.8" },
  ],
  // ── Cross Country ─────────────────────────────────────────────────────────
  "Cross Country": [
    { label: "5K Time", key: "fiveKTime", placeholder: "14:28", unit: "min" },
    { label: "6K Time", key: "sixKTime", placeholder: "18:42", unit: "min" },
    { label: "8K Time", key: "eightKTime", placeholder: "24:18", unit: "min" },
    { label: "10K Time", key: "tenKTime", placeholder: "30:45", unit: "min" },
    { label: "Mile Time", key: "mileTime", placeholder: "4:12", unit: "min" },
    { label: "Weekly Mileage", key: "weeklyMileage", placeholder: "70", unit: "mi" },
    { label: "State Ranking", key: "stateRanking", placeholder: "12" },
    { label: "National Ranking", key: "nationalRanking", placeholder: "245" },
  ],
  // ── Rowing ────────────────────────────────────────────────────────────────
  Rowing: [
    { label: "2K Erg Time", key: "twoKErgTime", placeholder: "6:12.4", unit: "min" },
    { label: "500m Split", key: "fiveHundredSplit", placeholder: "1:33.1", unit: "min" },
    { label: "Watts", key: "ergWatts", placeholder: "312", unit: "W" },
    { label: "Stroke Rate", key: "strokeRate", placeholder: "28", unit: "SPM" },
    { label: "Weight", key: "rowingWeight", placeholder: "185", unit: "lbs" },
    { label: "Seat", key: "rowingSeat", placeholder: "Stroke Seat" },
    { label: "Boat Class", key: "boatClass", placeholder: "M8+" },
  ],
  // ── Water Polo ────────────────────────────────────────────────────────────
  "Water Polo": [
    { label: "Goals Per Game", key: "goalsWP", placeholder: "3.2" },
    { label: "Assists Per Game", key: "assistsWP", placeholder: "1.8" },
    { label: "Save %", key: "savePctWP", placeholder: "68.4", unit: "%" },
    { label: "Ejections Drawn", key: "ejectionsDrawn", placeholder: "2.4" },
    { label: "Steals Per Game", key: "stealsWP", placeholder: "1.2" },
    { label: "Blocks Per Game", key: "blocksWP", placeholder: "0.8" },
    { label: "Eggbeater Height", key: "eggbeaterHeight", placeholder: "24", unit: "inches" },
  ],
  // ── Field Hockey ──────────────────────────────────────────────────────────
  "Field Hockey": [
    { label: "Goals", key: "goalsFH", placeholder: "18" },
    { label: "Assists", key: "assistsFH", placeholder: "12" },
    { label: "Shots On Goal", key: "shotsOnGoalFH", placeholder: "67" },
    { label: "Save %", key: "savePctFH", placeholder: "72.4", unit: "%" },
    { label: "Penalty Corners", key: "penaltyCorners", placeholder: "24" },
    { label: "Tackles Won", key: "tacklesWonFH", placeholder: "48" },
    { label: "Pass Accuracy", key: "passAccuracyFH", placeholder: "84.2", unit: "%" },
  ],
  // ── Cheerleading ──────────────────────────────────────────────────────────
  Cheerleading: [
    { label: "Tumbling Level", key: "tumblingLevel", placeholder: "Full Twisting Layout" },
    { label: "Stunting Level", key: "stuntingLevel", placeholder: "Elite" },
    { label: "Years Experience", key: "yearsCheer", placeholder: "8", unit: "yrs" },
    { label: "Competition Level", key: "competitionLevel", placeholder: "All-Star Level 6" },
    { label: "Specialty", key: "cheerSpecialty", placeholder: "Flyer / Tumbler" },
  ],
  // ── Rugby ─────────────────────────────────────────────────────────────────
  Rugby: [
    { label: "Tries", key: "triesRugby", placeholder: "18" },
    { label: "Tackles Made", key: "tacklesRugby", placeholder: "87" },
    { label: "Meters Carried", key: "metersCarried", placeholder: "342" },
    { label: "Lineouts Won", key: "lineoutsWon", placeholder: "24" },
    { label: "Scrums Won", key: "scrumsWon", placeholder: "18" },
    { label: "Conversions", key: "conversions", placeholder: "12" },
    { label: "Penalties Kicked", key: "penaltiesKicked", placeholder: "8" },
  ],
  // ── Cricket ───────────────────────────────────────────────────────────────
  Cricket: [
    { label: "Batting Average", key: "battingAvgCricket", placeholder: "48.4" },
    { label: "Bowling Average", key: "bowlingAvg", placeholder: "24.8" },
    { label: "Strike Rate", key: "strikeRateCricket", placeholder: "142.8" },
    { label: "Economy Rate", key: "economyRate", placeholder: "6.4" },
    { label: "Centuries", key: "centuries", placeholder: "4" },
    { label: "Wickets", key: "wickets", placeholder: "42" },
    { label: "Catches", key: "catches", placeholder: "18" },
    { label: "Highest Score", key: "highestScore", placeholder: "187" },
  ],
};

// Fallback for sports not in the map
const DEFAULT_STATS: StatField[] = [
  { label: "40-Yd Dash", key: "fortyYardDash", placeholder: "4.62", unit: "sec" },
  { label: "Vertical Leap", key: "verticalLeap", placeholder: "36", unit: "inches" },
  { label: "Bench Press", key: "benchPress", placeholder: "225", unit: "lbs" },
  { label: "Season Record", key: "seasonRecord", placeholder: "24-8" },
  { label: "Key Stat 1", key: "keyStat1", placeholder: "Enter your top stat" },
  { label: "Key Stat 2", key: "keyStat2", placeholder: "Enter another stat" },
];

interface SportStatsEditorProps {
  sport: string;
  editForm: Record<string, string>;
  setEditForm: (fn: (prev: any) => any) => void;
}

export default function SportStatsEditor({ sport, editForm, setEditForm }: SportStatsEditorProps) {
  const fields = SPORT_STATS[sport] || DEFAULT_STATS;
  const sportLabel = sport || "Your Sport";

  return (
    <div className="bg-[#0d1f3c] border border-blue-800 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-yellow-400 text-sm">⚡</span>
        <div className="text-white font-bold text-xs">
          {sportLabel} Stats
        </div>
        <span className="text-blue-500 text-xs">(feeds your X-Factor AI score)</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-blue-400 text-[10px] mb-1 block flex items-center gap-1">
              {f.label}
              {f.unit && <span className="text-blue-600">({f.unit})</span>}
            </label>
            <input
              value={editForm[f.key] || ""}
              onChange={e => setEditForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="w-full bg-[#1a3a8f] border border-blue-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400 placeholder-blue-600"
            />
          </div>
        ))}
      </div>
      {!sport && (
        <p className="text-blue-600 text-xs mt-2">Select your sport above to see sport-specific stats</p>
      )}
    </div>
  );
}
