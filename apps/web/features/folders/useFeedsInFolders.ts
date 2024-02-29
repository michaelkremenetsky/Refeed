import { useEffect } from "react";
import { useAtomValue } from "jotai";
import type { OpenMap } from "react-arborist/dist/module/state/open-slice";

import { settingsAtom } from "../../stores/settings";
import { trpc } from "../../utils/trpc";

export const useFeedsInFolders = () => {
  const settings = useAtomValue(settingsAtom);

  const {
    isFetching,
    isPending,
    isFetched,
    refetch,
    data: feedsInFolders,
  } = trpc.feed.getFeedsInFolders.useQuery(undefined, {});

  const totalItemAmount = feedsInFolders?.reduce((acc, folder) => {
    if (folder.children) {
      return (
        acc +
        folder.children.reduce((acc, feed) => {
          return acc + feed.amount;
        }, 0)
      );
    } else {
      return acc;
    }
  }, 0);

  const OpenState = feedsInFolders?.reduce((acc: OpenMap, folder) => {
    acc[folder.id] = folder.folded ?? true;
    return acc;
  }, {} satisfies OpenMap);

  // Sort the children with the most items first
  if (settings.SortFeedsByAmountOfUnreadItems) {
    feedsInFolders?.forEach((folder) => {
      if (folder.children) {
        folder.children.sort((a, b) => b.amount - a.amount);
      }
    });
  }

  useEffect(() => {
    refetch();
  }, [settings.SortFeedsByAmountOfUnreadItems]);

  // Filter out feeds with the same feedId (although should figure out how they good there in the first place)
  feedsInFolders?.forEach((folder) => {
    if (folder.children) {
      folder.children = folder.children.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
      );
    }
  });

  const feedIds = feedsInFolders?.flatMap((folder) => {
    return folder.children?.map((feed) => feed.id);
  });

  return {
    feedsInFolders,
    isFetching,
    isFetched,
    isPending,
    totalItemAmount,
    OpenState,
    feedIds,
  };
};
