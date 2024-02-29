import Image from "next/legacy/image";
import Link from "next/link";
import router from "next/router";
import { CardBookmarkInfo } from "@components/feed/CardBookmarkInfo";
import { motion } from "framer-motion";

import type { ItemType } from "@refeed/types/item";

import type { FeedTypes } from "../../types/feed";
import { FeedDate, FeedName } from "./FeedInfo";
import { CardTitle } from "./FeedTitle";

export const CardItem = (props: {
  i: number;
  item: ItemType;
  items: ItemType[];
  FeedType: FeedTypes;
  markRead: () => void;
}) => {
  const { item, markRead, FeedType } = props;
  const pathWithoutQuery = router.asPath.split("?")[0];

  return (
    <Link
      href={
        FeedType == "search"
          ? `${pathWithoutQuery}/?searchItem=` + item?.id
          : `${pathWithoutQuery}/?item=` + item?.id
      }
      replace={false}
      shallow
      scroll
      onClick={() => {
        markRead();
      }}
    >
      <NonLinkedCardItem item={item} FeedType={FeedType} />
    </Link>
  );
};

export const NonLinkedCardItem = ({
  item,
  FeedType,
}: {
  item?: ItemType;
  FeedType: FeedTypes;
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

  // TODO: figure out a pure CSS solution for this
  return (
    <motion.div
      layout
      className={`relative h-60 cursor-pointer rounded-md bg-white pb-2 shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)] hover:border-neutral-200 hover:bg-neutral-50/50 dark:border-neutral-700 dark:bg-[#141415] dark:shadow-none   dark:hover:border-neutral-700 dark:hover:bg-[#141415] ${
        item?.marked_read ? "opacity-70" : " dark:bg-[#0f0f10]"
      }`}
    >
      <div className={`relative h-28 w-full dark:bg-[#0f0f10] `}>
        {item?.image_url === "" || !item?.image_url === null ? (
          <div className="w-min-screen h-[105px] rounded-t-md" />
        ) : (
          <Image
            src={item?.image_url ?? ""}
            alt="image"
            layout="fill"
            className="rounded-t-md object-cover"
          />
        )}
      </div>
      <div className="flex flex-row">
        <div className="flex max-w-[325px] flex-wrap">
          <div className="my-1.5">
            <CardTitle FeedType={FeedType} title={item?.title ?? ""} />
          </div>
          <div
            className={`${hasAnyTypeOfBookmark ? "ml-2" : "ml-1"} flex flex-wrap`}
          >
            <CardBookmarkInfo
              item={item!}
              amountOfBookmarks={amountOfBookmarks}
            />
          </div>
          <div
            className={`flex py-0.5 ${amountOfBookmarks >= 2 ? "ml-1.5" : "ml-1"} ${
              amountOfBookmarks >= 2 && showFeedName && "mt-1"
            }`}
          >
            <FeedName showFeedName={showFeedName} item={item!} />
            <FeedDate item={item!} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
