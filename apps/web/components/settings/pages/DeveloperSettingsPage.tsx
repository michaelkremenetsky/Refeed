import { SettingsHeader } from "@components/settings/SettingsHeader";
import { useAtom } from "jotai";

import { Switch } from "@refeed/ui";

import { settingsAtom } from "../../../stores/settings";

export const DeveloperSettingsPage = () => {
  const [settings, setSettings] = useAtom(settingsAtom);

  return (
    <div>
      <SettingsHeader
        title="Developer Settings"
        subtitle="Developer Settings Page"
      />
      <div className="flex w-full items-start">
        <div className="flex w-full flex-col">
          <h4 className="text-sm leading-5 text-neutral-450 dark:text-stone-500">
            This is the developer settings page. Don&apos;t use anything in here
            unless you know what you&apos;re doing.
          </h4>
        </div>
      </div>
      <div className="mt-6 flex w-full items-start">
        <div className="flex flex-col">
          <h1 className="mb-1 select-none text-sm font-medium leading-5">
            Enabled Newsletters
          </h1>
          <h4 className="select-none text-sm leading-5 text-neutral-450 dark:text-stone-500">
            Enabled the Newsletters feature
          </h4>
        </div>
        <Switch
          className="ml-auto mr-12 mt-3"
          checked={settings.flagEnableNewsleters}
          onCheckedChange={() => {
            setSettings({
              ...settings,
              flagEnableNewsleters: !settings.flagEnableNewsleters,
            });
          }}
          id="airplane-mode"
        />
      </div>
      {/* <div className="mt-6 flex w-full items-start">
        <div className="flex flex-col">
          <h1 className="mb-1 select-none text-sm font-medium leading-5">
            Experimental Highlighting
          </h1>
          <h4 className="select-none text-sm leading-5 text-neutral-450 dark:text-stone-500">
            This fully does not work yet
          </h4>
        </div>
        <Switch
          className="ml-auto mr-12 mt-3"
          checked={settings.flagEnableNewsleters}
          onCheckedChange={() => {
            setSettings({
              ...settings,
              flagEnableNewsleters: !settings.flagEnableNewsleters,
            });
          }}
          id="airplane-mode"
        />
      </div> */}
    </div>
  );
};
