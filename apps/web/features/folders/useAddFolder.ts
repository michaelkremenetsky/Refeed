import { useCallback } from "react";

import type { feedsInFoldersType } from "@refeed/types/feed";

import { trpc } from "../../utils/trpc";

export const useAddFolder = () => {
  const utils = trpc.useUtils();
  const feedsInFolders = utils.feed.getFeedsInFolders.getData();
  const change = trpc.feed.setFeedOrder.useMutation();

  const addFolder = useCallback(
    async (folderName: string) => {
      const feedsInFolders = utils.feed.getFeedsInFolders.getData();

      const newFolderFeeds: feedsInFoldersType = JSON.parse(
        JSON.stringify(feedsInFolders),
      );

      // Add new folder to the list
      newFolderFeeds.push({
        name: folderName,
        id: folderName,
        folded: true,
        children: [],
      });

      const newOrder = newFolderFeeds.map((folder, index) => {
        if (folder.children) {
          return {
            folder_name: folder.name,
            order: index,
            folded: folder.folded,
            children: folder.children.map((feed, index) => {
              return {
                order: index,
                feedId: feed.id,
              };
            }),
          };
        } else {
          return {
            order: index,
            folded: folder.folded,
            folder_name: folder.name,
            children: undefined,
          };
        }
      });

      // @ts-ignore Optimistically update the cache
      utils.feed.getFeedsInFolders.setData(undefined, newFolderFeeds);

      await change.mutateAsync({ feedOrder: newOrder });
      utils.feed.getFeedsInFolders.invalidate();
    },
    [feedsInFolders, utils, change],
  );

  return { addFolder };
};
