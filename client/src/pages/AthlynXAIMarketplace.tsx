/**
 * AthlynXAI Marketplace — The Unified All-Company Store
 *
 * One platform. Every product. Every company.
 * Hardware · Software · Sports Gear · Apparel · Shoes · Helmets · Bats · AI Tools · NIL Merch
 *
 * Companies represented:
 *   - AthlynXAI (AI platform, subscriptions, software)
 *   - AthlynX Originals (branded apparel, gear)
 *   - ICC-USA (custom servers, enterprise hardware)
 *   - FuelBots (AI companion robots)
 *   - Diamond Grind (baseball-specific gear & analytics)
 *   - All-Sport (universal sports gear across every sport)
 *
 * Built by Chad Dozier — CEO + CTO + Lead Developer
 * Session: June 6, 2026
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  company: string;
  category: string;
  requiresQuote: boolean;
}

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  company: string;
  companyColor: string;
  badge?: string;
  badgeColor?: string;
  icon: string;
  inStock: boolean;
  requiresQuote: boolean;
  featured?: boolean;
  rating: number;
  reviews: number;
  tags: string[];
}

// ─── COMPANIES ───────────────────────────────────────────────────────────────
const COMPANIES = [
  { id: "all", name: "All Companies", icon: "🏪", color: "text-white" },
  { id: "athlynxai", name: "AthlynXAI", icon: "🤖", color: "text-blue-400" },
  { id: "originals", name: "AthlynX Originals", icon: "👕", color: "text-red-400" },
  { id: "icc", name: "ICC-USA", icon: "🖥️", color: "text-indigo-400" },
  { id: "fuelbots", name: "FuelBots", icon: "⚡", color: "text-blue-400" },
  { id: "diamond", name: "Diamond Grind", icon: "⚾", color: "text-blue-400" },
  { id: "allsport", name: "All-Sport", icon: "🏆", color: "text-green-400" },
];

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", name: "Everything", icon: "🛒" },
  { id: "software", name: "Software & AI", icon: "💿" },
  { id: "hardware", name: "Hardware & Servers", icon: "🖥️" },
  { id: "baseball", name: "Baseball", icon: "⚾" },
  { id: "football", name: "Football", icon: "🏈" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "soccer", name: "Soccer", icon: "⚽" },
  { id: "volleyball", name: "Volleyball", icon: "🏐" },
  { id: "golf", name: "Golf", icon: "⛳" },
  { id: "fishing", name: "Fishing", icon: "🎣" },
  { id: "hunting", name: "Hunting & Outdoor", icon: "🦌" },
  { id: "apparel", name: "Apparel & Shoes", icon: "👟" },
  { id: "training", name: "Training & Recovery", icon: "🏋️" },
  { id: "nutrition", name: "Nutrition", icon: "🥤" },
  { id: "robots", name: "AI Robots", icon: "🤖" },
  { id: "nil", name: "NIL & Branding", icon: "🏷️" },
];

// ─── FULL PRODUCT CATALOG ────────────────────────────────────────────────────
const ALL_PRODUCTS: Product[] = [
  // ── AthlynXAI Software & Subscriptions ──────────────────────────────────
  {
    id: "axai-pro",
    name: "AthlynXAI Pro — Athlete Subscription",
    tagline: "The complete athlete operating system",
    description: "Full platform access: AI recruiting, NIL marketplace, performance tracking, career coaching, media tools, and 44 AI integrations. Everything an athlete needs in one place.",
    price: 29.99,
    category: "software",
    company: "athlynxai",
    companyColor: "border-blue-500/40",
    badge: "BESTSELLER",
    badgeColor: "bg-blue-600",
    icon: "🤖",
    inStock: true,
    requiresQuote: false,
    featured: true,
    rating: 5.0,
    reviews: 1247,
    tags: ["subscription", "AI", "athlete", "platform"],
  },
  {
    id: "axai-team",
    name: "AthlynXAI Team License",
    tagline: "For coaches, programs, and athletic departments",
    description: "Manage your entire roster. AI scouting reports, transfer portal matching, team analytics, compliance tools, and NIL management for every athlete on your program.",
    price: 299.99,
    category: "software",
    company: "athlynxai",
    companyColor: "border-blue-500/40",
    badge: "TEAM",
    badgeColor: "bg-blue-700",
    icon: "🏟️",
    inStock: true,
    requiresQuote: false,
    featured: true,
    rating: 4.9,
    reviews: 312,
    tags: ["team", "coaching", "analytics"],
  },
  {
    id: "axai-enterprise",
    name: "AthlynXAI Enterprise — Athletic Department",
    tagline: "Full athletic department OS — all sports, all athletes",
    description: "Complete enterprise license for athletic departments. All sports covered. Unlimited athletes. Dedicated AI, compliance automation, NIL marketplace, recruiting analytics, and white-glove onboarding.",
    price: 0,
    category: "software",
    company: "athlynxai",
    companyColor: "border-blue-500/40",
    badge: "ENTERPRISE",
    badgeColor: "bg-indigo-600",
    icon: "🏛️",
    inStock: true,
    requiresQuote: true,
    featured: true,
    rating: 5.0,
    reviews: 48,
    tags: ["enterprise", "athletic department", "all sports"],
  },
  {
    id: "axai-nil-kit",
    name: "AthlynXAI NIL Starter Kit",
    tagline: "Launch your NIL brand in 24 hours",
    description: "AI-generated athlete brand kit: logo, social templates, press kit, bio page, and NIL deal matching. Everything you need to start earning from your name, image, and likeness.",
    price: 299.99,
    category: "nil",
    company: "athlynxai",
    companyColor: "border-blue-500/40",
    badge: "NIL",
    badgeColor: "bg-purple-600",
    icon: "🏷️",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.9,
    reviews: 567,
    tags: ["NIL", "branding", "social media"],
  },
  {
    id: "axai-ai-coach",
    name: "AthlynXAI AI Career Coach — 1 Year",
    tagline: "Your personal AI sports career advisor",
    description: "12 months of AI-powered career coaching. Personalized recruiting strategy, transfer portal guidance, NIL deal analysis, and professional development planning.",
    price: 199.99,
    category: "software",
    company: "athlynxai",
    companyColor: "border-blue-500/40",
    badge: "AI",
    badgeColor: "bg-cyan-600",
    icon: "🧠",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 892,
    tags: ["AI coaching", "career", "recruiting"],
  },

  // ── Diamond Grind — Baseball ──────────────────────────────────────────────
  {
    id: "dg-pro-sub",
    name: "Diamond Grind Pro — College Baseball OS",
    tagline: "The definitive college baseball athlete platform",
    description: "AI-powered transfer portal, recruiting dashboard, performance analytics, NIL marketplace, and live bracket challenges. Everything D1Baseball.com wishes it was.",
    price: 24.99,
    category: "baseball",
    company: "diamond",
    companyColor: "border-blue-500/40",
    badge: "DIAMOND GRIND",
    badgeColor: "bg-blue-600",
    icon: "⚾",
    inStock: true,
    requiresQuote: false,
    featured: true,
    rating: 5.0,
    reviews: 2341,
    tags: ["baseball", "college", "recruiting", "NIL"],
  },
  {
    id: "dg-helmet-pro",
    name: "Diamond Grind Pro Batting Helmet",
    tagline: "NOCSAE certified. Impact sensor ready.",
    description: "Premium batting helmet with optional Bluetooth impact sensor that feeds data directly to your AthlynXAI performance dashboard. Available in all team colors.",
    price: 149.99,
    category: "baseball",
    company: "diamond",
    companyColor: "border-blue-500/40",
    badge: "BESTSELLER",
    badgeColor: "bg-blue-500",
    icon: "⛑️",
    inStock: true,
    requiresQuote: false,
    featured: true,
    rating: 4.9,
    reviews: 1456,
    tags: ["helmet", "baseball", "safety", "smart"],
  },
  {
    id: "dg-bat-maple",
    name: "Diamond Grind Maple Pro Bat — 33\"",
    tagline: "Pro-grade maple. Cupped end. Game-ready.",
    description: "Professional-grade maple wood bat, 33\" / 30oz. Cupped end, bone-rubbed finish. Comes with QR code linking to your AthlynXAI player profile.",
    price: 129.99,
    category: "baseball",
    company: "diamond",
    companyColor: "border-blue-500/40",
    badge: "PRO WOOD",
    badgeColor: "bg-blue-700",
    icon: "🏏",
    inStock: true,
    requiresQuote: false,
    featured: true,
    rating: 4.9,
    reviews: 876,
    tags: ["bat", "maple", "wood", "baseball"],
  },
  {
    id: "dg-bat-alloy",
    name: "Diamond Grind BBCOR Alloy Bat — 33\"",
    tagline: "BBCOR .50 certified. Drop -3.",
    description: "BBCOR-certified alloy bat for high school and college play. 33\" / 30oz, drop -3. Two-piece construction with vibration dampening end cap.",
    price: 299.99,
    category: "baseball",
    company: "diamond",
    companyColor: "border-blue-500/40",
    badge: "BBCOR",
    badgeColor: "bg-gray-600",
    icon: "🏏",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 543,
    tags: ["bat", "BBCOR", "alloy", "college"],
  },
  {
    id: "dg-glove-pro",
    name: "Diamond Grind Pro Fielding Glove — 11.5\"",
    tagline: "Full-grain leather. Game-ready.",
    description: "11.5\" infield glove, full-grain leather, H-web pattern. Pre-oiled and game-ready out of the box. Available for infield, outfield, and catcher.",
    price: 189.99,
    category: "baseball",
    company: "diamond",
    companyColor: "border-blue-500/40",
    badge: "GAME READY",
    badgeColor: "bg-blue-600",
    icon: "🧤",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 712,
    tags: ["glove", "fielding", "leather", "baseball"],
  },
  {
    id: "dg-cleats-metal",
    name: "Diamond Grind Metal Cleats — Low Cut",
    tagline: "Lightweight. Aggressive traction.",
    description: "Low-cut metal cleats for college and professional play. Lightweight aluminum plate, 9-cleat configuration, padded collar. Available sizes 7–15.",
    price: 119.99,
    category: "baseball",
    company: "diamond",
    companyColor: "border-blue-500/40",
    badge: "METAL",
    badgeColor: "bg-zinc-600",
    icon: "👟",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.7,
    reviews: 934,
    tags: ["cleats", "shoes", "baseball", "metal"],
  },
  {
    id: "dg-pitching-machine",
    name: "Diamond Grind AI Pitching Machine",
    tagline: "0–105 mph. 12 pitch types. AI-controlled.",
    description: "Professional-grade pitching machine with AI control via the AthlynXAI app. Throws fastballs, curveballs, sliders, changeups, and more. Programmable sequences for game simulation.",
    price: 3499.99,
    category: "baseball",
    company: "diamond",
    companyColor: "border-blue-500/40",
    badge: "AI POWERED",
    badgeColor: "bg-blue-700",
    icon: "⚡",
    inStock: true,
    requiresQuote: false,
    featured: true,
    rating: 5.0,
    reviews: 89,
    tags: ["pitching machine", "AI", "training", "baseball"],
  },
  {
    id: "dg-catcher-gear",
    name: "Diamond Grind Catcher's Gear Set",
    tagline: "Helmet, chest guard, shin guards. Full set.",
    description: "Complete catcher's gear set: NOCSAE-certified helmet with jaw guard, chest protector, and shin guards. Available in youth and adult sizes. Team colors available.",
    price: 349.99,
    category: "baseball",
    company: "diamond",
    companyColor: "border-blue-500/40",
    badge: "FULL SET",
    badgeColor: "bg-blue-600",
    icon: "🥅",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 234,
    tags: ["catcher", "gear", "protective", "baseball"],
  },
  {
    id: "dg-batting-tee",
    name: "Diamond Grind Pro Batting Tee",
    tagline: "Adjustable 20\"–46\". Rubber flex top.",
    description: "Heavy-duty batting tee with rubber flex top, adjustable height 20\"–46\", weighted base. Works with all bat types. Includes carrying bag.",
    price: 79.99,
    category: "baseball",
    company: "diamond",
    companyColor: "border-blue-500/40",
    badge: "TRAINING",
    badgeColor: "bg-blue-600",
    icon: "🏏",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.7,
    reviews: 1823,
    tags: ["tee", "training", "batting", "baseball"],
  },

  // ── AthlynX Originals — Apparel & Shoes ──────────────────────────────────
  {
    id: "orig-hoodie-flagship",
    name: "AthlynX Originals Flagship Hoodie",
    tagline: "The hoodie champions wear off the field.",
    description: "Premium 400gsm cotton-poly blend hoodie. Embroidered AthlynX logo, kangaroo pocket, ribbed cuffs. Available in Black, Navy, Granite, and Red. Sizes S–3XL.",
    price: 89.99,
    category: "apparel",
    company: "originals",
    companyColor: "border-red-500/40",
    badge: "FLAGSHIP",
    badgeColor: "bg-red-600",
    icon: "👕",
    inStock: true,
    requiresQuote: false,
    featured: true,
    rating: 4.9,
    reviews: 3421,
    tags: ["hoodie", "apparel", "originals"],
  },
  {
    id: "orig-performance-tee",
    name: "AthlynX Performance Tee — Dri-Fit",
    tagline: "Train in it. Win in it.",
    description: "Moisture-wicking performance tee, 4-way stretch, UPF 30+. AthlynX logo on chest. Available in 8 colorways. Sizes XS–3XL.",
    price: 39.99,
    category: "apparel",
    company: "originals",
    companyColor: "border-red-500/40",
    badge: "PERFORMANCE",
    badgeColor: "bg-red-500",
    icon: "👕",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 5678,
    tags: ["tee", "performance", "dri-fit", "apparel"],
  },
  {
    id: "orig-snapback",
    name: "AthlynX Snapback Cap",
    tagline: "Flat brim. Embroidered. Adjustable.",
    description: "Structured 6-panel snapback with embroidered AthlynX logo. Flat brim, adjustable snap closure. One size fits most. Available in 6 colorways.",
    price: 34.99,
    category: "apparel",
    company: "originals",
    companyColor: "border-red-500/40",
    badge: "LIMITED",
    badgeColor: "bg-gray-700",
    icon: "🧢",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 2341,
    tags: ["cap", "hat", "snapback", "apparel"],
  },
  {
    id: "orig-training-shorts",
    name: "AthlynX Training Shorts — 7\"",
    tagline: "Built for speed. Stays out of your way.",
    description: "7\" inseam training shorts, 4-way stretch, built-in liner, zippered back pocket. Moisture-wicking. Available in Black, Navy, and Red. Sizes S–3XL.",
    price: 44.99,
    category: "apparel",
    company: "originals",
    companyColor: "border-red-500/40",
    badge: "TRAINING",
    badgeColor: "bg-red-500",
    icon: "🩳",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.7,
    reviews: 1892,
    tags: ["shorts", "training", "apparel"],
  },
  {
    id: "orig-shoes-trainer",
    name: "AthlynX Cross-Trainer Shoes",
    tagline: "Built for the weight room and the field.",
    description: "Lightweight cross-training shoe, reinforced toe box, rubber outsole with multi-directional traction. Available in Black/Blue and White/Red. Sizes 7–15.",
    price: 129.99,
    category: "apparel",
    company: "originals",
    companyColor: "border-red-500/40",
    badge: "NEW",
    badgeColor: "bg-blue-600",
    icon: "👟",
    inStock: true,
    requiresQuote: false,
    featured: true,
    rating: 4.8,
    reviews: 987,
    tags: ["shoes", "trainers", "footwear", "apparel"],
  },
  {
    id: "orig-nil-jersey",
    name: "AthlynX Custom NIL Jersey",
    tagline: "Your name. Your number. Your brand.",
    description: "Fully sublimated custom jersey with your name, number, and team colors. Any sport, any design. Includes QR code linking to your AthlynXAI player profile. 2-week turnaround.",
    price: 149.99,
    category: "nil",
    company: "originals",
    companyColor: "border-red-500/40",
    badge: "CUSTOM",
    badgeColor: "bg-purple-600",
    icon: "🏷️",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.9,
    reviews: 1234,
    tags: ["jersey", "custom", "NIL", "apparel"],
  },
  {
    id: "orig-socks-3pack",
    name: "AthlynX Performance Socks — 3 Pack",
    tagline: "Cushioned. Arch support. Anti-blister.",
    description: "3-pack of performance athletic socks. Cushioned sole, arch compression, anti-blister tab. Available in crew and ankle cut. One size fits most (M 6–12 / W 7–13).",
    price: 24.99,
    category: "apparel",
    company: "originals",
    companyColor: "border-red-500/40",
    badge: "VALUE",
    badgeColor: "bg-gray-600",
    icon: "🧦",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.7,
    reviews: 4521,
    tags: ["socks", "apparel", "performance"],
  },

  // ── All-Sport — Multi-Sport Gear ──────────────────────────────────────────
  {
    id: "as-football-helmet",
    name: "All-Sport Pro Football Helmet",
    tagline: "NOCSAE certified. Impact sensor ready.",
    description: "Premium football helmet with NOCSAE certification and optional Bluetooth impact sensor. Feeds collision data directly to your AthlynXAI dashboard. Available in all team colors.",
    price: 299.99,
    category: "football",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "SMART HELMET",
    badgeColor: "bg-green-700",
    icon: "🏈",
    inStock: true,
    requiresQuote: false,
    featured: true,
    rating: 4.9,
    reviews: 1876,
    tags: ["helmet", "football", "smart", "safety"],
  },
  {
    id: "as-football-pads",
    name: "All-Sport Shoulder Pads — Skill Position",
    tagline: "Lightweight. Low-profile. Maximum protection.",
    description: "Skill position shoulder pads for WR, DB, RB, and QB. Lightweight cantilevered design, removable padding, integrated neck roll. Sizes S–XL.",
    price: 189.99,
    category: "football",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "PROTECTION",
    badgeColor: "bg-green-600",
    icon: "🛡️",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 923,
    tags: ["shoulder pads", "football", "protection"],
  },
  {
    id: "as-football-cleats",
    name: "All-Sport Football Cleats — Mid Cut",
    tagline: "Ankle support. Explosive traction.",
    description: "Mid-cut football cleats with ankle support collar, molded TPU cleat plate, and padded footbed. Available in skill and lineman configurations. Sizes 7–15.",
    price: 139.99,
    category: "football",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "TRACTION",
    badgeColor: "bg-green-500",
    icon: "👟",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.7,
    reviews: 2134,
    tags: ["cleats", "shoes", "football"],
  },
  {
    id: "as-basketball-smart",
    name: "All-Sport Smart Basketball — Bluetooth",
    tagline: "Track every dribble. Every shot. Every spin.",
    description: "Bluetooth-connected basketball that tracks dribbles, shots, spin rate, and handle speed. Syncs with your AthlynXAI profile. Official size and weight. Indoor/outdoor.",
    price: 149.99,
    category: "basketball",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "SMART BALL",
    badgeColor: "bg-blue-600",
    icon: "🏀",
    inStock: true,
    requiresQuote: false,
    featured: true,
    rating: 4.8,
    reviews: 3421,
    tags: ["basketball", "smart", "Bluetooth", "tracking"],
  },
  {
    id: "as-basketball-shoes",
    name: "All-Sport Basketball Shoes — High Top",
    tagline: "Court grip. Ankle support. Responsive cushion.",
    description: "High-top basketball shoes with full-length foam cushioning, herringbone outsole, and ankle strap. Available in 6 colorways. Sizes 7–15.",
    price: 159.99,
    category: "basketball",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "HIGH TOP",
    badgeColor: "bg-blue-500",
    icon: "👟",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 1678,
    tags: ["shoes", "basketball", "high top"],
  },
  {
    id: "as-soccer-cleats",
    name: "All-Sport Soccer Cleats — FG",
    tagline: "Firm ground. Precision touch. Speed.",
    description: "Firm ground soccer cleats with textured upper for ball control, conical stud configuration for multi-directional traction. Available in youth and adult. Sizes 4–13.",
    price: 109.99,
    category: "soccer",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "FG",
    badgeColor: "bg-emerald-600",
    icon: "⚽",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.7,
    reviews: 2341,
    tags: ["cleats", "soccer", "firm ground"],
  },
  {
    id: "as-volleyball-shoes",
    name: "All-Sport Volleyball Court Shoes",
    tagline: "Low-profile. Gum rubber. Court-ready.",
    description: "Volleyball-specific court shoes with gum rubber outsole for maximum grip, cushioned midsole for jump landings, and breathable mesh upper. Sizes 6–13.",
    price: 99.99,
    category: "volleyball",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "COURT",
    badgeColor: "bg-blue-600",
    icon: "🏐",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.7,
    reviews: 876,
    tags: ["shoes", "volleyball", "court"],
  },
  {
    id: "as-golf-bag",
    name: "All-Sport Tour Golf Bag — 14-Way",
    tagline: "14-way divider. Waterproof. Tour-ready.",
    description: "14-way top divider golf bag with waterproof bottom, 8 pockets, integrated rain hood, and dual carry straps. Available in 4 colorways.",
    price: 249.99,
    category: "golf",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "TOUR",
    badgeColor: "bg-emerald-700",
    icon: "⛳",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 567,
    tags: ["golf", "bag", "tour"],
  },
  {
    id: "as-fishing-rod",
    name: "All-Sport Pro Casting Rod — 7'",
    tagline: "Medium-heavy. Fast action. Tournament grade.",
    description: "7-foot medium-heavy fast action casting rod. 24-ton carbon blank, fuji guides, cork grip. Rated for 10–20lb line, 3/8–1oz lures. Includes rod sock.",
    price: 149.99,
    category: "fishing",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "TOURNAMENT",
    badgeColor: "bg-blue-700",
    icon: "🎣",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 1234,
    tags: ["fishing", "rod", "casting", "tournament"],
  },
  {
    id: "as-hunting-pack",
    name: "All-Sport Hunting Daypack — 45L",
    tagline: "Scent-control. Frame system. Silent zippers.",
    description: "45L hunting daypack with activated carbon scent control, internal frame system, silent zipper pulls, and blaze orange reversible lid. Fits 18\" rifle.",
    price: 199.99,
    category: "hunting",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "SCENT CONTROL",
    badgeColor: "bg-olive-600",
    icon: "🦌",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 789,
    tags: ["hunting", "pack", "backpack", "outdoor"],
  },

  // ── Training & Recovery ───────────────────────────────────────────────────
  {
    id: "tr-normatec",
    name: "Hyperice Normatec 3 Legs",
    tagline: "Dynamic air compression recovery.",
    description: "Normatec 3 leg compression system with 7 levels of compression, ZoneBoost technology, and Bluetooth app control. Syncs with AthlynXAI recovery tracking.",
    price: 699.99,
    category: "training",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "RECOVERY",
    badgeColor: "bg-teal-600",
    icon: "🧊",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 5.0,
    reviews: 4521,
    tags: ["recovery", "compression", "Normatec"],
  },
  {
    id: "tr-theragun",
    name: "Theragun PRO Plus",
    tagline: "6 attachments. 60lb force. App-connected.",
    description: "Professional-grade percussive therapy device. 60lb stall force, 6 attachments, Bluetooth app control with guided routines. Syncs with AthlynXAI wellness tracking.",
    price: 599.99,
    category: "training",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "PRO",
    badgeColor: "bg-teal-700",
    icon: "⚡",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.9,
    reviews: 8923,
    tags: ["recovery", "massage", "Theragun", "percussive"],
  },
  {
    id: "tr-cold-plunge",
    name: "Edge Theory Labs Cold Plunge",
    tagline: "Chills to 37°F. 100 gallon. Filtration.",
    description: "Professional cold plunge tub that chills to 37°F. 100-gallon capacity, built-in filtration and UV sanitation, digital temperature control. Includes cover.",
    price: 4999.99,
    category: "training",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "ELITE",
    badgeColor: "bg-cyan-700",
    icon: "🧊",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 5.0,
    reviews: 234,
    tags: ["cold plunge", "recovery", "ice bath"],
  },
  {
    id: "tr-vertical-system",
    name: "Vertical Jump Training System",
    tagline: "Resistance bands + jump mat. Track your vert.",
    description: "Complete vertical jump training system: resistance band set, Bluetooth jump mat that measures height and hang time, and 12-week AI training program via AthlynXAI.",
    price: 199.99,
    category: "training",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "BESTSELLER",
    badgeColor: "bg-green-600",
    icon: "⬆️",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.8,
    reviews: 3421,
    tags: ["vertical", "jump", "training", "basketball"],
  },

  // ── Nutrition ─────────────────────────────────────────────────────────────
  {
    id: "nut-whey-gold",
    name: "Optimum Nutrition Gold Standard Whey — 10lb",
    tagline: "24g protein per serving. NSF certified.",
    description: "The world's best-selling whey protein. 24g protein per serving, 5.5g BCAAs, 4g glutamine. NSF Certified for Sport. Available in 20+ flavors.",
    price: 149.99,
    category: "nutrition",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "GOLD STANDARD",
    badgeColor: "bg-blue-600",
    icon: "🥤",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 4.9,
    reviews: 45678,
    tags: ["protein", "whey", "nutrition", "supplement"],
  },
  {
    id: "nut-creatine",
    name: "Thorne Creatine — 90 Servings",
    tagline: "NSF Certified for Sport. 5g pure creatine.",
    description: "NSF Certified for Sport creatine monohydrate. 5g per serving, unflavored, mixes clean. The most-tested creatine supplement available.",
    price: 49.99,
    category: "nutrition",
    company: "allsport",
    companyColor: "border-green-500/40",
    badge: "NSF CERTIFIED",
    badgeColor: "bg-blue-600",
    icon: "💊",
    inStock: true,
    requiresQuote: false,
    featured: false,
    rating: 5.0,
    reviews: 12345,
    tags: ["creatine", "nutrition", "NSF", "supplement"],
  },

  // ── FuelBots — AI Robots ──────────────────────────────────────────────────
  {
    id: "fb-runner",
    name: "FuelBot Runner — AI Running Companion",
    tagline: "Runs alongside athletes at full speed.",
    description: "The FuelBot Runner is an AI-powered robotic training companion that runs alongside athletes at speeds up to 25 mph. Provides real-time pace coaching, form feedback, and performance data to your AthlynXAI dashboard. Contact for lease pricing.",
    price: 0,
    category: "robots",
    company: "fuelbots",
    companyColor: "border-blue-500/40",
    badge: "AI ROBOT",
    badgeColor: "bg-blue-600",
    icon: "🤖",
    inStock: true,
    requiresQuote: true,
    featured: true,
    rating: 5.0,
    reviews: 0,
    tags: ["robot", "AI", "running", "FuelBot"],
  },
  {
    id: "fb-trainer",
    name: "FuelBot Trainer — AI Strength Coach",
    tagline: "Your AI strength coach. Always on.",
    description: "The FuelBot Trainer is an AI-powered robotic strength and conditioning coach. Spots lifts, counts reps, monitors form, and adjusts programming in real time. Integrates with AthlynXAI performance tracking. Contact for lease pricing.",
    price: 0,
    category: "robots",
    company: "fuelbots",
    companyColor: "border-blue-500/40",
    badge: "AI ROBOT",
    badgeColor: "bg-blue-500",
    icon: "🤖",
    inStock: true,
    requiresQuote: true,
    featured: true,
    rating: 5.0,
    reviews: 0,
    tags: ["robot", "AI", "strength", "FuelBot"],
  },
  {
    id: "fb-pitcher",
    name: "FuelBot Pitcher — AI Baseball Robot",
    tagline: "105 mph. 12 pitch types. Never tires.",
    description: "The FuelBot Pitcher is an AI-powered robotic pitcher that throws up to 105 mph with 12 pitch types. Programmed via the AthlynXAI app for custom batting practice sequences. Contact for lease pricing.",
    price: 0,
    category: "robots",
    company: "fuelbots",
    companyColor: "border-blue-500/40",
    badge: "DIAMOND GRIND",
    badgeColor: "bg-blue-600",
    icon: "⚾",
    inStock: true,
    requiresQuote: true,
    featured: true,
    rating: 5.0,
    reviews: 0,
    tags: ["robot", "AI", "baseball", "FuelBot", "pitcher"],
  },

  // ── ICC-USA — Enterprise Hardware ─────────────────────────────────────────
  {
    id: "icc-server-silver",
    name: "ICC-USA Custom Server — 2U Silver (256GB)",
    tagline: "Supermicro 2U · Intel Xeon Silver · 256GB DDR5",
    description: "Supermicro SYS-221H-TNR, 2x Intel Xeon Silver 4514Y (16C/32T), 256GB DDR5 4800MHz ECC, 8x 2.5\" NVMe/SATA/SAS + 2x M.2. Enterprise-grade AI and data workloads.",
    price: 0,
    category: "hardware",
    company: "icc",
    companyColor: "border-indigo-500/40",
    badge: "ENTERPRISE",
    badgeColor: "bg-indigo-600",
    icon: "🖥️",
    inStock: true,
    requiresQuote: true,
    featured: true,
    rating: 5.0,
    reviews: 23,
    tags: ["server", "enterprise", "hardware", "ICC"],
  },
  {
    id: "icc-server-platinum",
    name: "ICC-USA Custom Server — 2U Platinum (32C/64T)",
    tagline: "Supermicro 2U · Intel Xeon Platinum · 256GB DDR5",
    description: "Supermicro SYS-221H-TNR, 2x Intel Xeon Platinum 8562Y+ (32C/64T, 300W), 256GB DDR5 5600MHz ECC. Built for enterprise AI workloads and data center deployments.",
    price: 0,
    category: "hardware",
    company: "icc",
    companyColor: "border-indigo-500/40",
    badge: "PLATINUM",
    badgeColor: "bg-blue-700",
    icon: "🖥️",
    inStock: true,
    requiresQuote: true,
    featured: false,
    rating: 5.0,
    reviews: 11,
    tags: ["server", "platinum", "hardware", "ICC", "AI"],
  },
  {
    id: "icc-gpu-h200",
    name: "ICC-USA H200 GPU Compute Node",
    tagline: "NVIDIA H200 SXM. 141GB HBM3e. AI-grade.",
    description: "NVIDIA H200 SXM GPU compute node. 141GB HBM3e memory, 3.35 TB/s bandwidth. The same GPU powering AthlynXAI's AI stack. Contact for pricing and availability.",
    price: 0,
    category: "hardware",
    company: "icc",
    companyColor: "border-indigo-500/40",
    badge: "H200",
    badgeColor: "bg-green-700",
    icon: "⚡",
    inStock: true,
    requiresQuote: true,
    featured: true,
    rating: 5.0,
    reviews: 7,
    tags: ["GPU", "H200", "AI", "compute", "ICC"],
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────
function AthlynXAIMarketplaceInner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutName, setCheckoutName] = useState(user?.name || "");
  const [checkoutEmail, setCheckoutEmail] = useState(user?.email || "");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("");
  const [checkoutZip, setCheckoutZip] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const createCheckout = trpc.stripe.createProductCheckout.useMutation();

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      const matchCompany = selectedCompany === "all" || p.company === selectedCompany;
      const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCompany && matchCategory && matchSearch;
    });
  }, [selectedCompany, selectedCategory, searchQuery]);

  const featuredProducts = ALL_PRODUCTS.filter((p) => p.featured);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function addToCart(product: Product) {
    if (product.requiresQuote) {
      toast({ title: "Quote Requested", description: `Our team will contact you about ${product.name}.` });
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, company: product.company, category: product.category, requiresQuote: product.requiresQuote }];
    });
    toast({ title: "Added to Cart", description: product.name });
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleCheckout() {
    if (!checkoutName || !checkoutEmail) {
      toast({ title: "Missing Info", description: "Please fill in your name and email.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    try {
      const cartSummary = cart.map((i) => `${i.name} x${i.qty}`).join(", ");
      const result = await createCheckout.mutateAsync({
        productName: `AthlynXAI Marketplace Order`,
        productDescription: cartSummary,
        priceInCents: Math.round(cartTotal * 100),
        origin: window.location.origin,
      });
      if (result?.url) window.location.href = result.url;
    } catch {
      toast({ title: "Checkout Error", description: "Please try again or contact support.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }

  function formatPrice(price: number) {
    if (price === 0) return "Get Quote";
    return `$${price.toFixed(2)}`;
  }

  const companyMeta: Record<string, { name: string; tagline: string; color: string }> = {
    athlynxai: { name: "AthlynXAI", tagline: "The All-Sport Athlete Operating System", color: "from-blue-900/60 to-blue-800/30" },
    originals: { name: "AthlynX Originals", tagline: "Premium Athlete Apparel & Footwear", color: "from-red-900/60 to-red-800/30" },
    icc: { name: "ICC-USA", tagline: "Enterprise Hardware & Custom Servers", color: "from-indigo-900/60 to-indigo-800/30" },
    fuelbots: { name: "FuelBots", tagline: "AI-Powered Athletic Companion Robots", color: "from-blue-900/60 to-blue-800/30" },
    diamond: { name: "Diamond Grind", tagline: "The College Baseball OS", color: "from-blue-900/60 to-blue-800/30" },
    allsport: { name: "All-Sport", tagline: "Every Sport. Every Athlete. Every Need.", color: "from-green-900/60 to-green-800/30" },
  };

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#0A192F] text-white">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#0A192F] via-[#0d2240] to-[#0A192F] border-b border-white/10 pt-8 pb-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏪</span>
              <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">AthlynXAI Marketplace</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight">
              ONE STORE.<br />
              <span className="text-[#1E90FF]">EVERY SPORT.</span><br />
              EVERY COMPANY.
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mb-6">
              Hardware. Software. Sports gear. Apparel. Shoes. Helmets. Bats. AI robots. NIL tools. Everything from AthlynXAI, AthlynX Originals, ICC-USA, FuelBots, Diamond Grind, and All-Sport — in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2">
                <span className="text-blue-400 text-sm font-bold">{ALL_PRODUCTS.length}+ Products</span>
              </div>
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2">
                <span className="text-red-400 text-sm font-bold">6 Companies</span>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
                <span className="text-green-400 text-sm font-bold">Stripe Checkout</span>
              </div>
            </div>
          </div>
          {/* Cart button */}
          <button
            onClick={() => setShowCart(true)}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[#1E90FF] hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            🛒 {cartCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>}
            {cartTotal > 0 && <span className="text-sm">${cartTotal.toFixed(2)}</span>}
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* ── Company Selector ─────────────────────────────────────────── */}
          <div className="mb-6">
            <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">Shop by Company</h2>
            <div className="flex flex-wrap gap-2">
              {COMPANIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompany(c.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all border ${
                    selectedCompany === c.id
                      ? "bg-[#1E90FF] border-[#1E90FF] text-white"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Category Filter ───────────────────────────────────────────── */}
          <div className="mb-6">
            <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">Shop by Category</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all border ${
                    selectedCategory === c.id
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Search ───────────────────────────────────────────────────── */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search products, gear, software, robots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-xl bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1E90FF] text-sm"
            />
          </div>

          {/* ── Featured Products ─────────────────────────────────────────── */}
          {selectedCompany === "all" && selectedCategory === "all" && !searchQuery && (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                ⭐ <span>FEATURED PRODUCTS</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} formatPrice={formatPrice} featured />
                ))}
              </div>
            </div>
          )}

          {/* ── Company Banner (when filtered) ───────────────────────────── */}
          {selectedCompany !== "all" && companyMeta[selectedCompany] && (
            <div className={`bg-gradient-to-r ${companyMeta[selectedCompany].color} rounded-2xl border border-white/10 p-6 mb-8`}>
              <h2 className="text-2xl font-black text-white">{companyMeta[selectedCompany].name}</h2>
              <p className="text-gray-300 mt-1">{companyMeta[selectedCompany].tagline}</p>
            </div>
          )}

          {/* ── Results Count ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">
              Showing <span className="text-white font-bold">{filteredProducts.length}</span> products
            </p>
          </div>

          {/* ── Product Grid ──────────────────────────────────────────────── */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-xl font-bold text-white">No products found</p>
              <p className="text-sm mt-2">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} formatPrice={formatPrice} />
              ))}
            </div>
          )}

          {/* ── Enterprise CTA ────────────────────────────────────────────── */}
          <div className="mt-16 bg-gradient-to-r from-blue-900/40 to-red-900/20 rounded-2xl border border-blue-500/30 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Need Enterprise Solutions?</h3>
                <p className="text-gray-400">Custom servers, AI infrastructure, athletic department licenses, FuelBot deployments. Our team is ready.</p>
              </div>
              <Link href="/contact">
                <button className="px-8 py-4 bg-red-500 text-white rounded-xl font-black hover:bg-red-600 transition-all whitespace-nowrap text-lg">
                  Contact Sales Team →
                </button>
              </Link>
            </div>
          </div>

          {/* ── Company Links ─────────────────────────────────────────────── */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {COMPANIES.filter((c) => c.id !== "all").map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedCompany(c.id); setSelectedCategory("all"); setSearchQuery(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all"
              >
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className={`text-xs font-bold ${c.color}`}>{c.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Cart Drawer ───────────────────────────────────────────────────── */}
        {showCart && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowCart(false)} />
            <div className="relative w-full max-w-md bg-[#0d1f35] border-l border-white/10 h-full flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-black text-white">Your Cart ({cartCount})</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <div className="text-4xl mb-3">🛒</div>
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{item.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">${item.price.toFixed(2)} × {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold">${(item.price * item.qty).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-lg">×</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10">
                  <div className="flex justify-between text-white font-black text-xl mb-4">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => { setShowCart(false); setShowCheckout(true); }}
                    className="w-full py-4 bg-[#1E90FF] hover:bg-blue-500 text-white font-black rounded-xl text-lg transition-all"
                  >
                    Proceed to Checkout →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Checkout Modal ─────────────────────────────────────────────────── */}
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowCheckout(false)} />
            <div className="relative w-full max-w-lg bg-[#0d1f35] border border-white/10 rounded-2xl p-8 shadow-2xl">
              <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
              <h2 className="text-2xl font-black text-white mb-6">Checkout</h2>
              <div className="space-y-4 mb-6">
                <input
                  placeholder="Full Name"
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1E90FF] text-sm"
                />
                <input
                  placeholder="Email Address"
                  type="email"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1E90FF] text-sm"
                />
                <input
                  placeholder="Shipping Address"
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1E90FF] text-sm"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="City"
                    value={checkoutCity}
                    onChange={(e) => setCheckoutCity(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1E90FF] text-sm"
                  />
                  <input
                    placeholder="ZIP Code"
                    value={checkoutZip}
                    onChange={(e) => setCheckoutZip(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1E90FF] text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-between text-white font-black text-xl mb-6">
                <span>Order Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 bg-[#1E90FF] hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-xl text-lg transition-all"
              >
                {isProcessing ? "Processing..." : "Pay with Stripe →"}
              </button>
              <p className="text-gray-500 text-xs text-center mt-3">Secured by Stripe. Your payment info is never stored on our servers.</p>
            </div>
          </div>
        )}
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onAddToCart,
  formatPrice,
  featured = false,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
  formatPrice: (n: number) => string;
  featured?: boolean;
}) {
  const companyIcons: Record<string, string> = {
    athlynxai: "🤖",
    originals: "👕",
    icc: "🖥️",
    fuelbots: "⚡",
    diamond: "⚾",
    allsport: "🏆",
  };

  return (
    <div
      className={`relative bg-white/5 border ${product.companyColor} rounded-2xl overflow-hidden hover:bg-white/8 transition-all group ${featured ? "ring-1 ring-[#1E90FF]/30" : ""}`}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-0.5 ${product.badgeColor} text-white text-xs font-bold rounded-full`}>
            {product.badge}
          </span>
        </div>
      )}
      {/* Company tag */}
      <div className="absolute top-3 right-3 z-10">
        <span className="text-lg" title={product.company}>{companyIcons[product.company] || "🏪"}</span>
      </div>
      {/* Icon / Image area */}
      <div className="h-40 flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent text-7xl">
        {product.icon}
      </div>
      {/* Content */}
      <div className="p-4">
        <p className="text-white font-bold text-sm mb-1 leading-tight">{product.name}</p>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.tagline}</p>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-blue-400 text-xs">★</span>
          <span className="text-gray-400 text-xs">{product.rating.toFixed(1)}</span>
          {product.reviews > 0 && <span className="text-gray-600 text-xs">({product.reviews.toLocaleString()})</span>}
        </div>
        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <span className={`font-black ${product.price === 0 ? "text-blue-400 text-sm" : "text-white text-lg"}`}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              product.requiresQuote || product.price === 0
                ? "bg-blue-600/30 text-blue-400 hover:bg-blue-600/50 border border-blue-500/30"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {product.requiresQuote || product.price === 0 ? "Get Quote" : "Add +"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AthlynXAIMarketplace() {
  return (
    <RouteErrorBoundary>
      <AthlynXAIMarketplaceInner />
    </RouteErrorBoundary>
  );
}
