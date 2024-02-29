import React, { memo, useCallback, useEffect } from "react";
import { FlatList, Platform, useWindowDimensions } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import Animated, { useSharedValue } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Skeleton } from "moti/skeleton";

import { useItemData } from "@refeed/features/item/useItemDataMobile";
import type { ItemType } from "@refeed/types/item";

import { useMarkReadOnScroll } from "../../features/useMarkReadOnScroll";
import { useUpdateFeeds } from "../../features/useUpdateFeeds";
import type { FeedProps, FeedType } from "../../lib/navTypes";
import { trimTitle } from "../../lib/trimTitle";
import { trpc } from "../../utils/trpc";
import { useLoading } from "../drawer/LoadingContext";
import { FeedGraphic } from "../graphics/FeedGraphic";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { DateInfo } from "./DateInfo";
import { FeedNavigationBar } from "./FeedNavigationBar";
import { MagazineItem } from "./MagazineItem";

dayjs.extend(relativeTime);

export const FeedLayout = ({ route, navigation }: FeedProps) => {
  const { feedId, type, title } = route.params as {
    feedId: string;
    type: FeedType;
    title?: string;
  };
  const { setLoading } = useLoading();

  const {
    items,
    isFetching,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useItemData();

  const { markRead } = useUpdateFeeds(items);

  useFocusEffect(
    useCallback(() => {
      const navTitle =
        type == "one" || type == "discover" || type == "multiple"
          ? title
          : type == "all"
            ? "All Feeds"
            : type == "recentlyread"
              ? "Recently Read"
              : type == "bookmarks"
                ? "Bookmarks"
                : undefined;

      if (Platform.OS == "ios") {
        navigation.setOptions({
          // Max length of 30 letters long to prevent clipping
          title: trimTitle(navTitle, 30),
        });
      }
      if (Platform.OS == "android") {
        navigation.setOptions({
          header: (props: NativeStackHeaderProps) => (
            <FeedNavigationBar title={navTitle} {...props} />
          ),
        });
      }
    }, [feedId, type, title]),
  );

  const onLayoutLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const scrollY = useSharedValue(0);
  const { handleScroll } = useMarkReadOnScroll(scrollY);

  const { width } = useWindowDimensions();

  return (
    <Animated.View
      onLayout={onLayoutLoad}
      className="flex h-full w-full border-t border-[#f0f0f0]"
    >
      {!isPending && !isFetching && items.length == 0 ? (
        <View className="flex h-full items-center justify-center">
          <FeedGraphic />
          <Text className="mt-2 text-base font-semibold">
            Your All Caught Up
          </Text>
          <Text className="mt-3 text-base text-neutral-500">
            {type == "bookmarks"
              ? "Bookmark items to see them in here"
              : type == "recentlyread"
                ? "Read items to see them in here"
                : "Add more feeds in the Feeds Tab"}
          </Text>
        </View>
      ) : null}
      {!isPending ? (
        <FlatList
          // Going to use FlatList till I figure why it renders the second page on initial render
          refreshing={isFetching}
          onScroll={handleScroll}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onRefresh={() => refetch()}
          data={items}
          scrollEnabled={items?.length !== 0}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          showsHorizontalScrollIndicator={false}
          scrollIndicatorInsets={{
            top: 3,
            bottom: 3,
          }}
          onEndReachedThreshold={0.2}
          removeClippedSubviews={true}
          onEndReached={() => {
            if (items?.length % 25 === 0) {
              fetchNextPage();
            }
          }}
          scrollEventThrottle={16}
          ListHeaderComponent={<View className="pt-2" />}
          ListFooterComponent={
            <>
              {!isPending && !isFetchingNextPage ? (
                <Text className="pb-4 text-[#a3a3a3]">End Reached</Text>
              ) : null}
            </>
          }
          ListFooterComponentStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          renderItem={(p) => (
            <>
              {type != "recentlyread" && type != "bookmarks" && (
                <DateInfo i={p.index} items={items} />
              )}
              <MagazineItem
                feedId={feedId}
                FeedType={type}
                i={p.index}
                item={p.item}
                markRead={() => markRead(p.item)}
              />
            </>
          )}
        />
      ) : (
        <>
          <View className="w-full flex-1 items-center">
            {isFetching &&
              [...Array(3)].map((_, i) => (
                <View key={i} className="mt-3">
                  <Skeleton
                    colorMode="light"
                    backgroundColor="#f0f0f0"
                    radius={6}
                    height={70}
                    width={width * 0.9}
                  />
                </View>
              ))}
          </View>
        </>
      )}
    </Animated.View>
  );
};

export const BookmarkLayout = memo(() => {
  const { items, isFetching, isPending, fetchNextPage, refetch } =
    useItemData();

  const TempBookmarks = trpc.bookmark.checkTempBookmarks.useMutation();
  const { markRead } = useUpdateFeeds(items);

  useEffect(() => {
    TempBookmarks.mutate();
  }, []);

  // TODO: Replace the graphic here with a search specifc graphic or add recently searched
  return (
    <View className="flex h-full w-full border-t border-[#f0f0f0]">
      {!isPending && !isFetching && items.length == 0 ? (
        <View className="flex h-full items-center justify-center">
          <FeedGraphic />
          <Text className="mt-2 text-base font-semibold">
            Your All Caught Up
          </Text>
          <Text className="mt-3 text-base text-neutral-500">
            Add more bookmarks to see them in here
          </Text>
        </View>
      ) : null}
      <FlatList
        refreshing={isFetching}
        onRefresh={() => {
          refetch();
        }}
        data={items}
        scrollEnabled={items?.length !== 0}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsHorizontalScrollIndicator={false}
        scrollIndicatorInsets={{
          top: 3,
          bottom: 3,
        }}
        onEndReachedThreshold={0.2}
        removeClippedSubviews={true}
        onEndReached={() => {
          if (items?.length % 25 === 0) {
            fetchNextPage();
          }
        }}
        scrollEventThrottle={16}
        ListHeaderComponent={<View className="pt-2" />}
        ListFooterComponentStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        renderItem={(p) => (
          <>
            <MagazineItem
              FeedType="bookmarks"
              i={p.index}
              item={p.item}
              markRead={() => markRead(p.item)}
            />
          </>
        )}
      />
    </View>
  );
});

export const SearchLayout = memo(
  ({
    searchQuery,
    markRead,
  }: {
    searchQuery: string;
    markRead: (item: ItemType) => void;
  }) => {
    const { data: items } =
      trpc.item.searchMultipleItemsWithFormatting.useQuery(
        { query: searchQuery, take: 10 },
        { enabled: searchQuery != undefined },
      );

    return (
      <View className="mt-[100px] h-full w-full flex-1">
        <KeyboardAwareFlatList
          data={items}
          scrollEnabled={items?.length !== 0}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          showsHorizontalScrollIndicator={false}
          scrollIndicatorInsets={{
            top: 3,
            bottom: 3,
          }}
          onEndReachedThreshold={0.2}
          removeClippedSubviews={true}
          scrollEventThrottle={16}
          ListHeaderComponent={<View className="pt-2" />}
          ListFooterComponentStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          renderItem={(p) => (
            <>
              <MagazineItem
                FeedType="search"
                searchQuery={searchQuery}
                i={p.index}
                // @ts-ignore
                item={p.item}
                markRead={() => markRead(p.item)}
              />
            </>
          )}
        />
      </View>
    );
  },
);
