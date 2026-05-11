import Anthropic from "@anthropic-ai/sdk";

// Singleton — reused across requests in the same server process
let client;

export function getAnthropicClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to your .env.local file."
      );
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const MODEL = "claude-sonnet-4-20250514";
export const MAX_TOKENS = 1024;
