import React, { useRef } from "react";
import { Platform } from "react-native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { SFSymbol } from "react-native-sfsymbols";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerActions } from "@react-navigation/native";
import { useAtomValue } from "jotai";

import { sortAtom } from "@refeed/atoms/feedsAtom";

import useCustomColorScheme from "../lib/hooks/useCustomColorScheme";
import {
  BookmarkIconTabBar,
  DiscoverIcon,
  InboxIcon,
  SearchIconTabBar,
} from "../lib/Icons";
import type { TabProps } from "../lib/navTypes";
import { trpc } from "../utils/trpc";
import { Discover } from "./discover/DiscoverLayout";
import { DiscoverStack } from "./discover/DiscoverStack";
import { BookmarkStack, FeedStack } from "./feed/FeedStacks";
import { Search } from "./search/Search";
import { AddFeedRefContext } from "./sheet/AddFeedRefContext";
import { AddFeedSheet } from "./sheet/AddFeedSheet";

const Tabs = ({ navigation }: TabProps) => {
  const colorScheme = useCustomColorScheme();
  const utils = trpc.useUtils();
  const Sort = useAtomValue(sortAtom);

  // Prefetch queries on startup to make app feel more snappy
  const [all, order, folders, plan] = trpc.useQueries((t) => [
    t.item.getUnreadItems({
      amount: 25,
      sort: Sort,
      type: "all",
      feed_id: undefined,
      folder: undefined,
    }),
    t.feed.getFeedOrder(),
    t.feed.getFeedsInFolders(),
    t.pro.getUser(),
  ]);

  // This one dosen't need to be instantly loaded
  utils.item.getUnreadItems.prefetchInfinite({
    amount: 25,
    sort: Sort,
    type: "bookmarks",
    feed_id: undefined,
    folder: undefined,
  });

  const loaded =
    all.isFetched && order.isFetched && folders.isFetched && plan.isFetched;

  const addFeedModalRef = useRef<BottomSheetModal>(null);

  if (Platform.OS === "android" && loaded) {
    const Tab = createMaterialBottomTabNavigator();

    // TODO - Android
    // Fix Android specfic settings
    // detachInactiveScreens?
    return (
      <>
        <Tab.Navigator shifting={false}>
          <Tab.Screen
            name="Feed"
            component={FeedStack}
            listeners={{
              tabPress: () => {
                navigation.dispatch(DrawerActions.openDrawer());
              },
            }}
            options={{
              title: "Inbox",
              tabBarIcon: ({ focused }: { focused: boolean }) =>
                focused == true ? (
                  <InboxIcon selected={true} />
                ) : (
                  <InboxIcon selected={false} />
                ),
            }}
          />
          <Tab.Screen
            name="Bookmarks"
            component={BookmarkStack}
            initialParams={{ type: "bookmarks" }}
            options={{
              title: "Bookmarks",
              tabBarIcon: ({ focused }: { focused: boolean }) =>
                focused == true ? (
                  <BookmarkIconTabBar selected={true} />
                ) : (
                  <BookmarkIconTabBar selected={false} />
                ),
            }}
          />
          <Tab.Screen
            name="Discover"
            component={Discover}
            options={{
              title: "Discover",
              tabBarIcon: ({ focused }: { focused: boolean }) =>
                focused == true ? (
                  <DiscoverIcon selected={true} />
                ) : (
                  <DiscoverIcon selected={false} />
                ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={Search}
            options={{
              title: "Search",
              tabBarIcon: ({ focused }: { focused: boolean }) =>
                focused == true ? (
                  <SearchIconTabBar selected={true} />
                ) : (
                  <SearchIconTabBar selected={false} />
                ),
            }}
          />
        </Tab.Navigator>
      </>
    );
  }

  if (Platform.OS === "ios" && loaded) {
    const Tab = createBottomTabNavigator();
    return (
      <BottomSheetModalProvider>
        <AddFeedRefContext.Provider value={addFeedModalRef}>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: colorScheme == "dark" ? "black" : "#FCFCFC",
                borderTopColor: "#ededed",
                borderTopWidth: 1,
              },
              lazy: false,
              headerShown: false,
              tabBarShowLabel: false,
              tabBarActiveTintColor: "#0B7ED0",
              tabBarInactiveTintColor: "#9c9ca5",
              tabBarLabelStyle: {
                fontFamily: "System",
                fontWeight: "500",
              },
            }}
            sceneContainerStyle={{ backgroundColor: "transparent" }}
            detachInactiveScreens={false}
            initialRouteName="Inbox"
          >
            <Tab.Screen
              name="Inbox"
              component={FeedStack}
              listeners={{
                tabPress: () => {
                  navigation.dispatch(DrawerActions.openDrawer());
                },
              }}
              options={{
                tabBarLabel: "Inbox",
                unmountOnBlur: false,
                tabBarIcon: ({ focused }: { focused: boolean }) => (
                  <SFSymbol
                    name="command"
                    weight="regular"
                    scale="large"
                    color={focused ? "#0B7ED0" : "#9c9ca5"}
                    size={18.5}
                    multicolor={false}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Bookmarks"
              component={BookmarkStack}
              options={{
                title: "Bookmarks",
                headerShown: false,
                unmountOnBlur: false,
                tabBarIcon: ({ focused }: { focused: boolean }) => (
                  <SFSymbol
                    name="book"
                    weight="regular"
                    scale="large"
                    color={focused ? "#0B7ED0" : "#9c9ca5"}
                    size={18.5}
                    multicolor={false}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Feeds"
              component={DiscoverStack}
              options={{
                title: "Feeds",

                tabBarIcon: ({ focused }: { focused: boolean }) => (
                  <SFSymbol
                    name="plus.app"
                    weight="regular"
                    scale="large"
                    size={18.5}
                    color={focused ? "#0B7ED0" : "#9c9ca5"}
                    multicolor={false}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="SearchTab"
              component={Search}
              options={{
                title: "Search",
                tabBarIcon: ({ focused }: { focused: boolean }) => (
                  <SFSymbol
                    name="magnifyingglass"
                    weight="regular"
                    scale="large"
                    size={18.5}
                    color={focused ? "#0B7ED0" : "#9c9ca5"}
                    multicolor={false}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </AddFeedRefContext.Provider>
        <AddFeedSheet addFeedModalRef={addFeedModalRef} />
      </BottomSheetModalProvider>
    );
  }
};

export default Tabs;
