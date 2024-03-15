import { useEffect, useState } from "react";

import { toHttps } from "@refeed/lib/toHttps";

import { trpc } from "../../utils/trpc";

interface Feed {
  title: string | undefined;
  link: string;
  updated?: Date;
  items: Item[];
  error: string | undefined;
  favicon: string;
}

interface Item {
  title: string;
  link: string;
  updated: Date;
  content: string;
}

export const useCheckSource = (
  defaultLink: string,
  searchLink?: string,
  feed_title?: string,
  favicon_url?: string,
) => {
  const [clientFetchedFeed, setClientFetchedFeed] = useState<Feed | undefined>(
    undefined,
  );

  // eslint-disable-next-line prefer-const
  let [error, setError] = useState<string | undefined>(undefined);

  const feedsInFolders = trpc.feed.getFeedsInFolders.useQuery(undefined, {
    enabled: false,
  }).data;

  const utils = trpc.useUtils();

  // TODO: Add debounce back as it was causing issues before
  const checkSource = async (query: string) => {
    if (query) {
      const regex =
        /^(https?:\/\/)?((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/[^\s]*)?$/;

      if (!regex.test(query)) {
        return;
      }

      try {
        // Get Feed is very slow on hacker news for some reason
        const feed = await utils.feed.getFeed.fetch({ url: query });

        // Check if feed already exists in folder feeds
        feedsInFolders?.forEach((folder) => {
          if (folder.children) {
            folder.children.map((feed) => {
              if (feed.feed_url == query) {
                setError("Feed already in a folder");
              }
            });
          }
        });

        if (!feed?.title || !feed.feedUrl) {
          throw Error;
        }

        if (feed) {
          const link = toHttps(query);

          const favicon =
            "https://www.google.com/s2/favicons?domain=" + link + "&sz=128";
          const preview = { ...feed, favicon, link: query, error };

          setClientFetchedFeed(preview as Feed);
          setError(undefined);
        }
      } catch {
        setError("Issue with fetching Feed");
      }
    }
  };

  // Get folders from the feedsInFolders
  const folders = feedsInFolders?.map((folder) => folder.name);

  useEffect(() => {
    if (!defaultLink) {
      checkSource(defaultLink);
    }
    if (searchLink) {
      checkSource(searchLink);
    }
  }, []);

  const previewFeed = !clientFetchedFeed
    ? {
        title: feed_title,
        favicon: favicon_url!,
        link: defaultLink,
        error: undefined,
      }
    : clientFetchedFeed;

  // Check if the feed already exists by checking the feedsInFolders
  feedsInFolders?.forEach((folder) => {
    if (folder.children) {
      folder.children.map((feed) => {
        if (feed.feed_url == defaultLink) {
          error = "Feed already in a folder";
        }
      });
    }
  });

  // Get amount of feeds total in the folders
  const totalFeedsInFolders = feedsInFolders?.reduce(
    (acc, folder) => acc + folder?.children?.length!,
    0,
  );

  return {
    checkSource,
    folders,
    previewFeed,
    totalFeedsInFolders,
    error,
    setError,
  };
};
