import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Plus } from "lucide-react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { trpc } from "../../utils/trpc";
import { HeaderButtonIcon } from "../reader/Header/HeaderButtonIcon";
import { cupertinoColor, CupertinoList } from "../ui/CupertinoList";
import { View } from "../ui/View";
import { DiscoverStack } from "./DiscoverStack";

// NOTE: This file is not in use for now, will most likely move into settings menu

const Stack = createNativeStackNavigator();

export const FeedsStack = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedsStack"
        options={{
          headerTitle: "Feeds",
          headerShadowVisible: false,
          headerTintColor: "#292929",
          headerStyle: {
            backgroundColor: "#FEFEFE",
          },
          headerShown: true,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButtonIcon}>
              <Item
                title="search"
                iconName="search"
                IconComponent={() => (
                  <TouchableOpacity
                    // @ts-ignore
                    onPress={() => navigation.navigate("Discovery", {})}
                  >
                    <Plus strokeWidth={1.5} stroke="#a3a3a3" />
                  </TouchableOpacity>
                )}
              />
            </HeaderButtons>
          ),
        }}
        component={Feeds}
      />
      <Stack.Screen
        name="Discovery"
        options={{
          headerTitle: "Discover",
          headerShadowVisible: false,
          headerTintColor: "#292929",
          headerStyle: {
            backgroundColor: "#FEFEFE",
          },
          headerShown: true,
        }}
        component={DiscoverStack}
      />
    </Stack.Navigator>
  );
};

const Feeds = () => {
  const { data: rawUserFeeds } = trpc.feed.getAllUserFeeds.useQuery();

  const userFeeds = rawUserFeeds?.map((feed) => {
    return {
      title: feed.title,
      icon: feed.logo_url,
      id: feed.id,
    };
  });

  if (userFeeds) {
    return (
      <BottomSheetModalProvider>
        <View
          style={{ flex: 1 }}
          className="border-t border-[#ededed] bg-white"
        >
          <CupertinoList
            // @ts-ignore
            className="pt-2"
            data={userFeeds}
            style={{
              flex: 1,
              backgroundColor: cupertinoColor(
                "systemGroupedBackgroundColor",
                "#FCFCFC",
              ),
            }}
          />
        </View>
      </BottomSheetModalProvider>
    );
  }
};
