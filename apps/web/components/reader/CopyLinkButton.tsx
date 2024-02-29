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
              stroke="currentColor"
              className="h-[22px] w-[22px] stroke-neutral-450 stroke-[1.5] dark:stroke-stone-400"
            >
              <path
                shapeRendering="geometricPrecision"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent>Copy Link</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
