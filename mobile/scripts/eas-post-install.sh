#!/usr/bin/env bash
# eas-post-install.sh
#
# EAS Build lifecycle hook — runs after `npm install` + `expo prebuild` on Android.
# The ubuntu-26.04-jdk-17-ndk-r27b image pre-caches Gradle 9.3.1 in
# $GRADLE_USER_HOME/wrapper/dists and the EAS worker invokes that cached
# binary instead of downloading the version specified in gradle-wrapper.properties.
# Gradle 9.3.1 crashes the Kotlin compiler when analysing
# @react-native/gradle-plugin 0.79.x (ReactSettingsExtension.kt:35).
#
# Fix: after prebuild writes gradle-wrapper.properties, force the distributionUrl
# to gradle-8.13-bin.zip (the version @react-native/gradle-plugin 0.79.6 ships)
# and nuke the 9.3.1 cache so the wrapper is forced to use 8.13.

set -euo pipefail

if [[ "${EAS_BUILD_PLATFORM:-}" != "android" ]]; then
  echo "[eas-post-install] Not an Android build — skipping Gradle wrapper pin."
  exit 0
fi

WRAPPER_PROPS="android/gradle/wrapper/gradle-wrapper.properties"

if [[ ! -f "$WRAPPER_PROPS" ]]; then
  echo "[eas-post-install] WARNING: $WRAPPER_PROPS not found — prebuild may not have run yet."
  exit 0
fi

TARGET_URL="https\\://services.gradle.org/distributions/gradle-8.13-bin.zip"

echo "[eas-post-install] Pinning gradle-wrapper.properties to gradle-8.13-bin.zip"
sed -i "s|^distributionUrl=.*|distributionUrl=${TARGET_URL}|" "$WRAPPER_PROPS"
echo "[eas-post-install] Result:"
grep "distributionUrl" "$WRAPPER_PROPS"

# Remove any pre-cached Gradle 9.x distribution so the wrapper is forced
# to download and use 8.13 instead.
GRADLE_CACHE="${GRADLE_USER_HOME:-$HOME/.gradle}/wrapper/dists"
if [[ -d "$GRADLE_CACHE" ]]; then
  echo "[eas-post-install] Removing cached Gradle distributions from: $GRADLE_CACHE"
  find "$GRADLE_CACHE" -maxdepth 1 -name "gradle-9*" -exec rm -rf {} + 2>/dev/null || true
  echo "[eas-post-install] Remaining distributions:"
  ls "$GRADLE_CACHE" 2>/dev/null || echo "  (empty)"
fi

echo "[eas-post-install] Done."
