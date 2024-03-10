import { useUpdateWebItemData } from "@refeed/features/item/useItemDataWeb";
import type { ItemType } from "@refeed/types/item";

import { trpc } from "../../utils/trpc";

// NOTE: not in use for now

export const useOpenItemInSearch = (items: ItemType[]) => {
  const utils = trpc.useUtils();

  const { updateItemData } = useUpdateWebItemData();
  const markReadMutation = trpc.read.markItemRead.useMutation();

  const openItem = (item: ItemType) => {
    const feedsInFolders = utils.feed.getFeedsInFolders.getData();

    if (!item.marked_read_time) {
      // Check if the item is already in the list
      const addedSearchItem = items;
      const isAlreadyThere = addedSearchItem?.find((i) => i.id == item.id);

      // Add the search Item on top if its not
      if (!isAlreadyThere) {
        addedSearchItem.unshift(item);
      }

      updateItemData(addedSearchItem);

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
    utils.feed.getFeedsInFolders.invalidate();
  };

  return { openItem };
};
