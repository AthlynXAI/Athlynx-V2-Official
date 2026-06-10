/**
 * Image Generation — AthlynX
 * Uses OpenAI DALL-E 3 via OPENAI_API_KEY.
 * NO forge dependencies.
 */
import { storagePut } from "server/storage";

export type GenerateImageOptions = {
  prompt: string;
  originalImages?: Array<{
    url?: string;
    b64Json?: string;
    mimeType?: string;
  }>;
};

export type GenerateImageResponse = {
  url?: string;
};

export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: options.prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image generation failed: ${response.status} ${response.statusText} – ${errorText}`);
  }

  const data = (await response.json()) as { data: Array<{ b64_json?: string; url?: string }> };
  const imageData = data.data?.[0];

  if (!imageData) {
    throw new Error("No image returned from OpenAI");
  }

  // If we got a base64 image, upload to storage and return URL
  if (imageData.b64_json) {
    const buffer = Buffer.from(imageData.b64_json, "base64");
    const key = `generated/${Date.now()}.png`;
    const storageResult = await storagePut(key, buffer, "image/png"); const url = storageResult.url;
    return { url };
  }

  return { url: imageData.url };
}
