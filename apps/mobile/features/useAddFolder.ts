import { useCallback } from "react";
import { Alert } from "react-native";

import type { feedsInFoldersType } from "@refeed/types/feed";

import { trpc } from "../utils/trpc";

export const useAddFolder = () => {
  const utils = trpc.useUtils();
  const folderFeeds = utils.feed.getFeedsInFolders.getData();
  const change = trpc.feed.setFeedOrder.useMutation();

  const addFolderToDB = useCallback(
    (folderName: string) => {
      const newFolderFeeds: feedsInFoldersType = JSON.parse(
        JSON.stringify(folderFeeds),
      );

      // Add new folder to the list
      newFolderFeeds.push({
        name: folderName,
        id: folderName,
        folded: false,
        children: [],
      });

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

      // @ts-ignore
      utils.feed.getFeedsInFolders.setData(undefined, newFolderFeeds);

      change.mutateAsync({ feedOrder: newOrder });
    },
    [folderFeeds, utils, change],
  );

  const addFolder = () => {
    Alert.prompt(
      "Add Folder",
      "Type the name of the folder",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: (folderName) => addFolderToDB(folderName!),
        },
      ],
      "plain-text",
    );
  };

  return { addFolder };
};
