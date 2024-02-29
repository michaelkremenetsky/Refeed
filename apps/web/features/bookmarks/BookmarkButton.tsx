import { useOpenItem } from "@refeed/features/item/useItemDataWeb";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Tooltip";
import { useUpdateBookmarks } from "./useUpdateBookmarks";

export const BookmarkButton = () => {
  const { openItem } = useOpenItem();

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
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6 stroke-neutral-450 dark:stroke-stone-400"
              >
                <path
                  shapeRendering="geometricPrecision"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => {
                removeBookmark(openItem.id, "Regular");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.4}
                stroke="currentColor"
                className="h-6 w-6 fill-[#0496FF] stroke-sky-500"
              >
                <path
                  shapeRendering="geometricPrecision"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
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
