import * as Dialog from "@radix-ui/react-dialog";
import { Clock, Clock3 } from "lucide-react";

import { useOpenItem } from "@refeed/features/item/useItemDataWeb";
import { usePlan } from "@refeed/features/payment/usePlan";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Tooltip";
import { useUpdateBookmarks } from "./useUpdateBookmarks";

export const ShortTermBookmarkButton = () => {
  const { openItem } = useOpenItem();
  const { plan } = usePlan();

  const { markBookmarkRead, removeBookmark } = useUpdateBookmarks();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog.Trigger asChild>
            {!(openItem?.temp_added_time instanceof Date) ? (
              <button
                onClick={() => {
                  if (plan != "free") {
                    markBookmarkRead(openItem?.id!, "Short Term");
                  }
                }}
              >
                <Clock
                  strokeWidth={1.5}
                  className="h-[22px] w-[22px] stroke-neutral-450 dark:stroke-stone-400"
                />
              </button>
            ) : (
              <button
                onClick={() => {
                  removeBookmark(openItem.id, "Short Term");
                }}
              >
                <Clock3
                  strokeWidth={1.5}
                  className="h-[22px] w-[22px] stroke-sky-500 dark:stroke-stone-400"
                />
              </button>
            )}
          </Dialog.Trigger>
        </TooltipTrigger>
        <TooltipContent>Temporary Bookmark</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
