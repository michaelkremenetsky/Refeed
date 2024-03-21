import { atom } from "jotai";

export const sortAtom = atom<"Latest" | "Oldest">("Latest");

export const titleAtom = atom<string | undefined>(undefined);
