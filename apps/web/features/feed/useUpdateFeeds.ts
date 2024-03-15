import { useUpdateWebItemData } from "@refeed/features/item/useItemDataWeb";
import type { FeedType } from "@refeed/types/feed";
import type { ItemType } from "@refeed/types/item";

import { trpc } from "../../utils/trpc";

export const useUpdateFeeds = (items: ItemType[], FeedType?: FeedType) => {
  const utils = trpc.useUtils();

  const { updateItemData, sort } = useUpdateWebItemData();
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
    const feedsInFolders = utils.feed.getFeedsInFolders.getData();

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

    markReadMutation.mutate({ itemId: item.id });
    // utils.feed.getFeedsInFolders.invalidate(); // Might add this back

    if (FeedType != "recentlyread") {
      utils.item.getUnreadItems.reset({
        amount: 25,
        sort,
        type: "recentlyread",
      });
    }
  };

  return { markRead, updateItems };
};
