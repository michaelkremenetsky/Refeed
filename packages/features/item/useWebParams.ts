import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { match } from "ts-pattern";

import { Sort } from "../../../apps/web/stores/ui";
import type { FeedType } from "./useItemDataWeb";

const useWebParams = () => {
  const { pathname, query } = useRouter();
  const { folder, feedId } = query;
  const sort = useAtomValue(Sort);

  const FeedType = match(pathname)
    .with("/feed/all", () => "all")
    .with("/recentlyread", () => "recentlyread")
    .with("/bookmarks", () => "bookmarks")
    .with("/feed/[feedId]", () => "one")
    .with("/folder/[folder]", () => "multiple")
    .with("/discover/[feedId]", () => "discover")
    .with("/feed/search", () => "search")
    .otherwise(() => "all");

  return { sort, FeedType: FeedType as FeedType, folder, feedId };
};

export default useWebParams;
