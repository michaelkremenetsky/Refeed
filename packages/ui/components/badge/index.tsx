import type { ReactNode } from "react";
import clsx from "clsx";

export const Badge = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <span
      className={clsx(
        className,
        "ml-1.5 rounded bg-[#0496FF]/10 px-[4px] text-right text-xs font-[500] text-sky-500",
      )}
    >
      {children}
    </span>
  );
};

export const ProBadge = ({ className }: { className?: string }) => {
  return (
    <span
      className={clsx(
        className,
        "ml-1.5 rounded bg-[#0496FF]/10 px-[3px] text-right text-xs font-[500] text-sky-500",
      )}
    >
      Pro
    </span>
  );
};
