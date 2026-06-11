/**
 * Expo Config Plugin — Xcode 26 / fmt C++17 fix.
 *
 * Problem: fmt 11.0.2 (bundled with RN 0.79) uses FMT_USE_CONSTEVAL=1 when it
 * detects Clang >= 11.01. Apple Clang in Xcode 26 enforces stricter consteval
 * rules, causing "call to consteval function is not a constant expression"
 * errors in fmt/format-inl.h.
 *
 * Fix: Set CLANG_CXX_LANGUAGE_STANDARD = c++17 ONLY for the fmt pod.
 * All other pods keep C++20 which React Native internals require.
 *
 * CRITICAL: expo-build-properties already generates a post_install block.
 * CocoaPods only runs the FIRST post_install block it finds.
 * We must INSERT our fix INSIDE the existing post_install block,
 * NOT add a second post_install block.
 *
 * This plugin runs after prebuild (withDangerousMod) and patches the
 * already-generated Podfile by inserting the fmt fix after the last line
 * inside the existing post_install block.
 *
 * Reference: https://bleepingswift.com/blog/fmt-consteval-error-xcode-26-4-react-native
 * Reference: https://github.com/facebook/react-native/issues/55601
 * Reference: https://github.com/expo/expo/issues/44229
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_FIX_MARKER = '# [withCppFix] fmt C++17 fix for Xcode 26';

const FMT_FIX_RUBY = `
  ${FMT_FIX_MARKER}
  installer.pods_project.targets.each do |target|
    if target.name == 'fmt'
      target.build_configurations.each do |build_config|
        build_config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      end
    end
  end
`;

const withCppFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        console.warn('[withCppFix] Podfile not found at', podfilePath, '- skipping.');
        return config;
      }

      let content = fs.readFileSync(podfilePath, 'utf-8');

      // Already patched — skip
      if (content.includes(FMT_FIX_MARKER)) {
        console.log('[withCppFix] fmt fix already present in Podfile, skipping.');
        return config;
      }

      // Strategy: find the post_install block and insert our fix before its closing `end`
      // The post_install block looks like:
      //   post_install do |installer|
      //     ...
      //   end
      //
      // We find the LAST `end` that closes the post_install block by tracking nesting depth.

      const lines = content.split('\n');
      let postInstallLineIdx = -1;
      let closingEndLineIdx = -1;
      let depth = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (postInstallLineIdx === -1) {
          // Look for the start of post_install block
          if (/^\s*post_install\s+do\s+\|/.test(line)) {
            postInstallLineIdx = i;
            depth = 1;
          }
        } else {
          // Count do/end to find the matching closing end
          const doMatches = (line.match(/\bdo\b/g) || []).length;
          const endMatches = (line.match(/\bend\b/g) || []).length;
          depth += doMatches - endMatches;

          if (depth <= 0) {
            closingEndLineIdx = i;
            break;
          }
        }
      }

      if (postInstallLineIdx === -1) {
        // No post_install block found — create one
        console.log('[withCppFix] No post_install block found, appending one.');
        content += `\npost_install do |installer|\n${FMT_FIX_RUBY}end\n`;
      } else if (closingEndLineIdx === -1) {
        console.warn('[withCppFix] Could not find closing end for post_install block — skipping.');
        return config;
      } else {
        // Insert our fix before the closing `end` of the post_install block
        console.log(`[withCppFix] Inserting fmt fix at line ${closingEndLineIdx} (before closing end of post_install).`);
        lines.splice(closingEndLineIdx, 0, FMT_FIX_RUBY);
        content = lines.join('\n');
      }

      fs.writeFileSync(podfilePath, content, 'utf-8');
      console.log('[withCppFix] Applied fmt C++17 fix to Podfile (scoped to fmt pod only).');
      return config;
    },
  ]);
};

module.exports = withCppFix;
