import { PricingPage } from "@components/upgrade/PricingPage";
import { Drawer } from "vaul";

import { usePlan } from "@refeed/features/payment/usePlan";
import { ProBadge } from "@refeed/ui";

import { AddFilterButton } from "../../filters/AddFilter";
import { ToggleFilters } from "../../filters/ToggleFilters";
import { SettingsHeader } from "../SettingsHeader";

export const FiltersSettingsPage = () => {
  const { plan } = usePlan();
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
        {plan == "pro" ? <AddFilterButton /> : <AddFilterFreeMessage />}
      </div>
    </div>
  );
};

const AddFilterFreeMessage = () => {
  return (
    <Drawer.Root direction="right" shouldScaleBackground>
      <Drawer.Trigger className=" rounded-md text-sm font-medium text-sky-500">
        + Add Filter
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 right-0 z-50 mt-24 flex h-full w-[1000px] flex-col overflow-scroll overflow-x-hidden rounded-t-[10px] bg-zinc-100">
          <PricingPage />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
