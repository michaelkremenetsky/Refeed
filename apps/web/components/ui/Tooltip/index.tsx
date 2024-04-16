"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "lib/cnutils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = ({ delayDuration = 75, ...props }) => {
  return <TooltipPrimitive.Root delayDuration={delayDuration} {...props} />;
};

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "text-popover-foreground z-50 overflow-hidden rounded-[4px] bg-white px-3 py-1.5 text-sm font-[450] shadow-[0_0px_0px_1px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.08),0px_8px_16px_-4px_rgba(0,0,0,0.06)] animate-in data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 dark:border dark:border-[#232329] dark:bg-[#141415]",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
