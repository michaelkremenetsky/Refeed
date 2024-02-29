import { useUpdateMobileItemData } from "@refeed/features/item/useItemDataMobile";
import type { ItemType } from "@refeed/types/item";

import { trpc } from "../utils/trpc";

export const useUpdateFeeds = (items: ItemType[]) => {
  const utils = trpc.useUtils();

  const { data: feedsInFolders } = trpc.feed.getFeedsInFolders.useQuery();
  const { updateItemData } = useUpdateMobileItemData();

  const markReadMutation = trpc.read.markItemRead.useMutation();

  function updateItems(item: ItemType) {
    const newItems = items?.map((i) => {
      if (i.id == item.id) {
        return {
          ...i,
          marked_read: true,
        };
      } else {
        return i;
      }
    });

    updateItemData(newItems);
  }
  const markRead = (item: ItemType) => {
    if (!item.marked_read_time) {
      updateItems(item);

      const updatedFolderFeeds = feedsInFolders?.map((folder) => {
        if (folder.children) {
          const updatedChildren = folder.children.map((feed) => {
            if (feed.id == item.feed_id) {
              if (!item.marked_read) {
                feed.amount = feed.amount - 1;
              }
            }
            return feed;
          });
          return {
            ...folder,
            children: updatedChildren,
          };
        } else {
          return folder;
        }
      });

      utils.feed.getFeedsInFolders.setData(undefined, (data) => {
        if (!data) {
          return undefined;
        }

        return updatedFolderFeeds;
      });
    }

    markReadMutation.mutateAsync({ itemId: item.id });
    utils.feed.getFeedsInFolders.invalidate();

    // Add this back later
    //     if (FeedType != "recentlyread") {
    //   utils.item.getUnreadItems.reset({
    //     amount: 25,
    //     sort,
    //     type: "recentlyread",
    //     feed_id: feedId as string,
    //     folder: folder as string,
    //   });
    // }
  };

  return { markRead, updateItems };
};
