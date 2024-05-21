import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SideBarWidth } from "@components/layout/SideBar";
import { AIDrawerOpen } from "@components/reader/Reader";
import { useCheckTempBookmarks } from "@features/bookmarks/useCheckTempBookmarks";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useWindowSize } from "usehooks-ts";

import { useUser } from "@refeed/features/hooks/useUser";
import { useItemData } from "@refeed/features/item/useItemDataWeb";
import { UpgradeForNewsletterMessage } from "@refeed/features/pro/UpgradeForNewsletter";
import type { FeedType as FeedTypes } from "@refeed/types/feed";
import type { ItemType } from "@refeed/types/item.js";
import { ScrollArea } from "@refeed/ui";

import { useFilterBookmarkFolders } from "../../features/feed/useFilterBookmarkFolders.tsx";
import { useCheckReadOnScroll } from "../../features/feed/useMarkReadOnScroll";
import { useUpdateFeeds } from "../../features/feed/useUpdateFeeds";
import { useInfiniteScroll } from "../../lib/useInfiniteScroll";
import { feedLayout } from "../../stores/ui";
import type { FeedLayoutTypes } from "../../types/feed";
import { Article } from "../reader/Article";
import { ReaderHighlightMenu } from "../reader/Highlights/ReaderHighlightMenu";
import { Dialog } from "../ui/Dialog";
import { ThemedSkeleton } from "../ui/Skeleton";
import { BookmarkFolderButtons } from "./BookmarkFolderButtons";
import { CardItem } from "./CardItem";
import { DateInfo } from "./DateInfo";
import { EmptyMessage } from "./EmptyMessage";
import { MagazineItem } from "./MagazineItem";
import { MagazineSkeleton } from "./MagazineSkeleton";
import { MarkAllAsReadButton } from "./MarkAllReadButton";

export const FeedLayout = (props: FeedLayoutTypes) => {
  const { FeedType } = props;
  const [Layout] = useAtom(feedLayout);

  const router = useRouter();
  const { route } = useRouter();
  const { inboxEnabled } = useUser();

  const data = useItemData();
  const { items } = data;
  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetched,
    isPending,
    isFetchingNextPage,
  } = data;

  const { containerRef } = useInfiniteScroll(
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    fetchNextPage,
  );

  useCheckTempBookmarks({ FeedType: FeedType as FeedTypes, isFetching });

  const { hasNoneZeroFolders, readerOpen } = useFilterBookmarkFolders({
    FeedType: FeedType as FeedTypes,
    items,
  });

  const { markRead } = useUpdateFeeds(items, FeedType as FeedTypes);

  const { elRefs } = useCheckReadOnScroll(
    items,
    Layout,
    markRead,
    readerOpen,
    containerRef,
  );

  useEffect(() => {
    containerRef.current?.scrollTo(0, 0);
  }, [Layout]);

  const aIDrawerOpen = useAtomValue(AIDrawerOpen);

  return (
    <ScrollArea
      ref={containerRef}
      type="always"
      hideScrollBar={readerOpen}
      className={clsx(
        "flex h-full overflow-x-auto overflow-y-visible bg-white dark:bg-[#0f0f10]",
      )}
    >
      <LayoutTypes Layout={Layout} readerOpen={readerOpen}>
        <div
          className={clsx(
            Layout == "Article" && "md:w-[39.5em]",
            Layout == "Magazine" && "md:w-[35em]",
            Layout == "Card" && "md:w-full",
            "border-slate-300/40",
          )}
        >
          {!isFetching && route == "/discover/[feedId]" && (
            <>
              <button
                onClick={() => {
                  router.back();
                }}
                className="ml-[19px] mt-3.5 text-center font-[450] text-neutral-400/90 dark:text-stone-400"
              >
                Back
              </button>
            </>
          )}
          {hasNoneZeroFolders &&
            (FeedType == "bookmarks" || FeedType == "recentlyread") && (
              <>
                {items.length != 0 &&
                  (FeedType == "bookmarks" || FeedType == "recentlyread") && (
                    <BookmarkFolderButtons className="ml-3 mt-2" />
                  )}
              </>
            )}
          <div style={{ overflow: "hidden" }}>
            {Layout == "Magazine" && (
              <div className="mb-2">
                {items?.map((item, i) => (
                  <div ref={elRefs[i]} key={item?.id}>
                    {item.from_search ? null : (
                      <>
                        <DateInfo i={i} items={items} />
                        <MagazineItem
                          item={item}
                          i={i}
                          FeedType={FeedType}
                          markRead={() => markRead(item)}
                        />
                      </>
                    )}
                  </div>
                ))}
                {isFetching &&
                  [...Array(3)].map((_, i) => (
                    <MagazineSkeleton key={i} i={!isFetched ? i : i + 1} />
                  ))}
              </div>
            )}
            {Layout == "Card" && (
              <motion.div
                // TODO: Add ability to set the amount of rows in card mode in settings
                layout="position"
                className={`mx-0.5 mb-2 mt-4 grid gap-4 ${
                  aIDrawerOpen
                    ? "grid-cols-2 grid-rows-2"
                    : readerOpen
                      ? "grid-cols-3"
                      : "grid-cols-1 lg:grid-cols-5"
                }`}
              >
                {items?.map((item, i) => (
                  <motion.div
                    ref={elRefs[i]}
                    key={item?.id}
                    className={clsx(
                      "mx-auto w-[94%] md:mx-0 md:w-full dark:rounded-md dark:border dark:border-neutral-800",
                    )}
                  >
                    {item.from_search ? null : (
                      <CardItem
                        i={i}
                        item={item}
                        items={items}
                        FeedType={FeedType}
                        key={item.id}
                        markRead={() => markRead(item)}
                      />
                    )}
                  </motion.div>
                ))}
                {isFetching &&
                  [...Array(readerOpen ? 3 : 5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="mx-auto w-[94%] md:mx-0 md:w-full dark:rounded-md"
                    >
                      <ThemedSkeleton className="relative h-60 w-full overflow-hidden" />
                    </motion.div>
                  ))}
              </motion.div>
            )}
            {Layout == "Article" && (
              <>
                {items?.map((item, i) => (
                  <>
                    {item.from_search ? null : (
                      <div ref={elRefs[i]} key={item.id} className="md:mx-0.5">
                        <DateInfo i={i} items={items} />
                        <div
                          className={clsx(
                            `mt-4 w-[94svw] rounded-md shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)] md:w-full dark:border dark:border-[#232329] dark:shadow-none`,
                            item.marked_read && "opacity-80",
                          )}
                        >
                          <Dialog>
                            <Article
                              FeedType={FeedType as FeedTypes}
                              item={item}
                              Type="Article View"
                            />
                          </Dialog>
                        </div>
                      </div>
                    )}
                    <ReaderHighlightMenu itemId={item.id} />
                  </>
                ))}
              </>
            )}
          </div>
          <EmptyState
            isPending={isPending}
            isFetching={isFetching}
            FeedType={FeedType}
            items={items}
            inboxEnabled={inboxEnabled!}
          />
          <MarkReadButton
            FeedType={FeedType}
            isFetching={isFetching}
            items={items}
            Layout={Layout}
          />
        </div>
        <div
          className={clsx(
            (Layout == "Magazine" || Layout == "Article") && `md:w-[250px]`,
          )}
        />
      </LayoutTypes>
    </ScrollArea>
  );
};

const EmptyState = ({
  isPending,
  isFetching,
  FeedType,
  items,
  inboxEnabled,
}: {
  isPending: boolean;
  isFetching: boolean;
  FeedType: FeedTypes;
  items: ItemType[];
  inboxEnabled: boolean;
}) => {
  if (isPending || isFetching) return null;

  return (
    <>
      {items.length === 0 && (
        <div className="pt-14">
          {!inboxEnabled && FeedType === "newsletters" ? (
            <UpgradeForNewsletterMessage FeedType={FeedType} />
          ) : (
            <EmptyMessage FeedType={FeedType} />
          )}
        </div>
      )}
    </>
  );
};

const MarkReadButton = ({
  FeedType,
  isFetching,
  items,
  Layout,
}: {
  FeedType: FeedTypes;
  isFetching: boolean;
  items: ItemType[];
  Layout: "Card" | "Magazine" | "Article";
}) => (
  <>
    {!isFetching &&
      FeedType != "bookmarks" &&
      FeedType != "recentlyread" &&
      FeedType != "search" &&
      FeedType != "newsletters" &&
      items.length != 0 && (
        <MarkAllAsReadButton
          noMargin={Layout == "Article" || Layout == "Card"}
        />
      )}
  </>
);

export const LayoutTypes = ({
  children,
  Layout,
  readerOpen,
}: {
  children: ReactNode;
  Layout: "Card" | "Magazine" | "Article";
  readerOpen?: boolean;
}) => {
  const { width: windowWidth } = useWindowSize();
  const aIDrawerOpen = useAtomValue(AIDrawerOpen);
  const sideBarWidth = useAtomValue(SideBarWidth);
  const isMobile = windowWidth < 500;

  const getLayoutClasses = () => {
    if (Layout === "Card") {
      if (!isMobile && !readerOpen) {
        // Extra space for aesthetics
        return "ml-0 lg:ml-[1.5%] lg:mr-[3%]";
      } else if (isMobile && !readerOpen) {
        // Card View on Mobile should be fullscreen
        return "mx-auto";
      } else if (readerOpen) {
        // Extra space for aesthetics
        return "mx-[1%]";
      }
    } else if (Layout === "Magazine" || Layout === "Article") {
      return "w-max mx-auto";
    }
  };

  const getLayoutStyle = () => {
    // Calculate the width of the feed based on the sidebar width
    if (Layout === "Card" && readerOpen) {
      const width = !aIDrawerOpen
        ? // Space that is not the reader or Sidebar
          `calc(62svw - ${sideBarWidth}px)`
        : // Extra 16.5% is the the AI Drawer
          `calc(78.5svw - ${sideBarWidth}px)`;
      return { width };
    }
    return undefined;
  };

  return (
    <AnimatePresence>
      <motion.div
        layout={Layout === "Card" ? "preserve-aspect" : "position"}
        transition={{ duration: 0.1 }}
        className={clsx(
          "flex",
          getLayoutClasses(),
          // Extra padding for when the AI drawer is open
          aIDrawerOpen && readerOpen && "pr-[46%]",
        )}
        style={getLayoutStyle()}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
