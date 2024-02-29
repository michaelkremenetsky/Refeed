import type { Dispatch, ForwardedRef, SetStateAction } from "react";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import type { EventFor } from "@refeed/lib/EventFor";
import { Input } from "@refeed/ui";

import { useRenameFolder } from "../../features/folders/useRenameFolder";
import { cn } from "../../lib/cnutils";
import { Dialog } from "../ui/Dialog";

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

const dialogVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

interface ExtendedProps extends RadixDialog.DialogContentProps {
  folderName?: string;
}

function DialogContentCore(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { children, className, folderName, ...props }: ExtendedProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
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
              ref={forwardedRef}
              className={cn(
                "text-optimize-legibility fixed z-50 grid w-[300px] gap-4 rounded-b-lg bg-white shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.08),0_4px_10px_rgba(166,166,166,0.16)] fade-in-100 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 dark:bg-[#0f0f10]",
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
                        onClick={() =>
                          renameFolder(folderName!, newFolderName!)
                        }
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
          </AnimatePresence>
        </RadixDialog.Portal>
      )}
    </>
  );
}
export const RenameFolderDialog = forwardRef<HTMLDivElement, ExtendedProps>(
  DialogContentCore,
);

export const ContentTopBar = (props: {
  addBack?: boolean;
  title?: string;
  setRoute?: Dispatch<SetStateAction<string>>;
}) => {
  const { addBack, title, setRoute } = props;

  return (
    <motion.div className="h-10 select-none rounded-t-xl">
      {addBack ? (
        <div className="absolute left-2 top-5 rounded-[4px] p-1 opacity-70 transition-opacity data-[state=open]:bg-slate-100 hover:bg-[#F5F5F5] hover:opacity-100 disabled:pointer-events-none dark:data-[state=open]:bg-slate-800 dark:hover:bg-[#202020]">
          {title != "Add New Feed" ? (
            <ChevronLeft
              className="stroke-[#525252] dark:stroke-neutral-500"
              onClick={() => {
                if (setRoute) {
                  setRoute("addFeed");
                }
              }}
            />
          ) : null}
        </div>
      ) : null}
      <motion.h1 layout="position" className="pt-3 text-center font-medium">
        {title}
      </motion.h1>
    </motion.div>
  );
};
