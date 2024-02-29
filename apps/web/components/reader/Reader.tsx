import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { motion } from "framer-motion";
import { atom, useAtom, useAtomValue } from "jotai";
import Carousel from "nuka-carousel";
import { useQueryState } from "nuqs";

import type { FeedType } from "@refeed/features/item/useItemDataWeb";
import { useItemData } from "@refeed/features/item/useItemDataWeb";
import { usePlan } from "@refeed/features/payment/usePlan";
import { debounce } from "@refeed/lib/debounce";
import type { ItemType } from "@refeed/types/item";

import { BookmarkButton } from "../../features/bookmarks/BookmarkButton";
import BookmarkFolderButton from "../../features/bookmarks/BookmarkFolderButton";
import { ShortTermBookmarkButton } from "../../features/bookmarks/ShortTermBookmarkButton";
import { useUpdateFeeds } from "../../features/feed/useUpdateFeeds";
import { PricingDialog } from "../../features/pricing/PricingDialog";
import useWindowSize from "../../lib/useWindowSize";
import { settingsAtom } from "../../stores/settings";
import { trpc } from "../../utils/trpc";
import { SideBarWidth } from "../layout/SideBar";
import Sharing from "../sharing/Sharing";
import { Article } from "./Article";
import { CopyLinkButton } from "./CopyLinkButton";

export const fullscreenAtom = atom(false);

const useReaderNavigation = (items: ItemType[]) => {
  const [_, setItemQuery] = useQueryState("item", {
    shallow: true,
  });
  const [__, setItemSearchQuery] = useQueryState("searchItem", {
    shallow: true,
  });

  const { query } = useRouter();
  const { item, searchItem } = query;

  // TODO: Add ability to fetch the open id from here
  const initialIndex = useMemo(() => {
    if (searchItem && items) {
      return items.findIndex((i) => i.id == searchItem);
    } else {
      return items.findIndex((i) => i.id == item);
    }
  }, [items, item, searchItem]);

  const isLoaded = items.length > 0 && initialIndex !== -1;

  const closeReader = () => {
    // TODO: Fix clicking esc causes it to removes parems in other parts of the app
    // Should be able to just check readerOpen here but for whatever reason it dosen't work.
    // const readerOpen = item != undefined || searchItem != undefined;

    setItemQuery(null);
    setItemSearchQuery(null);
  };

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeReader();
      }
    });
    return () => {
      document.removeEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeReader();
        }
      });
    };
  }, []);

  return { closeReader, initialIndex, isLoaded };
};

const useReaderAnimation = () => {
  const settings = useAtomValue(settingsAtom);
  const [fullscreen, setFullscren] = useAtom(fullscreenAtom);

  useEffect(() => {
    setFullscren(settings.OpenReaderInFullScreenByDefault);
  }, [settings.OpenReaderInFullScreenByDefault]);

  const width = useAtomValue(SideBarWidth);
  const { width: screenWidth } = useWindowSize();

  const [prevFull, setPrevFull] = useState(fullscreen);

  // Calculate the full screen percentage
  const fullScreenWidthPercent = ((screenWidth! - width) / screenWidth!) * 100;
  const widthStyle = fullscreen
    ? { width: `${fullScreenWidthPercent}%` }
    : undefined;

  // Checks if the transtion was caused by a change in `full`.
  // Any other change will not trigger a transition.
  useEffect(() => {
    setPrevFull(fullscreen);
  }, [fullscreen]);

  // Determine transition duration based on change in `full`
  const transitionDuration = fullscreen !== prevFull ? 0.2 : 0;

  return { fullscreen, widthStyle, transitionDuration };
};

const Reader = () => {
  // To prevent the sharing from popping in
  trpc.settings.getShareProviders.useQuery();

  const { items, FeedType, fetchNextPage } = useItemData();
  const { closeReader, initialIndex, isLoaded } = useReaderNavigation(items);
  const { fullscreen, widthStyle, transitionDuration } = useReaderAnimation();

  if (isLoaded) {
    return (
      <motion.div
        layout="preserve-aspect"
        className={`fixed z-30 w-full overflow-hidden bg-white py-0.5 md:left-auto md:w-[65%] dark:bg-[#0f0f10] ${
          fullscreen
            ? "left-0 right-0 top-0 h-full"
            : "left-1 right-1 top-1.5 mx-1 h-[98.5vh] rounded-lg border-[1.5px] border-neutral-400/25 shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] lg:w-[36%] dark:border-[#24252A] dark:bg-[#0f0f10] dark:shadow-none"
        }
      `}
        transition={{
          duration: transitionDuration,
        }}
        style={widthStyle}
      >
        <div className="flex flex-row items-center rounded-t border-b border-[#f0f0f0] bg-[#fcfcfc] py-2.5 font-bold dark:border-[#303030]/90 dark:bg-[#141415]">
          <BackButton onBackClick={() => closeReader()} />
          <div className={`${fullscreen ? "mx-auto w-[670px]" : "w-[90%]"}`}>
            <div
              className={`flex ${fullscreen ? "w-[90%]" : "ml-2"} justify-between`}
            >
              <Topbar className="ml-1" />
              <Sharing />
            </div>
          </div>
        </div>
        <div>
          <MemoizedCarousel
            fullscreen={fullscreen}
            items={items}
            initialIndex={initialIndex}
            fetchNextPage={() => fetchNextPage}
            FeedType={FeedType}
          />
        </div>
      </motion.div>
    );
  }
};

export default Reader;

const MemoizedCarousel = memo(function RenderCarousel({
  items,
  initialIndex,
  fetchNextPage,
  FeedType,
  fullscreen,
}: {
  items: ItemType[];
  initialIndex: number;
  fetchNextPage: () => void;
  FeedType: FeedType;
  fullscreen: boolean;
}) {
  // Items to keep loaded around the current index
  const bufferRange = 20;

  const startIndex = Math.max(0, initialIndex - bufferRange);
  const endIndex = Math.min(items.length, initialIndex + bufferRange + 1);

  // Create a new array with placeholders for items outside the buffer range
  const newBufferedItems = items.map((item, index) =>
    index >= startIndex && index < endIndex ? item : { id: item.id },
  ) as ItemType[];

  const { markRead } = useUpdateFeeds(items, FeedType);
  const { replace, asPath } = useRouter();
  const pathWithoutQuery = asPath.split("?")[0];

  const debouncedReplace = useRef(
    debounce((endSlideIndex) => {
      replace(
        `${pathWithoutQuery}?item=` + newBufferedItems[endSlideIndex]!.id,
        undefined,
        { shallow: true, scroll: false },
      );
    }, 500),
  );

  useEffect(() => {
    return () => {
      debouncedReplace.current.cancel();
    };
  }, []);

  /* A lot of chrome specfic bugs happening here. Make sure
    to check another browser If theirs a bug here */
  return (
    <Carousel
      withoutControls={true}
      renderAnnounceSlideMessage={undefined}
      enableKeyboardControls={true}
      dragging={false}
      swiping={false}
      speed={fullscreen ? 0 : 500}
      slideIndex={initialIndex}
      slidesToScroll="auto"
      afterSlide={(endSlideIndex) => {
        markRead(newBufferedItems[endSlideIndex]!);
      }}
      beforeSlide={(_, endSlideIndex) => {
        if (endSlideIndex == newBufferedItems.length - 1) {
          fetchNextPage();
        }
        debouncedReplace.current(endSlideIndex);
      }}
    >
      {newBufferedItems?.map((item) => (
        <div
          key={item.id}
          className="scrollbar-rounded-md w-full overflow-y-scroll overscroll-contain scrollbar scrollbar-thumb-neutral-300 scrollbar-thumb-rounded-md scrollbar-w-1 dark:bg-[#0f0f10]"
        >
          {item.title && (
            <div className={fullscreen ? "mx-auto w-[650px]" : "w-full"}>
              <div className="flex h-[calc(100vh-3.4rem)] flex-col items-center pt-[1px]">
                <Article
                  FeedType={FeedType}
                  item={item}
                  Type={fullscreen ? "Full" : "Popup"}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </Carousel>
  );
});

const BackButton = ({ onBackClick }: { onBackClick: () => void }) => {
  return (
    <button
      className="animate-fade-in-up mx-2 rounded p-1 transition-all hover:bg-[#F5F5F5] dark:hover:bg-[#0f0f0f]"
      onClick={() => onBackClick()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        className="h-[22px] w-[22px] stroke-neutral-450 dark:stroke-neutral-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export const Topbar = ({ className }: { className?: string }) => {
  const { plan } = usePlan();

  return (
    <div className={clsx("flex items-center gap-5", className)}>
      <Dialog.Root>
        <BookmarkButton />
        <BookmarkFolderButton />
        <ShortTermBookmarkButton />
        <CopyLinkButton />
        {plan == "free" && (
          <PricingDialog setDialogUndefined={() => undefined} />
        )}
      </Dialog.Root>
    </div>
  );
};
