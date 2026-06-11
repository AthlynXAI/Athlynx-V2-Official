/**
 * Expo Config Plugin — Xcode 26 iOS build fixes.
 *
 * Fix 1: fmt consteval error
 *   fmt 11.0.2 sets FMT_USE_CONSTEVAL=1 when Clang >= 11.01 is detected.
 *   Xcode 26's Apple Clang enforces stricter consteval rules.
 *   Fix: Set GCC_PREPROCESSOR_DEFINITIONS += FMT_USE_CONSTEVAL=0 for the fmt pod.
 *   This directly disables consteval in fmt without changing the C++ standard.
 *
 * Fix 2: jsinspector-modern/ReactCdp.h not found
 *   Add pod 'React-jsinspector' with modular_headers => true before the target block.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_MARKER = '# [withCppFix:fmt]';
const JSI_MARKER = '# [withCppFix:jsi]';

// Use GCC_PREPROCESSOR_DEFINITIONS to set FMT_USE_CONSTEVAL=0
// This is more reliable than changing CLANG_CXX_LANGUAGE_STANDARD
const FMT_RUBY = `
  ${FMT_MARKER} Disable fmt consteval for Xcode 26 compatibility
  installer.pods_project.targets.each do |target|
    if target.name == 'fmt'
      target.build_configurations.each do |config|
        existing = config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']
        existing = [existing] unless existing.is_a?(Array)
        unless existing.include?('FMT_USE_CONSTEVAL=0')
          existing << 'FMT_USE_CONSTEVAL=0'
        end
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = existing
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

      // ── Fix 1: fmt consteval ─────────────────────────────────────────────
      if (content.includes(FMT_MARKER)) {
        console.log('[withCppFix] fmt fix already present.');
      } else {
        // Insert after react_native_post_install(...) call
        const rnPostInstallRegex = /(\s*react_native_post_install\s*\([^)]*\))/s;
        const match = rnPostInstallRegex.exec(content);
        if (match) {
          content = content.replace(match[0], match[0] + '\n' + FMT_RUBY);
          console.log('[withCppFix] Inserted fmt FMT_USE_CONSTEVAL=0 fix after react_native_post_install.');
        } else {
          console.warn('[withCppFix] react_native_post_install not found — appending post_install block.');
          content += `\npost_install do |installer|\n${FMT_RUBY}end\n`;
        }
      }

      // ── Fix 2: React-jsinspector modular_headers ─────────────────────────
      if (content.includes(JSI_MARKER)) {
        console.log('[withCppFix] jsinspector fix already present.');
      } else {
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
