/**
 * SportXHub — Universal All-in-One X-Factor Sport App Engine
 * Session 33 — May 5, 2026
 * 44 Sports · Profile Tab · Lucide Icons · E2EE Badges · Premium Content
 * Powers every sport on AthlynXAI with the full X-style experience.
 */
import { useState } from "react";
import { Link } from "wouter";
import MobileBottomNav from "@/components/MobileBottomNav";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Zap, Trophy, TrendingUp, Heart, MessageCircle, Repeat2,
  Share2, Bookmark, Eye, Users, BarChart2, MapPin,
  ImageIcon, Target, Activity, ChevronRight, Award,
  DollarSign, RefreshCw, School, Lock, Shield, CheckCircle,
  UserPlus, Edit3, Star, Flame, Cpu, Timer, Dumbbell,
  Ruler, Gauge, Percent, PlayCircle, Camera,
  Building2, FileText, Film, BookOpen, Briefcase,
  ArrowLeft, Globe, ExternalLink, Search, Filter,
  UserCheck, Handshake, Clock, Info, Calendar, Phone, Mail, Verified
} from "lucide-react";

// ─── Sport Config ─────────────────────────────────────────────────────────────
export interface SportConfig {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  accentColor: string;
  coverImg: string;
  nilDeals: { brand: string; type: string; value: string; req: string }[];
  trendingTags: { tag: string; posts: string }[];
  scouts: { name: string; org: string; role: string }[];
  events: { name: string; location: string; date: string; level: string }[];
  positions: string[];
  stats: { value: string; label: string }[];
  seedPosts: { user: string; handle: string; pos: string; content: string; highlight: string; likes: number; xScore: number }[];
}

// ─── All 44 Sports ────────────────────────────────────────────────────────────
export const ALL_SPORTS: SportConfig[] = [
  {
    id: "football", name: "Football", emoji: "🏈", tagline: "DOMINATE THE FIELD",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "8M+", label: "Players" }, { value: "14K+", label: "Programs" }, { value: "3,200+", label: "College Programs" }, { value: "$2B+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Nike", type: "Apparel Sponsor", value: "$5K–$100K/yr", req: "D1 or elite recruit" },
      { brand: "Under Armour", type: "Brand Ambassador", value: "$3K–$50K/yr", req: "Any college level" },
      { brand: "Riddell", type: "Helmet Partner", value: "$2K–$20K/yr", req: "College or HS elite" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$2K–$15K/yr", req: "Any college level" },
      { brand: "EA Sports", type: "Gaming Ambassador", value: "$5K–$50K/yr", req: "D1 starter" },
    ],
    trendingTags: [{ tag: "#Elite11", posts: "12.4K" }, { tag: "#7v7Nationals", posts: "8.9K" }, { tag: "#Committed", posts: "34.2K" }, { tag: "#CombineReady", posts: "6.1K" }, { tag: "#SigningDay", posts: "21.7K" }],
    scouts: [{ name: "Coach Davis", org: "NFL Scout · Dallas Cowboys", role: "Watching QBs & WRs" }, { name: "Rivals.com", org: "National Recruiting", role: "Ranking Class 2027" }, { name: "On3 Sports", org: "NIL Valuation", role: "Tracking top prospects" }],
    events: [{ name: "Elite 11 QB Competition", location: "Dallas, TX", date: "Jun 2026", level: "Elite" }, { name: "Under Armour All-America", location: "Orlando, FL", date: "Jan 2027", level: "Elite" }, { name: "Nike Opening Series", location: "Multiple Sites", date: "Jun–Jul 2026", level: "National" }, { name: "Army All-American Bowl", location: "San Antonio, TX", date: "Jan 2027", level: "Elite" }],
    positions: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K", "P"],
    seedPosts: [
      { user: "Marcus Williams", handle: "@mwilliams_qb", pos: "QB · Westlake HS", content: "Just dropped a 4.38 40-yard dash at the Nike Combine. The work doesn't lie. #CombineReady", highlight: "4.38s 40-Yard Dash", likes: 2847, xScore: 94 },
      { user: "Tyler Brooks", handle: "@tbrooks_lb", pos: "LB · Mater Dei HS", content: "Elite 11 invite just hit the inbox. See y'all in Dallas. #Elite11", highlight: "Elite 11 Invite", likes: 4201, xScore: 92 },
    ],
  },
  {
    id: "basketball", name: "Basketball", emoji: "🏀", tagline: "RISE ABOVE",
    accentColor: "orange", coverImg: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "26M+", label: "Players" }, { value: "8,000+", label: "Programs" }, { value: "1,800+", label: "College Programs" }, { value: "$1.5B+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Nike / Jordan", type: "Signature Deal", value: "$10K–$500K/yr", req: "Top 50 recruit or D1" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$5K–$100K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$2K–$15K/yr", req: "Any college level" },
      { brand: "2K Sports", type: "Gaming Ambassador", value: "$5K–$50K/yr", req: "D1 starter" },
      { brand: "Wilson", type: "Ball Partner", value: "$1K–$10K/yr", req: "Any level" },
    ],
    trendingTags: [{ tag: "#PeachJam", posts: "8.9K" }, { tag: "#EYBL", posts: "15.2K" }, { tag: "#NILDeal", posts: "34.2K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#HoopDreams", posts: "9.4K" }],
    scouts: [{ name: "ESPN Recruiting", org: "National Rankings", role: "Tracking Class 2027" }, { name: "247Sports", org: "NIL Valuation", role: "Top 100 prospects" }, { name: "NBA G League", org: "Pro Development", role: "Scouting elite seniors" }],
    events: [{ name: "Nike EYBL Peach Jam", location: "North Augusta, SC", date: "Jul 2026", level: "Elite" }, { name: "Under Armour Association", location: "Multiple Sites", date: "Apr–Jul 2026", level: "National" }, { name: "Adidas 3SSB", location: "Multiple Sites", date: "Apr–Jul 2026", level: "National" }, { name: "McDonald's All-American", location: "Houston, TX", date: "Apr 2027", level: "Elite" }],
    positions: ["PG", "SG", "SF", "PF", "C"],
    seedPosts: [
      { user: "Aaliyah Johnson", handle: "@aaliyah_hoops", pos: "PG · Oak Ridge Academy", content: "Dropped 38 pts, 11 ast, 6 reb last night. Nike EYBL Peach Jam next week. Scouts — I'll be there. #EYBL", highlight: "38 PTS | 11 AST | 6 REB", likes: 5103, xScore: 91 },
    ],
  },
  {
    id: "baseball", name: "Baseball", emoji: "⚾", tagline: "PLAY BALL",
    accentColor: "red", coverImg: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "15M+", label: "Players" }, { value: "10K+", label: "Programs" }, { value: "2,000+", label: "College Programs" }, { value: "$800M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Rawlings", type: "Glove & Equipment", value: "$2K–$30K/yr", req: "College or elite travel" },
      { brand: "Louisville Slugger", type: "Bat Sponsor", value: "$1K–$20K/yr", req: "Any college level" },
      { brand: "Nike", type: "Apparel Partner", value: "$3K–$40K/yr", req: "D1 or elite recruit" },
      { brand: "Marucci", type: "Bat Partner", value: "$1K–$15K/yr", req: "Any level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
    ],
    trendingTags: [{ tag: "#PerfectGame", posts: "11.2K" }, { tag: "#MLBDraft", posts: "18.4K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#ShowcaseSeason", posts: "7.8K" }, { tag: "#DiamondGrind", posts: "5.3K" }],
    scouts: [{ name: "Perfect Game", org: "National Scouting", role: "Ranking Class 2027" }, { name: "MLB Pipeline", org: "Pro Scouting", role: "Draft prospects" }, { name: "Baseball America", org: "Rankings", role: "Top 100 prospects" }],
    events: [{ name: "Perfect Game National Showcase", location: "Fort Myers, FL", date: "Jun 2026", level: "Elite" }, { name: "Area Code Games", location: "Long Beach, CA", date: "Aug 2026", level: "Elite" }, { name: "Under Armour All-America", location: "Wrigley Chicago", date: "Aug 2026", level: "Elite" }, { name: "WWBA World Championship", location: "Jupiter, FL", date: "Oct 2026", level: "National" }],
    positions: ["SP", "RP", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"],
    seedPosts: [
      { user: "Jake Rodriguez", handle: "@jrod_pitcher", pos: "SP · Jesuit HS", content: "95 MPH fastball clocked at Perfect Game today. MLB scouts in the stands. God is good. #PerfectGame", highlight: "95 MPH Fastball", likes: 3102, xScore: 93 },
    ],
  },
  {
    id: "soccer", name: "Soccer", emoji: "⚽", tagline: "THE BEAUTIFUL GAME",
    accentColor: "green", coverImg: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "265M+", label: "Players Worldwide" }, { value: "50K+", label: "Clubs" }, { value: "2,500+", label: "College Programs" }, { value: "$1B+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Adidas", type: "Boot & Kit Sponsor", value: "$3K–$50K/yr", req: "College or elite club" },
      { brand: "Nike", type: "Apparel Partner", value: "$3K–$40K/yr", req: "D1 or elite recruit" },
      { brand: "Puma", type: "Boot Partner", value: "$2K–$25K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$10K/yr", req: "Any college level" },
      { brand: "EA FC", type: "Gaming Ambassador", value: "$3K–$30K/yr", req: "D1 starter" },
    ],
    trendingTags: [{ tag: "#USYNT", posts: "14.2K" }, { tag: "#CollegeSoccer", posts: "9.8K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#SoccerNIL", posts: "6.4K" }, { tag: "#TopDrawer", posts: "8.1K" }],
    scouts: [{ name: "TopDrawerSoccer", org: "National Rankings", role: "Tracking Class 2027" }, { name: "MLS Next", org: "Pro Development", role: "Scouting elite prospects" }, { name: "US Soccer Federation", org: "National Team", role: "Youth national team" }],
    events: [{ name: "ECNL National Championship", location: "San Diego, CA", date: "Jun 2026", level: "Elite" }, { name: "US Youth Soccer Nationals", location: "Multiple Sites", date: "Jul 2026", level: "National" }, { name: "MLS Next Showcase", location: "Multiple Sites", date: "Jun 2026", level: "Elite" }, { name: "Generation adidas Cup", location: "Multiple Sites", date: "Apr 2026", level: "National" }],
    positions: ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"],
    seedPosts: [
      { user: "Sofia Martinez", handle: "@sofia_soccer", pos: "CAM · ECNL Premier", content: "Hat-trick in the ECNL showcase. Stanford, UCLA, and UNC all in attendance. #ECNL", highlight: "Hat-Trick · ECNL Showcase", likes: 4287, xScore: 92 },
    ],
  },
  {
    id: "track", name: "Track & Field", emoji: "🏃", tagline: "FASTER. HIGHER. STRONGER.",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "57M+", label: "Athletes" }, { value: "3,000+", label: "College Programs" }, { value: "200+", label: "Countries" }, { value: "$500M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Nike", type: "Footwear & Apparel", value: "$5K–$200K/yr", req: "Elite national level" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$3K–$100K/yr", req: "College or elite" },
      { brand: "New Balance", type: "Shoe Partner", value: "$2K–$50K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$10K/yr", req: "Any college level" },
      { brand: "Omega", type: "Timing Partner", value: "$5K–$30K/yr", req: "National qualifier" },
    ],
    trendingTags: [{ tag: "#USATFNationals", posts: "9.2K" }, { tag: "#NCAAs", posts: "14.7K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#TrackNIL", posts: "4.8K" }, { tag: "#SubFour", posts: "6.3K" }],
    scouts: [{ name: "USATF", org: "National Federation", role: "Olympic development" }, { name: "Nike Oregon Project", org: "Pro Development", role: "Elite distance runners" }, { name: "NCAA Track", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USATF Junior Nationals", location: "Eugene, OR", date: "Jun 2026", level: "Elite" }, { name: "New Balance Nationals", location: "Greensboro, NC", date: "Jun 2026", level: "National" }, { name: "Nike Cross Nationals", location: "Portland, OR", date: "Dec 2026", level: "National" }, { name: "Penn Relays", location: "Philadelphia, PA", date: "Apr 2026", level: "National" }],
    positions: ["100m", "200m", "400m", "800m", "1500m", "5000m", "10000m", "110H", "400H", "HJ", "PV", "LJ", "TJ", "SP", "DT", "HT", "JT", "Dec/Hep"],
    seedPosts: [
      { user: "Devon Carter", handle: "@devon_sprints", pos: "100m/200m · Carrollton HS", content: "10.31 FAT at the state meet. Nike Nationals invite confirmed. #USATFNationals", highlight: "10.31 FAT — State Champion", likes: 3891, xScore: 95 },
    ],
  },
  {
    id: "swimming", name: "Swimming", emoji: "🏊", tagline: "MAKE WAVES",
    accentColor: "cyan", coverImg: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "3.5M+", label: "Competitive Swimmers" }, { value: "2,500+", label: "College Programs" }, { value: "200+", label: "Countries" }, { value: "$300M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Speedo", type: "Suit & Gear Partner", value: "$2K–$50K/yr", req: "National qualifier" },
      { brand: "TYR", type: "Brand Ambassador", value: "$2K–$30K/yr", req: "Any college level" },
      { brand: "Arena", type: "Suit Partner", value: "$1K–$20K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
      { brand: "Omega", type: "Timing Partner", value: "$3K–$20K/yr", req: "National qualifier" },
    ],
    trendingTags: [{ tag: "#NCAAs", posts: "8.4K" }, { tag: "#USASwimming", posts: "11.2K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#OlympicTrials", posts: "15.8K" }, { tag: "#SwimNIL", posts: "3.9K" }],
    scouts: [{ name: "USA Swimming", org: "National Federation", role: "Olympic development" }, { name: "SwimSwam", org: "Rankings & News", role: "Top 100 recruits" }, { name: "NCAA Swimming", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USA Swimming Junior Nationals", location: "Irvine, CA", date: "Aug 2026", level: "Elite" }, { name: "NCSA Junior Championships", location: "Orlando, FL", date: "Mar 2026", level: "National" }, { name: "US Olympic Trials", location: "Indianapolis, IN", date: "Jun 2028", level: "Elite" }, { name: "Speedo Sectionals", location: "Multiple Sites", date: "Year-Round", level: "Regional" }],
    positions: ["Free", "Back", "Breast", "Fly", "IM", "Open Water"],
    seedPosts: [
      { user: "Emma Chen", handle: "@emma_swims", pos: "200 Free · Carmel Swim Club", content: "1:44.8 in the 200 free. Olympic Trials standard hit. Stanford offer on the table. #USASwimming", highlight: "1:44.8 — Olympic Trials Standard", likes: 4102, xScore: 96 },
    ],
  },
  {
    id: "wrestling", name: "Wrestling", emoji: "🤼", tagline: "DOMINATE THE MAT",
    accentColor: "red", coverImg: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "280K+", label: "HS Wrestlers" }, { value: "1,000+", label: "College Programs" }, { value: "90+", label: "Countries" }, { value: "$150M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Adidas", type: "Shoe & Apparel", value: "$2K–$30K/yr", req: "National qualifier" },
      { brand: "Nike", type: "Brand Ambassador", value: "$2K–$25K/yr", req: "Any college level" },
      { brand: "Cliff Keen", type: "Gear Partner", value: "$1K–$10K/yr", req: "Any level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
      { brand: "FloWrestling", type: "Media Partner", value: "$2K–$15K/yr", req: "National qualifier" },
    ],
    trendingTags: [{ tag: "#NCAAs", posts: "7.2K" }, { tag: "#Fargo", posts: "9.4K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#WrestlingNIL", posts: "3.1K" }, { tag: "#AllAmerican", posts: "5.8K" }],
    scouts: [{ name: "FloWrestling", org: "National Rankings", role: "Tracking top prospects" }, { name: "InterMat", org: "Rankings & News", role: "Top 100 recruits" }, { name: "NCAA Wrestling", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "Fargo Nationals", location: "Fargo, ND", date: "Jul 2026", level: "Elite" }, { name: "Super 32 Championships", location: "Greensboro, NC", date: "Oct 2026", level: "National" }, { name: "Who's Number One", location: "Raleigh, NC", date: "Sep 2026", level: "Elite" }, { name: "NHSCA Nationals", location: "Virginia Beach, VA", date: "Mar 2026", level: "National" }],
    positions: ["106", "113", "120", "126", "132", "138", "144", "150", "157", "165", "175", "190", "215", "285"],
    seedPosts: [
      { user: "Caden Torres", handle: "@caden_wrestles", pos: "157 lbs · Blair Academy", content: "Fargo Nationals champion at 157. Penn State and Iowa both calling. #Fargo", highlight: "Fargo Nationals Champion", likes: 2891, xScore: 94 },
    ],
  },
  {
    id: "tennis", name: "Tennis", emoji: "🎾", tagline: "ACE YOUR FUTURE",
    accentColor: "green", coverImg: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "87M+", label: "Players Worldwide" }, { value: "1,200+", label: "College Programs" }, { value: "200+", label: "Countries" }, { value: "$400M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Wilson", type: "Racket & Gear", value: "$2K–$50K/yr", req: "ITF ranked or D1" },
      { brand: "Nike", type: "Apparel Partner", value: "$3K–$40K/yr", req: "D1 or elite junior" },
      { brand: "Babolat", type: "Racket Partner", value: "$2K–$30K/yr", req: "Any college level" },
      { brand: "Lacoste", type: "Brand Ambassador", value: "$3K–$25K/yr", req: "ITF top 100 junior" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
    ],
    trendingTags: [{ tag: "#ITFJuniors", posts: "6.2K" }, { tag: "#NCAATennis", posts: "8.1K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#TennisNIL", posts: "3.4K" }, { tag: "#USOpenJuniors", posts: "9.7K" }],
    scouts: [{ name: "USTA", org: "National Federation", role: "Pro development pathway" }, { name: "Tennis Recruiting", org: "College Rankings", role: "Top 100 prospects" }, { name: "NCAA Tennis", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USTA Junior Nationals", location: "Kalamazoo, MI", date: "Aug 2026", level: "Elite" }, { name: "Easter Bowl", location: "Indian Wells, CA", date: "Apr 2026", level: "National" }, { name: "US Open Juniors", location: "New York, NY", date: "Aug 2026", level: "Elite" }, { name: "USTA National Clay Courts", location: "Multiple Sites", date: "Jul 2026", level: "National" }],
    positions: ["Singles", "Doubles", "Mixed Doubles"],
    seedPosts: [
      { user: "Priya Sharma", handle: "@priya_tennis", pos: "Singles · USTA L2", content: "ITF Junior ranking cracked top 50. Stanford and UCLA both reached out this week. #ITFJuniors", highlight: "ITF Top 50 Junior", likes: 2341, xScore: 91 },
    ],
  },
  {
    id: "volleyball", name: "Volleyball", emoji: "🏐", tagline: "SPIKE YOUR FUTURE",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "800M+", label: "Players Worldwide" }, { value: "2,000+", label: "College Programs" }, { value: "200+", label: "Countries" }, { value: "$600M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Mizuno", type: "Shoe & Gear Partner", value: "$2K–$30K/yr", req: "D1 or elite club" },
      { brand: "Nike", type: "Apparel Partner", value: "$3K–$40K/yr", req: "D1 or elite recruit" },
      { brand: "Asics", type: "Shoe Partner", value: "$2K–$20K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
      { brand: "Wilson", type: "Ball Partner", value: "$1K–$10K/yr", req: "Any level" },
    ],
    trendingTags: [{ tag: "#AAUNationals", posts: "12.4K" }, { tag: "#NCAAs", posts: "9.8K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#VolleyballNIL", posts: "5.2K" }, { tag: "#BeachVB", posts: "7.3K" }],
    scouts: [{ name: "USAV", org: "National Federation", role: "Olympic development" }, { name: "PrepVolleyball", org: "National Rankings", role: "Top 100 prospects" }, { name: "NCAA Volleyball", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "AAU Junior Olympics", location: "Fort Worth, TX", date: "Jul 2026", level: "Elite" }, { name: "USAV Girls Junior Nationals", location: "Indianapolis, IN", date: "Jun–Jul 2026", level: "National" }, { name: "Nike Invitational", location: "Multiple Sites", date: "Jan 2026", level: "National" }, { name: "Mizuno Long Beach Easter", location: "Long Beach, CA", date: "Apr 2026", level: "National" }],
    positions: ["S", "OH", "MB", "OPP", "L", "DS"],
    seedPosts: [
      { user: "Kayla Thompson", handle: "@kayla_vball", pos: "OH · Mizuno Long Beach", content: "First team All-American at AAU Nationals. Nebraska and Stanford offers in hand. #AAUNationals", highlight: "AAU All-American", likes: 3892, xScore: 93 },
    ],
  },
  {
    id: "hockey", name: "Hockey", emoji: "🏒", tagline: "BREAK THE ICE",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "3M+", label: "Players" }, { value: "1,500+", label: "Programs" }, { value: "75+", label: "Countries" }, { value: "$400M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Bauer", type: "Equipment Partner", value: "$3K–$50K/yr", req: "USHL or D1" },
      { brand: "CCM", type: "Gear Sponsor", value: "$2K–$30K/yr", req: "Any college level" },
      { brand: "Warrior", type: "Stick Partner", value: "$2K–$20K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
      { brand: "Nike", type: "Apparel Partner", value: "$2K–$25K/yr", req: "D1 starter" },
    ],
    trendingTags: [{ tag: "#USHL", posts: "8.2K" }, { tag: "#NHLDraft", posts: "14.1K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#HockeyNIL", posts: "3.8K" }, { tag: "#NTDP", posts: "6.4K" }],
    scouts: [{ name: "NHL Central Scouting", org: "Pro Scouting", role: "Draft prospects" }, { name: "USHL", org: "Tier 1 Junior", role: "Player development" }, { name: "NCAA Hockey", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "CCM/USA Hockey Showcase", location: "Plymouth, MI", date: "Aug 2026", level: "Elite" }, { name: "USHL Fall Classic", location: "Dubuque, IA", date: "Sep 2026", level: "National" }, { name: "World Junior Championship", location: "TBD", date: "Dec 2026", level: "Elite" }, { name: "NTDP Prospects Tournament", location: "Plymouth, MI", date: "Sep 2026", level: "Elite" }],
    positions: ["G", "LD", "RD", "LW", "C", "RW"],
    seedPosts: [
      { user: "Connor Walsh", handle: "@cwalsh_hockey", pos: "C · USNTDP", content: "Hat-trick in the NTDP Prospects Tournament. NHL Central Scouting has me ranked top 10. #NHLDraft", highlight: "Hat-Trick · Top 10 NHL Prospect", likes: 4102, xScore: 96 },
    ],
  },
  {
    id: "lacrosse", name: "Lacrosse", emoji: "🥍", tagline: "DOMINATE THE FIELD",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "825K+", label: "Players" }, { value: "1,200+", label: "College Programs" }, { value: "60+", label: "Countries" }, { value: "$250M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "STX", type: "Stick & Gear", value: "$2K–$25K/yr", req: "D1 or elite club" },
      { brand: "Nike", type: "Apparel Partner", value: "$2K–$30K/yr", req: "D1 or elite recruit" },
      { brand: "Under Armour", type: "Brand Ambassador", value: "$2K–$20K/yr", req: "Any college level" },
      { brand: "Warrior", type: "Gear Partner", value: "$1K–$15K/yr", req: "Any level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
    ],
    trendingTags: [{ tag: "#NLLDraft", posts: "5.2K" }, { tag: "#NCAAs", posts: "8.4K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#LacrosseNIL", posts: "3.1K" }, { tag: "#TopLax", posts: "6.7K" }],
    scouts: [{ name: "Inside Lacrosse", org: "National Rankings", role: "Top 100 prospects" }, { name: "NLL", org: "Pro Scouting", role: "Draft prospects" }, { name: "NCAA Lacrosse", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "Under Armour Underclassmen", location: "Baltimore, MD", date: "Jul 2026", level: "Elite" }, { name: "Adrenaline Lacrosse Showcase", location: "Multiple Sites", date: "Jun 2026", level: "National" }, { name: "USBOXLA Nationals", location: "Multiple Sites", date: "Aug 2026", level: "National" }, { name: "Brine King of the Hill", location: "Annapolis, MD", date: "May 2026", level: "National" }],
    positions: ["A", "M", "D", "LSM", "G", "FO"],
    seedPosts: [
      { user: "Liam O'Brien", handle: "@liam_lax", pos: "A · Team 91", content: "5 goals, 3 assists at the UA Underclassmen showcase. Virginia and Maryland both in contact. #TopLax", highlight: "5G 3A · UA Showcase", likes: 2341, xScore: 92 },
    ],
  },
  {
    id: "softball", name: "Softball", emoji: "🥎", tagline: "HIT DIFFERENT",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1607743386760-88f10dbb4151?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "7.5M+", label: "Players" }, { value: "1,800+", label: "College Programs" }, { value: "130+", label: "Countries" }, { value: "$500M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "DeMarini", type: "Bat & Gear", value: "$2K–$25K/yr", req: "D1 or elite travel" },
      { brand: "Nike", type: "Apparel Partner", value: "$2K–$30K/yr", req: "D1 or elite recruit" },
      { brand: "Mizuno", type: "Glove Partner", value: "$1K–$15K/yr", req: "Any college level" },
      { brand: "Rawlings", type: "Equipment Partner", value: "$1K–$15K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
    ],
    trendingTags: [{ tag: "#PGFNationals", posts: "10.2K" }, { tag: "#WCWS", posts: "14.8K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#SoftballNIL", posts: "4.9K" }, { tag: "#ExitVelo", posts: "6.1K" }],
    scouts: [{ name: "PGF", org: "National Scouting", role: "Ranking Class 2027" }, { name: "USA Softball", org: "National Federation", role: "Olympic development" }, { name: "NCAA Softball", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "PGF Nationals", location: "Huntington Beach, CA", date: "Jul–Aug 2026", level: "Elite" }, { name: "USA Softball Junior Olympics", location: "Oklahoma City, OK", date: "Jul 2026", level: "National" }, { name: "Colorado Sparkler", location: "Denver, CO", date: "Jun 2026", level: "National" }, { name: "World Series of Softball", location: "Tulsa, OK", date: "Aug 2026", level: "National" }],
    positions: ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DP/UTIL"],
    seedPosts: [
      { user: "Brianna Davis", handle: "@bri_softball", pos: "P · Beverly Bandits", content: "Struck out 18 batters at PGF Nationals. Oklahoma and Alabama both offered. #PGFNationals", highlight: "18 Ks · PGF Nationals", likes: 3892, xScore: 95 },
    ],
  },
  {
    id: "gymnastics", name: "Gymnastics", emoji: "🤸", tagline: "STICK THE LANDING",
    accentColor: "purple", coverImg: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "5M+", label: "Athletes" }, { value: "800+", label: "College Programs" }, { value: "150+", label: "Countries" }, { value: "$200M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "GK Elite", type: "Leotard Partner", value: "$2K–$20K/yr", req: "Level 10 or D1" },
      { brand: "Nike", type: "Apparel Partner", value: "$2K–$25K/yr", req: "D1 or elite" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$2K–$20K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
      { brand: "Gymnova", type: "Equipment Partner", value: "$1K–$10K/yr", req: "National qualifier" },
    ],
    trendingTags: [{ tag: "#USAGNationals", posts: "9.4K" }, { tag: "#NCAAs", posts: "8.1K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#GymnasticsNIL", posts: "3.8K" }, { tag: "#Level10", posts: "7.2K" }],
    scouts: [{ name: "USA Gymnastics", org: "National Federation", role: "Olympic development" }, { name: "College Gym News", org: "Rankings", role: "Top recruits" }, { name: "NCAA Gymnastics", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USAG Junior Nationals", location: "Fort Worth, TX", date: "Jun 2026", level: "Elite" }, { name: "American Classic", location: "Huntsville, AL", date: "Mar 2026", level: "National" }, { name: "US Classic", location: "Hartford, CT", date: "May 2026", level: "National" }, { name: "Winter Cup", location: "Las Vegas, NV", date: "Feb 2026", level: "National" }],
    positions: ["All-Around", "Vault", "Bars", "Beam", "Floor"],
    seedPosts: [
      { user: "Lily Chen", handle: "@lily_gymnastics", pos: "All-Around · WOGA", content: "9.875 on beam at USAG Nationals. UCLA and Florida both offered full rides. #USAGNationals", highlight: "9.875 Beam · USAG Nationals", likes: 4102, xScore: 94 },
    ],
  },
  {
    id: "golf", name: "Golf", emoji: "⛳", tagline: "PLAY YOUR BEST ROUND",
    accentColor: "green", coverImg: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "66M+", label: "Players Worldwide" }, { value: "1,200+", label: "College Programs" }, { value: "200+", label: "Countries" }, { value: "$600M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "TaylorMade", type: "Club & Gear", value: "$3K–$50K/yr", req: "AJGA ranked or D1" },
      { brand: "Nike", type: "Apparel Partner", value: "$3K–$40K/yr", req: "D1 or elite junior" },
      { brand: "Titleist", type: "Ball & Gear", value: "$2K–$30K/yr", req: "Any college level" },
      { brand: "Callaway", type: "Club Partner", value: "$2K–$25K/yr", req: "Any college level" },
      { brand: "FootJoy", type: "Shoe Partner", value: "$1K–$15K/yr", req: "Any college level" },
    ],
    trendingTags: [{ tag: "#AJGAInvitational", posts: "7.2K" }, { tag: "#NCAAs", posts: "8.4K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#GolfNIL", posts: "4.1K" }, { tag: "#PGATour", posts: "12.8K" }],
    scouts: [{ name: "AJGA", org: "Junior Golf", role: "Ranking top juniors" }, { name: "Golf Channel", org: "Media & Rankings", role: "Top 100 juniors" }, { name: "NCAA Golf", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "AJGA Invitational", location: "Multiple Sites", date: "Year-Round", level: "Elite" }, { name: "Junior PGA Championship", location: "Valhalla GC, KY", date: "Aug 2026", level: "Elite" }, { name: "US Junior Amateur", location: "TBD", date: "Jul 2026", level: "Elite" }, { name: "Drive, Chip & Putt National Finals", location: "Augusta, GA", date: "Apr 2026", level: "National" }],
    positions: ["Stroke Play", "Match Play", "Team"],
    seedPosts: [
      { user: "Tyler Park", handle: "@tyler_golf", pos: "AJGA Top 50", content: "Shot 63 at the AJGA Invitational. Stanford and Texas offers confirmed. #AJGAInvitational", highlight: "63 — Course Record", likes: 2891, xScore: 93 },
    ],
  },
  {
    id: "rugby", name: "Rugby", emoji: "🏉", tagline: "NO MERCY",
    accentColor: "green", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "9M+", label: "Players" }, { value: "400+", label: "College Programs" }, { value: "120+", label: "Countries" }, { value: "$150M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Canterbury", type: "Kit & Gear", value: "$2K–$20K/yr", req: "National team or D1" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$2K–$25K/yr", req: "Any college level" },
      { brand: "Gilbert", type: "Ball Partner", value: "$1K–$10K/yr", req: "Any level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
      { brand: "Under Armour", type: "Apparel Partner", value: "$1K–$15K/yr", req: "Any college level" },
    ],
    trendingTags: [{ tag: "#USARugby", posts: "5.2K" }, { tag: "#WorldCup", posts: "18.4K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#RugbyNIL", posts: "2.8K" }, { tag: "#Sevens", posts: "7.1K" }],
    scouts: [{ name: "USA Rugby", org: "National Federation", role: "Olympic development" }, { name: "Major League Rugby", org: "Pro Scouting", role: "Draft prospects" }, { name: "NCAA Rugby", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USA Rugby Nationals", location: "Multiple Sites", date: "May 2026", level: "Elite" }, { name: "Collegiate Rugby Championship", location: "Philadelphia, PA", date: "Jun 2026", level: "National" }, { name: "HSBC Sevens Series", location: "Multiple Cities", date: "Year-Round", level: "Elite" }, { name: "National High School Championships", location: "TBD", date: "Jun 2026", level: "National" }],
    positions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
    seedPosts: [
      { user: "Aidan Murphy", handle: "@aidan_rugby", pos: "Flanker · Life University", content: "Named to the USA Eagles U20 squad. MLR draft eligible next year. #USARugby", highlight: "USA Eagles U20 Selection", likes: 1892, xScore: 91 },
    ],
  },
  {
    id: "cricket", name: "Cricket", emoji: "🏏", tagline: "BAT. BOWL. WIN.",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "1B+", label: "Fans Worldwide" }, { value: "120+", label: "Member Nations" }, { value: "300+", label: "Pro Teams" }, { value: "$1B+", label: "NIL/Sponsorship Market" }],
    nilDeals: [
      { brand: "Gray-Nicolls", type: "Bat & Gear", value: "$2K–$30K/yr", req: "National team or elite" },
      { brand: "Adidas", type: "Kit Partner", value: "$2K–$25K/yr", req: "Any college level" },
      { brand: "Kookaburra", type: "Ball Partner", value: "$1K–$15K/yr", req: "Any level" },
      { brand: "MRF", type: "Bat Sponsor", value: "$2K–$20K/yr", req: "National team" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" },
    ],
    trendingTags: [{ tag: "#IPL", posts: "45.2K" }, { tag: "#T20WorldCup", posts: "38.4K" }, { tag: "#USACricket", posts: "8.1K" }, { tag: "#CricketNIL", posts: "3.2K" }, { tag: "#MajorLeagueCricket", posts: "6.4K" }],
    scouts: [{ name: "ICC", org: "International Cricket Council", role: "Global rankings" }, { name: "USA Cricket", org: "National Federation", role: "National team selection" }, { name: "Major League Cricket", org: "Pro Scouting", role: "Draft prospects" }],
    events: [{ name: "ICC U19 World Cup", location: "TBD", date: "Jan 2026", level: "Elite" }, { name: "MLC Draft", location: "Dallas, TX", date: "Mar 2026", level: "Elite" }, { name: "USA Cricket Nationals", location: "Multiple Sites", date: "Aug 2026", level: "National" }, { name: "T20 Americas Championship", location: "TBD", date: "Sep 2026", level: "National" }],
    positions: ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"],
    seedPosts: [
      { user: "Arjun Patel", handle: "@arjun_cricket", pos: "All-Rounder · USA U19", content: "Selected for USA U19 World Cup squad. MLC scouts watching. #USACricket", highlight: "USA U19 World Cup Selection", likes: 2102, xScore: 90 },
    ],
  },
  {
    id: "cross-country", name: "Cross Country", emoji: "🏃", tagline: "MILES MAKE CHAMPIONS",
    accentColor: "green", coverImg: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "500K+", label: "HS Runners" }, { value: "2,000+", label: "College Programs" }, { value: "100+", label: "Countries" }, { value: "$200M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Nike", type: "Footwear & Apparel", value: "$3K–$100K/yr", req: "National qualifier" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$2K–$50K/yr", req: "Any college level" },
      { brand: "New Balance", type: "Shoe Partner", value: "$2K–$30K/yr", req: "Any college level" },
      { brand: "Hoka", type: "Shoe Partner", value: "$2K–$25K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
    ],
    trendingTags: [{ tag: "#NikeXC", posts: "8.4K" }, { tag: "#NCAAs", posts: "9.2K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#XCNation", posts: "5.8K" }, { tag: "#StateChamps", posts: "12.4K" }],
    scouts: [{ name: "USATF", org: "National Federation", role: "Olympic development" }, { name: "MileSplit", org: "Rankings & News", role: "Top 100 recruits" }, { name: "NCAA XC", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "Nike Cross Nationals", location: "Portland, OR", date: "Dec 2026", level: "Elite" }, { name: "Foot Locker Nationals", location: "San Diego, CA", date: "Dec 2026", level: "Elite" }, { name: "Champs Sports XC", location: "Cary, NC", date: "Nov 2026", level: "National" }, { name: "Sunbelt XC Conference", location: "Multiple Sites", date: "Oct 2026", level: "Regional" }],
    positions: ["5K", "6K", "8K", "10K"],
    seedPosts: [
      { user: "Ethan Brooks", handle: "@ethan_xc", pos: "5K/8K · Loudoun Valley HS", content: "14:22 5K at Nike XC Regionals. Oregon and Stanford both reached out. #NikeXC", highlight: "14:22 5K — Regional Champion", likes: 2341, xScore: 93 },
    ],
  },
  {
    id: "rowing", name: "Rowing", emoji: "🚣", tagline: "PULL HARDER",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "200K+", label: "Competitive Rowers" }, { value: "400+", label: "College Programs" }, { value: "150+", label: "Countries" }, { value: "$150M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Concept2", type: "Equipment Partner", value: "$2K–$20K/yr", req: "National qualifier" },
      { brand: "Nike", type: "Apparel Partner", value: "$2K–$25K/yr", req: "D1 or elite" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$1K–$15K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
      { brand: "Strava", type: "Training Partner", value: "$1K–$10K/yr", req: "Any level" },
    ],
    trendingTags: [{ tag: "#USRowing", posts: "4.2K" }, { tag: "#NCAAs", posts: "6.1K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#RowingNIL", posts: "2.1K" }, { tag: "#HenleyRoyal", posts: "5.8K" }],
    scouts: [{ name: "US Rowing", org: "National Federation", role: "Olympic development" }, { name: "Row2K", org: "Rankings & News", role: "Top recruits" }, { name: "NCAA Rowing", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "US Rowing Youth Nationals", location: "Sarasota, FL", date: "Jun 2026", level: "Elite" }, { name: "Head of the Charles", location: "Boston, MA", date: "Oct 2026", level: "National" }, { name: "Henley Royal Regatta", location: "Henley-on-Thames, UK", date: "Jul 2026", level: "Elite" }, { name: "SRAA National Championship", location: "Multiple Sites", date: "Jun 2026", level: "National" }],
    positions: ["Single", "Double", "Four", "Eight", "Coxswain"],
    seedPosts: [
      { user: "Hannah Park", handle: "@hannah_rows", pos: "Stroke · Sarasota Crew", content: "Gold medal at US Rowing Youth Nationals. Yale and Princeton both offered. #USRowing", highlight: "Youth Nationals Gold Medal", likes: 1892, xScore: 92 },
    ],
  },
  {
    id: "water-polo", name: "Water Polo", emoji: "🤽", tagline: "MAKE A SPLASH",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "250K+", label: "Players" }, { value: "300+", label: "College Programs" }, { value: "80+", label: "Countries" }, { value: "$100M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Speedo", type: "Suit & Gear", value: "$1K–$15K/yr", req: "National qualifier" },
      { brand: "Nike", type: "Apparel Partner", value: "$1K–$15K/yr", req: "D1 or elite" },
      { brand: "Mikasa", type: "Ball Partner", value: "$1K–$8K/yr", req: "Any level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
      { brand: "TYR", type: "Gear Partner", value: "$1K–$10K/yr", req: "Any college level" },
    ],
    trendingTags: [{ tag: "#USAWaterPolo", posts: "3.8K" }, { tag: "#NCAAs", posts: "5.2K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#WaterPoloNIL", posts: "1.8K" }, { tag: "#JuniorOlympics", posts: "4.1K" }],
    scouts: [{ name: "USA Water Polo", org: "National Federation", role: "Olympic development" }, { name: "NCAA Water Polo", org: "College Recruiting", role: "Scholarship offers" }, { name: "Pro Club Scouts", org: "European Leagues", role: "Pro development" }],
    events: [{ name: "USA Water Polo Junior Olympics", location: "Multiple Sites", date: "Jul 2026", level: "Elite" }, { name: "NISCA Championships", location: "Multiple Sites", date: "Nov 2026", level: "National" }, { name: "Spring Fling", location: "Irvine, CA", date: "Mar 2026", level: "National" }, { name: "Holiday Classic", location: "Irvine, CA", date: "Dec 2026", level: "National" }],
    positions: ["GK", "2M", "Hole Set", "Wing", "Point", "Driver"],
    seedPosts: [
      { user: "Marco Silva", handle: "@marco_polo", pos: "2M · Newport Beach WPC", content: "5 goals at Junior Olympics. Stanford and USC both offered. #JuniorOlympics", highlight: "5 Goals · Junior Olympics", likes: 1541, xScore: 91 },
    ],
  },
  {
    id: "field-hockey", name: "Field Hockey", emoji: "🏑", tagline: "CONTROL THE FIELD",
    accentColor: "green", coverImg: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "3M+", label: "Players" }, { value: "400+", label: "College Programs" }, { value: "100+", label: "Countries" }, { value: "$150M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Grays", type: "Stick & Gear", value: "$1K–$20K/yr", req: "National qualifier or D1" },
      { brand: "Nike", type: "Apparel Partner", value: "$2K–$25K/yr", req: "D1 or elite" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$1K–$15K/yr", req: "Any college level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
      { brand: "Under Armour", type: "Apparel Partner", value: "$1K–$15K/yr", req: "Any college level" },
    ],
    trendingTags: [{ tag: "#USAFieldHockey", posts: "4.8K" }, { tag: "#NCAAs", posts: "6.2K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#FieldHockeyNIL", posts: "2.4K" }, { tag: "#JuniorPanAm", posts: "3.8K" }],
    scouts: [{ name: "USA Field Hockey", org: "National Federation", role: "Olympic development" }, { name: "Field Hockey Forum", org: "Rankings", role: "Top recruits" }, { name: "NCAA Field Hockey", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USA Field Hockey National Championships", location: "Multiple Sites", date: "Jul 2026", level: "Elite" }, { name: "NFHCA Showcase", location: "Multiple Sites", date: "Jun 2026", level: "National" }, { name: "Junior Pan American Games", location: "TBD", date: "Sep 2026", level: "Elite" }, { name: "Big East Showcase", location: "Multiple Sites", date: "Aug 2026", level: "National" }],
    positions: ["GK", "SW", "CB", "FB", "MF", "HF", "IF", "CF"],
    seedPosts: [
      { user: "Grace Williams", handle: "@grace_fh", pos: "MF · Hershey FHC", content: "Named to USA U21 squad. Maryland and UNC both offered full scholarships. #USAFieldHockey", highlight: "USA U21 Selection", likes: 1892, xScore: 92 },
    ],
  },
  {
    id: "cheer", name: "Cheerleading", emoji: "📣", tagline: "STUNT. TUMBLE. WIN.",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "4.5M+", label: "Athletes" }, { value: "2,000+", label: "Competitions" }, { value: "500+", label: "College Programs" }, { value: "$100M+", label: "Scholarships" }],
    nilDeals: [
      { brand: "Varsity Brands", type: "Uniform & Apparel", value: "$2K–$20K/yr", req: "College or elite club" },
      { brand: "Nike", type: "Brand Ambassador", value: "$2K–$30K/yr", req: "Any college level" },
      { brand: "Rebel Athletic", type: "Uniform Sponsor", value: "$1K–$10K/yr", req: "Any level" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level" },
      { brand: "GK Elite", type: "Apparel Partner", value: "$1K–$8K/yr", req: "Any level" },
    ],
    trendingTags: [{ tag: "#UCANationals", posts: "18.4K" }, { tag: "#NCACheer", posts: "12.1K" }, { tag: "#CheerNIL", posts: "8.9K" }, { tag: "#AllStar", posts: "22.4K" }, { tag: "#Committed", posts: "21.7K" }],
    scouts: [{ name: "Varsity Brands", org: "National Scouting", role: "Elite camp invites" }, { name: "NCA", org: "National Cheerleaders Association", role: "All-Star rankings" }, { name: "NCAA Cheer", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "UCA National High School Championships", location: "Orlando, FL", date: "Feb 2026", level: "Elite" }, { name: "NCA All-Star National Championship", location: "Dallas, TX", date: "Apr 2026", level: "National" }, { name: "ESPN Wide World of Sports Classic", location: "Orlando, FL", date: "Feb 2026", level: "National" }, { name: "Cheersport Nationals", location: "Atlanta, GA", date: "Feb 2026", level: "National" }],
    positions: ["Flyer", "Base", "Back Spot", "Tumbler", "Stunter", "All-Around"],
    seedPosts: [
      { user: "Brianna Lee", handle: "@bri_cheer", pos: "Flyer · Top Gun All Stars", content: "UCA All-American selection confirmed. Alabama offer on the table. #UCANationals", highlight: "UCA All-American", likes: 2891, xScore: 90 },
    ],
  },
  // ─── Sports 22–44 ─────────────────────────────────────────────────────────────
  {
    id: "boxing", name: "Boxing", emoji: "🥊", tagline: "FIGHT FOR YOUR FUTURE",
    accentColor: "red", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "35M+", label: "Boxers" }, { value: "500+", label: "Gyms" }, { value: "200+", label: "Countries" }, { value: "$500M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Everlast", type: "Gear Partner", value: "$2K–$50K/yr", req: "National qualifier" }, { brand: "Cleto Reyes", type: "Glove Partner", value: "$2K–$30K/yr", req: "Elite amateur" }, { brand: "Nike", type: "Apparel Partner", value: "$3K–$40K/yr", req: "National team" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Hayabusa", type: "Gear Sponsor", value: "$1K–$20K/yr", req: "Any level" }],
    trendingTags: [{ tag: "#USABoxing", posts: "8.4K" }, { tag: "#OlympicTrials", posts: "12.1K" }, { tag: "#BoxingNIL", posts: "4.2K" }, { tag: "#GoldenGloves", posts: "9.8K" }, { tag: "#ProDebut", posts: "6.4K" }],
    scouts: [{ name: "USA Boxing", org: "National Federation", role: "Olympic development" }, { name: "Golden Gloves", org: "Amateur Boxing", role: "National rankings" }, { name: "Top Rank", org: "Pro Boxing", role: "Pro prospects" }],
    events: [{ name: "USA Boxing National Championships", location: "Multiple Sites", date: "Nov 2026", level: "Elite" }, { name: "Golden Gloves Nationals", location: "Multiple Sites", date: "May 2026", level: "National" }, { name: "Olympic Trials", location: "TBD", date: "2028", level: "Elite" }, { name: "Junior Olympic Championships", location: "Multiple Sites", date: "Aug 2026", level: "National" }],
    positions: ["Light Flyweight", "Flyweight", "Bantamweight", "Featherweight", "Lightweight", "Welterweight", "Middleweight", "Heavyweight"],
    seedPosts: [{ user: "Marcus King", handle: "@marcus_boxing", pos: "Welterweight · Colorado Springs OTC", content: "Gold medal at USA Boxing Nationals. Olympic Trials next. #USABoxing", highlight: "USA Boxing National Champion", likes: 3102, xScore: 94 }],
  },
  {
    id: "mma", name: "MMA", emoji: "🥋", tagline: "TRAIN. COMPETE. DOMINATE.",
    accentColor: "red", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "450M+", label: "Fans Worldwide" }, { value: "5,000+", label: "Gyms" }, { value: "150+", label: "Countries" }, { value: "$1B+", label: "Market" }],
    nilDeals: [{ brand: "Hayabusa", type: "Gear Partner", value: "$2K–$30K/yr", req: "Regional champion" }, { brand: "Venum", type: "Apparel Partner", value: "$2K–$25K/yr", req: "Any pro level" }, { brand: "Reebok", type: "Brand Ambassador", value: "$3K–$40K/yr", req: "UFC contract" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Monster Energy", type: "Sponsor", value: "$5K–$100K/yr", req: "Pro fighter" }],
    trendingTags: [{ tag: "#UFC", posts: "45.2K" }, { tag: "#Bellator", posts: "12.4K" }, { tag: "#MMANIL", posts: "5.8K" }, { tag: "#ProDebut", posts: "8.1K" }, { tag: "#Contender", posts: "6.4K" }],
    scouts: [{ name: "UFC Performance Institute", org: "Pro Development", role: "Scouting prospects" }, { name: "Bellator MMA", org: "Pro Scouting", role: "Contract offers" }, { name: "IMMAF", org: "Amateur MMA", role: "World rankings" }],
    events: [{ name: "IMMAF World Championships", location: "Abu Dhabi, UAE", date: "Nov 2026", level: "Elite" }, { name: "UFC Contender Series", location: "Las Vegas, NV", date: "Sep 2026", level: "Elite" }, { name: "Bellator Amateur Series", location: "Multiple Sites", date: "Year-Round", level: "National" }, { name: "NAGA Championships", location: "Multiple Sites", date: "Year-Round", level: "National" }],
    positions: ["Strawweight", "Flyweight", "Bantamweight", "Featherweight", "Lightweight", "Welterweight", "Middleweight", "Light Heavyweight", "Heavyweight"],
    seedPosts: [{ user: "Javier Cruz", handle: "@javier_mma", pos: "Welterweight · AKA", content: "Submitted my opponent in round 1 at the regional championships. UFC scouts in attendance. #UFC", highlight: "R1 Submission Win", likes: 4102, xScore: 92 }],
  },
  {
    id: "badminton", name: "Badminton", emoji: "🏸", tagline: "SMASH YOUR LIMITS",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "220M+", label: "Players" }, { value: "500+", label: "College Programs" }, { value: "200+", label: "Countries" }, { value: "$200M+", label: "Market" }],
    nilDeals: [{ brand: "Yonex", type: "Racket & Gear", value: "$2K–$30K/yr", req: "National ranked" }, { brand: "Li-Ning", type: "Apparel Partner", value: "$2K–$20K/yr", req: "Any college level" }, { brand: "Victor", type: "Gear Partner", value: "$1K–$15K/yr", req: "Any level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Adidas", type: "Brand Ambassador", value: "$2K–$20K/yr", req: "Any college level" }],
    trendingTags: [{ tag: "#USABadminton", posts: "3.8K" }, { tag: "#BWFWorldTour", posts: "12.4K" }, { tag: "#BadmintonNIL", posts: "2.1K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#NCAAs", posts: "4.8K" }],
    scouts: [{ name: "USA Badminton", org: "National Federation", role: "Olympic development" }, { name: "BWF", org: "World Federation", role: "Global rankings" }, { name: "NCAA Badminton", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USA Badminton Nationals", location: "Multiple Sites", date: "Jun 2026", level: "Elite" }, { name: "US Open Grand Prix", location: "Fullerton, CA", date: "Oct 2026", level: "National" }, { name: "Pan Am Badminton Championships", location: "TBD", date: "Aug 2026", level: "Elite" }, { name: "Junior National Championships", location: "Multiple Sites", date: "Jul 2026", level: "National" }],
    positions: ["Singles", "Doubles", "Mixed Doubles"],
    seedPosts: [{ user: "Kevin Zhang", handle: "@kevin_badminton", pos: "Singles · USA Badminton", content: "Won the US Open Grand Prix. BWF ranking climbed to top 100 worldwide. #USABadminton", highlight: "US Open Grand Prix Champion", likes: 1892, xScore: 91 }],
  },
  {
    id: "table-tennis", name: "Table Tennis", emoji: "🏓", tagline: "SPIN TO WIN",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "300M+", label: "Players" }, { value: "400+", label: "College Programs" }, { value: "200+", label: "Countries" }, { value: "$150M+", label: "Market" }],
    nilDeals: [{ brand: "Butterfly", type: "Equipment Partner", value: "$2K–$20K/yr", req: "National ranked" }, { brand: "Stiga", type: "Gear Partner", value: "$1K–$15K/yr", req: "Any level" }, { brand: "DHS", type: "Ball & Gear", value: "$1K–$10K/yr", req: "Any level" }, { brand: "Joola", type: "Equipment Partner", value: "$1K–$12K/yr", req: "Any level" }, { brand: "Adidas", type: "Apparel Partner", value: "$1K–$15K/yr", req: "Any college level" }],
    trendingTags: [{ tag: "#USATTableTennis", posts: "3.2K" }, { tag: "#ITTFWorldTour", posts: "8.4K" }, { tag: "#TableTennisNIL", posts: "1.8K" }, { tag: "#NCAAs", posts: "3.8K" }, { tag: "#OlympicTrials", posts: "5.2K" }],
    scouts: [{ name: "USA Table Tennis", org: "National Federation", role: "Olympic development" }, { name: "ITTF", org: "World Federation", role: "Global rankings" }, { name: "NCAA Table Tennis", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "US Open Table Tennis Championships", location: "Las Vegas, NV", date: "Dec 2026", level: "Elite" }, { name: "USA TT Nationals", location: "Multiple Sites", date: "Jul 2026", level: "National" }, { name: "ITTF Americas Championships", location: "TBD", date: "Sep 2026", level: "Elite" }, { name: "Junior National Championships", location: "Multiple Sites", date: "Jun 2026", level: "National" }],
    positions: ["Singles", "Doubles", "Mixed Doubles"],
    seedPosts: [{ user: "Lin Wei", handle: "@lin_tt", pos: "Singles · USA TT", content: "ITTF ranking cracked top 200 worldwide. Olympic Trials next year. #USATTableTennis", highlight: "ITTF Top 200 Worldwide", likes: 1541, xScore: 90 }],
  },
  {
    id: "archery", name: "Archery", emoji: "🏹", tagline: "AIM. RELEASE. SCORE.",
    accentColor: "green", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "60M+", label: "Archers" }, { value: "300+", label: "College Programs" }, { value: "150+", label: "Countries" }, { value: "$100M+", label: "Market" }],
    nilDeals: [{ brand: "Hoyt", type: "Bow Partner", value: "$2K–$20K/yr", req: "National qualifier" }, { brand: "Easton", type: "Arrow Partner", value: "$1K–$15K/yr", req: "Any level" }, { brand: "Win&Win", type: "Gear Partner", value: "$1K–$12K/yr", req: "Any level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Under Armour", type: "Apparel Partner", value: "$1K–$15K/yr", req: "Any college level" }],
    trendingTags: [{ tag: "#USAArchery", posts: "3.8K" }, { tag: "#WorldArchery", posts: "6.2K" }, { tag: "#ArcheryNIL", posts: "1.8K" }, { tag: "#OlympicTrials", posts: "5.4K" }, { tag: "#NCAAs", posts: "3.1K" }],
    scouts: [{ name: "USA Archery", org: "National Federation", role: "Olympic development" }, { name: "World Archery", org: "World Federation", role: "Global rankings" }, { name: "NCAA Archery", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USA Archery Indoor Nationals", location: "Multiple Sites", date: "Feb 2026", level: "Elite" }, { name: "USA Archery Outdoor Nationals", location: "Multiple Sites", date: "Jul 2026", level: "National" }, { name: "World Archery Youth Championships", location: "TBD", date: "Aug 2026", level: "Elite" }, { name: "JOAD Nationals", location: "Multiple Sites", date: "Jul 2026", level: "National" }],
    positions: ["Recurve", "Compound", "Barebow", "Longbow"],
    seedPosts: [{ user: "Sarah Kim", handle: "@sarah_archery", pos: "Recurve · USA Archery", content: "Perfect 300 round at USA Indoor Nationals. Olympic Trials qualification secured. #USAArchery", highlight: "Perfect 300 Round", likes: 1892, xScore: 93 }],
  },
  {
    id: "fencing", name: "Fencing", emoji: "🤺", tagline: "TOUCH. SCORE. WIN.",
    accentColor: "silver", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "1M+", label: "Fencers" }, { value: "300+", label: "College Programs" }, { value: "150+", label: "Countries" }, { value: "$80M+", label: "Market" }],
    nilDeals: [{ brand: "Leon Paul", type: "Equipment Partner", value: "$2K–$20K/yr", req: "National qualifier" }, { brand: "Absolute Fencing", type: "Gear Partner", value: "$1K–$15K/yr", req: "Any level" }, { brand: "Nike", type: "Apparel Partner", value: "$2K–$20K/yr", req: "D1 or national team" }, { brand: "Adidas", type: "Brand Ambassador", value: "$1K–$15K/yr", req: "Any college level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }],
    trendingTags: [{ tag: "#USAFencing", posts: "3.2K" }, { tag: "#FIEWorldCup", posts: "5.8K" }, { tag: "#FencingNIL", posts: "1.4K" }, { tag: "#NCAAs", posts: "3.8K" }, { tag: "#OlympicTrials", posts: "4.2K" }],
    scouts: [{ name: "USA Fencing", org: "National Federation", role: "Olympic development" }, { name: "FIE", org: "World Federation", role: "Global rankings" }, { name: "NCAA Fencing", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USA Fencing Summer Nationals", location: "Multiple Sites", date: "Jul 2026", level: "Elite" }, { name: "FIE World Cup", location: "Multiple Cities", date: "Year-Round", level: "Elite" }, { name: "Junior Olympics", location: "Multiple Sites", date: "Mar 2026", level: "National" }, { name: "NCAA Championships", location: "Multiple Sites", date: "Mar 2026", level: "National" }],
    positions: ["Foil", "Épée", "Sabre"],
    seedPosts: [{ user: "Isabelle Dumont", handle: "@isabelle_fencing", pos: "Foil · New York Athletic Club", content: "FIE World Cup silver medal. Columbia and Princeton both offered. #USAFencing", highlight: "FIE World Cup Silver", likes: 1541, xScore: 92 }],
  },
  {
    id: "weightlifting", name: "Weightlifting", emoji: "🏋️", tagline: "LIFT HEAVY. LIFT OFTEN.",
    accentColor: "red", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "2M+", label: "Competitive Lifters" }, { value: "200+", label: "Programs" }, { value: "180+", label: "Countries" }, { value: "$100M+", label: "Market" }],
    nilDeals: [{ brand: "Eleiko", type: "Equipment Partner", value: "$2K–$20K/yr", req: "National qualifier" }, { brand: "Nike", type: "Apparel Partner", value: "$2K–$25K/yr", req: "National team" }, { brand: "Adidas", type: "Shoe Partner", value: "$2K–$20K/yr", req: "Any elite level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Rogue", type: "Equipment Partner", value: "$1K–$15K/yr", req: "Any level" }],
    trendingTags: [{ tag: "#USAWeightlifting", posts: "4.8K" }, { tag: "#IWFWorldChamps", posts: "8.2K" }, { tag: "#WeightliftingNIL", posts: "2.1K" }, { tag: "#OlympicTrials", posts: "6.4K" }, { tag: "#PRAlert", posts: "9.8K" }],
    scouts: [{ name: "USA Weightlifting", org: "National Federation", role: "Olympic development" }, { name: "IWF", org: "World Federation", role: "Global rankings" }, { name: "CrossFit Games", org: "Functional Fitness", role: "Elite prospects" }],
    events: [{ name: "USA Weightlifting Nationals", location: "Multiple Sites", date: "Dec 2026", level: "Elite" }, { name: "IWF World Championships", location: "TBD", date: "Nov 2026", level: "Elite" }, { name: "Pan American Championships", location: "TBD", date: "Aug 2026", level: "Elite" }, { name: "Junior National Championships", location: "Multiple Sites", date: "Jun 2026", level: "National" }],
    positions: ["55kg", "61kg", "67kg", "73kg", "81kg", "89kg", "96kg", "102kg", "109kg", "+109kg"],
    seedPosts: [{ user: "Darius Johnson", handle: "@darius_lifts", pos: "89kg · USOTC", content: "Clean & Jerk PR of 185kg at USA Nationals. Olympic Trials qualification confirmed. #USAWeightlifting", highlight: "185kg C&J — National Record", likes: 3102, xScore: 95 }],
  },
  {
    id: "cycling", name: "Cycling", emoji: "🚴", tagline: "RIDE FASTER. GO FURTHER.",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "1B+", label: "Cyclists Worldwide" }, { value: "500+", label: "Pro Teams" }, { value: "200+", label: "Countries" }, { value: "$500M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Trek", type: "Bike Partner", value: "$5K–$100K/yr", req: "National team or pro" }, { brand: "Specialized", type: "Bike & Gear", value: "$5K–$80K/yr", req: "Elite amateur or pro" }, { brand: "Rapha", type: "Kit Partner", value: "$2K–$30K/yr", req: "Any elite level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Garmin", type: "Tech Partner", value: "$2K–$20K/yr", req: "Any elite level" }],
    trendingTags: [{ tag: "#USACycling", posts: "5.8K" }, { tag: "#TourDeFrance", posts: "28.4K" }, { tag: "#CyclingNIL", posts: "3.2K" }, { tag: "#OlympicTrack", posts: "6.4K" }, { tag: "#ProTour", posts: "12.1K" }],
    scouts: [{ name: "USA Cycling", org: "National Federation", role: "Olympic development" }, { name: "UCI", org: "World Federation", role: "Global rankings" }, { name: "Pro Team Scouts", org: "WorldTour Teams", role: "Pro contracts" }],
    events: [{ name: "USA Cycling Road Nationals", location: "Multiple Sites", date: "Jun 2026", level: "Elite" }, { name: "USA Cycling Track Nationals", location: "Multiple Sites", date: "Aug 2026", level: "National" }, { name: "Junior Pan Am Championships", location: "TBD", date: "Sep 2026", level: "Elite" }, { name: "Redlands Classic", location: "Redlands, CA", date: "Apr 2026", level: "National" }],
    positions: ["Road", "Track", "Mountain", "BMX", "Cyclocross"],
    seedPosts: [{ user: "Tyler Evans", handle: "@tyler_cycling", pos: "Road · USA Cycling U23", content: "Stage win at the Redlands Classic. WorldTour team interest confirmed. #USACycling", highlight: "Redlands Classic Stage Win", likes: 2341, xScore: 93 }],
  },
  {
    id: "equestrian", name: "Equestrian", emoji: "🏇", tagline: "RIDE TO WIN",
    accentColor: "brown", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "110M+", label: "Riders Worldwide" }, { value: "400+", label: "College Programs" }, { value: "130+", label: "Countries" }, { value: "$300M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Ariat", type: "Boot & Apparel", value: "$2K–$25K/yr", req: "National qualifier" }, { brand: "Pikeur", type: "Apparel Partner", value: "$2K–$20K/yr", req: "Any elite level" }, { brand: "Horseware", type: "Equipment Partner", value: "$1K–$15K/yr", req: "Any level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "SmartPak", type: "Supplement Partner", value: "$1K–$10K/yr", req: "Any level" }],
    trendingTags: [{ tag: "#USAEquestrian", posts: "4.8K" }, { tag: "#WEG", posts: "8.2K" }, { tag: "#EquestrianNIL", posts: "2.4K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#NCAAs", posts: "3.8K" }],
    scouts: [{ name: "USEF", org: "National Federation", role: "Olympic development" }, { name: "FEI", org: "World Federation", role: "Global rankings" }, { name: "NCAA Equestrian", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USEF Pony Finals", location: "Lexington, KY", date: "Aug 2026", level: "Elite" }, { name: "USEF National Championships", location: "Multiple Sites", date: "Year-Round", level: "National" }, { name: "WEF Winter Equestrian Festival", location: "Wellington, FL", date: "Jan–Apr 2026", level: "Elite" }, { name: "ASPCA Maclay Finals", location: "Lexington, KY", date: "Nov 2026", level: "National" }],
    positions: ["Hunter", "Jumper", "Dressage", "Eventing", "Western"],
    seedPosts: [{ user: "Emma Hartley", handle: "@emma_equestrian", pos: "Hunter/Jumper · Beacon Hill", content: "Champion in the USEF Pony Finals. Oklahoma and Auburn both offered. #USAEquestrian", highlight: "USEF Pony Finals Champion", likes: 1892, xScore: 91 }],
  },
  {
    id: "skiing", name: "Skiing", emoji: "⛷️", tagline: "CARVE YOUR PATH",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "200M+", label: "Skiers Worldwide" }, { value: "300+", label: "College Programs" }, { value: "100+", label: "Countries" }, { value: "$400M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Head", type: "Ski & Gear", value: "$3K–$50K/yr", req: "National team or FIS" }, { brand: "Rossignol", type: "Ski Partner", value: "$3K–$40K/yr", req: "Elite amateur" }, { brand: "Atomic", type: "Equipment Partner", value: "$2K–$30K/yr", req: "Any elite level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Red Bull", type: "Energy Partner", value: "$5K–$100K/yr", req: "Elite/pro level" }],
    trendingTags: [{ tag: "#USSkiTeam", posts: "6.8K" }, { tag: "#FISWorldCup", posts: "12.4K" }, { tag: "#SkiingNIL", posts: "3.2K" }, { tag: "#OlympicTrials", posts: "8.4K" }, { tag: "#NCAAs", posts: "4.8K" }],
    scouts: [{ name: "US Ski & Snowboard", org: "National Federation", role: "Olympic development" }, { name: "FIS", org: "World Federation", role: "Global rankings" }, { name: "NCAA Skiing", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "US Alpine Championships", location: "Sugarloaf, ME", date: "Apr 2026", level: "Elite" }, { name: "FIS World Cup", location: "Multiple Sites", date: "Nov–Mar", level: "Elite" }, { name: "Junior World Championships", location: "TBD", date: "Feb 2026", level: "Elite" }, { name: "NCAA Championships", location: "Multiple Sites", date: "Mar 2026", level: "National" }],
    positions: ["Slalom", "Giant Slalom", "Super-G", "Downhill", "Combined", "Freestyle"],
    seedPosts: [{ user: "Jackson Reed", handle: "@jackson_ski", pos: "GS/SL · US Ski Team Dev", content: "FIS points ranking cracked top 50 in GS. Colorado and Vermont both offered. #USSkiTeam", highlight: "FIS Top 50 Giant Slalom", likes: 2102, xScore: 92 }],
  },
  {
    id: "snowboarding", name: "Snowboarding", emoji: "🏂", tagline: "RIDE THE MOUNTAIN",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "25M+", label: "Snowboarders" }, { value: "200+", label: "Programs" }, { value: "80+", label: "Countries" }, { value: "$250M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Burton", type: "Board & Gear", value: "$3K–$50K/yr", req: "National team or FIS" }, { brand: "Lib Tech", type: "Board Partner", value: "$2K–$30K/yr", req: "Elite amateur" }, { brand: "Red Bull", type: "Energy Partner", value: "$5K–$100K/yr", req: "Elite/pro level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Nike", type: "Apparel Partner", value: "$3K–$40K/yr", req: "National team" }],
    trendingTags: [{ tag: "#USSnowboarding", posts: "5.8K" }, { tag: "#XGames", posts: "18.4K" }, { tag: "#SnowboardingNIL", posts: "3.2K" }, { tag: "#OlympicTrials", posts: "7.4K" }, { tag: "#Halfpipe", posts: "6.8K" }],
    scouts: [{ name: "US Ski & Snowboard", org: "National Federation", role: "Olympic development" }, { name: "FIS", org: "World Federation", role: "Global rankings" }, { name: "X Games", org: "Action Sports", role: "Invite-only events" }],
    events: [{ name: "US Open Snowboarding Championships", location: "Stratton, VT", date: "Mar 2026", level: "Elite" }, { name: "X Games Aspen", location: "Aspen, CO", date: "Jan 2026", level: "Elite" }, { name: "FIS World Cup", location: "Multiple Sites", date: "Nov–Mar", level: "Elite" }, { name: "Junior World Championships", location: "TBD", date: "Mar 2026", level: "Elite" }],
    positions: ["Halfpipe", "Slopestyle", "Big Air", "Parallel GS", "Boardercross"],
    seedPosts: [{ user: "Zoe Parker", handle: "@zoe_snowboard", pos: "Halfpipe · US Snowboard Team", content: "X Games bronze in halfpipe. Olympic Trials next. #XGames", highlight: "X Games Bronze Medal", likes: 3892, xScore: 94 }],
  },
  {
    id: "triathlon", name: "Triathlon", emoji: "🏊", tagline: "SWIM. BIKE. RUN.",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "3.5M+", label: "Triathletes" }, { value: "300+", label: "Programs" }, { value: "150+", label: "Countries" }, { value: "$200M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Cervelo", type: "Bike Partner", value: "$3K–$30K/yr", req: "Elite amateur or pro" }, { brand: "Speedo", type: "Swim Gear", value: "$1K–$15K/yr", req: "Any elite level" }, { brand: "Hoka", type: "Run Shoe Partner", value: "$2K–$20K/yr", req: "Any college level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Garmin", type: "Tech Partner", value: "$2K–$20K/yr", req: "Any elite level" }],
    trendingTags: [{ tag: "#USATriathlon", posts: "4.8K" }, { tag: "#Ironman", posts: "18.4K" }, { tag: "#TriathlonNIL", posts: "2.4K" }, { tag: "#OlympicTrials", posts: "5.8K" }, { tag: "#70.3", posts: "9.2K" }],
    scouts: [{ name: "USA Triathlon", org: "National Federation", role: "Olympic development" }, { name: "World Triathlon", org: "World Federation", role: "Global rankings" }, { name: "Ironman", org: "Pro Circuit", role: "Pro contracts" }],
    events: [{ name: "USA Triathlon Age Group Nationals", location: "Milwaukee, WI", date: "Aug 2026", level: "Elite" }, { name: "World Triathlon Championship Series", location: "Multiple Cities", date: "Year-Round", level: "Elite" }, { name: "Ironman World Championship", location: "Kona, HI", date: "Oct 2026", level: "Elite" }, { name: "Junior Pan Am Championships", location: "TBD", date: "Sep 2026", level: "Elite" }],
    positions: ["Sprint", "Olympic", "70.3", "Ironman", "Duathlon"],
    seedPosts: [{ user: "Mia Torres", handle: "@mia_tri", pos: "Olympic Distance · USA Triathlon", content: "World Triathlon Series top 10 finish. Olympic Trials qualification confirmed. #USATriathlon", highlight: "WTS Top 10 Finish", likes: 2341, xScore: 93 }],
  },
  {
    id: "beach-volleyball", name: "Beach Volleyball", emoji: "🏖️", tagline: "SAND. SUN. SPIKE.",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "500M+", label: "Fans Worldwide" }, { value: "500+", label: "College Programs" }, { value: "150+", label: "Countries" }, { value: "$300M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Mizuno", type: "Gear Partner", value: "$2K–$25K/yr", req: "AVP or D1" }, { brand: "Nike", type: "Apparel Partner", value: "$3K–$35K/yr", req: "D1 or elite" }, { brand: "Oakley", type: "Eyewear Partner", value: "$2K–$20K/yr", req: "Any elite level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Asics", type: "Shoe Partner", value: "$2K–$20K/yr", req: "Any college level" }],
    trendingTags: [{ tag: "#AVPTour", posts: "8.4K" }, { tag: "#NCAAs", posts: "6.2K" }, { tag: "#BeachVBNIL", posts: "3.8K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#OlympicTrials", posts: "5.8K" }],
    scouts: [{ name: "USAV Beach", org: "National Federation", role: "Olympic development" }, { name: "AVP Tour", org: "Pro Circuit", role: "Pro contracts" }, { name: "NCAA Beach VB", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "AVP Gold Series", location: "Multiple Sites", date: "May–Aug 2026", level: "Elite" }, { name: "USAV Beach Nationals", location: "Multiple Sites", date: "Jun 2026", level: "National" }, { name: "NCAA Beach Volleyball Championship", location: "Gulf Shores, AL", date: "May 2026", level: "National" }, { name: "FIVB World Tour", location: "Multiple Cities", date: "Year-Round", level: "Elite" }],
    positions: ["Blocker", "Defender"],
    seedPosts: [{ user: "Jade Williams", handle: "@jade_beach", pos: "Blocker · AVP Pro", content: "AVP Gold Series win in Hermosa Beach. Olympic Trials qualification confirmed. #AVPTour", highlight: "AVP Gold Series Champion", likes: 3102, xScore: 94 }],
  },
  {
    id: "dance", name: "Dance", emoji: "💃", tagline: "MOVE. PERFORM. WIN.",
    accentColor: "purple", coverImg: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "5M+", label: "Competitive Dancers" }, { value: "1,000+", label: "College Programs" }, { value: "100+", label: "Countries" }, { value: "$150M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Capezio", type: "Shoe & Apparel", value: "$1K–$15K/yr", req: "National qualifier" }, { brand: "Nike", type: "Apparel Partner", value: "$2K–$20K/yr", req: "D1 or elite" }, { brand: "Bloch", type: "Shoe Partner", value: "$1K–$12K/yr", req: "Any level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Varsity Brands", type: "Uniform Partner", value: "$1K–$10K/yr", req: "Any college level" }],
    trendingTags: [{ tag: "#NDANationals", posts: "9.4K" }, { tag: "#NCAAs", posts: "6.8K" }, { tag: "#DanceNIL", posts: "3.2K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#DanceTeam", posts: "8.4K" }],
    scouts: [{ name: "NDA", org: "National Dance Association", role: "All-Star rankings" }, { name: "UDA", org: "Universal Dance Association", role: "Camp invites" }, { name: "NCAA Dance", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "NDA National Championships", location: "Daytona Beach, FL", date: "Apr 2026", level: "Elite" }, { name: "UDA College Nationals", location: "Orlando, FL", date: "Jan 2026", level: "National" }, { name: "NFHS Dance Championships", location: "Multiple Sites", date: "Mar 2026", level: "National" }, { name: "Spirit Celebration Nationals", location: "Multiple Sites", date: "Apr 2026", level: "National" }],
    positions: ["Jazz", "Hip Hop", "Pom", "Kick", "Contemporary", "Ballet", "All-Around"],
    seedPosts: [{ user: "Alexis Monroe", handle: "@alexis_dance", pos: "Jazz/Hip Hop · Top Gun", content: "NDA All-American selection. UCLA and Alabama both offered full rides. #NDANationals", highlight: "NDA All-American", likes: 2891, xScore: 91 }],
  },
  {
    id: "esports", name: "Esports", emoji: "🎮", tagline: "GAME. WIN. REPEAT.",
    accentColor: "purple", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "3.2B+", label: "Gamers Worldwide" }, { value: "200+", label: "College Programs" }, { value: "100+", label: "Countries" }, { value: "$2B+", label: "NIL Market" }],
    nilDeals: [{ brand: "Razer", type: "Peripheral Partner", value: "$3K–$50K/yr", req: "Collegiate or pro" }, { brand: "HyperX", type: "Gear Sponsor", value: "$2K–$30K/yr", req: "Any college level" }, { brand: "Red Bull", type: "Energy Partner", value: "$5K–$100K/yr", req: "Pro/streaming" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Logitech G", type: "Equipment Partner", value: "$2K–$25K/yr", req: "Any college level" }],
    trendingTags: [{ tag: "#CollegiateEsports", posts: "14.2K" }, { tag: "#NACE", posts: "8.4K" }, { tag: "#EsportsNIL", posts: "9.8K" }, { tag: "#Scholarship", posts: "12.4K" }, { tag: "#ProPath", posts: "6.8K" }],
    scouts: [{ name: "NACE", org: "Collegiate Esports", role: "Scholarship programs" }, { name: "Riot Games", org: "Pro Scouting", role: "LCS/LCK prospects" }, { name: "Activision Blizzard", org: "Pro Scouting", role: "CDL/OWL prospects" }],
    events: [{ name: "NACE Starleague Championships", location: "Online/Multiple Sites", date: "Apr 2026", level: "National" }, { name: "Collegiate Rocket League Championship", location: "Online", date: "May 2026", level: "National" }, { name: "EVO Championship Series", location: "Las Vegas, NV", date: "Aug 2026", level: "Elite" }, { name: "Varsity Esports Foundation Tournament", location: "Online", date: "Year-Round", level: "National" }],
    positions: ["Top Lane", "Jungle", "Mid Lane", "Bot Lane", "Support", "IGL", "Entry Fragger", "AWPer", "Flex"],
    seedPosts: [{ user: "Ryan Chen", handle: "@ryan_esports", pos: "Mid Lane · Ohio State Esports", content: "NACE Starleague champion. Riot Games scouting call confirmed. #CollegiateEsports", highlight: "NACE Starleague Champion", likes: 5102, xScore: 93 }],
  },
  {
    id: "pickleball", name: "Pickleball", emoji: "🏓", tagline: "DINK. DRIVE. WIN.",
    accentColor: "green", coverImg: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "36M+", label: "Players" }, { value: "200+", label: "Programs" }, { value: "70+", label: "Countries" }, { value: "$500M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Selkirk", type: "Paddle Partner", value: "$2K–$30K/yr", req: "Pro or elite amateur" }, { brand: "Franklin", type: "Ball & Gear", value: "$1K–$15K/yr", req: "Any level" }, { brand: "Nike", type: "Apparel Partner", value: "$2K–$25K/yr", req: "Pro level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Joola", type: "Equipment Partner", value: "$2K–$20K/yr", req: "Pro or elite" }],
    trendingTags: [{ tag: "#MLP", posts: "12.4K" }, { tag: "#USAPickleball", posts: "8.8K" }, { tag: "#PickleballNIL", posts: "6.4K" }, { tag: "#ProPickleball", posts: "9.2K" }, { tag: "#NationalChamps", posts: "5.8K" }],
    scouts: [{ name: "USA Pickleball", org: "National Federation", role: "National rankings" }, { name: "MLP", org: "Major League Pickleball", role: "Pro draft" }, { name: "PPA Tour", org: "Pro Circuit", role: "Pro contracts" }],
    events: [{ name: "USA Pickleball National Championships", location: "Indian Wells, CA", date: "Nov 2026", level: "Elite" }, { name: "PPA Tour Finals", location: "Las Vegas, NV", date: "Dec 2026", level: "Elite" }, { name: "MLP Draft", location: "Multiple Sites", date: "Jan 2026", level: "Elite" }, { name: "US Open Pickleball Championships", location: "Naples, FL", date: "Apr 2026", level: "National" }],
    positions: ["Singles", "Doubles", "Mixed Doubles"],
    seedPosts: [{ user: "Anna Lee", handle: "@anna_pickle", pos: "Pro · PPA Tour", content: "PPA Tour gold medal in singles. MLP draft pick #3 overall. #MLP", highlight: "PPA Tour Gold · MLP #3 Pick", likes: 4102, xScore: 95 }],
  },
  {
    id: "paddle-tennis", name: "Paddle Tennis", emoji: "🎾", tagline: "POWER THE COURT",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "25M+", label: "Players" }, { value: "100+", label: "Programs" }, { value: "50+", label: "Countries" }, { value: "$100M+", label: "Market" }],
    nilDeals: [{ brand: "Head", type: "Paddle & Gear", value: "$1K–$15K/yr", req: "National ranked" }, { brand: "Adidas", type: "Apparel Partner", value: "$1K–$12K/yr", req: "Any level" }, { brand: "Wilson", type: "Gear Partner", value: "$1K–$10K/yr", req: "Any level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }, { brand: "Nike", type: "Apparel Partner", value: "$1K–$15K/yr", req: "Any college level" }],
    trendingTags: [{ tag: "#USAPaddleTennis", posts: "2.8K" }, { tag: "#NationalChamps", posts: "3.4K" }, { tag: "#PaddleNIL", posts: "1.4K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#ProPaddle", posts: "2.1K" }],
    scouts: [{ name: "USAPT", org: "National Federation", role: "National rankings" }, { name: "World Padel Tour", org: "Pro Circuit", role: "Pro contracts" }, { name: "NCAA Paddle", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USA Paddle Tennis Nationals", location: "Multiple Sites", date: "Oct 2026", level: "Elite" }, { name: "World Padel Tour Finals", location: "Multiple Cities", date: "Dec 2026", level: "Elite" }, { name: "Junior National Championships", location: "Multiple Sites", date: "Jul 2026", level: "National" }, { name: "Regional Championships", location: "Multiple Sites", date: "Year-Round", level: "Regional" }],
    positions: ["Singles", "Doubles"],
    seedPosts: [{ user: "Carlos Ruiz", handle: "@carlos_paddle", pos: "Doubles · World Padel Tour", content: "World Padel Tour top 50 ranking achieved. Sponsorship calls coming in. #USAPaddleTennis", highlight: "World Padel Tour Top 50", likes: 1541, xScore: 90 }],
  },
  {
    id: "surfing", name: "Surfing", emoji: "🏄", tagline: "RIDE THE WAVE",
    accentColor: "blue", coverImg: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "35M+", label: "Surfers Worldwide" }, { value: "100+", label: "Programs" }, { value: "80+", label: "Countries" }, { value: "$400M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Quiksilver", type: "Apparel & Gear", value: "$3K–$50K/yr", req: "CT or elite QS" }, { brand: "Rip Curl", type: "Wetsuit & Gear", value: "$3K–$40K/yr", req: "Elite amateur" }, { brand: "Billabong", type: "Apparel Partner", value: "$2K–$30K/yr", req: "Any elite level" }, { brand: "Red Bull", type: "Energy Partner", value: "$5K–$100K/yr", req: "Elite/pro level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }],
    trendingTags: [{ tag: "#WSLChampionship", posts: "18.4K" }, { tag: "#USASurfing", posts: "6.8K" }, { tag: "#SurfingNIL", posts: "4.2K" }, { tag: "#OlympicTrials", posts: "7.8K" }, { tag: "#QS", posts: "9.4K" }],
    scouts: [{ name: "WSL", org: "World Surf League", role: "CT qualification" }, { name: "USA Surfing", org: "National Federation", role: "Olympic development" }, { name: "Quiksilver", org: "Brand Scouts", role: "Athlete sponsorship" }],
    events: [{ name: "USA Surfing Championships", location: "Huntington Beach, CA", date: "Aug 2026", level: "Elite" }, { name: "WSL Qualifying Series", location: "Multiple Sites", date: "Year-Round", level: "Elite" }, { name: "Vans US Open of Surfing", location: "Huntington Beach, CA", date: "Jul 2026", level: "Elite" }, { name: "Junior Surf League", location: "Multiple Sites", date: "Year-Round", level: "National" }],
    positions: ["Shortboard", "Longboard", "Big Wave", "Bodyboard"],
    seedPosts: [{ user: "Kai Nakamura", handle: "@kai_surf", pos: "Shortboard · WSL QS", content: "QS 10,000 event win in Portugal. CT qualification within reach. #WSLChampionship", highlight: "QS 10,000 Event Win", likes: 4892, xScore: 95 }],
  },
  {
    id: "skateboarding", name: "Skateboarding", emoji: "🛹", tagline: "SKATE. CREATE. DOMINATE.",
    accentColor: "purple", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "85M+", label: "Skaters Worldwide" }, { value: "100+", label: "Programs" }, { value: "80+", label: "Countries" }, { value: "$300M+", label: "NIL Market" }],
    nilDeals: [{ brand: "Nike SB", type: "Shoe & Apparel", value: "$5K–$100K/yr", req: "Pro or elite amateur" }, { brand: "Vans", type: "Shoe Partner", value: "$3K–$50K/yr", req: "Elite amateur" }, { brand: "Element", type: "Board & Gear", value: "$2K–$25K/yr", req: "Any elite level" }, { brand: "Red Bull", type: "Energy Partner", value: "$5K–$100K/yr", req: "Elite/pro level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }],
    trendingTags: [{ tag: "#XGames", posts: "18.4K" }, { tag: "#StreetLeague", posts: "9.8K" }, { tag: "#SkateboardingNIL", posts: "5.4K" }, { tag: "#OlympicTrials", posts: "7.8K" }, { tag: "#ProSkater", posts: "12.4K" }],
    scouts: [{ name: "USA Skateboarding", org: "National Federation", role: "Olympic development" }, { name: "Street League", org: "Pro Circuit", role: "Pro contracts" }, { name: "X Games", org: "Action Sports", role: "Invite-only events" }],
    events: [{ name: "X Games Aspen", location: "Aspen, CO", date: "Jan 2026", level: "Elite" }, { name: "Street League Skateboarding", location: "Multiple Cities", date: "Year-Round", level: "Elite" }, { name: "USA Skateboarding Nationals", location: "Multiple Sites", date: "Jun 2026", level: "National" }, { name: "Olympic Trials", location: "TBD", date: "2028", level: "Elite" }],
    positions: ["Street", "Park", "Vert", "Big Air"],
    seedPosts: [{ user: "Nyjah Williams", handle: "@nyjah_skate", pos: "Street · USA Skateboarding", content: "X Games gold in street. Olympic Trials qualification confirmed. #XGames", highlight: "X Games Gold Medal", likes: 6102, xScore: 97 }],
  },
  {
    id: "climbing", name: "Rock Climbing", emoji: "🧗", tagline: "REACH THE TOP",
    accentColor: "orange", coverImg: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
    stats: [{ value: "35M+", label: "Climbers Worldwide" }, { value: "200+", label: "Programs" }, { value: "100+", label: "Countries" }, { value: "$200M+", label: "NIL Market" }],
    nilDeals: [{ brand: "La Sportiva", type: "Shoe & Gear", value: "$2K–$25K/yr", req: "National qualifier" }, { brand: "Black Diamond", type: "Equipment Partner", value: "$2K–$20K/yr", req: "Elite amateur" }, { brand: "Petzl", type: "Gear Partner", value: "$1K–$15K/yr", req: "Any level" }, { brand: "Red Bull", type: "Energy Partner", value: "$5K–$100K/yr", req: "Elite/pro level" }, { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any level" }],
    trendingTags: [{ tag: "#USAClimbing", posts: "5.8K" }, { tag: "#IFSCWorldCup", posts: "8.4K" }, { tag: "#ClimbingNIL", posts: "3.2K" }, { tag: "#OlympicTrials", posts: "6.4K" }, { tag: "#Bouldering", posts: "9.8K" }],
    scouts: [{ name: "USA Climbing", org: "National Federation", role: "Olympic development" }, { name: "IFSC", org: "World Federation", role: "Global rankings" }, { name: "NCAA Climbing", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USA Climbing Nationals", location: "Multiple Sites", date: "Jul 2026", level: "Elite" }, { name: "IFSC World Cup", location: "Multiple Cities", date: "Year-Round", level: "Elite" }, { name: "Junior World Championships", location: "TBD", date: "Aug 2026", level: "Elite" }, { name: "Collegiate Climbing Series", location: "Multiple Sites", date: "Year-Round", level: "National" }],
    positions: ["Lead", "Speed", "Bouldering", "Combined"],
    seedPosts: [{ user: "Lily Stone", handle: "@lily_climbs", pos: "Lead/Boulder · USA Climbing", content: "IFSC World Cup podium in bouldering. Olympic Trials qualification confirmed. #USAClimbing", highlight: "IFSC World Cup Podium", likes: 3102, xScore: 93 }],
  },
];

// ─── SportXHub Component ───────────────────────────────────────────────────────
type SportTab = "feed" | "events" | "nil" | "transfer" | "scouts" | "profile";

export default function SportXHub({ sport }: { sport: SportConfig }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SportTab>("feed");
  const [postText, setPostText] = useState("");
  const [xScoreResult, setXScoreResult] = useState<{ score: number; breakdown: string; tier: string } | null>(null);

  const utils = trpc.useUtils();
  const { data: feedData, isLoading: feedLoading } = trpc.feed.getFeed.useQuery({ limit: 20 }, { refetchInterval: 30000, retry: 1 });
  const likePost = trpc.feed.likePost.useMutation({ onSuccess: () => utils.feed.getFeed.invalidate() });
  const createPost = trpc.feed.createPost.useMutation({ onSuccess: () => { setPostText(""); utils.feed.getFeed.invalidate(); } });
  const calcXFactor = trpc.ai.calculateXFactor.useMutation({ onSuccess: (data) => setXScoreResult(data) });

  const dbPosts = feedData?.posts ?? [];
  const sportPosts = dbPosts.filter((p: any) =>
    (p.content as string)?.toLowerCase().includes(sport.name.toLowerCase()) ||
    (p.type as string)?.toLowerCase().includes(sport.id.toLowerCase())
  );
  const displayPosts = sportPosts;
  // NIL doctrine: prefer the athlete's real Image; never colored initials default.
  const userAvatarUrl = (user as any)?.avatarUrl as string | undefined;
  const SilhouetteAvatar = ({ size }: { size: string }) => (
    <div className={`${size} rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0`} title={userAvatarUrl ? (user?.name ?? '') : 'Identity pending — add your photo'}>
      {userAvatarUrl ? (
        <img src={userAvatarUrl} alt={user?.name ?? 'Athlete'} className="w-full h-full rounded-full object-cover" />
      ) : (
        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
      )}
    </div>
  );

  const TABS: { id: SportTab; label: string; icon: any }[] = [
    { id: "feed", label: "Feed", icon: Trophy },
    { id: "events", label: "Events", icon: Trophy },
    { id: "nil", label: "NIL Deals", icon: DollarSign },
    { id: "transfer", label: "Transfer", icon: RefreshCw },
    { id: "scouts", label: "Scouts", icon: Eye },
    { id: "profile", label: "My Profile", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#000a1a] text-white">
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 bg-[#000a1a]/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-bold transition-colors">
              <ArrowLeft className="w-4 h-4" /> AthlynX
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-900/50 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xs text-blue-300 font-black tracking-widest uppercase">{sport.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href={`/athlete/${user.id}`}>
                <SilhouetteAvatar size="w-8 h-8" />
              </Link>
            ) : (
              <>
                <Link href="/signin" className="text-sm text-slate-300 hover:text-white font-bold transition-colors">Sign In</Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-black px-4 py-2 rounded-full transition-colors flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Tab Nav ── */}
      <div className="sticky top-[57px] z-40 bg-[#000a1a]/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-4 text-xs font-black border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-500 text-white"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Hero Banner — Less-Is-More: media, one sentence, one CTA, corner badge ── */}
      <div className="relative min-h-[48vh] overflow-hidden bg-[#000a1a]">
        <img src={sport.coverImg} alt={`${sport.name} athlete`} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000a1a] via-[#000a1a]/45 to-[#000a1a]/20" />
        <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-black tracking-[0.24em] text-white/80">
          LIVE
        </div>
        <div className="relative z-10 flex min-h-[48vh] items-end px-6 pb-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
              The {sport.name} Playbook.
            </h1>
            <Link href={user ? "/profile" : "/signup"}>
              <button className="w-fit rounded-full bg-blue-600 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-blue-500">
                Claim Your Free Profile →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main 3-Column Layout ── */}
      <div className="max-w-7xl mx-auto flex gap-0">

        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0 sticky top-[105px] h-[calc(100vh-105px)] overflow-y-auto border-r border-slate-800 px-4 py-4">
          {/* X-Factor Score Widget */}
          <div className="bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800/50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3 className="font-black text-white text-sm">Your X-Factor Score</h3>
            </div>
            {xScoreResult ? (
              <div className="text-center py-2">
                <div className={`text-5xl font-black mb-1 ${xScoreResult.score >= 90 ? "text-blue-400" : xScoreResult.score >= 80 ? "text-blue-400" : "text-green-400"}`}>{xScoreResult.score}</div>
                <div className="text-blue-300 text-xs font-bold mb-2">{xScoreResult.tier}</div>
                <p className="text-slate-400 text-xs leading-relaxed">{xScoreResult.breakdown}</p>
              </div>
            ) : (
              <>
                <p className="text-slate-400 text-xs mb-3">AI-powered rating based on your stats, film, recruiting interest and intangibles. Powered by Gemini 2.5 Flash + Nebius.</p>
                <button
                  onClick={() => calcXFactor.mutate({ sport: sport.name })}
                  disabled={!user || calcXFactor.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-black py-2.5 rounded-full transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {calcXFactor.isPending ? "Calculating..." : user ? "Get My X-Factor Score" : "Sign In to Score"}
                </button>
              </>
            )}
          </div>

          {/* Trending Tags */}
          <div className="bg-slate-900/60 rounded-2xl p-4 mb-4">
            <h3 className="font-black text-white text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Trending in {sport.name}
            </h3>
            <div className="space-y-2">
              {sport.trendingTags.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-blue-400 text-sm font-bold hover:text-blue-300 cursor-pointer">{t.tag}</span>
                  <span className="text-slate-600 text-xs">{t.posts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-1">
            {[
              { href: "/nil-portal", label: "NIL Portal", icon: DollarSign },
              { href: "/transfer-portal", label: "Transfer Portal", icon: RefreshCw },
              { href: "/browse-athletes", label: "Browse Athletes", icon: Users },
              { href: "/ai-recruiter", label: "AI Recruiter", icon: Cpu },
              { href: "/messenger", label: "Messages", icon: MessageCircle },
            ].map(link => (
              <Link key={link.href} href={link.href}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Center Feed */}
        <div className="flex-1 min-w-0 border-r border-slate-800">

          {/* FEED TAB */}
          {activeTab === "feed" && (
            <div>
              {user && (
                <div className="px-4 py-4 border-b border-slate-800">
                  <div className="flex gap-3">
                    <SilhouetteAvatar size="w-10 h-10" />
                    <div className="flex-1">
                      <textarea
                        value={postText}
                        onChange={e => setPostText(e.target.value)}
                        placeholder={`Share your ${sport.name} X-Factor moment...`}
                        className="w-full bg-transparent text-white placeholder-slate-600 text-base resize-none outline-none min-h-[60px]"
                        rows={2}
                      />
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-3 text-blue-400">
                          <button className="hover:text-blue-300"><ImageIcon className="w-5 h-5" /></button>
                          <button className="hover:text-blue-300"><BarChart2 className="w-5 h-5" /></button>
                          <button className="hover:text-blue-300"><MapPin className="w-5 h-5" /></button>
                          <div className="flex items-center gap-1 ml-2">
                            <Lock className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px] font-black">E2EE</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { if (postText.trim() && user) createPost.mutate({ content: postText, postType: "status" }); }}
                          disabled={!postText.trim() || createPost.isPending}
                          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black px-5 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1.5"
                        >
                          <Zap className="w-4 h-4" />
                          {createPost.isPending ? "Posting..." : "Post"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {feedLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Loading {sport.name} feed...</p>
                </div>
              ) : (
                displayPosts.map((post: any, i: number) => (
                  <div key={post.id ?? i} className="border-b border-slate-800 px-4 py-4 hover:bg-slate-900/40 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(post.user?.avatar ?? (post.authorName ?? post.user ?? "A").split(" ").map((n: string) => n[0]).join("").slice(0, 2))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-black text-white text-sm">{post.user?.name ?? post.authorName ?? post.user ?? "Athlete"}</span>
                          <span className="text-slate-500 text-xs">{post.user?.handle ?? post.handle ?? ""}</span>
                          {(post.user?.xScore ?? post.xScore) && (
                            <span className="text-blue-400 text-xs font-bold flex items-center gap-0.5">
                              <Zap className="w-3 h-3" />{post.user?.xScore ?? post.xScore}
                            </span>
                          )}
                          {(post.user?.pos ?? post.pos) && <span className="text-blue-400 text-xs bg-blue-950/60 px-2 py-0.5 rounded-full">{post.user?.pos ?? post.pos}</span>}
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed mb-2">{post.content}</p>
                        {(post.highlight ?? post.user?.highlight) && (
                          <div className="inline-flex items-center gap-1.5 bg-blue-950/60 border border-blue-800/40 rounded-full px-3 py-1 mb-2">
                            <Zap className="w-3 h-3 text-blue-400" />
                            <span className="text-blue-300 text-xs font-bold">{post.highlight ?? post.user?.highlight}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-5 text-slate-600 text-sm">
                          <button onClick={() => post.id && likePost.mutate({ postId: post.id })} className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-xs">{post.stats?.likes ?? post.likes ?? post.likesCount ?? 0}</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs">{post.stats?.comments ?? post.commentsCount ?? 0}</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors">
                            <Repeat2 className="w-4 h-4" />
                            <span className="text-xs">{post.stats?.reposts ?? 0}</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors ml-auto">
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {!user && (
                <div className="p-6 border-b border-slate-800 bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-black">E2EE PROTECTED FEED</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">Join AthlynXAI to post your {sport.name} moments and get your X-Factor score.</p>
                  <div className="flex gap-3">
                    <Link href="/signup"><button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-full text-sm transition-colors flex items-center gap-1.5"><Zap className="w-4 h-4" />Join Free</button></Link>
                    <Link href="/signin"><button className="border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors">Sign In</button></Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === "events" && (
            <div className="p-4 space-y-3">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-400" />
                2026 {sport.name} Events & Showcases
              </h2>
              {sport.events.map((e, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-blue-700/50 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-white font-black">{e.name}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${e.level === "Elite" ? "bg-blue-700/40 text-blue-400 border border-blue-700/40" : e.level === "International" ? "bg-purple-700/40 text-purple-400 border border-purple-700/40" : e.level === "National" ? "bg-blue-700/40 text-blue-400 border border-blue-700/40" : "bg-slate-700/40 text-slate-400 border border-slate-700/40"}`}>{e.level}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{e.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{e.date}</span>
                      </div>
                    </div>
                    <Link href={user ? "/athlete-calendar" : "/signup"}>
                      <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2 rounded-full transition-colors flex-shrink-0 flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5" /> Register
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/40 border border-blue-800/30 rounded-2xl p-5 text-center mt-4">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-slate-300 text-sm mb-3">Add events to your Athlete Calendar and get reminders when registration opens.</p>
                <Link href="/athlete-calendar"><button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-full text-sm transition-colors flex items-center gap-2 mx-auto">
                  <Calendar className="w-4 h-4" /> Open My Calendar
                </button></Link>
              </div>
            </div>
          )}

          {/* NIL DEALS TAB */}
          {activeTab === "nil" && (
            <div className="p-4 space-y-3">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                {sport.name} NIL Deals
              </h2>
              {sport.nilDeals.map((deal, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-700/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-blue-950/60 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-black">{deal.brand}</div>
                    <div className="text-slate-500 text-sm">{deal.type}</div>
                    <div className="text-slate-600 text-xs mt-0.5 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Req: {deal.req}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-emerald-400 font-black text-sm">{deal.value}</div>
                    <Link href={user ? "/nil-portal" : "/signup"}>
                      <button className="text-xs text-blue-400 hover:text-white transition-colors mt-1 flex items-center gap-1">Apply <ChevronRight className="w-3 h-3" /></button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/40 border border-blue-800/30 rounded-2xl p-5 text-center mt-4">
                <DollarSign className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-slate-300 text-sm mb-3">The NIL Portal connects you with brands, secures contracts, and manages your deals — all in one place.</p>
                <Link href="/nil-portal"><button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-full text-sm transition-colors flex items-center gap-2 mx-auto">
                  <DollarSign className="w-4 h-4" /> Open NIL Portal
                </button></Link>
              </div>
            </div>
          )}

          {/* TRANSFER PORTAL TAB */}
          {activeTab === "transfer" && (
            <div className="p-4">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-400" />
                {sport.name} Transfer Portal
              </h2>
              <div className="bg-gradient-to-br from-blue-950/60 to-slate-900/60 border border-blue-800/40 rounded-2xl p-6 mb-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-900/50 flex items-center justify-center mx-auto mb-3">
                    <School className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Find Your Next School</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">The Transfer Portal connects {sport.name} athletes with programs looking for exactly your skills.</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[{ label: "Programs Searching", value: "1,200+" }, { label: "Open Scholarships", value: "450+" }, { label: "Avg Response Time", value: "48hrs" }].map((s, i) => (
                    <div key={i} className="bg-blue-950/40 rounded-xl p-3 text-center">
                      <div className="text-blue-400 font-black text-xl">{s.value}</div>
                      <div className="text-slate-500 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  {["Complete your athlete profile", "Enter the Transfer Portal", "Get matched with programs", "Receive scholarship offers"].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">{i + 1}</div>
                      <span className="text-slate-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 justify-center">
                  <Link href="/transfer-portal"><button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-full transition-colors flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Enter Transfer Portal
                  </button></Link>
                  <Link href={user ? "/profile" : "/signup"}><button className="border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-bold px-6 py-3 rounded-full transition-colors flex items-center gap-2">
                    <Edit3 className="w-4 h-4" /> Build My Profile
                  </button></Link>
                </div>
              </div>
            </div>
          )}

          {/* SCOUTS TAB */}
          {activeTab === "scouts" && (
            <div className="p-4">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                {sport.name} Scouts & Recruiters
              </h2>
              <div className="space-y-3 mb-6">
                {sport.scouts.map((scout, i) => (
                  <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-700/50 transition-all">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {scout.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-black">{scout.name}</div>
                      <div className="text-slate-500 text-sm">{scout.org}</div>
                      <div className="text-blue-400 text-xs mt-0.5 flex items-center gap-1">
                        <Search className="w-3 h-3" /> {scout.role}
                      </div>
                    </div>
                    <Link href={user ? "/profile" : "/signup"}>
                      <button className="border border-slate-600 hover:border-blue-500 hover:text-blue-400 text-slate-400 text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Get Noticed
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/40 border border-blue-800/30 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-black">How to Get Noticed</h3>
                </div>
                <div className="space-y-2">
                  {[
                    "Complete your athlete profile with stats and highlights",
                    "Post your X-Factor moments to the feed",
                    "Enter your sport's showcases and events",
                    "Get your AI X-Factor score to stand out",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
                <Link href={user ? "/profile" : "/signup"}>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 rounded-full text-sm transition-colors flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> Build My Profile Now
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="p-4">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                My {sport.name} Profile
              </h2>

              {user ? (
                <div className="space-y-4">
                  {/* Quick profile card */}
                  <div className="bg-gradient-to-br from-blue-950/60 to-slate-900/60 border border-blue-800/40 rounded-2xl p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <SilhouetteAvatar size="w-16 h-16" />
                      <div>
                        <div className="text-white font-black text-lg">{user.name || "Athlete"}</div>
                        <div className="text-blue-400 text-sm flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5" /> {sport.name} Athlete
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 text-[10px] font-black">E2EE SECURED PROFILE</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "X-Factor", value: "—", icon: Zap, color: "text-blue-400" },
                        { label: "EPX Rating", value: "—", icon: Flame, color: "text-blue-400" },
                        { label: "NIL Value", value: "$0", icon: DollarSign, color: "text-emerald-400" },
                      ].map(s => (
                        <div key={s.label} className="bg-[#000a1a] rounded-xl p-3 text-center">
                          <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                          <div className="text-white font-black text-base">{s.value}</div>
                          <div className="text-slate-500 text-xs">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2">
                      <Link href={`/athlete/${user.id}`}>
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                          <Eye className="w-4 h-4" /> View My Public Profile
                        </button>
                      </Link>
                      <Link href="/profile">
                        <button className="w-full bg-white/5 border border-white/10 hover:border-blue-500/50 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                          <Edit3 className="w-4 h-4" /> Edit Profile & Stats
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Sport positions */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-blue-400" />
                      <h3 className="text-white font-black text-sm">{sport.name} Positions</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sport.positions.map((pos, i) => (
                        <span key={i} className="text-xs bg-blue-950/60 text-blue-300 border border-blue-900/40 px-2.5 py-1 rounded-full font-bold">{pos}</span>
                      ))}
                    </div>
                  </div>

                  {/* E2EE security info */}
                  <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/40 border border-emerald-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-white font-black text-sm">End-to-End Encrypted</div>
                        <div className="text-white/40 text-xs">AES-256-GCM · Your data is protected</div>
                      </div>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      All profile data, messages, and NIL contracts on AthlynX are protected by military-grade end-to-end encryption. Only you and authorized parties can access your information.
                    </p>
                  </div>

                  {/* Quick links */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { href: "/nil-portal", label: "NIL Portal", icon: DollarSign, color: "text-emerald-400" },
                      { href: "/recruiting-hub", label: "Recruiting Hub", icon: School, color: "text-blue-400" },
                      { href: "/transfer-portal", label: "Transfer Portal", icon: RefreshCw, color: "text-blue-400" },
                      { href: "/warrior-playbook", label: "Film Room", icon: Film, color: "text-violet-400" },
                    ].map((link, i) => (
                      <Link key={i} href={link.href}>
                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 hover:border-blue-700/50 transition-all cursor-pointer flex items-center gap-2">
                          <link.icon className={`w-4 h-4 ${link.color}`} />
                          <span className="text-white text-xs font-bold">{link.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-2xl bg-blue-950/40 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-white font-black text-xl mb-2">Create Your {sport.name} Profile</h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                    Join AthlynX to build your scouting profile, get your X-Factor score, and connect with coaches and scouts.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/signup">
                      <button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3 rounded-full flex items-center gap-2 transition-colors">
                        <Zap className="w-4 h-4" /> Join Free — 7 Days
                      </button>
                    </Link>
                    <Link href="/signin">
                      <button className="border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-bold px-6 py-3 rounded-full transition-colors">
                        Sign In
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-72 flex-shrink-0 sticky top-[105px] h-[calc(100vh-105px)] overflow-y-auto px-4 py-4">
          {/* X-Factor Score Tiers */}
          <div className="bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800/50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3 className="font-black text-white text-sm">X-Factor Tiers</h3>
            </div>
            {[
              { label: "90–100", desc: "Elite — Pro Prospect", color: "text-blue-400" },
              { label: "80–89", desc: "High Major D1", color: "text-blue-400" },
              { label: "70–79", desc: "Mid Major D1", color: "text-green-400" },
              { label: "60–69", desc: "D2 / D3 Prospect", color: "text-slate-400" },
            ].map((tier, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50 last:border-0">
                <span className={`font-black ${tier.color}`}>{tier.label}</span>
                <span className="text-slate-500">{tier.desc}</span>
              </div>
            ))}
            <button
              onClick={() => calcXFactor.mutate({ sport: sport.name })}
              disabled={!user || calcXFactor.isPending}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-black py-2 rounded-full transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              {calcXFactor.isPending ? "Calculating..." : user ? "Get My Score" : "Sign In to Score"}
            </button>
          </div>

          {/* Who to Follow */}
          <div className="bg-slate-900/60 rounded-2xl p-4 mb-4">
            <h3 className="font-black text-white text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Who to Follow
            </h3>
            <div className="space-y-3">
              {sport.scouts.map((scout, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {scout.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{scout.name}</div>
                    <div className="text-xs text-slate-500 truncate">{scout.org}</div>
                  </div>
                  <button className="text-xs border border-slate-700 hover:border-blue-500 hover:text-blue-400 text-slate-400 px-3 py-1 rounded-full transition-colors flex-shrink-0 flex items-center gap-1">
                    <UserPlus className="w-3 h-3" /> Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Positions */}
          <div className="bg-slate-900/60 rounded-2xl p-4 mb-4">
            <h3 className="font-black text-white text-sm mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              Positions
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {sport.positions.map((pos, i) => (
                <span key={i} className="text-xs bg-blue-950/60 text-blue-300 border border-blue-900/40 px-2 py-1 rounded-full">{pos}</span>
              ))}
            </div>
          </div>

          {/* Scout Spotlight */}
          <div className="bg-slate-900/60 rounded-2xl p-4">
            <h3 className="font-black text-white text-sm mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              Scout Spotlight
            </h3>
            <div className="bg-blue-950/50 border border-blue-800/30 rounded-xl p-3">
              <div className="text-xs text-blue-300 font-bold mb-1 flex items-center gap-1">
                <Search className="w-3 h-3" /> Scouts are watching
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {sport.scouts.length} verified scouts and coaches are active in {sport.name} right now. Post your highlights to get noticed.
              </p>
              <Link href={user ? "/profile" : "/signup"}>
                <button className="mt-2 text-xs text-blue-400 hover:underline font-bold flex items-center gap-1">
                  Get noticed <ChevronRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
