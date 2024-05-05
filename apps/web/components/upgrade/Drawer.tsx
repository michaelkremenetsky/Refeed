import { Drawer } from "vaul";

import { ScrollArea } from "@refeed/ui";

import { PricingPage } from "./PricingPage";

export const UpgradeDrawer = () => {
  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger className="my-1 ml-2 rounded-md text-sm font-medium text-sky-500 hover:text-sky-500/30">
        Upgrade
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-20 bg-black/[.32]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-20 mx-auto mt-24 flex h-full w-full flex-col rounded-lg rounded-t-[10px] bg-white dark:bg-[#141415]">
          <ScrollArea className="rounded-md">
            <BackButton />
            <PricingPage />
          </ScrollArea>
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
        <Drawer.Overlay className="fixed inset-0 z-20 bg-black/[.32]" />
        <Drawer.Content className="fixed bottom-0 right-0 z-20 mt-24 flex h-full flex-col rounded-t-[10px] bg-white md:w-[900px] dark:bg-[#141415]">
          <ScrollArea className="rounded-md">
            <PricingPage />
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

const BackButton = () => {
  return (
    <Drawer.Close className="animate-fade-in-up fixed right-4 top-4 mx-2 rounded p-1 transition-all hover:bg-[#F5F5F5] dark:hover:bg-[#0f0f0f]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        className="h-[22px] w-[22px] stroke-neutral-500 dark:stroke-neutral-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </Drawer.Close>
  );
};
