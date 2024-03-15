import { Alert } from "react-native";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { useLoading } from "../components/drawer/LoadingContext";
import { initiateAppleSignIn } from "../utils/auth";
import { EXPO_PUBLIC_SUPABASE_URL } from "../utils/env";
import { supabase } from "../utils/supabase";
import { trpc } from "../utils/trpc";

export const useAuth = () => {
  const Supabase = useSupabaseClient();
  const utils = trpc.useUtils();
  const { setLoading } = useLoading();

  const loadLoggedInScreen = () => {
    // Invalidate all the state from the last account when logging in with a new one
    utils.invalidate();
  };

  const signInWithOtp = async (email: string, type: "Login" | "Sign Up") => {
    // Remember in order for this work you have to configure the Redirect URLs in the Supabase Dashboard
    setLoading(true);

    const { error } = await Supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: "refeed://login",
      },
    });

    if (!error && type == "Sign Up") {
      Alert.alert("Error", "Check Your Email!");
    }
    if (error) return Alert.alert("Error", error.message);

    setLoading(false);

    loadLoggedInScreen();
  };

  const signInWithApple = async () => {
    setLoading(true);

    const { token, nonce } = await initiateAppleSignIn();
    const { error } = await Supabase.auth.signInWithIdToken({
      provider: "apple",
      token,
      nonce,
    });
    if (error) {
      setLoading(false);
      return Alert.alert("Error", error.message);
    }

    loadLoggedInScreen();
  };

  const signInWithAppleOnAndroid = async () => {
    // Remember in order for this work you have to configure the Redirect URLs in the Supabase Dashboard
    setLoading(true);

    try {
      const redirectUri = "refeed://login";
      const provider = "Apple";
      const response = await WebBrowser.openAuthSessionAsync(
        `${EXPO_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectUri}`,
        redirectUri,
        {},
      );

      if (response.type === "success") {
        const url = response.url;
        const params = url.split("#")[1];
        const accessToken = params?.split("&")[0]?.split("=")[1];
        const refreshToken = params?.split("&")[2]?.split("=")[1];

        const { error } = await Supabase.auth.setSession({
          access_token: accessToken!,
          refresh_token: refreshToken!,
        });
        if (error) {
          Alert.alert("Error", error.message);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Issue with Google Auth try again");
    } finally {
      WebBrowser.maybeCompleteAuthSession();
    }
    WebBrowser.maybeCompleteAuthSession();

    loadLoggedInScreen();
  };

  const signInWithGoogle = async () => {
    // Remember in order for this work you have to configure the Redirect URLs in the Supabase Dashboard
    setLoading(true);

    try {
      const redirectUri = "refeed://login";
      const provider = "google";
      const response = await WebBrowser.openAuthSessionAsync(
        `${EXPO_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectUri}`,
        redirectUri,
      );

      if (response.type === "success") {
        const url = response.url;
        const params = url.split("#")[1];
        const accessToken = params?.split("&")[0]?.split("=")[1];
        const refreshToken = params?.split("&")[2]?.split("=")[1];

        const { error } = await Supabase.auth.setSession({
          // You can export data from this if you need it.
          access_token: accessToken!,
          refresh_token: refreshToken!,
        });
        if (error) {
          Alert.alert("Error", error.message);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Issue with Google Auth try again");
    } finally {
      WebBrowser.maybeCompleteAuthSession();
    }
    WebBrowser.maybeCompleteAuthSession();

    loadLoggedInScreen();
  };

  // Not using this but keeping it here for reference
  const signInWithPassword = async (
    email: string,
    password: string,
    type: "Login" | "Sign Up",
  ) => {
    setLoading(true);

    const { error } =
      type == "Sign Up"
        ? await Supabase.auth.signUp({
            email,
            password,
          })
        : await Supabase.auth.signInWithPassword({
            email,
            password,
          });

    if (!error && type == "Sign Up") {
      Alert.alert("Error", "Check Your Email!");
    }
    if (error) return Alert.alert("Error", error.message);

    loadLoggedInScreen();
  };

  return {
    setLoading,
    loadLoggedInScreen,
    signInWithOtp,
    signInWithPassword,
    signInWithGoogle,
    signInWithApple,
    signInWithAppleOnAndroid,
  };
};

export const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token: refresh_token!,
  });
  if (error) throw error;
  return data.session;
};
