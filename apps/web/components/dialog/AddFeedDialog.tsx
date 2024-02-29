import { useContext, useEffect, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";

import {
  DialogOpenContext,
  dialogVariants,
} from "@refeed/ui/components/dialog/AddDialog";

import { cn } from "../../lib/cnutils";
import { AddFeedDialogContent } from "./AddFeedDialogContent";
import { ContentTopBar, getEnsureDialogContainer } from "./RenameFolderDialog";

interface ExtendedProps extends RadixDialog.DialogContentProps {
  link?: string;
  searchLink?: string;
  title?: string;
  feed_title?: string;
  favicon_url?: string;
}

export function AddFeedDialog({
  className,
  link: defaultLink,
  title,
  favicon_url,
  searchLink,
  ...props
}: ExtendedProps) {
  const isOpen = useContext(DialogOpenContext);

  const [route, setRoute] = useState<string>("addFeed");

  useEffect(() => {
    setRoute("addFeed");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <RadixDialog.Portal container={getEnsureDialogContainer()}>
          <RadixDialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.2,
              }}
              className="fixed inset-0 z-50 bg-neutral-600/20"
            />
          </RadixDialog.Overlay>
          <RadixDialog.Content
            asChild
            className={cn(
              "text-optimize-legibility fixed z-50 grid gap-4 overflow-hidden rounded-b-lg bg-white shadow-[rgba(31,34,37,0.09)_0px_0px_0px_1px,rgba(0,0,0,0.08)_0px_12px_24px_-4px,rgba(0,0,0,0.04)_0px_8px_16px_-4px] fade-in-100 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 dark:bg-[#0f0f10]",
              route == "addFeed" ? "w-[300px]" : "w-[600px]",
              className,
            )}
            {...props}
          >
            <motion.div
              variants={dialogVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <ContentTopBar title={title} />
              <AddFeedDialogContent
                {...props}
                route={route}
                setRoute={setRoute}
                className={className}
                link={defaultLink}
                title={title}
                searchLink={searchLink}
                favicon_url={favicon_url}
              />
            </motion.div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      )}
    </AnimatePresence>
  );
}
