import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { AIDrawerOpen } from "@components/reader/Reader";
import { useUpdateFeeds } from "@features/feed/useUpdateFeeds";
import useEmblaCarousel from "embla-carousel-react";
import { useSetAtom } from "jotai";
import { useHotkeys } from "react-hotkeys-hook";

import { debounce } from "@refeed/lib/debounce";
import type { FeedType } from "@refeed/types/feed";
import type { ItemType } from "@refeed/types/item";

import { useItemsBuffer } from "./useItemBuffer";

interface MemoizedCarouselProps {
  items: ItemType[];
  initialIndex: number;
  fetchNextPage: () => void;
  FeedType: FeedType;
}

export const useCarousel = ({
  items,
  initialIndex,
  fetchNextPage,
  FeedType,
}: MemoizedCarouselProps) => {
  const { newBufferedItems } = useItemsBuffer({ items });
  const setAIDrawerOpen = useSetAtom(AIDrawerOpen);

  const { markRead } = useUpdateFeeds(items, FeedType);
  const { replace, asPath } = useRouter();
  const pathWithoutQuery = asPath.split("?")[0];

  // For updating the URL with the current item
  const debouncedReplace = useRef(
    debounce((debouncedItems, endSlideIndex) => {
      replace(
        `${pathWithoutQuery}?item=` + debouncedItems[endSlideIndex]!.id,
        undefined,
        { shallow: true, scroll: false },
      );
    }, 250),
  );

  useEffect(() => {
    return () => {
      debouncedReplace.current.cancel();
    };
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex,
    containScroll: "keepSnaps",
    watchDrag: false,
    duration: 0,
  });

  const slideChange = () => {
    const newIndex = emblaApi?.selectedScrollSnap();

    if (newIndex) {
      if (newIndex == newBufferedItems.length - 1) {
        fetchNextPage();
      }

      if (newBufferedItems[newIndex] != undefined) {
        markRead(newBufferedItems[newIndex]);
      }
    }
  };

  useHotkeys("LeftArrow", () => {
    if (emblaApi) {
      setAIDrawerOpen(false);
      emblaApi.scrollPrev();
      slideChange();
    }
  });
  useHotkeys("RightArrow", () => {
    if (emblaApi) {
      setAIDrawerOpen(false);
      emblaApi?.scrollNext();
      slideChange();
    }
  });

  useEffect(() => {
    if (emblaApi)
      emblaApi.on("select", () => {
        debouncedReplace.current(
          newBufferedItems,
          emblaApi.selectedScrollSnap(),
        );
      });
  }, [emblaApi]);

  return { emblaRef, newBufferedItems };
};
