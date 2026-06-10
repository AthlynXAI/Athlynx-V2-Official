/**
 * Expo Config Plugin — iOS fmt consteval fix for Xcode 26+.
 *
 * Xcode 26 ships Apple Clang 21 which tightened C++20 consteval validation.
 * The version of the {fmt} library vendored inside React Native (11.0.2) uses
 * a consteval pattern that Apple Clang 21 rejects. The fix is to compile only
 * the `fmt` CocoaPod against C++17, which skips the consteval code path and
 * falls back to runtime format string validation.
 *
 * IMPORTANT: CocoaPods does NOT allow multiple `post_install` hooks — only the
 * last one runs and it throws a hard error if more than one is defined. This
 * plugin injects the fmt C++17 lines INSIDE the existing post_install block,
 * immediately before the block's closing `end`.
 *
 * Root cause of previous failure (PR #127):
 *   The generated Podfile has a multi-line react_native_post_install() call:
 *     react_native_post_install(
 *       installer,
 *       config[:reactNativePath],
 *       :mac_catalyst_enabled => false,
 *       :ccache_enabled => ccache_enabled?(podfile_properties),
 *     )
 *   The old anchor `react_native_post_install(installer)` did NOT match because
 *   the actual call spans multiple lines with extra arguments. The fallback
 *   strategy used indexOf('\nend') which found the closing `end` of the block
 *   but inserted AFTER it — placing `installer.pods_project` outside the block
 *   where `installer` is not in scope, causing:
 *     [!] Invalid `Podfile` file: undefined local variable or method `installer'
 *     # from Podfile:68
 *
 * Fix: find the `post_install do |installer|` block, track Ruby block depth to
 * find its closing `end`, and insert the fmt lines BEFORE that `end`.
 *
 * References:
 *   https://github.com/facebook/react-native/issues/55601
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_FIX_MARKER = '# [withPodfileFmtFix] fmt C++17 patch for Xcode 26+';

// Lines injected immediately BEFORE the closing `end` of the post_install block.
const FMT_FIX_LINES = `
  ${FMT_FIX_MARKER}
  # Xcode 26 / Apple Clang 21 tightened consteval validation.
  # The fmt 11.0.2 pod vendored in React Native breaks under C++20 on Xcode 26.
  # Compile fmt alone against C++17 to skip the broken consteval path.
  installer.pods_project.targets.each do |target|
    if target.name == 'fmt'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      end
    end
  end
`;

/**
 * Find the character index of the closing `end` of the `post_install do |installer|`
 * block by tracking Ruby block depth. Returns -1 if not found.
 *
 * We scan line-by-line after the opening `post_install do |installer|` line.
 * Depth starts at 1. Every line that opens a new Ruby block (do, if, unless,
 * begin, case, class, module, def, while, until, for) increments depth.
 * Every bare `end` decrements depth. When depth reaches 0, we found the
 * closing `end` of the post_install block.
 */
function findPostInstallBlockEnd(contents) {
  const OPEN_TAG = 'post_install do |installer|';
  const blockStart = contents.indexOf(OPEN_TAG);
  if (blockStart === -1) return -1;

  const afterOpen = blockStart + OPEN_TAG.length;
  const remaining = contents.slice(afterOpen);
  const lines = remaining.split('\n');

  // Patterns that open a new block depth
  const OPENS_BLOCK = /\bdo\b|\bif\b|\bunless\b|\bbegin\b|\bcase\b|\bclass\b|\bmodule\b|\bdef\b|\bwhile\b|\buntil\b|\bfor\b/;
  // A line that is just `end` (possibly indented, possibly with a comment)
  const CLOSES_BLOCK = /^\s*end\b/;

  let depth = 1;
  let charPos = afterOpen;

  for (const line of lines) {
    // Check for block-closing `end` first
    if (CLOSES_BLOCK.test(line)) {
      depth -= 1;
      if (depth === 0) {
        // Return the index of the `e` in `end` on this line
        const indentLen = line.match(/^(\s*)/)[1].length;
        return charPos + indentLen;
      }
    }

    // Count block openers on this line (skip the opening line itself which we
    // already counted by starting depth=1)
    const opens = line.match(/\bdo\b|\bif\b|\bunless\b|\bbegin\b|\bcase\b|\bclass\b|\bmodule\b|\bdef\b|\bwhile\b|\buntil\b|\bfor\b/g);
    if (opens) {
      depth += opens.length;
    }

    charPos += line.length + 1; // +1 for the \n
  }

  return -1;
}

const withPodfileFmtFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) {
        console.warn('[withPodfileFmtFix] Podfile not found — skipping');
        return config;
      }

      let contents = fs.readFileSync(podfilePath, 'utf8');

      if (contents.includes(FMT_FIX_MARKER)) {
        console.log('[withPodfileFmtFix] already applied — skipping');
        return config;
      }

      // Find the closing `end` of the post_install block and insert BEFORE it.
      const endPos = findPostInstallBlockEnd(contents);
      if (endPos === -1) {
        console.warn('[withPodfileFmtFix] Could not locate post_install block end — skipping');
        return config;
      }

      // Insert FMT_FIX_LINES immediately before the closing `end`
      contents = contents.slice(0, endPos) + FMT_FIX_LINES + contents.slice(endPos);
      fs.writeFileSync(podfilePath, contents);
      console.log('[withPodfileFmtFix] injected fmt C++17 lines inside post_install block (before closing end)');
      return config;
    },
  ]);
};

module.exports = withPodfileFmtFix;
