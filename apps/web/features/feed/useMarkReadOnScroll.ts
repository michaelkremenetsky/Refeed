import { useEffect } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useAtomValue } from "jotai";

import { useOpenItem } from "@refeed/features/item/useItemDataWeb";
import type { ItemType } from "@refeed/types/item";

import { settingsAtom } from "../../stores/settings";

export const useCheckReadOnScroll = (
  items: ItemType[],
  markRead: (item: ItemType) => void,
  containerRef: any,
) => {
  const settings = useAtomValue(settingsAtom);
  const { openItem } = useOpenItem();

  useEffect(() => {
    // Set Page Scroll Position to what is was before clicking the item
    if (openItem != undefined) {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        sessionStorage.removeItem("scrollPosition");
      }
    }
  }, [openItem]);

  const { scrollY } = useScroll({
    container: containerRef,
  });

  const check = (scrollY: number, items: ItemType[]) => {
    if (openItem == undefined) {
      if (settings.MarkReadOnScroll == true) {
        if (items) {
          const itemHeight = 100;
          const itemsToMark = Math.floor(scrollY / itemHeight);
          items.forEach((item, i) => {
            if (i < itemsToMark && !item.marked_read) {
              markRead(item);
            }
          });
        }
      }
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    check(latest, items);
  });
};
