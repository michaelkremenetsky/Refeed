import { toHttps } from "@refeed/lib/toHttps";

import { trpc } from "../utils/trpc";

export interface Feed {
  title: string;
  description: string;
  link: string;
  updated?: Date;
  FeedType: "rss" | "atom";
  entries: Entry[];
  error: string;
  favicon: string;
}

interface Entry {
  title: string;
  link: string;
  updated: Date;
  content: string;
}

export const useCheckSource = (link: string) => {
  const regex = /^(https?:\/\/)?((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/[^\s]*)?$/;
  2;
  const feed = trpc.feed.getFeed.useQuery({ url: link });
  const feedsInFolders = trpc.feed.getFeedsInFolders.useQuery(undefined, {
    enabled: false,
  }).data;

  let error;

  const previewFeed = !regex.test(link)
    ? undefined
    : {
        ...feed.data,
        favicon: new URL(toHttps(link)).origin + "/favicon.ico",
        link: toHttps(link),
        title: feed.data?.title,
        error,
      };

  const folders = feedsInFolders?.map((folder) => folder.name);

  return { previewFeed, folders } as const;
};
