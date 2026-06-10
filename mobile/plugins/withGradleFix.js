/**
 * Expo Config Plugin — Gradle 8.13 compatibility fix.
 *
 * The generated app/build.gradle uses `.execute(null, rootDir)` to run node
 * commands during Gradle configuration. Two problems were found:
 *
 * Problem 1 — null env arg (fixed in PR #127):
 *   On Gradle 8.13, passing `null` as the environment argument causes:
 *     Cannot invoke method getAbsolutePath() on null object
 *   Fix: replace null with [] (empty array = inherit environment).
 *
 * Problem 2 — wrong working directory (root cause of continued NPE, fixed in PR #128):
 *   Even with [], the working directory was `rootDir` which is the `android/`
 *   directory. There is NO `node_modules` in `android/` — it lives in `mobile/`.
 *   So `require.resolve('hermes-compiler/package.json')` fails, the node command
 *   returns empty string, `new File("")` has no parent, `.getParentFile()` returns
 *   null, and `.getAbsolutePath()` throws the NPE:
 *     Build file '.../android/app/build.gradle' line: 14
 *     > Cannot invoke method getAbsolutePath() on null object
 *
 *   The generated build.gradle already defines on line 4:
 *     def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()
 *   That IS the `mobile/` directory — the one with `node_modules`.
 *
 *   Fix: replace `.execute([], rootDir)` (and any remaining `.execute(null, rootDir)`)
 *   with `.execute([], new File(projectRoot))`.
 *
 * Problem 3 — hermes-compiler removed in RN 0.79 (fixed here):
 *   React Native 0.79 removed the `hermes-compiler` npm package entirely.
 *   The generated hermesCommand line tries to resolve it:
 *     hermesCommand = new File([...require.resolve('hermes-compiler/package.json')...].execute(...)...)
 *   This returns an empty string → new File("").getParentFile() → null → NPE.
 *
 *   The correct path in RN 0.79 is the pre-built hermesc inside react-native itself:
 *     node_modules/react-native/sdks/hermesc/%OS-BIN%/hermesc
 *   The @react-native/gradle-plugin's PathUtils.kt already handles %OS-BIN%
 *   substitution (linux64-bin on EAS Linux, osx-bin on macOS, win64-bin on Windows).
 *
 *   Fix: replace the entire hermesCommand line with a hardcoded path using projectRoot.
 *
 * This is a minimal, targeted fix. The .execute() deprecation warning is harmless
 * and will be resolved when React Native upgrades its template.
 */
const { withAppBuildGradle } = require('@expo/config-plugins');

function fixExecuteCalls(gradle) {
  let result = gradle;
  let count = 0;

  // Replace .execute(null, rootDir) → .execute([], new File(projectRoot))
  const nullMatches = (result.match(/\.execute\(null,\s*rootDir\)/g) || []).length;
  if (nullMatches > 0) {
    result = result.replace(/\.execute\(null,\s*rootDir\)/g, '.execute([], new File(projectRoot))');
    count += nullMatches;
  }

  // Replace .execute([], rootDir) → .execute([], new File(projectRoot))
  const emptyMatches = (result.match(/\.execute\(\[\],\s*rootDir\)/g) || []).length;
  if (emptyMatches > 0) {
    result = result.replace(/\.execute\(\[\],\s*rootDir\)/g, '.execute([], new File(projectRoot))');
    count += emptyMatches;
  }

  if (count > 0) {
    console.log(`[withGradleFix] replaced ${count} .execute(*,rootDir) → .execute([],new File(projectRoot))`);
  } else {
    console.log('[withGradleFix] no .execute(*,rootDir) calls found — no changes needed');
  }

  return result;
}

function fixHermesCommand(gradle) {
  // RN 0.79 removed the hermes-compiler npm package. The generated hermesCommand
  // line tries to require.resolve('hermes-compiler/package.json') which no longer
  // exists, causing a null-pointer exception. Replace the entire hermesCommand
  // assignment with the correct path to the pre-built hermesc inside react-native.
  //
  // The @react-native/gradle-plugin handles %OS-BIN% → linux64-bin / osx-bin / win64-bin.
  const hermesPattern = /^\s*hermesCommand\s*=\s*new File\(\[.*?hermes-compiler.*?\]\.execute\(.*?\)\.text\.trim\(\)\)\.getParentFile\(\)\.getAbsolutePath\(\)\s*\+.*$/m;
  if (hermesPattern.test(gradle)) {
    const fixed = gradle.replace(
      hermesPattern,
      '    hermesCommand = "$projectRoot/node_modules/react-native/sdks/hermesc/%OS-BIN%/hermesc"'
    );
    console.log('[withGradleFix] replaced hermesCommand (hermes-compiler removed in RN 0.79) → react-native/sdks/hermesc/%OS-BIN%/hermesc');
    return fixed;
  }
  console.log('[withGradleFix] hermesCommand line not found or already fixed — no changes needed');
  return gradle;
}

const withGradleFix = (config) => {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    contents = fixExecuteCalls(contents);
    contents = fixHermesCommand(contents);
    config.modResults.contents = contents;
    return config;
  });
};

module.exports = withGradleFix;
module.exports.fixExecuteCalls = fixExecuteCalls;
module.exports.fixHermesCommand = fixHermesCommand;
