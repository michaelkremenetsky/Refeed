import { SideBarWidth } from "@components/layout/SideBar";
import { ThemedSkeleton } from "@components/ui/Skeleton";
import * as Dialog from "@radix-ui/react-dialog";
import { useAtom, useAtomValue } from "jotai";
import { ArrowRightToLine } from "lucide-react";

import { trimTitle } from "../../lib/trimTitle";
import { feedLayout } from "../../stores/ui";
import { NavBarButtons } from "./NavBarButtons";

interface NavBarTypes {
  feedId?: string;
  feedUrl?: string;
  hideButtons?: boolean;
  title?: string;
  recentPage?: boolean;
  bookmarkPage?: boolean;
}

export default function NavBar(props: NavBarTypes) {
  const { title } = props;
  const feedlayout = useAtomValue(feedLayout);
  const [width, setWidth] = useAtom(SideBarWidth);

  return (
    <Dialog.Root>
      <div
        className={`sticky top-0 z-10 flex h-10 border-b border-[#f0f0f0] bg-white/95 backdrop-blur dark:border-[#24252A] dark:bg-[#0f0f10]`}
      >
        {width == 1 && (
          <ArrowRightToLine
            size={16}
            onClick={() => setWidth(240)}
            className="absolute left-2 top-2.5 stroke-neutral-400/90 stroke-[1.5] dark:stroke-stone-400"
          />
        )}
        {title == "Discover" ? (
          <div
            // TODO: Fix this hacky solution
            className={`mx-auto flex transform items-center sm:translate-x-[23px]  md:-translate-x-[100px] lg:translate-x-[15px] xl:-translate-x-[106px]`}
          >
            <div className="w-[5px]" />
            <div
              className={`flex lg:w-[35.15em] ${
                feedlayout == "Card" && title != "Discover"
                  ? "w-[950px]"
                  : feedlayout == "Article" && title != "Discover"
                    ? "w-[620px]"
                    : null
              } font-bold`}
            >
              <h1
                className={`ml-1.5 truncate text-ellipsis tracking-[-0.01em] subpixel-antialiased`}
              >
                {trimTitle(title, 30)}
              </h1>
            </div>
            <div className="w-[250px]" />
          </div>
        ) : (
          <div
            // Remove -translate-x-[4px]?
            className={`mx-auto flex -translate-x-[4px] items-center`}
          >
            <div className="w-[5px]" />
            <div
              // TODO: Fix this hacky solution
              className={`flex sm:w-[35.15em] ${
                feedlayout == "Card" && title != "Discover"
                  ? "w-[150px] xl:-translate-x-[250px]"
                  : feedlayout == "Article" && title != "Discover"
                    ? "w-[620px] xl:-translate-x-[40px]"
                    : null
              } font-bold`}
            >
              {title != "" ? (
                <h1
                  className={`ml-3 truncate text-ellipsis tracking-[-0.01em] subpixel-antialiased`}
                >
                  {trimTitle(title, 30)}
                </h1>
              ) : (
                <ThemedSkeleton className="ml-2 h-5 min-w-[50px] py-2 dark:bg-[#1a1a1a]" />
              )}
            </div>
            <div className="w-[250px]" />
          </div>
        )}
        <NavBarButtons {...props} />
      </div>
    </Dialog.Root>
  );
}
