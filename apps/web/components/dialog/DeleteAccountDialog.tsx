import type { ForwardedRef } from "react";
import { forwardRef, useContext, useState } from "react";
import router from "next/router";
import * as RadixDialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

import { Input } from "@refeed/ui";
import {
  ContentTopBar,
  DialogOpenContext,
  DialogRoot,
  DialogTrigger,
  getEnsureDialogContainer,
} from "@refeed/ui/components/dialog/AddDialog";

import { cn } from "../../lib/cnutils";
import { trpc } from "../../utils/trpc";

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const dialogVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

export const DeleteAccount = () => {
  return (
    <DialogRoot>
      <DialogTrigger className="flex cursor-pointer items-center justify-center rounded-md">
        <div className="rounded-[5px] text-sm font-medium text-red-400">
          Delete Account
        </div>
      </DialogTrigger>
      <DialogContentAnimated title="Delete Account" />
    </DialogRoot>
  );
};

function DialogContentCore(
  { className, ...props }: RadixDialog.DialogContentProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const isOpen = useContext(DialogOpenContext);

  const [confirmBoxText, setConfirmBoxText] = useState<string | undefined>(
    undefined,
  );

  const deleteAccount = trpc.settings.deleteAccount.useMutation();

  return (
    <>
      {isOpen && (
        <RadixDialog.Portal forceMount container={getEnsureDialogContainer()}>
          <RadixDialog.Overlay
            className="bg-background/80 fixed inset-0 z-50 bg-neutral-700/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            asChild
          >
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
            />
          </RadixDialog.Overlay>
          <RadixDialog.Content
            forceMount
            asChild
            ref={forwardedRef}
            className={cn(
              "text-optimize-legibility fixed z-[60] grid w-[300px] gap-4 rounded-b-lg bg-white shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.08),0_4px_10px_rgba(166,166,166,0.16)] fade-in-100 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 dark:bg-[#0f0f10] dark:shadow-md",
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
              <ContentTopBar title={props.title} />
              <motion.div className="flex h-full w-[300px] flex-col items-stretch px-3 pb-2">
                <>
                  <Input
                    onChange={(e) => {
                      setConfirmBoxText(e.target.value);
                    }}
                    className="mb-4"
                    placeholder='Type "Confirm" to Confirm'
                  />
                  <RadixDialog.Close aria-label="Close">
                    <motion.div
                      layout="position"
                      layoutId="DeleteButton"
                      onClick={() => {
                        if (confirmBoxText == "Confirm") {
                          router.push("/login");
                          router.reload();
                          deleteAccount.mutate();
                        }
                      }}
                      className={`mb-1 w-full ${
                        confirmBoxText != "Confirm"
                          ? "cursor-not-allowed bg-red-500/60"
                          : "cursor-pointer bg-red-500"
                      } rounded-md py-1.5 text-center font-medium tracking-tight text-white`}
                    >
                      Delete Account
                    </motion.div>
                  </RadixDialog.Close>
                </>
              </motion.div>
            </motion.div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      )}
    </>
  );
}
export const DialogContentAnimated = forwardRef<
  HTMLDivElement,
  RadixDialog.DialogContentProps
>(DialogContentCore);
