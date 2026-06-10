import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * SEOManager: Automatically sets page title, meta description, and meta keywords
 * for every route change. Drop this once in App.tsx and all 110+ pages get SEO.
 */

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
}

const SEO_MAP: Record<string, SEOConfig> = {
  "/": {
    title: "AthlynX – We help the athletes. NIL hyped up on AI.",
    description: "We help the athletes — Name, Image & Likeness, hyped up on AI. The all-in-one athlete platform for NIL deals, transfer portal intelligence, college recruiting, AI training, financial advisors, sports agents, and lawyers. Youth to retirement. Every sport. Every athlete. Better than Hudl, On3, 247Sports, and Perfect Game.",
    keywords: "AthlynX, athlete platform, NIL deals, NIL AI, name image likeness AI, transfer portal, college recruiting, AI training, sports agent, sports lawyer, financial advisor athletes, athlete-owned NIL, Hudl alternative, On3 alternative",
  },
  "/nil-marketplace": {
    title: "NIL Marketplace – Find & Sign NIL Deals | AthlynX",
    description: "Browse and sign NIL deals on the AthlynX marketplace. Connect with brands, NIL collectives, and sponsors. Calculate your NIL valuation. The best NIL deal platform for college and high school athletes.",
    keywords: "NIL marketplace, NIL deals, NIL collective, athlete sponsorship, brand deals, NIL platform, college athlete NIL",
  },
  "/nil-calculator": {
    title: "NIL Calculator – Calculate Your NIL Value | AthlynX",
    description: "Calculate your Name Image Likeness value with the AthlynX NIL Calculator. Based on social media following, sport, performance, and market size.",
    keywords: "NIL calculator, NIL valuation, athlete NIL value, name image likeness calculator, NIL worth",
  },
  "/nil-portal": {
    title: "NIL Portal – Manage Your NIL Deals & Contracts | AthlynX",
    description: "Manage all your NIL deals, contracts, and brand partnerships in one place. Track earnings, review offers, and connect with NIL collectives.",
    keywords: "NIL portal, NIL contract management, NIL earnings tracker, athlete NIL dashboard",
  },
  "/nil-vault": {
    title: "NIL Vault – Secure Your NIL Assets | AthlynX",
    description: "Store and protect your NIL contracts, brand deals, and financial documents in the AthlynX NIL Vault.",
    keywords: "NIL vault, NIL contract storage, athlete document vault",
  },
  "/transfer-portal": {
    title: "Transfer Portal – NCAA Transfer Portal Intelligence | AthlynX",
    description: "Real-time NCAA transfer portal tracking, school matching, and coach connections. Navigate transfer windows for football, basketball, baseball, and every sport.",
    keywords: "NCAA transfer portal, transfer portal tracker, college transfer, transfer portal dates, transfer portal window, football transfer portal, basketball transfer portal",
  },
  "/transfer-intelligence": {
    title: "Transfer Intelligence – AI Transfer Portal Analytics | AthlynX",
    description: "AI-powered transfer portal analytics. School matching algorithms, coach connection tools, and transfer window calendars for every NCAA sport.",
    keywords: "transfer portal intelligence, transfer analytics, AI transfer portal, school matching",
  },
  "/transfer-portal-fos": {
    title: "Transfer Portal FOS – Freedom of Sport | AthlynX",
    description: "Navigate the transfer portal with AthlynX Freedom of Sport system. Track entries, find schools, connect with coaches.",
    keywords: "transfer portal FOS, freedom of sport, transfer system",
  },
  "/signing-day": {
    title: "Signing Day – Commitments & Letters of Intent | AthlynX",
    description: "Track National Signing Day commitments, letters of intent, and scholarship offers across all sports.",
    keywords: "signing day, national signing day, letter of intent, NLI, scholarship commitment",
  },
  "/athlete-dashboard": {
    title: "Athlete Dashboard – Recruiting Command Center | AthlynX",
    description: "Your all-in-one athlete dashboard. Track recruiting activity, NIL deals, transfer portal status, training progress, and communications.",
    keywords: "athlete dashboard, recruiting dashboard, athlete command center, recruiting tracker",
  },
  "/athlete-playbook": {
    title: "The Athlete Playbook – Boost Recruiting & Media Profile | AthlynX",
    description: "The Athlete Playbook shows how AthlynX boosts your recruiting presence and media profile. Connect with athletes globally.",
    keywords: "athlete playbook, recruiting playbook, athlete media profile, recruiting presence",
  },
  "/athlete-website-builder": {
    title: "Athlete Website Builder – Recruiting Website | AthlynX",
    description: "Build your professional athlete website in minutes. Showcase highlights, stats, academics, and contact info.",
    keywords: "athlete website builder, recruiting website, athlete portfolio, sports website builder",
  },
  "/ai-training-bot": {
    title: "AI Training Bot – AI Athletic Training | AthlynX",
    description: "Train smarter with AthlynXAI Training Bot. Personalized workout plans, technique analysis, injury prevention, and performance optimization.",
    keywords: "AI training bot, AI athletic training, AI workout, AI sports training, athlete AI assistant",
  },
  "/ai-recruiter": {
    title: "AI Recruiter – AI College Recruiting Assistant | AthlynX",
    description: "Let AI find your perfect college match. AthlynXAI Recruiter analyzes your stats, academics, and preferences to connect you with the right schools.",
    keywords: "AI recruiter, AI recruiting assistant, AI college matching, AI scout, automated recruiting",
  },
  "/ai-content": {
    title: "AI Content Creator – Highlight Reels & Content | AthlynX",
    description: "Create professional highlight reels, recruiting videos, and social media content with AthlynXAI Content Creator.",
    keywords: "AI content creator, highlight reel creator, recruiting video, athlete content",
  },
  "/ai-sales": {
    title: "AI Sales – Athlete Brand Monetization | AthlynX",
    description: "AI-powered brand monetization and sales tools for athletes. Maximize your NIL value and brand partnerships.",
    keywords: "AI sales athletes, athlete brand monetization, NIL sales, athlete marketing",
  },
  "/wizards": {
    title: "Wizards – Professional Services for Athletes | AthlynX",
    description: "AI-powered professional services: sports agents, financial advisors, lawyers, scouts, career counselors, scholarship finders, and life coaches.",
    keywords: "athlete wizards, sports agent, financial advisor athletes, sports lawyer, AI scout",
  },
  "/wizards/agent": {
    title: "Agent Wizard – Find a Sports Agent | AthlynX",
    description: "Connect with verified sports agents. NIL deal negotiation, professional contract review, and career management.",
    keywords: "sports agent, athlete agent, NIL agent, find sports agent, athlete representation",
  },
  "/wizards/financial": {
    title: "Financial Wizard – Financial Advisors for Athletes | AthlynX",
    description: "Connect with financial advisors specializing in athlete wealth management. NIL earnings, investment planning, and retirement.",
    keywords: "financial advisor athletes, athlete wealth management, NIL financial planning",
  },
  "/wizards/lawyer": {
    title: "Lawyer Wizard – Sports Lawyers | AthlynX",
    description: "Access sports lawyers for NIL contract review, transfer portal legal guidance, and professional contract negotiation.",
    keywords: "sports lawyer, athlete lawyer, NIL contract lawyer, sports attorney",
  },
  "/wizards/scout": {
    title: "Scout Wizard – AI Athletic Scouting | AthlynX",
    description: "AI-powered scouting reports, performance analysis, and talent evaluation. Get discovered by coaches and scouts.",
    keywords: "AI scout, athletic scouting, talent evaluation, scouting report",
  },
  "/wizards/career": {
    title: "Career Wizard – Athlete Career Management | AthlynX",
    description: "Plan your athletic career from youth to retirement. Career path mapping and post-career transition planning.",
    keywords: "athlete career management, career planning athletes, post-career transition",
  },
  "/wizards/scholarship": {
    title: "Scholarship Wizard – Find Athletic Scholarships | AthlynX",
    description: "Find athletic scholarships across NCAA DI, DII, DIII, NAIA, and JUCO. AI-powered scholarship matching.",
    keywords: "athletic scholarship, scholarship finder, college scholarship, NCAA scholarship",
  },
  "/wizards/transfer": {
    title: "Transfer Wizard – Navigate the Transfer Portal | AthlynX",
    description: "AI-guided transfer portal navigation. School matching, eligibility verification, and transfer window tracking.",
    keywords: "transfer wizard, transfer portal guide, NCAA transfer help",
  },
  "/wizards/life": {
    title: "Life Wizard – Athlete Life Coach | AthlynX",
    description: "AI-powered life coaching for athletes. Mental health support, work-life balance, and personal development.",
    keywords: "athlete life coach, athlete mental health, athlete wellness, sports psychology",
  },
  "/football": {
    title: "Football Recruiting & NIL | AthlynX",
    description: "Football recruiting, NIL deals, transfer portal tracking, and AI training. From Pop Warner to the NFL.",
    keywords: "football recruiting, football NIL deals, football transfer portal, college football recruiting, football scholarship",
  },
  "/basketball": {
    title: "Basketball Recruiting & NIL | AthlynX",
    description: "Basketball recruiting, NIL deals, transfer portal tracking, and AI training. From AAU to the NBA.",
    keywords: "basketball recruiting, basketball NIL deals, basketball transfer portal, AAU basketball",
  },
  "/baseball": {
    title: "Baseball Recruiting & NIL | AthlynX",
    description: "Baseball recruiting, NIL deals, transfer portal tracking, and AI training. From travel ball to the MLB.",
    keywords: "baseball recruiting, baseball NIL deals, baseball transfer portal, Perfect Game alternative",
  },
  "/soccer": {
    title: "Soccer Recruiting & NIL | AthlynX",
    description: "Soccer recruiting, NIL deals, transfer portal tracking, and AI training. From club soccer to MLS.",
    keywords: "soccer recruiting, soccer NIL deals, soccer transfer portal, college soccer recruiting",
  },
  "/track": {
    title: "Track & Field Recruiting & NIL | AthlynX",
    description: "Track and field recruiting, NIL deals, transfer portal tracking. From high school track to Olympic trials.",
    keywords: "track recruiting, track and field NIL, track transfer portal, cross country recruiting",
  },
  "/swimming": {
    title: "Swimming Recruiting & NIL | AthlynX",
    description: "Swimming recruiting, NIL deals, transfer portal tracking. From club swimming to Olympic trials.",
    keywords: "swimming recruiting, swimming NIL deals, swimming transfer portal",
  },
  "/volleyball": {
    title: "Volleyball Recruiting & NIL | AthlynX",
    description: "Volleyball recruiting, NIL deals, transfer portal tracking. From club to college volleyball.",
    keywords: "volleyball recruiting, volleyball NIL deals, volleyball transfer portal",
  },
  "/wrestling": {
    title: "Wrestling Recruiting & NIL | AthlynX",
    description: "Wrestling recruiting, NIL deals, transfer portal tracking. From youth wrestling to NCAA championships.",
    keywords: "wrestling recruiting, wrestling NIL deals, wrestling transfer portal",
  },
  "/golf": {
    title: "Golf Recruiting & NIL | AthlynX",
    description: "Golf recruiting, NIL deals, and AI training. From junior golf to the PGA Tour.",
    keywords: "golf recruiting, golf NIL deals, college golf recruiting, junior golf",
  },
  "/tennis": {
    title: "Tennis Recruiting & NIL | AthlynX",
    description: "Tennis recruiting, NIL deals, and AI training. From junior tennis to the ATP/WTA.",
    keywords: "tennis recruiting, tennis NIL deals, college tennis recruiting",
  },
  "/hockey": {
    title: "Hockey Recruiting & NIL | AthlynX",
    description: "Hockey recruiting, NIL deals, transfer portal tracking. From youth hockey to the NHL.",
    keywords: "hockey recruiting, hockey NIL deals, hockey transfer portal",
  },
  "/pricing": {
    title: "Pricing – 7-Day Free Trial | AthlynX",
    description: "Start your 7-day free trial. Access NIL marketplace, transfer portal, AI training, recruiting tools, and professional services.",
    keywords: "AthlynX pricing, athlete platform pricing, free trial athlete platform",
  },
  "/feed": {
    title: "Athlete Feed – News & Community | AthlynX",
    description: "Your personalized athlete feed. Recruiting news, NIL deals, transfer portal updates, and community discussions.",
    keywords: "athlete feed, athlete social network, recruiting news, NIL news",
  },
  "/messenger": {
    title: "Athlete Messenger – Secure Communications | AthlynX",
    description: "Secure messaging for athletes, coaches, agents, and recruiters. NCAA-compliant recruiting communications.",
    keywords: "athlete messenger, recruiting messaging, coach contact",
  },
  "/founders": {
    title: "Founders – AthlynX Leadership Team",
    description: "Meet the founders behind AthlynX. Founded by Chad A. Dozier and Glenn Tse in Houston, TX since November 2024.",
    keywords: "AthlynX founders, Chad Dozier, Glenn Tse, Dozier Holdings Group",
  },
  "/dhg": {
    title: "Dozier Holdings Group – Parent Company of AthlynX",
    description: "Dozier Holdings Group is the parent company of AthlynX and Softmor Inc. Founded in Houston, TX.",
    keywords: "Dozier Holdings DHG, AthlynX parent company",
  },
  "/softmor": {
    title: "Softmor Inc – Technology Division | AthlynX",
    description: "Softmor Inc is the technology division powering AthlynX. AI, robotics, and athlete technology innovation.",
    keywords: "Softmor Inc, AthlynX technology, sports technology",
  },
  "/digital-health": {
    title: "Digital Health Hub – Athlete Wellness & AI Support | AthlynX",
    description: "AthlynX Digital Health Hub explains athlete wellness, mental performance, AI trainer, fueling, and privacy-first health support across the athlete lifecycle.",
    keywords: "AthlynX digital health, athlete wellness, AI trainer, mental performance, athlete lifecycle, HIPAA-aligned",
  },
  "/health": {
    title: "Athlete Health – Medical & Wellness | AthlynX",
    description: "HIPAA-aligned athlete health management. Injury tracking, wellness monitoring, and privacy-first athlete health resources.",
    keywords: "athlete health, sports medicine, athlete health resources, HIPAA-aligned athlete",
  },
  "/privacy-policy": {
    title: "Privacy Policy | AthlynX",
    description: "AthlynX Privacy Policy. Privacy-first data protection for athlete health, wellness, and personal information.",
  },
  "/terms-of-service": {
    title: "Terms of Service | AthlynX",
    description: "AthlynX Terms of Service. Platform usage terms, trial period, NIL disclaimer, and governing law.",
  },
  "/marketplace": {
    title: "Athlete Marketplace – Gear, Services & NIL | AthlynX",
    description: "Shop athlete gear, training equipment, NIL merchandise, and professional services.",
    keywords: "athlete marketplace, sports gear, NIL merch",
  },
  "/veterans": {
    title: "Veterans & Military Athletes | AthlynX",
    description: "AthlynX supports military veterans and active-duty athletes with special programs and career transition.",
    keywords: "veteran athletes, military athletes, warrior athletes",
  },
  "/community-feedback": {
    title: "Community Feedback | AthlynX",
    description: "Share your feedback and help shape the future of AthlynX.",
  },
  "/robot-companions": {
    title: "Robot Companions – AI Robots for Athletes | AthlynX",
    description: "AI-powered robot companions for training, recovery, and performance optimization.",
    keywords: "robot companions, AI robots athletes, training robots",
  },
  "/robotics": {
    title: "Robotics Division – Sports Robotics | AthlynX",
    description: "AthlynX Robotics Division. AI-powered robots for athletic training and performance analysis.",
    keywords: "sports robotics, AI robots, athlete robotics",
  },
  "/school": {
    title: "School Finder – Find Your Perfect College | AthlynX",
    description: "Find the perfect college for your athletic and academic goals. Search by sport, division, location.",
    keywords: "college finder, school finder athletes, NCAA schools",
  },
  "/comms-hub": {
    title: "Communications Hub | AthlynX",
    description: "Central communications hub for athletes. Messages from coaches, agents, brands, and teammates.",
    keywords: "athlete communications, recruiting messages",
  },
  "/social-hub": {
    title: "Social Hub – Athlete Social Network | AthlynX",
    description: "The athlete social network. Connect with athletes worldwide, share highlights, build your brand.",
    keywords: "athlete social network, athlete social media, sports social network",
  },
  "/media-showcase": {
    title: "Media Showcase – Highlights & Videos | AthlynX",
    description: "Showcase your best highlights and recruiting videos. Get discovered by coaches, scouts, and brands.",
    keywords: "highlight reel, recruiting video, athlete media, sports highlights",
  },
  "/careers": {
    title: "Careers at AthlynX – Join the Team",
    description: "Join the AthlynX team. Building the future of athlete technology.",
    keywords: "AthlynX careers, sports tech jobs",
  },
  "/contact": {
    title: "Contact AthlynX",
    description: "Contact the AthlynX team. Questions about NIL, recruiting, or the platform? We're here to help.",
  },
  "/download": {
    title: "Download AthlynX Mobile App",
    description: "Download the AthlynX mobile app. NIL deals, recruiting, AI training — all on your phone.",
    keywords: "download AthlynX, AthlynX app, athlete app",
  },
  "/mobile-app": {
    title: "AthlynX Mobile App – Your Playbook On The Go",
    description: "The AthlynX mobile app puts your entire athletic career in your pocket.",
    keywords: "AthlynX mobile app, athlete mobile app",
  },
  "/signup": {
    title: "Sign Up – 7-Day Free Trial | AthlynX",
    description: "Create your AthlynX account. 7-day free trial with full access to NIL marketplace, transfer portal, AI training, and recruiting tools.",
    keywords: "AthlynX signup, create account, free trial, athlete registration",
  },
  "/signin": {
    title: "Sign In | AthlynX",
    description: "Sign in to your AthlynX account. Access your athlete dashboard, NIL deals, recruiting tools, and more.",
    keywords: "AthlynX login, sign in, athlete login",
  },
  "/forgot-password": {
    title: "Forgot Password | AthlynX",
    description: "Reset your AthlynX password. Enter your email to receive a verification code.",
  },
  "/playbook": {
    title: "The Playbook – Athlete Strategy Guide | AthlynX",
    description: "Your complete athlete strategy guide. Recruiting playbooks, NIL strategies, training plans, and career roadmaps.",
    keywords: "athlete playbook, recruiting strategy, NIL strategy, training plan",
  },
  "/training": {
    title: "Training – AI-Powered Athletic Training | AthlynX",
    description: "AI-powered training programs for every sport. Personalized workouts, technique analysis, and performance tracking.",
    keywords: "athlete training, AI training, sports training, workout plans",
  },
  "/contracts": {
    title: "Contracts – NIL & Athletic Contracts | AthlynX",
    description: "Manage your NIL contracts, scholarship agreements, and athletic contracts in one secure place.",
    keywords: "NIL contracts, athlete contracts, scholarship agreement",
  },
  "/gridiron-nexus": {
    title: "Gridiron Nexus – Football Hub | AthlynX",
    description: "The football hub on AthlynX. Recruiting, NIL deals, transfer portal, training, and community for football athletes.",
    keywords: "gridiron nexus, football hub, football recruiting, football NIL",
  },
  "/court-kings": {
    title: "Court Kings – Basketball Hub | AthlynX",
    description: "The basketball hub on AthlynX. Recruiting, NIL deals, transfer portal, training, and community for basketball athletes.",
    keywords: "court kings, basketball hub, basketball recruiting, basketball NIL",
  },
  "/diamond-grind": {
    title: "Diamond Grind – Baseball Hub | AthlynX",
    description: "The baseball hub on AthlynX. Recruiting, NIL deals, transfer portal, training, and community for baseball athletes.",
    keywords: "diamond grind, baseball hub, baseball recruiting, baseball NIL",
  },
  "/pitch-pulse": {
    title: "Pitch Pulse – Soccer Hub | AthlynX",
    description: "The soccer hub on AthlynX. Recruiting, NIL deals, transfer portal, training, and community for soccer athletes.",
    keywords: "pitch pulse, soccer hub, soccer recruiting, soccer NIL",
  },
  "/track-elite": {
    title: "Track Elite – Track & Field Hub | AthlynX",
    description: "The track and field hub on AthlynX. Recruiting, NIL deals, training, and community for track athletes.",
    keywords: "track elite, track hub, track recruiting, track NIL",
  },
  "/swim-surge": {
    title: "Swim Surge – Swimming Hub | AthlynX",
    description: "The swimming hub on AthlynX. Recruiting, NIL deals, training, and community for swimmers.",
    keywords: "swim surge, swimming hub, swimming recruiting, swimming NIL",
  },
  "/net-setters": {
    title: "Net Setters – Volleyball Hub | AthlynX",
    description: "The volleyball hub on AthlynX. Recruiting, NIL deals, training, and community for volleyball athletes.",
    keywords: "net setters, volleyball hub, volleyball recruiting, volleyball NIL",
  },
  "/mat-warriors": {
    title: "Mat Warriors – Wrestling Hub | AthlynX",
    description: "The wrestling hub on AthlynX. Recruiting, NIL deals, training, and community for wrestlers.",
    keywords: "mat warriors, wrestling hub, wrestling recruiting, wrestling NIL",
  },
  "/fairway-elite": {
    title: "Fairway Elite – Golf Hub | AthlynX",
    description: "The golf hub on AthlynX. Recruiting, NIL deals, training, and community for golfers.",
    keywords: "fairway elite, golf hub, golf recruiting, golf NIL",
  },
  "/racket-kings": {
    title: "Racket Kings – Tennis Hub | AthlynX",
    description: "The tennis hub on AthlynX. Recruiting, NIL deals, training, and community for tennis players.",
    keywords: "racket kings, tennis hub, tennis recruiting, tennis NIL",
  },
  "/ice-breakers": {
    title: "Ice Breakers – Hockey Hub | AthlynX",
    description: "The hockey hub on AthlynX. Recruiting, NIL deals, training, and community for hockey players.",
    keywords: "ice breakers, hockey hub, hockey recruiting, hockey NIL",
  },
  "/reel-masters": {
    title: "Reel Masters – Fishing Hub | AthlynX",
    description: "The fishing hub on AthlynX. Community and content for fishing enthusiasts and outdoor athletes.",
    keywords: "reel masters, fishing hub, fishing community",
  },
  "/wellness": {
    title: "Athlete Wellness – Mental & Physical Health | AthlynX",
    description: "Complete athlete wellness platform. Mental health, nutrition, recovery, and performance optimization.",
    keywords: "athlete wellness, mental health athletes, athlete recovery, sports nutrition",
  },
  "/medical": {
    title: "Medical – Athlete Health Resources | AthlynX",
    description: "HIPAA-aligned athlete health resources for sports medicine, injury recovery, treatment history, and wellness support.",
    keywords: "athlete health resources, HIPAA-aligned, sports medicine, injury tracking",
  },
  "/mindset": {
    title: "Mindset – Sports Psychology & Mental Training | AthlynX",
    description: "Sports psychology and mental training for athletes. Build mental toughness, focus, and resilience.",
    keywords: "sports psychology, mental training, athlete mindset, mental toughness",
  },
  "/gym": {
    title: "Gym – Training Facility Finder | AthlynX",
    description: "Find training facilities, gyms, and performance centers near you. Connect with trainers and coaches.",
    keywords: "athlete gym, training facility, performance center, sports training",
  },
  "/studio": {
    title: "Studio – Content Creation for Athletes | AthlynX",
    description: "Create professional content for recruiting, NIL branding, and social media. Video editing, graphics, and more.",
    keywords: "athlete studio, content creation, recruiting video, athlete branding",
  },
  "/investor-hub": {
    title: "Investor Hub | AthlynX",
    description: "Investment opportunities with AthlynX and Dozier Holdings Group. The future of athlete technology.",
    keywords: "AthlynX investors, sports tech investment, Dozier Holdings Group",
  },
  "/partners": {
    title: "Partners | AthlynX",
    description: "AthlynX partnership opportunities. Join the ecosystem powering the future of athlete technology.",
    keywords: "AthlynX partners, sports partnerships, athlete platform partners",
  },
  "/faith": {
    title: "Faith – Spiritual Wellness for Athletes | AthlynX",
    description: "Faith and spiritual wellness resources for athletes. Community, devotionals, and support.",
    keywords: "athlete faith, spiritual wellness, athlete devotional",
  },
  "/podcast": {
    title: "The Athlete's Playbook Podcast – NIL, Transfer Portal, Recruiting | AthlynX",
    description: "The definitive podcast for athletes navigating NIL deals, the transfer portal, recruiting, and building their brand. Hosted by Chad A. Dozier, Founder · CEO · Chairman of AthlynX.",
    keywords: "athlete podcast, NIL podcast, transfer portal podcast, sports recruiting podcast, college athlete podcast, AthlynX podcast, Chad Dozier podcast, athlete success podcast",
  },
  "/music": {
    title: "Music – Athlete Playlists & Culture | AthlynX",
    description: "Music and culture hub for athletes. Curated playlists, artist connections, and music industry opportunities.",
    keywords: "athlete music, sports playlists, athlete culture",
  },
  "/hunting": {
    title: "Hunting – Outdoor Sports Hub | AthlynX",
    description: "Hunting and outdoor sports community for athletes. Gear, guides, and community.",
    keywords: "hunting athletes, outdoor sports, hunting community",
  },
  "/fishing": {
    title: "Fishing – Outdoor Sports Hub | AthlynX",
    description: "Fishing and outdoor sports community for athletes. Gear, guides, and community.",
    keywords: "fishing athletes, outdoor sports, fishing community",
  },
  "/bitcoin-mining": {
    title: "Bitcoin Mining – Digital Asset Division | AthlynX",
    description: "AthlynX digital asset and bitcoin mining division. Powering the future of athlete financial technology.",
    keywords: "bitcoin mining, athlete crypto, digital assets",
  },
  "/infrastructure": {
    title: "Infrastructure – Data Centers & Technology | AthlynX",
    description: "AthlynX infrastructure division. Data centers, geothermal energy, and next-generation technology.",
    keywords: "data centers, infrastructure, geothermal energy, technology",
  },
  "/military-division": {
    title: "Military Division – Warrior Athletes | AthlynX",
    description: "AthlynX Military Division. Supporting warrior athletes, veterans, and active-duty service members.",
    keywords: "military athletes, warrior athletes, veteran support",
  },
  "/operation-warrior-pipeline": {
    title: "Operation Warrior Pipeline | AthlynX",
    description: "Operation Warrior Pipeline. Transitioning military service members into athletic and professional careers.",
    keywords: "warrior pipeline, military transition, veteran athletes",
  },
  "/capabilities": {
    title: "Platform Capabilities | AthlynX",
    description: "Explore the full capabilities of the AthlynX platform. NIL, recruiting, AI, professional services, and more.",
    keywords: "AthlynX capabilities, platform features, athlete tools",
  },
  "/team": {
    title: "Our Team | AthlynX",
    description: "Meet the AthlynX team building the future of athlete technology.",
    keywords: "AthlynX team, leadership team",
  },
  "/hipaa": {
    title: "HIPAA Compliance | AthlynX",
    description: "AthlynX HIPAA compliance information. How we protect athlete health data.",
    keywords: "HIPAA compliance, athlete health data, data protection",
  },
  "/legal-compliance": {
    title: "Legal Compliance | AthlynX",
    description: "AthlynX legal compliance information. State-specific laws, NCAA compliance, and regulatory adherence.",
    keywords: "legal compliance, NCAA compliance, athlete legal",
  },
  "/legal-hub": {
    title: "Legal Hub | AthlynX",
    description: "AthlynX Legal Hub. Access legal resources, compliance information, and regulatory guidance.",
    keywords: "legal hub, athlete legal resources",
  },
  "/white-label": {
    title: "White Label – Custom Athlete Platforms | AthlynX",
    description: "White label AthlynX technology for schools, conferences, and organizations. Custom-branded athlete platforms.",
    keywords: "white label, custom platform, school athlete platform",
  },
  "/early-access": {
    title: "Early Access – Join the VIP Waitlist | AthlynX",
    description: "Join the AthlynX VIP early access waitlist. Be first to experience the future of athlete technology.",
    keywords: "early access, VIP waitlist, AthlynX beta",
  },
  "/app-store": {
    title: "App Store – Athlete Apps & Integrations | AthlynX",
    description: "Browse athlete apps and integrations on the AthlynX App Store.",
    keywords: "athlete apps, sports apps, AthlynX integrations",
  },
  "/shop": {
    title: "Shop – Athlete Gear & Merchandise | AthlynX",
    description: "Shop AthlynX gear, athlete merchandise, and training equipment.",
    keywords: "athlete shop, sports merchandise, AthlynX gear",
  },
  "/store": {
    title: "Store – AthlynX Merchandise | AthlynX",
    description: "Official AthlynX store. Gear, apparel, and merchandise for athletes.",
    keywords: "AthlynX store, athlete merchandise",
  },
  "/billing": {
    title: "Billing – Manage Your Subscription | AthlynX",
    description: "Manage your AthlynX subscription, billing, and payment information.",
  },
  "/notifications": {
    title: "Notifications | AthlynX",
    description: "Your AthlynX notifications. Recruiting updates, NIL offers, messages, and platform alerts.",
  },
  "/fuel-bots": {
    title: "Fuel Bots – AI Nutrition & Energy | AthlynX",
    description: "AI-powered nutrition and energy optimization for athletes. Personalized meal plans and supplement guidance.",
    keywords: "athlete nutrition, AI nutrition, fuel bots, sports nutrition",
  },
  "/team-bots": {
    title: "Team Bots – AI Team Management | AthlynX",
    description: "AI-powered team management and communication tools. Coordinate with teammates, coaches, and staff.",
    keywords: "team bots, AI team management, sports team tools",
  },
  "/wizard-hub": {
    title: "Wizard Hub – All AI Assistants | AthlynX",
    description: "Access all AthlynXAI wizards and assistants from one hub. Agents, financial advisors, lawyers, scouts, and more.",
    keywords: "wizard hub, AI assistants, athlete AI tools",
  },
  "/serenity-memorial": {
    title: "Serenity Memorial | AthlynX",
    description: "Serenity Memorial. Honoring athletes and their legacies.",
  },
  "/warriors-playbook": {
    title: "Warriors Playbook – Military Athlete Guide | AthlynX",
    description: "The Warriors Playbook for military athletes. Training, career transition, and community support.",
    keywords: "warriors playbook, military athlete guide, veteran training",
  },
};

export function SEOManager() {
  const [location] = useLocation();

  useEffect(() => {
    // Normalize path: remove trailing slash, handle dynamic segments
    const path = location.replace(/\/$/, "") || "/";
    const basePath = path.replace(/\/[^/]+$/, "") || path; // For dynamic routes like /profile/:id

    const config = SEO_MAP[path] || SEO_MAP[basePath];

    if (config) {
      document.title = config.title;

      // Meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", config.description);

      // Meta keywords
      if (config.keywords) {
        const metaKw = document.querySelector('meta[name="keywords"]');
        if (metaKw) metaKw.setAttribute("content", config.keywords);
      }

      // Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", config.title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", config.description);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute("content", `https://athlynx.ai${path}`);

      // Twitter
      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute("content", config.title);
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute("content", config.description);

      // Canonical
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute("href", `https://athlynx.ai${path}`);
      }
    } else {
      // Fallback: generate title from path
      const pageName = path
        .replace(/^\//, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      document.title = `${pageName || "AthlynX"} | AthlynX – The Athlete's Playbook`;
    }
  }, [location]);

  return null; // This component renders nothing, just manages document head
}

export default SEOManager;
