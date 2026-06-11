/**
 * Expo Config Plugin — Xcode 26 / fmt C++17 fix.
 *
 * The fmt library (11.0.2) bundled with React Native uses FMT_USE_CONSTEVAL=1
 * when it detects Clang >= 11.01. Apple Clang in Xcode 26 enforces stricter
 * consteval rules, causing "call to consteval function is not a constant
 * expression" build errors in fmt/format-inl.h.
 *
 * The fix: scope CLANG_CXX_LANGUAGE_STANDARD = "c++17" to ONLY the fmt pod.
 * All other pods keep C++20 which React Native internals require.
 *
 * Reference: https://github.com/expo/expo/issues/44229
 * Reference: https://bleepingswift.com/blog/fmt-consteval-error-xcode-26-4-react-native
 *
 * Required for: React Native 0.79.x + Expo SDK 53 + Xcode 26 (macos-tahoe)
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

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

      // Already patched
      if (content.includes('FMT_USE_CONSTEVAL') || content.includes("target.name == 'fmt'")) {
        console.log('[withCppFix] fmt fix already present in Podfile, skipping.');
        return config;
      }

      // The surgical fix — only the fmt pod gets C++17
      const fmtFix = `
  # Fix: fmt 11.0.2 consteval error with Xcode 26 / Apple Clang 21
  # Scope C++17 to ONLY the fmt pod — all other pods keep C++20
  installer.pods_project.targets.each do |target|
    if target.name == 'fmt'
      target.build_configurations.each do |build_config|
        build_config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      end
    end
  end
`;

      // Insert inside existing post_install block if present
      if (content.includes('post_install do |installer|')) {
        // Find the last end of post_install and insert before it
        content = content.replace(
          /(post_install do \|installer\|[\s\S]*?)(^end)/m,
          (match, body, endTag) => `${body}${fmtFix}${endTag}`
        );
      } else {
        // No post_install block — append one
        content += `\npost_install do |installer|\n${fmtFix}end\n`;
      }

      fs.writeFileSync(podfilePath, content, 'utf-8');
      console.log('[withCppFix] Applied fmt C++17 fix to Podfile (scoped to fmt pod only).');
      return config;
    },
  ]);
};

module.exports = withCppFix;
