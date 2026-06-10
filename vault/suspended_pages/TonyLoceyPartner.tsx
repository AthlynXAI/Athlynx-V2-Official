/**
 * /partner/tony-locey
 * ---------------------------------------------------------------------------
 * Tony Locey — First Athlete Partner of AthlynX.
 *
 * Rebuilt with Maven-grade hero card + Opendorse-depth career data:
 *   • Full-bleed pitching photo with name overlay (no badge over face)
 *   • At-a-glance tiles (Draft / Bonus / College ERA / Pro K)
 *   • HIGH SCHOOL · CAPE COD · COLLEGE · PROFESSIONAL tabs with year-by-year
 *   • Highlights & awards for every level
 *   • Full transactions timeline (signed → Arenado trade → Rays → released)
 *   • Source attribution to UGA / Cape Cod League / MiLB / MLB
 *
 * Replaces the previous LinkedIn-styled "Business Profile" block.
 *
 * Data sources (verbatim from public records, see sources[] at bottom of page):
 *   • UGA Bulldogs official roster bio (georgiadogs.com)
 *   • MiLB.com player page (career line + transactions)
 *   • Cape Cod League / Brewster Whitecaps roster (2018)
 *   • Houston County HS state title coverage
 */

import AthletePartnerProfile, {
  AthletePartnerData,
} from "@/components/AthletePartnerProfile";

const tony: AthletePartnerData = {
  slug: "tony-locey",
  name: "Tony Locey",
  positionLine: "RHP · R/R · #25",
  bioLine: "6'3\" · 239 lb · Born July 29, 1998 · Warner Robins, GA",
  tagline:
    "Georgia's #1 high-school pitcher in 2016. SEC Pitcher of the Week (twice) at UGA. Third-round MLB Draft pick by the St. Louis Cardinals, traded to Colorado in the Nolan Arenado deal. AthlynX's first true athlete partner.",
  heroPhoto: "/team/tony-locey-hero.jpg",
  cardPhoto: "/team/tony-locey.jpg",
  partnerKicker: "FIRST ATHLETE PARTNER · ATHLYNX NETWORK · AXN",
  atAGlance: [
    { label: "MLB Draft", value: "2019 · R3 · #96" },
    { label: "Signing Bonus", value: "$604,800" },
    { label: "Best College ERA", value: "2.53" },
    { label: "Career Pro Strikeouts", value: "221" },
  ],
  career: [
    // ─── HIGH SCHOOL ────────────────────────────────────────────────────────
    {
      label: "High School",
      subtitle: "Houston County HS · Warner Robins, GA · 2013–2016",
      rows: [
        {
          season: "2014",
          team: "Houston County HS",
          level: "Sophomore",
          note: "Varsity contributor",
        },
        {
          season: "2015",
          team: "Houston County HS",
          level: "Junior",
          wl: "3-1",
          era: "2.00",
          ip: "29.0",
          so: "35",
          note: "Also hit .336 with 2 HR / 18 RBI",
        },
        {
          season: "2016",
          team: "Houston County HS",
          level: "Senior",
          note: "Senior-night no-hitter · State Championship game-one win (6 IP, 11 K)",
        },
      ],
      highlights: [
        "Georgia 6A State Championship (2016) — team finished 30-9",
        "Ranked Georgia's #1 high-school pitcher (Class of 2016)",
        "Senior-night no-hitter at Houston County",
        "Tossed 6 IP / 11 K to win Game 1 of the GHSA state finals",
        "High-school teammate of D.L. Hall (MLB) and Jake Fromm (NFL)",
      ],
    },

    // ─── CAPE COD ───────────────────────────────────────────────────────────
    {
      label: "Cape Cod",
      subtitle: "Brewster Whitecaps · Cape Cod League · Summer 2018",
      rows: [
        {
          season: "Summer 2018",
          age: 19,
          team: "Brewster Whitecaps",
          level: "Cape Cod League",
          note: "Top collegiate summer-wood-bat league — MLB scout showcase",
        },
      ],
      highlights: [
        "Selected to the Cape Cod League — the top collegiate summer showcase for MLB scouts",
        "Brewster Whitecaps alumnus alongside Matt LaPorta, Michael Lorenzen, and other MLB names",
      ],
    },

    // ─── COLLEGE ───────────────────────────────────────────────────────────
    {
      label: "College",
      subtitle: "Georgia Bulldogs · SEC · 2017–2019",
      rows: [
        {
          season: "2017",
          age: 18,
          team: "Georgia Bulldogs",
          level: "Freshman",
          wl: "2-4",
          era: "6.38",
          g: "16",
          gs: "8",
          ip: "42.1",
          so: "37",
          bb: "31",
          note: "Team finished 25-32, advanced to SEC Tournament",
        },
        {
          season: "2018",
          age: 19,
          team: "Georgia Bulldogs",
          level: "Sophomore",
          wl: "7-2",
          era: "4.28",
          g: "27",
          gs: "5",
          ip: "54.2",
          so: "60",
          bb: "30",
          baa: ".220",
          note: "Team went 39-21, advanced to NCAA Athens Regional Final",
        },
        {
          season: "2019",
          age: 20,
          team: "Georgia Bulldogs",
          level: "Junior",
          wl: "11-2",
          era: "2.53",
          g: "15",
          gs: "15",
          ip: "89.0",
          so: "97",
          bb: "31",
          baa: ".168",
          note: "First Bulldog to win 11 games in a season since 1990",
        },
      ],
      careerLine: {
        season: "Career",
        team: "Georgia (SEC)",
        level: "Career Totals",
        wl: "20-8",
        era: "3.92",
        g: "58",
        gs: "28",
        ip: "186.0",
        so: "194",
        bb: "92",
      },
      highlights: [
        "2019 SEC Pitcher of the Week — twice (incl. series-clinching one-hitter vs. #5 Vanderbilt)",
        "2019 National Pitcher of the Year semifinalist — College Baseball Foundation",
        "Led UGA staff that set school strikeout record (601) and 2nd-best ERA in school history (3.24)",
        "Helped Bulldogs to school-record 21-9 SEC mark, NCAA #4 national seed, top-15 ranking",
        "Selected 3rd round (96th overall) of the 2019 MLB Draft by the St. Louis Cardinals",
      ],
    },

    // ─── PRO ────────────────────────────────────────────────────────────────
    {
      label: "Professional",
      subtitle: "St. Louis Cardinals → Colorado Rockies → Tampa Bay Rays · 2019–2023",
      rows: [
        {
          season: "2019",
          age: 20,
          team: "GCL Cardinals / Peoria Chiefs",
          level: "Rookie · A",
          note: "Pro debut after signing for $604,800 (June 12, 2019)",
        },
        {
          season: "2021",
          age: 22,
          team: "Spokane Indians / Fresno Grizzlies",
          level: "A+ · A",
          note: "First season in Rockies system after Arenado trade",
        },
        {
          season: "2022",
          age: 23,
          team: "Spokane Indians / Hartford Yard Goats",
          level: "A+ · AA",
          note: "Promoted to Double-A Hartford on July 6",
        },
        {
          season: "2023",
          age: 24,
          team: "Montgomery Biscuits / Bowling Green Hot Rods",
          level: "AA · A+",
          note: "Traded to Rays March 27; released August 7",
        },
      ],
      careerLine: {
        season: "Career",
        team: "MiLB (3 orgs)",
        level: "Career Totals",
        wl: "13-8",
        era: "5.09",
        g: "79",
        gs: "30",
        ip: "203.1",
        so: "221",
        whip: "1.59",
      },
      highlights: [
        "Signing bonus: $604,800 (St. Louis Cardinals, June 12, 2019)",
        "Headlined the return package in the Nolan Arenado trade (Feb 1, 2021): Cardinals sent Locey, LHP Austin Gomber, 3B Elehuris Montero, SS Mateo Gil, and RHP Jake Sommers to Colorado",
        "Traded to Tampa Bay Rays (March 27, 2023) for player to be named later",
        "Three MLB organizations across five professional seasons",
        "Career 221 strikeouts in 203.1 pro innings",
      ],
    },
  ],

  // ─── TRANSACTIONS TIMELINE ────────────────────────────────────────────────
  transactions: [
    { date: "Jun 12, 2019", description: "St. Louis Cardinals signed RHP Tony Locey (3rd round, #96 overall, $604,800 bonus)." },
    { date: "Jun 24, 2019", description: "Assigned to GCL Cardinals (Rookie)." },
    { date: "Jul 4, 2019", description: "Assigned to Peoria Chiefs (A)." },
    { date: "Aug 20, 2019", description: "Placed on 7-day injured list (Peoria Chiefs)." },
    { date: "Sep 17, 2019", description: "Activated from injured list." },
    { date: "Feb 1, 2021", description: "Colorado Rockies acquired Locey from St. Louis Cardinals in the Nolan Arenado trade (with LHP Austin Gomber, 3B Elehuris Montero, SS Mateo Gil, RHP Jake Sommers)." },
    { date: "Feb 1, 2021", description: "Assigned to Lancaster JetHawks (A+)." },
    { date: "May 4, 2021", description: "Promoted to Fresno Grizzlies from Spokane Indians." },
    { date: "Apr 6, 2022", description: "Assigned to Spokane Indians (A+)." },
    { date: "Jul 6, 2022", description: "Promoted to Hartford Yard Goats (AA)." },
    { date: "Mar 27, 2023", description: "Colorado Rockies traded Locey to Tampa Bay Rays for a player to be named later." },
    { date: "Mar 28, 2023", description: "Assigned to Montgomery Biscuits (AA)." },
    { date: "Apr 6, 2023", description: "Transferred to the Development List (Montgomery Biscuits)." },
    { date: "May 30, 2023", description: "Assigned to Bowling Green Hot Rods (A+) from Montgomery Biscuits." },
    { date: "Aug 7, 2023", description: "Released by Bowling Green Hot Rods." },
  ],

  gallery: [
    { src: "/team/tony-locey-action.jpg", caption: "Leg kick · Foley UGA" },
    { src: "/team/tony-locey.jpg", caption: "Mound presence · Bulldogs vs. SEC opponent" },
    { src: "/team/tony-locey-portrait.jpg", caption: "Off the field" },
  ],

  sources: [
    { label: "UGA Bulldogs Official Bio", href: "https://georgiadogs.com/sports/baseball/roster/tony-locey/3530" },
    { label: "MiLB Player Page (Career + Transactions)", href: "https://www.milb.com/player/tony-locey-666138" },
    { label: "MLB.com Player Page", href: "https://www.mlb.com/player/tony-locey-666138" },
    { label: "Brewster Whitecaps · Cape Cod League", href: "https://en.wikipedia.org/wiki/Brewster_Whitecaps" },
  ],
};

export default function TonyLoceyPartner() {
  return <AthletePartnerProfile athlete={tony} />;
}
