import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { deductAiCredits } from "../services/aiCredits";
import { invokeLLM, invokeClaudeDirectly } from "../_core/llm";
import { chatWithGemini, buildTrainerBotSystemPrompt } from "../services/gemini";
import { nebiusComplete, calculateXFactorScore, nebiusHealthCheck, NEBIUS_MODELS } from "../services/nebius";
import { getDb, getTrainerHistory, saveTrainerMessage } from "../db";
import { users, athleteProfiles, aiTrainerSessions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Credit costs per AI action (in credits)
const CREDIT_COSTS: Record<string, number> = {
  generateBrandPitch: 15,
  analyzeDeal: 10,
  optimizeProfile: 10,
  generateCoachEmail: 8,
  generateCaption: 5,
  generateBio: 8,
  generateContentPlan: 12,
  robotChat: 5,
  getRecruitingAdvice: 10,
  generateTrainingPlan: 10,
  wizardAdvice: 10,
  scheduleToBuffer: 3,   // social post scheduling
  trainerChat: 3,        // personal AI trainer bot message
};

/**
 * Deduct credits before running an AI action.
 * Throws FORBIDDEN if balance is insufficient.
 * Writes an audit row to credit_transactions (non-blocking).
 */
async function deductCredits(userId: number, action: string): Promise<number> {
  const cost = CREDIT_COSTS[action] ?? 5;
  await deductAiCredits({
    userId,
    action,
    cost,
    description: `AI action: ${action}`,
  });
  return cost;
}

export const aiRouter = router({
  // AI SALES — Brand pitch & deal analysis
  generateBrandPitch: protectedProcedure
    .input(z.object({
      athleteName: z.string(),
      sport: z.string(),
      school: z.string().optional(),
      followers: z.number().optional(),
      brandName: z.string(),
      brandCategory: z.string(),
      dealValue: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateBrandPitch");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an elite NIL (Name, Image, Likeness) deal strategist for college athletes. 
You write compelling, professional brand partnership pitches that convert. 
Keep responses concise, punchy, and results-focused. Format with clear sections.`,
          },
          {
            role: "user",
            content: `Write a professional brand partnership pitch for:
- Athlete: ${input.athleteName}
- Sport: ${input.sport}
- School: ${input.school ?? "College Athlete"}
- Social Following: ${input.followers?.toLocaleString() ?? "Growing"} followers
- Brand: ${input.brandName} (${input.brandCategory})
${input.dealValue ? `- Target Deal Value: $${input.dealValue.toLocaleString()}` : ""}

Include: Opening hook, athlete value proposition, brand alignment, deliverables, and a strong close. Keep it under 300 words.`,
          },
        ],
      });
      return { pitch: String(response.choices[0].message.content ?? "") };
    }),

  analyzeDeal: protectedProcedure
    .input(z.object({
      brandName: z.string(),
      dealValue: z.number(),
      deliverables: z.string(),
      athleteFollowers: z.number().optional(),
      sport: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "analyzeDeal");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are an expert NIL deal analyst. Evaluate deals objectively and provide actionable insights. Be direct and specific.",
          },
          {
            role: "user",
            content: `Analyze this NIL deal:
- Brand: ${input.brandName}
- Offer: $${input.dealValue.toLocaleString()}
- Deliverables: ${input.deliverables}
- Athlete Followers: ${input.athleteFollowers?.toLocaleString() ?? "Unknown"}
- Sport: ${input.sport ?? "College Sport"}

Provide: Deal rating (1-10), fair market value assessment, red flags if any, negotiation tips, and final recommendation. Be direct.`,
          },
        ],
      });
      return { analysis: String(response.choices[0].message.content ?? "") };
    }),

  // AI RECRUITER — Profile optimization & coach outreach
  optimizeProfile: protectedProcedure
    .input(z.object({
      sport: z.string(),
      position: z.string().optional(),
      school: z.string().optional(),
      gpa: z.number().optional(),
      height: z.string().optional(),
      weight: z.string().optional(),
      bio: z.string().optional(),
      achievements: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "optimizeProfile");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a top college recruiting consultant who has helped hundreds of athletes get scholarships. 
You know exactly what coaches look for and how to make profiles stand out. Be specific and actionable.`,
          },
          {
            role: "user",
            content: `Optimize this athlete's recruiting profile:
- Sport: ${input.sport}
- Position: ${input.position ?? "Not specified"}
- Current School: ${input.school ?? "Not specified"}
- GPA: ${input.gpa ?? "Not specified"}
- Height/Weight: ${input.height ?? "?"} / ${input.weight ?? "?"}
- Current Bio: ${input.bio ?? "None provided"}
- Achievements: ${input.achievements ?? "None listed"}

Provide: 1) Rewritten bio (under 150 words), 2) Top 3 profile improvements, 3) Key stats to highlight, 4) Recruiting strategy tip. Format clearly.`,
          },
        ],
      });
      return { optimized: String(response.choices[0].message.content ?? "") };
    }),

  generateCoachEmail: protectedProcedure
    .input(z.object({
      athleteName: z.string(),
      sport: z.string(),
      position: z.string().optional(),
      school: z.string().optional(),
      targetSchool: z.string(),
      coachName: z.string().optional(),
      gpa: z.number().optional(),
      achievements: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateCoachEmail");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a recruiting expert who writes compelling, professional outreach emails to college coaches. Emails should be personal, specific, and action-oriented. Keep them under 200 words.",
          },
          {
            role: "user",
            content: `Write a coach outreach email for:
- Athlete: ${input.athleteName}
- Sport: ${input.sport}, Position: ${input.position ?? "Not specified"}
- Current School: ${input.school ?? "High School/Transfer"}
- Target School: ${input.targetSchool}
- Coach: ${input.coachName ?? "Head Coach"}
- GPA: ${input.gpa ?? "Strong"}
- Key Achievements: ${input.achievements ?? "Competitive athlete"}

Write a professional, genuine email that will get a response. Include subject line.`,
          },
        ],
      });
      return { email: String(response.choices[0].message.content ?? "") };
    }),

  // AI CONTENT — Social media content generation
  generateCaption: protectedProcedure
    .input(z.object({
      platform: z.enum(["instagram", "twitter", "tiktok", "linkedin"]),
      contentType: z.enum(["highlight", "training", "gameday", "nil_deal", "motivation", "recruiting"]),
      context: z.string(),
      athleteName: z.string().optional(),
      sport: z.string().optional(),
      includeHashtags: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateCaption");
      const platformGuides: Record<string, string> = {
        instagram: "engaging, 150-200 chars, story-driven, with emojis",
        twitter: "punchy, under 280 chars, conversational, trending",
        tiktok: "energetic, hook-first, youth-focused, viral potential",
        linkedin: "professional, achievement-focused, career-oriented",
      };
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a social media expert for college athletes. You create viral, authentic content that builds personal brands and attracts NIL deals. You understand each platform's unique voice.`,
          },
          {
            role: "user",
            content: `Generate a ${input.platform} caption for a ${input.contentType} post.
Platform style: ${platformGuides[input.platform]}
Context: ${input.context}
${input.athleteName ? `Athlete: ${input.athleteName}` : ""}
${input.sport ? `Sport: ${input.sport}` : ""}
${input.includeHashtags ? "Include 5-8 relevant hashtags." : "No hashtags."}

Write 3 caption options, numbered. Make them authentic and platform-native.`,
          },
        ],
      });
      return { captions: String(response.choices[0].message.content ?? "") };
    }),

  generateBio: protectedProcedure
    .input(z.object({
      platform: z.enum(["instagram", "twitter", "tiktok", "linkedin"]),
      athleteName: z.string(),
      sport: z.string(),
      school: z.string().optional(),
      position: z.string().optional(),
      achievements: z.string().optional(),
      personality: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateBio");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You write compelling athlete social media bios that attract followers, coaches, and brand deals. Keep them punchy and memorable.",
          },
          {
            role: "user",
            content: `Write a ${input.platform} bio for:
- Name: ${input.athleteName}
- Sport: ${input.sport} | Position: ${input.position ?? ""}
- School: ${input.school ?? "College Athlete"}
- Achievements: ${input.achievements ?? "Competitive athlete"}
- Personality: ${input.personality ?? "Driven, focused, team player"}

Write 2 bio options. Keep each under 150 characters for Instagram/Twitter, or 3 sentences for LinkedIn.`,
          },
        ],
      });
      return { bios: String(response.choices[0].message.content ?? "") };
    }),

  generateContentPlan: protectedProcedure
    .input(z.object({
      sport: z.string(),
      season: z.enum(["preseason", "in-season", "offseason", "postseason"]),
      goals: z.string(),
      platforms: z.array(z.string()),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateContentPlan");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a digital marketing strategist specializing in athlete personal branding. You create actionable 30-day content plans that grow audiences and attract NIL deals.",
          },
          {
            role: "user",
            content: `Create a 30-day content plan for a ${input.sport} athlete:
- Season: ${input.season}
- Goals: ${input.goals}
- Platforms: ${input.platforms.join(", ")}

Provide: Weekly themes, 3 content ideas per week, best posting times, and one viral content idea. Format as a clear schedule.`,
          },
        ],
      });
      return { plan: String(response.choices[0].message.content ?? "") };
    }),

  // AI ROBOT COMPANION — Conversational robot assistant for athletes
  robotChat: protectedProcedure
    .input(z.object({
      message: z.string(),
      scenario: z.string().optional(),
      sport: z.string().optional(),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "robotChat");
      const systemPrompt = `You are LYNX — the AthlynXAI Robot Companion. You are a friendly, knowledgeable, and motivating AI assistant built specifically for athletes.

You help athletes with:
- Training tips, drills, and workout plans for any sport
- Recruiting advice and college selection
- NIL deals, brand partnerships, and contract guidance
- Game strategy, film review, and play analysis
- Recovery, nutrition, and wellness
- Mental performance and pre-game preparation
- Social media growth and personal branding
- Academic balance and time management
- Transfer portal decisions
- Anything an athlete needs in the stands, on the field, in the locker room, or at home

Current scenario: ${input.scenario ?? "General athlete assistance"}
Athlete's sport: ${input.sport ?? "Not specified"}

Be encouraging, specific, and practical. Use sports terminology naturally. Keep responses focused and actionable. You are their robot teammate who never sleeps.`;

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...(input.history ?? []).map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
        { role: "user" as const, content: input.message },
      ];

      const response = await invokeLLM({ messages });
      return { reply: String(response.choices[0].message.content ?? "") };
    }),

  // AI PLAYBOOK — The Athlete Playbook recruiting intelligence
  getRecruitingAdvice: protectedProcedure
    .input(z.object({
      sport: z.string(),
      position: z.string().optional(),
      currentSchool: z.string().optional(),
      targetLevel: z.enum(["D1", "D2", "D3", "NAIA", "JUCO", "Transfer"]),
      gpa: z.number().optional(),
      question: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "getRecruitingAdvice");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are "The Athlete Playbook" — AthlynX's AI recruiting intelligence engine. 
You have deep knowledge of college recruiting timelines, NCAA rules, NIL regulations, and what coaches want.
You help athletes from all backgrounds — especially those from smaller schools — maximize their recruiting potential.
Be specific, encouraging, and actionable. Reference real recruiting timelines and NCAA rules where relevant.`,
          },
          {
            role: "user",
            content: `Athlete Profile:
- Sport: ${input.sport}
- Position: ${input.position ?? "Not specified"}
- Current School: ${input.currentSchool ?? "Not specified"}
- Target Level: ${input.targetLevel}
- GPA: ${input.gpa ?? "Not specified"}

Question: ${input.question}

Provide a detailed, actionable answer. Include specific next steps, timelines, and resources.`,
          },
        ],
      });
      return { advice: String(response.choices[0].message.content ?? "") };
    }),

  // AI TRAINING BOT — Personalized training plan generator
  generateTrainingPlan: protectedProcedure
    .input(z.object({
      prompt: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateTrainingPlan");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are LYNX — the AthlynXAI Training Coach. You create detailed, personalized training plans for athletes of all sports and levels.
Your plans are sport-specific, periodized, and include strength, conditioning, skill work, recovery, nutrition, and hydration guidance.
Format your response with clear sections: Overview, Weekly Schedule (Mon-Sun), Nutrition & Hydration, Recovery Protocol, and Key Metrics to Track.
Be motivating, specific, and actionable. The athlete should be able to start this plan immediately.`,
          },
          {
            role: "user",
            content: `Create a complete personalized training plan:\n${input.prompt}\n\nProvide a full, detailed, ready-to-execute training plan.`,
          },
        ],
      });
      return { result: String(response.choices[0].message.content ?? "") };
    }),

  // WIZARD AI — Powers all 8 wizard pages with real AI advice
  wizardAdvice: protectedProcedure
    .input(z.object({
      wizardType: z.enum(["career", "transfer", "scout", "scholarship", "life", "lawyer", "financial", "agent"]),
      context: z.string().min(1).max(3000),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "wizardAdvice");
      const systemPrompts: Record<string, string> = {
        career: `You are the AthlynX Career Wizard — an elite athletic career advisor. Create a personalized, actionable career roadmap. Include: Immediate Actions (next 30 days), 6-Month Milestones, Long-Term Goals, and Key Resources. Be specific, motivating, and practical. Use clear sections and bullet points.`,
        transfer: `You are the AthlynX Transfer Wizard — an NCAA Transfer Portal expert. Guide the athlete through every step: eligibility rules, waiver process, finding the right programs, communicating with coaches, and making the best decision. Include specific timelines and NCAA rules.`,
        scout: `You are the AthlynX Scout Wizard — a professional recruiting and scouting advisor. Help the athlete get noticed by coaches and scouts. Provide specific advice on highlight reels, showcase events, recruiting profiles, coach outreach, and positioning for the next level.`,
        scholarship: `You are the AthlynX Scholarship Wizard — an expert on athletic and academic scholarships. Help the athlete find, apply for, and win scholarships. Include specific scholarship opportunities, application tips, deadlines, and how to maximize financial aid packages.`,
        life: `You are the AthlynX Life Wizard — a life skills and personal development coach for athletes. Help with time management, mental health, relationships, social media, money management, and life after sports. Be empathetic, practical, and actionable.`,
        lawyer: `You are the AthlynX Legal Wizard — a sports law educator (providing legal education, not legal advice). Help athletes understand NIL contracts, agent agreements, endorsement deals, eligibility rules, and their rights. Always recommend consulting a licensed attorney for specific legal matters.`,
        financial: `You are the AthlynX Financial Wizard — a financial literacy coach for athletes. Help with budgeting, NIL income management, taxes, investing, building credit, and long-term wealth. Be practical and specific with numbers and examples.`,
        agent: `You are the AthlynX Agent Wizard — an expert on finding, evaluating, and working with sports agents and advisors. Help athletes understand agent contracts, NCPA/NFLPA certified agents, red flags to avoid, negotiation basics, and how to build the right team around them.`,
      };
      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompts[input.wizardType] },
          { role: "user", content: input.context },
        ],
      });
      return { result: String(response.choices[0].message.content ?? "") };
    }),

  // GET CREDITS — Returns the user's current credit balance
  getCredits: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { credits: 0 };
      const [user] = await db.select({ credits: users.credits }).from(users).where(eq(users.id, ctx.user!.id)).limit(1);
      return { credits: user?.credits ?? 0 };
    }),

  // BUFFER SCHEDULING — Schedule a post to Buffer social channels
  scheduleToBuffer: protectedProcedure
    .input(z.object({
      text: z.string(),
      channels: z.array(z.enum(["twitter", "facebook", "instagram", "tiktok"])).default(["twitter", "instagram"]),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "scheduleToBuffer");
      const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN;
      if (!BUFFER_TOKEN) throw new Error("Buffer not configured");
      const CHANNEL_IDS: Record<string, string> = {
        twitter:   "69e5f1dd031bfa423c2229ad",
        tiktok:    "69e613fb031bfa423c22ac3e",
        facebook:  "69e61f4f031bfa423c22e698",
        instagram: "69e61f6e031bfa423c22e6f4",
      };
      const mutation = `mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { ... on Post { id status } ... on PostError { type message } } }`;
      const results: { channel: string; success: boolean; id?: string; error?: string }[] = [];
      for (const channel of input.channels) {
        const channelId = CHANNEL_IDS[channel];
        if (!channelId) continue;
        try {
          const res = await fetch("https://api.buffer.com/graphql", {
            method: "POST",
            headers: { "Authorization": `Bearer ${BUFFER_TOKEN}`, "Content-Type": "application/json" },
            body: JSON.stringify({ query: mutation, variables: { input: { channelId, text: input.text, scheduledAt: null } } }),
          });
          const data = await res.json() as any;
          const post = data?.data?.createPost;
          if (post?.id) results.push({ channel, success: true, id: post.id });
          else results.push({ channel, success: false, error: post?.message || "Unknown error" });
        } catch (err: any) {
          results.push({ channel, success: false, error: err.message });
        }
      }
      return { results, posted: results.filter(r => r.success).length };
    }),

  // ─── PERSONAL AI TRAINER BOT ──────────────────────────────────────────────
  // trainerChat — send a message to the athlete's personal AI Trainer Bot
  trainerChat: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      sessionTag: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "trainerChat");
      const db = await getDb();
      // Load athlete profile for personalization
      let profileContext = "";
      if (db) {
        const [profile] = await db.select().from(athleteProfiles).where(eq(athleteProfiles.userId, ctx.user!.id)).limit(1);
        if (profile) {
          profileContext = `\nAthlete Profile:\n- Sport: ${profile.sport ?? "Unknown"}\n- Position: ${profile.position ?? "Unknown"}\n- School: ${profile.school ?? "Unknown"}\n- Year: ${profile.year ?? "Unknown"}\n- GPA: ${profile.gpa ?? "N/A"}\n- Height: ${profile.height ?? "N/A"}, Weight: ${profile.weight ?? "N/A"}lbs\n- Hometown: ${profile.hometown ?? "Unknown"}\n- Recruiting Score: ${profile.recruitingScore ?? 0}/100\n- NIL Value: $${profile.nilValue ?? 0}`;
        }
      }
      // Load conversation history (last 20 messages for context window)
      const history = await getTrainerHistory(ctx.user!.id, 20);
      const systemPrompt = `You are the AthlynXAI Personal AI Trainer Bot — an elite, dedicated AI coach assigned exclusively to this athlete. You know everything about them and remember every conversation.${profileContext}\n\nYour role covers:\n- Personalized training plans and daily workouts\n- NIL deal strategy and brand partnerships\n- Recruiting guidance and coach outreach\n- Mental performance and mindset coaching\n- Nutrition and recovery protocols\n- Transfer portal strategy\n- Financial literacy for athletes\n- Career planning and life after sports\n\nBe direct, motivating, and specific. Use the athlete's actual profile data in your responses. Remember previous conversations. You are their personal coach — not a generic assistant. Speak like an elite trainer who knows this athlete deeply.`;
      // Use native Gemini SDK for the trainer bot — better memory, faster, more personalized
      const geminiHistory = history.map((h: { role: string; content: string }) => ({
        role: h.role === "assistant" ? "model" as const : "user" as const,
        content: h.content,
      }));
      const assistantReply = await chatWithGemini(input.message, {
        systemInstruction: systemPrompt,
        history: geminiHistory,
        temperature: 0.85,
        maxOutputTokens: 4096,
      });
      // Persist both messages to the database
      await saveTrainerMessage({ userId: ctx.user!.id, role: "user", content: input.message, sessionTag: input.sessionTag });
      await saveTrainerMessage({ userId: ctx.user!.id, role: "assistant", content: assistantReply, sessionTag: input.sessionTag });
      return { reply: assistantReply };
    }),

  // trainerHistory — get the athlete's full conversation history with their bot
  trainerHistory: protectedProcedure
    .query(async ({ ctx }) => {
      const history = await getTrainerHistory(ctx.user!.id, 60);
      return { messages: history };
    }),

  // trainerClear — clear conversation history for a fresh start
  trainerClear: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { cleared: 0 };
      const result = await db.delete(aiTrainerSessions).where(eq(aiTrainerSessions.userId, ctx.user!.id));
      return { cleared: (result as any).rowsAffected ?? 0 };
    }),

  // ─── NEBIUS AI ENGINE ─────────────────────────────────────────────────────
  // nebiusHealthCheck — verify Nebius AI is live and responding
  nebiusHealthCheck: publicProcedure
    .query(async () => {
      const result = await nebiusHealthCheck();
      return result;
    }),

  // calculateXFactor — AI-powered athlete X-Factor score using Nebius Llama-3.3-70B
  calculateXFactor: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      sport: z.string().optional(),
      position: z.string().optional(),
      school: z.string().optional(),
      gpa: z.number().optional(),
      height: z.string().optional(),
      weight: z.number().optional(),
      sportStats: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
      recruitingStatus: z.string().optional(),
      nilValue: z.number().optional(),
      followers: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "wizardAdvice");
      const db = await getDb();
      let athleteData = { ...input };
      // Auto-fill from DB profile if fields missing
      if (db) {
        const [profile] = await db.select().from(athleteProfiles).where(eq(athleteProfiles.userId, ctx.user!.id)).limit(1);
        if (profile) {
          athleteData = {
            name: input.name || ctx.user!.name || "Athlete",
            sport: input.sport || profile.sport || "Unknown",
            position: input.position || profile.position || "Unknown",
            school: input.school || profile.school || "Unknown",
            gpa: input.gpa ?? (profile.gpa ? Number(profile.gpa) : undefined),
            height: input.height || profile.height || undefined,
            weight: input.weight ?? (profile.weight ? Number(profile.weight) : undefined),
            sportStats: input.sportStats || (profile.sportStats as any) || {},
            recruitingStatus: input.recruitingStatus || profile.recruitingStatus || "available",
            nilValue: input.nilValue ?? (profile.nilValue ? Number(profile.nilValue) : undefined),
            followers: input.followers ?? (profile.followers ? Number(profile.followers) : undefined),
          };
        }
      }
      const result = await calculateXFactorScore({
        name: athleteData.name || ctx.user!.name || "Athlete",
        sport: athleteData.sport || "Unknown",
        position: athleteData.position || "Unknown",
        school: athleteData.school || "Unknown",
        gpa: athleteData.gpa,
        height: athleteData.height,
        weight: athleteData.weight,
        sportStats: athleteData.sportStats,
        recruitingStatus: athleteData.recruitingStatus,
        nilValue: athleteData.nilValue,
        followers: athleteData.followers,
      });
      return result;
    }),

  // claudeChat — Anthropic Claude Opus: contract review, NIL analysis, legal guidance, deep reasoning
  claudeChat: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(8000),
      systemPrompt: z.string().optional(),
      task: z.enum(["contract_review", "nil_analysis", "legal_guidance", "academic_planning", "general"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "wizardAdvice");
      const taskPrompts: Record<string, string> = {
        contract_review: "You are AthlynX Claude — an expert sports contract attorney AI. Analyze NIL contracts, identify red flags, explain terms in plain English, and protect the athlete's interests. Be thorough and specific.",
        nil_analysis: "You are AthlynX Claude — an NIL deal analyst. Evaluate brand partnerships, calculate fair market value, assess compliance risks, and maximize athlete earnings.",
        legal_guidance: "You are AthlynX Claude — a sports law AI advisor. Guide athletes on eligibility rules, transfer regulations, NIL compliance, and NCAA/NAIA/NJCAA requirements.",
        academic_planning: "You are AthlynX Claude — an academic advisor for student-athletes. Help with course planning, GPA management, eligibility requirements, and balancing sports with academics.",
        general: "You are AthlynX Claude — powered by Anthropic. You are the deep reasoning engine of the AthlynXAI platform. Provide thoughtful, detailed analysis for athletes at every level.",
      };
      const systemPrompt = input.systemPrompt || taskPrompts[input.task || "general"];
      const result = await invokeClaudeDirectly({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input.message },
        ],
      });
      const reply = typeof result.choices[0].message.content === "string"
        ? result.choices[0].message.content
        : JSON.stringify(result.choices[0].message.content);
      return { reply, engine: process.env.ANTHROPIC_API_KEY ? "claude" : "gemini" };
    }),

  // generateScoutingReport — AI-powered scouting report (S39)
  generateScoutingReport: protectedProcedure
    .input(z.object({
      athleteName: z.string(),
      sport: z.string(),
      position: z.string(),
      school: z.string(),
      year: z.string().optional(),
      state: z.string().optional(),
      xScore: z.number().optional(),
      fortyYd: z.string().optional(),
      vertical: z.string().optional(),
      bench: z.number().optional(),
      gpa: z.number().optional(),
      offers: z.number().optional(),
      nilValue: z.number().optional(),
      highlights: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "wizardAdvice");
      const statsBlock = [
        input.fortyYd ? `40-Yard Dash: ${input.fortyYd}s` : null,
        input.vertical ? `Vertical Leap: ${input.vertical}"` : null,
        input.bench ? `Bench Press: ${input.bench} reps` : null,
        input.gpa ? `GPA: ${input.gpa}` : null,
        input.offers ? `College Offers: ${input.offers}` : null,
        input.nilValue ? `NIL Value: $${input.nilValue.toLocaleString()}` : null,
        input.xScore ? `AthlynX X-Factor Score: ${input.xScore}/100` : null,
      ].filter(Boolean).join("\n");
      const prompt = `Generate a professional, detailed AI scouting report for the following athlete. Structure it with these exact sections:\n\n## EXECUTIVE SUMMARY\n## ATHLETIC PROFILE\n## PERFORMANCE METRICS\n## RECRUITING OUTLOOK\n## NIL POTENTIAL\n## STRENGTHS\n## AREAS FOR DEVELOPMENT\n## SCOUT RECOMMENDATION\n\nBe specific, data-driven, and professional — like a D1 recruiting coordinator would write.\n\nAthlete: ${input.athleteName}\nSport: ${input.sport}\nPosition: ${input.position}\nSchool: ${input.school}${input.state ? `, ${input.state}` : ""}\nClass Year: ${input.year || "2027"}\n\nStats & Metrics:\n${statsBlock || "Stats not yet submitted"}\n\n${input.highlights ? `Additional Notes: ${input.highlights}` : ""}`;
      const reply = await nebiusComplete(
        prompt,
        "You are an elite college recruiting scout with 20 years of experience evaluating talent across all major sports. You write detailed, professional scouting reports used by D1 programs and professional organizations. Your reports are data-driven, honest, and actionable.",
        NEBIUS_MODELS.LLAMA_70B
      );
      return { report: reply, athleteName: input.athleteName, generatedAt: new Date().toISOString() };
    }),

  // nebiusChat — direct chat with Nebius Llama-3.3-70B on NVIDIA H200 (premium AI feature)
  nebiusChat: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(4000),
      systemPrompt: z.string().optional(),
      model: z.enum([
        "meta-llama/Llama-3.3-70B-Instruct",
        "meta-llama/Meta-Llama-3.1-8B-Instruct",
        "nvidia/Llama-3_1-Nemotron-Ultra-253B-v1",
      ]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "wizardAdvice");
      const reply = await nebiusComplete(
        input.message,
        input.systemPrompt || "You are the AthlynXAI — an elite sports intelligence assistant. Help athletes with NIL deals, recruiting, training, and career development.",
        (input.model as any) || NEBIUS_MODELS.LLAMA_70B
      );
      return { reply };
    }),
});
