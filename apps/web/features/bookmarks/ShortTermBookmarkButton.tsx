import * as Dialog from "@radix-ui/react-dialog";

import { useUser } from "@refeed/features/hooks/useUser";
import { useOpenItem } from "@refeed/features/item/useItemDataWeb";
import type { ItemType } from "@refeed/types/item";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Tooltip";
import { useUpdateBookmarks } from "./useUpdateBookmarks";

export const ShortTermBookmarkButton = ({
  openItemFromArticle,
}: {
  openItemFromArticle?: ItemType;
}) => {
  let { openItem } = useOpenItem();
  const { plan } = useUser();

  if (openItemFromArticle) {
    openItem = openItemFromArticle;
  }

  const { markBookmarkRead, removeBookmark } = useUpdateBookmarks();

  if (plan == "pro") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog.Trigger asChild>
              {!(openItem?.temp_added_time instanceof Date) ? (
                <button
                  onClick={() => {
                    markBookmarkRead(openItem?.id!, "Short Term");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    shapeRendering="geometricPrecision"
                    className="h-6 w-6 stroke-neutral-450 dark:stroke-neutral-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      shapeRendering="geometricPrecision"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => {
                    removeBookmark(openItem?.id!, "Short Term");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    shapeRendering="geometricPrecision"
                    className="h-6 w-6 stroke-sky-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      shapeRendering="geometricPrecision"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              )}
            </Dialog.Trigger>
          </TooltipTrigger>
          <TooltipContent>Temporary Bookmark</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};
