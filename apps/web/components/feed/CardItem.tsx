import Image from "next/legacy/image";
import Link from "next/link";
import router from "next/router";
import { FeedInfo } from "@components/feed/FeedInfo";

import type { ItemType } from "@refeed/types/item";

import type { FeedTypes } from "../../types/feed";
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
  return (
    <div
      className={`relative h-60 w-full cursor-pointer overflow-hidden rounded-md bg-white pb-2 shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)] hover:border-neutral-200 hover:bg-neutral-50/50 dark:border-neutral-700 dark:bg-[#141415] dark:shadow-none dark:hover:border-neutral-700 dark:hover:bg-[#141415] ${
        item?.marked_read ? "opacity-70" : "dark:bg-[#0f0f10]"
      }`}
    >
      <div className={`relative h-28 w-full dark:bg-[#0f0f10] `}>
        {item?.image_url === "" || !item?.image_url === null ? (
          <div className="w-min-screen rounded-t-md" />
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
        <div className="flex flex-wrap">
          <div className="my-1.5">
            <CardTitle FeedType={FeedType} title={item?.title ?? ""} />
          </div>
          <FeedInfo removeSummary FeedType={FeedType} item={item!} />
        </div>
      </div>
    </div>
  );
};
