import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { Drawer } from "vaul";

import { FeedGraphic } from "../../../apps/web/components/feed/EmptyMessage";
import { PricingPage } from "../../../apps/web/components/upgrade/PricingPage";
import type { FeedTypes } from "../../../apps/web/types/feed";

export const UpgradeForNewsletterMessage = ({
  FeedType,
  className,
}: {
  FeedType: FeedTypes;
  className?: string;
}) => (
  <div className={clsx("flex h-full flex-col items-center", className)}>
    <FeedGraphic />
    <h1 className="mt-6 text-sm font-semibold leading-none">
      Upgrade to Refeed Pro
    </h1>
    <h2 className="mt-3 max-w-[300px] text-center text-sm  text-neutral-500 dark:text-stone-400">
      {FeedType == "bookmarks" ? (
        <span>Bookmark items to see them in here.</span>
      ) : FeedType == "recentlyread" ? (
        <span>Read items to see them in here.</span>
      ) : (
        <div className="flex flex-col">
          <span>
            <UpgradeButton /> to get a email address where its mail shows up as
            items here.
          </span>
        </div>
      )}
    </h2>
  </div>
);

const UpgradeButton = () => (
  <Dialog.Root>
    <Drawer.Root direction="right" shouldScaleBackground>
      <Drawer.Trigger className="cursor-pointer select-none text-sky-500">
        Upgrade
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 right-0 z-50 mt-24 flex h-full w-[1000px] flex-col overflow-scroll overflow-x-hidden rounded-t-[10px] bg-zinc-100">
          <PricingPage />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  </Dialog.Root>
);
