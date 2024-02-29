export type FeedError =
  | "Issue with Parsing Feed"
  | "Issue with Refreshing Feed"
  | "Feed URL not Valid"
  | "Issue adding Feed to User"
  | "Link Returns 404"
  | undefined;

export type importProgressType =
  | {
      title: string;
      // Step 1 means the feed was added to DB and refreshed
      // Step 2 means it was added to user and is done
      step?: "Step 1" | "Step 2";
      error?: FeedError;
    }[]
  | undefined;
