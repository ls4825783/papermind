/**
 * POST /api/analyze
 *
 * Accepts a multipart/form-data request with:
 *   - file:       PDF file (max 20 MB)
 *   - walletAddr: (optional) Solana wallet address
 *   - walletName: (optional) wallet provider name
 *
 * Returns: { result: AnalysisObject } | { error: string }
 */

import { IncomingForm } from "formidable";
import fs from "fs";
import { getAnthropicClient, MODEL, MAX_TOKENS } from "../../lib/anthropic";
import { parseAnalysis } from "../../lib/parse";
import { ANALYSIS_PROMPT } from "../../lib/prompts";

export const config = {
  api: { bodyParser: false }, // formidable handles the stream
};

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Parse multipart form ────────────────────────────────────────────────
  let fields, files;
  try {
    ({ fields, files } = await parseForm(req));
  } catch (err) {
    return res.status(400).json({ error: "Failed to parse upload: " + err.message });
  }

  const uploadedFile = files.file?.[0];
  if (!uploadedFile) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  if (uploadedFile.mimetype !== "application/pdf") {
    return res.status(400).json({ error: "Only PDF files are supported." });
  }
  if (uploadedFile.size > MAX_FILE_SIZE) {
    return res.status(400).json({ error: "File too large. Maximum size is 20 MB." });
  }

  const walletAddr = fields.walletAddr?.[0] || null;
  const walletName = fields.walletName?.[0] || null;

  // ── Read file → base64 ─────────────────────────────────────────────────
  let base64;
  try {
    const buffer = fs.readFileSync(uploadedFile.filepath);
    base64 = buffer.toString("base64");
  } catch (err) {
    return res.status(500).json({ error: "Failed to read uploaded file." });
  } finally {
    // Clean up temp file
    try { fs.unlinkSync(uploadedFile.filepath); } catch {}
  }

  // ── Call Claude ────────────────────────────────────────────────────────
  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: ANALYSIS_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: base64 },
            },
            { type: "text", text: "Analyze this document and return the XML." },
          ],
        },
      ],
    });

    const raw = response.content?.map((b) => b.text || "").join("\n") || "";
    const result = parseAnalysis(raw, uploadedFile.originalFilename || "document.pdf", walletAddr, walletName);

    return res.status(200).json({ result });
  } catch (err) {
    console.error("[/api/analyze] Claude error:", err.message);
    return res.status(500).json({ error: "AI analysis failed: " + err.message });
  }
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
      filter: ({ mimetype }) => mimetype === "application/pdf",
    });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}
