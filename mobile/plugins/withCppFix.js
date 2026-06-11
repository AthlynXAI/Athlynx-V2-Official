/**
 * withCppFix.js — Expo config plugin for Xcode 26 iOS build fixes.
 *
 * FIX 1 — fmt consteval (CONFIRMED: expo/expo#44229, fmtlib/fmt#4740):
 * Patches fmt/base.h directly inside Pods to set FMT_USE_CONSTEVAL=0.
 *
 * FIX 2 — jsinspector-modern/ReactCdp.h not found:
 * ROOT CAUSE: ExpoModulesCore compiles SwiftUIVirtualViewObjC.mm
 *   → includes EXJSIConversions.h
 *   → includes React-Core-umbrella.h (line 41)
 *   → includes RCTBridge+Inspector.h
 *   → tries to import <jsinspector-modern/ReactCdp.h>  (line 11)
 *   → fails because React-jsinspector headers are not visible in this context.
 *
 * FIX: In post_install, patch RCTBridge+Inspector.h inside the Pods directory
 * to guard the jsinspector-modern import with #if 0 so it is never compiled.
 * This is the same approach used for fmt/base.h and is safe — the Inspector
 * category methods are still declared, just without the ReactCdp.h dependency
 * which is only needed for the CDP inspector protocol (not used in production).
 *
 * NOTE: Do NOT add `pod 'React-jsinspector', :modular_headers => true` as a
 * top-level declaration — React Native already declares it with a path source
 * and CocoaPods will error with "multiple dependencies with different sources".
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_MARKER = '# [withCppFix] fmt base.h patch for Xcode 26';
const JSI_MARKER = '# [withCppFix] RCTBridge+Inspector.h jsinspector-modern patch';

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

// Ruby code injected into post_install — patches RCTBridge+Inspector.h
// to guard the jsinspector-modern import so it is never compiled.
// The file lives inside the React-Core pod headers directory.
const JSI_PATCH_RUBY = `
  ${JSI_MARKER}
  # Search for RCTBridge+Inspector.h in the React-Core pod directory
  react_core_dir = installer.sandbox.pod_dir('React-Core')
  inspector_h_candidates = Dir.glob(File.join(react_core_dir, '**', 'RCTBridge+Inspector.h'))
  # Also search in the React pod directory (older layout)
  react_dir = installer.sandbox.pod_dir('React')
  inspector_h_candidates += Dir.glob(File.join(react_dir, '**', 'RCTBridge+Inspector.h')) if File.exist?(react_dir.to_s)
  # Also search in the checked-out source (node_modules path)
  workdir = installer.sandbox.root.parent
  inspector_h_candidates += Dir.glob(File.join(workdir, 'node_modules', 'react-native', '**', 'RCTBridge+Inspector.h'))
  inspector_h_candidates.uniq.each do |inspector_h|
    content = File.read(inspector_h)
    # Guard the jsinspector-modern import so it is never compiled
    if content.include?('#import <jsinspector-modern/ReactCdp.h>') && !content.include?('[withCppFix] guarded')
      patched = content.gsub(
        '#import <jsinspector-modern/ReactCdp.h>',
        '// [withCppFix] guarded: jsinspector-modern not available in this build context\\n// #import <jsinspector-modern/ReactCdp.h>'
      )
      File.chmod(0644, inspector_h)
      File.write(inspector_h, patched)
      puts '[withCppFix] Patched ' + inspector_h + ': guarded jsinspector-modern import'
    else
      puts '[withCppFix] ' + inspector_h + ' already patched or import not found'
    end
  end
  if inspector_h_candidates.empty?
    puts '[withCppFix] WARNING: RCTBridge+Inspector.h not found — jsinspector patch skipped'
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

      // --- FIX 2: RCTBridge+Inspector.h jsinspector-modern patch ---
      // Inject into post_install AFTER the fmt patch (or alongside it)
      if (!content.includes(JSI_MARKER)) {
        const rnPostInstallRegex = /(react_native_post_install\s*\([^)]*\))/s;
        const match = rnPostInstallRegex.exec(content);
        if (match) {
          content = content.replace(match[0], match[0] + '\n' + JSI_PATCH_RUBY);
          console.log('[withCppFix] Inserted RCTBridge+Inspector.h jsinspector patch after react_native_post_install.');
        } else {
          // Append to existing post_install block or create new one
          const postInstallRegex = /(post_install\s+do\s+\|installer\|)([\s\S]*?)(^end\s*$)/m;
          const piMatch = postInstallRegex.exec(content);
          if (piMatch) {
            content = content.replace(piMatch[0], piMatch[1] + piMatch[2] + JSI_PATCH_RUBY + piMatch[3]);
            console.log('[withCppFix] Inserted RCTBridge+Inspector.h jsinspector patch into existing post_install block.');
          } else {
            content += `\npost_install do |installer|\n${JSI_PATCH_RUBY}end\n`;
            console.log('[withCppFix] Created new post_install block with jsinspector patch.');
          }
        }
      } else {
        console.log('[withCppFix] jsinspector patch already present.');
      }

      fs.writeFileSync(podfilePath, content, 'utf-8');
      console.log('[withCppFix] Podfile patched successfully.');
      return config;
    },
  ]);
};

module.exports = withCppFix;
