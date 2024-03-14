import { useContext, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { trpc } from "utils/trpc";

import { useUser } from "@refeed/features/hooks/useUser";
import { useOpenItem } from "@refeed/features/item/useItemDataWeb";
import {
  ContentTopBar,
  DialogOpenContext,
  dialogVariants,
  getEnsureDialogContainer,
} from "@refeed/ui/components/dialog/AddDialog";
import { Input } from "@refeed/ui/components/input";

import { BookmarkFolderUpgradeMessage } from "../../../../packages/features/pro/BookmakFolderUpgradeMessage";
import { useUpdateBookmarkFolders } from "../../features/bookmarks/useUpdateBookmarkFolders";
import { cn } from "../../lib/cnutils";

interface ExtendedProps extends RadixDialog.DialogContentProps {
  link?: string;
}

export function BookmarkFolderDialog({ className, ...props }: ExtendedProps) {
  const isOpen = useContext(DialogOpenContext);

  const { openItem } = useOpenItem();
  const { plan } = useUser();
  const [folderName, setFolderName] = useState<string | undefined>();
  const { toggleBookmarkFolder } = useUpdateBookmarkFolders();
  const [error, setError] = useState<string | undefined>(undefined);

  const { data: bookmarkFolders } =
    trpc.bookmark.getBookmarkFoldersForUser.useQuery();

  return (
    <>
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
          <AnimatePresence>
            <RadixDialog.Content
              forceMount
              asChild
              className={cn(
                "fixed z-50 grid w-[300px] gap-4 rounded-b-lg bg-white shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.08),0_4px_10px_rgba(166,166,166,0.16)] fade-in-100 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 dark:bg-[#0f0f10] dark:shadow-md",
                className,
              )}
              {...props}
            >
              <motion.div
                variants={dialogVariants}
                initial="closed"
                animate="open"
                exit="closed"
                layout
                layoutId="addDialog"
              >
                {bookmarkFolders?.length! >= 3 && plan == "free" ? (
                  <BookmarkFolderUpgradeMessage />
                ) : (
                  <>
                    <ContentTopBar title={props.title} />
                    <motion.div className="flex h-full w-[300px] flex-col items-stretch px-3.5 pb-2">
                      <Input
                        onChange={(e) => {
                          if (
                            bookmarkFolders?.find(
                              (folder) => folder.name === e.target.value,
                            )
                          ) {
                            setError("Bookmark folder already exists");
                            return;
                          } else {
                            setError(undefined);
                            setFolderName(e.target.value);
                          }
                        }}
                        placeholder="Folder Name"
                      />
                      <RadixDialog.Close aria-label="Close">
                        <motion.button
                          layout="preserve-aspect"
                          onClick={() => {
                            // Check if their is already a folder with this name
                            if (
                              bookmarkFolders?.find(
                                (folder) => folder.name === folderName,
                              )
                            ) {
                              setError("Bookmark folder already exists");
                              return;
                            }

                            if (
                              plan == "pro" ||
                              (bookmarkFolders?.length! <= 3 && plan == "free")
                            )
                              if (folderName && openItem) {
                                toggleBookmarkFolder(openItem, folderName);
                              }
                          }}
                          className={`-z-10 mb-1 mt-4 w-full  ${
                            error || folderName == ""
                              ? "cursor-not-allowed bg-sky-500/60"
                              : "bg-sky-500"
                          } rounded-md py-1.5 text-center font-medium tracking-tight text-white`}
                        >
                          Create Folder
                        </motion.button>
                      </RadixDialog.Close>
                      {error && (
                        <h3 className="pointer-events-none rounded-md text-center text-neutral-500">
                          {error}
                        </h3>
                      )}
                    </motion.div>
                  </>
                )}
              </motion.div>
            </RadixDialog.Content>
          </AnimatePresence>
        </RadixDialog.Portal>
      )}
    </>
  );
}
