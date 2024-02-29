/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "../../utils/cnutils";
import {
  ContentTopBar,
  DialogOpenContext,
  dialogVariants,
  getEnsureDialogContainer,
} from "./AddDialog";

interface DialogProps {
  defaultRoute: string;
  className?: string;
  children?: React.ReactNode;
}

export const DialogContext = createContext({
  internalRoute: "",
  setInternalRoute: () => {},
});

export const Dialog = ({ defaultRoute, className, children }: DialogProps) => {
  const isOpen = useContext(DialogOpenContext);
  const [internalRoute, setInternalRoute] = useState(defaultRoute);

  useEffect(() => {
    setInternalRoute(defaultRoute);
  }, [defaultRoute, isOpen]);

  return (
    // @ts-ignore
    <DialogContext.Provider value={{ internalRoute, setInternalRoute }}>
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
                "text-optimize-legibility fixed z-50 grid gap-4 overflow-hidden rounded-b-lg bg-white shadow-[rgba(31,34,37,0.09)_0px_0px_0px_1px,rgba(0,0,0,0.08)_0px_12px_24px_-4px,rgba(0,0,0,0.04)_0px_8px_16px_-4px] fade-in-100  sm:max-w-lg sm:rounded-lg sm:zoom-in-90",
                internalRoute == "addFeed" ? "w-[300px]" : "w-[600px]",
                className,
              )}
            >
              <motion.div
                variants={dialogVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <ContentTopBar title={internalRoute} />
                {children}
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};
