module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // 👇 this is required for expo-router
      "expo-router/babel",

      // keep your existing reanimated plugin last
      "react-native-reanimated/plugin",
    ],
  };
};
