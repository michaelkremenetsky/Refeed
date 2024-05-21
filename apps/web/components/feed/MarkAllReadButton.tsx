import clsx from "clsx";
import { trpc } from "utils/trpc";

import { useUpdateWebItemData } from "../../../../packages/features/item/useItemDataWeb";
import { useCurrentFeedIds } from "../../features/feed/useCurrentFeedIds";

export const MarkAllAsReadButton = ({ noMargin }: { noMargin?: boolean }) => {
  const markAllAsRead = trpc.read.markAllRead.useMutation();

  const utils = trpc.useUtils();

  const { feedIds, FeedType } = useCurrentFeedIds();
  const { updateItemData } = useUpdateWebItemData();

  const markRead = async () => {
    if (FeedType == "one") {
      // Optimistic update
      updateItemData([]);

      await markAllAsRead.mutateAsync({ feedIds });
    }
    if (FeedType == "all") {
      // Optimistic update
      updateItemData([]);

      await markAllAsRead.mutateAsync({});
    }
    if (FeedType == "multiple") {
      // Optimistic update
      updateItemData([]);

      await markAllAsRead.mutateAsync({ feedIds });
    }

    utils.feed.getFeedsInFolders.invalidate();
  };

  return (
    <button
      onClick={() => {
        markRead();
      }}
      className={clsx(
        "mb-6 mt-2 w-full rounded-md border border-neutral-200 text-base font-medium hover:border-gray-300/85 dark:border-neutral-700 dark:hover:border-neutral-700/90",
        noMargin ? "mx-0" : "mx-3",
      )}
    >
      <div className="py-1.5 text-center text-[15px] font-[450] text-neutral-600/80 shadow-[rgba(38,38,38,0.04)_0px_2px_1px] dark:text-gray-200">
        Mark all as read
      </div>
    </button>
  );
};
