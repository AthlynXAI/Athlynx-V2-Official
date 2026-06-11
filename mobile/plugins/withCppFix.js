/**
 * Expo Config Plugin — Xcode 26 iOS build fixes.
 *
 * FIX 1 — fmt consteval (CONFIRMED: expo/expo#44229, fmtlib/fmt#4740):
 * Patches fmt/base.h directly inside Pods to set FMT_USE_CONSTEVAL=0.
 *
 * FIX 2 — jsinspector-modern/ReactCdp.h not found:
 * Sets HEADER_SEARCH_PATHS on React-jsinspector target in post_install.
 * Required when expo-image-picker or other libs import RCTBridge+Inspector.h.
 * Source: https://github.com/facebook/react-native/issues/50856
 *         https://github.com/expo/expo/issues/38479
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_MARKER = '# [withCppFix] fmt base.h patch for Xcode 26';
const JSI_MARKER = '# [withCppFix] React-jsinspector HEADER_SEARCH_PATHS fix';

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

// Ruby code injected into post_install — fixes jsinspector header search paths
// This fixes: 'jsinspector-modern/ReactCdp.h' file not found
// Caused by expo-image-picker importing RCTBridge+Inspector.h with useFrameworks
const JSI_HEADER_FIX_RUBY = `
  ${JSI_MARKER}
  installer.pods_project.targets.each do |target|
    if target.name == 'React-jsinspector'
      target.build_configurations.each do |config|
        config.build_settings['HEADER_SEARCH_PATHS'] ||= '$(inherited)'
        config.build_settings['HEADER_SEARCH_PATHS'] = [
          '$(inherited)',
          '"$(PODS_TARGET_SRCROOT)/"',
          '"$(PODS_TARGET_SRCROOT)/jsinspector-modern"',
          '"$(PODS_ROOT)/Headers/Public/React-jsinspector"',
          '"$(PODS_ROOT)/Headers/Public/React-jsinspector/jsinspector-modern"'
        ].join(' ')
        config.build_settings['DEFINES_MODULE'] = 'YES'
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

      // --- FIX 2: React-jsinspector HEADER_SEARCH_PATHS ---
      if (!content.includes(JSI_MARKER)) {
        const rnPostInstallRegex2 = /(react_native_post_install\s*\([^)]*\))/s;
        const match2 = rnPostInstallRegex2.exec(content);

        if (match2) {
          // Insert AFTER the fmt patch (which was already inserted after react_native_post_install)
          // Find the end of the fmt patch block and insert after it
          const fmtMarkerPos = content.indexOf(FMT_MARKER);
          if (fmtMarkerPos !== -1) {
            // Find the 'end' that closes the fmt if block (after 'puts ... not found')
            const afterFmt = content.indexOf("puts '[withCppFix] WARNING: fmt/base.h not found at ' + fmt_base_h\n  end\n", fmtMarkerPos);
            if (afterFmt !== -1) {
              const insertPos = afterFmt + "puts '[withCppFix] WARNING: fmt/base.h not found at ' + fmt_base_h\n  end\n".length;
              content = content.slice(0, insertPos) + JSI_HEADER_FIX_RUBY + content.slice(insertPos);
            } else {
              // Fallback: insert after react_native_post_install
              content = content.replace(match2[0], match2[0] + '\n' + JSI_HEADER_FIX_RUBY);
            }
          } else {
            content = content.replace(match2[0], match2[0] + '\n' + JSI_HEADER_FIX_RUBY);
          }
          console.log('[withCppFix] Inserted React-jsinspector HEADER_SEARCH_PATHS fix.');
        } else {
          console.warn('[withCppFix] react_native_post_install not found for jsinspector fix.');
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
