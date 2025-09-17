// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Required for expo-router v5 (and other ESM deps)
  config.resolver.unstable_enablePackageExports = true;

  return config;
})();
