const path = require("path");
const loadConfig = require("tailwindcss/loadConfig");

/** @type {import("tailwindcss").Config | null} */
let _tailwindConfig = null;
/**
 * Transpiles tailwind.config.ts for babel
 * Fix until nativewind babel plugin supports tailwind.config.ts files
 */
function lazyLoadConfig() {
  return (
    _tailwindConfig ?? loadConfig(path.join(__dirname, "tailwind.config.ts"))
  );
}

/** @type {import("@babel/core").ConfigFunction} */
module.exports = function (api) {
  api.cache.forever();

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["nativewind/babel", { tailwindConfig: lazyLoadConfig() }],
      "react-native-paper/babel",
    ],
    // For now
    /* env: {
      production: {
        plugins: ["transform-remove-console"],
      },
    }, */
  };
};

// You can add "react-native-paper/babel" back when you add android, also add code to check if the Platform is android and only add it then
