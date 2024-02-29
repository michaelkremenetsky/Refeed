"use client";

import { ProgressBar, ProgressBarProps } from "react-aria-components";

import { cn } from "../../utils/cnutils";

const Progress = ({ className, children, ...props }: ProgressBarProps) => (
  <ProgressBar
    className={(values) =>
      cn(
        "w-full",
        typeof className === "function" ? className(values) : className,
      )
    }
    {...props}
  >
    {(values) => (
      <>
        {typeof children === "function" ? children(values) : children}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-neutral-450/20">
          <div
            className="h-full w-full flex-1 bg-sky-500/80 transition-all"
            style={{
              transform: `translateX(-${100 - (values.percentage || 0)}%)`,
            }}
          />
        </div>
      </>
    )}
  </ProgressBar>
);

export { Progress };
