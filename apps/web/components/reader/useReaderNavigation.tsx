import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { currentOpenSearchItem } from "@components/cmdk/CommandPalette";
import { useAtom } from "jotai";
import { useQueryState } from "nuqs";

import type { ItemType } from "@refeed/types/item";

export const useReaderNavigation = (items: ItemType[]) => {
  const [_, setItemQuery] = useQueryState("item", {
    shallow: true,
  });
  const [__, setItemSearchQuery] = useQueryState("searchItem", {
    shallow: true,
  });

  const [searchItem, setOpenSearchItem] = useAtom(currentOpenSearchItem);

  const { query } = useRouter();
  const { item } = query;

  // TODO: Add ability to fetch the open id from here
  const initialIndex = useMemo(() => {
    if (searchItem && items) {
      return items.findIndex((i) => i.id == searchItem.id);
    } else {
      return items.findIndex((i) => i.id == item);
    }
  }, [items, item, searchItem]);

  const isLoaded = items.length > 0 && initialIndex !== -1;

  const closeReader = () => {
    // TODO: Fix clicking esc causes it to removes parems in other parts of the app
    // Should be able to just check readerOpen here but for whatever reason it dosen't work.
    // const readerOpen = item != undefined || searchItem != undefined;

    setItemQuery(null);
    setItemSearchQuery(null);
    setOpenSearchItem(undefined);
  };

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeReader();
      }
    });
    return () => {
      document.removeEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeReader();
        }
      });
    };
  }, []);

  return { closeReader, initialIndex, isLoaded, searchItem };
};
