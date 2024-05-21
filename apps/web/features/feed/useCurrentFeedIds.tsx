import { useFeedsInFolders } from "@features/folders/useFeedsInFolders";

import useWebParams from "../../../../packages/features/item/useWebParams";

export const useCurrentFeedIds = () => {
  let feedIds: string[] | undefined = [];

  const { FeedType, folder, feedId } = useWebParams();

  const { feedsInFolders } = useFeedsInFolders();

  if (FeedType == "one") {
    if (typeof feedId === "string") {
      feedIds = [feedId];
    }
  }
  if (FeedType == "multiple") {
    feedIds = feedsInFolders
      ?.find((f) => f.name == folder)
      ?.children?.map((feed) => feed.id);
  }

  return { feedIds, FeedType };
};
