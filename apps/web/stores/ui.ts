import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const feedLayout = atomWithStorage<"Magazine" | "Card" | "Article">(
  "Feed Layout",
  "Magazine",
);

export const hideSidebar = atomWithStorage<boolean>("hideSidebar", false);

export const Sort = atom<
  | "Latest"
  | "Oldest"
>("Latest");

export const kmenu = atom<boolean | undefined>(false);
