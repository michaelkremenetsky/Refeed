interface AllFeedTypeProps {
  FeedType: "all";
}

interface RecentlyReadFeedTypeProps {
  FeedType: "recentlyread";
}

interface BookmarksFeedTypeProps {
  FeedType: "bookmarks";
}

interface OneFeedTypeProps {
  FeedType: "one";
  feedId: string;
}

interface MultipleFeedTypeProps {
  FeedType: "multiple";
  folderName: string;
}

interface SearchFeedTypeProps {
  FeedType: "search";
  query: string;
}

interface NewslettersFeedTypeProps {
  FeedType: "newsletters";
}

export type FeedTypes =
  | AllFeedTypeProps[`FeedType`]
  | RecentlyReadFeedTypeProps[`FeedType`]
  | BookmarksFeedTypeProps[`FeedType`]
  | OneFeedTypeProps[`FeedType`]
  | MultipleFeedTypeProps[`FeedType`]
  | SearchFeedTypeProps[`FeedType`]
  | NewslettersFeedTypeProps[`FeedType`];

export type FeedLayoutTypes =
  | AllFeedTypeProps
  | RecentlyReadFeedTypeProps
  | BookmarksFeedTypeProps
  | OneFeedTypeProps
  | MultipleFeedTypeProps
  | SearchFeedTypeProps
  | NewslettersFeedTypeProps;
