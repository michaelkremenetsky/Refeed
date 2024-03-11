import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SideBarWidth } from "@components/layout/SideBar";
import { AIDrawerOpen } from "@components/reader/Reader";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useWindowSize } from "usehooks-ts";

import { bookmarkFolderSortAtom } from "@refeed/atoms/bookmarkAtom";
import { useItemData } from "@refeed/features/item/useItemDataWeb";
import { ScrollArea } from "@refeed/ui";

import { useCheckReadOnScroll } from "../../features/feed/useMarkReadOnScroll";
import { useUpdateFeeds } from "../../features/feed/useUpdateFeeds";
import { useInfiniteScroll } from "../../lib/useInfiniteScroll";
import { feedLayout } from "../../stores/ui";
import type { FeedLayoutTypes } from "../../types/feed";
import { trpc } from "../../utils/trpc";
import { Article } from "../reader/Article";
import { Dialog } from "../ui/Dialog";
import { ThemedSkeleton } from "../ui/Skeleton";
import { BookmarkFolderButtons } from "./BookmarkFolderButtons";
import { CardItem } from "./CardItem";
import { DateInfo } from "./DateInfo";
import { EmptyMessage } from "./EmptyMessage";
import { MagazineItem } from "./MagazineItem";
import { MagazineSkeleton } from "./MagazineSkeleton";

export const FeedLayout = (props: FeedLayoutTypes) => {
  const { FeedType } = props;
  const [Layout] = useAtom(feedLayout);
  const bookmarkSort = useAtomValue(bookmarkFolderSortAtom);

  const router = useRouter();
  const { query, route } = useRouter();
  const { item: itemParam, search } = query;

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

  // Check if Temporary Bookmarks should be removed
  const TempBookmarks = trpc.bookmark.checkTempBookmarks.useMutation();
  useEffect(() => {
    if (FeedType == "bookmarks" && isFetching) {
      TempBookmarks.mutate();
    }
  }, [isFetching]);

  // Filter out items based on selected Bookmark Folder
  const { data: folders } = trpc.bookmark.getBookmarkFoldersForUser.useQuery();
  const hasNoneZeroFolders = folders?.some((folder) => folder.amount > 0);

  const readerOpen = itemParam != undefined || search != undefined;
  let itemsThatAreNotFromSearch = items?.filter((item) => !item.from_search);

  if (FeedType == "bookmarks" || FeedType == "recentlyread") {
    if (bookmarkSort) {
      itemsThatAreNotFromSearch = itemsThatAreNotFromSearch?.filter((item) => {
        if (item.bookmark_folders) {
          return item.bookmark_folders.includes(bookmarkSort);
        }
      });
    }
  }

  const { markRead } = useUpdateFeeds(itemsThatAreNotFromSearch, FeedType);
  useCheckReadOnScroll(itemsThatAreNotFromSearch, markRead, containerRef);

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
            Layout == "Card" && "md:w-fit",
            "border-slate-300/40",
          )}
        >
          {!isFetching && route == "/discover/[feedId]" && (
            <>
              <button
                // Look at this again before launch
                onClick={() => {
                  router.back();
                }}
                className="ml-[19px] mt-2 text-center font-medium text-neutral-400/90 dark:text-stone-400"
              >
                Back
              </button>
            </>
          )}
          {hasNoneZeroFolders &&
            (FeedType == "bookmarks" || FeedType == "recentlyread") && (
              <>
                {itemsThatAreNotFromSearch.length != 0 &&
                  (FeedType == "bookmarks" || FeedType == "recentlyread") && (
                    <BookmarkFolderButtons className="ml-3 mt-2" />
                  )}
              </>
            )}
          <div style={{ overflow: "hidden" }}>
            {Layout == "Magazine" && (
              <>
                {itemsThatAreNotFromSearch?.map((item, i) => (
                  <div key={item?.id}>
                    {item.from_search ? null : (
                      <>
                        <DateInfo i={i} items={itemsThatAreNotFromSearch} />
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
              </>
            )}
            {Layout == "Card" && (
              <motion.div
                layout="position"
                className={`mx-0.5 mt-4 grid gap-4 ${
                  aIDrawerOpen
                    ? "grid-cols-2 grid-rows-2"
                    : readerOpen
                      ? "grid-cols-3 grid-rows-3"
                      : "grid-cols-1 grid-rows-1 lg:grid-cols-4 lg:grid-rows-4"
                }`}
              >
                {itemsThatAreNotFromSearch?.map((item, i) => (
                  <motion.div
                    layout
                    key={item?.id}
                    className={clsx(
                      "mx-auto w-[94%] md:mx-0 md:w-full dark:rounded-md dark:border dark:border-neutral-800",
                      !readerOpen && "md:max-w-[300px]",
                    )}
                  >
                    {item.from_search ? null : (
                      <CardItem
                        i={i}
                        item={item}
                        items={itemsThatAreNotFromSearch}
                        FeedType={FeedType}
                        key={item.id}
                        markRead={() => markRead(item)}
                      />
                    )}
                  </motion.div>
                ))}
                {isFetching &&
                  [...Array(readerOpen ? 3 : 4)].map((_, i) => (
                    <div key={i} className="w-[94%] md:w-[300px]">
                      <ThemedSkeleton className="h-60 w-full" />
                    </div>
                  ))}
              </motion.div>
            )}
            {Layout == "Article" && (
              <>
                {itemsThatAreNotFromSearch?.map((item, i) => (
                  <>
                    {item.from_search ? null : (
                      <div key={item.id} className="md:mx-2">
                        <DateInfo i={i} items={itemsThatAreNotFromSearch} />
                        <div className="mb-8 mt-2 w-[94svw] rounded-md shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)] md:w-full dark:border dark:border-[#24252A] dark:shadow-none">
                          <Dialog>
                            <Article
                              FeedType={FeedType}
                              item={item}
                              Type="Article View"
                            />
                          </Dialog>
                        </div>
                      </div>
                    )}
                  </>
                ))}
              </>
            )}
          </div>
          {!isPending &&
          !isFetching &&
          itemsThatAreNotFromSearch.length == 0 ? (
            <EmptyMessage className="pt-14" FeedType={FeedType} />
          ) : null}
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
        return "ml-0 lg:ml-[11%] lg:mr-[11%]";
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
    <motion.div
      layout="preserve-aspect"
      transition={{ duration: 0.1 }}
      className={clsx(
        "flex",
        getLayoutClasses(),
        // Extra padding for when the AI drawer is open
        aIDrawerOpen && readerOpen && "pr-[38%]",
      )}
      style={getLayoutStyle()}
    >
      {children}
    </motion.div>
  );
};
