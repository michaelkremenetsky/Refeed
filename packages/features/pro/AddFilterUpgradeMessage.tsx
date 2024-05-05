import { Drawer } from "vaul";

import { ScrollArea } from "@refeed/ui";

import { PricingPage } from "../../../apps/web/components/upgrade/PricingPage";

export const AddFilterUpgradeMessage = () => {
  return (
    <Drawer.Root direction="right" shouldScaleBackground>
      <Drawer.Trigger className=" rounded-md text-sm font-medium text-sky-500">
        + Add Filter
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 right-0 z-50 mt-24 flex h-full w-[1000px] flex-col overflow-x-hidden rounded-t-[10px] bg-zinc-100">
          <ScrollArea>
            <PricingPage />
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
