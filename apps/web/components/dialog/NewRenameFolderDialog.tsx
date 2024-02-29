import { useContext, useEffect, useRef, useState } from "react";
import { ContentTopBar } from "@components/dialog/RenameFolderDialog";
import { useRenameFolder } from "@features/folders/useRenameFolder";
import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";

import type { EventFor } from "@refeed/lib/EventFor";
import { Input } from "@refeed/ui";
import {
  DialogOpenContext,
  dialogVariants,
  getEnsureDialogContainer,
} from "@refeed/ui/components/dialog/AddDialog";

import { cn } from "../../lib/cnutils";

interface ExtendedProps extends RadixDialog.DialogContentProps {
  folderName?: string;
}

export function RenameFolderDialog({
  className,
  folderName,
  ...props
}: ExtendedProps) {
  const isOpen = useContext(DialogOpenContext);

  const [newFolderName, setNewFolderName] = useState<string | undefined>();

  const { renameFolder } = useRenameFolder();

  const textboxRef = useRef(null);

  // The tree view libary hjacks the keyboard input to open and close the folder so we to have hjack it back here
  useEffect(() => {
    const focusTextbox = () => {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      textboxRef.current?.focus();
    };

    document.addEventListener("click", focusTextbox);
    document.addEventListener("keydown", focusTextbox);

    return () => {
      document.removeEventListener("click", focusTextbox);
      document.removeEventListener("keydown", focusTextbox);
    };
  }, []);
  const handleSpaceBar = (event: EventFor<"input", "onKeyDown">) => {
    // List of keys to stop propagation for
    const keysToStop = [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    if (keysToStop.includes(event.key)) {
      event.stopPropagation();
    }
  };

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
              "fixed z-50 grid w-[300px] gap-4 rounded-b-lg bg-white shadow-[rgba(31,34,37,0.09)_0px_0px_0px_1px,rgba(0,0,0,0.08)_0px_12px_24px_-4px,rgba(0,0,0,0.04)_0px_8px_16px_-4px] fade-in-100 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 dark:bg-[#0f0f10]",
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
              <ContentTopBar title={props.title} />
              <motion.div className="flex h-full w-[300px] flex-col items-stretch px-3.5 pb-2">
                <Input
                  onChange={(e) => {
                    setNewFolderName(e.target.value);
                  }}
                  ref={textboxRef}
                  defaultValue={folderName}
                  onKeyDown={handleSpaceBar}
                  placeholder="Folder Name"
                />
                <>
                  <RadixDialog.Close aria-label="Close">
                    <motion.button
                      layout="preserve-aspect"
                      onClick={() => renameFolder(folderName!, newFolderName!)}
                      className={`-z-10 mb-1 mt-4 w-full ${
                        folderName?.length == 0
                          ? "cursor-not-allowed bg-sky-500/60"
                          : "bg-sky-500"
                      } rounded-md py-1.5 text-center font-medium tracking-tight text-white`}
                    >
                      Rename Folder
                    </motion.button>
                  </RadixDialog.Close>
                </>
              </motion.div>
            </motion.div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      )}
    </AnimatePresence>
  );
}
