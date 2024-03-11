import { useOpenItem } from "@refeed/features/item/useItemDataWeb";
import type { ItemType } from "@refeed/types/item";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Tooltip";
import { useUpdateBookmarks } from "./useUpdateBookmarks";

export const BookmarkButton = ({
  openItemFromArticle,
}: {
  openItemFromArticle?: ItemType;
}) => {
  let { openItem } = useOpenItem();

  if (openItemFromArticle) {
    openItem = openItemFromArticle;
  }

  const { markBookmarkRead, removeBookmark } = useUpdateBookmarks();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {openItem?.in_read_later == undefined ||
          openItem.in_read_later == false ? (
            <button
              onClick={() => {
                markBookmarkRead(openItem?.id!, "Regular");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                shapeRendering="geometricPrecision"
                className="h-6 w-6 stroke-neutral-450 dark:stroke-neutral-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  shapeRendering="geometricPrecision"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => {
                removeBookmark(openItem?.id!, "Regular");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                shapeRendering="geometricPrecision"
                className="h-6 w-6 fill-sky-500 stroke-sky-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  shapeRendering="geometricPrecision"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent>Bookmark</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
