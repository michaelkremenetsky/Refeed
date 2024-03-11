import type { SVGProps } from "react";
import { Drawer } from "vaul";

import { ContentTopBar } from "@refeed/ui/components/dialog/AddDialog";

import { PricingPage } from "../../../apps/web/components/upgrade/PricingPage";

export const BookmarkFolderUpgradeMessage = () => {
  return (
    <>
      <ContentTopBar title="Upgrade to Refeed Pro" />;
      <div className="mx-auto w-11/12">
        <EmptyMessageSvgForFolder className="mx-auto mb-3 h-28 w-28 dark:hidden" />
        <h3
          className={`pointer-events-none mt-1 rounded-md text-center text-neutral-500/80 dark:text-stone-300`}
        >
          The free version of Refeed offers 3 Bookmark folders. Please Upgrade
          to create more.
        </h3>
        <Drawer.Root direction="right" shouldScaleBackground>
          <Drawer.Trigger asChild>
            <button
              className={`-z-10 mb-3 mt-4 w-full rounded-md bg-sky-500 py-1.5 text-center font-[525] tracking-tight text-white`}
            >
              Upgrade
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-50 bg-black/[.32]" />
            <Drawer.Content className="fixed bottom-0 right-0 z-50 mt-24 flex h-full flex-col overflow-scroll overflow-x-hidden rounded-t-[10px] bg-white md:w-[900px] dark:bg-[#141415]">
              <PricingPage />
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </>
  );
};

const EmptyMessageSvgForFolder = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 224 200"
    fill="none"
    {...props}
  >
    <path
      strokeWidth={1.5}
      d="M44.478 73h133.444a9.001 9.001 0 0 1 8.975 8.327l8.1 108c.391 5.221-3.739 9.673-8.975 9.673H36.378c-5.236 0-9.366-4.452-8.975-9.673l8.1-108A9 9 0 0 1 44.478 73Z"
      className="box-shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] fill-neutral-50 stroke-[#d1d4d6] dark:fill-[#141415] dark:stroke-[#24252A]"
    />
    <path
      strokeWidth={1.5}
      d="M31.577 44.2h159.246a9 9 0 0 1 8.966 8.214l9.462 108.001c.461 5.26-3.685 9.785-8.966 9.785H22.115c-5.281 0-9.427-4.525-8.966-9.785l9.462-108a9 9 0 0 1 8.966-8.215Z"
      className="box-shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] fill-neutral-50 stroke-[#d1d4d6] dark:fill-[#141415] dark:stroke-[#24252A]"
    />
    <path
      strokeWidth={1.5}
      d="M28.276 1h164.941a9 9 0 0 1 8.893 7.612l19.101 122.4c.851 5.458-3.369 10.388-8.893 10.388H11.468c-5.458 0-9.66-4.818-8.917-10.224L19.36 8.776A9 9 0 0 1 28.276 1Z"
      className="box-shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] fill-neutral-50 stroke-[#d1d4d6] dark:fill-[#141415] dark:stroke-[#24252A]"
    />
  </svg>
);
