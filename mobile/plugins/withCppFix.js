/**
 * Expo Config Plugin — Xcode 26 iOS build fixes.
 *
 * Fix 1: fmt C++17 (consteval error)
 *   Set CLANG_CXX_LANGUAGE_STANDARD = c++17 for the fmt pod inside post_install.
 *   Strategy: find "react_native_post_install(" call inside post_install and
 *   append our block right after the closing paren+newline of that call.
 *
 * Fix 2: jsinspector-modern/ReactCdp.h not found
 *   Add `pod 'React-jsinspector', :modular_headers => true` before the target block.
 *   This is required when useFrameworks: static is set.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_MARKER = '# [withCppFix:fmt]';
const JSI_MARKER = '# [withCppFix:jsi]';

const FMT_RUBY = `
  ${FMT_MARKER} fmt C++17 fix for Xcode 26 consteval errors
  installer.pods_project.targets.each do |target|
    if target.name == 'fmt'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      end
    end
  end
`;

const JSI_POD = `${JSI_MARKER} React-jsinspector modular_headers for jsinspector-modern headers
pod 'React-jsinspector', :path => '../node_modules/react-native/ReactCommon/jsinspector-modern', :modular_headers => true
`;

const withCppFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        console.warn('[withCppFix] Podfile not found — skipping.');
        return config;
      }

      let content = fs.readFileSync(podfilePath, 'utf-8');

      // ── Fix 1: fmt C++17 ─────────────────────────────────────────────────
      // Strategy: find the react_native_post_install(...) call and insert
      // our Ruby block immediately after it (still inside post_install).
      // This is robust regardless of indentation or surrounding structure.
      if (content.includes(FMT_MARKER)) {
        console.log('[withCppFix] fmt fix already present.');
      } else {
        // Match react_native_post_install(...) — may span multiple lines
        // We look for the pattern and insert after the line that ends the call
        const rnPostInstallRegex = /(\s*react_native_post_install\s*\([^)]*\))/;
        const match = rnPostInstallRegex.exec(content);
        if (match) {
          const insertAfter = match[0];
          content = content.replace(insertAfter, insertAfter + '\n' + FMT_RUBY);
          console.log('[withCppFix] Inserted fmt C++17 fix after react_native_post_install.');
        } else {
          // Fallback: append a new post_install block
          console.warn('[withCppFix] react_native_post_install not found — appending post_install block.');
          content += `\npost_install do |installer|\n${FMT_RUBY}end\n`;
        }
      }

      // ── Fix 2: React-jsinspector modular_headers ─────────────────────────
      if (content.includes(JSI_MARKER)) {
        console.log('[withCppFix] jsinspector fix already present.');
      } else {
        // Insert before the first `target '...' do` line
        const targetRegex = /^(target\s+['"][^'"]+['"]\s+do)/m;
        const targetMatch = targetRegex.exec(content);
        if (targetMatch) {
          content = content.replace(targetMatch[0], JSI_POD + '\n' + targetMatch[0]);
          console.log('[withCppFix] Inserted React-jsinspector modular_headers fix.');
        } else {
          console.warn('[withCppFix] No target block found — appending jsinspector pod.');
          content += `\n${JSI_POD}\n`;
        }
      }

      fs.writeFileSync(podfilePath, content, 'utf-8');
      console.log('[withCppFix] Podfile patched successfully.');
      return config;
    },
  ]);
};

module.exports = withCppFix;
