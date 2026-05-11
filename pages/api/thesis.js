/**
 * POST /api/thesis
 *
 * Body (JSON):
 *   - pdfBase64: base64-encoded PDF
 *   - title:     document title
 *
 * Returns: { thesis: string } | { error: string }
 */

import { getAnthropicClient, MODEL } from "../../lib/anthropic";
import { THESIS_PROMPT } from "../../lib/prompts";

export const config = {
  api: { bodyParser: { sizeLimit: "25mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { pdfBase64, title } = req.body || {};
  if (!pdfBase64) return res.status(400).json({ error: "pdfBase64 is required." });

  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: THESIS_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
            { type: "text", text: `Document title: ${title || "Unknown"}. Write the investment thesis now.` },
          ],
        },
      ],
    });

    const thesis = response.content?.map((b) => b.text || "").join("\n").trim() || "";
    return res.status(200).json({ thesis });
  } catch (err) {
    console.error("[/api/thesis] error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
