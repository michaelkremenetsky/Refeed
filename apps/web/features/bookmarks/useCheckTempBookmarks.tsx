import { useEffect } from "react";
import { trpc } from "@utils/trpc";

import type { FeedType } from "@refeed/types/feed";

export const useCheckTempBookmarks = ({
  FeedType,
  isFetching,
}: {
  FeedType: FeedType;
  isFetching: boolean;
}) => {
  // Check if Temporary Bookmarks should be removed
  const TempBookmarks = trpc.bookmark.checkTempBookmarks.useMutation();
  useEffect(() => {
    if (FeedType == "bookmarks" && isFetching) {
      TempBookmarks.mutate();
    }
  }, [isFetching]);
};
