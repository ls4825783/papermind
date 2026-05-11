import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_PDF_MB = parseInt(process.env.MAX_PDF_MB || "20", 10);

const SYSTEM_PROMPT = `You are a senior Solana ecosystem crypto research analyst and risk specialist. Analyze the provided document and return ONLY this XML — no extra text, no preamble, no markdown:

<title>Max 8 word title</title>
<summary>3-4 sentence plain-English summary for retail crypto investors.</summary>
<highlights>
- Highlight 1
- Highlight 2
- Highlight 3
- Highlight 4
- Highlight 5
</highlights>
<bullish>
- Bullish point 1
- Bullish point 2
- Bullish point 3
- Bullish point 4
</bullish>
<bearish>
- Bearish/risk point 1
- Bearish/risk point 2
- Bearish/risk point 3
- Bearish/risk point 4
</bearish>
<tokenomics_analysis>2-3 sentence token model analysis covering sustainability and utility.</tokenomics_analysis>
<token_supply>Total supply or "Not specified"</token_supply>
<token_utility>Main utility in 5 words max</token_utility>
<vesting>Vesting schedule summary or "Not specified"</vesting>
<chain>Blockchain/chain or "Not specified"</chain>
<hype_score>1-100 integer only</hype_score>
<bull_score>1-100 integer only</bull_score>
<risk_score>1-100 integer only</risk_score>
<scam_flags>
- Flag 1 or "No major red flags detected"
- Flag 2
</scam_flags>
<scam_level>LOW or MEDIUM or HIGH</scam_level>`;

function parseSection(text, tag) {
  const m = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? m[1].trim() : "";
}

function parseBullets(text, tag) {
  return parseSection(text, tag)
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

function parseNum(text, tag) {
  return parseInt(parseSection(text, tag), 10) || 0;
}

export async function POST(request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { pdfBase64, fileName } = body;

    if (!pdfBase64) {
      return NextResponse.json({ error: "No PDF provided." }, { status: 400 });
    }

    // Rough size check (base64 is ~133% of binary size)
    const estimatedMB = (pdfBase64.length * 0.75) / (1024 * 1024);
    if (estimatedMB > MAX_PDF_MB) {
      return NextResponse.json(
        { error: `PDF exceeds the ${MAX_PDF_MB}MB limit.` },
        { status: 413 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfBase64,
              },
            },
            { type: "text", text: "Analyze this document and return the XML." },
          ],
        },
      ],
    });

    const raw = message.content.map((b) => b.text || "").join("\n");

    const result = {
      title: parseSection(raw, "title") || (fileName || "").replace(".pdf", ""),
      summary: parseSection(raw, "summary"),
      highlights: parseBullets(raw, "highlights"),
      bullish: parseBullets(raw, "bullish"),
      bearish: parseBullets(raw, "bearish"),
      tokenomics: parseSection(raw, "tokenomics_analysis"),
      tokenSupply: parseSection(raw, "token_supply"),
      tokenUtility: parseSection(raw, "token_utility"),
      vesting: parseSection(raw, "vesting"),
      chain: parseSection(raw, "chain"),
      hypeScore: parseNum(raw, "hype_score"),
      bullScore: parseNum(raw, "bull_score"),
      riskScore: parseNum(raw, "risk_score"),
      scamFlags: parseBullets(raw, "scam_flags"),
      scamLevel: parseSection(raw, "scam_level").toUpperCase() || "MEDIUM",
    };

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json(
      { error: err.message || "Analysis failed." },
      { status: 500 }
    );
  }
}
