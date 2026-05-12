export function parseSection(text, tag) {
  const m = text.match(new RegExp("<" + tag + ">([\\s\\S]*?)<\\/" + tag + ">", "i"));
  return m ? m[1].trim() : "";
}

export function parseBullets(text, tag) {
  return parseSection(text, tag)
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function parseNum(text, tag) {
  return parseInt(parseSection(text, tag), 10) || 0;
}

export function truncAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 4) + "…" + addr.slice(-4);
}

export function fmtDate(ts) {
  return new Date(ts).toLocaleDateString();
}

export function riskClass(level, prefix) {
  var p = prefix || "rp";
  return level === "LOW" ? p + "-lo" : level === "HIGH" ? p + "-hi" : p + "-me";
}

export function riskMb(level) {
  return level === "LOW" ? "mb-lo" : level === "HIGH" ? "mb-hi" : "mb-me";
}

export function avgRating(ratings) {
  if (!ratings || !ratings.length) return null;
  return (ratings.reduce(function(a, b) { return a + b; }, 0) / ratings.length).toFixed(1);
}
