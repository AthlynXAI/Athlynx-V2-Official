/**
 * Expo Config Plugin — Xcode 26 iOS build fixes.
 *
 * FIX 1 — fmt consteval (CONFIRMED: expo/expo#44229, fmtlib/fmt#4740):
 * Patches fmt/base.h directly inside Pods to set FMT_USE_CONSTEVAL=0.
 *
 * FIX 2 — jsinspector-modern/ReactCdp.h not found:
 * ROOT CAUSE: ExpoModulesCore compiles SwiftUIVirtualViewObjC.mm
 *   → includes EXJSIConversions.h
 *   → includes React-Core-umbrella.h (line 41)
 *   → includes RCTBridge+Inspector.h
 *   → tries to import <jsinspector-modern/ReactCdp.h>
 *   → fails because React-jsinspector pod headers are not exposed as a module.
 *
 * FIX: Add `pod 'React-jsinspector', :modular_headers => true` as a
 * TOP-LEVEL declaration in the Podfile (before the target block).
 * This is the confirmed fix from multiple community sources for
 * Expo SDK 53 + React Native 0.79 + useFrameworks: static.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_MARKER = '# [withCppFix] fmt base.h patch for Xcode 26';
const JSI_MARKER = '# [withCppFix] React-jsinspector modular_headers fix';

// Ruby code injected into post_install — patches fmt/base.h directly
const FMT_PATCH_RUBY = `
  ${FMT_MARKER}
  fmt_base_h = File.join(installer.sandbox.pod_dir('fmt'), 'include', 'fmt', 'base.h')
  if File.exist?(fmt_base_h)
    content = File.read(fmt_base_h)
    patched = content.gsub(
      /^(#\\s*define\\s+FMT_USE_CONSTEVAL)\\s+1(\\s*\\/\\/.*)?$/,
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

      // --- FIX 1: fmt/base.h patch (inject into post_install) ---
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

      // --- FIX 2: React-jsinspector modular_headers (top-level pod declaration) ---
      // Must be BEFORE the target block so CocoaPods exposes it as a module.
      // This is the confirmed fix for jsinspector-modern/ReactCdp.h not found
      // with useFrameworks: static + Expo SDK 53 + React Native 0.79.
      if (!content.includes(JSI_MARKER)) {
        // Find the first 'target ' line (the main app target block)
        const targetLineRegex = /^(target\s+['"][^'"]+['"]\s+do\s*$)/m;
        const targetMatch = targetLineRegex.exec(content);

        if (targetMatch) {
          const insertBefore = targetMatch.index;
          const jsiDeclaration = `${JSI_MARKER}\npod 'React-jsinspector', :modular_headers => true\n\n`;
          content = content.slice(0, insertBefore) + jsiDeclaration + content.slice(insertBefore);
          console.log('[withCppFix] Inserted React-jsinspector modular_headers declaration before target block.');
        } else {
          // Fallback: insert after platform line
          const platformRegex = /^(platform\s+:ios.*$)/m;
          const platformMatch = platformRegex.exec(content);
          if (platformMatch) {
            const insertPos = platformMatch.index + platformMatch[0].length + 1;
            const jsiDeclaration = `\n${JSI_MARKER}\npod 'React-jsinspector', :modular_headers => true\n`;
            content = content.slice(0, insertPos) + jsiDeclaration + content.slice(insertPos);
            console.log('[withCppFix] Inserted React-jsinspector modular_headers declaration after platform line.');
          } else {
            console.warn('[withCppFix] Could not find target block or platform line — skipping jsinspector fix.');
          }
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
