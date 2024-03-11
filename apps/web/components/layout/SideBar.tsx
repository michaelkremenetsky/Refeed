import Link from "next/link";
import { PricingPage } from "@components/upgrade/PricingPage";
import { useUser } from "@supabase/auth-helpers-react";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ChevronDown } from "lucide-react";
import { Resizable } from "re-resizable";
import { Drawer } from "vaul";

import { DialogRoot } from "@refeed/ui/components/dialog/AddDialog";

import { useFeedsInFolders } from "../../features/folders/useFeedsInFolders";
import { kmenu } from "../../stores/ui";
import { trpc } from "../../utils/trpc";
import { AddFolderDialog } from "../dialog/AddFolderDialog";
import { ThemedSkeleton } from "../ui/Skeleton";
import { AccountDropdown } from "./AccountDropdown";
import { AddNewButtonBottom } from "./AddNewButton";
import { NoFoldersMessage } from "./NoFolderMessage";
import { TreeView } from "./TreeView";

export const SideBarFolded = atom(false);
export const SideBarWidth = atomWithStorage("SideBarWidth", 240);

export default function SideBar() {
  const { feedsInFolders, totalItemAmount, OpenState, isFetched } =
    useFeedsInFolders();

  const isFolded = useAtomValue(SideBarFolded);
  const [width, setWidth] = useAtom(SideBarWidth);

  const utils = trpc.useUtils();

  const user = useUser();

  // Needed to fix it not fetching right when you first sign up, will remove this soon
  if (user) {
    if (feedsInFolders == undefined) {
      utils.feed.getFeedsInFolders.refetch();
    }
  }

  if (!isFolded) {
    return (
      <Resizable
        // @ts-ignore: The height needs to be set in the CSS to match the screen height instead of the full height
        size={{
          width: width,
        }}
        enable={{
          right: true,
        }}
        maxWidth={340}
        // TODO: Make it so you can snap to 0, you can do just use the snap feature
        // and edit the source to make it so for 240-340 it dosen't snap
        // snap={{ x: [0, 240, 340] }}
        onResize={(e, direction, ref) => {
          // Cache the size in the browser
          setWidth(ref.offsetWidth);
        }}
        className={`group/add sticky top-0 max-h-screen min-h-screen overflow-x-hidden overflow-y-scroll border-r border-[#f0f0f0] bg-[#fcfcfc] scrollbar-hide lg:min-w-[240px] dark:border-[#24252A] dark:bg-[#141415]`}
      >
        <Drawer.Root direction="right" shouldScaleBackground>
          <div className={`ml-2.5 mr-1.5 mt-1.5`}>
            <div className="ml-1">
              <AccountDropdown width={width} />
            </div>
            <div className="mt-2">
              <SearchSelect />
            </div>
          </div>
          <div className="ml-2.5">
            <DialogRoot>
              {!isFetched && <SideBarSkeleton />}

              {isFetched && (
                <div className="flex">
                  <h4 className="mb-1 ml-1.5 mt-4 text-xs font-medium tracking-wider text-neutral-450 dark:text-stone-500/85">
                    Feeds
                  </h4>
                </div>
              )}
              {isFetched && feedsInFolders?.length != 0 && (
                <>
                  <Link href="/feed/all">
                    <div className="mr-1.5 flex cursor-pointer items-center rounded-md py-[0.25rem] hover:bg-[#f5f5f5] hover:dark:bg-[#1a1a1a] focus:[&:not(:focus-visible)]:outline-none">
                      <ChevronDown className="h-[24px] w-[24px] stroke-neutral-450 stroke-[1.4] hover:stroke-neutral-500" />
                      <span
                        className={`flex-1 truncate stroke-neutral-700 pl-1 text-base font-[450] dark:text-stone-200 
            `}
                      >
                        All
                      </span>
                      <span className="absolute right-[12.5px] text-center text-xs font-[450] text-neutral-400/75 dark:text-stone-500/95">
                        {totalItemAmount! > 2500
                          ? "2.5K+"
                          : totalItemAmount! >= 1000
                            ? "1K+"
                            : totalItemAmount ?? null}
                      </span>
                    </div>
                  </Link>
                  <TreeView
                    // This needs the width since its virtualized
                    width={width - 9}
                    feedsInFolders={feedsInFolders}
                    OpenState={OpenState}
                  />
                </>
              )}

              <NoFoldersMessage
                show={isFetched && feedsInFolders?.length == 0}
              />
              <AddFolderDialog link={undefined} title="Add Folder" />
              {isFetched && feedsInFolders?.length != 0 && (
                <AddNewButtonBottom />
              )}
            </DialogRoot>
          </div>
          <div className={`ml-2.5 mr-1.5 mt-auto`}></div>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-20 bg-black/40" />
            <Drawer.Content className="fixed bottom-0 right-0 z-20 mt-24 flex h-full w-[1000px] flex-col overflow-scroll overflow-x-hidden rounded-t-[10px] bg-zinc-100">
              <PricingPage />
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </Resizable>
    );
  }
}

const SearchSelect = () => {
  const setKmenu = useSetAtom(kmenu);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setKmenu(true);
  };

  return (
    <Link href={"search"} shallow={true} onClick={handleClick}>
      <Search />
    </Link>
  );
};

const Search = () => {
  return (
    <div className="flex flex-none cursor-pointer flex-col gap-3">
      <div className="flex flex-1 flex-col">
        <div className="capacitor:active:opacity-70 dark:hover:text-near-white flex flex-1 items-center space-x-1 rounded-[7px] border border-neutral-300/60 bg-white px-2 py-1 text-sm text-neutral-400 shadow-sm shadow-black/5 transition duration-150 ease-in-out hover:bg-white hover:text-neutral-500 dark:border-[#fcfcfd]/5 dark:bg-[#202022] dark:text-neutral-500 dark:shadow-black/10 dark:hover:bg-[#202022]">
          <div className="flex-none">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                shapeRendering="geometricPrecision"
                d="M13.8588 13.8588C14.7183 12.9992 15.25 11.8117 15.25 10.5C15.25 7.87665 13.1234 5.75 10.5 5.75C7.87665 5.75 5.75 7.87665 5.75 10.5C5.75 13.1234 7.87665 15.25 10.5 15.25C11.8117 15.25 12.9992 14.7183 13.8588 13.8588ZM13.8588 13.8588L18.5 18.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="w-0 flex-1 truncate">Search your feeds...</div>
          <kbd className="inline-flex flex-none items-center rounded px-2 font-sans text-xs font-medium uppercase ">
            <span className="text-neutral-400 dark:text-neutral-500/90">
              ctrl&thinsp;k
            </span>
          </kbd>
        </div>
      </div>
    </div>
  );
};

const SideBarSkeleton = () => (
  <div className="ml-2 mr-4 mt-4 flex flex-col space-y-2">
    <ThemedSkeleton className="h-8 max-w-full py-2 dark:bg-[#1a1a1a]" />
    <ThemedSkeleton className="h-8 max-w-full py-2 dark:bg-[#1a1a1a]" />
    <ThemedSkeleton className="h-8 max-w-full py-2 dark:bg-[#1a1a1a]" />
  </div>
);
