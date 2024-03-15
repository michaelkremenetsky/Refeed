import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import * as AppleAuthentication from "expo-apple-authentication";
import { Mail } from "lucide-react-native";

import { useAuth } from "../features/useAuth";
import { extractCodeFromUrl } from "../utils/extractCodeFromUrl";
import { supabase } from "../utils/supabase";
import { Text } from "./ui/Text";
import { View } from "./ui/View";

export const SignedOutView = () => {
  const {
    setLoading,
    loadLoggedInScreen,
    signInWithOtp,
    signInWithApple,
    signInWithGoogle,
  } = useAuth();
  const [signUp, setSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);

  useEffect(() => {
    async function handleDeepLink(event: { url: string }) {
      const url = event.url;

      if (url != null) {
        const code = extractCodeFromUrl(url);

        if (code) {
          try {
            await supabase.auth.exchangeCodeForSession(code);
            loadLoggedInScreen();
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        }
      }
    }

    Linking.addEventListener("url", (e) => {
      setLoading(true);
      if (e.url) {
        handleDeepLink(e).then(() => setLoading(false));
      }
    });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#FCFCFC]"
    >
      <View className="mt-16" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingTop: 50,
        }}
      >
        <View className="mb-4 flex items-center font-extrabold">
          <Text className="text-2xl font-bold tracking-tight">
            {" "}
            {signUp ? "Sign Up" : "Login"}
          </Text>
          <View className="mt-2 flex flex-row">
            <Text className="text-base font-medium text-neutral-700">
              {!signUp ? "Don't have an Account?" : "Already have an Account?"}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSignUp((prev) => !prev);
              }}
            >
              <Text className="text-base font-medium text-neutral-400">
                {!signUp ? "Sign Up" : "Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex justify-end px-4 pb-20">
          {Platform.OS === "ios" ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                !signUp
                  ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                  : AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              className="h-14"
              cornerRadius={8}
              onPress={() => {
                signInWithApple();
              }}
            />
          ) : null}
          <TouchableOpacity
            onPress={() => {
              signInWithGoogle();
            }}
            className="mt-4 rounded-lg border border-neutral-300/80 bg-white py-3"
          >
            <SignInWithGoogleButton signUp={signUp} />
          </TouchableOpacity>
          {emailOpen && (
            <TextInput
              className="mt-4 h-12 rounded-lg border border-neutral-200 bg-[#FCFCFC] p-2 text-base text-neutral-700"
              // TODO: Fix the centering of the text input
              style={{
                textAlign: "left",
              }}
              value={email}
              autoCapitalize="none"
              onChangeText={(e) => setEmail(e)}
              placeholder="Email"
            />
          )}
          <TouchableOpacity
            onPress={() => {
              if (emailOpen) {
                signInWithOtp(email, signUp ? "Sign Up" : "Login");
              } else {
                setEmailOpen(true);
              }
            }}
            className="mt-4 rounded-lg border border-neutral-300/80 bg-white py-3"
          >
            <SignInWithEmail signUp={signUp} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const SignInWithGoogleButton = ({ signUp }: { signUp: boolean }) => {
  return (
    <View className="h-7.5 flex flex-row items-center justify-center">
      <Svg className="mr-2 h-4 w-4" viewBox="0 0 186.69 190.5">
        <Path
          fill="#4285f4"
          d="M95.25 77.932v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
        />
        <Path
          fill="#34a853"
          d="m41.869 113.38-6.972 5.337-24.679 19.223c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
        />
        <Path
          fill="#fbbc05"
          d="M10.218 52.561C3.724 65.376.001 79.837.001 95.25s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
        />
        <Path
          fill="#ea4335"
          d="M95.25 37.927c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276C142.442 9.439 120.968 0 95.25 0 58.016 0 25.891 21.388 10.218 52.561L41.91 77.153c7.533-22.514 28.575-39.226 53.34-39.226z"
        />
      </Svg>
      <Text className="text-lg font-semibold">
        {!signUp ? "Sign In With Google" : "Sign Up With Google"}
      </Text>
    </View>
  );
};

const SignInWithEmail = ({ signUp }: { signUp: boolean }) => {
  return (
    <View className="h-7.5 flex flex-row items-center justify-center">
      <Mail stroke="#a3a3a3" className="mr-2 h-4 w-4" />
      <Text className="text-lg font-semibold">
        {!signUp ? "Sign In With Email" : "Sign Up With Email"}
      </Text>
    </View>
  );
};
