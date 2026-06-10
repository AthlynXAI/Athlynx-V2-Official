/**
 * AthlynXAI School Registry
 *
 * School brand marks must be locally licensed or explicitly approved before
 * public use. Until then, routes use a controlled AthlynX fallback mark rather
 * than hotlinking external sports-logo CDNs.
 */
export type School = {
  abbr: string;        // AthlynX short code (3-5 chars)
  name: string;        // Display name
  conference: string;  // SEC, B1G, ACC, etc.
  primary: string;     // Hex
  secondary: string;   // Hex
  espnId: number;      // ESPN team id for logo
  state: string;
};

export const SCHOOLS: School[] = [
  //  SEC 
  { abbr: "MSU",  name: "Mississippi State", conference: "SEC", primary: "#660000", secondary: "#FFFFFF", espnId: 344, state: "MS" },
  { abbr: "BAMA", name: "Alabama",           conference: "SEC", primary: "#9E1B32", secondary: "#FFFFFF", espnId: 333, state: "AL" },
  { abbr: "LSU",  name: "LSU",               conference: "SEC", primary: "#461D7C", secondary: "#FDD023", espnId: 99,  state: "LA" },
  { abbr: "UGA",  name: "Georgia",           conference: "SEC", primary: "#BA0C2F", secondary: "#000000", espnId: 61,  state: "GA" },
  { abbr: "TEX",  name: "Texas",             conference: "SEC", primary: "#BF5700", secondary: "#FFFFFF", espnId: 251, state: "TX" },
  { abbr: "FLA",  name: "Florida",           conference: "SEC", primary: "#0021A5", secondary: "#FA4616", espnId: 57,  state: "FL" },
  { abbr: "AUB",  name: "Auburn",            conference: "SEC", primary: "#0C2340", secondary: "#E87722", espnId: 2,   state: "AL" },
  { abbr: "OM",   name: "Ole Miss",          conference: "SEC", primary: "#CE1126", secondary: "#14213D", espnId: 145, state: "MS" },
  { abbr: "TENN", name: "Tennessee",         conference: "SEC", primary: "#FF8200", secondary: "#FFFFFF", espnId: 2633,state: "TN" },
  { abbr: "ARK",  name: "Arkansas",          conference: "SEC", primary: "#9D2235", secondary: "#FFFFFF", espnId: 8,   state: "AR" },
  { abbr: "UK",   name: "Kentucky",          conference: "SEC", primary: "#0033A0", secondary: "#FFFFFF", espnId: 96,  state: "KY" },
  { abbr: "MIZ",  name: "Missouri",          conference: "SEC", primary: "#F1B82D", secondary: "#000000", espnId: 142, state: "MO" },
  { abbr: "SC",   name: "South Carolina",    conference: "SEC", primary: "#73000A", secondary: "#000000", espnId: 2579,state: "SC" },
  { abbr: "VAN",  name: "Vanderbilt",        conference: "SEC", primary: "#000000", secondary: "#866D4B", espnId: 238, state: "TN" },
  { abbr: "TAMU", name: "Texas A&M",         conference: "SEC", primary: "#500000", secondary: "#FFFFFF", espnId: 245, state: "TX" },
  { abbr: "OU",   name: "Oklahoma",          conference: "SEC", primary: "#841617", secondary: "#FDF9D8", espnId: 201, state: "OK" },

  //  Big Ten 
  { abbr: "OSU",  name: "Ohio State",        conference: "B1G", primary: "#BB0000", secondary: "#666666", espnId: 194, state: "OH" },
  { abbr: "UM",   name: "Michigan",          conference: "B1G", primary: "#00274C", secondary: "#1E90FF", espnId: 130, state: "MI" },
  { abbr: "PSU",  name: "Penn State",        conference: "B1G", primary: "#041E42", secondary: "#FFFFFF", espnId: 213, state: "PA" },
  { abbr: "ORE",  name: "Oregon",            conference: "B1G", primary: "#154733", secondary: "#FEE123", espnId: 2483,state: "OR" },
  { abbr: "USC",  name: "USC",               conference: "B1G", primary: "#990000", secondary: "#1E90FF", espnId: 30,  state: "CA" },
  { abbr: "UCLA", name: "UCLA",              conference: "B1G", primary: "#2774AE", secondary: "#1E90FF", espnId: 26,  state: "CA" },

  //  ACC & Independent 
  { abbr: "ND",   name: "Notre Dame",        conference: "IND", primary: "#0C2340", secondary: "#C99700", espnId: 87,  state: "IN" },
  { abbr: "CLEM", name: "Clemson",           conference: "ACC", primary: "#F66733", secondary: "#522D80", espnId: 228, state: "SC" },
  { abbr: "FSU",  name: "Florida State",     conference: "ACC", primary: "#782F40", secondary: "#CEB888", espnId: 52,  state: "FL" },
  { abbr: "MIA",  name: "Miami",             conference: "ACC", primary: "#F47321", secondary: "#005030", espnId: 2390,state: "FL" },

  //  Mississippi & Local 
  { abbr: "USM",  name: "Southern Miss",     conference: "SBC", primary: "#1E90FF", secondary: "#000000", espnId: 2572,state: "MS" },
  { abbr: "MEM",  name: "Memphis",           conference: "AAC", primary: "#0C2340", secondary: "#8E9295", espnId: 235, state: "TN" },
];

/**
 * Return the approved local fallback mark until each school logo is licensed
 * or provided through an approved partner feed.
 */
export function schoolLogoUrl(_school: Pick<School, "espnId">): string {
  return "/images/logos/athlynx-main-logo.png";
}

export function schoolByAbbr(abbr: string): School | undefined {
  return SCHOOLS.find((s) => s.abbr === abbr);
}
