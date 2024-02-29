import { useCallback } from "react";

import type { feedsInFoldersType } from "@refeed/types/feed";

import { trpc } from "../utils/trpc";

export const useModifyFeedOrder = () => {
  const utils = trpc.useUtils();
  const change = trpc.feed.setFeedOrder.useMutation();

  const onMove = useCallback(
    ({
      dragIds,
      parentId,
      index,
    }: {
      dragIds: string[];
      parentId: string;
      index: number;
    }) => {
      const feedsInFolders = utils.feed.getFeedsInFolders.getData();

      // Prevent user from moving feed to root as backend doesn't support it
      if (parentId == null) {
        return;
      }

      // Find the feed with the feedId and move it to the new parentId on the index
      let newFeedsInFolders: feedsInFoldersType = JSON.parse(
        JSON.stringify(feedsInFolders),
      );

      const feedId = dragIds[0];

      feedsInFolders?.forEach((folder) => {
        if (dragIds[0] == folder.name) {
          return;
        }
      });

      // Find the feed that was moved
      const feed = newFeedsInFolders
        .map((folder) => folder.children)
        .flat()
        .find((feed) => feed?.id === feedId);

      // Remove the feed from the old folder (remember you don't have the old folder so you have to search for it)
      newFeedsInFolders = newFeedsInFolders.map((folder) => {
        if (folder.children) {
          return {
            ...folder,
            children: folder.children.filter((feed) => feed.id !== feedId),
          };
        } else {
          return folder;
        }
      });

      // Add the feed to the new folder
      // @ts-ignore (Look at this)
      newFeedsInFolders = newFeedsInFolders.map((folder) => {
        if (folder.id === parentId && folder.children) {
          return {
            ...folder,
            children: [
              ...folder.children.slice(0, index),
              {
                ...feed,
              },
              ...folder.children.slice(index),
            ],
          };
        } else {
          return folder;
        }
      });

      // @ts-ignore
      utils.feed.getFeedsInFolders.setData(undefined, newFeedsInFolders);

      // Convert to the format that the DB expects
      const newOrder = newFeedsInFolders.map((folder, folderIndex) => {
        if (folder.children) {
          return {
            folder_name: folder.name,
            order: folderIndex,
            folded: folder.folded,
            children: folder.children.map((feed, feedIndex) => {
              return {
                order: feedIndex,
                feedId: feed.id,
              };
            }),
          };
        } else {
          return {
            order: folderIndex,
            folder_name: folder.name,
            folded: folder.folded,
            children: undefined,
          };
        }
      });

      change.mutate({ feedOrder: newOrder });
    },
    [change, utils.feed.getFeedsInFolders],
  );

  // Called whenever a folder is toggled
  const onToggle = useCallback(
    (toggledFolder: string) => {
      const feedsInFolders = utils.feed.getFeedsInFolders.getData();

      const newFeedsInFolders: feedsInFoldersType = JSON.parse(
        JSON.stringify(feedsInFolders),
      );

      const toggleFolder = newFeedsInFolders.find(
        (folder) => folder.name == toggledFolder,
      );

      if (toggleFolder) {
        toggleFolder.folded = !toggleFolder.folded;
      }

      // @ts-ignore
      utils.feed.getFeedsInFolders.setData(undefined, newFeedsInFolders);

      // Update order in the DB
      const newOrder = newFeedsInFolders.map((folder, index) => {
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

      change.mutate({ feedOrder: newOrder });
    },
    [change, utils.feed.getFeedsInFolders],
  );

  return { onMove, onToggle };
};
