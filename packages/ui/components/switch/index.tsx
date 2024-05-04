"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[18px] w-[33px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent ring-1 ring-neutral-300 transition-colors data-[state=checked]:bg-neutral-700 data-[state=unchecked]:bg-neutral-200 data-[state=unchecked]:hover:border-neutral-300 data-[state=checked]:hover:bg-neutral-950 data-[state=unchecked]:hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-[#232329] dark:data-[state=checked]:bg-[#141415] dark:data-[state=unchecked]:bg-neutral-700 dark:data-[state=unchecked]:hover:border-neutral-600 dark:data-[state=unchecked]:hover:bg-neutral-600 dark:focus:ring-[#232329] dark:focus:ring-offset-neutral-700",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-[14px] w-[15px] rounded-full bg-white ring-0 transition-transform data-[state=checked]:translate-x-[15px]  data-[state=checked]:hover:bg-neutral-100 dark:bg-[#E3E3E9]",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
