/**
 * Expo Config Plugin — Xcode 26 iOS build fixes.
 *
 * FIX 1 — fmt consteval (CONFIRMED: expo/expo#44229, fmtlib/fmt#4740):
 * Patches fmt/base.h directly inside Pods to set FMT_USE_CONSTEVAL=0.
 *
 * FIX 2 — jsinspector-modern/ReactCdp.h not found:
 * Uses pre_install hook to force React-cxxreact and React-jsinspector
 * to build as dynamic frameworks, resolving header visibility issues.
 * Source: https://stackoverflow.com/questions/37388126
 *         https://github.com/facebook/react-native/issues/50856
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_MARKER = '# [withCppFix] fmt base.h patch for Xcode 26';
const JSI_MARKER = '# [withCppFix] React-jsinspector pre_install dynamic framework fix';

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

// Ruby pre_install block — forces React-jsinspector and React-cxxreact
// to build as dynamic frameworks so their headers are visible to all consumers.
// This is the confirmed fix for 'jsinspector-modern/ReactCdp.h' file not found
// when using useFrameworks with expo-image-picker or similar libraries.
const JSI_PRE_INSTALL_RUBY = `
${JSI_MARKER}
pre_install do |installer|
  installer.pod_targets.each do |pod|
    if ['React-cxxreact', 'React-jsinspector'].include?(pod.name)
      puts "[withCppFix] Overriding build type for #{pod.name} to dynamic framework"
      def pod.build_type
        Pod::BuildType.new(:linkage => :dynamic, :packaging => :framework)
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

      // --- FIX 2: React-jsinspector pre_install dynamic framework fix ---
      // Inject BEFORE the first 'target' block in the Podfile
      if (!content.includes(JSI_MARKER)) {
        // Find the first 'target ' line to insert before it
        const targetMatch = /^target ['"]/.exec(content);
        if (targetMatch) {
          const insertPos = content.indexOf(targetMatch[0]);
          content = content.slice(0, insertPos) + JSI_PRE_INSTALL_RUBY + '\n' + content.slice(insertPos);
          console.log('[withCppFix] Inserted React-jsinspector pre_install dynamic framework fix.');
        } else {
          // Fallback: prepend to file after require lines
          const requireEnd = content.lastIndexOf("require '");
          if (requireEnd !== -1) {
            const lineEnd = content.indexOf('\n', requireEnd) + 1;
            content = content.slice(0, lineEnd) + '\n' + JSI_PRE_INSTALL_RUBY + '\n' + content.slice(lineEnd);
          } else {
            content = JSI_PRE_INSTALL_RUBY + '\n' + content;
          }
          console.log('[withCppFix] Inserted React-jsinspector pre_install fix (fallback position).');
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
