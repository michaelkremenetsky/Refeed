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
  | "Readability Ascending"
  | "Readability Descending"
  | "Content Length Ascending"
  | "Content Length Descending"
>("Latest");

export const kmenu = atom<boolean | undefined>(false);
