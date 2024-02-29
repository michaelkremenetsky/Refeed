import {
  useItemData,
  useUpdateWebItemData,
} from "@refeed/features/item/useItemDataWeb";
import useWebParams from "@refeed/features/item/useWebParams";
import type { ItemType } from "@refeed/types/item";

import { trpc } from "../../utils/trpc";

export const useUpdateBookmarkFolders = () => {
  const utils = trpc.useUtils();
  const addToBookmarkFolder =
    trpc.bookmark.addBookmarkFolderToItem.useMutation();
  const removeBookmarkFolder =
    trpc.bookmark.removeBookmarkFolderFromItem.useMutation();

  const { updateItemData } = useUpdateWebItemData();
  const { items } = useItemData();
  const { sort, FeedType, folder, feedId } = useWebParams();

  const toggleBookmarkFolder = async (
    openItem: ItemType,
    folderName: string,
  ) => {
    // Get the newFolders to update the local cache
    const oldBookmarkFolders = openItem.bookmark_folders;
    const hasFolder = openItem.bookmark_folders?.includes(folderName);

    let newFolders: string[] = [];
    if (hasFolder) {
      newFolders = oldBookmarkFolders?.filter((folder) => {
        return folder !== folderName;
      })!;
    } else {
      newFolders = [...oldBookmarkFolders!, folderName];
    }

    const newItems = items?.map((item) => {
      if (item.id == openItem.id) {
        return {
          ...item,
          bookmark_folders: newFolders,
        };
      } else {
        return item;
      }
    });
    updateItemData(newItems);

    // Update on the server Side
    if (hasFolder) {
      await removeBookmarkFolder.mutateAsync({
        folderName: folderName,
        itemId: openItem.id,
      });
      utils.bookmark.getBookmarkFoldersForUser.invalidate();
    } else {
      await addToBookmarkFolder.mutateAsync({
        itemId: openItem.id,
        folderName: folderName,
      });
      utils.bookmark.getBookmarkFoldersForUser.invalidate();
    }

    // Make sure the bookmark and recently read feeds are updated when you add/remove a bookmark
    if (FeedType != "bookmarks") {
      utils.item.getUnreadItems.reset({
        amount: 25,
        sort,
        type: "bookmarks",
        feed_id: feedId as string,
        folder: folder as string,
      });
    }
    if (FeedType != "recentlyread") {
      utils.item.getUnreadItems.reset({
        amount: 25,
        sort,
        type: "recentlyread",
        feed_id: feedId as string,
        folder: folder as string,
      });
    }
  };

  return { toggleBookmarkFolder };
};
