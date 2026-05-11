/**
 * Generates a 1200×630 Solana-branded Twitter/X share card using Canvas API.
 * Client-side only — call from a browser context.
 *
 * @param {object} result  - Analysis result object
 * @param {string|null} walletAddr - Connected wallet address
 * @returns {string} data URL (PNG)
 */
export function generateShareCard(result, walletAddr = null) {
  const W = 1200, H = 630;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const c = cv.getContext("2d");

  // Background
  c.fillStyle = "#080B12"; c.fillRect(0, 0, W, H);

  // Grid lines
  c.strokeStyle = "rgba(153,69,255,0.055)"; c.lineWidth = 1;
  for (let x = 0; x < W; x += 48) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
  for (let y = 0; y < H; y += 48) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }

  // Ambient glows
  let g = c.createRadialGradient(160, 160, 0, 160, 160, 360);
  g.addColorStop(0, "rgba(153,69,255,0.2)"); g.addColorStop(1, "transparent");
  c.fillStyle = g; c.fillRect(0, 0, W, H);

  g = c.createRadialGradient(1100, 520, 0, 1100, 520, 300);
  g.addColorStop(0, "rgba(20,241,149,0.16)"); g.addColorStop(1, "transparent");
  c.fillStyle = g; c.fillRect(0, 0, W, H);

  // Top gradient border
  const tg = c.createLinearGradient(0, 0, W, 0);
  tg.addColorStop(0, "transparent");
  tg.addColorStop(0.35, "rgba(153,69,255,0.8)");
  tg.addColorStop(0.65, "rgba(20,241,149,0.8)");
  tg.addColorStop(1, "transparent");
  c.strokeStyle = tg; c.lineWidth = 2;
  c.beginPath(); c.moveTo(0, 0); c.lineTo(W, 0); c.stroke();

  // Logo
  c.font = "bold 28px Arial";
  c.fillStyle = "#9945FF"; c.fillText("Paper", 60, 65);
  const pw = c.measureText("Paper").width;
  c.fillStyle = "#14F195"; c.fillText("Mind", 60 + pw, 65);
  c.font = "11px monospace"; c.fillStyle = "rgba(153,69,255,0.58)";
  c.fillText("V3 · SOLANA AI RESEARCH INTELLIGENCE", 60, 84);

  // Divider
  c.strokeStyle = "rgba(153,69,255,0.18)"; c.lineWidth = 1;
  c.beginPath(); c.moveTo(60, 100); c.lineTo(W - 60, 100); c.stroke();

  // Wallet address (top right)
  if (walletAddr) {
    c.font = "11px monospace"; c.fillStyle = "rgba(153,69,255,0.52)";
    const wa = `◎ ${walletAddr.slice(0, 6)}…${walletAddr.slice(-4)}`;
    c.fillText(wa, W - 60 - c.measureText(wa).width, 65);
  }

  // Risk badge (top right under wallet)
  const rClr = result.scamLevel === "LOW" ? "#14F195" : result.scamLevel === "HIGH" ? "#FCA5A5" : "#FBBF24";
  c.font = "11px monospace";
  const rTx = `RISK: ${result.scamLevel}`;
  const rW = c.measureText(rTx).width + 22;
  const rX = W - 60 - rW;
  c.fillStyle = result.scamLevel === "LOW" ? "rgba(20,241,149,0.1)" : result.scamLevel === "HIGH" ? "rgba(252,165,165,0.1)" : "rgba(251,191,36,0.09)";
  c.beginPath();
  if (c.roundRect) c.roundRect(rX, 50, rW, 24, 7); else c.rect(rX, 50, rW, 24);
  c.fill();
  c.strokeStyle = rClr + "44"; c.lineWidth = 1; c.stroke();
  c.fillStyle = rClr; c.fillText(rTx, rX + 11, 66);

  // Document title
  c.fillStyle = "#E8EAF0"; c.font = "bold 38px Arial";
  const ttl = result.title.length > 56 ? result.title.slice(0, 56) + "…" : result.title;
  c.fillText(ttl, 60, 156);

  // Summary (word-wrapped)
  c.fillStyle = "rgba(232,234,240,0.48)"; c.font = "16px Arial";
  const words = result.summary.split(" ");
  let line = "", ly = 192;
  for (const w of words) {
    const test = line + w + " ";
    if (c.measureText(test).width > 960 && line) {
      c.fillText(line.trim(), 60, ly); line = w + " "; ly += 24;
      if (ly > 240) break;
    } else line = test;
  }
  if (line && ly <= 240) c.fillText(line.trim(), 60, ly);

  // Score cards
  [
    { label: "HYPE", val: result.hypeScore, color: "#9945FF", bg: "rgba(153,69,255,0.1)" },
    { label: "BULL", val: result.bullScore, color: "#14F195", bg: "rgba(20,241,149,0.1)" },
    { label: "RISK", val: result.riskScore, color: "#FCA5A5", bg: "rgba(252,165,165,0.1)" },
  ].forEach((card, i) => {
    const cx = 60 + i * 238, cy = 272, cw = 218, ch = 130;
    c.fillStyle = card.bg;
    c.beginPath();
    if (c.roundRect) c.roundRect(cx, cy, cw, ch, 14); else c.rect(cx, cy, cw, ch);
    c.fill();
    c.strokeStyle = card.color + "44"; c.lineWidth = 1; c.stroke();
    c.font = "10px monospace"; c.fillStyle = card.color + "bb";
    c.fillText(`${card.label} SCORE`, cx + 16, cy + 24);
    c.font = "bold 50px Arial"; c.fillStyle = card.color;
    c.fillText(card.val, cx + 16, cy + 82);
    c.font = "18px Arial"; c.fillStyle = card.color + "77";
    c.fillText("/100", cx + 16 + c.measureText(String(card.val)).width, cy + 82);
    // Meter bar
    c.fillStyle = "rgba(232,234,240,0.06)";
    c.beginPath();
    if (c.roundRect) c.roundRect(cx + 16, cy + 100, cw - 32, 5, 3); else c.rect(cx + 16, cy + 100, cw - 32, 5);
    c.fill();
    c.fillStyle = card.color;
    c.beginPath();
    if (c.roundRect) c.roundRect(cx + 16, cy + 100, (cw - 32) * (card.val / 100), 5, 3); else c.rect(cx + 16, cy + 100, (cw - 32) * (card.val / 100), 5);
    c.fill();
  });

  // Key highlights (right column)
  c.font = "bold 12px monospace"; c.fillStyle = "rgba(20,241,149,0.65)";
  c.fillText("KEY HIGHLIGHTS", 790, 284);
  c.strokeStyle = "rgba(20,241,149,0.18)"; c.lineWidth = 1;
  c.beginPath(); c.moveTo(790, 294); c.lineTo(W - 60, 294); c.stroke();
  result.highlights.slice(0, 4).forEach((h, i) => {
    c.font = "14px Arial"; c.fillStyle = "rgba(232,234,240,0.7)";
    c.fillText(`• ${h.length > 40 ? h.slice(0, 40) + "…" : h}`, 790, 322 + i * 36);
  });

  // Bull / Bear columns
  const by = 430;
  c.font = "bold 10px monospace";
  c.fillStyle = "rgba(20,241,149,0.55)"; c.fillText("BULLISH", 60, by);
  c.fillStyle = "rgba(252,165,165,0.55)"; c.fillText("BEARISH", W / 2 + 10, by);
  c.strokeStyle = "rgba(232,234,240,0.05)"; c.lineWidth = 1;
  c.beginPath(); c.moveTo(60, by + 9); c.lineTo(W - 60, by + 9); c.stroke();
  result.bullish.slice(0, 3).forEach((b, i) => {
    c.font = "13px Arial";
    c.fillStyle = "rgba(20,241,149,0.65)"; c.fillText("↑", 60, by + 32 + i * 30);
    c.fillStyle = "rgba(232,234,240,0.64)"; c.fillText(b.length > 34 ? b.slice(0, 34) + "…" : b, 78, by + 32 + i * 30);
  });
  result.bearish.slice(0, 3).forEach((b, i) => {
    c.font = "13px Arial";
    c.fillStyle = "rgba(252,165,165,0.65)"; c.fillText("↓", W / 2 + 10, by + 32 + i * 30);
    c.fillStyle = "rgba(232,234,240,0.58)"; c.fillText(b.length > 34 ? b.slice(0, 34) + "…" : b, W / 2 + 28, by + 32 + i * 30);
  });

  // Footer bar
  const fg = c.createLinearGradient(0, 590, W, 590);
  fg.addColorStop(0, "rgba(153,69,255,0.12)"); fg.addColorStop(1, "rgba(20,241,149,0.06)");
  c.fillStyle = fg; c.fillRect(0, 590, W, 40);
  c.strokeStyle = "rgba(153,69,255,0.22)"; c.lineWidth = 1;
  c.beginPath(); c.moveTo(0, 590); c.lineTo(W, 590); c.stroke();
  c.font = "11px monospace"; c.fillStyle = "rgba(153,69,255,0.55)";
  c.fillText("papermind.xyz  ·  AI-POWERED SOLANA RESEARCH INTELLIGENCE  ·  V3", 60, 612);
  const dt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  c.fillStyle = "rgba(20,241,149,0.45)";
  c.fillText(dt, W - 60 - c.measureText(dt).width, 612);

  return cv.toDataURL("image/png");
}
