import { UpgradeDrawer } from "@components/upgrade/Drawer";
import { atom, useSetAtom } from "jotai";
import { AArrowDown, AArrowUp, MoreHorizontal } from "lucide-react";

import { useUser } from "@refeed/features/hooks/useUser";

import { feedLayout, Sort } from "../../stores/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu";

interface NavBarTypes {
  feedId?: string;
  hideButtons?: boolean;
  title?: string;
  recentPage?: boolean;
  bookmarkPage?: boolean;
}

export const NavBarButtons = (props: NavBarTypes) => {
  const { hideButtons } = props;

  const { plan } = useUser();

  return (
    <div className="item-center absolute right-2 top-1.5 justify-end rounded text-xl font-bold">
      <div className="flex items-center self-center">
        {!hideButtons ? (
          <div className={`flex self-center`}>
            <FeedLayoutButtonNew />
          </div>
        ) : null}
        {plan == "free" && <UpgradeDrawer />}
      </div>
    </div>
  );
};

export const aiAtom = atom(false);

const FeedLayoutButtonNew = () => {
  const setFeedLayout = useSetAtom(feedLayout);
  const setSort = useSetAtom(Sort);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <MoreHorizontal className="h-[21.5px] w-[21.5px] cursor-pointer rounded stroke-[#38383d]/60 stroke-[1.4] dark:stroke-stone-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[175px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Layout</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setFeedLayout("Magazine");
            }}
          >
            <span>Magazine</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setFeedLayout("Card");
            }}
          >
            <span>Card</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setFeedLayout("Article");
            }}
          >
            <span>Article</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setSort("Latest"), window.scrollTo(0, 0);
            }}
          >
            <AArrowDown
              shapeRendering="geometricPrecision"
              size={20}
              className="mr-2 stroke-[#38383d]/60 dark:stroke-stone-400"
            />
            <span>Latest</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSort("Oldest"), window.scrollTo(0, 0);
            }}
          >
            <AArrowUp
              shapeRendering="geometricPrecision"
              className="mr-2 stroke-[#38383d]/60 dark:stroke-stone-400"
              size={20}
            />
            <span>Oldest</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const openFilterBar = atom(true);
