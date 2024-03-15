import React, { useCallback, useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { getHeaderTitle } from "@react-navigation/elements";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { Session } from "@supabase/auth-helpers-react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Provider as JotaiProvider } from "jotai";
import { HeaderButtonsProvider } from "react-navigation-header-buttons";

import CustomDrawer from "./components/drawer/CustomDrawer";
import { LoadingProvider } from "./components/drawer/LoadingContext";
import { SpinnerOverlay } from "./components/drawer/SpinnerOverlay";
import Reader from "./components/reader/Reader";
import Settings from "./components/settings/Settings";
import { SignedOutView } from "./components/SignedOutView";
import Tabs from "./components/Tabs";
import type { NavigatorParams } from "./lib/navTypes";
import { AndroidLightTheme, lightTheme } from "./lib/themes";
import { supabase } from "./utils/supabase";
import { TRPCProvider } from "./utils/trpc";

const Stack = createNativeStackNavigator<NavigatorParams>();
const Drawer = createDrawerNavigator();

SplashScreen.preventAutoHideAsync();

export const Navigation = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Payments are disabled on mobile for now
        // if (__DEV__) {
        //   Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        // }
        // if (Platform.OS == "ios") {
        //   Purchases.configure({
        //     apiKey: Constants.expoConfig?.extra?.IOS_REVENUE_CAT_KEY as string,
        //   });
        // } else if (Platform.OS == "android") {
        //   Purchases.configure({
        //     apiKey: Constants.expoConfig?.extra
        //       ?.ANDROID_REVENUE_CAT_KEY as string,
        //   });
        // }

        await supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const [session, setSession] = useState<Session | null>(null);

  const navigationRef = useNavigationContainerRef();

  if (!appIsReady) {
    return null;
  }

  const CommonNavigator = () => (
    <Stack.Navigator
      screenOptions={
        Platform.OS == "ios"
          ? {
              fullScreenGestureEnabled: true,
            }
          : {
              fullScreenGestureEnabled: true,
              header: (props) => <AndroidNavigationBar {...props} />,
              headerShown: true,
            }
      }
    >
      {session ? (
        <>
          <Stack.Screen
            name="Drawer"
            component={DrawerNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Item"
            component={Reader}
            options={{
              title: "",
              headerShadowVisible: true,
              headerStyle: {
                backgroundColor: "#FEFEFE",
              },
              customAnimationOnGesture: true,
              animationDuration: 150,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          {/** Payments are disabled on mobile for now */}
          {/* <Stack.Screen
            name="Upgrade"
            component={Upgrade}
            options={{
              headerShown: Platform.OS == "android" ? true : false,
              gestureDirection: "vertical",
            }}
          /> */}
        </>
      ) : (
        <Stack.Screen
          name="SignedOutView"
          component={SignedOutView}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );

  return (
    <JotaiProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
          {Platform.OS === "ios" ? (
            <TRPCProvider>
              <SessionContextProvider supabaseClient={supabase}>
                <NavigationContainer ref={navigationRef} theme={lightTheme}>
                  <HeaderButtonsProvider stackType="native">
                    <CommonNavigator />
                  </HeaderButtonsProvider>
                </NavigationContainer>
              </SessionContextProvider>
            </TRPCProvider>
          ) : (
            <PaperProvider theme={AndroidLightTheme}>
              <NavigationContainer
                ref={navigationRef}
                // @ts-ignore
                theme={AndroidLightTheme}
              >
                <HeaderButtonsProvider stackType="native">
                  <CommonNavigator />
                </HeaderButtonsProvider>
              </NavigationContainer>
            </PaperProvider>
          )}
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </JotaiProvider>
  );
};

export const Start = () => {
  // We need to load the trpc part first so that it can prefetch the items
  return (
    <LoadingProvider>
      <TRPCProvider>
        <SessionContextProvider supabaseClient={supabase}>
          <Navigation />
        </SessionContextProvider>
      </TRPCProvider>
      <SpinnerOverlay />
    </LoadingProvider>
  );
};

export function AndroidNavigationBar({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) {
  const title = getHeaderTitle(options, route.name);
  return (
    <Appbar.Header elevated>
      {back ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : (navigation as any).openDrawer ? (
        <Appbar.Action
          icon="menu"
          isLeading
          onPress={() =>
            (
              navigation as any as DrawerNavigationProp<NonNullable<unknown>>
            ).openDrawer()
          }
        />
      ) : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

const DrawerNavigator = () => {
  const { width } = useWindowDimensions();

  return (
    <Drawer.Navigator
      drawerContent={() => <CustomDrawer />}
      screenOptions={{
        swipeEdgeWidth: width * 0.2,
        headerShown: false,
        drawerStyle: {
          width: width * 0.75,
        },
        drawerType: "slide",
        overlayColor: "rgba(0, 0, 0, 0.1)",
        /* lazy: false, Forced to load lazy for now as it causes it to rerender 
            everytime you navigate to a new screen otherwise */
      }}
      detachInactiveScreens={false}
    >
      <Drawer.Screen
        name="Tabs"
        options={{
          lazy: false,
        }}
        // @ts-ignore
        component={Tabs}
      />
    </Drawer.Navigator>
  );
};
