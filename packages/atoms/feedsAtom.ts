import { atom } from "jotai";

export const sortAtom = atom<
  | "Latest"
  | "Oldest"
  | "Readability Ascending"
  | "Readability Descending"
  | "Content Length Ascending"
  | "Content Length Descending"
>("Latest");

export const titleAtom = atom<string | undefined>(undefined);
