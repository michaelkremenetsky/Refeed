import type { Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

import { Dialog } from "./Dialog";

export const DialogOpenContext = createContext<boolean>(false);

export const DialogTrigger = RadixDialog.Trigger;

export function DialogRoot({ children, ...props }: RadixDialog.DialogProps) {
  const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <DialogOpenContext.Provider value={isOpen}>
      <Dialog onOpenChange={setOpen} {...props}>
        {children}
      </Dialog>
    </DialogOpenContext.Provider>
  );
}

export const dialogVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

let dialogContainer: HTMLDivElement;

export function getEnsureDialogContainer() {
  if (!dialogContainer) {
    dialogContainer = document.createElement("div");
    dialogContainer.className =
      "fixed pointer-events-none flex items-center justify-center inset-0 z-50";
    document.body.append(dialogContainer);
  }

  return dialogContainer;
}

export const ContentTopBar = (props: {
  addBack?: boolean;
  title?: string;
  setRoute?: Dispatch<SetStateAction<string>>;
}) => {
  const { title } = props;

  return (
    <div className="mx-4 select-none overflow-hidden rounded-t-xl">
      <motion.h1
        layout="position"
        className="pt-3 text-center font-medium text-neutral-800 dark:text-stone-200"
      >
        {title}
      </motion.h1>
    </div>
  );
};
