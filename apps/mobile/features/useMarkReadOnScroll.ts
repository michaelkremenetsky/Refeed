import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import { useAtomValue } from "jotai";

import { useItemData } from "@refeed/features/item/useItemDataMobile";
import type { ItemType } from "@refeed/types/item";

import { settingsAtom } from "../lib/stores/settings";
import { useUpdateFeeds } from "./useUpdateFeeds";

export const useMarkReadOnScroll = (scrollY: SharedValue<number>) => {
  const { items } = useItemData();

  const settings = useAtomValue(settingsAtom);
  const { markRead } = useUpdateFeeds(items);

  const checkMarkReadOnScroll = (scrollY: number, items: ItemType[]) => {
    if (settings.MarkReadOnScroll == true) {
      if (items) {
        const itemHeight = 98;
        const itemsToMark = Math.floor((scrollY - 60) / itemHeight);
        items.forEach((item, i) => {
          if (i < itemsToMark && !item.marked_read) {
            markRead(item);
          }
        });
      }
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
    checkMarkReadOnScroll(event.nativeEvent.contentOffset.y, items);
    return;
  };

  return { handleScroll } as const;
};
