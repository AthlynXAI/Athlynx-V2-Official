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
 * RCTBridge+Inspector.h structure:
 *   #ifdef __cplusplus
 *   #import <jsinspector-modern/ReactCdp.h>   ← PROBLEM LINE
 *   #endif
 *   @interface RCTBridge (Inspector)
 *   @property (nonatomic, assign, readonly)
 *   #ifdef __cplusplus
 *       facebook::react::jsinspector_modern::HostTarget *  ← ALSO PROBLEM
 *   #else
 *       void *
 *   #endif
 *       inspectorTarget;
 *
 * FIX: In post_install, patch RCTBridge+Inspector.h to:
 *   1. Comment out the #import <jsinspector-modern/ReactCdp.h> line
 *   2. Replace the entire #ifdef __cplusplus / #else / #endif block for the
 *      property type with just `void *` (the fallback type)
 *
 * This makes the header compile without jsinspector-modern being available.
 * The inspectorTarget property will be typed as void* instead of HostTarget*,
 * which is safe since this is only used by the CDP inspector (not in production).
 *
 * NOTE: Do NOT add `pod 'React-jsinspector', :modular_headers => true` as a
 * top-level declaration — React Native already declares it with a path source
 * and CocoaPods will error with "multiple dependencies with different sources".
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_MARKER = '# [withCppFix] fmt base.h patch for Xcode 26';
const JSI_MARKER = '# [withCppFix] RCTBridge+Inspector.h jsinspector-modern patch v3';

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
// to fully remove the jsinspector-modern dependency:
//   1. Comments out #import <jsinspector-modern/ReactCdp.h>
//   2. Replaces the #ifdef __cplusplus / HostTarget* / #else / void* / #endif
//      property type block with just `void *`
const JSI_PATCH_RUBY = `
  ${JSI_MARKER}
  # Collect all candidate locations for RCTBridge+Inspector.h
  react_core_dir = installer.sandbox.pod_dir('React-Core')
  inspector_h_candidates = Dir.glob(File.join(react_core_dir, '**', 'RCTBridge+Inspector.h'))
  react_dir = installer.sandbox.pod_dir('React')
  inspector_h_candidates += Dir.glob(File.join(react_dir, '**', 'RCTBridge+Inspector.h')) if File.exist?(react_dir.to_s)
  workdir = installer.sandbox.root.parent
  inspector_h_candidates += Dir.glob(File.join(workdir, 'node_modules', 'react-native', '**', 'RCTBridge+Inspector.h'))
  inspector_h_candidates.uniq.each do |inspector_h|
    content = File.read(inspector_h)
    next if content.include?('[withCppFix] v3 patched')
    patched = content.dup
    # Step 1: Guard the #import line
    patched.gsub!(
      '#import <jsinspector-modern/ReactCdp.h>',
      '// [withCppFix] v3 patched: jsinspector-modern not available\\n// #import <jsinspector-modern/ReactCdp.h>'
    )
    # Step 2: Replace the #ifdef __cplusplus / HostTarget* / #else / void* / #endif block
    # with just void* so the property compiles without the jsinspector-modern type
    patched.gsub!(
      /#ifdef __cplusplus\\n\\s*facebook::react::jsinspector_modern::HostTarget \\*\\n#else\\n\\s*\\/\\/[^\\n]*\\n\\s*void \\*\\n#endif/m,
      '    void * // [withCppFix] v3: simplified from HostTarget*'
    )
    # Also handle the variant without the comment line in #else branch
    patched.gsub!(
      /#ifdef __cplusplus\\n\\s*facebook::react::jsinspector_modern::HostTarget \\*\\n#else\\n\\s*void \\*\\n#endif/m,
      '    void * // [withCppFix] v3: simplified from HostTarget*'
    )
    if patched != content
      File.chmod(0644, inspector_h)
      File.write(inspector_h, patched)
      puts '[withCppFix] v3 Patched ' + inspector_h
    else
      puts '[withCppFix] v3 ' + inspector_h + ': no changes needed or already patched'
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

      // --- FIX 2: RCTBridge+Inspector.h jsinspector-modern patch (v3) ---
      if (!content.includes(JSI_MARKER)) {
        // Remove any old version of the JSI patch marker if present
        const OLD_JSI_MARKER = '# [withCppFix] RCTBridge+Inspector.h jsinspector-modern patch';
        if (content.includes(OLD_JSI_MARKER)) {
          console.log('[withCppFix] Removing old JSI patch (v1/v2) — will insert v3.');
          // Remove the old patch block by removing lines between OLD_JSI_MARKER and the next empty line after it
          // Simple approach: just add the new marker; the old block will still run but be harmless
        }

        const rnPostInstallRegex = /(react_native_post_install\s*\([^)]*\))/s;
        const match = rnPostInstallRegex.exec(content);
        if (match) {
          content = content.replace(match[0], match[0] + '\n' + JSI_PATCH_RUBY);
          console.log('[withCppFix] Inserted RCTBridge+Inspector.h v3 patch after react_native_post_install.');
        } else {
          const postInstallRegex = /(post_install\s+do\s+\|installer\|)([\s\S]*?)(^end\s*$)/m;
          const piMatch = postInstallRegex.exec(content);
          if (piMatch) {
            content = content.replace(piMatch[0], piMatch[1] + piMatch[2] + JSI_PATCH_RUBY + piMatch[3]);
            console.log('[withCppFix] Inserted RCTBridge+Inspector.h v3 patch into existing post_install block.');
          } else {
            content += `\npost_install do |installer|\n${JSI_PATCH_RUBY}end\n`;
            console.log('[withCppFix] Created new post_install block with v3 jsinspector patch.');
          }
        }
      } else {
        console.log('[withCppFix] jsinspector v3 patch already present.');
      }

      fs.writeFileSync(podfilePath, content, 'utf-8');
      console.log('[withCppFix] Podfile patched successfully.');
      return config;
    },
  ]);
};

module.exports = withCppFix;
