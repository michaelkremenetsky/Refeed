import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAtom, useAtomValue } from "jotai";

import { bookmarkFolderSortAtom } from "@refeed/atoms/bookmarkAtom";
import { useItemData } from "@refeed/features/item/useItemDataWeb";

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
  let { items } = data;
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

  const { markRead } = useUpdateFeeds(items, FeedType);
  useCheckReadOnScroll(items, markRead, containerRef);

  // Check if Temporary Bookmarks should be removed
  const TempBookmarks = trpc.bookmark.checkTempBookmarks.useMutation();
  useEffect(() => {
    if (FeedType == "bookmarks") {
      TempBookmarks.mutate();
    }
  }, []);

  // Filter out items based on selected Bookmark Folder
  const { data: folders } = trpc.bookmark.getBookmarkFoldersForUser.useQuery();
  const hasNoneZeroFolders = folders?.some((folder) => folder.amount > 0);

  if (FeedType == "bookmarks" || FeedType == "recentlyread") {
    if (bookmarkSort) {
      items = items?.filter((item) => {
        if (item.bookmark_folders) {
          return item.bookmark_folders.includes(bookmarkSort);
        }
      });
    }
  }

  const readerOpen = itemParam != undefined || search != undefined;
  const itemsThatAreNotFromSearch = items?.filter((item) => !item.from_search);

  return (
    <div
      ref={containerRef}
      className={`gutter flex h-full overflow-x-auto overflow-y-visible bg-white dark:bg-[#0f0f10] ${readerOpen && "mr-[15px] scrollbar-hide"}`}
    >
      <div className="w-[5px]" />
      <div
        className={`flex ${
          Layout == "Card"
            ? readerOpen && items.length > 3
              ? "xl:ml-[180px]"
              : "xl:mx-auto"
            : "md:mx-auto"
        } `}
      >
        <div
          className={`${
            Layout == "Article"
              ? "md:w-[39.5em]"
              : Layout == "Magazine"
                ? "w-[35em]"
                : null
          } border-slate-300/40`}
        >
          {!isFetching && route == "/discover/[feedId]" && (
            <>
              <button
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
                {items.length != 0 &&
                  (FeedType == "bookmarks" || FeedType == "recentlyread") && (
                    <BookmarkFolderButtons className="ml-3 mt-2" />
                  )}
              </>
            )}
          <div style={{ overflow: "hidden" }}>
            {Layout == "Magazine" && (
              <>
                {items?.map((item, i) => (
                  <div key={item?.id}>
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
              </>
            )}
            {Layout == "Card" && (
              <div
                className={`mx-0.5 mt-4 grid gap-4 ${
                  readerOpen && items.length > 3
                    ? "grid-cols-3 grid-rows-3"
                    : "grid-cols-4 grid-rows-4"
                }`}
              >
                {items?.map((item, i) => (
                  <div
                    key={item?.id}
                    // For whatever reason the border dosen't apply on the card item itself
                    className="w-[249.5px] dark:rounded-md dark:border dark:border-neutral-800"
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
                  </div>
                ))}
                {isFetching &&
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="w-[219.5px]">
                      <ThemedSkeleton key={i} className="h-60 w-full" />
                    </div>
                  ))}
              </div>
            )}
            {Layout == "Article" && (
              <>
                {items?.map((item, i) => (
                  <>
                    {item.from_search ? null : (
                      <div key={item.id}>
                        <DateInfo i={i} items={items} />
                        <div className="mb-8 ml-1 mr-1 mt-2 rounded-md shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)] dark:border dark:border-[#24252A] dark:shadow-none">
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
        <div className="md:w-[250px]" />
      </div>
    </div>
  );
};
