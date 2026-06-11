/**
 * Expo Config Plugin — Xcode 26 iOS build fix.
 *
 * CONFIRMED FIX (expo/expo#44229, fmtlib/fmt#4740):
 *
 * Problem: fmt 11.0.2 (bundled with RN 0.79) defines FMT_USE_CONSTEVAL=1
 * when it detects Apple Clang >= 14000029. Xcode 26's Apple Clang enforces
 * stricter consteval rules, causing "call to consteval function is not a
 * constant expression" errors.
 *
 * Root cause: FMT_USE_CONSTEVAL is hardcoded in fmt/base.h — it cannot be
 * overridden by build settings (CLANG_CXX_LANGUAGE_STANDARD or
 * GCC_PREPROCESSOR_DEFINITIONS) because the header is already included
 * before those settings take effect.
 *
 * Fix: Patch the actual fmt/base.h source file inside the Pods directory
 * during post_install, replacing "#define FMT_USE_CONSTEVAL 1" with
 * "#define FMT_USE_CONSTEVAL 0" for all Apple Clang versions.
 *
 * This is the ONLY approach confirmed to work by the community.
 * Source: https://github.com/expo/expo/issues/44229
 * Source: https://github.com/fmtlib/fmt/issues/4740
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MARKER = '# [withCppFix] fmt base.h patch for Xcode 26';

// Ruby code injected into post_install — patches fmt/base.h directly
const FMT_PATCH_RUBY = `
  ${MARKER}
  fmt_base_h = File.join(installer.sandbox.pod_dir('fmt'), 'include', 'fmt', 'base.h')
  if File.exist?(fmt_base_h)
    content = File.read(fmt_base_h)
    # Disable consteval for ALL Apple Clang versions (Xcode 26 breaks consteval)
    patched = content.gsub(
      /^(#\\s*elif\\s+defined\\(__apple_build_version__\\)\\s*&&\\s*__apple_build_version__\\s*>=\\s*14000029L\\s*\\n#\\s*define\\s+FMT_USE_CONSTEVAL)\\s+1/,
      '\\\\1 0'
    )
    # Also catch the simpler pattern if present
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

      if (content.includes(MARKER)) {
        console.log('[withCppFix] fmt patch already present in Podfile.');
        return config;
      }

      // Find react_native_post_install(...) and insert our patch right after it
      // Using a dotAll regex to match the multi-line call
      const rnPostInstallRegex = /(react_native_post_install\s*\([^)]*\))/s;
      const match = rnPostInstallRegex.exec(content);

      if (match) {
        content = content.replace(match[0], match[0] + '\n' + FMT_PATCH_RUBY);
        console.log('[withCppFix] Inserted fmt/base.h patch after react_native_post_install.');
      } else {
        // Fallback: append a new post_install block
        console.warn('[withCppFix] react_native_post_install not found — appending post_install block.');
        content += `\npost_install do |installer|\n${FMT_PATCH_RUBY}end\n`;
      }

      fs.writeFileSync(podfilePath, content, 'utf-8');
      console.log('[withCppFix] Podfile patched successfully.');
      return config;
    },
  ]);
};

module.exports = withCppFix;
