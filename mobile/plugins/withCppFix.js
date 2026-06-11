/**
 * Expo Config Plugin — Xcode 26 iOS build fixes.
 *
 * FIX 1 — fmt consteval (CONFIRMED: expo/expo#44229, fmtlib/fmt#4740):
 * Patches fmt/base.h directly inside Pods to set FMT_USE_CONSTEVAL=0.
 *
 * FIX 2 — jsinspector-modern/ReactCdp.h not found:
 * ROOT CAUSE (confirmed from Xcode log line 60612):
 *   ExpoModulesCore compiles SwiftUIVirtualViewObjC.mm
 *   → includes RCTBridge+Inspector.h
 *   → tries to import <jsinspector-modern/ReactCdp.h>
 *   → fails because jsinspector_modern.framework headers are not in
 *     ExpoModulesCore's HEADER_SEARCH_PATHS.
 *
 * FIX: In post_install, add the built framework's headers directory
 * to ExpoModulesCore's HEADER_SEARCH_PATHS so the angle-bracket import works.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_MARKER = '# [withCppFix] fmt base.h patch for Xcode 26';
const JSI_MARKER = '# [withCppFix] ExpoModulesCore jsinspector header search path fix';

// Ruby code injected into post_install — patches fmt/base.h directly
const FMT_PATCH_RUBY = `
  ${FMT_MARKER}
  fmt_base_h = File.join(installer.sandbox.pod_dir('fmt'), 'include', 'fmt', 'base.h')
  if File.exist?(fmt_base_h)
    content = File.read(fmt_base_h)
    patched = content.gsub(
      /^(#\\s*elif\\s+defined\\(__apple_build_version__\\)\\s*&&\\s*__apple_build_version__\\s*>=\\s*14000029L\\s*\\n#\\s*define\\s+FMT_USE_CONSTEVAL)\\s+1/,
      '\\\\1 0'
    )
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

// Ruby code injected into post_install — adds jsinspector_modern framework
// headers to ExpoModulesCore's HEADER_SEARCH_PATHS.
//
// Root cause: ExpoModulesCore -> RCTBridge+Inspector.h -> #import <jsinspector-modern/ReactCdp.h>
// The jsinspector_modern.framework is built but its headers dir is not in ExpoModulesCore's search paths.
// Solution: add $(BUILT_PRODUCTS_DIR)/jsinspector_modern.framework/Headers to HEADER_SEARCH_PATHS
// for ExpoModulesCore (and any other pod that needs it).
const JSI_HEADER_FIX_RUBY = `
  ${JSI_MARKER}
  installer.pods_project.targets.each do |target|
    if ['ExpoModulesCore', 'React-Core', 'React-RCTAppDelegate'].include?(target.name)
      target.build_configurations.each do |config|
        existing = config.build_settings['HEADER_SEARCH_PATHS'] || '$(inherited)'
        existing_str = existing.is_a?(Array) ? existing.join(' ') : existing.to_s
        jsi_path = '$(BUILT_PRODUCTS_DIR)/jsinspector_modern.framework/Headers'
        unless existing_str.include?('jsinspector_modern')
          config.build_settings['HEADER_SEARCH_PATHS'] = existing_str + ' ' + jsi_path
          puts "[withCppFix] Added jsinspector_modern headers to #{target.name}"
        end
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

      // --- FIX 2: ExpoModulesCore jsinspector header search path fix ---
      if (!content.includes(JSI_MARKER)) {
        const rnPostInstallRegex = /(react_native_post_install\s*\([^)]*\))/s;
        const match = rnPostInstallRegex.exec(content);

        if (match) {
          // Insert AFTER the fmt patch (which was already inserted after react_native_post_install)
          // Find the updated position
          const updatedMatch = rnPostInstallRegex.exec(content);
          if (updatedMatch) {
            // Find the end of the fmt patch block by looking for the next blank line after it
            const fmtMarkerPos = content.indexOf(FMT_MARKER);
            if (fmtMarkerPos !== -1) {
              // Insert after the entire fmt patch block
              const insertAfter = content.indexOf('\n  end\n', fmtMarkerPos);
              if (insertAfter !== -1) {
                const insertPos = insertAfter + '\n  end\n'.length;
                content = content.slice(0, insertPos) + JSI_HEADER_FIX_RUBY + content.slice(insertPos);
              } else {
                content = content.replace(match[0], match[0] + '\n' + JSI_HEADER_FIX_RUBY);
              }
            } else {
              content = content.replace(match[0], match[0] + '\n' + JSI_HEADER_FIX_RUBY);
            }
          }
          console.log('[withCppFix] Inserted ExpoModulesCore jsinspector header search path fix.');
        } else {
          content += `\npost_install do |installer|\n${JSI_HEADER_FIX_RUBY}end\n`;
          console.log('[withCppFix] Appended jsinspector header fix as new post_install block.');
        }
      } else {
        console.log('[withCppFix] jsinspector header fix already present.');
      }

      fs.writeFileSync(podfilePath, content, 'utf-8');
      console.log('[withCppFix] Podfile patched successfully.');
      return config;
    },
  ]);
};

module.exports = withCppFix;
