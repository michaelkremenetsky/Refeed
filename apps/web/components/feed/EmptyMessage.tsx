import type { ReactNode } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/Tooltip";
import clsx from "clsx";
import { motion } from "framer-motion";

import { useUser } from "@refeed/features/hooks/useUser";

import type { FeedTypes } from "../../types/feed";

export const EmptyMessage = ({
  FeedType,
  className,
}: {
  FeedType: FeedTypes;
  className?: string;
}) => (
  <motion.div
    layout="size"
    className={clsx("flex h-full flex-col items-center", className)}
  >
    <FeedGraphic />
    <h1 className="mt-6 text-sm font-semibold leading-none">
      {FeedType == "bookmarks"
        ? "No Bookmarks"
        : FeedType == "recentlyread"
          ? "No Items Viewed Recently"
          : "Your All Caught Up"}
    </h1>
    <h2 className="mt-3 max-w-[300px] text-center text-sm text-neutral-500 dark:text-stone-400">
      {FeedType == "bookmarks" ? (
        <span>Bookmark items to see them in here.</span>
      ) : FeedType == "recentlyread" ? (
        <span>Read items to see them in here.</span>
      ) : FeedType == "newsletters" ? (
        <span>
          No emails have been send to your address yet. Subscribe to newsletters
          using your <EmailAddressTooltip>email address</EmailAddressTooltip> to
          see items here.
        </span>
      ) : (
        <span>
          Their are no unread articles left. Add more feeds in{" "}
          <Link href="/discover" className="text-sky-500">
            Discover
          </Link>
        </span>
      )}
    </h2>
  </motion.div>
);

const EmailAddressTooltip = ({ children }: { children: ReactNode }) => {
  const { inboxEmail } = useUser();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className="text-sky-500">{children}</span>
        </TooltipTrigger>
        <TooltipContent className="text-[#38383d]/85 dark:text-[#f3f3f7]">
          {inboxEmail}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

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
