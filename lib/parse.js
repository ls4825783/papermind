/**
 * Extract a single XML section from Claude's response.
 * @param {string} text
 * @param {string} tag
 * @returns {string}
 */
export function section(text, tag) {
  const m = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? m[1].trim() : "";
}

/**
 * Extract a bullet list from an XML section.
 * @param {string} text
 * @param {string} tag
 * @returns {string[]}
 */
export function bullets(text, tag) {
  return section(text, tag)
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

/**
 * Extract an integer from an XML section.
 * @param {string} text
 * @param {string} tag
 * @returns {number}
 */
export function integer(text, tag) {
  return parseInt(section(text, tag), 10) || 0;
}

/**
 * Parse the full Claude analysis XML into a structured result object.
 * @param {string} raw - Raw XML string from Claude
 * @param {string} fileName
 * @param {string|null} walletAddr
 * @param {string|null} walletName
 * @returns {object}
 */
export function parseAnalysis(raw, fileName, walletAddr = null, walletName = null) {
  return {
    title: section(raw, "title") || fileName.replace(/\.pdf$/i, ""),
    summary: section(raw, "summary"),
    highlights: bullets(raw, "highlights"),
    bullish: bullets(raw, "bullish"),
    bearish: bullets(raw, "bearish"),
    tokenomics: section(raw, "tokenomics_analysis"),
    tokenSupply: section(raw, "token_supply"),
    tokenUtility: section(raw, "token_utility"),
    vesting: section(raw, "vesting"),
    chain: section(raw, "chain"),
    hypeScore: integer(raw, "hype_score"),
    bullScore: integer(raw, "bull_score"),
    riskScore: integer(raw, "risk_score"),
    scamFlags: bullets(raw, "scam_flags"),
    scamLevel: section(raw, "scam_level").toUpperCase() || "MEDIUM",
    fileName,
    scannedAt: Date.now(),
    walletAddr,
    walletName,
    ratings: [],
  };
}
