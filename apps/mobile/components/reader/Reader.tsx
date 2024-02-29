import React, { useLayoutEffect, useMemo, useState } from "react";
import { InteractionManager } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";
import { HeaderButtons, Item } from "react-navigation-header-buttons";



import { useItemData } from "@refeed/features/item/useItemDataMobile";
import { usePlan } from "@refeed/features/payment/usePlan";
import type { ItemType } from "@refeed/types/item";



import { useUpdateFeeds } from "../../features/useUpdateFeeds";
import { BackIcon, ShareIcon } from "../../lib/Icons";
import type { ReaderProps } from "../../lib/navTypes";
import { openShareSheet } from "../../lib/openShareSheet";
import { trpc } from "../../utils/trpc";
import { View } from "../ui/View";
import { BookmarkButton } from "./Header/BookmarkButton";
import { BookmarkFolderButton } from "./Header/BookmarkFolderButton";
import { HeaderButtonIcon } from "./Header/HeaderButtonIcon";
import { ShortTermBookmarkButton } from "./Header/ShortTermBookmarkButton";
import ItemRender from "./ItemRender";


const Reader = ({ route, navigation }: ReaderProps) => {
  const parems = route.params;
  const defaultIndex = parems.index!;
  const { items: feedItems } = useItemData();
  const { plan, isPending } = usePlan();

  // Only enable when the FeedType is Search
  const { data: searchItems } =
    trpc.item.searchMultipleItemsWithFormatting.useQuery(
      { query: parems.searchQuery, take: 10 },
      { enabled: parems.type == "search" },
    );

  const items: ItemType[] =
    parems.type == "search"
      ? (searchItems as unknown as ItemType[])
      : feedItems;

  const { markRead } = useUpdateFeeds(items);

  const [currentItemIndex, setCurrentItemIndex] =
    useState<number>(defaultIndex);

  useLayoutEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      const item = items?.[currentItemIndex];

      if (item) {
        navigation.setOptions({
          headerShadowVisible: false,
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButtonIcon}>
              <Item
                title="search"
                iconName="search"
                IconComponent={() => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                )}
              />
            </HeaderButtons>
          ),
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButtonIcon}>
              <Item
                title="BookmarkButton"
                iconName="BookmarkButton"
                IconComponent={() => <BookmarkButton item={item} />}
              />
              {plan == "pro" && !isPending ? (
                <>
                  <Item
                    title="BookmarkFolderButton"
                    iconName="BookmarkFolderButton"
                    IconComponent={() => <BookmarkFolderButton item={item} />}
                  />
                  <Item
                    title="ShortTermBookmarkButton"
                    iconName="ShortTermBookmarkButton"
                    IconComponent={() => (
                      <ShortTermBookmarkButton item={item} />
                    )}
                  />
                </>
              ) : null}
              <Item
                title="share"
                iconName="share"
                IconComponent={() => (
                  <TouchableOpacity
                    className="mr-1"
                    onPress={() => {
                      openShareSheet(item.url);
                    }}
                  >
                    <ShareIcon />
                  </TouchableOpacity>
                )}
              />
            </HeaderButtons>
          ),
        });
      }
    });
  }, [items, parems.type, parems.feedId, currentItemIndex]);

  const onPageSelected = (e: { nativeEvent: { position: number } }) => {
    const index = e.nativeEvent.position;
    const item = items[index];

    setCurrentItemIndex(index);

    // This won't run till after you go back to the feed because of react freeze
    setTimeout(() => {
      markRead(item!);
    }, 0);
  };

  const currentNavigation = useMemo(() => {
    return {
      currentItemIndex,
      totalLength: items.length,
    };
  }, [currentItemIndex, items.length]);

  return (
    <PagerView
      // orientation="vertical" // Going to play with vertical mode
      overdrag={true}
      initialPage={currentItemIndex}
      onPageScroll={onPageSelected}
    >
      {items.map((item, i) => (
        <View key={item.id} className="h-full">
          {shouldRenderItem(
            i,
            currentNavigation.currentItemIndex,
            items?.length,
          ) ? (
            <ItemRender item={item} />
          ) : null}
        </View>
      ))}
    </PagerView>
  );
};

const offscreenPageLimit = 1;

const shouldRenderItem = (
  index: number,
  currentItemIndex: number,
  itemAmount: number,
) => {
  return (
    index >= Math.max(0, currentItemIndex - offscreenPageLimit) &&
    index <= Math.min(itemAmount - 1, currentItemIndex + offscreenPageLimit)
  );
};

export default Reader;