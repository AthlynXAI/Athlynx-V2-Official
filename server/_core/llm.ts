
export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4" ;
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice =
  | ToolChoicePrimitive
  | ToolChoiceByName
  | ToolChoiceExplicit;

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

// ─── Engine type ────────────────────────────────────────────────────────────
type Engine = "gemini" | "claude" | "nebius" | "openai";

const ensureArray = (
  value: MessageContent | MessageContent[]
): MessageContent[] => (Array.isArray(value) ? value : [value]);

const normalizeContentPart = (
  part: MessageContent
): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  if (part.type === "file_url") {
    return part;
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map(part => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");

    return {
      role,
      name,
      tool_call_id,
      content,
    };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);

  // If there's only text content, collapse to a single string for compatibility
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text,
    };
  }

  return {
    role,
    name,
    content: contentParts,
  };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }

  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }

    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }

    return {
      type: "function",
      function: { name: tools[0].function.name },
    };
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice;
};

const resolveApiUrl = (engine: Engine = "nebius") => {
  if (engine === "nebius") return process.env.NEBIUS_BASE_URL
    ? `${process.env.NEBIUS_BASE_URL.replace(/\/$/, "")}/chat/completions`
    : "https://api.studio.nebius.ai/v1/chat/completions";
  if (engine === "claude") return "https://api.anthropic.com/v1/messages";
  if (engine === "openai") return "https://api.openai.com/v1/chat/completions";
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY) return "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  return "https://api.openai.com/v1/chat/completions";
};
const getApiKey = (engine: Engine = "nebius"): string => {
  if (engine === "nebius") return process.env.NEBIUS_API_KEY || "";
  if (engine === "claude") return process.env.ANTHROPIC_API_KEY || "";
  if (engine === "openai") return process.env.OPENAI_API_KEY || "";
  // GEMINI_API_KEY takes priority (rotated key), fallback to GOOGLE_AI_API_KEY
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.OPENAI_API_KEY || "";
};

const assertApiKey = () => {
  if (
    !process.env.GOOGLE_AI_API_KEY &&
    !process.env.OPENAI_API_KEY &&
    !process.env.NEBIUS_API_KEY &&
    !process.env.ANTHROPIC_API_KEY
  ) {
    throw new Error(
      "No AI API key configured — set GOOGLE_AI_API_KEY, ANTHROPIC_API_KEY, NEBIUS_API_KEY, or OPENAI_API_KEY"
    );
  }
};

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}):
  | { type: "json_schema"; json_schema: JsonSchema }
  | { type: "text" }
  | { type: "json_object" }
  | undefined => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (
      explicitFormat.type === "json_schema" &&
      !explicitFormat.json_schema?.schema
    ) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  };
};

async function invokeLLMWithEngine(params: InvokeParams, engine: Engine = "nebius"): Promise<InvokeResult> {
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
  } = params;

  // ─── Claude uses Anthropic's native API format ────────────────────────────
  if (engine === "claude") {
    const claudeMessages = messages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      }));
    const systemMsg = messages.find(m => m.role === "system");
    const claudePayload: Record<string, unknown> = {
      model: "claude-opus-4",
      max_tokens: 8192,
      messages: claudeMessages,
    };
    if (systemMsg) {
      claudePayload.system = typeof systemMsg.content === "string"
        ? systemMsg.content
        : JSON.stringify(systemMsg.content);
    }
    const claudeResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": getApiKey("claude"),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(claudePayload),
    });
    if (!claudeResp.ok) {
      const errText = await claudeResp.text();
      throw new Error(`Claude invoke failed: ${claudeResp.status} ${claudeResp.statusText} – ${errText}`);
    }
    const claudeData = await claudeResp.json() as any;
    // Normalize to OpenAI-compatible InvokeResult
    return {
      id: claudeData.id || "claude-" + Date.now(),
      created: Math.floor(Date.now() / 1000),
      model: claudeData.model || "claude-opus-4",
      choices: [{
        index: 0,
        message: { role: "assistant", content: claudeData.content?.[0]?.text || "" },
        finish_reason: claudeData.stop_reason || "stop",
      }],
      usage: {
        prompt_tokens: claudeData.usage?.input_tokens || 0,
        completion_tokens: claudeData.usage?.output_tokens || 0,
        total_tokens: (claudeData.usage?.input_tokens || 0) + (claudeData.usage?.output_tokens || 0),
      },
    } as InvokeResult;
  }

  // ─── Gemini & Nebius use OpenAI-compatible format ─────────────────────────
  const useNebius = engine === "nebius";
  const model = useNebius
    ? (process.env.NEBIUS_MODEL_PRIMARY || "meta-llama/Llama-3.3-70B-Instruct")
    : "gemini-2.5-flash";

  const payload: Record<string, unknown> = {
    model,
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }

  payload.max_tokens = useNebius ? 4096 : 32768;
  // Note: thinking/budget_tokens only supported by Gemini, not Nebius
  if (!useNebius) {
    payload.thinking = { budget_tokens: 128 };
  }

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }

  const response = await fetch(resolveApiUrl(engine), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${getApiKey(engine)}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  return (await response.json()) as InvokeResult;
}

/**
 * AthlynXAI — Four-Engine Cascade (Build 1 — Nebius primary)
 * Layer 1: Nebius Llama-3.3-70B     — primary (NVIDIA H200, always-on workhorse)
 * Layer 2: Google Gemini 2.5 Flash  — secondary (fast multimodal fallback)
 * Layer 3: Anthropic Claude         — tertiary (deep reasoning, contract analysis)
 * Layer 4: OpenAI                   — last resort
 * Engine name comes back through getActiveEngine() for the system health route.
 */
export function getActiveEngine(): Engine {
  if (process.env.NEBIUS_API_KEY) return "nebius";
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY) return "gemini";
  if (process.env.ANTHROPIC_API_KEY) return "claude";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "nebius";
}

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  assertApiKey();

  const isTransient = (err: unknown) => {
    const msg = String(err);
    return (
      msg.includes("429") ||
      msg.includes("quota") ||
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("500") ||
      msg.includes("502") ||
      msg.includes("503") ||
      msg.includes("timeout") ||
      msg.includes("ECONNRESET")
    );
  };

  // Layer 1 — Nebius (primary)
  if (process.env.NEBIUS_API_KEY) {
    try {
      return await invokeLLMWithEngine(params, "nebius");
    } catch (nebiusError: unknown) {
      if (!isTransient(nebiusError)) throw nebiusError;
      console.log("[LLM] Nebius Llama-3.3-70B error — falling back to Google Gemini 2.5 Flash");
    }
  }

  // Layer 2 — Gemini (secondary)
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY) {
    try {
      return await invokeLLMWithEngine(params, "gemini");
    } catch (geminiError: unknown) {
      if (!isTransient(geminiError)) throw geminiError;
      console.log("[LLM] Gemini error — falling back to Anthropic Claude");
    }
  }

  // Layer 3 — Claude (deep reasoning fallback)
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await invokeLLMWithEngine(params, "claude");
    } catch (claudeError: unknown) {
      if (!isTransient(claudeError)) throw claudeError;
      console.warn("[LLM] Claude error — falling back to OpenAI", claudeError);
    }
  }

  // Layer 4 — OpenAI (last resort)
  if (process.env.OPENAI_API_KEY) {
    return await invokeLLMWithEngine(params, "openai");
  }

  // No fallbacks succeeded — try Nebius once more with no guard so the caller sees the real error
  return await invokeLLMWithEngine(params, "nebius");
}

/**
 * Invoke Claude directly for deep reasoning tasks:
 * contract analysis, legal review, NIL deal evaluation, academic planning.
 * Falls back to Gemini if no Anthropic key is set.
 */
export async function invokeClaudeDirectly(params: InvokeParams): Promise<InvokeResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("[LLM] No ANTHROPIC_API_KEY — routing Claude request through cascade (Nebius primary)");
    return invokeLLM(params);
  }
  return invokeLLMWithEngine(params, "claude");
}
