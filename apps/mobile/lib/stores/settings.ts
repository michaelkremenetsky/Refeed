import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

export const settingsAtom = atomWithStorage<{
  theme: "Dark" | "Light" | "System";
  MarkReadOnScroll: boolean;
  PromptWhenMarkingItemsRead: boolean;
  DefaultTimedBookmarkTime: number;
}>(
  "settings",
  {
    theme: "System",
    MarkReadOnScroll: false,
    PromptWhenMarkingItemsRead: false,
    DefaultTimedBookmarkTime: 7200,
  },
  createJSONStorage(() => AsyncStorage),
);
