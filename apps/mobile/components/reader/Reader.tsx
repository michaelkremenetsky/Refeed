import React, { useLayoutEffect, useMemo, useState } from "react";
import { InteractionManager } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";
import { useAtomValue } from "jotai";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { useItemData } from "@refeed/features/item/useItemDataMobile";
import type { ItemType } from "@refeed/types/item";

import { useUpdateFeeds } from "../../features/useUpdateFeeds";
import { BackIcon } from "../../lib/Icons";
import type { ReaderProps } from "../../lib/navTypes";
import { settingsAtom } from "../../lib/stores/settings";
import { trpc } from "../../utils/trpc";
import { View } from "../ui/View";
import { HeaderButtonIcon } from "./Header/HeaderButtonIcon";
import ItemRender from "./ItemRender";
import { ReaderDropdown } from "./ReaderDropdown";

const Reader = ({ route, navigation }: ReaderProps) => {
  const parems = route.params;
  const defaultIndex = parems.index!;

  const { items: feedItems } = useItemData();
  const settings = useAtomValue(settingsAtom);

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
      let item = items?.[currentItemIndex];

      if (!item?.title) {
        item = items?.[defaultIndex];
      }

      navigation.setOptions({
        headerShadowVisible: false,
        headerLeft: () => (
          <HeaderButtons HeaderButtonComponent={HeaderButtonIcon}>
            <Item
              title="search"
              iconName="search"
              IconComponent={() => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <BackIcon />
                </TouchableOpacity>
              )}
            />
          </HeaderButtons>
        ),
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={HeaderButtonIcon}>
            <Item
              title="dropdown"
              iconName="dropdown"
              className="transfrom translate-x-4"
              IconComponent={() => <ReaderDropdown item={item!} />}
            />
          </HeaderButtons>
        ),
      });
    });
  }, [parems.type, parems.feedId, currentItemIndex, items]);

  const onPageSelected = (e: { nativeEvent: { position: number } }) => {
    const index = e.nativeEvent.position;
    const item = items[index];

    setCurrentItemIndex(index);

    // This won't run till after you go back to the feed because of react freeze
    setTimeout(() => {
      markRead(item!);
    }, 0);
  };

  const currentItemMemo = useMemo(() => {
    return {
      currentItemIndex,
    };
  }, [currentItemIndex, items.length]);

  if (settings.ScrollDirection == "Vertical") {
    return (
      <PagerView
        orientation="vertical"
        overdrag={true}
        initialPage={currentItemIndex}
        onPageScroll={onPageSelected}
        style={{ flex: 1 }}
      >
        {items.map((item, i) => (
          <View key={item.id} style={{ flex: 1 }}>
            {shouldRenderItem(
              i,
              currentItemMemo.currentItemIndex,
              items?.length,
            ) ? (
              <ItemRender item={item} />
            ) : null}
          </View>
        ))}
      </PagerView>
    );
  } else if (settings.ScrollDirection == "Horizontal") {
    return (
      <PagerView
        overdrag={true}
        initialPage={currentItemIndex}
        onPageScroll={onPageSelected}
      >
        {items.map((item, i) => (
          <View key={item.id} className="h-full">
            {shouldRenderItem(
              i,
              currentItemMemo.currentItemIndex,
              items?.length,
            ) ? (
              <ItemRender item={item} />
            ) : null}
          </View>
        ))}
      </PagerView>
    );
  }
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
