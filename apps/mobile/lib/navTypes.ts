import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PurchasesOffering } from "react-native-purchases";



import type { ItemType } from "@refeed/types/item";





interface MainPropsOne {
  feedId: string;
  FeedType: "one";
}

interface MainPropsAll {
  FeedType: "all";
}

interface MainPropsBookmarks {
  FeedType: "bookmarks";
}

interface MainPropsRecentlyRead {
  FeedType: "recentlyread";
}

interface MultipleFeedTypeProps {
  FeedType: "multiple";
  feedIds: string[];
  folderName: string;
}

interface DiscoverFeedTypeProps {
  feedId: string;
  FeedType: "discover";
}

export type MainProps =
  | MainPropsOne
  | MainPropsAll
  | MainPropsBookmarks
  | MainPropsRecentlyRead
  | MultipleFeedTypeProps
  | DiscoverFeedTypeProps;

export type FeedType =
  | "all"
  | "recentlyread"
  | "bookmarks"
  | "one"
  | "multiple"
  | "discover"
  | "search";

// Create a type that makes feedId optional if FeedType is "all" or "recentlyread" or "bookmarks"
type ItemParams =
  | {
      index: number;
      itemId?: never;
      type?: FeedType;
      feedId?: string;
      searchQuery?: string;
      customItems: ItemType[];
    } // This dosen't work
  | {
      index?: never;
      itemId: string;
      type?: FeedType;
      feedId?: string;
      searchQuery?: string;
      customItems: ItemType[];
    };

export interface NavigatorParams {
  Feed: {
    feedId?: string;
    type: FeedType;
    passItems?: ItemType[];
    screen: string;
    title?: string;
  };
  Bookmark: {
    feedId?: string;
    type: FeedType;
    passItems?: ItemType[];
    screen: string;
    title?: string;
  };
  Tabs: undefined;
  Reader: { index: number }; // Import custom items into the reader
  Item: ItemParams;
  Offering: { offering: PurchasesOffering | null };

  [key: string]: object | undefined;
}

export type ReaderProps = NativeStackScreenProps<NavigatorParams, "Item">;

export type FeedProps = NativeStackScreenProps<NavigatorParams, "Feed">;

export type BookmarkProps = NativeStackScreenProps<NavigatorParams, "Bookmark">;

export type TabProps = NativeStackScreenProps<NavigatorParams, "Tabs">;