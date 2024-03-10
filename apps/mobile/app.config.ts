import type { ExpoConfig } from "@expo/config";

const EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const defineConfig = (): ExpoConfig => ({
  name: "Refeed",
  slug: "expo",
  scheme: "refeed",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  userInterfaceStyle: "light",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  jsEngine: "hermes",
  ios: {
    userInterfaceStyle: "light",
    supportsTablet: false,
    jsEngine: "hermes",
    bundleIdentifier: "com.refeed.refeed",
    infoPlist: {
      UIViewControllerBasedStatusBarAppearance: true,
    },
    associatedDomains: ["applinks:readreader.com"],
    buildNumber: "0.8.1",
  },
  android: {
    userInterfaceStyle: "light",
    jsEngine: "hermes",
    package: "com.refeed.refeed",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
  },
  extra: {
    eas: {
      projectId: "e34d9cda-72bb-49aa-be9b-42831dcd0193",
    },
    EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_BACKEND_URL,
  },
  owner: "michaelkremenetsky",
  plugins: [
    ["./utils/target-fix.js"],
    ["expo-apple-authentication"],
    [
      "expo-build-properties",
      {
        // Don't add the unstable_networkInspector for now
        android: {
          newArchEnabled: true, // prob should remove for now
          compileSdkVersion: 33,
          targetSdkVersion: 33,
          minSdkVersion: 23,
          buildToolsVersion: "33.0.0",
          kotlinVersion: "1.8.0",
        },
        ios: {
          deploymentTarget: "15.8",
        },
      },
    ],
  ],
});

export default defineConfig;
