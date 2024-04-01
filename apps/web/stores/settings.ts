import { atomWithStorage } from "jotai/utils";

interface Settings {
  MarkReadOnScroll: boolean;
  OpenReaderInFullScreenByDefault: boolean;
  PromptWhenMarkingAllItemsRead: boolean;
  DefaultTimedBookmarkTime: number;
  SortFeedsByAmountOfUnreadItems: boolean;
  defaultNoteTemplate: string;
  flagEnableNewsleters: boolean;
}

export const settingsAtom = atomWithStorage<Settings>("settings", {
  MarkReadOnScroll: false,
  OpenReaderInFullScreenByDefault: false,
  PromptWhenMarkingAllItemsRead: true,
  DefaultTimedBookmarkTime: 360,
  SortFeedsByAmountOfUnreadItems: false,
  defaultNoteTemplate: "",
  flagEnableNewsleters: true,
});
