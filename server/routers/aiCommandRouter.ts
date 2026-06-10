/**
 * AthlynXAI Command Layer — Layer Cake Architecture (GTC 2026)
 * ─────────────────────────────────────────────────────────────
 * Jensen Huang's vision: stacked AI agents, each layer autonomous,
 * tokens as the currency of intelligence.
 *
 * Layer 1: Data (Neon PostgreSQL)
 * Layer 2: AI Intelligence (Gemini 2.5 Flash via Google Workspace)
 * Layer 3: Autonomous Actions (auto-enrich, auto-email, auto-post)
 * Layer 4: Mobile Command (voice → action, anywhere in the world)
 *
 * All under cdozier14@athlynx.ai — 1 account, 1 platform, all companies.
 */

import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { deductAiCredits } from "../services/aiCredits";
import OpenAI from "openai";

// Gemini via OpenAI SDK (per Master Reference — always use this, not direct API)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const gemini = new OpenAI({
  apiKey: GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// All Gemini models available — latest stable (S37 May 2026)
const GEMINI_MODELS = {
  flash:     "gemini-2.5-flash",       // Production primary — fast + accurate
  pro:       "gemini-2.5-pro",         // Flagship — most powerful
  flashLite: "gemini-2.5-flash-lite",  // Lightest — high volume tasks
  vision:    "gemini-2.5-flash",       // Vision tasks
} as const;

// ── Credit costs for AI Command actions ────────────────────────────────────
const CMD_CREDIT_COSTS: Record<string, number> = {
  query:              5,   // Universal AI query
  generateSocialPost: 5,   // Social post generation
  captureLead:        2,   // Lead capture (low cost — drives signups)
  analyzeImage:       8,   // Vision analysis
};

/**
 * Deduct credits for an AI Command action.
 *
 * Doctrine (May 29, 2026):
 *   - Master Admin Doctrine users (Chad/Lee/Glenn/Tony) with
 *     unlimited_credits=true OR billing_exempt=true are NEVER charged.
 *   - All other users: atomic deduct using SQL conditional UPDATE so
 *     concurrent calls cannot drive the balance negative.
 *   - Audit row written to credit_transactions (non-blocking).
 */
async function deductCommandCredits(userId: number, action: string): Promise<void> {
  const cost = CMD_CREDIT_COSTS[action] ?? 5;
  await deductAiCredits({
    userId,
    action: `aiCommand.${action}`,
    cost,
    description: `AI Command: ${action}`,
  });
}

// ── SYSTEM PROMPT: The DHG AI Brain ────────────────────────────────────────
const DHG_SYSTEM_PROMPT = `You are the AthlynXAI — the autonomous intelligence layer of the Dozier Holdings Group empire.

You run ALL of these companies from one platform:
- AthlynXAI (athlynx.ai) — The Athlete's Playbook
- Dozier Holdings Group — Parent holding company, Houston TX
- Softmor Inc — Technology division, AI & hardware
- NIL Portal Inc — Name, Image, Likeness marketplace
- ConCreator™ — B2B Data Intelligence & AI Credit System

Your job is to:
1. Answer any question about the platform, companies, athletes, or business
2. Generate content, proposals, emails, and reports automatically
3. Enrich CRM contacts with AI intelligence
4. Help athletes with NIL deals, recruiting, and career decisions
5. Help B2B clients understand ConCreator™ tiers and pricing
6. Run autonomously — the platform gets smarter with every user

Key facts:
- Founder · CEO · Chairman · Master Admin: Chad A. Dozier Sr. | chaddozier75@gmail.com | +1-601-498-5282
- CFO & COO: Glenn M. Tse | gtse@dozierholdingsgroup.com
- VP Sales, Marketing & Partnerships: Leronious (Lee) Marshall Jr. | lmarshall@athlynx.ai
- First Athlete Partner & Partner: Tony Locey | tlockey24@athlynx.ai
- Founded: November 2024, Laurel MS / Houston TX (Dozier Holdings Group)
- Live platform: athlynx.ai | 13 mirror domains | 7-day free trial
- ConCreator™ tiers: Pulse $297 · Insight $597 · Command $997 · Enterprise $1,997 (per machine/mo)

Always be direct, confident, and results-focused. `;

export const aiCommandRouter = router({

  /**
   * Universal AI Query — runs any command through Gemini
   * Costs 5 credits per query
   */
  query: protectedProcedure
    .input(z.object({
      message:  z.string().min(1).max(4000),
      context:  z.string().optional(),
      history:  z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCommandCredits(ctx.user!.id, "query");

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: DHG_SYSTEM_PROMPT },
        ...(input.history ?? []),
        { role: "user", content: input.context ? `[Context: ${input.context}]\n\n${input.message}` : input.message },
      ];

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      });

      return {
        reply:    response.choices[0]?.message?.content ?? "No response",
        tokens:   response.usage?.total_tokens ?? 0,
        model:    "gemini-2.5-flash",
      };
    }),

  /**
   * Auto-Enrich Contact — admin only, no credit cost
   */
  enrichContact: adminProcedure
    .input(z.object({
      name:    z.string(),
      company: z.string().optional(),
      email:   z.string().optional(),
      role:    z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `Research this contact and provide business intelligence:
Name: ${input.name}
Company: ${input.company ?? "Unknown"}
Email: ${input.email ?? "Unknown"}
Role: ${input.role ?? "Unknown"}

Provide:
1. Company overview (industry, size, revenue estimate)
2. Likely pain points we can solve with AthlynX or ConCreator™
3. Recommended DHG product (AthlynX, ConCreator™, Softmor services)
4. Suggested opening email subject line
5. Confidence score (1-10) that this is a good prospect

Be concise. Real data only.`;

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 800,
      });

      return {
        intelligence: response.choices[0]?.message?.content ?? "",
        enrichedAt:   new Date().toISOString(),
      };
    }),

  /**
   * Auto-Generate Proposal — admin only, no credit cost
   */
  generateProposal: adminProcedure
    .input(z.object({
      companyName:  z.string(),
      contactName:  z.string(),
      product:      z.enum(["concreator", "athlynx", "softmor", "dhg"]),
      tier:         z.string().optional(),
      machineCount: z.number().optional(),
      notes:        z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const productDetails = {
        concreator: `ConCreator™ Data Intelligence & AI Credit System — ${input.tier ?? "Command"} tier at $997/machine/month. ${input.machineCount ?? 1} machines = $${(997 * (input.machineCount ?? 1)).toLocaleString()}/month.`,
        athlynx:    "AthlynXAI — The Athlete's Playbook. 7-day free trial, then $9.99-$99.99/month.",
        softmor:    "Softmor Inc. — Custom AI software & hardware solutions. Enterprise pricing.",
        dhg:        "Dozier Holdings Group — Strategic partnership & investment opportunity.",
      };

      const prompt = `Write a professional business proposal email for:

TO: ${input.contactName} at ${input.companyName}
FROM: Chad A. Dozier Sr., Founder & CEO — Dozier Holdings Group
PRODUCT: ${productDetails[input.product]}
NOTES: ${input.notes ?? "None"}

Requirements:
- Professional but direct tone
- Lead with their pain point, not our product
- Include specific ROI numbers
- Clear call to action (schedule a call: calendly.com/cdozier14)
- Sign off as Chad A. Dozier Sr.
- Max 200 words
- Subject line included`;

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 600,
      });

      return {
        proposal:    response.choices[0]?.message?.content ?? "",
        generatedAt: new Date().toISOString(),
      };
    }),

  /**
   * Auto-Generate Social Post — costs 5 credits
   */
  generateSocialPost: protectedProcedure
    .input(z.object({
      topic:    z.string(),
      platform: z.enum(["instagram", "linkedin", "twitter", "facebook", "tiktok", "all"]),
      tone:     z.enum(["motivational", "professional", "hype", "educational"]).default("motivational"),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCommandCredits(ctx.user!.id, "generateSocialPost");

      const platformGuidelines = {
        instagram: "Instagram: 2200 chars max, 5-10 hashtags, visual storytelling, athlete-focused",
        linkedin:  "LinkedIn: Professional, thought leadership, business value, no hashtag spam",
        twitter:   "Twitter/X: Under 280 chars, punchy, direct, one strong hook",
        facebook:  "Facebook: Conversational, community-building, longer form OK",
        tiktok:    "TikTok: Hook in first 3 words, trending language, call to action",
        all:       "Create versions for Instagram, LinkedIn, Twitter, and Facebook",
      };

      const prompt = `Create a ${input.tone} social media post about: ${input.topic}

Platform: ${platformGuidelines[input.platform]}

Brand voice: AthlynXAI — The Athlete's Playbook. Empowering athletes from youth to pro. NIL deals, recruiting, AI training. Dreams Do Come True. A Dozier Holdings Group Company.

Always end with: #AthlynX #TheAthletesPlaybook #DreamsDoComeTrue`;

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 800,
      });

      return {
        post:        response.choices[0]?.message?.content ?? "",
        platform:    input.platform,
        generatedAt: new Date().toISOString(),
      };
    }),

  /**
   * Daily Intelligence Report — admin only, no credit cost
   */
  generateDailyReport: adminProcedure
    .input(z.object({
      signups:     z.number(),
      revenue:     z.number(),
      waitlist:    z.number(),
      crmContacts: z.number(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `Generate a concise daily intelligence report for Chad A. Dozier Sr.:

Platform Stats (last 24 hours):
- New Signups: ${input.signups}
- Revenue: $${input.revenue.toLocaleString()}
- Waitlist: ${input.waitlist}
- CRM Contacts: ${input.crmContacts}

Format as a brief executive summary (5 bullet points max).
Include: what's working, what needs attention, one action item.
Tone: direct, no fluff, results-focused.`;

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 400,
      });

      return {
        report:      response.choices[0]?.message?.content ?? "",
        generatedAt: new Date().toISOString(),
        sentTo:      "cdozier14@athlynx.ai",
      };
    }),

  /**
   * Reverse Funnel Capture — costs 2 credits (drives signups)
   */
  captureLead: protectedProcedure
    .input(z.object({
      name:    z.string().optional(),
      email:   z.string().email().optional(),
      phone:   z.string().optional(),
      sport:   z.string().optional(),
      school:  z.string().optional(),
      source:  z.string(),
      role:    z.string().default("Athlete"),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCommandCredits(ctx.user!.id, "captureLead");

      const followUpPrompt = `Write a brief, personalized welcome message for:
Name: ${input.name ?? "Athlete"}
Sport: ${input.sport ?? "Unknown"}
School: ${input.school ?? "Unknown"}
Source: ${input.source}

Max 3 sentences. Warm, direct, mention their sport if known.
Sign as: The AthlynX Team`;

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: followUpPrompt },
        ],
        max_tokens: 150,
      });

      return {
        captured:    true,
        followUp:    response.choices[0]?.message?.content ?? "",
        source:      input.source,
        capturedAt:  new Date().toISOString(),
      };
    }),

  /**
   * Auto-Match NIL Deals — admin only, no credit cost
   */
  autoMatchNIL: adminProcedure
    .input(z.object({
      athleteName:  z.string(),
      sport:        z.string(),
      school:       z.string().optional(),
      followers:    z.number().optional(),
      nilValue:     z.number().optional(),
      brandName:    z.string().optional(),
      brandBudget:  z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `You are the AthlynX NIL Matchmaker. Analyze this athlete and suggest the top 5 brand matches:

Athlete: ${input.athleteName}
Sport: ${input.sport}
School: ${input.school ?? 'Unknown'}
Social Followers: ${input.followers ?? 'Unknown'}
Estimated NIL Value: $${input.nilValue ?? 'Unknown'}

Suggest 5 brand categories that would be perfect matches. For each:
1. Brand category (e.g., Sports Nutrition, Athletic Wear)
2. Why it's a match
3. Estimated deal value range
4. Outreach strategy

Be specific and actionable. This is real money for a real athlete.`;

      const response = await gemini.chat.completions.create({
        model: GEMINI_MODELS.flash,
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
      });

      return {
        matches:     response.choices[0]?.message?.content ?? "",
        athlete:     input.athleteName,
        generatedAt: new Date().toISOString(),
      };
    }),

  /**
   * Employee Task Assignment — admin only, no credit cost
   */
  assignEmployeeTask: adminProcedure
    .input(z.object({
      eventType:   z.enum(["new_signup", "nil_deal", "transfer_portal", "payment", "support", "bug", "feature"]),
      details:     z.string(),
      priority:    z.enum(["low", "medium", "high", "critical"]).default("medium"),
      assignee:    z.enum(["chad", "lee", "glenn", "tony", "auto"]).default("auto"),
    }))
    .mutation(async ({ input }) => {
      const assigneeMap = {
        chad:  "contact@athlynx.ai",
        lee:   "lmarshall@athlynx.ai",
        glenn: "gtse@athlynx.ai",
        tony:  "tlockey24@athlynx.ai",
        auto:  "contact@athlynx.ai",
      };

      const prompt = `Create a concise Jira issue for this AthlynX platform event:

Event Type: ${input.eventType}
Details: ${input.details}
Priority: ${input.priority}

Provide:
1. Issue Title (max 80 chars)
2. Issue Description (2-3 sentences)
3. Acceptance Criteria (3 bullet points)
4. Recommended assignee from: Chad (CEO), Lee (Sales & Partnerships), Glenn (CFO/COO), Tony (First Athlete Partner)`;

      const response = await gemini.chat.completions.create({
        model: GEMINI_MODELS.flash,
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 400,
      });

      return {
        jiraIssue:   response.choices[0]?.message?.content ?? "",
        assignee:    assigneeMap[input.assignee],
        eventType:   input.eventType,
        priority:    input.priority,
        createdAt:   new Date().toISOString(),
      };
    }),

  /**
   * Full Funnel Analysis — admin only, no credit cost
   */
  analyzeFunnel: adminProcedure
    .input(z.object({
      signups:     z.number(),
      activeUsers: z.number(),
      paidUsers:   z.number(),
      nilDeals:    z.number(),
      revenue:     z.number(),
      period:      z.string().default("last 30 days"),
    }))
    .mutation(async ({ input }) => {
      const conversionRate = input.signups > 0 ? ((input.paidUsers / input.signups) * 100).toFixed(1) : "0";
      const arpu = input.paidUsers > 0 ? (input.revenue / input.paidUsers).toFixed(2) : "0";

      const prompt = `Analyze this AthlynX platform funnel and provide actionable recommendations:

Period: ${input.period}
Signups: ${input.signups}
Active Users: ${input.activeUsers}
Paid Users: ${input.paidUsers}
Conversion Rate: ${conversionRate}%
NIL Deals Closed: ${input.nilDeals}
Revenue: $${input.revenue.toLocaleString()}
ARPU: $${arpu}

Provide:
1. Funnel health score (1-10)
2. Biggest drop-off point
3. Top 3 actions to improve conversion
4. Revenue projection if conversion improves 20%
5. One bold move Chad should make this week`;

      const response = await gemini.chat.completions.create({
        model: GEMINI_MODELS.pro,
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 600,
      });

      return {
        analysis:    response.choices[0]?.message?.content ?? "",
        metrics:     { signups: input.signups, paidUsers: input.paidUsers, conversionRate, arpu, revenue: input.revenue },
        generatedAt: new Date().toISOString(),
      };
    }),

  /**
   * Gemini Vision — analyze images — costs 8 credits
   */
  analyzeImage: protectedProcedure
    .input(z.object({
      imageUrl:  z.string().url(),
      task:      z.enum(["profile_verify", "document_analyze", "highlight_analyze", "brand_logo", "general"]),
      context:   z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCommandCredits(ctx.user!.id, "analyzeImage");

      const taskPrompts = {
        profile_verify:    "Verify this is a real athlete profile photo. Check: Is it a real person? Professional quality? Appropriate for a sports platform?",
        document_analyze:  "Analyze this document. Extract key terms, dates, dollar amounts, and parties involved. Flag any concerning clauses.",
        highlight_analyze: "Analyze this sports highlight. Identify the sport, key plays, athlete performance indicators, and recruiting potential.",
        brand_logo:        "Analyze this brand logo. Describe the brand, industry, target demographic, and NIL partnership potential for athletes.",
        general:           input.context ?? "Describe what you see in this image and how it relates to AthlynXAI.",
      };

      const response = await gemini.chat.completions.create({
        model: GEMINI_MODELS.vision,
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: [
            { type: "text", text: taskPrompts[input.task] },
            { type: "image_url", image_url: { url: input.imageUrl } },
          ] as any },
        ],
        max_tokens: 500,
      });

      return {
        analysis:    response.choices[0]?.message?.content ?? "",
        task:        input.task,
        imageUrl:    input.imageUrl,
        analyzedAt:  new Date().toISOString(),
      };
    }),
});
