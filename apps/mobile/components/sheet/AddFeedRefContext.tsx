import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { atom } from "jotai";
import type { RefObject } from "react";
import { createContext } from "react";

export const AddFeedRefContext = createContext<
  RefObject<BottomSheetModalMethods> | null
>(null);

export const addFeedLinkAtom = atom<string | undefined>(undefined);
