import { Alert } from "react-native";
import { useAtomValue } from "jotai";

import { settingsAtom } from "../lib/stores/settings";
import { trpc } from "../utils/trpc";

export const useMarkAllRead = () => {
  const markAllAsRead = trpc.read.markAllRead.useMutation();

  const settings = useAtomValue(settingsAtom);

  const markAllRead = (FeedType: "one" | "all", feedId?: string) => {
    if (settings.PromptWhenMarkingItemsRead) {
      FeedType == "one"
        ? markAllAsRead.mutate({ feedId: feedId })
        : FeedType == "all"
          ? markAllAsRead.mutate({})
          : null;
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
              FeedType == "one"
                ? markAllAsRead.mutate({ feedId: feedId })
                : FeedType == "all"
                  ? markAllAsRead.mutate({})
                  : null;
            },
          },
        ],
      );
    }
  };

  return { markAllRead } as const;
};
