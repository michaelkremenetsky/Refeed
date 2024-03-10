import { useNavigationState } from "@react-navigation/native";

import { divideArray } from "@refeed/lib/divideArray";
import type { ItemType } from "@refeed/types/item";

import { filterItems } from "../filters/filterItems";
import { trpc } from "../trpc";
import useMobileParams from "./useMobileParams";

export type FeedType =
  | "all"
  | "recentlyread"
  | "bookmarks"
  | "one"
  | "multiple";

export const useItemData = () => {
  const { sort, FeedType, folder, feedId } = useMobileParams();

  const {
    data: rawItems,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    refetch,
    isFetchingNextPage,
  } = trpc.item.getUnreadItems.useInfiniteQuery(
    {
      amount: 25,
      sort,
      type: FeedType,
      feed_id: feedId as string | undefined,
      folder: folder as string | undefined,
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
    isPending,
    refetch,
    isFetchingNextPage,
    FeedType,
    folder,
  };
};

// For use with reader and bookmarks
export const useOpenItem = () => {
  const { items } = useItemData();

  const itemId = useNavigationState((state) => {
    return state.routes.find((route) => route.name === "Item");
    // @ts-ignore
  })?.params?.itemId;

  const openItem = items.find((i) => {
    return i?.id == itemId;
  });

  return { openItem };
};

export const useUpdateMobileItemData = () => {
  // Updates the cache Optimistically
  const { sort, FeedType, folder, feedId } = useMobileParams();
  const utils = trpc.useUtils();

  const updateItemData = (newItems: ItemType[]) => {
    utils.item.getUnreadItems.setInfiniteData(
      {
        amount: 25,
        sort,
        type: FeedType,
        feed_id: feedId,
        folder: folder,
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

  return { updateItemData };
};
