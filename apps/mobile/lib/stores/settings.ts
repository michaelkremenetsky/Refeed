import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

export const settingsAtom = atomWithStorage<{
  theme: "Dark" | "Light" | "System";
  MarkReadOnScroll: boolean;
  ScrollDirection: "Vertical" | "Horizontal";
  PromptWhenMarkingItemsRead: boolean;
  DefaultTimedBookmarkTime: number;
  SortFeedsByAmountOfUnreadItems: boolean;
  defaultNoteTemplate: string;
}>(
  "settings",
  {
    theme: "System",
    MarkReadOnScroll: false,
    ScrollDirection: "Vertical",
    PromptWhenMarkingItemsRead: false,
    DefaultTimedBookmarkTime: 7200,
    SortFeedsByAmountOfUnreadItems: false,
    defaultNoteTemplate: "",
  },
  createJSONStorage(() => AsyncStorage),
);
