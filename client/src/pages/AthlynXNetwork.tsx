/**
 * AthlynXNetwork.tsx — The Super-App Hub
 * AXN · AVN · AthlynX Podcast · AthlynXAI OS
 * The Athlete's Playbook · Be The Legacy
 *
 * © 2026 Chad Allen Dozier Sr.
 * AthlynX™ · AthlynXAI™ · AXN™ · AVN™ · NIL Portal™ · Diamond Grind™
 * Warriors Playbook™ · AXN Credits™ · Connect Anyone to Anything™
 * Iron Sharpens Iron — Proverbs 27:17
 *
 * Palette: Cobalt #0047AB · Granite #1c2333 · Electric Blue #00c2ff · Stadium Lights #e8f4ff
 * Beats: Hudl · Opendorse · NCSA · Rivals · 247Sports · On3 · MaxPreps · Teamworks · All 20
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import {
  Radio, Tv, Mic, Play, ExternalLink, ShoppingBag, Star,
  Zap, Trophy, Users, DollarSign, Shield, Globe, Cpu,
  ArrowRight, ChevronRight, Flame, Music, Video,
  Heart, Share2, MessageCircle, Send, Bell, Bookmark,
  Crown, Lock, Unlock, TrendingUp, Award, Target,
  Headphones, BookOpen, Briefcase, Database, Mail,
  Sparkles, Activity, BarChart3, Layers, CheckCircle,
  Clock, Calendar, Megaphone, Gift, Rocket, Brain,
  Bot, Wifi, Phone, Hash, PlusCircle, RefreshCw,
  Search, Home, User, Settings, MoreHorizontal,
  ThumbsUp, Repeat2, Eye, Camera, Image, FileText,
  ChevronLeft, ChevronDown, X, Plus, Minus,
} from "lucide-react";

// ─── BRAND COLORS ─────────────────────────────────────────────────────────────
const C = {
  cobalt:    "#0047AB",
  cobaltDk:  "#002f7a",
  cobaltLt:  "#1a6fd4",
  granite:   "#1c2333",
  graniteDk: "#0d1117",
  graniteMd: "#252d3d",
  graniteL:  "#2e3a50",
  electric:  "#0066ff",
  bright:    "#00c2ff",
  stadium:   "#e8f4ff",
  white:     "#ffffff",
};

// ─── ALL SPORTS — ZERO EXCEPTIONS ─────────────────────────────────────────────
const ALL_SPORTS = [
  { icon: "🏈", name: "Football",      slug: "/gridiron-nexus",   hot: true  },
  { icon: "⚾", name: "Baseball",      slug: "/diamond-grind",    hot: true  },
  { icon: "🏀", name: "Basketball",    slug: "/court-kings",      hot: true  },
  { icon: "⚽", name: "Soccer",        slug: "/sports/soccer",    hot: false },
  { icon: "🥎", name: "Softball",      slug: "/softball-nation",  hot: false },
  { icon: "🏐", name: "Volleyball",    slug: "/net-setters",      hot: false },
  { icon: "🎾", name: "Tennis",        slug: "/racket-kings",     hot: false },
  { icon: "⛳", name: "Golf",          slug: "/fairway-elite",    hot: false },
  { icon: "🏊", name: "Swimming",      slug: "/swim-surge",       hot: false },
  { icon: "🏃", name: "Track & Field", slug: "/track-elite",      hot: false },
  { icon: "🏃", name: "Cross Country", slug: "/cross-country",    hot: false },
  { icon: "🤼", name: "Wrestling",     slug: "/mat-warriors",     hot: false },
  { icon: "🥍", name: "Lacrosse",      slug: "/lacrosse-elite",   hot: false },
  { icon: "🏑", name: "Field Hockey",  slug: "/field-hockey",     hot: false },
  { icon: "🤸", name: "Gymnastics",    slug: "/gymnastics-vault", hot: true  },
  { icon: "📣", name: "Cheerleading",  slug: "/cheer-elite",      hot: true  },
  { icon: "🎺", name: "Band/Marching", slug: "/sports/band",      hot: true  },
  { icon: "🏒", name: "Ice Hockey",    slug: "/ice-breakers",     hot: false },
  { icon: "🏉", name: "Rugby",         slug: "/rugby-elite",      hot: false },
  { icon: "🚣", name: "Rowing",        slug: "/rowing-elite",     hot: false },
  { icon: "🤽", name: "Water Polo",    slug: "/water-polo",       hot: false },
  { icon: "🏏", name: "Cricket",       slug: "/cricket-elite",    hot: false },
  { icon: "🎱", name: "Racquetball",   slug: "/racket-kings",     hot: false },
  { icon: "🎳", name: "Bowling",       slug: "/sports/bowling",   hot: false },
  { icon: "🚴", name: "Cycling",       slug: "/sports/cycling",   hot: false },
  { icon: "🏇", name: "Equestrian",    slug: "/sports/equestrian",hot: false },
  { icon: "🤺", name: "Fencing",       slug: "/sports/fencing",   hot: false },
  { icon: "⛷️", name: "Skiing",        slug: "/sports/skiing",    hot: false },
  { icon: "🏋️", name: "Weightlifting", slug: "/sports/weightlifting", hot: false },
  { icon: "🥊", name: "Boxing",        slug: "/sports/boxing",    hot: false },
  { icon: "🥋", name: "MMA",           slug: "/sports/mma",       hot: false },
  { icon: "🎮", name: "Esports",       slug: "/sports/esports",   hot: false },
  { icon: "🎣", name: "Fishing",       slug: "/reel-masters",     hot: false },
  { icon: "🏹", name: "Hunting",       slug: "/hunt-pro",         hot: false },
];

// ─── LIVE FEED POSTS ──────────────────────────────────────────────────────────
const FEED_POSTS = [
  {
    id: "p1", type: "highlight",
    user: { name: "Marcus Williams", role: "QB · Class of 2027", sport: "🏈", school: "Laurel HS", avatar: "MW" },
    content: "Just dropped my senior highlight reel. 47 TDs this season. Ready to take my talents to the next level. 🏈⚡",
    video: "SNHQDsOUVYFJwfUT",
    stats: { likes: 847, comments: 134, shares: 89, views: "12.4K" },
    time: "2m ago", badge: "🔥 TRENDING", recruitable: true,
    nilValue: "$18,500",
  },
  {
    id: "p2", type: "nil_deal",
    user: { name: "Jordan Chen", role: "SS · Class of 2026", sport: "⚾", school: "Diamond Grind Elite", avatar: "JC" },
    content: "Signed my first NIL deal with AthlynX Gear™! Diamond Grind Pro Batting Gloves — these things are elite. Link in bio to get yours. 💎",
    image: true,
    stats: { likes: 1203, comments: 267, shares: 156, views: "28.7K" },
    time: "15m ago", badge: "💰 NIL DEAL", recruitable: true,
    nilValue: "$12,000",
  },
  {
    id: "p3", type: "podcast",
    user: { name: "Chad Allen Dozier Sr.", role: "Founder · AthlynX™", sport: "🎙️", school: "AthlynXAI OS", avatar: "CD" },
    content: "Episode 001 is LIVE. 'Why I Built AthlynX — The Origin Story.' 48 minutes of truth. Every athlete needs to hear this. Be The Legacy. 🏆",
    stats: { likes: 2891, comments: 445, shares: 312, views: "67.2K" },
    time: "1h ago", badge: "🎙️ PODCAST", recruitable: false,
    podcastUrl: "https://open.spotify.com/episode/3pBeGKonds1DoM39P2zhlq",
  },
  {
    id: "p4", type: "recruit",
    user: { name: "Aaliyah Johnson", role: "Libero · Class of 2027", sport: "🏐", school: "Jackson Academy", avatar: "AJ" },
    content: "Just received my 3rd D1 offer through AthlynX! The AI Recruiter matched me with coaches I never would have found on my own. This platform is different. 🏐✨",
    stats: { likes: 634, comments: 98, shares: 71, views: "8.9K" },
    time: "2h ago", badge: "🎓 D1 OFFER", recruitable: true,
    nilValue: "$8,200",
  },
  {
    id: "p5", type: "cheer",
    user: { name: "Destiny Williams", role: "Flyer · Varsity Cheer", sport: "📣", school: "Oak Grove HS", avatar: "DW" },
    content: "AthlynX finally sees us. Cheerleading is a sport. We train harder than most. Our profiles are live, our NIL is real, and our legacy starts now. 📣💙",
    stats: { likes: 1456, comments: 203, shares: 178, views: "19.3K" },
    time: "3h ago", badge: "📣 CHEER", recruitable: true,
    nilValue: "$5,400",
  },
  {
    id: "p6", type: "band",
    user: { name: "Tre Jackson", role: "Drum Major · Marching Band", sport: "🎺", school: "Southern Miss Prep", avatar: "TJ" },
    content: "Band kids are athletes too. AthlynX built us a lane. Scholarship tools, NIL, recruiting — all of it. Nobody left behind. 🎺🥁",
    stats: { likes: 987, comments: 167, shares: 134, views: "14.1K" },
    time: "4h ago", badge: "🎺 BAND", recruitable: true,
    nilValue: "$3,800",
  },
  {
    id: "p7", type: "gymnastics",
    user: { name: "Sofia Martinez", role: "All-Around · Level 10", sport: "🤸", school: "Elite Gymnastics Academy", avatar: "SM" },
    content: "My AthlynX profile just got viewed by 14 college coaches this week. The AI matched me with programs that fit MY skills, MY GPA, MY goals. This is the future. 🤸‍♀️",
    stats: { likes: 1122, comments: 189, shares: 145, views: "16.8K" },
    time: "5h ago", badge: "🤸 GYMNASTICS", recruitable: true,
    nilValue: "$9,100",
  },
];

// ─── MESSENGER DEMO ───────────────────────────────────────────────────────────
const MESSENGER_THREADS = [
  { id: "m1", name: "Coach Davis — Alabama", role: "OC · Football", avatar: "CD", unread: 2, last: "We'd love to schedule an official visit...", time: "Just now", online: true },
  { id: "m2", name: "NIL Agent — SportsPro", role: "NIL Specialist", avatar: "NA", unread: 1, last: "We have a brand deal ready for you...", time: "5m", online: true },
  { id: "m3", name: "Diamond Grind Scout", role: "Baseball Recruiter", avatar: "DG", unread: 0, last: "Your velocity numbers are elite...", time: "1h", online: false },
  { id: "m4", name: "Lee Marshall", role: "Co-Host · The Playbook", avatar: "LM", unread: 3, last: "Podcast EP 002 drops Friday...", time: "2h", online: true },
  { id: "m5", name: "AthlynXAI OS", role: "Your AI Assistant", avatar: "AI", unread: 1, last: "You have 3 new recruiting matches...", time: "3h", online: true },
];

const DEMO_CHAT = [
  { from: "coach", text: "Hey Marcus, we've been following your highlights on AthlynX. Your numbers this season are impressive.", time: "10:32 AM" },
  { from: "athlete", text: "Thank you Coach! AthlynX made it easy to get my film out there.", time: "10:34 AM" },
  { from: "coach", text: "We'd love to schedule an official visit. Can you come to campus next weekend?", time: "10:35 AM" },
  { from: "athlete", text: "Absolutely. I'll have my agent reach out through the NIL Portal to coordinate.", time: "10:36 AM" },
  { from: "coach", text: "Perfect. We also want to discuss a NIL package with our program collective. AthlynX makes this so much easier.", time: "10:37 AM" },
];

// ─── SHOPIFY PRODUCTS ─────────────────────────────────────────────────────────
const SHOPIFY_PRODUCTS = [
  { id: "1", title: "AthlynX Performance Training Tee", price: "34.99", badge: "🔥 HOT", type: "Apparel", href: "https://0010yz-fn.myshopify.com/products/athlynx-performance-training-tee" },
  { id: "2", title: "AthlynX Performance Training Shorts", price: "39.99", badge: "NEW", type: "Apparel", href: "https://0010yz-fn.myshopify.com/products/athlynx-performance-training-shorts" },
  { id: "3", title: "AthlynX Full-Zip Performance Hoodie", price: "64.99", badge: "⚡ ELITE", type: "Apparel", href: "https://0010yz-fn.myshopify.com/products/athlynx-full-zip-performance-hoodie" },
  { id: "4", title: "AthlynX Compression Leggings", price: "49.99", badge: "PRO", type: "Apparel", href: "https://0010yz-fn.myshopify.com/products/athlynx-compression-leggings" },
  { id: "5", title: "Diamond Grind Pro Batting Gloves", price: "44.99", badge: "💎 GRIND", type: "Baseball", href: "https://0010yz-fn.myshopify.com/products/diamond-grind-pro-batting-gloves" },
  { id: "6", title: "Diamond Grind Training Batting Helmet", price: "79.99", badge: "💎 GRIND", type: "Baseball", href: "https://0010yz-fn.myshopify.com/products/diamond-grind-training-batting-helmet" },
  { id: "7", title: "Warriors Playbook Pro Coaching Binder", price: "29.99", badge: "COACH", type: "Coaching", href: "https://0010yz-fn.myshopify.com/products/warriors-playbook-pro-coaching-binder" },
  { id: "8", title: "AthlynX NIL Athlete Snapback Hat", price: "24.99", badge: "NIL", type: "NIL Merch", href: "https://0010yz-fn.myshopify.com/products/athlynx-nil-athlete-snapback-hat" },
  { id: "9", title: "AthlynXAI Logo Performance Tee", price: "34.99", badge: "AI", type: "Branded", href: "https://0010yz-fn.myshopify.com/products/athlynxai-logo-performance-tee" },
  { id: "10", title: "AthlynX Pro Resistance Band Set", price: "19.99", badge: "TRAIN", type: "Equipment", href: "https://0010yz-fn.myshopify.com/products/athlynx-pro-resistance-band-set" },
  { id: "11", title: "AthlynX Insulated Athlete Water Bottle", price: "27.99", badge: "HYDRATE", type: "Accessories", href: "https://0010yz-fn.myshopify.com/products/athlynx-insulated-athlete-water-bottle" },
];

// ─── PODCAST EPISODES ─────────────────────────────────────────────────────────
const PODCAST_EPISODES = [
  { ep: "001", title: "Why I Built AthlynX — The Origin Story", host: "Chad Allen Dozier Sr.", duration: "48:32", live: true, spotify: "https://open.spotify.com/episode/3pBeGKonds1DoM39P2zhlq", route: "/podcast/episode-1", desc: "The founder tells the full origin story — from athlete to empire builder." },
  { ep: "002", title: "Mind, Body, Soul — Transformative Thinking", host: "Lee Marshall", duration: "1:17", live: true, spotify: "https://open.spotify.com/episode/7EPd6yw3OdaHVtMwFeOcLm", route: "/podcast/episode-2", desc: "Lee Marshall drops truth: the game isn't won by talent alone." },
  { ep: "003", title: "Transfer Portal: Navigating the New Landscape", host: "Chad Allen Dozier Sr.", duration: "TBD", live: false, route: "/podcast", desc: "Everything athletes need to know about the portal." },
  { ep: "004", title: "Building Your Brand: Social Media for Athletes", host: "Chad Allen Dozier Sr.", duration: "TBD", live: false, route: "/podcast", desc: "How to build a brand that outlasts your career." },
  { ep: "005", title: "Agents, Lawyers & Financial Advisors", host: "Chad Allen Dozier Sr.", duration: "TBD", live: false, route: "/podcast", desc: "Who you need in your corner and when." },
  { ep: "006", title: "Cheerleading, Gymnastics & Band — You Are Athletes", host: "Chad Allen Dozier Sr.", duration: "TBD", live: false, route: "/podcast", desc: "Nobody gets left behind. Your sport matters." },
  { ep: "007", title: "AI in Sports — The Future Is Now", host: "Chad Allen Dozier Sr.", duration: "TBD", live: false, route: "/podcast", desc: "How AthlynXAI is changing the game forever." },
  { ep: "008", title: "The Diamond Grind: Baseball's Digital Revolution", host: "Chad Allen Dozier Sr.", duration: "TBD", live: false, route: "/podcast", desc: "Diamond Grind — where data meets the diamond." },
];

// ─── PLATFORM APPS ────────────────────────────────────────────────────────────
const PLATFORM_APPS = [
  { name: "NIL Portal", icon: "💰", href: "/nil-portal", desc: "Deals, endorsements, brand connect", hot: true, cat: "Core" },
  { name: "Transfer Portal", icon: "🔄", href: "/transfer-portal", desc: "Navigate the portal with AI", hot: true, cat: "Core" },
  { name: "Diamond Grind", icon: "⚾", href: "/diamond-grind", desc: "Baseball recruiting & analytics", hot: true, cat: "Sports" },
  { name: "Gridiron Nexus", icon: "🏈", href: "/gridiron-nexus", desc: "Football recruiting intelligence", hot: true, cat: "Sports" },
  { name: "Court Kings", icon: "🏀", href: "/court-kings", desc: "Basketball scouting & NIL", hot: false, cat: "Sports" },
  { name: "Cheer Elite", icon: "📣", href: "/cheer-elite", desc: "Cheerleading recruiting & NIL", hot: true, cat: "Sports" },
  { name: "Gymnastics Vault", icon: "🤸", href: "/gymnastics-vault", desc: "Gymnastics recruiting & scoring", hot: true, cat: "Sports" },
  { name: "Pitch Pulse", icon: "⚾", href: "/pitch-pulse", desc: "Pitching analytics & film", hot: false, cat: "Sports" },
  { name: "Softball Nation", icon: "🥎", href: "/softball-nation", desc: "Softball recruiting & stats", hot: false, cat: "Sports" },
  { name: "Reel Masters", icon: "🎣", href: "/reel-masters", desc: "Fishing & outdoor sports", hot: false, cat: "Sports" },
  { name: "Athlete Dashboard", icon: "📊", href: "/athlete-dashboard", desc: "Your stats, your story, your brand", hot: false, cat: "Core" },
  { name: "NIL Calculator", icon: "🧮", href: "/nil-calculator", desc: "Know your market value", hot: true, cat: "Core" },
  { name: "NIL Vault", icon: "🔐", href: "/nil-vault", desc: "Secure your contracts & IP", hot: false, cat: "Core" },
  { name: "AI Recruiter", icon: "🤖", href: "/ai-recruiter", desc: "AI-powered recruiting engine", hot: true, cat: "AI" },
  { name: "AI Sales Bot", icon: "⚡", href: "/ai-sales", desc: "Automate your outreach", hot: false, cat: "AI" },
  { name: "AI Content", icon: "✍️", href: "/ai-content", desc: "Create content with AI", hot: false, cat: "AI" },
  { name: "Social Hub", icon: "📱", href: "/social-hub", desc: "All your social in one place", hot: false, cat: "Media" },
  { name: "Studio Suite", icon: "🎬", href: "/studio", desc: "Create, record, publish", hot: true, cat: "Media" },
  { name: "Highlight Reel Studio", icon: "🎥", href: "/highlight-reel-studio", desc: "Build your recruiting reel", hot: true, cat: "Media" },
  { name: "Comms Hub", icon: "📡", href: "/comms-hub", desc: "Email, SMS, WhatsApp unified", hot: false, cat: "Comms" },
  { name: "CRM Dashboard", icon: "🗂️", href: "/crm", desc: "Full athlete & coach CRM", hot: false, cat: "Business" },
  { name: "Warriors Playbook", icon: "📋", href: "/warriors-playbook", desc: "Coaching tools & playbooks", hot: false, cat: "Coaching" },
  { name: "Athlete Playbook", icon: "📖", href: "/athlete-playbook", desc: "Your personal game plan", hot: false, cat: "Core" },
  { name: "EPX Platform", icon: "🚀", href: "/epx", desc: "Elite performance experience", hot: true, cat: "Core" },
  { name: "Faith", icon: "✝️", href: "/faith", desc: "Mind, body, soul alignment", hot: false, cat: "Life" },
  { name: "AthlynXAI OS", icon: "🧠", href: "/athlynxai-os", desc: "The full autonomous engine", hot: true, cat: "OS" },
  { name: "AXN Network", icon: "📡", href: "/network", desc: "Live broadcasting hub", hot: true, cat: "Media" },
  { name: "Booking Hub", icon: "📅", href: "/booking-hub", desc: "Schedule appearances & events", hot: false, cat: "Business" },
];

// ─── SUBSCRIPTION TIERS ───────────────────────────────────────────────────────
const TIERS = [
  { name: "Athlete Free", price: "$0", period: "/mo", color: "border-[#2e3a50]", badge: "START HERE", badgeColor: "bg-[#2e3a50]", features: ["AXN Network access", "2 podcast episodes", "NIL Calculator", "Basic profile", "Community feed"], cta: "Get Started Free", ctaStyle: "bg-[#2e3a50] hover:bg-[#252d3d] text-white", href: "/sign-up" },
  { name: "Athlete Pro", price: "$19", period: "/mo", color: "border-[#00c2ff]", badge: "🔥 MOST POPULAR", badgeColor: "bg-[#0066ff]", features: ["Everything in Free", "All podcast episodes", "NIL Portal full access", "AI Recruiter", "Transfer Portal", "250 AXN Credits/mo", "Social Hub", "Studio Suite", "Highlight Reel Studio"], cta: "Go Pro", ctaStyle: "bg-[#0066ff] hover:bg-[#0047AB] text-white", href: "/sign-up" },
  { name: "Elite Athlete", price: "$49", period: "/mo", color: "border-[#0047AB]", badge: "⚡ ELITE", badgeColor: "bg-[#0047AB]", features: ["Everything in Pro", "NIL Vault + Contracts", "AI Sales Bot", "Comms Hub (SMS + Email)", "1,000 AXN Credits/mo", "Priority AI routing", "White-label profile page", "All sports platforms"], cta: "Go Elite", ctaStyle: "bg-[#0047AB] hover:bg-[#002f7a] text-white", href: "/sign-up" },
  { name: "Enterprise", price: "$199", period: "/mo", color: "border-[#e8f4ff]/30", badge: "👑 ENTERPRISE", badgeColor: "bg-[#252d3d]", features: ["Everything in Elite", "Full AthlynXAI OS access", "CRM back office", "Zapier + Buffer + Twilio", "Unlimited AXN Credits", "White-label licensing", "Dedicated AI runner", "Chad Dozier direct access"], cta: "Contact Chad", ctaStyle: "bg-[#252d3d] hover:bg-[#1c2333] text-[#00c2ff] border border-[#00c2ff]/30", href: "mailto:cdozier14@athlynx.ai" },
];

// ─── AI STACK ─────────────────────────────────────────────────────────────────
const AI_STACK = [
  { name: "Google Gemini", icon: "🔵", role: "Content generation, search, workspace sync", active: true },
  { name: "Claude (Anthropic)", icon: "🟠", role: "Legal docs, contracts, long-form analysis", active: true },
  { name: "OpenAI GPT", icon: "🟢", role: "Athlete profiles, NIL valuations, chatbots", active: true },
  { name: "Perplexity Sonar", icon: "🔷", role: "Real-time recruiting intel, news, research", active: true },
  { name: "Grok", icon: "⚡", role: "Social media analysis, trending athlete content", active: true },
  { name: "Nebius AI", icon: "🌌", role: "Athlete Sovereignty Lane, advanced compute", active: true },
  { name: "Manus AI", icon: "🤖", role: "Autonomous OS execution, full task automation", active: true },
];

// ─── INTEGRATION STACK ────────────────────────────────────────────────────────
const INTEGRATIONS = [
  { name: "Supabase", icon: "⚡", role: "Database, Auth, Real-time", color: "bg-emerald-800" },
  { name: "Twilio", icon: "📱", role: "SMS, WhatsApp, Voice", color: "bg-red-800" },
  { name: "Superhuman", icon: "✉️", role: "AI-powered email OS", color: "bg-blue-800" },
  { name: "Buffer", icon: "📅", role: "Social scheduling", color: "bg-sky-800" },
  { name: "Zapier", icon: "⚡", role: "Workflow automation", color: "bg-orange-800" },
  { name: "AWS", icon: "☁️", role: "S3, Lambda, SES", color: "bg-yellow-800" },
  { name: "Shopify", icon: "🛍️", role: "E-commerce, gear, merch", color: "bg-green-800" },
  { name: "Google Workspace", icon: "🔵", role: "Docs, Drive, Calendar", color: "bg-indigo-800" },
];

// ─── COMPETITOR COMPARISON ────────────────────────────────────────────────────
const COMPETITORS = [
  { name: "Hudl", does: "Film only", athlynx: "Film + NIL + AI + Social + Store + Podcast + OS" },
  { name: "Opendorse", does: "NIL only", athlynx: "NIL + Recruiting + Social + Every Sport + Full Life" },
  { name: "NCSA", does: "Recruiting only", athlynx: "Recruiting + NIL + Social + AI + Store + Community" },
  { name: "Rivals/247", does: "Rankings only", athlynx: "Rankings + Profiles + NIL + Recruiting + Broadcasting" },
  { name: "MaxPreps", does: "Stats only", athlynx: "Stats + Brand + Income + Community + Every Sport" },
  { name: "Teamworks", does: "Team ops only", athlynx: "Team ops + Athlete life + NIL + Social + AI OS" },
];

// ─── SOCIAL PLATFORMS ─────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  { name: "Spotify", icon: "🎵", url: "https://open.spotify.com/episode/3pBeGKonds1DoM39P2zhlq", color: "bg-green-700" },
  { name: "YouTube", icon: "▶️", url: "https://youtube.com/@athlynxai", color: "bg-red-700" },
  { name: "Instagram", icon: "📸", url: "https://instagram.com/athlynxai", color: "bg-pink-700" },
  { name: "TikTok", icon: "🎬", url: "https://tiktok.com/@athlynxai", color: "bg-slate-800" },
  { name: "Apple Podcasts", icon: "🎙️", url: "https://podcasts.apple.com", color: "bg-purple-700" },
  { name: "iHeart Radio", icon: "❤️", url: "https://iheart.com", color: "bg-orange-700" },
  { name: "X / Twitter", icon: "𝕏", url: "https://x.com/athlynxai", color: "bg-slate-900" },
  { name: "Pocket Casts", icon: "🎧", url: "https://pocketcasts.com", color: "bg-rose-700" },
];

// ─── AXN CREDITS ──────────────────────────────────────────────────────────────
const CREDIT_ACTIONS = [
  { action: "Watch an episode", credits: 50, icon: "▶️" },
  { action: "Share content", credits: 25, icon: "📤" },
  { action: "Refer an athlete", credits: 500, icon: "👥" },
  { action: "Create a reel", credits: 100, icon: "🎬" },
  { action: "Complete NIL profile", credits: 200, icon: "✅" },
  { action: "Book a coaching session", credits: 150, icon: "📋" },
];

// ─── LIVE TICKER ──────────────────────────────────────────────────────────────
function LiveTicker() {
  const items = [
    "🔴 LIVE: AXN Network — NIL Portal Baseball · Watch Now",
    "🎙️ EP 001 on Spotify — 'Why I Built AthlynX' — 48:32",
    "⚡ New: Diamond Grind Pro Batting Gloves — Shop Now",
    "📣 Cheerleading & Gymnastics — Your Lane is Live",
    "🎺 Band & Marching Arts — Nobody Left Behind",
    "🏆 AthlynXAI OS — Connect Anyone to Anything™",
    "💰 Earn AXN Credits — Watch · Share · Create · Cash Out",
    "🤖 7 AI Engines Running — Gemini · Claude · GPT · Perplexity · Grok · Nebius · Manus",
    "👑 © 2026 Chad A. Dozier Sr. · AthlynX™ · AXN™ · AVN™ · All Rights Reserved",
    "🚀 Be The Legacy · Iron Sharpens Iron · Proverbs 27:17",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-[#0047AB]/20 border-b border-[#00c2ff]/20 py-1.5 px-4">
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[#00c2ff] text-[10px] font-black tracking-widest">LIVE</span>
        </div>
        <p className="text-xs text-[#e8f4ff]/70 truncate">{items[idx]}</p>
      </div>
    </div>
  );
}

// ─── FEED POST CARD ───────────────────────────────────────────────────────────
function FeedPostCard({ post, onLike, onCredit }: { post: typeof FEED_POSTS[0], onLike: (id: string) => void, onCredit: (n: number) => void }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showRecruit, setShowRecruit] = useState(false);

  const handleLike = () => {
    setLiked(l => !l);
    if (!liked) { onLike(post.id); onCredit(25); }
  };

  return (
    <div className="bg-[#1c2333] border border-[#2e3a50] hover:border-[#0047AB]/60 rounded-2xl overflow-hidden transition-all">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0047AB] to-[#00c2ff] flex items-center justify-center text-white font-black text-sm shrink-0">
            {post.user.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">{post.user.name}</span>
              {post.recruitable && (
                <span className="text-[10px] bg-[#0047AB]/30 text-[#00c2ff] border border-[#00c2ff]/20 rounded-full px-2 py-0.5">RECRUITABLE</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[#e8f4ff]/50 text-xs">
              <span>{post.user.sport}</span>
              <span>{post.user.role}</span>
              <span>·</span>
              <span>{post.user.school}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="text-[9px] bg-[#0d1117] border-[#2e3a50] text-[#e8f4ff]/60">{post.badge}</Badge>
          <span className="text-[#e8f4ff]/40 text-xs">{post.time}</span>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-[#e8f4ff]/90 text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* Video/Media */}
      {post.video && (
        <div className="mx-4 mb-3 bg-[#0d1117] rounded-xl overflow-hidden relative group cursor-pointer" style={{ height: "180px" }}>
          <video
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
            src={`https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/${post.video}.mp4`}
            muted loop playsInline
            onMouseEnter={e => (e.target as HTMLVideoElement).play()}
            onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#0047AB]/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#00c2ff]/20">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 rounded px-2 py-0.5 text-white text-[10px] flex items-center gap-1">
            <Eye className="w-3 h-3" /> {post.stats.views}
          </div>
        </div>
      )}

      {/* NIL Value + Podcast Link */}
      {post.nilValue && (
        <div className="mx-4 mb-3 bg-[#0047AB]/10 border border-[#0047AB]/20 rounded-xl px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#00c2ff]" />
            <span className="text-[#00c2ff] text-xs font-bold">NIL Value: {post.nilValue}/yr</span>
          </div>
          {post.recruitable && (
            <button onClick={() => setShowRecruit(r => !r)} className="text-xs bg-[#0047AB] hover:bg-[#002f7a] text-white rounded-full px-3 py-1 transition-colors">
              {showRecruit ? "Hide" : "Recruit This Athlete"}
            </button>
          )}
        </div>
      )}

      {post.podcastUrl && (
        <div className="mx-4 mb-3">
          <a href={post.podcastUrl} target="_blank" rel="noreferrer">
            <div className="bg-green-900/30 border border-green-500/20 rounded-xl px-3 py-2 flex items-center gap-3 hover:border-green-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                <Music className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Listen on Spotify</p>
                <p className="text-green-400 text-[10px]">The Athlete's Playbook · EP 001</p>
              </div>
              <ExternalLink className="w-3 h-3 text-green-400 ml-auto" />
            </div>
          </a>
        </div>
      )}

      {/* Recruit Panel */}
      {showRecruit && (
        <div className="mx-4 mb-3 bg-[#0d1117] border border-[#00c2ff]/20 rounded-xl p-3">
          <p className="text-[#00c2ff] text-xs font-bold mb-2">🎯 Recruit via AthlynXAI OS</p>
          <div className="flex gap-2">
            <Link href="/nil-portal" className="flex-1">
              <Button size="sm" className="w-full bg-[#0047AB] hover:bg-[#002f7a] text-white text-xs">Send NIL Offer</Button>
            </Link>
            <Link href="/comms-hub" className="flex-1">
              <Button size="sm" variant="outline" className="w-full border-[#00c2ff]/30 text-[#00c2ff] text-xs hover:bg-[#00c2ff]/10">Message</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Stats + Actions */}
      <div className="px-4 py-3 border-t border-[#2e3a50] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? "text-red-400" : "text-[#e8f4ff]/50 hover:text-red-400"}`}>
            <Heart className={`w-4 h-4 ${liked ? "fill-red-400" : ""}`} />
            <span>{post.stats.likes + (liked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-[#e8f4ff]/50 hover:text-[#00c2ff] transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>{post.stats.comments}</span>
          </button>
          <button onClick={() => onCredit(25)} className="flex items-center gap-1.5 text-xs text-[#e8f4ff]/50 hover:text-[#00c2ff] transition-colors">
            <Share2 className="w-4 h-4" />
            <span>{post.stats.shares}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setSaved(s => !s); if (!saved) onCredit(10); }} className={`text-xs transition-colors ${saved ? "text-[#00c2ff]" : "text-[#e8f4ff]/50 hover:text-[#00c2ff]"}`}>
            <Bookmark className={`w-4 h-4 ${saved ? "fill-[#00c2ff]" : ""}`} />
          </button>
          <button onClick={() => onCredit(50)} className="flex items-center gap-1 text-[10px] text-[#00c2ff]/60 hover:text-[#00c2ff] transition-colors">
            <Zap className="w-3 h-3" /> +50 Credits
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MESSENGER PANEL ──────────────────────────────────────────────────────────
function MessengerPanel() {
  const [activeThread, setActiveThread] = useState("m1");
  const [message, setMessage] = useState("");
  const active = MESSENGER_THREADS.find(t => t.id === activeThread)!;

  return (
    <div className="bg-[#1c2333] border border-[#2e3a50] rounded-2xl overflow-hidden" style={{ height: "480px" }}>
      <div className="flex h-full">
        {/* Thread List */}
        <div className="w-48 border-r border-[#2e3a50] flex flex-col">
          <div className="p-3 border-b border-[#2e3a50]">
            <p className="text-white font-black text-xs">Messages</p>
            <p className="text-[#e8f4ff]/40 text-[10px]">Powered by AthlynX™</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {MESSENGER_THREADS.map(t => (
              <button key={t.id} onClick={() => setActiveThread(t.id)}
                className={`w-full text-left p-3 border-b border-[#2e3a50]/50 hover:bg-[#252d3d] transition-colors ${activeThread === t.id ? "bg-[#252d3d]" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0047AB] to-[#00c2ff] flex items-center justify-center text-white text-[10px] font-black shrink-0">{t.avatar}</div>
                    {t.online && <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-[#1c2333]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-[10px] font-bold truncate">{t.name.split(" ")[0]}</p>
                      {t.unread > 0 && <span className="w-4 h-4 bg-[#0047AB] rounded-full text-white text-[9px] flex items-center justify-center shrink-0">{t.unread}</span>}
                    </div>
                    <p className="text-[#e8f4ff]/40 text-[9px] truncate">{t.last}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-[#2e3a50] flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0047AB] to-[#00c2ff] flex items-center justify-center text-white text-[10px] font-black">{active.avatar}</div>
            <div>
              <p className="text-white text-xs font-bold">{active.name}</p>
              <p className="text-[#e8f4ff]/40 text-[10px]">{active.role}</p>
            </div>
            {active.online && <span className="ml-auto text-green-400 text-[10px] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" />Online</span>}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {DEMO_CHAT.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "athlete" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${msg.from === "athlete" ? "bg-[#0047AB] text-white" : "bg-[#252d3d] text-[#e8f4ff]/90"}`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === "athlete" ? "text-white/60" : "text-[#e8f4ff]/40"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#2e3a50]">
            <div className="flex items-center gap-2 bg-[#252d3d] rounded-xl px-3 py-2">
              <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." className="flex-1 bg-transparent text-white text-xs outline-none placeholder-[#e8f4ff]/30" />
              <button onClick={() => setMessage("")} className="text-[#00c2ff] hover:text-white transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[#e8f4ff]/30 text-[10px] mt-1 text-center">AthlynX Messenger™ — Coaches · Agents · Athletes · Brands</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
function AthlynXNetworkInner() {
  const [activeTab, setActiveTab] = useState<"feed" | "messenger" | "discover" | "store" | "os">("feed");
  const [credits, setCredits] = useState(1247);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [sportFilter, setSportFilter] = useState("All");
  const [appFilter, setAppFilter] = useState("All");
  const [adIdx, setAdIdx] = useState(0);

  const addCredits = useCallback((n: number) => setCredits(c => c + n), []);

  const SPONSOR_ADS = [
    { brand: "ICC-USA™", tagline: "Your Official Fulfillment Partner — Gear That Performs", cta: "Shop Gear", href: "/commerce/vendor/icc-usa", grad: "from-[#0047AB] to-[#002f7a]", badge: "OFFICIAL PARTNER" },
    { brand: "Diamond Grind™", tagline: "Train Like a Pro. Recruit Like a Champion.", cta: "Get Gloves", href: "/diamond-grind", grad: "from-[#1c2333] to-[#0047AB]", badge: "⚾ FEATURED" },
    { brand: "NIL Portal™", tagline: "Your Name. Your Brand. Your Money.", cta: "Activate NIL", href: "/nil-portal", grad: "from-[#002f7a] to-[#0066ff]", badge: "💰 HOT" },
    { brand: "AthlynXAI OS™", tagline: "The Only Middleman You'll Ever Need. Chad Dozier Sr.", cta: "Enter the OS", href: "/athlynxai-os", grad: "from-[#0d1117] to-[#1c2333]", badge: "🤖 POWERED" },
  ];

  useEffect(() => {
    const t = setInterval(() => setAdIdx(i => (i + 1) % SPONSOR_ADS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { id: "feed", label: "🏠 Feed" },
    { id: "messenger", label: "💬 Messenger" },
    { id: "discover", label: "🔍 Discover" },
    { id: "store", label: "🛍️ Store" },
    { id: "os", label: "🤖 OS" },
  ] as const;

  const SponsorAd = ({ ad }: { ad: typeof SPONSOR_ADS[0] }) => (
    <div className={`bg-gradient-to-r ${ad.grad} border border-[#00c2ff]/10 rounded-xl p-4 flex items-center justify-between gap-4`}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-[#e8f4ff]/40 tracking-widest uppercase">Sponsored</span>
          <Badge className="text-[9px] bg-white/10 text-white border-0">{ad.badge}</Badge>
        </div>
        <p className="font-black text-white text-sm">{ad.brand}</p>
        <p className="text-[#e8f4ff]/60 text-xs">{ad.tagline}</p>
      </div>
      <Link href={ad.href}>
        <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white text-xs shrink-0 border border-white/20 rounded-full">
          {ad.cta} <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen text-white" style={{ background: `linear-gradient(180deg, ${C.graniteDk} 0%, ${C.granite} 100%)` }}>

      {/* LIVE TICKER */}
      <LiveTicker />

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.graniteDk} 0%, ${C.cobaltDk} 60%, ${C.cobalt} 100%)` }}>
        {/* Stadium light beams */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute opacity-5"
              style={{
                width: "2px", height: "100%",
                background: `linear-gradient(180deg, ${C.bright} 0%, transparent 100%)`,
                left: `${10 + i * 16}%`,
                transform: `rotate(${-15 + i * 6}deg)`,
                transformOrigin: "top center",
              }} />
          ))}
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, ${C.cobalt}40 0%, transparent 70%)` }} />
        </div>

        <div className="relative container mx-auto px-4 py-14 max-w-7xl text-center">
          {/* Live badge */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <Badge className="bg-red-600/20 text-red-400 border-red-600/40 text-xs tracking-widest">LIVE NOW</Badge>
          </div>

          {/* Main title */}
          <h1 className="text-5xl sm:text-7xl font-black mb-2 leading-none" style={{ background: `linear-gradient(135deg, ${C.stadium} 0%, ${C.bright} 50%, ${C.electric} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AXN · AVN
          </h1>
          <p className="text-xl sm:text-2xl font-black text-white mb-1">Athlete Broadcasting Network</p>
          <p className="text-sm font-bold mb-1" style={{ color: C.bright }}>The Athlete's Playbook™ · Be The Legacy</p>
          <p className="text-xs mb-1" style={{ color: `${C.stadium}60` }}>Powered by <span style={{ color: C.bright }}>AthlynXAI OS™</span> · Chad Allen Dozier Sr., Founder</p>
          <p className="text-xs mb-8" style={{ color: `${C.stadium}40` }}>© 2026 Chad A. Dozier Sr. · AthlynX™ · AXN™ · AVN™ · All Rights Reserved · Iron Sharpens Iron — Proverbs 27:17</p>

          {/* Credits counter */}
          <div className="inline-flex items-center gap-3 rounded-full px-6 py-3 mb-6 border" style={{ background: `${C.cobalt}20`, borderColor: `${C.bright}30` }}>
            <Zap className="w-4 h-4" style={{ color: C.bright }} />
            <span className="font-black text-sm" style={{ color: C.bright }}>{credits.toLocaleString()} AXN Credits™</span>
            <span className="text-xs" style={{ color: `${C.stadium}50` }}>· Earn more below ↓</span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link href="/podcast/episode-1">
              <Button className="font-black px-6 py-3 rounded-full" style={{ background: C.electric, color: C.white }}>
                <Play className="w-4 h-4 mr-2" /> Watch EP 001
              </Button>
            </Link>
            <a href="https://open.spotify.com/episode/3pBeGKonds1DoM39P2zhlq" target="_blank" rel="noreferrer">
              <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10 rounded-full px-6">
                <Music className="w-4 h-4 mr-2" /> Listen on Spotify
              </Button>
            </a>
            <Link href="/sign-up">
              <Button variant="outline" className="rounded-full px-6" style={{ borderColor: `${C.bright}60`, color: C.bright }}>
                <Zap className="w-4 h-4 mr-2" /> Start Earning Credits
              </Button>
            </Link>
          </div>

          {/* Social row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {SOCIAL_LINKS.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer">
                <Button size="sm" className={`${s.color} hover:opacity-80 text-white text-xs rounded-full px-3 h-7`}>
                  {s.icon} {s.name}
                </Button>
              </a>
            ))}
          </div>

          {/* Tagline */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 border" style={{ background: `${C.graniteDk}80`, borderColor: `${C.graniteL}` }}>
            <Globe className="w-3 h-3" style={{ color: C.bright }} />
            <span className="text-xs font-bold" style={{ color: `${C.stadium}80` }}>Every Sport · Every Human · Every Industry · Nobody Left Behind</span>
          </div>
        </div>
      </section>

      {/* SPONSOR BANNER */}
      <div className="container mx-auto px-4 max-w-7xl py-3">
        <SponsorAd ad={SPONSOR_ADS[adIdx]} />
      </div>

      {/* STICKY TAB NAV */}
      <div className="sticky top-0 z-40 border-b" style={{ background: `${C.graniteDk}f5`, backdropFilter: "blur(12px)", borderColor: `${C.graniteL}` }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all"
                style={activeTab === t.id
                  ? { background: C.electric, color: C.white }
                  : { color: `${C.stadium}60`, background: "transparent" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-6 space-y-10">

        {/* ══ TAB: FEED ══════════════════════════════════════════════════════════ */}
        {activeTab === "feed" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-4">
              {/* Create Post Bar */}
              <div className="rounded-2xl p-4 border" style={{ background: C.granite, borderColor: C.graniteL }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0" style={{ background: `linear-gradient(135deg, ${C.cobalt}, ${C.bright})` }}>
                    CD
                  </div>
                  <div className="flex-1 rounded-xl px-4 py-2.5 text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: C.graniteMd, color: `${C.stadium}40` }}>
                    Share your story, your stats, your grind...
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: C.graniteL }}>
                  {[{ icon: Video, label: "Highlight Reel", color: "text-red-400" }, { icon: Image, label: "Photo", color: "text-green-400" }, { icon: FileText, label: "Stats", color: "text-blue-400" }, { icon: DollarSign, label: "NIL Deal", color: "text-yellow-400" }].map(a => (
                    <button key={a.label} className={`flex items-center gap-1.5 text-xs ${a.color} hover:opacity-80 transition-opacity flex-1 justify-center`}>
                      <a.icon className="w-4 h-4" /> <span className="hidden sm:inline">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Posts */}
              {FEED_POSTS.map(post => (
                <FeedPostCard key={post.id} post={post} onLike={id => setLikedPosts(s => new Set([...s, id]))} onCredit={addCredits} />
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Credits Widget */}
              <div className="rounded-2xl p-4 border" style={{ background: C.granite, borderColor: `${C.cobalt}40` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4" style={{ color: C.bright }} />
                  <span className="font-black text-sm" style={{ color: C.bright }}>AXN Credits™</span>
                </div>
                <div className="text-3xl font-black text-white mb-1">{credits.toLocaleString()}</div>
                <div className="text-xs mb-3" style={{ color: `${C.stadium}50` }}>${(credits * 0.01).toFixed(2)} cash value</div>
                <div className="space-y-2">
                  {CREDIT_ACTIONS.slice(0, 4).map(a => (
                    <button key={a.action} onClick={() => addCredits(a.credits)}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:opacity-80 transition-opacity"
                      style={{ background: C.graniteMd }}>
                      <span className="flex items-center gap-2 text-white/70"><span>{a.icon}</span>{a.action}</span>
                      <span className="font-black" style={{ color: C.bright }}>+{a.credits}</span>
                    </button>
                  ))}
                </div>
                <Link href="/sign-up">
                  <Button className="w-full mt-3 font-black rounded-xl text-xs" style={{ background: C.electric }}>
                    Activate My Credits
                  </Button>
                </Link>
              </div>

              {/* Who to Follow / Recruit */}
              <div className="rounded-2xl p-4 border" style={{ background: C.granite, borderColor: C.graniteL }}>
                <p className="font-black text-sm text-white mb-3">🎯 Athletes to Recruit</p>
                {FEED_POSTS.filter(p => p.recruitable).slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: `linear-gradient(135deg, ${C.cobalt}, ${C.bright})` }}>
                      {p.user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold truncate">{p.user.name}</p>
                      <p className="text-xs truncate" style={{ color: `${C.stadium}50` }}>{p.user.sport} {p.user.role}</p>
                    </div>
                    <Link href="/nil-portal">
                      <Button size="sm" className="text-[10px] h-6 px-2 rounded-full" style={{ background: C.cobalt, color: C.white }}>
                        Recruit
                      </Button>
                    </Link>
                  </div>
                ))}
                <Link href="/browse-athletes">
                  <Button variant="outline" className="w-full text-xs rounded-xl" style={{ borderColor: `${C.bright}30`, color: C.bright }}>
                    Browse All Athletes <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>

              {/* Sponsor Ad */}
              <SponsorAd ad={SPONSOR_ADS[(adIdx + 1) % SPONSOR_ADS.length]} />

              {/* All Sports Quick Links */}
              <div className="rounded-2xl p-4 border" style={{ background: C.granite, borderColor: C.graniteL }}>
                <p className="font-black text-sm text-white mb-3">⚡ All Sports</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {ALL_SPORTS.slice(0, 16).map(s => (
                    <Link key={s.name} href={s.slug}>
                      <div className="rounded-lg p-1.5 text-center hover:opacity-80 transition-opacity cursor-pointer" style={{ background: C.graniteMd }}>
                        <div className="text-base">{s.icon}</div>
                        <div className="text-[9px] text-white/60 truncate">{s.name.split(" ")[0]}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/all-sports-hub">
                  <Button variant="outline" className="w-full mt-2 text-xs rounded-xl" style={{ borderColor: `${C.bright}30`, color: C.bright }}>
                    All {ALL_SPORTS.length} Sports <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: MESSENGER ═════════════════════════════════════════════════════ */}
        {activeTab === "messenger" && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-white mb-1">AthlynX Messenger™</h2>
              <p className="text-sm" style={{ color: `${C.stadium}60` }}>Athletes · Coaches · Agents · Brands · All in one place. Better than DMs.</p>
            </div>
            <MessengerPanel />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "🏈", title: "Coach Direct", desc: "Coaches message athletes directly. No middleman except Chad.", cta: "Find Coaches", href: "/ai-recruiter" },
                { icon: "💰", title: "Agent Connect", desc: "NIL agents reach out with real deals. All tracked in the OS.", cta: "NIL Portal", href: "/nil-portal" },
                { icon: "🤖", title: "AI Assistant", desc: "Your AthlynXAI OS assistant is always online. Always working.", cta: "Open OS", href: "/athlynxai-os" },
              ].map(c => (
                <div key={c.title} className="rounded-2xl p-5 border text-center" style={{ background: C.granite, borderColor: C.graniteL }}>
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <p className="font-black text-white mb-1">{c.title}</p>
                  <p className="text-xs mb-3" style={{ color: `${C.stadium}60` }}>{c.desc}</p>
                  <Link href={c.href}>
                    <Button size="sm" className="rounded-full text-xs" style={{ background: C.cobalt, color: C.white }}>{c.cta}</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB: DISCOVER ══════════════════════════════════════════════════════ */}
        {activeTab === "discover" && (
          <div className="space-y-8">
            {/* All Sports Grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-white">Every Sport. Nobody Left Out.</h2>
                <Badge className="text-xs" style={{ background: `${C.cobalt}30`, color: C.bright, border: `1px solid ${C.cobalt}40` }}>{ALL_SPORTS.length} Sports</Badge>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
                {ALL_SPORTS.map(s => (
                  <Link key={s.name} href={s.slug}>
                    <div className="rounded-xl p-3 text-center hover:border-[#00c2ff]/40 transition-all cursor-pointer group border"
                      style={{ background: C.granite, borderColor: s.hot ? `${C.cobalt}40` : C.graniteL }}>
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <p className="text-white text-[10px] font-bold group-hover:text-[#00c2ff] transition-colors leading-tight">{s.name}</p>
                      {s.hot && <div className="text-[8px] mt-1" style={{ color: C.bright }}>🔥 HOT</div>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <SponsorAd ad={SPONSOR_ADS[adIdx]} />

            {/* Podcast Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Mic className="w-5 h-5" style={{ color: C.bright }} />
                <h2 className="text-xl font-black text-white">The Athlete's Playbook™ Podcast</h2>
              </div>
              <div className="rounded-2xl p-5 border mb-4" style={{ background: `linear-gradient(135deg, ${C.graniteDk}, ${C.cobaltDk})`, borderColor: `${C.bright}20` }}>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0" style={{ background: `linear-gradient(135deg, ${C.cobalt}, ${C.bright})` }}>🎙️</div>
                  <div>
                    <Badge className="mb-2 text-xs" style={{ background: `${C.bright}20`, color: C.bright, border: `1px solid ${C.bright}30` }}>THE ATHLETE'S PLAYBOOK™</Badge>
                    <h3 className="text-xl font-black text-white mb-1">The Athlete's Playbook</h3>
                    <p className="text-sm text-white/70 mb-1">Hosted by <strong className="text-white">Chad Allen Dozier Sr.</strong> & <strong className="text-white">Lee Marshall</strong></p>
                    <p className="text-xs mb-3" style={{ color: `${C.stadium}40` }}>by AthlynX™ & Dozier Holdings Group™ · © 2026 Chad A. Dozier Sr.</p>
                    <div className="flex flex-wrap gap-2">
                      {SOCIAL_LINKS.slice(0, 4).map(s => (
                        <a key={s.name} href={s.url} target="_blank" rel="noreferrer">
                          <Button size="sm" className={`${s.color} text-white text-xs rounded-full h-7 px-3`}>{s.icon} {s.name}</Button>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {PODCAST_EPISODES.map(ep => (
                  <div key={ep.ep} className="rounded-xl p-4 border transition-all" style={{ background: C.granite, borderColor: ep.live ? `${C.bright}40` : C.graniteL }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: ep.live ? `${C.cobalt}30` : C.graniteMd }}>
                        {ep.live ? <Play className="w-5 h-5" style={{ color: C.bright }} /> : <Lock className="w-4 h-4 text-white/30" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-black" style={{ color: C.bright }}>EP {ep.ep}</span>
                          {ep.live ? <Badge className="text-[10px] bg-green-600/20 text-green-400 border-green-600/30">🔴 LIVE</Badge> : <Badge className="text-[10px] bg-white/10 text-white/40 border-0">COMING SOON</Badge>}
                        </div>
                        <p className="font-black text-white text-sm mb-1">{ep.title}</p>
                        <p className="text-xs" style={{ color: `${C.stadium}50` }}>{ep.desc}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: `${C.stadium}40` }}>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ep.duration}</span>
                          <span>{ep.host}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {ep.live ? (
                          <>
                            <Link href={ep.route}>
                              <Button size="sm" className="text-xs w-full rounded-full" style={{ background: C.electric, color: C.white }}>
                                <Play className="w-3 h-3 mr-1" /> Watch
                              </Button>
                            </Link>
                            {ep.spotify && (
                              <a href={ep.spotify} target="_blank" rel="noreferrer">
                                <Button size="sm" variant="outline" className="border-green-500/40 text-green-400 text-xs w-full rounded-full hover:bg-green-500/10">🎵 Spotify</Button>
                              </a>
                            )}
                          </>
                        ) : (
                          <button onClick={() => addCredits(25)} className="text-xs rounded-full px-3 py-1.5 flex items-center gap-1 transition-colors" style={{ background: C.graniteMd, color: `${C.stadium}60` }}>
                            <Bell className="w-3 h-3" /> Notify +25
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Competitor Comparison */}
            <section className="rounded-2xl p-6 border" style={{ background: `linear-gradient(135deg, ${C.graniteDk}, ${C.granite})`, borderColor: `${C.cobalt}30` }}>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5" style={{ color: C.bright }} />
                <h3 className="text-xl font-black text-white">Why AthlynX Wins. Every Time.</h3>
              </div>
              <p className="text-sm mb-5" style={{ color: `${C.stadium}60` }}>We researched all 20 competitors. Here's what they do vs. what AthlynX does. We win on the work.</p>
              <div className="space-y-3">
                {COMPETITORS.map(c => (
                  <div key={c.name} className="rounded-xl p-3 border" style={{ background: C.graniteMd, borderColor: C.graniteL }}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0">
                        <Badge className="text-[10px] bg-red-900/30 text-red-400 border-red-900/30">{c.name}</Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-red-400/80 mb-1">❌ {c.does}</p>
                        <p className="text-xs text-green-400">✅ AthlynX: {c.athlynx}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs font-black mb-2" style={{ color: C.bright }}>AthlynX is The Company. The Soul Source Provider. Every Industry. Every Human.</p>
                <Link href="/sign-up">
                  <Button className="font-black px-8 rounded-full" style={{ background: C.electric, color: C.white }}>
                    Join AthlynX — It's Free <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </section>

            {/* All Apps */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-white">Every App. One OS.</h2>
                <div className="flex gap-1 overflow-x-auto">
                  {["All", "Core", "Sports", "AI", "Media", "Business"].map(f => (
                    <button key={f} onClick={() => setAppFilter(f)}
                      className="shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all"
                      style={appFilter === f ? { background: C.cobalt, color: C.white } : { background: C.graniteMd, color: `${C.stadium}60` }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {PLATFORM_APPS.filter(a => appFilter === "All" || a.cat === appFilter).map(app => (
                  <Link key={app.name} href={app.href}>
                    <div className="rounded-xl p-4 border hover:border-[#00c2ff]/40 transition-all cursor-pointer group h-full" style={{ background: C.granite, borderColor: app.hot ? `${C.cobalt}30` : C.graniteL }}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{app.icon}</span>
                        {app.hot && <Badge className="text-[9px] bg-red-600/20 text-red-400 border-red-600/30">🔥</Badge>}
                      </div>
                      <p className="font-black text-white text-xs mb-1 group-hover:text-[#00c2ff] transition-colors">{app.name}</p>
                      <p className="text-[10px]" style={{ color: `${C.stadium}50` }}>{app.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ══ TAB: STORE ═════════════════════════════════════════════════════════ */}
        {activeTab === "store" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">AthlynX Gear™</h2>
                <p className="text-xs mt-0.5" style={{ color: `${C.stadium}50` }}>Powered by Shopify · Fulfilled by ICC-USA™ · 11 Products Live</p>
              </div>
              <a href="https://0010yz-fn.myshopify.com" target="_blank" rel="noreferrer">
                <Button size="sm" className="bg-green-700 hover:bg-green-600 text-white text-xs rounded-full">
                  <ShoppingBag className="w-3 h-3 mr-1" /> Full Store
                </Button>
              </a>
            </div>

            <SponsorAd ad={SPONSOR_ADS[0]} />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {SHOPIFY_PRODUCTS.map(p => (
                <a key={p.id} href={p.href} target="_blank" rel="noreferrer">
                  <div className="rounded-xl overflow-hidden border hover:border-[#00c2ff]/50 transition-all group cursor-pointer h-full" style={{ background: C.granite, borderColor: C.graniteL }}>
                    <div className="h-32 flex items-center justify-center relative" style={{ background: C.graniteMd }}>
                      <ShoppingBag className="w-10 h-10 text-white/20 group-hover:text-[#00c2ff]/40 transition-colors" />
                      <Badge className="absolute top-2 left-2 text-[9px] bg-black/60 text-white border-0">{p.badge}</Badge>
                      <Badge className="absolute top-2 right-2 text-[9px]" style={{ background: `${C.cobalt}40`, color: C.bright, border: `1px solid ${C.cobalt}30` }}>{p.type}</Badge>
                    </div>
                    <div className="p-3">
                      <p className="text-white text-xs font-black line-clamp-2 mb-2 group-hover:text-[#00c2ff] transition-colors">{p.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm" style={{ color: C.bright }}>${p.price}</span>
                        <span className="text-[10px] flex items-center gap-0.5" style={{ color: `${C.bright}80` }}>
                          <Zap className="w-2.5 h-2.5" />+50 Credits
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* AXN Credits Earn Loop */}
            <div className="rounded-2xl p-6 border" style={{ background: `linear-gradient(135deg, ${C.cobaltDk}40, ${C.graniteDk})`, borderColor: `${C.cobalt}30` }}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" style={{ color: C.bright }} />
                <h3 className="text-xl font-black" style={{ color: C.bright }}>AXN Credits™ — Earn · Spend · Cash Out</h3>
              </div>
              <p className="text-sm mb-5" style={{ color: `${C.stadium}60` }}>The AthlynX monetary system. Every action earns. Every credit has value. Chad is the only middleman.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {CREDIT_ACTIONS.map(a => (
                  <button key={a.action} onClick={() => addCredits(a.credits)}
                    className="rounded-xl p-3 text-left hover:opacity-80 transition-opacity border"
                    style={{ background: `${C.cobalt}15`, borderColor: `${C.cobalt}25` }}>
                    <span className="text-xl">{a.icon}</span>
                    <p className="text-white text-xs font-bold mt-1">{a.action}</p>
                    <p className="font-black text-sm" style={{ color: C.bright }}>+{a.credits}</p>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[{ label: "Your Credits", value: credits.toLocaleString() }, { label: "Cash Value", value: `$${(credits * 0.01).toFixed(2)}` }, { label: "Potential", value: "∞" }].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center border" style={{ background: `${C.cobalt}15`, borderColor: `${C.cobalt}20` }}>
                    <p className="text-2xl font-black" style={{ color: C.bright }}>{s.value}</p>
                    <p className="text-xs" style={{ color: `${C.stadium}50` }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link href="/sign-up" className="flex-1">
                  <Button className="w-full font-black" style={{ background: C.electric, color: C.white }}>
                    <Rocket className="w-4 h-4 mr-2" /> Activate Credits
                  </Button>
                </Link>
                <Link href="/commerce" className="flex-1">
                  <Button variant="outline" className="w-full" style={{ borderColor: `${C.cobalt}40`, color: C.bright }}>
                    <ShoppingBag className="w-4 h-4 mr-2" /> Redeem for Gear
                  </Button>
                </Link>
              </div>
            </div>

            {/* Licensing */}
            <div className="rounded-2xl p-6 border" style={{ background: `linear-gradient(135deg, ${C.graniteDk}, ${C.granite})`, borderColor: `${C.cobalt}20` }}>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5" style={{ color: C.bright }} />
                <h3 className="text-xl font-black text-white">White-Label Licensing™</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: `${C.stadium}60` }}>Schools, coaches, and organizations can license the AthlynX platform. Chad Dozier Sr. is the only licensor.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[{ icon: "🏫", title: "School License", price: "Contact" }, { icon: "🏋️", title: "Coach License", price: "$199/mo" }, { icon: "🏢", title: "Org License", price: "Custom" }].map(l => (
                  <div key={l.title} className="rounded-xl p-4 border" style={{ background: `${C.cobalt}10`, borderColor: `${C.cobalt}20` }}>
                    <span className="text-2xl">{l.icon}</span>
                    <p className="font-black text-white text-sm mt-2">{l.title}</p>
                    <p className="font-black text-xs mt-1" style={{ color: C.bright }}>{l.price}</p>
                  </div>
                ))}
              </div>
              <a href="mailto:cdozier14@athlynx.ai">
                <Button className="font-black" style={{ background: C.cobalt, color: C.white }}>
                  <Mail className="w-4 h-4 mr-2" /> Contact Chad for Licensing
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* ══ TAB: OS ════════════════════════════════════════════════════════════ */}
        {activeTab === "os" && (
          <div className="space-y-8">
            {/* OS Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 border" style={{ background: `${C.cobalt}15`, borderColor: `${C.bright}30` }}>
                <Cpu className="w-4 h-4" style={{ color: C.bright }} />
                <span className="text-xs font-black tracking-widest" style={{ color: C.bright }}>ATHLYNXAI OS™ — AUTONOMOUS ENGINE</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">One OS. Every Tool. One Middleman.</h2>
              <p className="text-sm max-w-2xl mx-auto" style={{ color: `${C.stadium}60` }}>AthlynXAI OS runs every network, every payment, every credit, every license, every ad — all 7 AI engines working together. Chad Allen Dozier Sr. is the only middleman.</p>
            </div>

            {/* 7 AI Engines */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5" style={{ color: C.bright }} />
                <h3 className="text-xl font-black text-white">7 AI Engines — All Working Together</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AI_STACK.map(ai => (
                  <div key={ai.name} className="rounded-xl p-4 border" style={{ background: `linear-gradient(135deg, ${C.cobalt}30, ${C.graniteDk})`, borderColor: `${C.cobalt}30` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{ai.icon}</span>
                      <p className="font-black text-white text-sm">{ai.name}</p>
                      <span className="relative flex h-2 w-2 ml-auto">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: `${C.stadium}60` }}>{ai.role}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Integration Stack */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5" style={{ color: C.bright }} />
                <h3 className="text-xl font-black text-white">Full Integration Stack</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INTEGRATIONS.map(t => (
                  <div key={t.name} className={`${t.color} rounded-xl p-4 border border-white/10`}>
                    <span className="text-xl">{t.icon}</span>
                    <p className="font-black text-white text-sm mt-2">{t.name}</p>
                    <p className="text-white/60 text-xs mt-1">{t.role}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Autonomous Loop */}
            <section className="rounded-2xl p-6 border" style={{ background: `linear-gradient(135deg, ${C.graniteDk}, ${C.granite})`, borderColor: `${C.bright}20` }}>
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="w-5 h-5" style={{ color: C.bright }} />
                <h3 className="text-xl font-black text-white">The Autonomous Revenue Loop</h3>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-center">
                {[
                  { icon: "👤", label: "Athlete Signs Up" },
                  { icon: "⚡", label: "Supabase Captures" },
                  { icon: "📱", label: "Twilio SMS" },
                  { icon: "✉️", label: "Superhuman Email" },
                  { icon: "🔄", label: "Zapier Triggers" },
                  { icon: "🤖", label: "AI Runner" },
                  { icon: "📅", label: "Buffer Schedules" },
                  { icon: "💰", label: "Credits Earned" },
                  { icon: "👑", label: "Revenue → Chad" },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="rounded-xl p-3 w-20 border" style={{ background: `${C.cobalt}15`, borderColor: `${C.cobalt}20` }}>
                      <div className="text-xl mb-1">{step.icon}</div>
                      <p className="text-white text-[10px] font-bold leading-tight">{step.label}</p>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="w-3 h-3 shrink-0" style={{ color: C.bright }} />}
                  </div>
                ))}
              </div>
            </section>

            {/* Subscription Tiers */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-black text-white">Monthly Tiered Services — Reverse Funnel</h3>
              </div>
              <p className="text-sm mb-6" style={{ color: `${C.stadium}60` }}>Every tier feeds the next. Every athlete becomes recurring revenue. Non-stop. Automated. Chad is the only middleman.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TIERS.map(tier => (
                  <div key={tier.name} className={`rounded-2xl p-5 flex flex-col border-2 ${tier.color} hover:scale-[1.02] transition-transform`} style={{ background: C.granite }}>
                    <Badge className={`${tier.badgeColor} text-white border-0 text-[10px] mb-3 self-start`}>{tier.badge}</Badge>
                    <p className="font-black text-white text-lg">{tier.name}</p>
                    <div className="flex items-end gap-1 my-2">
                      <span className="text-3xl font-black text-white">{tier.price}</span>
                      <span className="text-sm mb-1" style={{ color: `${C.stadium}50` }}>{tier.period}</span>
                    </div>
                    <ul className="space-y-1.5 flex-1 mb-4">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-1.5 text-xs" style={{ color: `${C.stadium}80` }}>
                          <CheckCircle className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />{f}
                        </li>
                      ))}
                    </ul>
                    <a href={tier.href}>
                      <Button className={`w-full ${tier.ctaStyle} text-sm font-black rounded-xl`}>{tier.cta}</Button>
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* IP / Brand / Legal */}
            <section className="rounded-2xl p-6 border" style={{ background: C.graniteDk, borderColor: C.graniteL }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-white/40" />
                <h3 className="text-lg font-black text-white/60">Brand · Copyright · Trademark · Patent · License</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { icon: "©", label: "Copyright", desc: "All content, code, and media © 2026 Chad A. Dozier Sr." },
                  { icon: "™", label: "Trademark", desc: "AthlynX™ · AthlynXAI™ · AXN™ · AVN™ · NIL Portal™ · Diamond Grind™ · Warriors Playbook™" },
                  { icon: "®", label: "Patent Pending", desc: "AthlynXAI OS architecture, AXN Credits system, Connect Anyone to Anything™" },
                  { icon: "📜", label: "License", desc: "White-label licensing available — cdozier14@athlynx.ai" },
                  { icon: "🔐", label: "IP Protection", desc: "All source code, workflows, and product concepts are proprietary IP" },
                  { icon: "👑", label: "Founder", desc: "Chad Allen Dozier Sr. — Sole Founder, Owner, and Only Middleman" },
                ].map(item => (
                  <div key={item.label} className="rounded-xl p-3 border" style={{ background: C.graniteMd, borderColor: C.graniteL }}>
                    <div className="text-2xl font-black text-white/40 mb-1">{item.icon}</div>
                    <p className="font-black text-white text-xs mb-1">{item.label}</p>
                    <p className="text-[10px]" style={{ color: `${C.stadium}40` }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: `${C.stadium}30` }}>
                © 2026 Chad A. Dozier Sr. and affiliated Dozier Holdings Group / AthlynX entities. All rights reserved. AthlynX™, AthlynXAI™, AXN™, AVN™, AthlynX Medical™, Medical BioSignal OS™, GlucoAthlete OS™, BioSignal Channel™, The Athlete's Playbook™, NIL Portal™, Diamond Grind™, Gridiron Nexus™, Pitch Pulse™, Court Kings™, Reel Masters™, Warriors Playbook™, NIL Vault™, Transfer Portal™, Fuel Bots™, AXN Credits™, Connect Anyone to Anything™, Be The Legacy™, and Soul Source Provider™ are proprietary marks. Formal trademark, copyright, and patent filings in progress. Iron Sharpens Iron — Proverbs 27:17.
              </p>
            </section>

            <SponsorAd ad={SPONSOR_ADS[(adIdx + 2) % SPONSOR_ADS.length]} />

            {/* Final CTA */}
            <div className="text-center py-8">
              <h3 className="text-2xl font-black text-white mb-2">Ready to Enter the OS?</h3>
              <p className="text-sm mb-6" style={{ color: `${C.stadium}60` }}>One platform. Every tool. Every connection. Every dollar — through AthlynXAI OS. Chad is the only middleman.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/sign-up">
                  <Button className="font-black px-8 py-3 rounded-full text-sm" style={{ background: C.electric, color: C.white }}>
                    <Rocket className="w-4 h-4 mr-2" /> Enter AthlynXAI OS
                  </Button>
                </Link>
                <Link href="/athlynxai-os">
                  <Button variant="outline" className="rounded-full px-8 py-3 text-sm" style={{ borderColor: `${C.bright}40`, color: C.bright }}>
                    <Cpu className="w-4 h-4 mr-2" /> View Full OS
                  </Button>
                </Link>
                <a href="mailto:cdozier14@athlynx.ai">
                  <Button variant="outline" className="rounded-full px-8 py-3 text-sm" style={{ borderColor: `${C.cobalt}60`, color: `${C.stadium}80` }}>
                    <Mail className="w-4 h-4 mr-2" /> Contact Chad
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <MobileBottomNav />
    </div>
  );
}

export default function AthlynXNetwork() {
  return (
    <RouteErrorBoundary>
      <AthlynXNetworkInner />
    </RouteErrorBoundary>
  );
}
