/**
 * POST /api/chat
 *
 * Body (JSON):
 *   - pdfBase64:   base64-encoded PDF
 *   - messages:    [ { role: "user"|"assistant", content: string } ]
 *   - title:       document title
 *   - summary:     document summary
 *
 * Returns: { reply: string } | { error: string }
 */

import { getAnthropicClient, MODEL } from "../../lib/anthropic";
import { CHAT_PROMPT } from "../../lib/prompts";

export const config = {
  api: { bodyParser: { sizeLimit: "25mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { pdfBase64, messages, title, summary } = req.body || {};

  if (!pdfBase64) return res.status(400).json({ error: "pdfBase64 is required." });
  if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: "messages array is required." });

  // Inject PDF into the first user message
  const apiMessages = messages.map((m, i) => ({
    role: m.role,
    content:
      i === 0
        ? [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
            { type: "text", text: m.content },
          ]
        : m.content,
  }));

  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: CHAT_PROMPT(title || "Unknown", summary || ""),
      messages: apiMessages,
    });

    const reply = response.content?.map((b) => b.text || "").join("\n").trim() || "";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("[/api/chat] error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
