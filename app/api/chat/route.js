import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API key not configured." }, { status: 500 });
    }

    const { pdfBase64, messages, docTitle, docSummary } = await request.json();

    if (!pdfBase64 || !messages?.length) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const systemPrompt = `You are an AI research assistant that has read the following Solana crypto/DeSci document in full. Answer questions clearly, concisely, and honestly. Always flag when something is speculation vs confirmed fact. If asked about something not in the document, say so clearly.

Document: ${docTitle}
Summary: ${docSummary}`;

    // Inject the PDF into the very first user message
    const formattedMessages = messages.map((msg, idx) => ({
      role: msg.role,
      content:
        idx === 0
          ? [
              {
                type: "document",
                source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
              },
              { type: "text", text: msg.content },
            ]
          : msg.content,
    }));

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: systemPrompt,
      messages: formattedMessages,
    });

    const reply = response.content.map((b) => b.text || "").join("\n").trim();
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json({ error: err.message || "Chat failed." }, { status: 500 });
  }
}
