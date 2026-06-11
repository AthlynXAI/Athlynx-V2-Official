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
 *   → fails because React-jsinspector headers are not in HEADER_SEARCH_PATHS
 *     for ExpoModulesCore and other pods that transitively include React-Core.
 *
 * React-jsinspector pod has header_dir = 'jsinspector-modern', so its headers
 * are installed at $(PODS_ROOT)/Headers/Public/React-jsinspector/jsinspector-modern/
 *
 * FIX: In post_install, add $(PODS_ROOT)/Headers/Public/React-jsinspector to
 * HEADER_SEARCH_PATHS for all pod targets that need it (ExpoModulesCore and
 * any other pod that transitively includes React-Core umbrella headers).
 *
 * This is the correct fix that preserves type safety — no header patching needed.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FMT_MARKER = '# [withCppFix] fmt base.h patch for Xcode 26';
const JSI_MARKER = '# [withCppFix] jsinspector-modern HEADER_SEARCH_PATHS fix v4';

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

// Ruby code injected into post_install — adds React-jsinspector to HEADER_SEARCH_PATHS
// for all pod targets that transitively include React-Core umbrella headers.
//
// The React-jsinspector pod installs its headers at:
//   $(PODS_ROOT)/Headers/Public/React-jsinspector/
// with header_dir = 'jsinspector-modern', so the full path is:
//   $(PODS_ROOT)/Headers/Public/React-jsinspector/jsinspector-modern/ReactCdp.h
//
// Adding $(PODS_ROOT)/Headers/Public/React-jsinspector to HEADER_SEARCH_PATHS
// makes #import <jsinspector-modern/ReactCdp.h> resolve correctly.
const JSI_PATCH_RUBY = `
  ${JSI_MARKER}
  jsinspector_header_path = '"$(PODS_ROOT)/Headers/Public/React-jsinspector"'
  # Pods that transitively include React-Core umbrella and need jsinspector-modern headers
  target_pods = [
    'ExpoModulesCore',
    'React-Core',
    'React-RCTCxxBridge',
    'React-RCTFabric',
    'React-RCTAppDelegate',
    'React-RCTAnimation',
    'React-RCTBlob',
    'React-RCTImage',
    'React-RCTLinking',
    'React-RCTNetwork',
    'React-RCTSettings',
    'React-RCTText',
    'React-RCTVibration',
    'React-RCTWebSocket',
    'React-RCTActionSheet',
    'React-RCTGeolocation',
    'React-RCTPushNotification',
    'React-RCTSafariManager',
    'React-Fabric',
    'React-ImageManager',
    'React-NativeModulesApple',
    'ReactCommon',
    'React-NativeCxxBridgeModules',
    'React-Mapbuffer',
    'React-rendererdebug',
    'React-rncore',
    'React-RuntimeApple',
    'React-RuntimeCore',
    'React-RuntimeHermes',
    'React-RuntimeScheduler',
    'React-bridging',
    'React-callinvoker',
    'React-cxxreact',
    'React-debug',
    'React-defaultsnativemodule',
    'React-featureflags',
    'React-featureflagsnativemodule',
    'React-graphics',
    'React-hermes',
    'React-idlecallbacksnativemodule',
    'React-jsi',
    'React-jsiexecutor',
    'React-jsinspector',
    'React-jsitracing',
    'React-logger',
    'React-microtasksnativemodule',
    'React-nativeconfig',
    'React-nativedebuggeroverlay',
    'React-perflogger',
    'React-performancetimeline',
    'React-rendererconsistency',
    'React-rendererdebug',
    'React-runtimeexecutor',
    'React-runtimescheduler',
    'React-timing',
    'React-utils',
    'Yoga',
  ]
  installer.pods_project.targets.each do |target|
    next unless target_pods.include?(target.name) || target.name.start_with?('Expo')
    target.build_configurations.each do |config|
      existing = config.build_settings['HEADER_SEARCH_PATHS'] || '$(inherited)'
      existing_str = existing.is_a?(Array) ? existing.join(' ') : existing.to_s
      unless existing_str.include?('React-jsinspector')
        if existing.is_a?(Array)
          config.build_settings['HEADER_SEARCH_PATHS'] = existing + [jsinspector_header_path]
        else
          config.build_settings['HEADER_SEARCH_PATHS'] = existing_str + ' ' + jsinspector_header_path
        end
        puts '[withCppFix] v4 Added React-jsinspector to HEADER_SEARCH_PATHS for ' + target.name
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

      // --- FIX 2: jsinspector-modern HEADER_SEARCH_PATHS fix (v4) ---
      if (!content.includes(JSI_MARKER)) {
        const rnPostInstallRegex = /(react_native_post_install\s*\([^)]*\))/s;
        const match = rnPostInstallRegex.exec(content);
        if (match) {
          content = content.replace(match[0], match[0] + '\n' + JSI_PATCH_RUBY);
          console.log('[withCppFix] Inserted jsinspector HEADER_SEARCH_PATHS v4 fix after react_native_post_install.');
        } else {
          const postInstallRegex = /(post_install\s+do\s+\|installer\|)([\s\S]*?)(^end\s*$)/m;
          const piMatch = postInstallRegex.exec(content);
          if (piMatch) {
            content = content.replace(piMatch[0], piMatch[1] + piMatch[2] + JSI_PATCH_RUBY + piMatch[3]);
            console.log('[withCppFix] Inserted jsinspector HEADER_SEARCH_PATHS v4 fix into existing post_install block.');
          } else {
            content += `\npost_install do |installer|\n${JSI_PATCH_RUBY}end\n`;
            console.log('[withCppFix] Created new post_install block with jsinspector v4 fix.');
          }
        }
      } else {
        console.log('[withCppFix] jsinspector v4 fix already present.');
      }

      fs.writeFileSync(podfilePath, content, 'utf-8');
      console.log('[withCppFix] Podfile patched successfully.');
      return config;
    },
  ]);
};

module.exports = withCppFix;
