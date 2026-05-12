/**
 * Client-side Gemini calls — bypasses Vercel payload limits entirely.
 * The API key is passed at call time from an env var exposed to the browser.
 */

const MODEL = "gemini-2.5-flash";
const BASE   = "https://generativelanguage.googleapis.com/v1beta/models";

async function geminiRequest(apiKey, contents, systemInstruction = null) {
  const body = { contents };
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const resp = await fetch(`${BASE}/${MODEL}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error?.message || "Gemini API error");
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function analyzeDocument(apiKey, pdfBase64) {
  const system = `You are a senior Solana ecosystem crypto research analyst and risk specialist. Analyze the provided document and return ONLY this XML — no extra text, no preamble, no markdown fences:

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
</scam_flags>
<scam_level>LOW or MEDIUM or HIGH</scam_level>`;

  const contents = [{
    role: "user",
    parts: [
      { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
      { text: "Analyze this document and return the XML." },
    ],
  }];

  return geminiRequest(apiKey, contents, system);
}

export async function generateThesis(apiKey, pdfBase64, title, summary) {
  const system = `You are a Solana ecosystem VC analyst. Write a 5-7 sentence investment thesis covering: core value proposition, market opportunity, on-chain utility model, key risks, and your overall conviction level (Bullish / Neutral / Bearish). Be direct, institutional, no filler words.`;

  const contents = [{
    role: "user",
    parts: [
      { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
      { text: `Document title: ${title}. Summary: ${summary}. Write the investment thesis now.` },
    ],
  }];

  return geminiRequest(apiKey, contents, system);
}

export async function chatWithDoc(apiKey, pdfBase64, messages, docTitle, docSummary) {
  const system = `You are an AI research assistant that has read the following Solana crypto/DeSci document in full. Answer questions clearly and honestly. Flag speculation vs confirmed fact. Doc: ${docTitle}. Summary: ${docSummary}`;

  // First message includes the PDF, rest are plain text
  const contents = messages.map((m, i) => ({
    role: m.role === "user" ? "user" : "model",
    parts: i === 0
      ? [
          { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
          { text: m.content },
        ]
      : [{ text: m.content }],
  }));

  return geminiRequest(apiKey, contents, system);
}
