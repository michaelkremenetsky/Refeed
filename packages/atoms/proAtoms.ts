import { atom } from "jotai";

export const planAtom = atom<"free" | "pro" | "enterprise">("free");
