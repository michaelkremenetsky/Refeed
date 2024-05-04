import { Alert } from "react-native";
import { useAtomValue } from "jotai";

import { settingsAtom } from "../lib/stores/settings";
import { trpc } from "../utils/trpc";

export const useMarkAllRead = () => {
  const markAllAsRead = trpc.read.markAllRead.useMutation();
  const utils = trpc.useUtils();

  const settings = useAtomValue(settingsAtom);

  const markAllRead = (
    FeedType: "one" | "all" | "folder",
    feedIds?: string[],
  ) => {
    const markRead = async () => {
      if (FeedType == "all") {
        await markAllAsRead.mutateAsync({});
      }

      if (FeedType == "one") {
        utils.feed.getFeedsInFolders.setData(undefined, (prevData) => {
          if (!prevData) {
            return undefined;
          }

          const newFeeds = prevData.map((folder) => {
            folder.children?.forEach((feed) => {
              if (feedIds?.includes(feed.id)) {
                feed.amount = 0;
              }
            });

            return folder;
          });

          return newFeeds;
        });

        await markAllAsRead.mutateAsync({
          feedIds: [feedIds?.[0]!],
        });
      }

      if (FeedType == "folder") {
        // Get the ids of all the feeds in the folder
        utils.feed.getFeedsInFolders.setData(undefined, (prevData) => {
          if (!prevData) {
            return undefined;
          }

          const newFeeds = prevData.map((folder) => {
            folder.children?.forEach((feed) => {
              if (feedIds?.includes(feed.id)) {
                feed.amount = 0;
              }
            });

            return folder;
          });

          return newFeeds;
        });

        await markAllAsRead.mutateAsync({ feedIds });
      }

      utils.item.getUnreadItems.invalidate();
      utils.feed.getFeedsInFolders.invalidate();
    };

    if (settings.PromptWhenMarkingItemsRead) {
      markRead();
    } else {
      Alert.alert(
        "Mark Feed Read",
        "Are you sure you want to mark everything read?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              markRead();
            },
          },
        ],
      );
    }
  };

  return { markAllRead } as const;
};
