import { BookmarkInfo } from "@components/feed/BookmarkInfo";
import { getFirstParagraphs } from "@lib/getFirstParagraph";
import dayjs from "dayjs";
import Balancer from "react-wrap-balancer";

import { decodeHtmlEntities } from "@refeed/lib/decodeHtmlEntities";
import type { ItemType } from "@refeed/types/item";

import type { FeedTypes } from "../../types/feed";
import { MagazineImage } from "./MagazineImage";

export const NonLinkedSearchItem = ({
  item,
  FeedType,
}: {
  item?: ItemType;
  FeedType: FeedTypes;
}) => (
  <div
    className={`mx-1 mt-1 flex flex-row space-x-[4px] rounded-md pb-2 pt-2
          ${item?.marked_read ? "opacity-80" : ""}
        `}
  >
    <MagazineImage item={item!} FeedType={FeedType} />
    <div className="flex w-full flex-col">
      <SearchTitle FeedType={FeedType} title={item?.title ?? ""} />
      <FeedInfo FeedType={FeedType} item={item!} />
    </div>
  </div>
);

const FeedInfo = ({
  FeedType,
  item,
}: {
  FeedType: FeedTypes;
  item: ItemType;
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
    FeedType == "bookmarks" ||
    FeedType == "search";

  // TODO: figure out a pure CSS solution for this
  return (
    <>
      <div className="flex flex-row">
        <div className="mt-1.5 flex flex-wrap">
          <div className={`${hasAnyTypeOfBookmark ? "ml-2" : "ml-1"} flex`}>
            <BookmarkInfo item={item} />
          </div>
          <div
            className={`flex ${amountOfBookmarks >= 2 && "ml-1.5 "} ${
              amountOfBookmarks >= 2 && showFeedName && "mt-1"
            }`}
          >
            <FeedName showFeedName={showFeedName} item={item} />
            <FeedDate item={item} />
          </div>
        </div>
      </div>
      <Summary website_content={item?.website_content!} />
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
      <h4 className="font-regular shrink-0 truncate pb-1.5 pl-1 text-[13px] font-[400] leading-none text-neutral-400 md:max-w-[150px] dark:text-[#BDBDBD]/80 dark:text-stone-500">
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
    <h1 className="line-clamp-3 w-full max-w-[365px] truncate pl-2 text-[13px] font-[400] not-italic leading-snug text-neutral-400 dark:text-stone-500">
      {getFirstParagraphs(website_content)}
    </h1>
  );
};

export const SearchTitle = (props: { title: string; FeedType: FeedTypes }) => (
  <Balancer
    className={`w-full select-text pl-2 pt-1 text-[15px] font-[600] leading-[18px] subpixel-antialiased ${
      props.FeedType != "bookmarks"
        ? "text-[#333338] dark:text-stone-200"
        : null
    }`}
    preferNative={false}
    ratio={0.4}
  >
    {decodeHtmlEntities(props.title)}
  </Balancer>
);
