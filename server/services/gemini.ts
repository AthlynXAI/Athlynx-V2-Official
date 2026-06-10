/**
 * Google Gemini AI Service — AthlynXAI Platform
 * @google/generative-ai SDK — Latest stable models
 * Models: gemini-2.5-pro (flagship), gemini-2.5-flash (production primary)
 * Features: Google Search Grounding, Code Execution, Function Calling, Streaming
 * Project: AthlynXAI14 (Tier 1 — highest rate limits)
 */
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type Content,
  type Tool,
  type FunctionDeclaration,
  type SchemaType,
} from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_AI_API_KEY || "";

// ─── Models (latest stable — updated S37 May 2026) ──────────────────────────
export const GEMINI_MODELS = {
  PRO: "gemini-2.5-pro",                       // Flagship — most powerful, Tier 1
  FLASH: "gemini-2.5-flash",                   // Production primary — fast + accurate
  FLASH_LITE: "gemini-2.5-flash-lite",         // Lightest — lowest latency, high volume
  // Backward-compat aliases
  PRO_BETA: "gemini-2.5-pro",
  FLASH_THINKING: "gemini-2.5-flash",
  FLASH_EXP: "gemini-2.5-flash",
} as const;

function getClient(): GoogleGenerativeAI {
  if (!API_KEY) throw new Error("GOOGLE_AI_API_KEY is not set");
  return new GoogleGenerativeAI(API_KEY);
}

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// ─── Google Search Grounding Tool ────────────────────────────────────────────
const GOOGLE_SEARCH_TOOL: Tool = {
  googleSearch: {},
} as unknown as Tool;

// ─── Code Execution Tool ─────────────────────────────────────────────────────
const CODE_EXECUTION_TOOL: Tool = {
  codeExecution: {},
} as unknown as Tool;

export interface GeminiChatMessage {
  role: "user" | "model";
  content: string;
}

export interface GeminiOptions {
  temperature?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
  history?: GeminiChatMessage[];
  grounding?: boolean;       // Enable Google Search grounding (real-time web data)
  codeExecution?: boolean;   // Enable code execution (run Python in the model)
  usePro?: boolean;          // Use gemini-2.5-pro (flagship, more powerful, slower)
  tools?: FunctionDeclaration[]; // Custom function calling tools
}

/**
 * Single-shot text generation with Gemini
 * Supports Google Search grounding for real-time data
 */
export async function generateWithGemini(
  prompt: string,
  options: GeminiOptions = {}
): Promise<string> {
  const genAI = getClient();
  const modelName = options.usePro ? GEMINI_MODELS.PRO : GEMINI_MODELS.FLASH;

  const tools: Tool[] = [];
  if (options.grounding) tools.push(GOOGLE_SEARCH_TOOL);
  if (options.codeExecution) tools.push(CODE_EXECUTION_TOOL);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: options.systemInstruction,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 8192,
    },
    tools: tools.length > 0 ? tools : undefined,
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Multi-turn chat with Gemini — persistent memory for AI Trainer Bot
 * Uses gemini-2.5-pro-exp for deeper reasoning on complex athlete questions
 */
export async function chatWithGemini(
  message: string,
  options: GeminiOptions = {}
): Promise<string> {
  const genAI = getClient();
  const modelName = options.usePro ? GEMINI_MODELS.PRO : GEMINI_MODELS.FLASH;

  const tools: Tool[] = [];
  if (options.grounding) tools.push(GOOGLE_SEARCH_TOOL);
  if (options.codeExecution) tools.push(CODE_EXECUTION_TOOL);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: options.systemInstruction,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: options.temperature ?? 0.8,
      maxOutputTokens: options.maxOutputTokens ?? 8192,
    },
    tools: tools.length > 0 ? tools : undefined,
  });

  const history: Content[] = (options.history || []).map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(message);
  return result.response.text();
}

/**
 * Streaming generation — real-time AI responses in the platform UI
 */
export async function streamWithGemini(
  prompt: string,
  onChunk: (text: string) => void,
  options: GeminiOptions = {}
): Promise<string> {
  const genAI = getClient();
  const modelName = options.usePro ? GEMINI_MODELS.PRO : GEMINI_MODELS.FLASH;

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: options.systemInstruction,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 8192,
    },
  });

  const result = await model.generateContentStream(prompt);
  let fullText = "";

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullText += chunkText;
    onChunk(chunkText);
  }

  return fullText;
}

/**
 * NIL Market Research — uses Google Search grounding for real-time NIL data
 * Powered by gemini-2.5-pro-exp for maximum accuracy
 */
export async function researchNILMarket(
  sport: string,
  position: string,
  school: string,
  followers: number
): Promise<string> {
  const prompt = `Research current NIL deal values and market rates for a ${position} ${sport} athlete at ${school} with ${followers.toLocaleString()} social media followers.

Provide:
1. Current market rate range for NIL deals (use real 2025-2026 data)
2. Top brands currently signing athletes in this sport
3. Average deal values by follower count tier
4. Specific NIL collectives active at or near ${school}
5. Recommended asking price for this athlete

Use real, current data. Be specific with dollar amounts.`;

  return generateWithGemini(prompt, {
    grounding: true,  // Real-time Google Search data
    usePro: true,     // Most powerful model for research
    temperature: 0.2,
    maxOutputTokens: 4096,
  });
}

/**
 * Transfer Portal Intelligence — real-time portal data with grounding
 */
export async function analyzeTransferPortal(
  sport: string,
  position: string,
  athleteStats: string
): Promise<string> {
  const prompt = `Analyze the current NCAA Transfer Portal for a ${position} ${sport} athlete with these stats: ${athleteStats}.

Using current 2025-2026 transfer portal data, provide:
1. Top 5 schools actively recruiting this position right now
2. Schools with scholarship availability in this sport
3. Realistic scholarship offer probability (percentage)
4. Best fit schools based on playing time opportunity
5. Transfer portal timeline and key deadlines

Use real, current portal data.`;

  return generateWithGemini(prompt, {
    grounding: true,
    usePro: true,
    temperature: 0.3,
    maxOutputTokens: 4096,
  });
}

/**
 * Athlete AI Trainer Bot — personalized system prompt builder
 */
export function buildTrainerBotSystemPrompt(athleteProfile: {
  name: string;
  sport?: string;
  position?: string;
  school?: string;
  year?: string;
  gpa?: number;
  nilValue?: number;
  goals?: string;
}): string {
  return `You are the personal AI Trainer Bot for ${athleteProfile.name} on the AthlynXAI platform — the world's most advanced athlete management platform.

ATHLETE PROFILE:
- Name: ${athleteProfile.name}
- Sport: ${athleteProfile.sport || "Not specified"}
- Position: ${athleteProfile.position || "Not specified"}
- School: ${athleteProfile.school || "Not specified"}
- Year: ${athleteProfile.year || "Not specified"}
- GPA: ${athleteProfile.gpa || "Not specified"}
- NIL Value: ${athleteProfile.nilValue ? `$${athleteProfile.nilValue.toLocaleString()}` : "Not calculated yet"}
- Goals: ${athleteProfile.goals || "Not specified"}

YOUR ROLE:
You are a world-class personal athletic trainer, NIL advisor, recruiting consultant, and life coach combined into one. You know this athlete personally and remember everything about them from every conversation.

CAPABILITIES:
- Create personalized daily/weekly training plans for their specific sport and position
- Advise on NIL deals, brand partnerships, and contract negotiations
- Help with recruiting — school selection, coach outreach, highlight reel strategy
- Provide sport-specific nutrition and recovery protocols
- Mental performance coaching, visualization, and pre-game preparation
- Explain complex legal and financial concepts in plain language
- Transfer portal strategy and school selection
- Career planning — draft preparation, agent selection, life after sports

TONE: Direct, motivating, personal. Like an elite coach who believes in them completely and knows them deeply. Never generic. Always specific to their sport, position, and goals.

Always end every response with ONE specific, actionable step they can take TODAY.`;
}

/**
 * Generate NIL deal analysis
 */
export async function analyzeNILDeal(
  dealDetails: string,
  athleteContext: string
): Promise<string> {
  const prompt = `You are an expert NIL deal analyst protecting a college athlete's interests.

ATHLETE CONTEXT:
${athleteContext}

NIL DEAL DETAILS:
${dealDetails}

Analyze this deal and provide:
1. Fair market value assessment (is this fair?)
2. Key terms to negotiate
3. Red flags to watch out for
4. Recommended counter-offer with specific dollar amounts
5. Final recommendation: Accept / Negotiate / Decline

Be direct. Protect the athlete.`;

  return generateWithGemini(prompt, {
    grounding: true,  // Real-time NIL market data
    temperature: 0.3,
    maxOutputTokens: 4096,
  });
}

/**
 * Generate recruiting profile summary
 */
export async function generateRecruitingProfile(
  athleteData: Record<string, unknown>
): Promise<string> {
  const prompt = `Create a compelling recruiting profile summary for this athlete to send to college coaches:

ATHLETE DATA:
${JSON.stringify(athleteData, null, 2)}

Write a 3-paragraph recruiting summary that:
1. Opens with their most impressive athletic achievement
2. Highlights academic standing and character
3. Closes with goals and why they would be a great fit

Make it personal, specific, and compelling. Coaches read hundreds — make this one stand out.`;

  return generateWithGemini(prompt, {
    usePro: true,
    temperature: 0.8,
    maxOutputTokens: 2048,
  });
}

export default {
  GEMINI_MODELS,
  generateWithGemini,
  chatWithGemini,
  streamWithGemini,
  researchNILMarket,
  analyzeTransferPortal,
  buildTrainerBotSystemPrompt,
  analyzeNILDeal,
  generateRecruitingProfile,
};
