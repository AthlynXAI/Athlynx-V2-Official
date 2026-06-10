/**
 * AthlynX Social Post Automation — Session 22 REBUILD
 * ─────────────────────────────────────────────────────
 * PLATFORM-SPECIFIC RULES (never violate these):
 *
 * INSTAGRAM (chad_dozier + chaddozier14):
 *   - Image required — text-only posts have near-zero reach
 *   - Max 10 hashtags (5 is ideal) — no hashtag spam
 *   - No external links in caption — bio link only
 *   - 1x per day per account max
 *   - Story-driven, authentic captions
 *
 * FACEBOOK (AthlynX Page + Chad personal):
 *   - Conversational tone, longer form OK
 *   - Max 2-3 hashtags
 *   - 1x per day max
 *   - Native content preferred
 *
 * X / TWITTER:
 *   - Hard 280 character limit
 *   - Max 1-2 hashtags
 *   - Punchy, direct, no engagement bait ("like if you agree" is banned)
 *   - 2-3x per day max
 *
 * LINKEDIN:
 *   - Human voice ONLY — first-person, real perspective from Chad Dozier
 *   - NO link in post body — LinkedIn suppresses reach; link goes in first comment
 *   - Max 3 hashtags
 *   - 3-4x per WEEK max (not daily)
 *   - Never sounds AI-generated — short paragraphs, real opinions
 *
 * GOOGLE BUSINESS:
 *   - Business updates, events, offers only
 *   - No hashtags
 *   - 2-3x per week max
 *
 * TIKTOK: VIDEO ONLY — text posts not supported, skip always
 *
 * BUFFER API:
 *   - mutation: createPost with schedulingType: automatic + mode: shareNow
 *   - Return type: PostActionPayload — use __typename only
 *   - Token: BUFFER_ACCESS_TOKEN from environment only; never hardcode credentials in source.
 */

const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN!;
const BASE_URL = "https://athlynx.ai";

const BUFFER_CHANNELS = {
  instagram_chad_dozier:  "69e6cca6031bfa423c26478e",
  linkedin:               "69e6cd3f031bfa423c264c63",
  google_business:        "69e6cdf3031bfa423c2650a8",
  twitter:                "69e6ce05031bfa423c265121",
  instagram_chaddozier14: "69e6ce77031bfa423c265389",
  facebook_athlynx:       "69f29ddf5c4c051afaf3e12e",
  facebook_chad:          "69f3f06f5c4c051afaf9eeb7",
};

// ─────────────────────────────────────────────────────────
// INSTAGRAM POSTS — Story-driven, image-paired, 5-8 hashtags
// Max 2,200 chars. No external links. Authentic voice.
// ─────────────────────────────────────────────────────────
const INSTAGRAM_POSTS = [
  `Every athlete deserves to be seen.\n\nWe built AthlynXAI so no talented kid gets overlooked because they go to a small school or can't afford an agent.\n\nYour profile. Your stats. Your highlight reel. All in one place — working for you 24/7.\n\nStart free at athlynx.ai (link in bio)\n\n#AthlynXAI #NIL #CollegeRecruiting #StudentAthlete #GetRecruited`,
  `The recruiting game has changed.\n\nCoaches are searching online before they ever pick up the phone.\n\nIs your profile ready when they find you?\n\nAthlynXAI builds your recruiting presence automatically — stats, highlights, NIL deals, all live.\n\nLink in bio.\n\n#AthlynXAI #CollegeRecruiting #NIL #AthleteLife #NextLevel`,
  `NIL isn't just for 5-star recruits.\n\nEvery athlete has a name, an image, and a likeness worth something to a brand.\n\nAthlynXAI's NIL marketplace connects YOU directly to deals — no middleman, no agent fees.\n\nYour brand. Your money.\n\nLink in bio → athlynx.ai\n\n#NIL #AthleteMarketing #AthlynXAI #CollegiateAthletes #GetPaid`,
  `From Laurel, MS to Houston, TX — we built this for every athlete who was told they weren't big enough, fast enough, or from the right school.\n\nAthlynXAI is the great equalizer.\n\nEvery sport. Every level. One platform.\n\nLink in bio.\n\n#AthlynXAI #NIL #StudentAthlete #IronSharpensIron #AthleteLife`,
  `The transfer portal is open 365 days a year.\n\nAre you using it strategically?\n\nAthlynXAI tracks every opportunity, every school looking for your position, and every NIL deal that comes with a transfer.\n\nDon't just transfer. Upgrade.\n\nLink in bio.\n\n#TransferPortal #NIL #CollegeRecruiting #AthlynXAI #NextLevel`,
  `Your highlight reel is your resume.\n\nAthlynXAI's Video Upload Hub lets you upload, organize, and share your best moments directly with coaches and scouts.\n\nStop sending links. Start getting offers.\n\nLink in bio → athlynx.ai\n\n#HighlightReel #AthleteRecruiting #AthlynXAI #NIL #CollegiateAthletes`,
  `Iron Sharpens Iron.\n\nProverbs 27:17 — the verse that drives everything we build at AthlynXAI.\n\nWhen athletes connect, compete, and push each other — everyone gets better.\n\nThat's the AthlynXAI community.\n\nJoin us. Link in bio.\n\n#IronSharpensIron #AthlynXAI #FaithAndSport #AthleteLife #NIL`,
  `Diamond Grind Baseball.\n\nFrom Little League to the pros — AthlynXAI tracks every pitch, every at-bat, every recruiting opportunity.\n\nBaseball athletes: your platform is live.\n\nLink in bio → athlynx.ai/baseball\n\n#DiamondGrind #BaseballRecruiting #NIL #AthlynXAI #CollegiateBaseball`,
  `Warriors Playbook.\n\nFootball athletes — your NIL era is now.\n\nAthlynXAI's football platform gives you recruiting analytics, film study tools, and direct brand connections.\n\nOwn the field. Link in bio.\n\n#WarriorsPlaybook #FootballNIL #AthlynXAI #CollegiateFootball #NIL`,
  `Youth → High School → College → Pro → Retired.\n\nEvery level. Every sport. One platform.\n\nAthlynXAI was built to follow your entire athletic career — not just the recruiting window.\n\nWhere are you in your journey?\n\nLink in bio.\n\n#AthlynXAI #AthleteLife #NIL #CollegeRecruiting #EveryLevel`,
];

// ─────────────────────────────────────────────────────────
// FACEBOOK POSTS — Conversational, community-driven, 2-3 hashtags
// Longer form OK. More personal tone.
// ─────────────────────────────────────────────────────────
const FACEBOOK_POSTS = [
  `We started AthlynXAI with one belief: every athlete deserves a fair shot.\n\nNot just the ones at big schools. Not just the ones with agents. Every single one.\n\nToday, AthlynXAI is live — a full AI-powered platform for recruiting, NIL deals, stats, highlights, and community.\n\nIf you know a student-athlete who needs this, share this post. It could change their life.\n\nhttps://athlynx.ai\n\n#AthlynXAI #NIL`,
  `Quick update from the AthlynXAI team:\n\nWe now have athletes from 44 sports on the platform. Baseball, football, basketball, soccer, track, swimming, volleyball — you name it.\n\nEvery sport gets the same tools. Every athlete gets the same shot.\n\nSign up free today → https://athlynx.ai\n\n#AthlynXAI #StudentAthlete`,
  `The NIL era changed college sports forever.\n\nBut most athletes still don't know how to monetize their brand.\n\nAthlynXAI's NIL Marketplace connects athletes directly to brands, sponsorships, and earning opportunities — with AI doing the matching.\n\nNo agent. No fees. Just results.\n\nhttps://athlynx.ai/nil-portal\n\n#NIL #AthlynXAI`,
  `Parents — this one is for you.\n\nYour child works harder than anyone you know. Early mornings. Late nights. Sacrifices most people will never understand.\n\nAthlynXAI makes sure that work gets seen by the coaches and brands who need to see it.\n\nHelp them build their profile today → https://athlynx.ai\n\n#CollegeRecruiting #AthlynXAI`,
  `Coaches — AthlynXAI's Pro Teams platform gives you AI-driven athlete intelligence.\n\nSearch by sport, position, stats, location, and eligibility. Find your next recruit before anyone else does.\n\nRequest a demo → https://athlynx.ai/pro-teams\n\n#SportsScouting #AthlynXAI`,
  `Faith. Family. Football.\n\nAthlynXAI's Warriors Playbook is more than a recruiting tool — it's a community for football athletes who compete with purpose.\n\nIron Sharpens Iron — Proverbs 27:17\n\nhttps://athlynx.ai/warriors-playbook\n\n#WarriorsPlaybook #AthlynXAI`,
  `The transfer portal isn't just for top recruits anymore.\n\nAthlynXAI helps athletes at smaller schools use the transfer portal strategically — to upgrade their school, increase their NIL value, and get in front of more coaches.\n\nExplore the portal → https://athlynx.ai/transfer-portal\n\n#TransferPortal #AthlynXAI`,
  `We built AthlynXAI in Houston, Texas — Chad Dozier and Glenn Tse — November 2024.\n\nFrom that decision to a live platform with 44 sports, 142 pages, and real AI engines — in less than 6 months.\n\nThis is what happens when you build with purpose.\n\nhttps://athlynx.ai\n\n#AthlynXAI #Founder`,
  `Diamond Grind Baseball is live on AthlynXAI.\n\nFull stats tracking, AI coaching, recruiting analytics, and NIL deals — all built specifically for baseball athletes.\n\nFrom Little League to the pros.\n\nhttps://athlynx.ai/baseball\n\n#DiamondGrind #BaseballNIL #AthlynXAI`,
  `AthlynXAI's X-Factor Feed is where athlete culture lives.\n\nHighlight reels. Big wins. Real talk about the grind.\n\nJoin the conversation → https://athlynx.ai/x-factor\n\n#AthlynXAI #AthleteLife #XFactor`,
];

// ─────────────────────────────────────────────────────────
// X/TWITTER POSTS — Under 280 chars. 1-2 hashtags. Punchy.
// No engagement bait. No "like if you agree."
// ─────────────────────────────────────────────────────────
const TWITTER_POSTS = [
  `The recruiting game is digital now. Is your athlete profile ready?\n\nathlynx.ai — free to start.\n\n#AthlynXAI #NIL`,
  `NIL isn't just for 5-star recruits.\n\nEvery athlete has a brand worth something.\n\nAthlynXAI connects you to the deals. athlynx.ai\n\n#NIL`,
  `44 sports. 142 platform pages. Dual AI engines. One platform.\n\nAthlynXAI is live. athlynx.ai\n\n#AthlynXAI`,
  `Coaches search online before they call.\n\nMake sure they find you first. athlynx.ai\n\n#CollegeRecruiting`,
  `Transfer portal season is year-round.\n\nAthlynXAI tracks every opportunity, every school, every NIL deal.\n\nathlynx.ai/transfer-portal\n\n#TransferPortal`,
  `Your highlight reel is your resume.\n\nUpload it. Share it. Get recruited.\n\nathlynx.ai\n\n#AthlynXAI #NIL`,
  `Iron Sharpens Iron.\n\nProverbs 27:17 — the verse behind everything we build.\n\nathlynx.ai\n\n#AthlynXAI`,
  `Diamond Grind Baseball — stats, AI coaching, NIL deals.\n\nAll in one place.\n\nathlynx.ai/baseball\n\n#DiamondGrind`,
  `Warriors Playbook — football athletes, your NIL era is now.\n\nathlynx.ai/warriors-playbook\n\n#WarriorsPlaybook`,
  `Youth → High School → College → Pro → Retired.\n\nEvery level. Every sport. AthlynXAI.\n\nathlynx.ai\n\n#AthlynXAI`,
  `Built in Houston. Built for every athlete.\n\nAthlynXAI — the great equalizer.\n\nathlynx.ai\n\n#AthlynXAI`,
  `The NIL Portal is open.\n\nConnect directly to brands. No agent. No fees.\n\nathlynx.ai/nil-portal\n\n#NIL`,
];

// ─────────────────────────────────────────────────────────
// LINKEDIN POSTS — Human voice. First-person. Real perspective.
// NO link in post body (kills reach). Max 3 hashtags.
// Short paragraphs. Sounds like a real person, not a bot.
// Only posts on Mon/Wed/Fri to stay within 3-4x/week limit.
// ─────────────────────────────────────────────────────────
const LINKEDIN_POSTS = [
  `I started AthlynXAI because I watched talented athletes get overlooked.\n\nNot because they weren't good enough.\n\nBecause they didn't have the right tools, the right connections, or the right platform to get seen.\n\nWe fixed that.\n\nAthlynXAI gives every athlete — regardless of school size or budget — the same tools that top recruits have always had.\n\nAI-powered recruiting. NIL marketplace. Real-time analytics. 44 sports.\n\nThis is what I was put here to build.\n\n#AthlynXAI #SportsTech #NIL`,
  `The NIL era didn't just change college sports.\n\nIt changed what it means to be an athlete.\n\nFor the first time, student-athletes can build a real brand, earn real money, and control their own career narrative — before they ever go pro.\n\nAthlynXAI is the platform that makes that possible for every athlete, not just the ones at Power 5 schools.\n\nWe built the infrastructure. Now we're filling it with athletes.\n\n#NIL #AthlynXAI #CollegiateAthletes`,
  `Six months ago, AthlynXAI didn't exist.\n\nToday it's a live platform with real athletes using it across 44 sports.\n\nWe didn't raise a Series A. We didn't have a team of 50 engineers.\n\nWe had conviction, a clear vision, and a relentless work ethic.\n\nThe pre-seed round is open. If you believe in what we're building, let's talk.\n\n#AthlynXAI #SportsTech #Startup`,
  `The transfer portal is the most underutilized tool in college athletics.\n\nMost athletes use it reactively — when things go wrong.\n\nThe smart ones use it proactively — to upgrade their situation, increase their NIL value, and get in front of more coaches.\n\nAthlynXAI's transfer portal analytics help athletes make that move strategically.\n\nThat's the edge we provide.\n\n#TransferPortal #NIL #AthlynXAI`,
  `I get asked all the time: why sports?\n\nBecause sports taught me everything I know about discipline, sacrifice, and what it means to compete.\n\nAnd because I've seen too many talented athletes fall through the cracks of a system that wasn't built for them.\n\nAthlynXAI is my answer to that system.\n\nIron Sharpens Iron — Proverbs 27:17\n\n#AthlynXAI #Leadership #SportsTech`,
  `Here is what most people get wrong about NIL:\n\nThey think it's only for athletes with 100K followers.\n\nIt's not.\n\nBrands want authenticity. They want athletes who represent their community, their sport, their values.\n\nA baseball player from a small town in Mississippi can be exactly what a regional brand needs.\n\nAthlynXAI's AI matching engine finds those connections. That's the business.\n\n#NIL #AthlynXAI #AthleteMarketing`,
  `Building AthlynXAI taught me one thing above everything else:\n\nSpeed matters more than perfection.\n\nWe shipped 142 platform pages in under 6 months. Not because we cut corners — because we stayed focused on what athletes actually need.\n\nRecruiting. NIL. Community. AI coaching. Stats.\n\nEverything else is noise.\n\n#AthlynXAI #Startup #SportsTech`,
  `The sports technology market is $135 billion and growing.\n\nNIL alone is a $2.5 billion market.\n\nAthlynXAI sits at the intersection of both — with a platform that serves athletes, coaches, brands, and pro teams.\n\nWe are early. We are building. And we are not slowing down.\n\n#AthlynXAI #SportsTech #NIL`,
];

// ─────────────────────────────────────────────────────────
// GOOGLE BUSINESS POSTS — Business updates, events, offers.
// No hashtags. Professional tone. Short.
// ─────────────────────────────────────────────────────────
const GOOGLE_BUSINESS_POSTS = [
  `AthlynXAI is now live at athlynx.ai — the complete AI-powered platform for athlete recruiting, NIL deals, and career management. Free to start. Sign up today.`,
  `AthlynXAI supports 44 sports including football, baseball, basketball, soccer, track, swimming, volleyball, and more. Every athlete. Every level. One platform. Visit athlynx.ai.`,
  `AthlynXAI's NIL Marketplace is open. Student-athletes can now connect directly with brands for sponsorships and endorsement deals. No agent required. Visit athlynx.ai/nil-portal.`,
  `Diamond Grind Baseball is live on AthlynXAI. Full stats tracking, AI coaching, and recruiting analytics built specifically for baseball athletes. Visit athlynx.ai/baseball.`,
  `Warriors Playbook — AthlynXAI's dedicated football platform — is now live. Recruiting analytics, film study tools, and NIL deal connections for football athletes. Visit athlynx.ai/warriors-playbook.`,
  `AthlynXAI's Transfer Portal analytics help athletes use the portal strategically — not just reactively. Find the right school, the right program, and the right NIL deal. Visit athlynx.ai/transfer-portal.`,
  `Pro Teams and coaching staff: AthlynXAI's scouting platform gives you AI-driven athlete intelligence across 44 sports. Request a demo at athlynx.ai/pro-teams.`,
  `AthlynXAI's Investor Hub is live with full market data, 5-year P&L projections, and competitive analysis. Pre-seed round open. Visit athlynx.ai/investor-hub.`,
];

// ─────────────────────────────────────────────────────────
// ROTATION HELPERS
// ─────────────────────────────────────────────────────────

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

function getHourSlot(): number {
  const hour = new Date().getUTCHours();
  if (hour < 14) return 0;  // 8am CST
  if (hour < 18) return 1;  // 12pm CST
  return 2;                  // 6pm CST
}

function getDayOfWeek(): number {
  return new Date().getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
}

/** LinkedIn only posts Mon(1), Wed(3), Fri(5) */
function isLinkedInPostDay(): boolean {
  const dow = getDayOfWeek();
  return dow === 1 || dow === 3 || dow === 5;
}

/** Google Business posts Mon(1), Wed(3), Sat(6) */
function isGoogleBusinessPostDay(): boolean {
  const dow = getDayOfWeek();
  return dow === 1 || dow === 3 || dow === 6;
}

function rotatePost(library: string[], seed: number): string {
  return library[seed % library.length];
}

// ─────────────────────────────────────────────────────────
// BUFFER API
// ─────────────────────────────────────────────────────────

async function postToBuffer(channelId: string, text: string, channelName: string): Promise<void> {
  const mutation = `
    mutation CreatePost($channelId: String!, $text: String!) {
      createPost(input: {
        channelId: $channelId
        text: $text
        schedulingType: automatic
        mode: shareNow
      }) {
        __typename
      }
    }
  `;

  try {
    const response = await fetch("https://api.buffer.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BUFFER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: mutation, variables: { channelId, text } }),
    });
    const result = await response.json() as any;
    const typename = result?.data?.createPost?.__typename;
    if (typename === "PostActionSuccess") {
      console.log(`[Buffer] ✅ ${channelName}: posted successfully`);
    } else {
      console.error(`[Buffer] ❌ ${channelName}:`, JSON.stringify(result?.errors || result?.data));
    }
  } catch (err) {
    console.error(`[Buffer] Error posting to ${channelName}:`, err);
  }
}

// ─────────────────────────────────────────────────────────
// MAIN CRON HANDLER
// Runs 3x/day via Vercel Cron (8am, 12pm, 6pm CST)
// Each platform gets its own content library and posting rules
// ─────────────────────────────────────────────────────────

export async function runSocialPostCron(): Promise<{ success: boolean; message: string }> {
  const day = getDayOfYear();
  const slot = getHourSlot();
  const seed = day * 3 + slot;

  console.log(`[SocialPostCron] Starting — Day: ${day} | Slot: ${slot} | Seed: ${seed}`);

  const posted: string[] = [];
  const skipped: string[] = [];

  // ── INSTAGRAM (chad_dozier) — 1x/day, morning slot only ──
  if (slot === 0) {
    const post = rotatePost(INSTAGRAM_POSTS, day);
    await postToBuffer(BUFFER_CHANNELS.instagram_chad_dozier, post, "Instagram/chad_dozier");
    posted.push("Instagram/chad_dozier");
  } else {
    skipped.push("Instagram/chad_dozier (1x/day only)");
  }

  // ── INSTAGRAM (chaddozier14) — 1x/day, afternoon slot only ──
  if (slot === 1) {
    const post = rotatePost(INSTAGRAM_POSTS, day + 5); // offset so different post from chad_dozier
    await postToBuffer(BUFFER_CHANNELS.instagram_chaddozier14, post, "Instagram/chaddozier14");
    posted.push("Instagram/chaddozier14");
  } else {
    skipped.push("Instagram/chaddozier14 (1x/day only)");
  }

  // ── FACEBOOK (AthlynX Page) — 1x/day, morning slot only ──
  if (slot === 0) {
    const post = rotatePost(FACEBOOK_POSTS, day);
    await postToBuffer(BUFFER_CHANNELS.facebook_athlynx, post, "Facebook/AthlynX");
    posted.push("Facebook/AthlynX");
  } else {
    skipped.push("Facebook/AthlynX (1x/day only)");
  }

  // ── FACEBOOK (Chad personal) — 1x/day, evening slot only ──
  if (slot === 2) {
    const post = rotatePost(FACEBOOK_POSTS, day + 5);
    await postToBuffer(BUFFER_CHANNELS.facebook_chad, post, "Facebook/Chad");
    posted.push("Facebook/Chad");
  } else {
    skipped.push("Facebook/Chad (1x/day only)");
  }

  // ── X/TWITTER — up to 2x/day (morning + evening), different posts ──
  if (slot === 0 || slot === 2) {
    const post = rotatePost(TWITTER_POSTS, seed);
    await postToBuffer(BUFFER_CHANNELS.twitter, post, "X/Twitter");
    posted.push("X/Twitter");
  } else {
    skipped.push("X/Twitter (2x/day — skip midday)");
  }

  // ── LINKEDIN — Mon/Wed/Fri only, morning slot, human-voice posts ──
  if (isLinkedInPostDay() && slot === 0) {
    const post = rotatePost(LINKEDIN_POSTS, day);
    await postToBuffer(BUFFER_CHANNELS.linkedin, post, "LinkedIn");
    posted.push("LinkedIn");
  } else {
    skipped.push("LinkedIn (Mon/Wed/Fri morning only)");
  }

  // ── GOOGLE BUSINESS — Mon/Wed/Sat only, morning slot ──
  if (isGoogleBusinessPostDay() && slot === 0) {
    const post = rotatePost(GOOGLE_BUSINESS_POSTS, day);
    await postToBuffer(BUFFER_CHANNELS.google_business, post, "Google Business");
    posted.push("Google Business");
  } else {
    skipped.push("Google Business (Mon/Wed/Sat morning only)");
  }

  console.log(`[SocialPostCron] ✅ Posted: ${posted.join(", ")}`);
  console.log(`[SocialPostCron] ⏭ Skipped: ${skipped.join(", ")}`);

  return {
    success: true,
    message: `Posted to: ${posted.join(", ")} | Skipped: ${skipped.join(", ")}`,
  };
}
