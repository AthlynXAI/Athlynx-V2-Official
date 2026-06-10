import { useEffect } from "react";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
}

const SEO_MAP: Record<string, SEOConfig> = {
  "/": {
    title: "AthlynX – We help the athletes. NIL hyped up on AI.",
    description: "We help the athletes — Name, Image & Likeness, hyped up on AI. The all-in-one athlete platform for NIL deals, transfer portal intelligence, college recruiting, AI training, financial advisors, sports agents, and lawyers. Youth to retirement. Every sport. Every athlete.",
    keywords: "AthlynX, athlete platform, NIL deals, NIL AI, name image likeness AI, transfer portal, college recruiting, AI training, sports agent, sports lawyer, financial advisor athletes, athlete-owned NIL",
  },
  "/nil-marketplace": {
    title: "NIL Marketplace – Find & Sign NIL Deals | AthlynX",
    description: "Browse and sign NIL deals on the AthlynX marketplace. Connect with brands, NIL collectives, and sponsors. Calculate your NIL valuation. The best NIL deal platform for college and high school athletes.",
    keywords: "NIL marketplace, NIL deals, NIL collective, athlete sponsorship, brand deals, NIL platform, college athlete NIL, sign NIL deal",
  },
  "/nil-calculator": {
    title: "NIL Calculator – Calculate Your NIL Value | AthlynX",
    description: "Calculate your Name Image Likeness value with the AthlynX NIL Calculator. Based on social media following, sport, performance, and market size. Free NIL valuation for all athletes.",
    keywords: "NIL calculator, NIL valuation, athlete NIL value, name image likeness calculator, NIL worth, athlete brand value",
  },
  "/nil-portal": {
    title: "NIL Portal – Manage Your NIL Deals & Contracts | AthlynX",
    description: "Manage all your NIL deals, contracts, and brand partnerships in one place. Track earnings, review offers, and connect with NIL collectives on AthlynX.",
    keywords: "NIL portal, NIL contract management, NIL earnings tracker, athlete NIL dashboard, NIL deal tracker",
  },
  "/nil-vault": {
    title: "NIL Vault – Secure Your NIL Assets & Contracts | AthlynX",
    description: "Store and protect your NIL contracts, brand deals, and financial documents in the AthlynX NIL Vault. Secure, encrypted, and always accessible.",
    keywords: "NIL vault, NIL contract storage, athlete document vault, NIL asset protection",
  },
  "/transfer-portal": {
    title: "Transfer Portal – NCAA Transfer Portal Intelligence | AthlynX",
    description: "Real-time NCAA transfer portal tracking, school matching, and coach connections. Navigate transfer windows for football, basketball, baseball, and every sport. The smartest transfer portal tool.",
    keywords: "NCAA transfer portal, transfer portal tracker, college transfer, transfer portal dates, transfer portal window, football transfer portal, basketball transfer portal",
  },
  "/transfer-intelligence": {
    title: "Transfer Intelligence – AI-Powered Transfer Portal Analytics | AthlynX",
    description: "AI-powered transfer portal analytics and intelligence. School matching algorithms, coach connection tools, and transfer window calendars for every NCAA sport.",
    keywords: "transfer portal intelligence, transfer analytics, AI transfer portal, school matching, transfer portal AI",
  },
  "/transfer-portal-fos": {
    title: "Transfer Portal FOS – Freedom of Sport Transfer System | AthlynX",
    description: "Navigate the transfer portal with AthlynX Freedom of Sport system. Track entries, find schools, connect with coaches during contact and evaluation periods.",
    keywords: "transfer portal FOS, freedom of sport, transfer system, athlete transfer tool",
  },
  "/signing-day": {
    title: "Signing Day – Track Commitments & Letters of Intent | AthlynX",
    description: "Track National Signing Day commitments, letters of intent, and scholarship offers across all sports. Real-time signing day coverage and analytics on AthlynX.",
    keywords: "signing day, national signing day, letter of intent, NLI, scholarship commitment, signing day tracker, college commitment",
  },
  "/athlete-dashboard": {
    title: "Athlete Dashboard – Your Complete Recruiting Command Center | AthlynX",
    description: "Your all-in-one athlete dashboard. Track recruiting activity, NIL deals, transfer portal status, training progress, and communications. The command center for your athletic career.",
    keywords: "athlete dashboard, recruiting dashboard, athlete command center, recruiting tracker, athlete analytics",
  },
  "/athlete-playbook": {
    title: "The Athlete Playbook – Boost Your Recruiting & Media Profile | AthlynX",
    description: "The Athlete Playbook shows how AthlynX boosts your recruiting presence and media profile. Connect with athletes globally, compare recruiting efforts, and share schedules across sports and seasons.",
    keywords: "athlete playbook, recruiting playbook, athlete media profile, recruiting presence, athlete guide",
  },
  "/athlete-website-builder": {
    title: "Athlete Website Builder – Create Your Recruiting Website | AthlynX",
    description: "Build your professional athlete website in minutes. Showcase highlights, stats, academics, and contact info. The best recruiting website builder for student-athletes.",
    keywords: "athlete website builder, recruiting website, athlete portfolio, sports website builder, recruiting profile builder",
  },
  "/ai-training-bot": {
    title: "AI Training Bot – AI-Powered Athletic Training | AthlynX",
    description: "Train smarter with AthlynXAI Training Bot. Personalized workout plans, technique analysis, injury prevention, and performance optimization powered by artificial intelligence.",
    keywords: "AI training bot, AI athletic training, AI workout, AI sports training, AI fitness, athlete AI assistant",
  },
  "/ai-recruiter": {
    title: "AI Recruiter – AI-Powered College Recruiting Assistant | AthlynX",
    description: "Let AI find your perfect college match. AthlynXAI Recruiter analyzes your stats, academics, and preferences to connect you with the right schools and coaches.",
    keywords: "AI recruiter, AI recruiting assistant, AI college matching, AI scout, automated recruiting, AI scholarship finder",
  },
  "/ai-content": {
    title: "AI Content Creator – Generate Highlight Reels & Recruiting Content | AthlynX",
    description: "Create professional highlight reels, recruiting videos, social media content, and athlete profiles with AthlynXAI Content Creator. Stand out to coaches and brands.",
    keywords: "AI content creator, highlight reel creator, recruiting video, athlete content, AI video editor, sports content creator",
  },
  "/wizards": {
    title: "Wizards – AI-Powered Professional Services for Athletes | AthlynX",
    description: "Access AI-powered professional services: sports agents, financial advisors, lawyers, scouts, career counselors, scholarship finders, and life coaches. All built for athletes.",
    keywords: "athlete wizards, sports agent AI, financial advisor athletes, sports lawyer, AI scout, career counselor athletes",
  },
  "/wizards/agent": {
    title: "Agent Wizard – Find a Sports Agent | AthlynX",
    description: "Connect with verified sports agents who specialize in athlete representation. NIL deal negotiation, professional contract review, and career management.",
    keywords: "sports agent, athlete agent, NIL agent, find sports agent, athlete representation, agent for athletes",
  },
  "/wizards/financial": {
    title: "Financial Wizard – Financial Advisors for Athletes | AthlynX",
    description: "Connect with financial advisors who specialize in athlete wealth management. NIL earnings, investment planning, tax strategy, and retirement planning for athletes.",
    keywords: "financial advisor athletes, athlete wealth management, NIL financial planning, athlete investment, sports financial advisor",
  },
  "/wizards/lawyer": {
    title: "Lawyer Wizard – Sports Lawyers for Athletes | AthlynX",
    description: "Access sports lawyers for NIL contract review, transfer portal legal guidance, professional contract negotiation, and athlete rights protection.",
    keywords: "sports lawyer, athlete lawyer, NIL contract lawyer, sports attorney, athlete legal services, NIL legal review",
  },
  "/wizards/scout": {
    title: "Scout Wizard – AI-Powered Athletic Scouting | AthlynX",
    description: "AI-powered scouting reports, performance analysis, and talent evaluation. Get discovered by college coaches and professional scouts with AthlynX Scout Wizard.",
    keywords: "AI scout, athletic scouting, talent evaluation, scouting report, college scout, athlete evaluation",
  },
  "/wizards/career": {
    title: "Career Wizard – Athlete Career Management | AthlynX",
    description: "Plan your athletic career from youth to retirement. Career path mapping, post-career transition planning, and professional development for athletes.",
    keywords: "athlete career management, career planning athletes, post-career transition, athlete retirement planning, career wizard",
  },
  "/wizards/scholarship": {
    title: "Scholarship Wizard – Find Athletic Scholarships | AthlynX",
    description: "Find athletic scholarships across NCAA DI, DII, DIII, NAIA, and JUCO. AI-powered scholarship matching based on your sport, stats, academics, and preferences.",
    keywords: "athletic scholarship, scholarship finder, college scholarship, NCAA scholarship, NAIA scholarship, sports scholarship, scholarship search",
  },
  "/wizards/transfer": {
    title: "Transfer Wizard – Navigate the Transfer Portal | AthlynX",
    description: "AI-guided transfer portal navigation. School matching, eligibility verification, transfer window tracking, and coach connection tools for every NCAA sport.",
    keywords: "transfer wizard, transfer portal guide, transfer portal help, NCAA transfer help, transfer eligibility",
  },
  "/wizards/life": {
    title: "Life Wizard – Athlete Life Coach & Wellness | AthlynX",
    description: "AI-powered life coaching for athletes. Mental health support, work-life balance, stress management, and personal development tailored for the athlete lifestyle.",
    keywords: "athlete life coach, athlete mental health, athlete wellness, sports psychology, athlete stress management",
  },
  "/football": {
    title: "Football Recruiting & NIL – Gridiron Nexus | AthlynX",
    description: "Football recruiting, NIL deals, transfer portal tracking, and AI training for football players. From Pop Warner to the NFL. The complete football athlete platform.",
    keywords: "football recruiting, football NIL deals, football transfer portal, college football recruiting, high school football, football scholarship, football training",
  },
  "/basketball": {
    title: "Basketball Recruiting & NIL – Court Kings | AthlynX",
    description: "Basketball recruiting, NIL deals, transfer portal tracking, and AI training for basketball players. From AAU to the NBA. The complete basketball athlete platform.",
    keywords: "basketball recruiting, basketball NIL deals, basketball transfer portal, college basketball recruiting, AAU basketball, basketball scholarship",
  },
  "/baseball": {
    title: "Baseball Recruiting & NIL – Diamond Grind | AthlynX",
    description: "Baseball recruiting, NIL deals, transfer portal tracking, and AI training for baseball players. From travel ball to the MLB. The complete baseball athlete platform.",
    keywords: "baseball recruiting, baseball NIL deals, baseball transfer portal, college baseball recruiting, travel baseball, Perfect Game alternative, baseball scholarship",
  },
  "/soccer": {
    title: "Soccer Recruiting & NIL – Pitch Pulse | AthlynX",
    description: "Soccer recruiting, NIL deals, transfer portal tracking, and AI training for soccer players. From club soccer to MLS. The complete soccer athlete platform.",
    keywords: "soccer recruiting, soccer NIL deals, soccer transfer portal, college soccer recruiting, club soccer, soccer scholarship",
  },
  "/track": {
    title: "Track & Field Recruiting & NIL – Track Elite | AthlynX",
    description: "Track and field recruiting, NIL deals, transfer portal tracking, and AI training. From high school track to Olympic trials. The complete track athlete platform.",
    keywords: "track recruiting, track and field NIL, track transfer portal, cross country recruiting, track scholarship, running recruiting",
  },
  "/swimming": {
    title: "Swimming Recruiting & NIL – Swim Surge | AthlynX",
    description: "Swimming recruiting, NIL deals, transfer portal tracking, and AI training for swimmers. From club swimming to Olympic trials. The complete swimming athlete platform.",
    keywords: "swimming recruiting, swimming NIL deals, swimming transfer portal, college swimming recruiting, club swimming, swim scholarship",
  },
  "/volleyball": {
    title: "Volleyball Recruiting & NIL – Net Setters | AthlynX",
    description: "Volleyball recruiting, NIL deals, transfer portal tracking, and AI training for volleyball players. From club to college. The complete volleyball athlete platform.",
    keywords: "volleyball recruiting, volleyball NIL deals, volleyball transfer portal, college volleyball recruiting, club volleyball, volleyball scholarship",
  },
  "/wrestling": {
    title: "Wrestling Recruiting & NIL – Mat Warriors | AthlynX",
    description: "Wrestling recruiting, NIL deals, transfer portal tracking, and AI training for wrestlers. From youth wrestling to NCAA championships. The complete wrestling athlete platform.",
    keywords: "wrestling recruiting, wrestling NIL deals, wrestling transfer portal, college wrestling recruiting, wrestling scholarship",
  },
  "/golf": {
    title: "Golf Recruiting & NIL – Fairway Elite | AthlynX",
    description: "Golf recruiting, NIL deals, and AI training for golfers. From junior golf to the PGA Tour. The complete golf athlete platform.",
    keywords: "golf recruiting, golf NIL deals, college golf recruiting, junior golf, golf scholarship, golf training",
  },
  "/tennis": {
    title: "Tennis Recruiting & NIL – Racket Kings | AthlynX",
    description: "Tennis recruiting, NIL deals, and AI training for tennis players. From junior tennis to the ATP/WTA. The complete tennis athlete platform.",
    keywords: "tennis recruiting, tennis NIL deals, college tennis recruiting, junior tennis, tennis scholarship",
  },
  "/hockey": {
    title: "Hockey Recruiting & NIL – Ice Breakers | AthlynX",
    description: "Hockey recruiting, NIL deals, transfer portal tracking, and AI training for hockey players. From youth hockey to the NHL. The complete hockey athlete platform.",
    keywords: "hockey recruiting, hockey NIL deals, hockey transfer portal, college hockey recruiting, youth hockey, hockey scholarship",
  },
  "/pricing": {
    title: "Pricing – 7-Day Free Trial | AthlynX",
    description: "Start your 7-day free trial of AthlynX. Access NIL marketplace, transfer portal intelligence, AI training, recruiting tools, and professional services. Plans for every athlete.",
    keywords: "AthlynX pricing, athlete platform pricing, NIL platform cost, recruiting tool pricing, free trial athlete platform",
  },
  "/feed": {
    title: "Athlete Feed – News, Updates & Community | AthlynX",
    description: "Your personalized athlete feed. Recruiting news, NIL deal announcements, transfer portal updates, training tips, and community discussions. The athlete's social network.",
    keywords: "athlete feed, athlete social network, recruiting news, NIL news, transfer portal news, athlete community",
  },
  "/messenger": {
    title: "Athlete Messenger – Secure Communications | AthlynX",
    description: "Secure messaging for athletes, coaches, agents, and recruiters. Built-in compliance with NCAA recruiting contact rules. The communication hub for athletes.",
    keywords: "athlete messenger, recruiting messaging, coach contact, athlete communication, secure athlete messaging",
  },
  "/founders": {
    title: "Founders – Meet the AthlynX Leadership Team | AthlynX",
    description: "Meet the founders and leadership team behind AthlynX. Founded by Chad A. Dozier and Glenn Tse in Houston, TX. Building the future of athlete technology.",
    keywords: "AthlynX founders, Chad Dozier, Glenn Tse, Dozier Holdings Group, AthlynX leadership, athlete technology founders",
  },
  "/dhg": {
    title: "Dozier Holdings Group – Parent Company of AthlynX",
    description: "Dozier Holdings Group is the parent company of AthlynX and Softmor Inc. Founded by Chad A. Dozier and Glenn Tse in Houston, TX since November 2024.",
    keywords: "Dozier Holdings Group, DHG, AthlynX parent company, Chad Dozier, Glenn Tse",
  },
  "/softmor": {
    title: "Softmor Inc – Technology Division | AthlynX",
    description: "Softmor Inc is the technology division powering AthlynX. AI, robotics, and athlete technology innovation from Houston, TX.",
    keywords: "Softmor Inc, AthlynX technology, athlete tech company, sports technology",
  },
  "/digital-health": {
    title: "Digital Health Hub – Athlete Wellness & AI Support | AthlynX",
    description: "AthlynX Digital Health Hub explains athlete wellness, mental performance, AI trainer, fueling, and privacy-first health support across the athlete lifecycle.",
    keywords: "AthlynX digital health, athlete wellness, AI trainer, mental performance, athlete lifecycle, HIPAA-aligned",
  },
  "/health": {
    title: "Athlete Health – Medical & Wellness Resources | AthlynX",
    description: "HIPAA-aligned athlete health management. Injury tracking, wellness monitoring, and privacy-first health resources for athletes at every level.",
    keywords: "athlete health, sports medicine, athlete health resources, HIPAA-aligned athlete, injury tracking, athlete wellness",
  },
  "/privacy-policy": {
    title: "Privacy Policy | AthlynX",
    description: "AthlynX Privacy Policy. Privacy-first data protection for athlete health, wellness, personal information, and platform usage data.",
    keywords: "AthlynX privacy policy, athlete data protection, HIPAA-aligned, athlete privacy",
  },
  "/terms-of-service": {
    title: "Terms of Service | AthlynX",
    description: "AthlynX Terms of Service. Platform usage terms, trial period details, NIL disclaimer, and governing law information.",
    keywords: "AthlynX terms of service, athlete platform terms, AthlynX legal",
  },
  "/marketplace": {
    title: "Athlete Marketplace – Gear, Services & NIL | AthlynX",
    description: "Shop athlete gear, training equipment, NIL merchandise, and professional services on the AthlynX Marketplace. Built by athletes, for athletes.",
    keywords: "athlete marketplace, sports gear, athlete merchandise, NIL merch, athlete services marketplace",
  },
  "/veterans": {
    title: "Veterans & Military Athletes | AthlynX",
    description: "AthlynX supports military veterans and active-duty athletes. Special programs, career transition support, and community for warrior athletes.",
    keywords: "veteran athletes, military athletes, warrior athletes, veteran sports, military to athlete transition",
  },
  "/community-feedback": {
    title: "Community Feedback – Help Shape AthlynX | AthlynX",
    description: "Share your feedback and help shape the future of AthlynX. We build for athletes, guided by athletes.",
    keywords: "AthlynX feedback, athlete platform feedback, community feedback",
  },
  "/robot-companions": {
    title: "Robot Companions – AI Robots for Athletes | AthlynX",
    description: "AI-powered robot companions for training, recovery, and performance optimization. The future of athlete technology on AthlynX.",
    keywords: "robot companions, AI robots athletes, athlete robots, training robots, sports robots",
  },
  "/robotics": {
    title: "Robotics Division – Sports Robotics & AI | AthlynX",
    description: "AthlynX Robotics Division. AI-powered robots for athletic training, performance analysis, and recovery. The future of sports technology.",
    keywords: "sports robotics, AI robots, athlete robotics, training robots, sports AI technology",
  },
  "/school": {
    title: "School Finder – Find Your Perfect College | AthlynX",
    description: "Find the perfect college for your athletic and academic goals. Search schools by sport, division, location, academics, and scholarship availability.",
    keywords: "college finder, school finder athletes, college search, NCAA schools, NAIA schools, college for athletes",
  },
  "/comms-hub": {
    title: "Communications Hub – Athlete Messaging Center | AthlynX",
    description: "Central communications hub for athletes. Messages from coaches, agents, brands, and teammates all in one place. NCAA-compliant recruiting communications.",
    keywords: "athlete communications, recruiting messages, coach messaging, athlete inbox, recruiting communications",
  },
  "/social-hub": {
    title: "Social Hub – Athlete Social Network | AthlynX",
    description: "The athlete social network. Connect with athletes worldwide, share highlights, discuss recruiting, and build your brand. Better than Instagram and TikTok for athletes.",
    keywords: "athlete social network, athlete social media, sports social network, athlete community, athlete connections",
  },
  "/media-showcase": {
    title: "Media Showcase – Highlight Reels & Recruiting Videos | AthlynX",
    description: "Showcase your best highlights, recruiting videos, and athletic content. Get discovered by coaches, scouts, and brands on the AthlynX Media Showcase.",
    keywords: "highlight reel, recruiting video, athlete media, sports highlights, athlete showcase, recruiting highlights",
  },
  "/careers": {
    title: "Careers at AthlynX – Join the Team | AthlynX",
    description: "Join the AthlynX team. We're building the future of athlete technology. Open positions in engineering, design, sports science, and more.",
    keywords: "AthlynX careers, sports tech jobs, athlete platform jobs, AthlynX hiring",
  },
  "/contact": {
    title: "Contact AthlynX – Get in Touch | AthlynX",
    description: "Contact the AthlynX team. Questions about NIL deals, recruiting, transfer portal, or platform features? We're here to help.",
    keywords: "contact AthlynX, AthlynX support, athlete platform contact, AthlynX help",
  },
  "/download": {
    title: "Download AthlynX – Mobile App | AthlynX",
    description: "Download the AthlynX mobile app. Access NIL deals, transfer portal, recruiting tools, and AI training from your phone. Available on iOS and Android.",
    keywords: "download AthlynX, AthlynX app, athlete app, sports app, recruiting app, NIL app",
  },
  "/mobile-app": {
    title: "AthlynX Mobile App – Your Playbook On The Go | AthlynX",
    description: "The AthlynX mobile app puts your entire athletic career in your pocket. NIL deals, recruiting, transfer portal, AI training, and messaging — all on mobile.",
    keywords: "AthlynX mobile app, athlete mobile app, sports mobile app, recruiting app mobile",
  },
};

/**
 * Hook to set dynamic page title and meta description for SEO.
 * Call at the top of every page component: useSEO("/your-route")
 */
export function useSEO(path: string) {
  useEffect(() => {
    const config = SEO_MAP[path];
    if (config) {
      document.title = config.title;

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", config.description);
      } else {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        metaDesc.setAttribute("content", config.description);
        document.head.appendChild(metaDesc);
      }

      // Update meta keywords
      if (config.keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute("content", config.keywords);
        }
      }

      // Update og:title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", config.title);
      }

      // Update og:description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute("content", config.description);
      }

      // Update twitter:title
      let twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) {
        twTitle.setAttribute("content", config.title);
      }

      // Update twitter:description
      let twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) {
        twDesc.setAttribute("content", config.description);
      }
    } else {
      // Fallback for unmapped pages
      const pageName = path.replace(/^\//, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      document.title = `${pageName || "AthlynX"} | AthlynX – The Athlete's Playbook`;
    }
  }, [path]);
}

export default useSEO;
