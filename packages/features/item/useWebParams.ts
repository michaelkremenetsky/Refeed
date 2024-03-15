import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import { match } from "ts-pattern";

import type { FeedType } from "@refeed/types/feed";

import { Sort } from "../../../apps/web/stores/ui";

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
    .with("/feed/newsletters", () => "newsletters")
    .otherwise(() => "all");

  return { sort, FeedType: FeedType as FeedType, folder, feedId };
};

export default useWebParams;
