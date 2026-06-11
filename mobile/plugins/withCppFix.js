/**
 * Expo Config Plugin — Xcode 26 iOS build fixes.
 *
 * FIX 1 — fmt consteval (CONFIRMED: expo/expo#44229, fmtlib/fmt#4740):
 * Patches fmt/base.h directly inside Pods to set FMT_USE_CONSTEVAL=0.
 * This is the ONLY approach that works — build settings can't override it.
 *
 * FIX 2 — jsinspector-modern/ReactCdp.h not found:
 * Adds `pod 'React-jsinspector', :modular_headers => true` to the target block.
 * Required when using useFrameworks: static with RN 0.79+.
 * Source: https://github.com/facebook/react-native/issues/50856
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_MARKER = '# [withCppFix] fmt base.h patch for Xcode 26';
const JSI_MARKER = '# [withCppFix] React-jsinspector modular_headers';

// Ruby code injected into post_install — patches fmt/base.h directly
const FMT_PATCH_RUBY = `
  ${FMT_MARKER}
  fmt_base_h = File.join(installer.sandbox.pod_dir('fmt'), 'include', 'fmt', 'base.h')
  if File.exist?(fmt_base_h)
    content = File.read(fmt_base_h)
    # Disable consteval for ALL Apple Clang versions (Xcode 26 breaks consteval)
    patched = content.gsub(
      /^(#\\s*elif\\s+defined\\(__apple_build_version__\\)\\s*&&\\s*__apple_build_version__\\s*>=\\s*14000029L\\s*\\n#\\s*define\\s+FMT_USE_CONSTEVAL)\\s+1/,
      '\\\\1 0'
    )
    # Also catch the simpler single-line pattern if present
    patched = patched.gsub(
      /^(#\\s*define\\s+FMT_USE_CONSTEVAL)\\s+1(\\s*\\/\\/.*apple.*)?$/,
      '\\\\1 0\\\\2'
    )
    if patched != content
      File.chmod(0644, fmt_base_h)
      File.write(fmt_base_h, patched)
      puts '[withCppFix] Patched fmt/base.h: FMT_USE_CONSTEVAL=0'
    else
      puts '[withCppFix] fmt/base.h already patched or pattern not found'
    end
  else
    puts '[withCppFix] WARNING: fmt/base.h not found at ' + fmt_base_h
  end
`;

// Pod line to insert before the target block closing end
// Fixes: 'jsinspector-modern/ReactCdp.h' file not found with useFrameworks static
const JSI_POD_LINE = `  ${JSI_MARKER}\n  pod 'React-jsinspector', :path => '../node_modules/react-native/ReactCommon/jsinspector-modern', :modular_headers => true\n`;

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

      // --- FIX 1: fmt/base.h patch ---
      if (!content.includes(FMT_MARKER)) {
        const rnPostInstallRegex = /(react_native_post_install\s*\([^)]*\))/s;
        const match = rnPostInstallRegex.exec(content);

        if (match) {
          content = content.replace(match[0], match[0] + '\n' + FMT_PATCH_RUBY);
          console.log('[withCppFix] Inserted fmt/base.h patch after react_native_post_install.');
        } else {
          console.warn('[withCppFix] react_native_post_install not found — appending post_install block.');
          content += `\npost_install do |installer|\n${FMT_PATCH_RUBY}end\n`;
        }
      } else {
        console.log('[withCppFix] fmt patch already present.');
      }

      // --- FIX 2: React-jsinspector modular_headers ---
      // Insert before the first `target 'athlynxai' do` block's closing end,
      // or simply prepend before the first `target` line if not already present.
      if (!content.includes(JSI_MARKER)) {
        // Find the target block: `target 'athlynxai' do`
        // Insert the pod line right after the `target '...' do` line
        const targetLineRegex = /(target\s+['"][^'"]+['"]\s+do\s*\n)/;
        const targetMatch = targetLineRegex.exec(content);
        if (targetMatch) {
          content = content.replace(targetMatch[0], targetMatch[0] + JSI_POD_LINE);
          console.log('[withCppFix] Inserted React-jsinspector modular_headers fix.');
        } else {
          console.warn('[withCppFix] target block not found — skipping jsinspector fix.');
        }
      } else {
        console.log('[withCppFix] jsinspector fix already present.');
      }

      fs.writeFileSync(podfilePath, content, 'utf-8');
      console.log('[withCppFix] Podfile patched successfully.');
      return config;
    },
  ]);
};

module.exports = withCppFix;
