import Constants from "expo-constants";

// Switch back to hard coded values if this causes issues

export const EXPO_PUBLIC_SUPABASE_URL = Constants.expoConfig?.extra
  ?.EXPO_PUBLIC_SUPABASE_URL as string;
export const EXPO_PUBLIC_SUPABASE_ANON_KEY = Constants.expoConfig?.extra
  ?.EXPO_PUBLIC_SUPABASE_URL as string;
export const EXPO_PUBLIC_BACKEND_URL = Constants.expoConfig?.extra
  ?.EXPO_PUBLIC_BACKEND_URL as string;
