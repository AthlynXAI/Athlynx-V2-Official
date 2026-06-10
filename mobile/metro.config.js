const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution for modern ESM packages
// This fixes modules like copy-anything that use exports without a main field
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
