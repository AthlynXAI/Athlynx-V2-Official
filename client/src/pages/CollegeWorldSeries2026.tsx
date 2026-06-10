import PlatformLayout from "@/components/PlatformLayout";
import { Link } from "wouter";

const regionals = [
  {
    "regional": "Athens Regional",
    "hostSite": "Foley Field, Athens, Georgia",
    "teams": [
      "No. 1 Georgia",
      "No. 2 Boston College",
      "No. 3 Liberty",
      "No. 4 LIU"
    ],
    "openingMatchups": "Game 1: Liberty vs Boston College, 2 p.m. ET, ESPN+; Game 2: Georgia vs Long Island, 7 p.m. ET, SEC Network",
    "mississippiRelevance": "None - No Mississippi teams are in the Athens Regional. Mississippi State is in the Starkville Regional, Ole Miss is in the Lincoln Regional, and Southern Miss is in the Hattiesburg Regional.",
    "confidence": "High - All information verified across multiple credible sources."
  },
  {
    "regional": "Atlanta Regional",
    "hostSite": "Mac Nease Baseball Park at Russ Chandler Stadium, Atlanta, Georgia",
    "teams": [
      "No. 1 Georgia Tech",
      "No. 2 Oklahoma",
      "No. 3 The Citadel",
      "No. 4 UIC"
    ],
    "openingMatchups": "Game 1: No. 1 Georgia Tech vs No. 4 UIC, Noon ET, ACCN; Game 2: No. 3 The Citadel vs No. 2 Oklahoma, 5 p.m. ET, ESPN+",
    "mississippiRelevance": "None",
    "confidence": "High - All information is from official NCAA sources or host school."
  },
  {
    "regional": "Auburn Regional",
    "hostSite": "Plainsman Park, Auburn, Alabama",
    "teams": [
      "No. 1 Auburn",
      "No. 2 UCF",
      "No. 3 NC State",
      "No. 4 Milwaukee"
    ],
    "openingMatchups": "Uncertain - pairings to be announced at Noon ET on May 25, 2026.",
    "mississippiRelevance": "None - Southern Miss is hosting in Hattiesburg, Mississippi State is hosting in Starkville, and Ole Miss is in the Lincoln Regional.",
    "confidence": "High - Host site and teams are verified. Low - Opening matchups are not yet available."
  },
  {
    "regional": "Austin Regional",
    "hostSite": "UFCU Disch-Falk Field, Austin, Texas",
    "teams": [
      "No. 1 Texas",
      "No. 2 UC Santa Barbara",
      "No. 3 Tarleton State",
      "No. 4 Holy Cross"
    ],
    "openingMatchups": "Game 1: Holy Cross vs Texas, 1:00 PM CT, SECN; Game 2: Tarleton State vs UC Santa Barbara, 6:00 PM CT, ESPN+",
    "mississippiRelevance": "None",
    "confidence": "High - All information is directly from credible sources. Seeds are inferred based on typical regional seeding where the host is the No. 1 seed and the matchups follow a 1v4, 2v3 pattern."
  },
  {
    "regional": "Chapel Hill Regional",
    "hostSite": "Boshamer Stadium, Chapel Hill, North Carolina",
    "teams": [
      "No. 1 North Carolina",
      "No. 2 Tennessee",
      "No. 3 East Carolina",
      "No. 4 VCU"
    ],
    "openingMatchups": "Game 1: No. 2 Tennessee vs. No. 3 East Carolina, Noon ET, ESPNU; Game 2: No. 1 North Carolina vs. No. 4 VCU, 5 p.m. ET, ESPN+",
    "mississippiRelevance": "None - No Mississippi teams are in this regional.",
    "confidence": "High - All information directly from NCAA.com"
  },
  {
    "regional": "College Station Regional",
    "hostSite": "Olsen Field at Blue Bell Park, College Station, Texas",
    "teams": [
      "Uncertain - Teams and seeds for 2026 are not yet announced."
    ],
    "openingMatchups": "Uncertain - Teams and matchups for 2026 are not yet announced.",
    "mississippiRelevance": "None - Southern Miss is a host site, but not for the College Station Regional. MSU and Ole Miss are not mentioned in relation to College Station.",
    "confidence": "High - Host site confirmed, but teams and matchups are not yet determined for 2026."
  },
  {
    "regional": "Eugene Regional",
    "hostSite": "PK Park, Eugene, Oregon",
    "teams": [
      "No. 1 Oregon",
      "No. 2 Oregon St.",
      "No. 3 Washington St.",
      "No. 4 Yale"
    ],
    "openingMatchups": "Game 1: No. 2 Oregon St. vs No. 3 Washington St., 3 p.m. ET, ESPN+; Game 2: No. 1 Oregon vs No. 4 Yale, 8 p.m. ET, ESPN+",
    "mississippiRelevance": "None",
    "confidence": "High - Information verified by NCAA.com and goducks.com."
  },
  {
    "regional": "Gainesville Regional",
    "hostSite": "Condron Family Ballpark, Gainesville, Florida",
    "teams": [
      "No. 1 Florida",
      "No. 2 Miami (FL)",
      "No. 3 Troy",
      "No. 4 Rider"
    ],
    "openingMatchups": "Game 1: No. 1 Florida vs. Rider, 1 p.m. ET, ESPN+; Game 2: No. 2 Miami (FL) vs. No. 3 Troy, 6 p.m. ET, ACCN",
    "mississippiRelevance": "None - The Gainesville Regional includes Florida, Rider, Miami (FL), and Troy. No Mississippi teams are participating in this specific regional.",
    "confidence": "High - Information verified across multiple credible sources including NCAA.com, GatorsWire, and On3.com."
  },
  {
    "regional": "Hattiesburg Regional",
    "hostSite": "Pete Taylor Park/Hill Denson Field, Hattiesburg, Mississippi",
    "teams": [
      "No. 1 Southern Miss",
      "No. 2 Virginia",
      "No. 3 Jacksonville State",
      "No. 4 Little Rock"
    ],
    "openingMatchups": "Game 1: No. 1 Southern Miss vs No. 4 Little Rock, time uncertain, ESPN Networks; Game 2: No. 2 Virginia vs No. 3 Jacksonville State, time uncertain, ESPN Networks",
    "mississippiRelevance": "Southern Miss is hosting the Hattiesburg Regional. Mississippi State is hosting the Starkville Regional. Ole Miss is participating in the Lincoln Regional.",
    "confidence": "High - Teams, host, and site are confirmed by multiple credible sources. Opening matchups are based on standard regional format and broadcast information is confirmed, but specific game times are not yet available."
  },
  {
    "regional": "Lawrence Regional",
    "hostSite": "Hoglund Ballpark, Lawrence, Kansas",
    "teams": [
      "No. 1 Kansas",
      "No. 2 Arkansas",
      "No. 3 Missouri St.",
      "No. 4 Northeastern"
    ],
    "openingMatchups": "Game 1: Kansas vs Northeastern, 1 p.m. CT/ET, ESPN+; Game 2: Arkansas vs Missouri St., time uncertain, broadcast uncertain",
    "mississippiRelevance": "None - No Mississippi teams are participating in this regional.",
    "confidence": "High - Information is consistent across multiple credible sources, though the exact time and broadcast for the second opening game are not explicitly stated in the snippets."
  },
  {
    "regional": "Lincoln Regional",
    "hostSite": "Hawks Field at Haymarket Park, Lincoln, Nebraska",
    "teams": [
      "Uncertain - teams and seeds are not yet announced."
    ],
    "openingMatchups": "Uncertain - opening matchups, times, and broadcast details are not yet announced.",
    "mississippiRelevance": "None - no Mississippi teams are mentioned in the host site announcements.",
    "confidence": "High - host site and regional name are confirmed by multiple credible sources. Low - teams and matchups are not yet announced."
  },
  {
    "regional": "Los Angeles Regional",
    "hostSite": "Jackie Robinson Stadium, Los Angeles, California",
    "teams": [
      "No. 1 UCLA",
      "Saint Mary's College",
      "Cal Poly",
      "Virginia Tech"
    ],
    "openingMatchups": "Game 1: Saint Mary's College vs UCLA, 6:00 PM ET, ESPNU; Game 2: Cal Poly vs Virginia Tech, 11:00 PM ET, ESPN+",
    "mississippiRelevance": "None - No Mississippi teams are participating in the Los Angeles Regional.",
    "confidence": "High - Teams are listed without explicit seeding numbers beyond the host, as not all sources provided full seeding. Game times are converted from local PT to ET."
  },
  {
    "regional": "Morgantown Regional",
    "hostSite": "Kendrick Family Ballpark, Morgantown, West Virginia",
    "teams": [
      "No. 1 West Virginia",
      "No. 2 Wake Forest",
      "No. 3 Kentucky",
      "No. 4 Binghamton"
    ],
    "openingMatchups": "Game 1: Wake Forest vs Kentucky, Noon ET, ESPN2; Game 2: West Virginia vs Binghamton, 5 p.m. ET, ESPN+",
    "mississippiRelevance": "None - No Mississippi teams are participating in the Morgantown Regional.",
    "confidence": "High - Information verified from NCAA.com and Wikipedia."
  },
  {
    "regional": "Starkville Regional",
    "hostSite": "Dudy Noble Field, Starkville, Mississippi",
    "teams": [
      "Uncertain - teams and seeds to be announced"
    ],
    "openingMatchups": "Uncertain - matchups to be announced",
    "mississippiRelevance": "MSU - Mississippi State is hosting the regional.",
    "confidence": "High - Host site and regional name confirmed by multiple credible sources. Teams and matchups are not yet announced."
  },
  {
    "regional": "Tallahassee Regional",
    "hostSite": "Mike Martin Field at Dick Howser Stadium, Tallahassee, Florida",
    "teams": [
      "No. 1 Florida St.",
      "No. 2 Coastal Carolina",
      "No. 3 NIU",
      "No. 4 St. John\u2019s (NY)"
    ],
    "openingMatchups": "Game 1: Florida St. vs St. John\u2019s (NY), 3 p.m. ET, ACCN; Game 2: Coastal Carolina vs NIU, 8 p.m. ET, ESPN+",
    "mississippiRelevance": "None - No Mississippi teams in this regional",
    "confidence": "High - All information directly from NCAA.com"
  },
  {
    "regional": "Tuscaloosa Regional",
    "hostSite": "Sewell-Thomas Stadium, Tuscaloosa, Alabama",
    "teams": [
      "No. 1 Alabama",
      "No. 2 Oklahoma State",
      "No. 3 USC Upstate",
      "No. 4 Alabama State"
    ],
    "openingMatchups": "Game 1: Oklahoma State vs USC Upstate, 2 p.m. ET, ESPN+; Game 2: Alabama vs Alabama State, time uncertain, broadcast uncertain",
    "mississippiRelevance": "None - No Mississippi teams are participating in the Tuscaloosa Regional.",
    "confidence": "High - Information is consistent across multiple credible sources, including NCAA.com and official university athletics sites. Game times for the second matchup are not explicitly stated in the snippets, hence marked as uncertain."
  }
] as const;
const mississippiHighlights = [
  {
    "regional": "Hattiesburg Regional",
    "hostSite": "Pete Taylor Park/Hill Denson Field, Hattiesburg, Mississippi",
    "teams": [
      "No. 1 Southern Miss",
      "No. 2 Virginia",
      "No. 3 Jacksonville State",
      "No. 4 Little Rock"
    ],
    "openingMatchups": "Game 1: No. 1 Southern Miss vs No. 4 Little Rock, time uncertain, ESPN Networks; Game 2: No. 2 Virginia vs No. 3 Jacksonville State, time uncertain, ESPN Networks",
    "mississippiRelevance": "Southern Miss is hosting the Hattiesburg Regional. Mississippi State is hosting the Starkville Regional. Ole Miss is participating in the Lincoln Regional.",
    "confidence": "High - Teams, host, and site are confirmed by multiple credible sources. Opening matchups are based on standard regional format and broadcast information is confirmed, but specific game times are not yet available."
  },
  {
    "regional": "Lincoln Regional",
    "hostSite": "Hawks Field at Haymarket Park, Lincoln, Nebraska",
    "teams": [
      "Uncertain - teams and seeds are not yet announced."
    ],
    "openingMatchups": "Uncertain - opening matchups, times, and broadcast details are not yet announced.",
    "mississippiRelevance": "None - no Mississippi teams are mentioned in the host site announcements.",
    "confidence": "High - host site and regional name are confirmed by multiple credible sources. Low - teams and matchups are not yet announced."
  },
  {
    "regional": "Starkville Regional",
    "hostSite": "Dudy Noble Field, Starkville, Mississippi",
    "teams": [
      "Uncertain - teams and seeds to be announced"
    ],
    "openingMatchups": "Uncertain - matchups to be announced",
    "mississippiRelevance": "MSU - Mississippi State is hosting the regional.",
    "confidence": "High - Host site and regional name confirmed by multiple credible sources. Teams and matchups are not yet announced."
  }
] as const;

function TeamList({ teams }: { teams: readonly string[] }) {
  if (!teams.length) return <p className="text-white/60 text-sm">Teams pending final bracket confirmation.</p>;
  return (
    <div className="grid gap-2">
      {teams.map((team) => (
        <div key={team} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/90">
          {team}
        </div>
      ))}
    </div>
  );
}

export default function CollegeWorldSeries2026() {
  const confirmedCount = regionals.filter((regional) => regional.teams.length > 0 && !regional.teams.join(" ").toLowerCase().includes("uncertain")).length;

  return (
    <PlatformLayout>
      <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.055]" style={{ backgroundImage: "url('/brand/athlynx-logo-main.png')", backgroundRepeat: "repeat", backgroundSize: "340px auto", transform: "rotate(-8deg) scale(1.12)" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(30,64,175,0.32),transparent_35%),radial-gradient(circle_at_top_right,rgba(234,179,8,0.20),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.76),#020617_72%)]" />

        <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <Link href="/diamond-grind" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white/80 hover:bg-white/10">
              Diamond Grind
            </Link>
            <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#00C2FF]">
              Road to Omaha 2026
            </span>
            <span className="rounded-full border border-[#F6C453]/30 bg-[#5D1725]/45 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#F6C453]">
              AthlynXAI · AXN · AVN · The Athlete Playbook
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white/70">
              MSU Alum Loyalty
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-blue-200">ATHLYNX Championship Bracket Center</p>
              <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
                2026 NCAA Baseball Regionals & College World Series Path
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-white/75">
                A live fan-facing bracket hub for the regional road to Omaha, built for baseball families, athletes, coaches, and fans following every host site, opening matchup, Mississippi storyline, and MSU alumni loyalty thread.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                  <div className="text-3xl font-black text-[#00C2FF]">{regionals.length}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-white/55">Regional hubs tracked</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                  <div className="text-3xl font-black text-blue-200">{confirmedCount}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-white/55">Team fields listed</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                  <div className="text-3xl font-black text-[#1E90FF]">3</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-white/55">Mississippi storylines</div>
                </div>
              </div>
            </div>

            <div className="athlynx-premium-watermark-card rounded-[2rem] border border-white/10 p-6 shadow-2xl backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#00C2FF]">Mississippi watch · MSU loyalty</p>
              <div className="mt-5 space-y-4">
                {mississippiHighlights.map((item) => (
                  <div key={item.regional} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <h2 className="text-lg font-black text-white">{item.regional}</h2>
                    <p className="mt-1 text-sm font-semibold text-white/65">{item.hostSite}</p>
                    <p className="mt-3 text-sm leading-6 text-white/75">{item.mississippiRelevance}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">Regional bracket board</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">All regional paths in one place</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/55">
              Data is sourced from the uploaded 2026 NCAA Baseball regional research file. Items marked uncertain should be updated as official times and final fields are confirmed.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {regionals.map((regional) => (
              <article key={regional.regional} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur transition hover:border-blue-300/40 hover:bg-white/[0.07]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-black text-white">{regional.regional}</h3>
                    <p className="mt-1 text-sm font-semibold text-blue-100/70">{regional.hostSite}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white/55">Regional</span>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
                  <TeamList teams={regional.teams} />
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00C2FF]">Opening matchups</p>
                      <p className="mt-2 text-sm leading-6 text-white/75">{regional.openingMatchups || "Opening matchups pending final confirmation."}</p>
                    </div>
                    {regional.mississippiRelevance && regional.mississippiRelevance !== "None" ? (
                      <div className="rounded-2xl border border-[#1E90FF]/20 bg-[#1E90FF]/10 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1E90FF]">Mississippi relevance</p>
                        <p className="mt-2 text-sm leading-6 text-white/75">{regional.mississippiRelevance}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PlatformLayout>
  );
}
