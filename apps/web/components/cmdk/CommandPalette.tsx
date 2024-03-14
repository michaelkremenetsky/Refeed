import React, { useEffect, useState } from "react";
import { NonLinkedSearchItem } from "@components/feed/SearchItem";
import { Command } from "cmdk";
import { atom, useAtom, useSetAtom } from "jotai";
import { useQueryState } from "nuqs";
import type { RouterOutput } from "utils/trpc";
import { trpc } from "utils/trpc";

import { useUser } from "@refeed/features/hooks/useUser";
import { debounce } from "@refeed/lib/debounce";
import type { ItemType } from "@refeed/types/item";

import { kmenu } from "../../stores/ui";

const CommandPalette = () => {
  const [open, setOpen] = useAtom(kmenu);
  const [query, setQuery] = useState<string | undefined>(undefined);

  const { plan } = useUser();

  const [_, setItemQuery] = useQueryState("item", {
    shallow: true,
  });
  const [__, setItemSearchQuery] = useQueryState("searchItem", {
    shallow: true,
  });

  const handleQueryChange = debounce((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setQuery(target.value);
  }, 300);

  const {
    data: searchResults,
    isFetched,
    isFetching,
  } = trpc.item.searchMultipleItems.useQuery(
    { query: query, take: 10, plan: plan as "free" | "pro" },
    { enabled: query != undefined },
  );

  const utils = trpc.useUtils();

  useEffect(() => {
    // Makes sure the reader is closed when command palette is open
    if (open) {
      setItemQuery(null);
      setItemSearchQuery(null);
    }

    // Make sure to invalidate the old search so it dosen't open up the full results when you reopen it
    return () => {
      if (isFetched && !open) {
        utils.item.searchMultipleItems.reset();
        utils.item.searchMultipleItems.invalidate();
        setQuery(undefined);
      }
    };
  }, [open]);

  useEffect(() => {
    // Open The Command Pallet When Ctrl+K is clicked
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);

    return () => {
      document.removeEventListener("keydown", down);
    };
  }, [setOpen]);

  const hasSearchQuery = query?.length != 0 && query?.length != undefined;
  const noSearchResults =
    searchResults?.length == 0 || searchResults?.length == undefined;

  return (
    <Command.Dialog
      className={`CommandMenu absolute left-[50%] top-1/4 z-40 w-full max-w-[560px] 
       translate-x-[-50%] overflow-hidden rounded-md border border-[#E7E7E7] bg-white text-[#38383d] subpixel-antialiased shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.08),0_4px_10px_rgba(166,166,166,0.16)] dark:border-[#24252A] dark:bg-[#141415] dark:text-[#F3F5F7] dark:shadow-none
      ${isFetching && searchResults?.length != 0 && "h-[46px]"}
      ${hasSearchQuery && noSearchResults && "h-[120px]"}
      `}
      open={open}
      onOpenChange={(open) => setOpen(open)}
      label="Global Command Menu"
    >
      <input
        onChangeCapture={(e) => handleQueryChange(e)}
        placeholder="Search your items"
        className="z-50 h-11 w-full rounded-md rounded-b-none border-none bg-[#FCFCFC] outline-none ring-0 placeholder:text-neutral-500 focus:border-b focus:border-[#E7E7E7] focus:ring-0 dark:border-[#24252A] dark:bg-[#141415] dark:text-stone-200"
      />
      {hasSearchQuery && (
        <SearchItems
          closePallete={() => setOpen(false)}
          searchResults={searchResults}
        />
      )}
    </Command.Dialog>
  );
};

type SearchResultsType = RouterOutput["item"]["searchMultipleItems"];

export const currentOpenSearchItem = atom<ItemType | undefined>(undefined);

const SearchItems = ({
  closePallete,
  searchResults,
}: {
  closePallete: () => void;
  searchResults: SearchResultsType | undefined;
}) => {
  const setOpenSearchItem = useSetAtom(currentOpenSearchItem);
  const [__, setItemSearchQuery] = useQueryState("searchItem", {
    shallow: true,
  });

  return (
    <>
      <Command.List
        className={`z-40 ${
          searchResults && "border-t border-t-[#E7E7E7] dark:border-[#24252A]"
        } overflow-x-hidden scrollbar scrollbar-thumb-neutral-300/75 scrollbar-thumb-rounded-md scrollbar-w-1 dark:bg-[#141415] dark:scrollbar-thumb-neutral-700`}
      >
        <div className="text-neutral-400">
          <Command.Empty>No results found.</Command.Empty>
        </div>
        <Command.Group>
          {searchResults?.map((item) => (
            <Command.Item value={item.title} key={item.id}>
              <div
                onClick={() => {
                  setItemSearchQuery(item.id);
                  setOpenSearchItem(item as unknown as ItemType);

                  closePallete();
                }}
                className="inline-flex w-full cursor-pointer justify-start"
              >
                <NonLinkedSearchItem
                  item={item as unknown as ItemType}
                  FeedType="search"
                />
              </div>
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </>
  );
};

export default CommandPalette;
