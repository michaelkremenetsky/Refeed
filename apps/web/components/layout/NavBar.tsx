import { useRouter } from "next/router";
import { LayoutTypes } from "@components/feed/FeedLayout";
import { SideBarWidth } from "@components/layout/SideBar";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { PanelLeft } from "lucide-react";
import { useWindowSize } from "usehooks-ts";

import { trimTitle } from "../../lib/trimTitle";
import { feedLayout } from "../../stores/ui";
import { ThemedSkeleton } from "../ui/Skeleton";
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
  const [width, setWidth] = useAtom(SideBarWidth);
  const [Layout] = useAtom(feedLayout);

  const { width: windowWidth } = useWindowSize();

  const { query } = useRouter();
  const { item: itemParam, search } = query;
  const readerOpen = itemParam != undefined || search != undefined;

  const isMobile = windowWidth < 500;

  return (
    <Dialog.Root>
      <div
        className={`sticky top-0 z-10 flex h-10 border-b border-[#f0f0f0] bg-white/95 backdrop-blur dark:border-[#24252A] dark:bg-[#0f0f10]`}
      >
        <PanelLeft
          size={18}
          onClick={() => (width != 240 ? setWidth(240) : setWidth(0))}
          className={clsx(
            "left-3 top-2.5 stroke-neutral-400 stroke-[2] dark:stroke-stone-400",
            "absolute md:hidden",
          )}
        />
        {title == "Discover" ? (
          <div
            className={`flex w-full items-center overflow-x-auto scrollbar-hide`}
          >
            <motion.div
              layout="preserve-aspect"
              transition={{
                duration: title ? 0.1 : 0,
              }}
              className="mx-auto flex"
            >
              <div className="sm:w-[250px] md:mx-0 md:w-[500px] lg:w-[750px] xl:w-[1000px]">
                <h1
                  className={`-ml-1 truncate text-ellipsis font-bold tracking-[-0.01em]`}
                >
                  Discover
                </h1>
              </div>
            </motion.div>
          </div>
        ) : (
          <div
            className={`flex w-full items-center overflow-x-auto scrollbar-hide`}
          >
            <LayoutTypes Layout={Layout} readerOpen={readerOpen}>
              <div
                className={clsx(
                  Layout == "Article" && "md:ml-3 md:w-[39.5em] lg:ml-6",
                  Layout == "Magazine" &&
                    !isMobile &&
                    "md:ml-3 md:w-[35em] lg:ml-8",
                  Layout == "Card" && "lg:ml-2",
                )}
              >
                {title != "" ? (
                  <h1
                    className={`truncate text-ellipsis font-bold tracking-[-0.01em]`}
                  >
                    {trimTitle(title, 30)}
                  </h1>
                ) : (
                  <ThemedSkeleton className="h-5 min-w-[100px] max-w-[200px] py-2 dark:bg-[#1a1a1a]" />
                )}
              </div>
              <div className="md:w-[250px]" />
            </LayoutTypes>
          </div>
        )}
        <NavBarButtons {...props} />
      </div>
    </Dialog.Root>
  );
}
