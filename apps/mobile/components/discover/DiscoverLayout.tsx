import React, { useContext, useLayoutEffect, useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { LinearTransition } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSetAtom } from "jotai";

import {
  BusinessDiscoverItems,
  ScienceDiscoverItems,
  TechDiscoverFeeds,
} from "@refeed/lib/DiscoveryFeeds";
import { useDebounce } from "@refeed/lib/useDebounce";

import type { NavigatorParams } from "../../lib/navTypes";
import type { TODO } from "../../lib/todoType";
import { trpc } from "../../utils/trpc";
import { addFeedLinkAtom, AddFeedRefContext } from "../sheet/AddFeedRefContext";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { CustomCard } from "./CustomCard";

const DiscoveryFeeds = [
  { feeds: TechDiscoverFeeds, name: "Tech" },
  { feeds: BusinessDiscoverItems, name: "Business" },
  { feeds: ScienceDiscoverItems, name: "Science" },
];

type Feed = typeof DiscoveryFeeds extends { feeds: infer U }[] | undefined
  ? U extends (infer F)[]
    ? F
    : never
  : never;

export const Discover = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<NavigatorParams>>();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const baseOptions = {
    vertical: false,
    width: 208,
    height: screenWidth / 2,
  } as const;

  const insets = useSafeAreaInsets();
  const opener = useContext(AddFeedRefContext);
  const setLink = useSetAtom(addFeedLinkAtom);

  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const utils = trpc.useUtils();

  const debounced = useDebounce(searchText, 100);
  const { data, isPending } = trpc.search.searchFeeds.useInfiniteQuery(
    {
      search: debounced!,
      amount: 18,
      itemsPerFeed: 3,
    },
    {
      enabled: debounced != null,
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor;
      },
    },
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search",
        hideWhenScrolling: false,
        onClose: () => {
          setSearchText(undefined);
          setSearchBarOpen(false);
          utils.item.searchMultipleItems.reset();
        },
        onCancelButtonPress: () => {
          setSearchText(undefined);
          setSearchBarOpen(false);
          utils.item.searchMultipleItems.reset();
        },
        onFocus: () => {
          setSearchBarOpen(true);
        },
        onChangeText: (text: TODO) => {
          setSearchText(text.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  // @ts-ignore
  let searchData = data?.pages?.map((page) => page?.feeds).flat();

  if (!searchData) {
    searchData = [];
  }

  const transition = LinearTransition.duration(200);

  return (
    <AnimatedKeyboardAwareScrollView
      style={{
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      layout={transition}
      className={`bg-[#fcfcfc] ${searchBarOpen ? "mt-[96px]" : "mt-[130px]"} `}
    >
      {searchText && searchData.length > 1 && (
        <View className="mx-auto ml-4 flex -translate-x-1 flex-col justify-center gap-y-6 bg-[#fcfcfc] pt-4">
          {searchData?.map((feed) => (
            <Pressable
              onPress={() => {
                // @ts-ignore
                opener.current?.present();
                // @ts-ignore
                opener.current?.expand();
                setLink(feed?.feed_url);
              }}
              key={feed?.id}
            >
              <SearchCard feed={feed} />
            </Pressable>
          ))}
        </View>
      )}

      <Animated.View
        style={{
          display: !searchText || isPending ? "flex" : "none",
        }}
      >
        {DiscoveryFeeds?.map((Section) => (
          <View key={Section.name} className={`bg-[fcfcfc] pb-6 pl-1 `}>
            <Text.ArticleTitle className="mb-1 ml-3 mt-4 text-base font-medium">
              {Section.name}
            </Text.ArticleTitle>
            <Carousel
              {...baseOptions}
              style={{ width: "100%", overflow: "visible" }}
              pagingEnabled={true}
              height={screenHeight / 5}
              loop={false}
              overscrollEnabled={false}
              autoPlay={false}
              data={Section.feeds}
              renderItem={RenderCard}
            />
          </View>
        ))}
      </Animated.View>
    </AnimatedKeyboardAwareScrollView>
  );
};

export const RenderCard = ({ item }: { item: Feed }) => (
  <CustomCard item={item} search_logo_url={item.logo_url} />
);

const SearchCard = ({ feed }: TODO) => {
  return (
    <View className="mx-1 flex flex-row">
      <View className="h-12 w-12 rounded-md bg-[#f0f0f0] p-1">
        {feed?.logo_url && (
          <Image
            className="h-10 w-10 opacity-60"
            source={{ uri: feed?.logo_url }}
          />
        )}
      </View>
      <View className="ml-4 flex flex-col justify-center">
        <Text
          numberOfLines={2}
          className="w-44 max-w-xl truncate text-base font-semibold"
        >
          {feed?.title}
        </Text>
      </View>
    </View>
  );
};

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);
