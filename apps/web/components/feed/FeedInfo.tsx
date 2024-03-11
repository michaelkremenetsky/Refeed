import { getFirstParagraphs } from "@lib/getFirstParagraph";
import dayjs from "dayjs";
import { useWindowSize } from "usehooks-ts";

import type { ItemType } from "@refeed/types/item";

import type { FeedTypes } from "../../types/feed";
import { BookmarkInfo } from "./BookmarkInfo";

export const FeedInfo = ({
  FeedType,
  item,
  removeSummary,
}: {
  FeedType: FeedTypes;
  item: ItemType;
  removeSummary?: boolean;
}) => {
  const hasAnyTypeOfBookmark =
    item?.temp_added_time ??
    item?.in_read_later == true ??
    item?.bookmark_folders?.length! > 0;

  const amountOfBookmarks =
    (item?.temp_added_time ? 1 : 0) +
    (item?.in_read_later ? 1 : 0) +
    item?.bookmark_folders?.length!;

  const showFeedName =
    FeedType == "all" ||
    FeedType == "multiple" ||
    FeedType == "recentlyread" ||
    FeedType == "bookmarks";

  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 500;

  // TODO: figure out a pure CSS solution for this
  return (
    <>
      <div className="flex flex-row">
        <div className="mt-1.5 flex max-w-fit flex-wrap gap-y-1">
          <div
            className={`${hasAnyTypeOfBookmark ? "ml-2" : "ml-1"} ${amountOfBookmarks >= 2 && "gap-y-1.5"} flex flex-wrap gap-x-1.5`}
          >
            <BookmarkInfo item={item} />
          </div>
          <div className={`flex ${amountOfBookmarks >= 2 && "ml-1.5 "}`}>
            <FeedName showFeedName={showFeedName} item={item} />
            <FeedDate item={item} />
          </div>
        </div>
      </div>
      {!isMobile && !removeSummary && (
        <Summary website_content={item?.website_content!} />
      )}
    </>
  );
};

export const FeedName = ({
  item,
  showFeedName,
}: {
  item: ItemType;
  showFeedName: boolean;
}) => (
  <>
    {showFeedName ? (
      <h4 className="font-regular max-w-[150px] shrink-0 truncate pb-1.5 pl-1 text-[13px] font-[400] leading-none text-neutral-400 dark:text-[#BDBDBD]/80 dark:text-stone-500">
        {item?.feed_title}
      </h4>
    ) : null}
  </>
);

export const FeedDate = ({ item }: { item: ItemType }) => (
  <h4
    className={`font-regular ml-1 shrink-0 pb-1.5 text-[13px] font-[400] leading-none text-neutral-400 dark:text-stone-500`}
  >
    {dayjs(item?.updated_at).fromNow()}
  </h4>
);

export const Summary = ({ website_content }: { website_content: string }) => {
  return (
    <div className="line-clamp-3 w-fit pl-2 text-[13px] font-[400] not-italic leading-snug text-neutral-400 md:w-[325px] dark:text-stone-500">
      <h1>{getFirstParagraphs(website_content)}</h1>
    </div>
  );
};
