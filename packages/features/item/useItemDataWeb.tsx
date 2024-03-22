import { useRouter } from "next/router";

import { divideArray } from "@refeed/lib/divideArray";
import type { ItemType } from "@refeed/types/item";

import { filterItems } from "../filters/filterItems";
import { trpc } from "../trpc";
import useWebParams from "./useWebParams";

export const useItemData = () => {
  const { sort, FeedType, folder, feedId, bookmarkFolder } = useWebParams();

  const {
    data: rawItems,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetched,
    isPending,
    isFetchingNextPage,
  } = trpc.item.getUnreadItems.useInfiniteQuery(
    {
      amount: 25,
      sort,
      type: FeedType,
      feed_id: feedId as string | undefined,
      folder: folder as string | undefined,
      bookmark_folder: bookmarkFolder,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor;
      },
    },
  );

  let items = rawItems?.pages
    ?.map((page) => page?.transformedItems)
    .flat() as ItemType[];

  if (!items) {
    items = [];
  }

  const filteredItems = filterItems(items);

  return {
    items: filteredItems,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetched,
    isPending,
    isFetchingNextPage,
    FeedType,
    folder,
  };
};

// For use with reader and bookmarks
export const useOpenItem = () => {
  const { query } = useRouter();
  const { items } = useItemData();
  const { item } = query;

  const openItem = items.find((i) => {
    return i.id == item;
  });

  return { openItem };
};

export const useUpdateWebItemData = () => {
  // Updates the cache Optimistically
  const { sort, FeedType, folder, feedId } = useWebParams();
  const utils = trpc.useUtils();

  const updateItemData = (newItems: ItemType[]) => {
    utils.item.getUnreadItems.setInfiniteData(
      {
        amount: 25,
        sort,
        type: FeedType,
        feed_id: feedId as string,
        folder: folder as string,
      },
      // @ts-ignore
      (prevData) => {
        if (!prevData) return { pages: [], pageParams: [] };

        const dividedItems = divideArray(newItems, 25);

        return {
          pages: prevData.pages.map((page, i) => ({
            ...page,
            transformedItems: dividedItems[i] ?? [],
          })),
          pageParams: prevData.pageParams,
        };
      },
    );
  };

  return { updateItemData, folder, feedId, sort };
};
