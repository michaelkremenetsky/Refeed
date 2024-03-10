import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";

import {
  ContentTopBar,
  DialogOpenContext,
  dialogVariants,
  getEnsureDialogContainer,
} from "@refeed/ui/components/dialog/AddDialog";

import { cn } from "../../lib/cnutils";
import { AddFolderDialogContent } from "./AddFolderDialogContent";

interface AddFolderDialogTypes extends RadixDialog.DialogContentProps {
  link: string | undefined;
  title: string;
}

export function AddFolderDialog({
  link,
  title,
  className,
  ...props
}: AddFolderDialogTypes) {
  const isOpen = useContext(DialogOpenContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <RadixDialog.Portal forceMount container={getEnsureDialogContainer()}>
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
            forceMount
            asChild
            className={cn(
              "fixed z-50 grid w-[300px] gap-4 bg-white shadow-[rgba(31,34,37,0.09)_0px_0px_0px_1px,rgba(0,0,0,0.08)_0px_12px_24px_-4px,rgba(0,0,0,0.04)_0px_8px_16px_-4px] fade-in-100 sm:max-w-lg rounded-lg sm:zoom-in-90 dark:bg-[#0f0f10]",
              className,
            )}
          >
            <motion.div
              variants={dialogVariants}
              initial="closed"
              animate="open"
              exit="closed"
              layoutId="addFolder"
            >
              <ContentTopBar title={title} />
              <AddFolderDialogContent
                {...props}
                className={className}
                link={link}
                title={title}
              />
            </motion.div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      )}
    </AnimatePresence>
  );
}
