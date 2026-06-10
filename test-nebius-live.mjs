/**
 * ATHLYNX — Nebius H200 Live Test
 * Tests the $5,000 OG credits on Nebius AI H200 cluster
 * Run: node test-nebius-live.mjs
 */
import OpenAI from "openai";

const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY || "";
const NEBIUS_BASE_URL = "https://api.studio.nebius.ai/v1/";

if (!NEBIUS_API_KEY) {
  console.error("❌ NEBIUS_API_KEY not set in environment");
  process.exit(1);
}

const client = new OpenAI({
  baseURL: NEBIUS_BASE_URL,
  apiKey: NEBIUS_API_KEY,
});

async function testNebius() {
  console.log("🔥 ATHLYNX — Testing Nebius H200 Cluster...");
  console.log(`📡 Endpoint: ${NEBIUS_BASE_URL}`);
  console.log(`🔑 Key: ${NEBIUS_API_KEY.slice(0, 12)}...`);
  console.log("");

  const models = [
    "meta-llama/Llama-3.3-70B-Instruct",
    "meta-llama/Meta-Llama-3.1-8B-Instruct",
  ];

  for (const model of models) {
    const start = Date.now();
    try {
      console.log(`Testing model: ${model}`);
      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: "You are the ATHLYNX AI. Respond with exactly: ATHLYNX H200 ONLINE — $5K OG CREDITS ACTIVE — IRON SHARPENS IRON"
          }
        ],
        max_tokens: 64,
        temperature: 0,
      });
      const latency = Date.now() - start;
      const reply = response.choices[0]?.message?.content ?? "(no response)";
      console.log(`✅ LIVE — ${latency}ms`);
      console.log(`   Response: ${reply}`);
      console.log(`   Model: ${response.model}`);
      console.log(`   Tokens: ${response.usage?.total_tokens ?? "N/A"}`);
      console.log("");
    } catch (err) {
      const latency = Date.now() - start;
      console.error(`❌ FAILED (${latency}ms) — ${err.message}`);
      console.log("");
    }
  }
}

testNebius().catch(console.error);
