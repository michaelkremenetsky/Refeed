import type { RefObject } from "react";
import { useRefArray } from "@lib/useRefArray";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useAtomValue } from "jotai";

import type { ItemType } from "@refeed/types/item";

import { settingsAtom } from "../../stores/settings";

export const useCheckReadOnScroll = (
  items: ItemType[],
  Layout: "Magazine" | "Card" | "Article" | "Split",
  markRead: (item: ItemType) => void,
  readerOpen: boolean,
  containerRef: RefObject<HTMLDivElement>,
) => {
  const settings = useAtomValue(settingsAtom);
  const { elRefs }: { elRefs: RefObject<HTMLDivElement>[] } =
    useRefArray(items);

  const { scrollY } = useScroll({
    container: containerRef,
  });

  const checkMagazine = (scrollY: number, items: ItemType[]) => {
    const heights = elRefs.map(
      (ref) => ref.current?.getBoundingClientRect().height ?? 0,
    );

    const itemsWithHeights = items.map((item, i) => {
      return {
        ...item,
        height: heights.slice(0, i).reduce((a, b) => a + b, 0),
      };
    });

    const itemsToMark = itemsWithHeights.filter(
      (item) => item.height < scrollY - 75,
    );

    itemsToMark.forEach((item) => {
      if (!item.marked_read) {
        markRead(item);
      }
    });
  };

  const checkCard = (scrollY: number, items: ItemType[]) => {
    const rowAmount = readerOpen ? 3 : 5;

    const itemsWithHeights = items.map((item, i) => {
      const groupIndex = Math.floor(i / rowAmount);
      return {
        ...item,
        height: groupIndex * 240,
      };
    });

    for (let i = 0; i < itemsWithHeights.length; i += 5) {
      const itemsToMark = itemsWithHeights
        .slice(i, i + 5)
        .filter((item) => item.height < scrollY - 75);

      itemsToMark.forEach((item) => {
        if (!item.marked_read) {
          markRead(item);
        }
      });
    }
  };

  const checkArticle = (scrollY: number, items: ItemType[]) => {
    const heights = elRefs.map(
      (ref) => ref.current?.getBoundingClientRect().height ?? 0,
    );

    const itemsWithHeights = items.map((item, i) => {
      return {
        ...item,
        height: heights.slice(0, i + 1).reduce((a, b) => a + b, 0),
      };
    });

    const itemsToMark = itemsWithHeights.filter(
      (item) => item.height < scrollY - 75,
    );

    itemsToMark.forEach((item) => {
      if (!item.marked_read) {
        markRead(item);
      }
    });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (items) {
      if (settings.MarkReadOnScroll && Layout == "Magazine") {
        checkMagazine(latest, items);
      }
      if (settings.MarkReadOnScroll && Layout == "Card") {
        checkCard(latest, items);
      }
      if (settings.MarkReadOnScroll && Layout == "Article") {
        checkArticle(latest, items);
      }
    }
  });

  return {
    elRefs,
  };
};
