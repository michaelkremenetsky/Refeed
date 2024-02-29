import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";
import {
  DrawerActions,
  useNavigation as useNavigationNative,
} from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import * as DropdownMenu from "zeego/dropdown-menu";

import { DownIcon } from "../../lib/Icons";
import type { NavigatorParams } from "../../lib/navTypes";
import { trpc } from "../../utils/trpc";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { SpinningCircle } from "./SpinningCircle";

export const AccountDropdown = () => {
  const Supabase = useSupabaseClient();
  const user = useUser();
  const utils = trpc.useUtils();

  const [isInProcessOfLoggingOut, setIsInProcessOfLoggingOut] = useState(false);
  const navigation =
    useNavigationNative<StackNavigationProp<NavigatorParams>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsInProcessOfLoggingOut(false);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <TouchableOpacity>
            <View className="flex cursor-pointer flex-row rounded-lg px-2 py-1">
              <View className="ml-1 h-8 w-8 cursor-pointer rounded-[4px] bg-[#0496FF]/80">
                <Text className="translate-y-2 text-center text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="flex w-[77%] flex-row">
                <Text
                  numberOfLines={1}
                  className="mt-2 pl-2 text-[15px] font-[500] leading-4"
                >
                  {user?.user_metadata.full_name ?? user?.email ?? ""}
                </Text>
                <DownIcon className="ml-2 mt-1" />
              </View>
            </View>
          </TouchableOpacity>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onSelect={() => {
              navigation.navigate("Settings");
            }}
            key="settings"
          >
            <DropdownMenu.ItemTitle>Settings</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          {/* Payments are disabled on mobile for now */}
          {/*           <DropdownMenu.Item
            onSelect={() => {
              navigation.navigate("Upgrade");
            }}
            key="upgrade"
          >
            <DropdownMenu.ItemTitle>Upgrade</DropdownMenu.ItemTitle>
          </DropdownMenu.Item> */}
          <DropdownMenu.Item
            onSelect={() => {
              requestAnimationFrame(() => {
                navigation.dispatch(DrawerActions.closeDrawer());
              });
              navigation.navigate("Feed", {
                screen: "Inbox",
                type: "recentlyread",
              });
            }}
            key="recentlyread"
          >
            <DropdownMenu.ItemTitle>Recently Read</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => {
              setIsInProcessOfLoggingOut(true);
              Supabase.auth.signOut();
              utils.invalidate();
            }}
            key="Sign Out"
          >
            <DropdownMenu.ItemTitle>Sign Out</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {isInProcessOfLoggingOut && (
        <Spinner
          visible={isInProcessOfLoggingOut}
          customIndicator={<SpinningCircle />}
          textStyle={{ color: "#FFF" }}
        />
      )}
    </>
  );
};
