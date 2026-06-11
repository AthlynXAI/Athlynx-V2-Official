/**
 * Expo Config Plugin — Xcode 26 iOS build fixes.
 *
 * Fix 1: fmt C++17 (consteval error)
 * Problem: fmt 11.0.2 (bundled with RN 0.79) uses FMT_USE_CONSTEVAL=1 when it
 * detects Clang >= 11.01. Apple Clang in Xcode 26 enforces stricter consteval
 * rules, causing "call to consteval function is not a constant expression" errors.
 * Fix: Set CLANG_CXX_LANGUAGE_STANDARD = c++17 ONLY for the fmt pod.
 *
 * Fix 2: jsinspector-modern/ReactCdp.h not found
 * Problem: When useFrameworks: static is set, the React-jsinspector pod headers
 * are not accessible to other pods during compilation.
 * Fix: Add modular_headers => true for React-jsinspector pod in the Podfile.
 *
 * CRITICAL: expo-build-properties already generates a post_install block.
 * CocoaPods only runs the FIRST post_install block it finds.
 * We must INSERT our fix INSIDE the existing post_install block.
 *
 * References:
 * - https://bleepingswift.com/blog/fmt-consteval-error-xcode-26-4-react-native
 * - https://github.com/facebook/react-native/issues/55601
 * - https://github.com/facebook/react-native/issues/50856
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_FIX_MARKER = '# [withCppFix] fmt C++17 fix for Xcode 26';
const JSINSPECTOR_MARKER = "# [withCppFix] React-jsinspector modular_headers => true";

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

// modular_headers must be set on the pod declaration, not in post_install
// We inject this BEFORE the first `target '...' do` block
const JSINSPECTOR_POD_LINE = `${JSINSPECTOR_MARKER}\npod 'React-jsinspector', :path => '../node_modules/react-native/ReactCommon/jsinspector-modern', :modular_headers => true\n`;

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

      // ── Fix 1: fmt C++17 ──────────────────────────────────────────────────
      if (content.includes(FMT_FIX_MARKER)) {
        console.log('[withCppFix] fmt fix already present in Podfile, skipping.');
      } else {
        const lines = content.split('\n');
        let postInstallLineIdx = -1;
        let closingEndLineIdx = -1;
        let depth = 0;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (postInstallLineIdx === -1) {
            if (/^\s*post_install\s+do\s+\|/.test(line)) {
              postInstallLineIdx = i;
              depth = 1;
            }
          } else {
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
          console.log('[withCppFix] No post_install block found, appending one.');
          content += `\npost_install do |installer|\n${FMT_FIX_RUBY}end\n`;
        } else if (closingEndLineIdx === -1) {
          console.warn('[withCppFix] Could not find closing end for post_install block — skipping fmt fix.');
        } else {
          console.log(`[withCppFix] Inserting fmt fix before closing end of post_install (line ${closingEndLineIdx}).`);
          const linesArr = content.split('\n');
          linesArr.splice(closingEndLineIdx, 0, FMT_FIX_RUBY);
          content = linesArr.join('\n');
        }
        console.log('[withCppFix] Applied fmt C++17 fix.');
      }

      // ── Fix 2: React-jsinspector modular_headers ──────────────────────────
      if (content.includes(JSINSPECTOR_MARKER)) {
        console.log('[withCppFix] jsinspector modular_headers fix already present, skipping.');
      } else {
        // Insert the pod declaration before the first `target '...' do` line
        const targetMatch = content.match(/^target\s+['"][^'"]+['"]\s+do/m);
        if (targetMatch) {
          const insertIdx = content.indexOf(targetMatch[0]);
          content = content.slice(0, insertIdx) + JSINSPECTOR_POD_LINE + '\n' + content.slice(insertIdx);
          console.log('[withCppFix] Inserted React-jsinspector modular_headers fix before target block.');
        } else {
          console.warn('[withCppFix] Could not find target block — appending React-jsinspector pod declaration.');
          content += `\n${JSINSPECTOR_POD_LINE}\n`;
        }
      }

      fs.writeFileSync(podfilePath, content, 'utf-8');
      console.log('[withCppFix] Podfile patched successfully.');
      return config;
    },
  ]);
};

module.exports = withCppFix;
