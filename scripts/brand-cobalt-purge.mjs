#!/usr/bin/env node
/**
 * Brand-lock purge — replace every yellow/amber/gold/orange shade
 * inside client/src with the cobalt-blue equivalent. Idempotent.
 *
 * Rule: No yellow / gold / amber / orange anywhere on AthlynX.
 * Only exception: third-party brand assets (logos, company-line images).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const targets = execSync(
  `grep -rliE '(yellow-|amber-|gold-|orange-|#FBBF24|#F59E0B|#FACC15|#EAB308|#F97316|#FB923C|FFD700|DAA520|FED7AA)' client/src/`,
  { encoding: "utf8" }
).trim().split("\n").filter(Boolean);

const replacements = [
  // Tailwind classes — any shade / opacity / variant prefix
  [/\b(bg|text|from|to|via|border|ring|fill|stroke|shadow|outline|decoration|placeholder|caret|divide|accent)-yellow-(\d{2,3})(\/\d{1,3})?/g, (m, p, n, o) => `${p}-blue-${n}${o || ""}`],
  [/\b(bg|text|from|to|via|border|ring|fill|stroke|shadow|outline|decoration|placeholder|caret|divide|accent)-amber-(\d{2,3})(\/\d{1,3})?/g, (m, p, n, o) => `${p}-blue-${n}${o || ""}`],
  [/\b(bg|text|from|to|via|border|ring|fill|stroke|shadow|outline|decoration|placeholder|caret|divide|accent)-gold-(\d{2,3})(\/\d{1,3})?/g, (m, p, n, o) => `${p}-blue-${n}${o || ""}`],
  [/\b(bg|text|from|to|via|border|ring|fill|stroke|shadow|outline|decoration|placeholder|caret|divide|accent)-orange-(\d{2,3})(\/\d{1,3})?/g, (m, p, n, o) => `${p}-blue-${n}${o || ""}`],
  // hover/focus/group-hover variants
  [/\b(hover|focus|group-hover|active|focus-visible|peer-hover):(bg|text|from|to|border|ring|fill|stroke)-(yellow|amber|gold|orange)-(\d{2,3})(\/\d{1,3})?/g, (m, v, p, c, n, o) => `${v}:${p}-blue-${n}${o || ""}`],
  // raw class without shade
  [/\b(bg|text|border)-(yellow|amber|gold|orange)\b(?!-)/g, (m, p) => `${p}-blue-500`],
  // hex values — map to cobalt ramp
  [/#FBBF24/gi, "#3B82F6"],   // amber-400 → blue-500
  [/#F59E0B/gi, "#1E90FF"],   // amber-500 → cobalt
  [/#FACC15/gi, "#3B82F6"],   // yellow-400
  [/#EAB308/gi, "#2563EB"],   // yellow-500 → blue-600
  [/#CA8A04/gi, "#1D4ED8"],   // yellow-600 → blue-700
  [/#F97316/gi, "#1E90FF"],   // orange-500
  [/#FB923C/gi, "#3B82F6"],   // orange-400
  [/#FED7AA/gi, "#BFDBFE"],   // orange-200 → blue-200
  [/#FFD700/gi, "#1E90FF"],   // pure gold
  [/#DAA520/gi, "#1E40AF"],   // goldenrod
  [/#D97706/gi, "#1D4ED8"],   // amber-600 → blue-700
  // string-literal accent colors
  [/'yellow-500'/g, "'blue-500'"],
  [/"yellow-500"/g, '"blue-500"'],
  [/'amber-500'/g, "'blue-500'"],
  [/'orange-500'/g, "'blue-500'"],
  [/'gold-500'/g, "'blue-500'"],
];

let total = 0;
for (const f of targets) {
  let src = readFileSync(f, "utf8");
  const before = src;
  for (const [re, sub] of replacements) src = src.replace(re, sub);
  if (src !== before) {
    writeFileSync(f, src);
    const diff = (before.match(/(yellow|amber|gold|orange|#F59E0B|#FBBF24|#FACC15|#F97316|#FFD700|#DAA520)/gi) || []).length;
    total += diff;
    console.log(`  ${f}  (${diff} replacements)`);
  }
}
console.log(`\nTotal: ${total} brand-lock violations purged across ${targets.length} files.`);
