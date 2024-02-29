import type { feedsInFoldersType } from "@refeed/types/feed";

import { trpc } from "../../utils/trpc";

export const useRenameFolder = () => {
  const utils = trpc.useUtils();
  const change = trpc.feed.setFeedOrder.useMutation();

  const renameFolder = (oldFolderName: string, newFolderName: string) => {
    const feedsInFolders = utils.feed.getFeedsInFolders.getData();

    const newFolderFeeds: feedsInFoldersType = JSON.parse(
      JSON.stringify(feedsInFolders),
    );

    const updatedFolderFeeds = newFolderFeeds.map((folder) =>
      folder.name === oldFolderName
        ? { ...folder, name: newFolderName }
        : folder,
    );

    // @ts-ignore fix date_added on feed type
    utils.feed.getFeedsInFolders.setData(undefined, updatedFolderFeeds);

    // Update order in the DB
    const newOrder = updatedFolderFeeds.map((folder, index) => {
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
  };

  return { renameFolder };
};
