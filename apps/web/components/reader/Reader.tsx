import { memo, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { atom, useAtom, useSetAtom } from "jotai";
import { Sparkles } from "lucide-react";

import { useUser } from "@refeed/features/hooks/useUser";
import { useItemData, useOpenItem } from "@refeed/features/item/useItemDataWeb";
import { debounce } from "@refeed/lib/debounce";
import type { FeedType } from "@refeed/types/feed";
import type { ItemType } from "@refeed/types/item";

import { BookmarkButton } from "../../features/bookmarks/BookmarkButton";
import BookmarkFolderButton from "../../features/bookmarks/BookmarkFolderButton";
import { ShortTermBookmarkButton } from "../../features/bookmarks/ShortTermBookmarkButton";
import { useUpdateFeeds } from "../../features/feed/useUpdateFeeds";
import { PricingDialog } from "../../features/pricing/PricingDialog";
import useWindowSize from "../../lib/useWindowSize";
import Sharing from "../sharing/Sharing";
import { Article } from "./Article";
import { CopyLinkButton } from "./CopyLinkButton";
import { useReaderAnimation } from "./useReaderAnimation";
import { useReaderNavigation } from "./useReaderNavigation";

export const fullscreenAtom = atom(false);
export const AIDrawerOpen = atom(false);
export const AIPromptOpen = atom(false);

const Reader = () => {
  const { width: windowWidth } = useWindowSize();

  const { items, FeedType, fetchNextPage } = useItemData();
  const { closeReader, initialIndex, isLoaded, searchItem } =
    useReaderNavigation(items);
  const { fullscreen, widthStyle, transitionDuration } = useReaderAnimation();

  const [aIDrawerOpen, setAIDrawerOpen] = useAtom(AIDrawerOpen);
  const [isAIPromptOpen, setIsAIPromptOpen] = useAtom(AIPromptOpen);

  if (isLoaded || searchItem) {
    return (
      <>
        <motion.div
          layout="preserve-aspect"
          className={clsx(
            "fixed z-30 w-full transform overflow-hidden bg-white py-0.5 md:left-auto md:w-[65%] dark:bg-[#0f0f10]",
            windowWidth! > 500 &&
              (fullscreen
                ? `left-0 right-0 top-0 h-full`
                : `${aIDrawerOpen ? "right-[16.5%] rounded-lg" : "right-1 rounded-lg"} left-1 top-1.5 mx-1 h-[98.5vh] border-[1.5px] border-neutral-400/25 shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] lg:w-[36%] dark:border-[#24252A] dark:bg-[#0f0f10] dark:shadow-none`),
          )}
          transition={{
            duration: 0.2,
          }}
          style={widthStyle}
        >
          <div className="flex flex-row items-center rounded-t border-b border-[#f0f0f0] bg-[#fcfcfc] py-2.5 font-bold dark:border-[#303030]/90 dark:bg-[#141415]">
            <BackButton onBackClick={() => closeReader()} />
            <div className={`${fullscreen ? "mx-auto w-[680px]" : "w-[90%]"}`}>
              <div
                className={`flex ${fullscreen ? "w-[90%]" : "ml-1"} justify-between`}
              >
                <Topbar className={!fullscreen ? "ml-1" : ""} />
                <div className="flex">
                <button
                  onClick={() => {
                    setIsAIPromptOpen(!isAIPromptOpen);
                    setAIDrawerOpen(!aIDrawerOpen);

                    // Scroll to the bottom
                    if (isAIPromptOpen) {
                      window.scrollTo(0, document.body.scrollHeight);
                    }
                  }}
                >
                  <Sparkles
                    shapeRendering="geometricPrecision"
                    className="mr-5 h-[22px] w-[22px] stroke-neutral-500/75 stroke-[1.5] dark:stroke-stone-400"
                  />
                </button>
                  <Sharing />
              </div>
            </div>
          </div>
        </div>
            <MemoizedCarousel
              fullscreen={fullscreen}
              items={searchItem ? [searchItem] : items}
              initialIndex={searchItem ? 0 : initialIndex}
          fetchNextPage={fetchNextPage}
              FeedType={FeedType}
            />
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
  const { openItem } = useOpenItem();

  const bufferRange = 25;

  // Get the items that items that are around openItemId
  const startIndex = Math.max(
    0,
    items.findIndex((item) => item.id === openItem?.id) - bufferRange,
  );
  const endIndex = Math.min(
    items.length,
    items.findIndex((item) => item.id === openItem?.id) + bufferRange + 1,
  );

  // Create a new array with placeholders for items outside the buffer range
  const newBufferedItems = items.map((item, index) =>
    index >= startIndex && index < endIndex ? item : { id: item.id },
  ) as ItemType[];

  const { markRead } = useUpdateFeeds(items, FeedType);
  const { replace, asPath } = useRouter();
  const pathWithoutQuery = asPath.split("?")[0];

  // For updating the URL with the current item
  // The error you get here on the last one is fine and doesn't break anything that then url
  const debouncedReplace = useRef(
    debounce((debouncedItems, endSlideIndex) => {
      replace(
        `${pathWithoutQuery}?item=` + debouncedItems[endSlideIndex]!.id,
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

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex,
    containScroll: "keepSnaps",
    dragThreshold: 0,
    duration: fullscreen ? 0 : 25,
  });

  useEffect(() => {
  const slideChange = () => {
    const newIndex = emblaApi?.selectedScrollSnap();

    if (newIndex) {
      if (newIndex == newBufferedItems.length - 1) {
        fetchNextPage();
      }

      debouncedReplace.current(newBufferedItems, newIndex);

      if (newBufferedItems[newIndex] != undefined) {
        markRead(newBufferedItems[newIndex]);
      }
    }
  };

    const handleKeyDown = (event: { key: string }) => {
      if (emblaApi) {
        switch (event.key) {
          case "ArrowLeft": {
            emblaApi.scrollPrev();
            slideChange();
            break;
          }
          case "ArrowRight": {
            emblaApi.scrollNext();
            slideChange();
            break;
          }
          default:
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [emblaApi, newBufferedItems]);

  /* A lot of chrome specfic bugs happening here. Make sure
    to check another browser If theirs a bug here */
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{
        backfaceVisibility: "hidden",
      }}
      ref={emblaRef}
    >
      <div className="flex w-full">
      {newBufferedItems?.map((item) => (
        <div
          key={item.id}
            className="scrollbar-rounded-md h-[calc(100svh-3.4rem)] w-full flex-shrink-0 overflow-y-scroll overscroll-none scrollbar scrollbar-thumb-neutral-300 scrollbar-thumb-rounded-md scrollbar-w-1 md:overscroll-contain dark:bg-[#0f0f10] dark:scrollbar-thumb-[#404245]"
        >
          {item.title && (
            <div className={fullscreen ? "mx-auto md:w-[650px]" : "w-full"}>
                <div className="flex flex-col items-center pt-[1px]">
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
      </div>
    </div>
  );
});

const BackButton = ({ onBackClick }: { onBackClick: () => void }) => {
  const setAIDrawerOpen = useSetAtom(AIDrawerOpen);

  return (
    <button
      className="animate-fade-in-up mx-2 rounded p-1 transition-all hover:bg-[#F5F5F5] dark:hover:bg-[#0f0f0f]"
      onClick={() => {
        setAIDrawerOpen(false), onBackClick();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        className="h-[22px] w-[22px] stroke-neutral-500/75 dark:stroke-neutral-500"
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
  const { plan } = useUser();

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

export const ArticleTopbar = ({
  className,
  openItemFromArticle,
}: {
  className?: string;
  openItemFromArticle: ItemType;
}) => {
  const { plan } = useUser();

  return (
    <div className={clsx("flex items-center gap-5", className)}>
      <Dialog.Root>
        <BookmarkButton openItemFromArticle={openItemFromArticle} />
        <BookmarkFolderButton openItemFromArticle={openItemFromArticle} />
        <ShortTermBookmarkButton openItemFromArticle={openItemFromArticle} />
        <CopyLinkButton />
        {plan == "free" && (
          <PricingDialog setDialogUndefined={() => undefined} />
        )}
      </Dialog.Root>
    </div>
  );
};
