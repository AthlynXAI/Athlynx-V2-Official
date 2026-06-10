import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from 'wouter';
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Play, Pause, SkipForward, SkipBack, Volume2, Clock, Mic, Headphones, Radio, ExternalLink, ChevronRight, Share2, Download, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const SHOW_INFO = {
  title: "The Athlete's Playbook Podcast",
  subtitle: "by AthlynX & Dozier Holdings Group",
  description: "The Athlete’s Playbook is the official AthlynXAI podcast and AXN media lane for NIL, branding, mental performance, recruiting, and the full athlete lifecycle. Hosted by Chad Allen Dozier Sr. and Lee Marshall, the show brings athletes into a free-access network while premium AthlynXAI OS tiers and credits power advanced media, recruiting, AI, and brand-growth workflows.",
  host: "Chad Allen Dozier Sr. & Lee Marshall",
  hostTitle: "Founder-led media lane — AthlynXAI OS, AXN, Spotify, Suno, and live-data workflows",
  frequency: "Season 1 — Episode packages staged through AthlynXAI Media OS",
  categories: ["Sports", "Business", "NIL", "Recruiting", "Transfer Portal", "Athlete Development"],
};

const PLATFORMS = [
  { name: "Apple Podcasts", icon: "🎧", url: "https://podcasts.apple.com", color: "from-blue-700 to-blue-900" },
  { name: "Spotify", icon: "🎵", url: "https://open.spotify.com", color: "from-green-600 to-green-800" },
  { name: "YouTube", icon: "▶️", url: "https://youtube.com/@athlynxai", color: "from-red-600 to-red-800" },
  { name: "Amazon Music", icon: "🎶", url: "https://music.amazon.com", color: "from-cyan-600 to-cyan-800" },
  { name: "iHeart Radio", icon: "📻", url: "https://iheart.com", color: "from-red-500 to-red-700" },
  { name: "Pocket Casts", icon: "🎙️", url: "https://pocketcasts.com", color: "from-cyan-600 to-cyan-800" },
  { name: "TikTok", icon: "📱", url: "https://tiktok.com/@athlynxai", color: "from-pink-600 to-purple-800" },
  { name: "Instagram", icon: "📸", url: "https://instagram.com/athlynxai", color: "from-purple-600 to-pink-700" },
];

const EPISODES = [
  {
    id: 1,
    number: "EP 001",
    title: "Why I Built AthlynX — The Origin Story",
    description: "Chad A. Dozier shares the full story behind AthlynX — how a long road, an athlete's eye, and an honest plan led to the most comprehensive athlete platform in the world.",
    duration: "48:32",
    date: "April 15, 2026",
    season: 1,
    tags: ["Origin Story", "AthlynX", "DHG"],
    featured: true,
  },
  {
    id: 2,
    number: "EP 002",
    title: "NIL Deals Explained: What Every Athlete Needs to Know",
    description: "Breaking down Name, Image, and Likeness deals from the ground up. What they are, how they work, what to watch out for, and how AthlynX helps athletes maximize their NIL value.",
    duration: "42:15",
    date: "April 22, 2026",
    season: 1,
    tags: ["NIL", "Education", "Money"],
    featured: false,
  },
  {
    id: 3,
    number: "EP 003",
    title: "Transfer Portal: Navigating the New Recruiting Landscape",
    description: "The transfer portal has changed college athletics forever. We break down the windows, the rules, the dead periods, and how athletes can use AthlynX to manage the entire process.",
    duration: "51:08",
    date: "April 29, 2026",
    season: 1,
    tags: ["Transfer Portal", "Recruiting", "NCAA"],
    featured: false,
  },
  {
    id: 4,
    number: "EP 004",
    title: "Building Your Brand: Social Media for Athletes",
    description: "Your brand is your business. Learn how to build a social media presence that attracts NIL deals, connects with fans, and positions you for success beyond sports. TikTok, Instagram, and the AthlynX Feed.",
    duration: "39:45",
    date: "May 6, 2026",
    season: 1,
    tags: ["Social Media", "Branding", "TikTok"],
    featured: false,
  },
  {
    id: 5,
    number: "EP 005",
    title: "Agents, Lawyers & Financial Advisors: Your Team Off the Field",
    description: "Every athlete needs a team beyond the field. We talk to sports agents, attorneys, and financial advisors about what athletes should look for, red flags to avoid, and how to protect your money.",
    duration: "55:20",
    date: "May 13, 2026",
    season: 1,
    tags: ["Agents", "Legal", "Finance"],
    featured: false,
  },
  {
    id: 6,
    number: "EP 006",
    title: "From Youth Sports to the Pros: The Full Athlete Lifecycle",
    description: "AthlynX captures athletes from the moment they start to the moment they retire. We discuss every stage — youth, high school, college, professional, and post-career — and what tools athletes need at each step.",
    duration: "47:55",
    date: "May 20, 2026",
    season: 1,
    tags: ["Youth Sports", "Career", "Lifecycle"],
    featured: false,
  },
  {
    id: 7,
    number: "EP 007",
    title: "AI in Sports: How AthlynX Uses Artificial Intelligence",
    description: "From AI recruiting assistants to content creation bots to training analytics — we reveal how AthlynX is using artificial intelligence to give athletes an unfair advantage.",
    duration: "44:10",
    date: "May 27, 2026",
    season: 1,
    tags: ["AI", "Technology", "Innovation"],
    featured: false,
  },
  {
    id: 8,
    number: "EP 008",
    title: "The Diamond Grind: Baseball's Digital Revolution",
    description: "Baseball is being transformed by data and technology. We dive into Diamond Grind — AthlynX's baseball-specific platform — and how it's changing training, scouting, and recruiting for America's pastime.",
    duration: "43:30",
    date: "June 3, 2026",
    season: 1,
    tags: ["Baseball", "Diamond Grind", "Analytics"],
    featured: false,
  },
];

const UPCOMING_GUESTS = [
  { name: "College Football Coach", topic: "Recruiting in the NIL Era", date: "June 2026" },
  { name: "Top NIL Agent", topic: "Negotiating Your First Deal", date: "June 2026" },
  { name: "Financial Advisor", topic: "Managing Athlete Wealth", date: "July 2026" },
  { name: "Transfer Portal Expert", topic: "Maximizing Your Portal Entry", date: "July 2026" },
  { name: "Sports Attorney", topic: "Contracts Every Athlete Should Understand", date: "August 2026" },
];

const PODCAST_MEDIA = [
  {
    title: "Episode 1 — The Athlete’s Playbook Podcast",
    label: "Main podcast video",
    src: "/media/podcast/athlynx-episode1-diverse-all-sports-review.mp4",
    poster: "/media/podcast/athlynx-logo-lockup-black.png",
    description: "Lee’s voice leads Episode 1 over a controlled professional music bed with brand-new AthlynX visuals, diverse athletes, all-sports energy, Media OS review, Spotify for Creators packaging, AXN clips, and social distribution after connector approval.",
  },
  {
    title: "Episode 1 — Season 1 Video 3",
    label: "AthlynXAI media-network reel",
    src: "/media/podcast/episode-1/athlynx-episode1-season1-video3.mp4",
    poster: "/media/podcast/athlynx-logo-lockup-black.png",
    description: "A polished Athlete’s Playbook Season 1 Episode 1 Video 3 reel built from the approved legacy source packet with no duplicate source use. Chad and Lee open the piece, Lee’s latest voice memo leads the audio, and the AthlynXAI OS v1 media lane connects Spotify, Spotify for Creators, Suno, Vimeo, AXN, and AthlynXAI-owned proof.",
  },
  {
    title: "Podcast Studio Clip",
    label: "Studio cut",
    src: "/media/podcast/athletes-playbook-podcast-studio-labeled.mp4",
    poster: "/media/podcast/athlynxai-mobile-splash.png",
    description: "Short-form studio cut with premium AthlynXAI banner labels for teasers, reels, and owned-channel traffic loops.",
  },
  {
    title: "Platform Reveal Clip",
    label: "AXN / platform cut",
    src: "/media/podcast/athletes-playbook-platform-reveal-labeled.mp4",
    poster: "/media/podcast/athlynxai-mobile-splash.png",
    description: "Premium labeled platform reveal cut that routes attention back into AthlynXAI OS, athlete profiles, and AXN programming.",
  },
];


const CHAMPIONSHIP_VISUALS = [
  { src: "/media/championship-brand/episode-2/scene01-multisport-walkout.png", title: "Multi-sport walkout", lane: "Athlete Playbook · Recruiting · AXN" },
  { src: "/media/championship-brand/episode-2/scene02-branded-gear-wall.png", title: "Branded gear wall", lane: "AthlynX Sportswear · Retail" },
  { src: "/media/championship-brand/episode-2/scene03-football-equipment.png", title: "Football equipment", lane: "Football · NIL · Team Store" },
  { src: "/media/championship-brand/episode-2/scene04-baseball-softball.png", title: "Baseball and softball", lane: "Diamond sports · Recruiting" },
  { src: "/media/championship-brand/episode-2/scene05-training-retail.png", title: "Training and retail", lane: "Training · Marketplace · Vendors" },
  { src: "/media/championship-brand/episode-2/scene06-women-led-multisport.png", title: "Women-led multi-sport", lane: "Women athletes · Leadership · AXN" },
  { src: "/media/championship-brand/episode-2/scene07-cleats-gloves-balls.png", title: "Cleats, gloves, and balls", lane: "Equipment · Merch · Product drops" },
  { src: "/media/championship-brand/episode-2/scene08-helmet-bag-hat-eyewear.png", title: "Helmet, bag, hat, eyewear", lane: "Accessories · Brand wall · Retail" },
  { src: "/media/championship-brand/episode-2/scene09-live-store-marketplace.png", title: "Live store marketplace", lane: "Vendor marketplace · OS commerce" },
  { src: "/media/championship-brand/episode-2/scene10-final-brand-wall.png", title: "Final all-sports brand wall", lane: "Championship identity · All sports" },
];

const MARKETPLACE_LANES = [
  "Athletes, coaches, teams, schools, families, and recruiting workflows",
  "AXN, AVN, podcasting, short-form video, social media, music beds, and owned media",
  "AthlynX sportswear, equipment, retail drops, vendor storefronts, and live-store commerce",
  "Medical, wellness, performance, recovery, privacy-first readiness signals, and human oversight",
  "Lawyers, accounting, contracts, compliance support, state-law awareness, and business operations",
  "Salesforce/CRM, agents, financial advisors, sponsors, donors, partners, and relationship follow-up",
  "Faith, Devotions, Fellowship of Christian Athletes, daily devotion content, and Founder Blog motivation",
  "Software, hardware, data, data centers, energy strategy, automation, connectors, proof logs, and owner approval gates",
];

const LAYER_CAKE_SIGNALS = [
  "Nebius H200 compute lane for future live-data and AI inference workflows",
  "AthlynXAI Media OS as the source of truth for vault, approval, queue, proof, and watchdog",
  "Spotify and Spotify for Creators as podcast distribution rails, not the operating brain",
  "Suno as the soundtrack, music-bed, and audio identity lane with metadata and rights notes",
  "AXN as the streaming-network layer for shows, seasons, episodes, clips, and athlete stories",
  "Reverse-funnel routing back to AthlynXAI-owned pages, signups, athlete brands, and NIL/recruiting workflows",
  "Free athlete entry plus paid OS tiers and credits for premium AI, media, recruiting, and brand-growth services",
];

const QUALITY_ALGORITHMS = [
  { label: "Video Score", rule: "Hook, retention, multi-sport representation, diversity, premium AthlynXAI banner labels, caption clarity, thumbnail strength, and platform aspect ratio." },
  { label: "Audio Score", rule: "Lee’s voice clarity, no echo, podcast loudness target, transcript readiness, controlled music-bed balance, and show-note completeness." },
  { label: "Brand Score", rule: "Highlights, stories, stats, podcast clips, NIL/recruiting value, social proof, consistency, and engagement quality." },
  { label: "Distribution Score", rule: "Channel fit, caption variant, CTA strength, UTM route, connector health, proof capture, and retry readiness." },
  { label: "Integrity Score", rule: "Athlete-first sports media only: no sports betting, gambling, odds, picks, wagering, or sportsbook positioning." },
  { label: "Access Score", rule: "Free athlete entry stays open while paid tiers and credits fund premium AI, media, recruiting, and service workflows." },
];

function PodcastInner() {
  const [playingEpisode, setPlayingEpisode] = useState<number | null>(null);
  const [expandedEpisode, setExpandedEpisode] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-[#0a1628] to-cyan-900/30" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(0,212,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147,51,234,0.3) 0%, transparent 50%)' }} />
        
        <div className="container relative py-16 md:py-24">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-500">Podcast</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-full text-xs text-blue-300 font-semibold">
                  NEW EPISODES WEEKLY
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                The Athlete's<br />
                <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Playbook Podcast
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {SHOW_INFO.description}
              </p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Headphones className="w-4 h-4 text-blue-500" />
                  <span>{EPISODES.length} Episodes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{SHOW_INFO.frequency}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4 text-red-400" />
                  <span>Season 1</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setPlayingEpisode(1)}
                  className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-bold"
                >
                  <Play className="w-5 h-5 mr-2" /> Play Latest Episode
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-xl">
                  <Radio className="w-5 h-5 mr-2" /> Subscribe
                </Button>
              </div>
            </div>

            {/* Podcast Cover Art */}
            <div className="flex justify-center">
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-3xl shadow-2xl shadow-blue-600/30 transform rotate-3" />
                <img
                  src="/media/podcast/athletes-playbook-spotify-card.png"
                  alt="The Athlete's Playbook Podcast cover art with AthlynXAI branding"
                  className="relative w-full h-full object-cover rounded-3xl border border-white/20 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listen On Platforms */}
      <div className="container py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Listen On</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PLATFORMS.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              className={`bg-gradient-to-br ${platform.color} rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="text-3xl mb-2">{platform.icon}</div>
              <div className="text-sm font-semibold">{platform.name}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Podcast Video Assets */}
      <div className="container py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-cyan-300 text-xs font-black tracking-[0.25em] uppercase">Media OS Vault</p>
            <h2 className="text-3xl font-black mt-2">Episode 1 Video Package</h2>
            <p className="text-gray-400 mt-2 max-w-3xl">
              These podcast assets are staged inside AthlynXAI OS first. Episode 1 keeps Lee’s voice as the lead track, uses a controlled professional music bed, and feeds Spotify for Creators, AXN, Suno-backed soundtrack lanes, and social distribution only after approval and connector proof.
            </p>
          </div>
          <Link href="/media-os" className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-500 text-[#061426] rounded-xl font-black hover:bg-cyan-400 transition">
            Open Media OS <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {PODCAST_MEDIA.map((asset) => (
            <article key={asset.src} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
              <div className="relative bg-black aspect-[9/16] max-h-[560px]">
                <video
                  className="w-full h-full object-contain bg-black"
                  src={asset.src}
                  poster={asset.poster}
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="p-5">
                <div className="text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">{asset.label}</div>
                <h3 className="text-xl font-black mb-2">{asset.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{asset.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>


      {/* Championship Visual Rollout */}
      <div className="container py-12">
        <div className="bg-gradient-to-br from-[#031021] via-[#0a2347] to-[#020712] border border-cyan-400/20 rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-950/40">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
            <div>
              <p className="text-cyan-300 text-xs font-black tracking-[0.25em] uppercase">Championship Visual System</p>
              <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">The sharp, clean look for the apps, website, and platform.</h2>
              <p className="text-blue-100 leading-relaxed max-w-4xl">
                These ten new approved AthlynXAI visuals are now staged for the website, app surfaces, podcast rail, AXN/AVN programming, sportswear/equipment, vendor marketplace, athlete profiles, and daily motivation lanes. Existing assets stay in place; this package adds the championship dark-blue visual system on top.
              </p>
            </div>
            <Link href="/athlynxai-os" className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-500 text-[#061426] rounded-xl font-black hover:bg-cyan-400 transition whitespace-nowrap">
              Open AthlynXAI OS <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CHAMPIONSHIP_VISUALS.map((visual) => (
              <article key={visual.src} className="bg-black/35 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-300/40 transition">
                <img src={visual.src} alt={`${visual.title} AthlynXAI championship visual`} className="w-full aspect-[4/5] object-cover" loading="lazy" />
                <div className="p-4">
                  <h3 className="font-black text-white text-sm">{visual.title}</h3>
                  <p className="text-cyan-200 text-xs mt-1 leading-relaxed">{visual.lane}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Marketplace Doctrine Expansion */}
      <div className="container py-12">
        <div className="bg-[#07111f] border border-blue-400/20 rounded-3xl p-6 md:p-8">
          <p className="text-cyan-300 text-xs font-black tracking-[0.25em] uppercase">All-In-One Layer Cake</p>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Everything belongs in one governed AthlynXAI OS.</h2>
          <p className="text-gray-300 leading-relaxed max-w-4xl mb-6">
            The platform is positioned as one operating system for athletes, media, marketplace commerce, professional services, advisors, Faith/FCA/devotions, and founder motivation. External tools and service providers are rails; AthlynXAI OS owns the source of truth, approvals, proof logs, and relationship record.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {MARKETPLACE_LANES.map((lane) => (
              <div key={lane} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-blue-100 leading-relaxed">{lane}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Stack Layer Cake */}
      <div className="container py-12">
        <div className="bg-gradient-to-br from-[#061426] via-[#0b2a55] to-[#061426] border border-cyan-400/20 rounded-3xl p-6 md:p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-cyan-300 text-xs font-black tracking-[0.25em] uppercase">Full Stack Layer Cake</p>
              <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Podcast, AXN, Suno, Spotify, live data, and Nebius H200 in one owned loop.</h2>
              <p className="text-blue-100 leading-relaxed">
                The Athlete’s Playbook is more than a podcast page. It is the front door into AthlynXAI’s owned Media OS: creation, vault, quality scoring, Lee review, Chad approval, queue, connector check, distribution, proof, analytics, and the next-content loop. Episode 1 uses Lee’s voice, professional background music, and multi-sport visuals while Nebius H200 becomes the compute lane for future live-data and AI inference workflows; AthlynXAI owns the source code and traffic routes.
              </p>
            </div>
            <div className="grid gap-3">
              {LAYER_CAKE_SIGNALS.map((signal) => (
                <div key={signal} className="bg-black/25 border border-white/10 rounded-xl p-4 text-sm text-blue-100">{signal}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Episode 2 Teaser */}
      <div className="container py-12">
        <div className="bg-white/5 border border-cyan-400/20 rounded-3xl p-6 md:p-8">
          <p className="text-cyan-300 text-xs font-black tracking-[0.25em] uppercase">Next Episode</p>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Episode 2 — Chad and Lee live.</h2>
          <p className="text-gray-300 leading-relaxed max-w-4xl">
            The next episode brings Chad Allen Dozier Sr. and Lee Marshall together live: best friends, former teammates, classmates, and now business partners building The Athlete’s Playbook, AXN, and AthlynXAI OS for the athletes they represent. The tone is sports-native, bold, and entertaining, but cleaner, athlete-first, and fully owned by AthlynXAI.
          </p>
        </div>
      </div>

      {/* Access Model */}
      <div className="container py-12">
        <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-400/20 rounded-3xl p-6 md:p-8">
          <p className="text-cyan-300 text-xs font-black tracking-[0.25em] uppercase">Access Model</p>
          <h2 className="text-3xl font-black mt-3 mb-4">Free to enter. Powerful when you need more.</h2>
          <p className="text-gray-300 leading-relaxed max-w-4xl">
            AthlynXAI is built so athletes can enter the network without being denied access by cost. The free layer opens the door to profiles, discovery, and the athlete community. Paid tiers and credits then power the operating-system layers: Media OS, AI content, recruiting intelligence, premium video and audio, NIL campaigns, brand kits, analytics, and hands-on services.
          </p>
          <p className="text-gray-400 mt-4 text-sm max-w-4xl">
            The model is simple: free builds the crowd; tiers and credits monetize the machine without locking athletes out of the ecosystem.
          </p>
        </div>
      </div>

      {/* Brand Integrity */}
      <div className="container py-12">
        <div className="bg-[#07111f] border border-white/10 rounded-3xl p-6 md:p-8">
          <p className="text-blue-300 text-xs font-black tracking-[0.25em] uppercase">Brand Integrity</p>
          <h2 className="text-3xl font-black mt-3 mb-4">Sports media without betting.</h2>
          <p className="text-gray-300 leading-relaxed max-w-4xl">
            AthlynXAI is athlete-first. The Athlete’s Playbook, AXN, Media OS, and every social distribution lane stay focused on NIL, recruiting, branding, education, performance, and owned traffic loops. No sportsbook integrations, odds, picks, wagering, gambling language, or betting-adjacent monetization belongs in this ecosystem.
          </p>
        </div>
      </div>

      {/* Quality Algorithms */}
      <div className="container py-12">
        <h2 className="text-3xl font-black mb-3">Quality Algorithms Baked In</h2>
        <p className="text-gray-400 mb-6 max-w-3xl">
          Every podcast, video, audio bed, athlete brand asset, and social package should score before it ships. The goal is professional output, clean proof, no dropped posts, and traffic routed back to AthlynXAI-owned surfaces.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUALITY_ALGORITHMS.map((item) => (
            <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-400/30 transition">
              <h3 className="font-black text-cyan-300 mb-2">{item.label}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Episode */}
      {EPISODES.filter(e => e.featured).map(ep => (
        <div key={ep.id} className="container py-8">
          <div className="bg-gradient-to-r from-blue-950/50 to-cyan-900/50 border border-blue-600/30 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm font-bold">FEATURED EPISODE</span>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="text-blue-500 text-sm font-bold mb-2">{ep.number} · {ep.date}</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{ep.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{ep.description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button 
                    onClick={() => setPlayingEpisode(playingEpisode === ep.id ? null : ep.id)}
                    className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white rounded-xl"
                  >
                    {playingEpisode === ep.id ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {playingEpisode === ep.id ? 'Pause' : 'Play Episode'}
                  </Button>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" /> {ep.duration}
                  </div>
                  <button className="text-gray-400 hover:text-white transition"><Share2 className="w-4 h-4" /></button>
                  <button className="text-gray-400 hover:text-white transition"><Download className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 content-start">
                {ep.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* All Episodes */}
      <div className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">All Episodes</h2>
            <p className="text-gray-400 mt-1">Season 1 · {EPISODES.length} episodes</p>
          </div>
        </div>

        <div className="space-y-4">
          {EPISODES.map((ep) => (
            <div
              key={ep.id}
              className={`bg-white/5 border rounded-xl p-6 transition-all cursor-pointer hover:border-blue-600/40 ${
                playingEpisode === ep.id ? 'border-blue-600/60 bg-blue-950/20' : 'border-white/10'
              }`}
              onClick={() => setExpandedEpisode(expandedEpisode === ep.id ? null : ep.id)}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); setPlayingEpisode(playingEpisode === ep.id ? null : ep.id); }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition ${
                    playingEpisode === ep.id 
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {playingEpisode === ep.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-blue-500 text-xs font-bold">{ep.number}</span>
                    <span className="text-gray-500 text-xs">{ep.date}</span>
                    <span className="text-gray-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {ep.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{ep.title}</h3>
                  {expandedEpisode === ep.id && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-sm leading-relaxed mb-3">{ep.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {ep.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-400">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); }} className="text-gray-500 hover:text-white transition p-2"><Share2 className="w-4 h-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); }} className="text-gray-500 hover:text-white transition p-2"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Guests */}
      <div className="container py-12">
        <h2 className="text-3xl font-bold mb-2">Upcoming Guests</h2>
        <p className="text-gray-400 mb-8">Coming soon on The Athlete's Playbook</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {UPCOMING_GUESTS.map((guest, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-600/30 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-500/30 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-xs text-gray-500">{guest.date}</div>
              </div>
              <h3 className="font-bold mb-1">{guest.name}</h3>
              <p className="text-sm text-gray-400">{guest.topic}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About the Host */}
      <div className="container py-12">
        <div className="bg-gradient-to-r from-[#0f1f3a] to-[#1a2a4a] border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-700 to-cyan-600 flex items-center justify-center text-6xl font-black">
                CD
              </div>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-2">About the Host</h2>
              <h3 className="text-xl text-cyan-400 font-semibold mb-4">{SHOW_INFO.host}</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {SHOW_INFO.hostTitle}. Chad built AthlynX from the ground up to give every athlete — 
                from youth sports to retirement — the tools they need to succeed on and off the field. 
                His long road — from athlete to entrepreneur to founder — is the foundation of 
                everything AthlynX stands for.
              </p>
              <p className="text-gray-400 leading-relaxed">
                On The Athlete's Playbook Podcast, Chad brings real conversations with the people who 
                are shaping the future of athlete success — no fluff, no gatekeeping, just the playbook 
                every athlete needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss an Episode</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Subscribe to The Athlete's Playbook Podcast on your favorite platform and get new episodes every Tuesday.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="px-8 py-3 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-xl font-bold hover:opacity-90 transition">
              Join AthlynX Free
            </Link>
            <Link href="/" className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl font-bold hover:bg-white/20 transition">
              Explore the Platform
            </Link>
          </div>
        </div>
      </div>

      {/* Now Playing Bar */}
      {playingEpisode && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0f1729]/95 backdrop-blur-xl border-t border-blue-600/30 px-4 py-3 z-50">
          <div className="container flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-cyan-600 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">
                {EPISODES.find(e => e.id === playingEpisode)?.title}
              </div>
              <div className="text-xs text-gray-400">The Athlete's Playbook Podcast</div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-white transition"><SkipBack className="w-5 h-5" /></button>
              <button 
                onClick={() => setPlayingEpisode(null)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center"
              >
                <Pause className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition"><SkipForward className="w-5 h-5" /></button>
              <button className="text-gray-400 hover:text-white transition hidden md:block"><Volume2 className="w-5 h-5" /></button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="container mt-2">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full w-1/3 transition-all" />
            </div>
          </div>
        </div>
      )}
      <MobileBottomNav />
    </div>
  );
}

export default function Podcast() {
  return <RouteErrorBoundary><PodcastInner /></RouteErrorBoundary>;
}
