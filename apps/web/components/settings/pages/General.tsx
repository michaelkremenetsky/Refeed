import { useAtom } from "jotai";
import { useTheme } from "next-themes";

import {
  ProBadge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  TextArea,
} from "@refeed/ui";

import { settingsAtom } from "../../../stores/settings";
import { SettingsHeader } from "../SettingsHeader";

export const GeneralSettingsPage = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const { setTheme, theme } = useTheme();

  return (
    <div id="general" className="h-full overflow-y-auto overscroll-none">
      <SettingsHeader title="General" subtitle="General Settings" />
      <div className="mt-6 flex flex-col pb-1">
        <div className="flex">
          <div className="flex flex-col">
            <h1 className="mb-1 select-none text-sm font-medium leading-5">
              Theme
            </h1>
            <h4 className="max-w-[250px] select-none text-sm leading-5 text-neutral-450 sm:max-w-none dark:text-stone-500">
              Select or Custimize your UI theme.
            </h4>
          </div>
          <div className="ml-auto mr-6 lg:mr-12">
            <Select onValueChange={(value) => setTheme(value)}>
              <SelectTrigger defaultValue={theme} className="w-[140px]">
                <SelectValue
                  // @ts-ignore
                  placeholder={theme == "dark" ? "Dark" : "Light Theme"}
                />
              </SelectTrigger>
              <SelectContent
                defaultValue={theme}
                className="transfrom w-[140px] -translate-x-[1px]"
              >
                <SelectItem value="light">Light Theme</SelectItem>
                <SelectItem value="dark">Dark Theme</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="mt-4 flex flex-col items-center space-y-4">
          <div className="flex w-full select-none items-start pb-1">
            <div className="flex flex-col">
              <h1 className="mb-1 text-sm font-medium leading-5">
                Mark Read on Scroll
              </h1>
              <h4 className="max-w-[250px] text-sm leading-5 text-neutral-450 sm:max-w-none dark:text-stone-500">
                Mark feeds read as you scroll
              </h4>
            </div>
            <Switch
              className="ml-auto mr-6 mt-3 lg:mr-12"
              checked={settings.MarkReadOnScroll}
              onCheckedChange={() => {
                setSettings({
                  ...settings,
                  MarkReadOnScroll: !settings.MarkReadOnScroll,
                });
              }}
              id="airplane-mode"
            />
          </div>
          <div className="flex w-full items-start pb-1">
            <div className="flex flex-col">
              <h1 className="mb-1 select-none text-sm font-medium leading-5">
                Prompt when marking all items read
              </h1>
              <h4 className="max-w-[250px] select-none text-sm leading-5 text-neutral-450 sm:max-w-none dark:text-stone-500">
                Ask you to confirm when marking all items read
              </h4>
            </div>
            <Switch
              className="ml-auto mr-6 mt-3 lg:mr-12"
              checked={settings.PromptWhenMarkingAllItemsRead}
              onCheckedChange={() => {
                setSettings({
                  ...settings,
                  PromptWhenMarkingAllItemsRead:
                    !settings.PromptWhenMarkingAllItemsRead,
                });
              }}
              id="airplane-mode"
            />
          </div>
          <div className="flex w-full items-start pb-1">
            <div className="flex w-full items-start">
              <div className="flex flex-col">
                <h1 className="mb-1 select-none text-sm font-medium leading-5">
                  Open Reader in Full Screen Mode
                </h1>
                <h4 className="max-w-[250px] select-none text-sm leading-5 text-neutral-450 sm:max-w-none dark:text-stone-500">
                  Open Reader in Full Screen Mode by default
                </h4>
              </div>
              <Switch
                className="ml-auto mr-6 mt-3 lg:mr-12"
                checked={settings.OpenReaderInFullScreenByDefault}
                onCheckedChange={() => {
                  setSettings({
                    ...settings,
                    OpenReaderInFullScreenByDefault:
                      !settings.OpenReaderInFullScreenByDefault,
                  });
                }}
                id="airplane-mode"
              />
            </div>
          </div>
          <div className="flex w-full items-start">
            <div className="flex w-full flex-col">
              <h1 className="mb-1 text-sm font-medium leading-5">
                Default Note Template
                <ProBadge className="ml-1.5" />
              </h1>
              <h4 className="max-w-[250px] text-sm leading-5 text-neutral-450 sm:max-w-none dark:text-stone-500">
                Default Template when you create a Note
              </h4>
              <TextArea
                className="z-10 mt-5 w-11/12 md:w-10/12"
                name="postContent"
                placeholder="Write Note"
                rows={5}
                maxLength={50}
                defaultValue={settings.defaultNoteTemplate}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    defaultNoteTemplate: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
