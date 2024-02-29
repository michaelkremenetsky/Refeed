import { useSetAtom } from "jotai";
import { Bookmark, Clock5, Search } from "lucide-react";
import Link from "next/link";

import { kmenu } from "../../stores/ui";

interface SideMenuButtonProps {
  Name: string;
  itemAmount?: number | undefined;
  timedBookmarkAmount?: number | undefined;
}

export const SideMenuButton: React.FC<SideMenuButtonProps> = (props) => {
  const setKmenu = useSetAtom(kmenu);

  const hrefValue =
    props.Name === "recentlyread"
      ? "/recentlyread"
      : props.Name === "bookmarks"
        ? "/bookmarks"
        : props.Name === "allunread"
          ? "/feed/all"
          : props.Name === "search"
            ? ""
            : "404";

  const handleClick = (e: React.MouseEvent) => {
    if (props.Name === "search") {
      e.preventDefault();
      setKmenu(true);
    }
  };

  return (
    <Link href={hrefValue} shallow={true} onClick={handleClick}>
      <div
        className={`group w-full rounded-md py-[0.25rem] pl-[7px] hover:bg-[#F5F5F5] dark:hover:bg-[#19191a]`}
      >
        {props.Name == "search" && (
          <div onClick={() => setKmenu(true)} className="flex items-center">
            <Search
              strokeWidth={1.4}
              absoluteStrokeWidth
              size={20.75}
              shapeRendering="geometricPrecision"
              className="group stroke-neutral-500/85 dark:stroke-stone-400"
            />
            <h3 className="ml-[9.5px] stroke-neutral-700 text-base font-[450] tracking-[-0.005em] dark:text-stone-200">
              Search
            </h3>
          </div>
        )}
        {props.Name == "recentlyread" && (
          <div className="flex items-center">
            <Clock5
              shapeRendering="geometricPrecision"
              absoluteStrokeWidth
              strokeWidth={1.4}
              size={20.75}
              className="group stroke-neutral-500/85 dark:stroke-stone-400"
            />
            <h3 className="ml-[9.5px] stroke-neutral-700 text-base font-[450] tracking-[-0.005em] dark:text-stone-200">
              Recent
            </h3>
          </div>
        )}
        {props.Name == "bookmarks" && (
          <div className="flex items-center">
            <Bookmark
              absoluteStrokeWidth
              strokeWidth={1.4}
              size={20.75}
              shapeRendering="geometricPrecision"
              className="group stroke-neutral-500/85 dark:stroke-stone-400"
            />
            <h3 className="ml-[9.5px] stroke-neutral-700 text-base font-[450] tracking-[-0.005em] dark:text-stone-200">
              Bookmarks
            </h3>
            {/* <span className="absolute right-[18px] rounded bg-[#0496FF]/10 px-1 text-right text-xs text-sky-500">
              {props.timedBookmarkAmount}
            </span> */}
          </div>
        )}
        {props.Name == "allunread" && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth={1.6}
              height={20.75}
              width={20.75}
              viewBox="0 0 22 22"
              fill="none"
              className="group -translate-x-[0.5px] transform stroke-neutral-500/85 dark:stroke-stone-400"
              shapeRendering="geometricPrecision"
            >
              <path
                shapeRendering="geometricPrecision"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
              />
            </svg>

            <h3 className="ml-[9.5px] stroke-neutral-700 text-base font-[450] tracking-[-0.005em] dark:text-stone-200">
              All Unread
            </h3>
            {props.itemAmount ? (
              <span className="absolute right-[12px] text-xs font-[450] text-neutral-400/75 dark:text-stone-500/85">
                {props.itemAmount >= 1000 ? "1K+" : props?.itemAmount ?? ""}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </Link>
  );
};
