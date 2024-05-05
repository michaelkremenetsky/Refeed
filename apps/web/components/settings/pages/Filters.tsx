import { useUser } from "@refeed/features/hooks/useUser";
import { AddFilterUpgradeMessage } from "@refeed/features/pro/AddFilterUpgradeMessage";
import { ProBadge } from "@refeed/ui";

import { AddFilterButton } from "../../filters/AddFilter";
import { ToggleFilters } from "../../filters/ToggleFilters";
import { SettingsHeader } from "../SettingsHeader";

export const FiltersSettingsPage = () => {
  const { plan } = useUser();
  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <SettingsHeader title="Filters" subtitle="Manage Filters" />
      <div className="flex items-center space-x-2">
        <div className="mt-6 flex flex-col">
          <h1 className="mb-1 select-none text-sm font-medium leading-5">
            Filters
            <ProBadge className="ml-1.5" />
          </h1>
          <h4 className="mb-2.5 select-none text-sm leading-5 text-neutral-450 dark:text-stone-500">
            Filter out items based on conditions
          </h4>
        </div>
      </div>
      <div>
        <ToggleFilters />
        {plan == "pro" ? <AddFilterButton /> : <AddFilterUpgradeMessage />}
      </div>
    </div>
  );
};
