// AthlynX — Sports configuration
// Single source of truth for every sport surfaced on the platform.
// Brand-locked: cobalt #1E90FF + true black + white. No gold/yellow/orange.

export interface Sport {
  slug: string;            // url slug, e.g. "baseball" or "fairway"
  name: string;            // display name, e.g. "Baseball"
  brand: string;           // AthlynX sub-brand, e.g. "Diamond Grind"
  category: "team" | "individual" | "racquet" | "combat" | "endurance" | "winter" | "water" | "youth" | "outdoor";
  icon: string;            // emoji or icon token
  tagline: string;         // 1-line athlete-facing tagline
  season: string;          // e.g. "Fall", "Spring", "Year-round"
  featured?: boolean;      // surfaced on the AllSportsHub hero strip
}

export const SPORTS: Sport[] = [
  // Featured AthlynX flagship brands
  { slug: "baseball",          name: "Baseball",            brand: "Diamond Grind",        category: "team",       icon: "⚾", tagline: "Built for the diamond.",            season: "Spring",     featured: true },
  { slug: "football",          name: "Football",            brand: "Gridiron Nexus",       category: "team",       icon: "🏈", tagline: "The gridiron, owned.",              season: "Fall",       featured: true },
  { slug: "basketball",        name: "Basketball",          brand: "Court Kings",          category: "team",       icon: "🏀", tagline: "Own the court.",                    season: "Winter",     featured: true },
  { slug: "softball",          name: "Softball",            brand: "Diamond Grind",        category: "team",       icon: "🥎", tagline: "Built for every pitch.",            season: "Spring",     featured: true },
  { slug: "soccer",            name: "Soccer",              brand: "Pitch Pulse",          category: "team",       icon: "⚽", tagline: "Every touch matters.",              season: "Fall",       featured: true },

  // Racquet / net
  { slug: "tennis",            name: "Tennis",              brand: "Racket Kings",         category: "racquet",    icon: "🎾", tagline: "Own the baseline.",                 season: "Year-round" },
  { slug: "pickleball",        name: "Pickleball",          brand: "Racket Kings",         category: "racquet",    icon: "🏓", tagline: "The court is yours.",               season: "Year-round" },
  { slug: "paddle-tennis",     name: "Paddle Tennis",       brand: "Racket Kings",         category: "racquet",    icon: "🏓", tagline: "Quick hands, quicker mind.",        season: "Year-round" },
  { slug: "badminton",         name: "Badminton",           brand: "Net Setters",          category: "racquet",    icon: "🏸", tagline: "Air. Reflex. Win.",                 season: "Year-round" },
  { slug: "table-tennis",      name: "Table Tennis",        brand: "Racket Kings",         category: "racquet",    icon: "🏓", tagline: "Speed of light.",                   season: "Year-round" },
  { slug: "volleyball",        name: "Volleyball",          brand: "Net Setters",          category: "team",       icon: "🏐", tagline: "Above the net.",                    season: "Fall" },
  { slug: "beach-volleyball",  name: "Beach Volleyball",    brand: "Net Setters",          category: "team",       icon: "🏐", tagline: "Sand. Sun. Slam.",                  season: "Summer" },

  // Combat
  { slug: "wrestling",         name: "Wrestling",           brand: "Mat Warriors",         category: "combat",     icon: "🤼", tagline: "Iron sharpens iron.",               season: "Winter" },
  { slug: "boxing",            name: "Boxing",              brand: "Mat Warriors",         category: "combat",     icon: "🥊", tagline: "Hands up. Head down. Win.",         season: "Year-round" },
  { slug: "mma",               name: "MMA",                 brand: "Mat Warriors",         category: "combat",     icon: "🥋", tagline: "Every weapon.",                     season: "Year-round" },
  { slug: "fencing",           name: "Fencing",             brand: "Mat Warriors",         category: "combat",     icon: "🤺", tagline: "Speed. Steel. Strategy.",           season: "Year-round" },

  // Endurance / track
  { slug: "track-field",       name: "Track & Field",       brand: "Track Elite",          category: "endurance",  icon: "🏃", tagline: "Every step counts.",                season: "Spring" },
  { slug: "cross-country",     name: "Cross Country",       brand: "Track Elite",          category: "endurance",  icon: "🏃", tagline: "The mind goes farther.",            season: "Fall" },
  { slug: "cycling",           name: "Cycling",             brand: "Track Elite",          category: "endurance",  icon: "🚴", tagline: "Wattage. Will. Win.",               season: "Year-round" },
  { slug: "triathlon",         name: "Triathlon",           brand: "Track Elite",          category: "endurance",  icon: "🏊", tagline: "Three sports. One athlete.",        season: "Summer" },

  // Water
  { slug: "swimming",          name: "Swimming",            brand: "Swim Surge",           category: "water",      icon: "🏊", tagline: "Lane to lane.",                     season: "Year-round" },
  { slug: "rowing",            name: "Rowing",              brand: "Crew Elite",           category: "water",      icon: "🚣", tagline: "One stroke at a time.",             season: "Spring" },
  { slug: "water-polo",        name: "Water Polo",          brand: "Pool Warriors",        category: "water",      icon: "🤽", tagline: "Tread. Throw. Win.",                season: "Fall" },
  { slug: "surfing",           name: "Surfing",             brand: "Wave Riders",          category: "water",      icon: "🏄", tagline: "Read the ocean.",                   season: "Year-round" },
  { slug: "fishing",           name: "Fishing",             brand: "Reel Masters",         category: "outdoor",    icon: "🎣", tagline: "Patience pays.",                    season: "Year-round" },

  // Winter
  { slug: "skiing",            name: "Skiing",              brand: "Snow Elite",           category: "winter",     icon: "⛷️", tagline: "Edge to edge.",                     season: "Winter" },
  { slug: "snowboarding",      name: "Snowboarding",        brand: "Snow Elite",           category: "winter",     icon: "🏂", tagline: "Carve your line.",                  season: "Winter" },
  { slug: "ice-hockey",        name: "Ice Hockey",          brand: "Ice Breakers",         category: "team",       icon: "🏒", tagline: "Speed on steel.",                   season: "Winter" },

  // Individual / artistic
  { slug: "golf",              name: "Golf",                brand: "Fairway Elite",        category: "individual", icon: "⛳", tagline: "Tee to green.",                     season: "Year-round" },
  { slug: "gymnastics",        name: "Gymnastics",          brand: "Gymnastics Vault",     category: "individual", icon: "🤸", tagline: "Strength. Grace. Win.",             season: "Year-round" },
  { slug: "cheer",             name: "Cheer",               brand: "Cheer Elite",          category: "team",       icon: "📣", tagline: "Lift. Land. Lead.",                 season: "Fall" },
  { slug: "dance",             name: "Dance",               brand: "Dance Elite",          category: "individual", icon: "💃", tagline: "Every beat. Every move.",           season: "Year-round" },
  { slug: "climbing",          name: "Rock Climbing",       brand: "Climbing Elite",       category: "individual", icon: "🧗", tagline: "Read the wall. Send.",              season: "Year-round" },
  { slug: "skateboarding",     name: "Skateboarding",       brand: "Skate Elite",          category: "individual", icon: "🛹", tagline: "Land it clean.",                    season: "Year-round" },
  { slug: "weightlifting",     name: "Weightlifting",       brand: "Iron Athletes",        category: "combat",     icon: "🏋️", tagline: "Lift. Drive. Rise.",                season: "Year-round" },
  { slug: "archery",           name: "Archery",             brand: "Bullseye Elite",       category: "individual", icon: "🏹", tagline: "Steady aim.",                       season: "Year-round" },
  { slug: "equestrian",        name: "Equestrian",          brand: "Equestrian Elite",     category: "individual", icon: "🏇", tagline: "Horse and rider, one.",             season: "Year-round" },

  // Field
  { slug: "field-hockey",      name: "Field Hockey",        brand: "Field Elite",          category: "team",       icon: "🏑", tagline: "Stick to stick.",                   season: "Fall" },
  { slug: "lacrosse",          name: "Lacrosse",            brand: "Lax Elite",            category: "team",       icon: "🥍", tagline: "Cradle. Cut. Score.",               season: "Spring" },
  { slug: "rugby",             name: "Rugby",               brand: "Rugby Elite",          category: "team",       icon: "🏉", tagline: "Run hard. Hit harder.",             season: "Year-round" },
  { slug: "cricket",           name: "Cricket",             brand: "Cricket Elite",        category: "team",       icon: "🏏", tagline: "Bat. Ball. Boundary.",              season: "Year-round" },

  // Outdoor
  { slug: "hunting",           name: "Hunting",             brand: "Hunt Pro",             category: "outdoor",    icon: "🦌", tagline: "Track. Aim. Respect.",              season: "Fall" },
];

export function getSport(slug: string): Sport | undefined {
  return SPORTS.find((s) => s.slug === slug);
}

export const FEATURED_SPORTS = SPORTS.filter((s) => s.featured);

export const SPORTS_BY_CATEGORY: Record<Sport["category"], Sport[]> = SPORTS.reduce(
  (acc, sport) => {
    (acc[sport.category] ||= []).push(sport);
    return acc;
  },
  {} as Record<Sport["category"], Sport[]>
);
