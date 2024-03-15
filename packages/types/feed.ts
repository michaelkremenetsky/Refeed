export type FeedType =
  | "all"
  | "recentlyread"
  | "bookmarks"
  | "one"
  | "multiple"
  | "discover"
  | "newsletters";

export type feedsInFoldersType = (
  | {
      id: string;
      name: string;
      folded: boolean;
      children?: undefined;
    }
  | {
      id: string;
      name: string;
      folded: boolean;
      children: {
        id: string;
        name: string;
        amount: number;
        summary: string;
        feed_url: string;
        logo_url: string;
        date_added?: Date;
      }[];
    }
)[];
