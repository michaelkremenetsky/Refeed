import { Drawer } from "vaul";

import { PricingPage } from "./PricingPage";

export const UpgradeDrawer = () => {
  // Thinking about adding w-[50%], w-[70%] or w-[98%] here
  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger className="my-1 ml-2 rounded-md text-sm font-medium text-sky-500 hover:text-sky-500/30">
        Upgrade
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-20 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-20 mx-auto mt-24 flex h-[96%] w-[70%] flex-col rounded-lg rounded-t-[10px] bg-white dark:bg-[#141415]">
          <div className="no-scrollbar overflow-y-scroll rounded-md">
            <PricingPage />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const RightUpgradeDrawer = () => {
  return (
    <Drawer.Root direction="right" shouldScaleBackground>
      <Drawer.Trigger className="my-1 ml-2 rounded-md text-sm font-medium text-sky-500 hover:text-sky-500/30">
        Upgrade
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-20 " />
        <Drawer.Content className="fixed bottom-0 right-0 z-20 mt-24 flex h-full w-[900px] flex-col overflow-scroll overflow-x-hidden rounded-t-[10px] bg-white dark:bg-[#141415]">
          <PricingPage />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
