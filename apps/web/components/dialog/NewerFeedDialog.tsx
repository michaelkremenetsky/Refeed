import { useContext } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";

import {
  DialogOpenContext,
  dialogVariants,
  getEnsureDialogContainer,
} from "@refeed/ui/components/dialog/AddDialog";

import { cn } from "../../lib/cnutils";
import { trpc } from "../../utils/trpc";

// NOTE: This is not in use anywhere for now

interface ExtendedProps extends RadixDialog.DialogContentProps {
  amount?: number;
}

export function NewerFeedDialog({ className, ...props }: ExtendedProps) {
  const isOpen = useContext(DialogOpenContext);
  const utils = trpc.useUtils();

  const deleteBookmarkFolder = trpc.bookmark.deleteBookmarkFolder.useMutation();

  const folderName = "";

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
              "fixed z-50 grid w-[300px] gap-4 rounded-b-lg bg-white shadow-[rgba(31,34,37,0.09)_0px_0px_0px_1px,rgba(0,0,0,0.08)_0px_12px_24px_-4px,rgba(0,0,0,0.04)_0px_8px_16px_-4px] fade-in-100  sm:max-w-lg sm:rounded-lg sm:zoom-in-90",
              "dark:bg-slate-900",
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
              <motion.div className="mt-1 flex h-full w-[300px] flex-col items-stretch px-3 ">
                <h2 className="mb-2 py-2 text-center text-neutral-800">
                  {" "}
                  Delete &quot;{folderName}&quot; with
                  <span className="ml-1 rounded-sm bg-[#0496FF]/10 px-0.5">
                    <span className="text-sm text-sky-500">{props.amount}</span>
                  </span>{" "}
                  items?
                </h2>
                <>
                  <RadixDialog.Close aria-label="Close">
                    <motion.div
                      layout="position"
                      layoutId="DeleteButton"
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={async () => {
                        // Update local cache instantly
                        const newBookmarks =
                          utils.bookmark.getBookmarkFoldersForUser
                            .getData()
                            ?.filter((folder) => {
                              return folder.name != folderName;
                            });

                        utils.bookmark.getBookmarkFoldersForUser.setData(
                          undefined,
                          newBookmarks,
                        );

                        await deleteBookmarkFolder.mutateAsync({
                          folderName: folderName,
                        });

                        utils.bookmark.getBookmarkFoldersForUser.invalidate();
                      }}
                      className={`mb-3 w-full cursor-pointer rounded-md bg-red-500/95 py-1.5 text-center font-medium tracking-tight text-white`}
                    >
                      Delete
                    </motion.div>
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
