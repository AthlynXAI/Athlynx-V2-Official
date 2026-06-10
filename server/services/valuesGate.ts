/**
 * AthlynX Values Gate
 *
 * Locked from Chad's brief, May 11, 2026:
 *   "People remember meaning, not features."
 *
 * Every AI-generated social post passes through this gate before it ships.
 * Four checks:
 *   1. Meaning, not feature?  (no specs, no comparisons, no "AI-powered" speak)
 *   2. One clear belief?       (does it ladder to one of the five values?)
 *   3. Voice check?            (man on a porch — not corporate, not hype)
 *   4. No forbidden patterns?  (no emojis, no family disclosures, no banned words)
 *
 * Returns { passes, reasons, rewrite } so the caller can either ship, rewrite, or kill.
 */

// ─── The forbidden patterns ───────────────────────────────────────────────────
const FORBIDDEN_WORDS: RegExp[] = [
  /\bfaster\b/i,
  /\bsmarter\b/i,
  /\bbetter than\b/i,
  /\bAI[\s-]?powered\b/i,
  /\bnext[\s-]?gen\b/i,
  /\brevolutionary\b/i,
  /\bdisruptive\b/i,
  /\bgame[\s-]?chang(?:er|ing)\b/i,
  /\bcutting[\s-]?edge\b/i,
  /\bstate[\s-]?of[\s-]?the[\s-]?art\b/i,
  /\bworld[\s-]?class\b/i,
  /\bbest[\s-]?in[\s-]?class\b/i,
  /\bmegahertz\b/i,
  /\btokens?\s*per\s*second\b/i,
  /\btps\b/i,
  /\bbenchmark/i,
  /\bGPT[\s-]?\d/i,
  /\bClaude\b/i,
  /\bGemini\b/i,
  /\bLLM\b/i,
];

// Family / personal disclosures Chad has explicitly placed out of bounds.
const FORBIDDEN_DISCLOSURES: RegExp[] = [
  /\bhope\s+lodge\b/i,
  /\bcancer\b/i,
  /\bchemo\b/i,
  /\bmedical\b/i,
  /\bdiagnos(?:is|ed)\b/i,
];

// Emojis: any non-ASCII pictographic. Chad's rule: never.
// Surrogate-pair range covers the full emoji / pictographic plane without
// requiring the 'u' flag (which needs ES6+ target).
const EMOJI_RE = /(?:[\u2600-\u27BF])|(?:\uD83C[\uDC00-\uDFFF])|(?:\uD83D[\uDC00-\uDFFF])|(?:\uD83E[\uDC00-\uDFFF])|(?:\uFE0F)/;

const COMPETITOR_NAMES: RegExp[] = [
  /\bHudl\b/i,
  /\bMaxPreps\b/i,
  /\bRivals\b/i,
  /\b247Sports\b/i,
  /\bOn3\b/i,
  /\bOpendorse\b/i,
];

// ─── The five values — used to score "ladders to one clear belief" ────────────
const VALUE_SIGNALS: { value: string; keywords: RegExp[] }[] = [
  {
    value: "athlete_is_hero",
    keywords: [
      /\bathlete\b/i, /\bplayer\b/i, /\bkid\b/i, /\bwalk[\s-]?on\b/i,
      /\bsenior\b/i, /\bjunior\b/i, /\brookie\b/i, /\bretired\b/i,
      /\bbackyard\b/i, /\bjourney\b/i, /\bstory\b/i, /\bhonor\b/i, /\bhonou?ring\b/i,
    ],
  },
  {
    value: "meaning_over_features",
    keywords: [
      /\bmeaning\b/i, /\bbelieve\b/i, /\bbelief\b/i, /\btruth\b/i, /\bvalues?\b/i,
      /\bwhy\b/i, /\bcalling\b/i, /\bmission\b/i,
    ],
  },
  {
    value: "gift_and_business",
    keywords: [
      /\bgift\b/i, /\bbuilt\b/i, /\brun\b/i, /\bscale\b/i, /\bhonest\b/i,
      /\bsacred\b/i, /\bdiscipline/i,
    ],
  },
  {
    value: "real_beats_polished",
    keywords: [
      /\breal\b/i, /\bporch\b/i, /\bplainspoken\b/i, /\bquiet\b/i,
      /\bone[\s-]?on[\s-]?one\b/i,
    ],
  },
  {
    value: "backyard_to_billion",
    keywords: [
      /\bbackyard\b/i, /\bbillion\b/i, /\byouth\b/i, /\bpro\b/i,
      /\bretirement\b/i, /\bjourney\b/i, /\barc\b/i, /\bfrom\s+\w+\s+to\s+\w+\b/i,
    ],
  },
];

// Spec/feature words trigger the meaning gate.
const FEATURE_SPEAK: RegExp[] = [
  /\b\d+\s*(?:gb|mb|tb|ghz|mhz|ms|fps|x)\b/i,
  /\b\d+\s*(?:million|billion)\s+(?:tokens|parameters|models|users)\b/i,
  /\bbeats?\s+(?:openai|google|meta|hudl|opendorse)\b/i,
  /\bvs\.?\s+\w+/i,
  /\bcompared?\s+to\b/i,
];

export interface ValuesGateResult {
  passes: boolean;
  reasons: string[];        // explanation for each failed check
  matched_values: string[]; // which of the five values it laddered to
  rewrite_hint?: string;    // suggestion for the agent if it failed
}

/**
 * Run the four-check values gate.
 */
export function runValuesGate(text: string): ValuesGateResult {
  const reasons: string[] = [];
  const t = text ?? "";

  // Check 1 — Meaning, not feature
  for (const re of FEATURE_SPEAK) {
    if (re.test(t)) {
      reasons.push(`feature-speak detected: ${re}`);
      break;
    }
  }
  for (const re of FORBIDDEN_WORDS) {
    if (re.test(t)) {
      reasons.push(`forbidden marketing word: ${re}`);
    }
  }
  for (const re of COMPETITOR_NAMES) {
    if (re.test(t)) {
      reasons.push(`competitor mentioned (we honor athletes, not compare to competitors): ${re}`);
    }
  }

  // Check 2 — One clear belief: must match at least one of the five values
  const matched_values: string[] = [];
  for (const v of VALUE_SIGNALS) {
    if (v.keywords.some((re) => re.test(t))) matched_values.push(v.value);
  }
  if (matched_values.length === 0) {
    reasons.push(
      "no core value detected — must ladder to athlete-is-hero, meaning-over-features, gift-and-business, real-beats-polished, or backyard-to-billion"
    );
  }

  // Check 3 — Voice check (length sanity + no all-caps shouting)
  const allCaps = /[A-Z]{14,}/.test(t);
  if (allCaps) reasons.push("all-caps shouting — AthlynX voice is quiet, not loud");

  // Check 4 — Forbidden patterns: emojis + family disclosures
  if (EMOJI_RE.test(t)) reasons.push("emoji detected — Chad's rule: never");
  for (const re of FORBIDDEN_DISCLOSURES) {
    if (re.test(t)) reasons.push(`forbidden personal disclosure: ${re}`);
  }

  const passes = reasons.length === 0;

  let rewrite_hint: string | undefined;
  if (!passes) {
    rewrite_hint =
      "Rewrite in AthlynX voice: man on a porch telling the truth. " +
      "Honor one athlete or one truth about the journey from backyard to billion. " +
      "No specs, no comparisons, no AI-powered talk, no emojis. " +
      "Match at least one of the five core values.";
  }

  return { passes, reasons, matched_values, rewrite_hint };
}

/**
 * Hard guard for callers that want a throw on failure.
 */
export function assertValuesGate(text: string): void {
  const r = runValuesGate(text);
  if (!r.passes) {
    throw new Error(
      `[ValuesGate] Post rejected: ${r.reasons.join(" | ")} — ${r.rewrite_hint ?? ""}`
    );
  }
}
