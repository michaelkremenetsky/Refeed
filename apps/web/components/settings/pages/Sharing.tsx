import type { ChangeEvent } from "react";
import { trpc } from "utils/trpc";

import { useUser } from "@refeed/features/hooks/useUser";
import { Checkbox } from "@refeed/ui";

import { SettingsHeader } from "../SettingsHeader";

export const SharingSettingsPage = () => {
  const { data, isPending } = useUser();

  const providers = data?.sharing;
  const utils = trpc.useUtils();

  const SharingOptions = [
    "Twitter",
    "Email",
    "Facebook",
    "Telegram",
    "Pocket",
    "Mastodon",
    "Linkedin",
  ];

  const updateActiveSharing = trpc.settings.updateShareProviders.useMutation();

  const toggleSharingOption = async (e: ChangeEvent<HTMLInputElement>) => {
    let newShared = providers;

    const hasAlready = providers?.includes(e.target.value);

    if (e.target.checked) {
      if (!hasAlready) {
        newShared?.push(e.target.value);
      }
    } else {
      if (hasAlready) {
        newShared = newShared?.filter((item) => item != e.target.value);
      }
    }

    // @ts-ignore
    utils.pro.getUser.setData(undefined, { ...data, sharing: newShared! });

    await updateActiveSharing.mutateAsync({ Sharing: newShared! });
  };

  return (
    <div>
      <SettingsHeader title="Sharing" subtitle="Sharing Options" />
      <div className="flex flex-col space-y-2">
        <div className="mt-6 flex flex-col">
          <h1 className="mb-1 text-sm font-medium leading-5">
            Sharing Providers
          </h1>
          <h4 className="text-sm leading-5 text-neutral-450 dark:text-stone-500">
            Select which sharing providers you want to use (choose up to 5)
          </h4>
        </div>
        {!isPending && (
          <div className="ml-1.5">
            <fieldset>
              {SharingOptions.map((item) => (
                <div key={item}>
                  <Checkbox
                    value={item}
                    checked={providers?.includes(item)}
                    onChange={(e) => {
                      toggleSharingOption(e);
                    }}
                  />
                  <label className="ml-3">{item}</label>
                </div>
              ))}
            </fieldset>
          </div>
        )}
      </div>
    </div>
  );
};
