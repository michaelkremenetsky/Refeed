import Link from "next/link";
import clsx from "clsx";

import type { FeedTypes } from "../../types/feed";

export const EmptyMessage = ({
  FeedType,
  className,
}: {
  FeedType: FeedTypes;
  className?: string;
}) => (
  <div className={clsx("flex h-full flex-col items-center", className)}>
    <FeedGraphic />
    <h1 className="mt-6 text-sm font-semibold leading-none">
      {FeedType == "bookmarks"
        ? "No Bookmarks"
        : FeedType == "recentlyread"
          ? "No Items Viewed Recently"
          : "Your All Caught Up"}
    </h1>
    <h2 className="mt-3 max-w-[300px] text-center text-sm  text-neutral-500 dark:text-stone-400">
      {FeedType == "bookmarks" ? (
        <span>Bookmark items to see them in here.</span>
      ) : FeedType == "recentlyread" ? (
        <span>Read items to see them in here.</span>
      ) : (
        <span>
          Their are no unread articles left. Add more feeds in{" "}
          <Link href="/discover" className="text-sky-500">
            Discover
          </Link>
        </span>
      )}
    </h2>
  </div>
);

export const FeedGraphic = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <div className="flex h-[100px] w-[275px] flex-row rounded-md border border-neutral-300/60 bg-white dark:border-neutral-700 dark:bg-[#141415]">
        <div className="ml-2 h-[80px] w-[100px] self-center rounded-md border border-neutral-300/60 bg-neutral-100/70 dark:border-neutral-700 dark:bg-[#1e1e1f]" />
        <div className="ml-2 mt-[10px] h-[20px] w-[150px] rounded-md border border-neutral-300/60 bg-neutral-100/70 dark:border-neutral-700 dark:bg-[#1e1e1f]" />
      </div>
    </div>
  );
};
