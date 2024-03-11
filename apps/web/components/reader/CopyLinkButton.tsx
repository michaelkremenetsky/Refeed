import { useOpenItem } from "@refeed/features/item/useItemDataWeb";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";

export const CopyLinkButton = () => {
  const { openItem } = useOpenItem();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => {
              navigator.clipboard.writeText(openItem?.url!);
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
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent>Copy Link</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
