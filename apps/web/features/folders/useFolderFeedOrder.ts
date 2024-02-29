import { useCallback } from "react";

import type { feedsInFoldersType } from "@refeed/types/feed";

import { trpc } from "../../utils/trpc";

export const useModifyFeedOrder = () => {
  const utils = trpc.useUtils();
  const change = trpc.feed.setFeedOrder.useMutation();

  // Called when ever a folder or feed is moved
  const onMove = useCallback(
    ({ dragIds, parentId, index }: any) => {
      const feedsInFolders = utils.feed.getFeedsInFolders.getData();

      // Check if the dragId is the name of a parent folder and if parentId is null
      const isFolder = feedsInFolders?.find(
        (folder) => folder.name == dragIds[0],
      );

      // Find the feed with the feedId and move it to the new parentId on the index
      let newFolderFeeds: feedsInFoldersType = JSON.parse(
        JSON.stringify(feedsInFolders),
      );

      // If it is a folder than move it the new index
      if (isFolder) {
        // Find the current index of the folder
        const currentIndex = newFolderFeeds.findIndex(
          (folder) => folder.name == dragIds[0],
        );

        // Remove the folder from the old index
        const folder = newFolderFeeds.splice(currentIndex, 1);

        // Add the folder to the new index
        // @ts-ignore
        newFolderFeeds.splice(index, 0, folder[0]);

        // Prevent user from moving feed to root as backend doesn't support it
      } else if (parentId == null) {
        return;
      }

      // Prevent user from moving folder into another folder as backend doesn't support it
      if (
        newFolderFeeds.find((folder) => folder.name == parentId) &&
        newFolderFeeds.find((folder) => folder.name == dragIds[0])
      ) {
        return;
      }

      const feedId = dragIds[0];

      feedsInFolders?.forEach((folder) => {
        if (dragIds[0] == folder.name) {
          return;
        }
      });

      // Find the feed that was moved
      const feed = newFolderFeeds
        .map((folder) => folder.children)
        .flat()
        .find((feed) => feed?.id === feedId);

      // Remove the feed from the old folder (remember you don't have the old folder so you have to search for it)
      newFolderFeeds = newFolderFeeds.map((folder) => {
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
      newFolderFeeds = newFolderFeeds.map((folder) => {
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

      // @ts-ignore fix date_added on feed type
      utils.feed.getFeedsInFolders.setData(undefined, newFolderFeeds);

      // Convert to the format that the DB expects
      const newOrder = newFolderFeeds.map((folder, folderIndex) => {
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

      const newFolderFeeds: feedsInFoldersType = JSON.parse(
        JSON.stringify(feedsInFolders),
      );

      const toggleFolder = newFolderFeeds.find(
        (folder) => folder.name == toggledFolder,
      );

      if (toggleFolder) {
        toggleFolder.folded = !toggleFolder.folded;
      }

      // @ts-ignore fix date_added on feed type
      utils.feed.getFeedsInFolders.setData(undefined, newFolderFeeds);

      // Update order in the DB
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

      change.mutate({ feedOrder: newOrder });
    },
    [change, utils.feed.getFeedsInFolders],
  );

  return { onMove, onToggle };
};
