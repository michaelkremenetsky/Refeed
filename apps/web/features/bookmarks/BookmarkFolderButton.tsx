import type { ReactNode } from "react";
import { useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { trpc } from "utils/trpc";

import { useOpenItem } from "@refeed/features/item/useItemDataWeb";
import type { ItemType } from "@refeed/types/item";
import {
  DialogRoot,
  DialogTrigger,
} from "@refeed/ui/components/dialog/AddDialog";

import { BookmarkFolderDialog } from "../../components/dialog/BookmarkFolderDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/DropDownMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Tooltip";
import { useUpdateBookmarkFolders } from "./useUpdateBookmarkFolders";

const BookmarkTooltip = ({ children }: { children: ReactNode }) => {
  return (
    <TooltipProvider>
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>Bookmark Folders</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const BookmarkFolderIcon = ({
  openItem,
}: {
  openItem: ItemType | undefined;
}) => (
  <>
    {openItem?.bookmark_folders?.length == 0 ||
    openItem?.bookmark_folders?.length == undefined ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        className="h-6 w-6 stroke-neutral-450 dark:stroke-neutral-500"
        shapeRendering="geometricPrecision"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
          d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        className="h-6 w-6 stroke-sky-500"
        shapeRendering="geometricPrecision"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
          d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"
        />
      </svg>
    )}
  </>
);

export default function BookmarkFolderButton({
  openItemFromArticle,
}: {
  openItemFromArticle?: ItemType;
}) {
  let { openItem } = useOpenItem();
  const { toggleBookmarkFolder } = useUpdateBookmarkFolders();

  if (openItemFromArticle) {
    openItem = openItemFromArticle;
  }

  const { data: bookmarkFolders } =
    trpc.bookmark.getBookmarkFoldersForUser.useQuery();

  const [dialogOpened, setDialogOpened] = useState<boolean | undefined>(
    undefined,
  );

  return (
    <DialogRoot>
      <DropdownMenu
        onOpenChange={() => setDialogOpened(!dialogOpened)}
        modal={false}
      >
        <BookmarkTooltip>
          <DropdownMenuTrigger>
            <BookmarkFolderIcon openItem={openItem} />
          </DropdownMenuTrigger>
        </BookmarkTooltip>
        <DropdownMenuContent className="w-28">
          {bookmarkFolders?.map((folder) => {
            return (
              <DropdownMenuItem
                key={folder.name}
                onClick={(e) => {
                  e.preventDefault();
                  toggleBookmarkFolder(openItem!, folder.name);
                }}
              >
                <Checkbox.Root
                  checked={openItem?.bookmark_folders?.includes(folder.name)}
                >
                  <Checkbox.Indicator>
                    <Check className="stroke-neutral-400 stroke-[1.3] dark:stroke-stone-400" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <div className="pr-1" />
                <span>{folder.name}</span>
              </DropdownMenuItem>
            );
          })}

          <DialogTrigger asChild>
            <DropdownMenuItem>+ Add New</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <BookmarkFolderDialog title="Add Bookmark Folder" />
    </DialogRoot>
  );
}
