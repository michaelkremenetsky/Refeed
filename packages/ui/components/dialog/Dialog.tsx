"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

interface ExtendedDialogPortalProps extends DialogPrimitive.DialogPortalProps {
  className?: string;
}

const DialogPortal = ({
  className,
  children,
  ...props
}: ExtendedDialogPortalProps) => (
  // @ts-ignore
  <DialogPrimitive.Portal className={cn(className)} {...props}>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "bg-background/80 fixed inset-0 z-40 bg-neutral-700/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  >
    <motion.div
      variants={overlayVariants}
      initial="closed"
      animate="open"
      exit="closed"
    />
  </DialogPrimitive.Overlay>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 w-full gap-4 rounded-b-lg bg-white shadow-[rgba(0,0,0,0.09)_0px_3px_12px] fade-in-100 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 dark:bg-[#0f0f10]",
        className,
      )}
      {...props}
    >
      <div className="h-12 select-none rounded-t-xl">
        <div className="flex w-full justify-center">
          <h1 className="max-w-[200px] overflow-hidden truncate pt-3 text-center font-medium">
            {props.title}
          </h1>
        </div>
        <DialogPrimitive.Close className="absolute right-2 top-3 rounded-[4px] p-1 opacity-70 transition-opacity data-[state=open]:bg-slate-100 hover:bg-[#F5F5F5] hover:opacity-100 disabled:pointer-events-none dark:data-[state=open]:bg-slate-800 dark:hover:bg-[#202020]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="stroke-[#525252] dark:stroke-neutral-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
      <div className="h-full px-3 pb-2"> {children}</div>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-500", "dark:text-slate-400", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
};
