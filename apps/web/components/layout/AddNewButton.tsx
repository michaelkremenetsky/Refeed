import Link from "next/link";
import { DialogTrigger } from "components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/DropDownMenu";
import { Copy, Folder } from "lucide-react";

import { DialogRoot } from "@refeed/ui/components/dialog/AddDialog";

import { AddFolderDialog } from "../dialog/AddFolderDialog";

export const AddNewButton = () => {
  return (
    <DialogRoot>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="mb-1 ml-auto mr-4 mt-6 text-sm font-medium tracking-wider text-neutral-400 opacity-0 group-hover/add:opacity-100 dark:text-stone-400">
            +
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Folder className="mr-2 h-4 w-4 stroke-neutral-450 dark:stroke-stone-400" />
              <span>Folder</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <Link href="/discover">
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4 stroke-neutral-450 dark:stroke-stone-400" />

              <span>Feed</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddFolderDialog link={undefined} title="Add Folder" />
    </DialogRoot>
  );
};

export const AddNewButtonBottom = () => {
  return (
    <DialogRoot>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="mb-4 ml-[6px] mt-1 flex items-center text-base text-neutral-450 dark:text-stone-500">
            <span className="mr-2">+</span> Add New
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" alignOffset={-4} className="w-32">
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Folder className="mr-2 h-4 w-4 stroke-neutral-450 dark:stroke-stone-400" />
              <span>Folder</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <Link href="/discover">
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4 stroke-neutral-450 dark:stroke-stone-400" />

              <span>Feed</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddFolderDialog link={undefined} title="Add Folder" />
    </DialogRoot>
  );
};
