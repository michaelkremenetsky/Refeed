import clsx from "clsx";
import { useAtom } from "jotai";

import { bookmarkFolderSortAtom } from "@refeed/atoms/bookmarkAtom";

import { trpc } from "../../utils/trpc";

export const BookmarkFolderButtons = ({
  className,
}: {
  className?: string;
}) => {
  const { data: getFolders } =
    trpc.bookmark.getBookmarkFoldersForUser.useQuery();

  const [sortAtom, setSortAtom] = useAtom(bookmarkFolderSortAtom);

  if (getFolders?.length! <= 5) {
    return (
      <>
        <div
          dir="ltr"
          data-orientation="horizontal"
          className={clsx(
            "flex h-[26px] w-fit rounded-md bg-[#fafafa] text-sm dark:bg-[#141415]",
            className,
          )}
        >
          <button onClick={() => setSortAtom(undefined)} className="rounded-sm">
            <h2
              className={`${sortAtom == undefined ? "bg-white font-medium text-[#242628] shadow-[rgba(0,0,0,0.09)_0px_1px_4px_-1px] ring-[0.5px] ring-inset ring-neutral-300 dark:bg-[#0f0f10] dark:text-stone-200 dark:ring-neutral-700" : "text-neutral-500"} w-full rounded-[6px] px-3 py-[3px]`}
            >
              All
            </h2>
          </button>
          {getFolders?.map(
            (folder) =>
              folder.amount > 0 && (
                <button
                  key={folder.name}
                  onClick={() => setSortAtom(folder.name)}
                  className="rounded-sm"
                >
                  <h2
                    className={`${sortAtom == folder.name ? "bg-white font-medium text-[#242628] shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] ring-[0.5px] ring-inset ring-neutral-200 dark:bg-[#0f0f10] dark:text-stone-200 dark:ring-neutral-700" : "text-neutral-500"} w-full rounded-[6px] px-3 py-[3px]`}
                  >
                    {folder.name}
                    <span className="ml-2 text-xs text-sky-500">
                      {folder.amount}
                    </span>
                  </h2>
                </button>
              ),
          )}
        </div>
      </>
    );
  } else {
    return (
      <div
        dir="ltr"
        data-orientation="horizontal"
        className={clsx("flex max-w-fit flex-wrap text-sm", className)}
      >
        <button
          onClick={() => setSortAtom(undefined)}
          className="my-1 mr-1 rounded-md border border-neutral-200/80 bg-white px-2 text-stone-700 shadow-sm dark:border-[#24252A]  dark:border-[#333333]/80 dark:bg-[#0f0f10] dark:text-stone-200"
        >
          All
        </button>
        {getFolders?.map((folder) => (
          <button key={folder.name} onClick={() => setSortAtom(folder.name)}>
            <h2
              className={`${sortAtom == folder.name ? "bg-white font-medium text-[#242628] shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] ring-[0.5px] ring-inset ring-neutral-200 dark:bg-[#0f0f10] dark:text-stone-200 dark:ring-neutral-700" : "bg-[#fafafa] text-neutral-500 dark:bg-[#141415]"} my-1 mr-1 rounded-[6px] px-3 py-[3px]`}
            >
              {folder.name}
              <span className="ml-2 text-xs text-sky-500/80">
                {folder.amount}
              </span>
            </h2>
          </button>
        ))}
      </div>
    );
  }
};
