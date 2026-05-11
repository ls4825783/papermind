import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a Solana ecosystem VC analyst. Write a 5-7 sentence investment thesis covering: core value proposition, market opportunity, on-chain utility model, key risks, and your overall conviction level (Bullish / Neutral / Bearish). Be direct, institutional, no filler words.`;

export async function POST(request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API key not configured." }, { status: 500 });
    }

    const { pdfBase64, title, summary } = await request.json();

    if (!pdfBase64) {
      return NextResponse.json({ error: "No PDF provided." }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
            },
            {
              type: "text",
              text: `Document title: ${title}. Summary: ${summary}. Write the investment thesis now.`,
            },
          ],
        },
      ],
    });

    const thesis = message.content.map((b) => b.text || "").join("\n").trim();
    return NextResponse.json({ thesis });
  } catch (err) {
    console.error("[/api/thesis]", err);
    return NextResponse.json({ error: err.message || "Failed to generate thesis." }, { status: 500 });
  }
}
