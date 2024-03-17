import React, { useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useUser } from "@refeed/features/hooks/useUser";
import type { ItemType } from "@refeed/types/item";

import { useUpdateFeeds } from "../../features/useUpdateFeeds";
import type { NavigatorParams } from "../../lib/navTypes";
import { trpc } from "../../utils/trpc";
import { SearchLayout } from "../feed/FeedLayout";
import { FeedGraphic } from "../graphics/FeedGraphic";
import { Text } from "../ui/Text";

dayjs.extend(relativeTime);

const Stack = createNativeStackNavigator();

export const Search = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#ffffff" },
        }}
        component={SearchScreen}
      />
    </Stack.Navigator>
  );
};

export const SearchScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<NavigatorParams>>();

  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const utils = trpc.useUtils();
  const { plan } = useUser();

  const { data: search } = trpc.item.searchMultipleItems.useQuery(
    { query: searchText!, take: 10, plan: plan as "free" | "pro" },
    { enabled: searchText != undefined },
  );

  const { markRead } = useUpdateFeeds(search as unknown as ItemType[]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search",
        hideWhenScrolling: false,
        // autoFocus: true only works for android, figure out ios later
        autoFocus: true,
        onClose: () => {
          setSearchText(undefined);
          utils.item.searchMultipleItems.reset();
          utils.item.searchMultipleItemsWithFormatting.reset();
        },
        onCancelButtonPress: () => {
          setSearchText(undefined);
          utils.item.searchMultipleItems.reset();
          utils.item.searchMultipleItemsWithFormatting.reset();
        },

        onChangeText: (text) => {
          setSearchText(text.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  return (
    <View className={`h-full w-full flex-1`}>
      {searchText == undefined || searchText == "" ? (
        <View className="flex h-full items-center justify-center">
          <FeedGraphic />
          <Text className="mt-4 text-base font-semibold">No Results</Text>
          <Text className="mt-3 text-base text-neutral-500">
            Add more feeds in the Feeds Tab
          </Text>
        </View>
      ) : null}
      <SearchLayout searchQuery={searchText!} markRead={markRead} />
    </View>
  );
};
