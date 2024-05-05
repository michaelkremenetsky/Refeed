import { useAtom } from "jotai";

import {
  ProBadge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@refeed/ui";
import {
  DialogRoot,
  DialogTrigger,
} from "@refeed/ui/components/dialog/AddDialog";

import { settingsAtom } from "../../../stores/settings";
import { trpc } from "../../../utils/trpc";
import { DeleteBookmarkFolderDialog } from "../../dialog/DeleteBookmarkFolderDialog";
import { SettingsHeader } from "../SettingsHeader";

export const BookmarksSettingsPage = () => {
  const [settings, setSettings] = useAtom(settingsAtom);

  const onClick = (value: number) => {
    setSettings({ ...settings, DefaultTimedBookmarkTime: value });
  };

  const getFolders = trpc.bookmark.getBookmarkFoldersForUser.useQuery();

  return (
    <div>
      <SettingsHeader title="Bookmarks" subtitle="Bookmark Preferences" />
      <div className="mt-6 flex items-center space-x-2 pt-2">
        <div className="flex w-full items-start pb-1">
          <div className="flex flex-col">
            <h1 className="mb-1 select-none text-sm font-medium leading-5">
              Default Timed Bookmark time
              <ProBadge className="ml-1.5" />
            </h1>
            <h4 className="max-w-[325px] select-none text-sm leading-5 text-neutral-450 sm:max-w-none dark:text-stone-500">
              The default amount of time a timed bookmark will be set to
            </h4>
          </div>
          <div className="ml-auto mr-12 mt-1">
            <Select onValueChange={(value) => onClick(+value)}>
              <SelectTrigger defaultValue="60" className="w-[120px]">
                <SelectValue
                  // @ts-ignore
                  placeholder={
                    settings.DefaultTimedBookmarkTime == 1440
                      ? "1 day"
                      : settings.DefaultTimedBookmarkTime == 4320
                        ? "3 days"
                        : settings.DefaultTimedBookmarkTime == 10080
                          ? "7 days"
                          : settings.DefaultTimedBookmarkTime / 60 + "h"
                  }
                />
              </SelectTrigger>
              <SelectContent
                defaultValue="60"
                className="w-[40px] -translate-x-0.5 transform"
              >
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="360">6 hours</SelectItem>
                <SelectItem value="720">12 hours</SelectItem>
                <SelectItem value="1440">1 day</SelectItem>
                <SelectItem value="4320">3 days</SelectItem>
                <SelectItem value="10080">7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <div className="flex w-full items-start">
          <div className="flex flex-col">
            <h1 className="mb-1 select-none text-sm font-medium leading-5">
              Bookmark Folders
            </h1>
            <h4 className="max-w-[325px] select-none text-sm leading-5 text-neutral-450 sm:max-w-none dark:text-stone-500">
              Folders you can put your Bookmarks are listed here. Click to
              Delete
            </h4>
            <div className="mt-2">
              <div className="flex w-[600px] flex-wrap">
                {getFolders.data?.map((folder) => (
                  <DialogRoot key={folder.name}>
                    <DialogTrigger>
                      <div className="my-1 mr-1 rounded-md border border-neutral-200/80 bg-white px-2 text-stone-700 shadow-sm dark:border-[#232329]  dark:border-[#333333]/80 dark:bg-[#141415] dark:text-stone-200">
                        <span className="mr-1 text-sm text-sky-500/80 ">
                          {folder.amount}
                        </span>
                        {folder.name}
                      </div>
                    </DialogTrigger>
                    <DeleteBookmarkFolderDialog
                      amount={folder.amount}
                      folderName={folder.name}
                    />
                  </DialogRoot>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
