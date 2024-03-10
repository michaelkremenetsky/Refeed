import * as RadixDialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { useState } from "react";

import { Input } from "@refeed/ui";
import {
  DialogRoot,
  DialogTrigger,
} from "@refeed/ui/components/dialog/AddDialog";

import { useAddFolder } from "../../features/folders/useAddFolder";
import { trpc } from "../../utils/trpc";
import { AddFeedDialog } from "./AddFeedDialog";

interface ExtendedProps extends RadixDialog.DialogContentProps {
  link?: string;
  title?: string;
}

export const AddFolderDialogContent = ({
  link: defaultLink,
}: ExtendedProps) => {
  const [folderName, setFolderName] = useState<string>("");
  const [error, setError] = useState<undefined | string>(undefined);
  const utils = trpc.useUtils();

  const { addFolder } = useAddFolder();

  return (
    <motion.div className="flex h-full w-[300px] flex-col items-stretch px-3.5 pb-2">
      <Input
        onChange={(e) => {
          const feedsInFolders = utils.feed.getFeedsInFolders.getData();

          setFolderName(e.target.value);

          const existingFolderNames = feedsInFolders?.map(
            (folder) => folder.name,
          );
          const existingFolderNamesLowerCase = feedsInFolders?.map((folder) =>
            folder.name.toLowerCase(),
          );

          if (
            existingFolderNames?.includes(e.target.value) ||
            existingFolderNamesLowerCase?.includes(e.target.value.toLowerCase())
          ) {
            setError("Folder with same name already exists");
          } else {
            setError(undefined);
          }
        }}
        className="mb-4"
        placeholder="Name of folder to put feeds in"
      />
      {defaultLink != undefined ? (
        <DialogRoot>
          <DialogTrigger asChild>
            <RadixDialog.Close
              aria-label="Close"
              onClick={() => {
                addFolder(folderName);
                utils.feed.getFeedOrder.reset();
              }}
              className={`mb-1 w-full self-end rounded-md ${
                error || folderName == ""
                  ? "cursor-not-allowed bg-sky-500/60"
                  : "bg-sky-500"
              } py-1.5 font-medium tracking-tight text-white`}
            >
              Add Folder
            </RadixDialog.Close>
          </DialogTrigger>
          <AddFeedDialog link={defaultLink} title="Add New Feed" />
        </DialogRoot>
      ) : (
        <RadixDialog.Close
          aria-label="Close"
            onClick={() => {
            if (folderName.length > 0) {
              addFolder(folderName);
              utils.feed.getFeedOrder.reset();
            }
          }}
          className={`mb-1 w-full self-end rounded-md ${
            error || folderName == ""
              ? "cursor-not-allowed bg-sky-500/60"
              : "bg-sky-500"
          } py-1.5 font-medium tracking-tight text-white`}
        >
          Add Folder
        </RadixDialog.Close>
      )}

      {error && (
        <h3 className="pointer-events-none rounded-md text-center text-neutral-500">
          {error}
        </h3>
      )}
    </motion.div>
  );
};
