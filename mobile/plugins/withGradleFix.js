/**
 * Expo Config Plugin — Gradle 8.13 compatibility fix.
 *
 * Replaces every deprecated Groovy `String[].execute(null, rootDir).text.trim()`
 * call in the generated `android/app/build.gradle` with the modern
 * `providers.exec { commandLine(...) }.standardOutput.asText.get().trim()`
 * pattern. Required for Expo SDK 53 + React Native 0.76.x on EAS Build,
 * which uses Gradle 8.13.
 *
 * Strategy: anchor on the literal tail `].execute(null, rootDir).text.trim()`
 * via a tolerant regex, then walk back through the string to find the matching
 * opening `[`, tracking bracket depth so nested arg lists like
 * `{ paths: [require.resolve('react-native/package.json')] }` are handled
 * correctly. This is more robust than literal-string `.split().join()` matches,
 * which break on any whitespace or wording drift in the React Native template.
 */
const { withAppBuildGradle } = require('@expo/config-plugins');

// Tail of every deprecated call. Whitespace inside `(null, rootDir)` is
// tolerated so minor template drift doesn't make the match fail.
const EXECUTE_TAIL_RE = /\]\s*\.\s*execute\s*\(\s*null\s*,\s*rootDir\s*\)\s*\.\s*text\s*\.\s*trim\s*\(\s*\)/g;

function fixExecuteCalls(gradle) {
  let out = '';
  let cursor = 0;
  let m;
  EXECUTE_TAIL_RE.lastIndex = 0;
  while ((m = EXECUTE_TAIL_RE.exec(gradle)) !== null) {
    // m.index points at the `]`. Walk back to its matching `[`, counting
    // depth so nested `[...]` inside the arg list don't confuse the scan.
    const closeIdx = gradle.indexOf(']', m.index);
    let depth = 1;
    let openIdx = -1;
    for (let i = closeIdx - 1; i >= 0; i--) {
      const ch = gradle[i];
      if (ch === ']') depth++;
      else if (ch === '[') {
        depth--;
        if (depth === 0) { openIdx = i; break; }
      }
    }
    if (openIdx < 0) continue; // unbalanced — leave alone
    const args = gradle.slice(openIdx + 1, closeIdx).trim();
    const replacement =
      `providers.exec { workingDir(rootDir); commandLine(${args}) }` +
      `.standardOutput.asText.get().trim()`;
    out += gradle.slice(cursor, openIdx) + replacement;
    cursor = m.index + m[0].length;
  }
  out += gradle.slice(cursor);
  return out;
}

const withGradleFix = (config) => {
  return withAppBuildGradle(config, (config) => {
    const before =
      (config.modResults.contents.match(/\.execute\(/g) || []).length;
    config.modResults.contents = fixExecuteCalls(config.modResults.contents);
    const after =
      (config.modResults.contents.match(/\.execute\(/g) || []).length;
    const providersExec =
      (config.modResults.contents.match(/providers\.exec\s*\{/g) || []).length;
    const fixed = before - after;
    console.log(
      `[withGradleFix] ran — before=${before} after=${after} fixed=${fixed} providers.exec=${providersExec}`
    );
    if (after > 0) {
      console.warn(
        `[withGradleFix] WARNING: ${after} .execute( call(s) NOT replaced — Gradle 8.13 will fail. Inspect android/app/build.gradle.`
      );
    }
    return config;
  });
};

module.exports = withGradleFix;
module.exports.fixExecuteCalls = fixExecuteCalls;
