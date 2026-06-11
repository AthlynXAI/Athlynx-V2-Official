/**
 * Expo Config Plugin — Xcode 26 / C++17 compatibility fix.
 *
 * The fmt library used by some React Native native modules uses consteval
 * expressions that are not valid under Xcode 26's stricter C++20 enforcement.
 * This plugin adds a post_install hook to the Podfile that sets
 * CLANG_CXX_LANGUAGE_STANDARD = "c++17" for all pods, resolving the
 * "call to consteval function is not a constant expression" build errors.
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
        console.warn('[withCppFix] Podfile not found, skipping.');
        return config;
      }

      let podfileContents = fs.readFileSync(podfilePath, 'utf8');

      const cppFixHook = `
  # Xcode 26 / C++17 compatibility fix — resolves fmt consteval errors
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      config.build_settings['CLANG_CXX_LIBRARY'] = 'libc++'
    end
  end
`;

      // Check if already applied
      if (podfileContents.includes('CLANG_CXX_LANGUAGE_STANDARD')) {
        console.log('[withCppFix] C++ fix already present in Podfile, skipping.');
        return config;
      }

      // Insert before the last `end` in post_install, or append a new post_install block
      if (podfileContents.includes('post_install do |installer|')) {
        // Insert inside existing post_install block
        podfileContents = podfileContents.replace(
          /post_install do \|installer\|([\s\S]*?)^end/m,
          (match, inner) => {
            return `post_install do |installer|${inner}${cppFixHook}end`;
          }
        );
      } else {
        // Append a new post_install block
        podfileContents += `\npost_install do |installer|\n${cppFixHook}end\n`;
      }

      fs.writeFileSync(podfilePath, podfileContents, 'utf8');
      console.log('[withCppFix] Applied C++17 fix to Podfile.');
      return config;
    },
  ]);
};

module.exports = withCppFix;
