/**
 * BuildLogParser — extracts known failure signatures from EAS / Gradle / shell logs.
 *
 * Targets:
 *  - Gradle .execute() deprecation (the recurring AthlynXAI APK crash)
 *  - "A problem occurred evaluating project ':app'"
 *  - General Gradle build errors
 *  - Failed shell commands (npm/pnpm/expo/eas exit codes)
 *  - EAS phase failures (Install dependencies, Prebuild, Run gradlew)
 *  - Error code 10091 spikes (Google Play upload throttling / signing rejections)
 */

export type FailureSignal = {
  category:
    | "gradle_execute_deprecated"
    | "gradle_eval_app"
    | "gradle_generic"
    | "providers_exec_misuse"
    | "shell_command_failed"
    | "eas_phase_failed"
    | "error_10091"
    | "unknown";
  severity: "critical" | "high" | "medium" | "low";
  line: number;
  excerpt: string;
  hint?: string;
};

export type ParsedBuildLog = {
  totalLines: number;
  signals: FailureSignal[];
  counts: Record<string, number>;
  has10091: boolean;
  count10091: number;
  hasGradleExecuteError: boolean;
  hasEvalAppError: boolean;
  summary: string;
};

const PATTERNS: Array<{
  re: RegExp;
  category: FailureSignal["category"];
  severity: FailureSignal["severity"];
  hint?: string;
}> = [
  {
    re: /\.execute\(\s*\)/,
    category: "gradle_execute_deprecated",
    severity: "critical",
    hint: "Gradle 8.11+ removed Process .execute(). Patch via withGradleFix.js to providers.exec{}.",
  },
  {
    re: /A problem occurred evaluating project ['":]+app['":]+/i,
    category: "gradle_eval_app",
    severity: "critical",
    hint: "Top-level Gradle eval failure for :app — usually a side-effect of .execute() patch missing.",
  },
  {
    re: /providers\.exec\s*\{[^}]*\}\s*\.standardOutput/,
    category: "providers_exec_misuse",
    severity: "high",
    hint: "providers.exec block is missing .asText.get() / .getOrElse() — capture stdout correctly.",
  },
  {
    re: /FAILURE: Build failed with an exception/i,
    category: "gradle_generic",
    severity: "critical",
  },
  {
    re: /BUILD FAILED in /i,
    category: "gradle_generic",
    severity: "high",
  },
  {
    re: /Execution failed for task ['":]/i,
    category: "gradle_generic",
    severity: "high",
  },
  {
    re: /command failed with exit code (\d+)/i,
    category: "shell_command_failed",
    severity: "high",
  },
  {
    re: /Error: (Install dependencies|Prebuild|Run gradlew|Run fastlane) failed/i,
    category: "eas_phase_failed",
    severity: "critical",
  },
  {
    re: /\b10091\b/,
    category: "error_10091",
    severity: "high",
    hint: "Google Play upload error 10091 — APK signing or version code conflict.",
  },
];

export function parseBuildLog(log: string): ParsedBuildLog {
  const lines = log.split(/\r?\n/);
  const signals: FailureSignal[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    for (const p of PATTERNS) {
      if (p.re.test(line)) {
        signals.push({
          category: p.category,
          severity: p.severity,
          line: i + 1,
          excerpt: line.trim().slice(0, 400),
          hint: p.hint,
        });
      }
    }
  }

  const counts: Record<string, number> = {};
  for (const s of signals) counts[s.category] = (counts[s.category] ?? 0) + 1;

  const count10091 = counts["error_10091"] ?? 0;
  const hasGradleExecuteError = (counts["gradle_execute_deprecated"] ?? 0) > 0;
  const hasEvalAppError = (counts["gradle_eval_app"] ?? 0) > 0;

  let summary = "No critical failure signatures detected.";
  if (hasGradleExecuteError) {
    summary = `Gradle .execute() deprecation present (${counts["gradle_execute_deprecated"]} occurrences). The withGradleFix.js plugin did not patch all callsites.`;
  } else if (hasEvalAppError) {
    summary = "Gradle :app evaluation failed. Check the Run gradlew phase log for the underlying cause.";
  } else if ((counts["eas_phase_failed"] ?? 0) > 0) {
    summary = "EAS phase failure detected — see eas_phase_failed signals.";
  } else if (count10091 > 0) {
    summary = `Google Play error 10091 detected (${count10091} occurrences).`;
  } else if ((counts["gradle_generic"] ?? 0) > 0) {
    summary = "Gradle build failed (generic). Inspect signals for the failing task.";
  }

  return {
    totalLines: lines.length,
    signals,
    counts,
    has10091: count10091 > 0,
    count10091,
    hasGradleExecuteError,
    hasEvalAppError,
    summary,
  };
}

/**
 * 10091 spike detection over a sliding window of recent build records.
 * "Spike" = at least `threshold` builds within `windowMinutes` with non-zero 10091 counts.
 */
export type Build10091Sample = {
  buildId: string;
  finishedAt: string; // ISO
  count10091: number;
};

export function detect10091Spike(
  samples: Build10091Sample[],
  opts: { windowMinutes?: number; threshold?: number } = {},
): { spike: boolean; window: number; threshold: number; matches: Build10091Sample[] } {
  const windowMinutes = opts.windowMinutes ?? 60;
  const threshold = opts.threshold ?? 3;
  const cutoff = Date.now() - windowMinutes * 60_000;
  const matches = samples.filter(
    (s) => s.count10091 > 0 && new Date(s.finishedAt).getTime() >= cutoff,
  );
  return {
    spike: matches.length >= threshold,
    window: windowMinutes,
    threshold,
    matches,
  };
}
