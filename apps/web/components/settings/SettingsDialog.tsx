import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useUser } from "@supabase/auth-helpers-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import type { Options } from "nuqs";
import { Text } from "react-aria-components";
import { useHotkeys } from "react-hotkeys-hook";
import { useWindowSize } from "usehooks-ts";

import { capitalizeFirstLetter } from "../../../../packages/lib/capitalizeFirstLetter";
import OrganizeFeeds from "../../features/feed/OrganizeFeeds";
import { trpc } from "../../utils/trpc";
import { AccountSettingsPage } from "./pages/Account";
import { BookmarksSettingsPage } from "./pages/Bookmarks";
import { DeveloperSettingsPage } from "./pages/DeveloperSettingsPage";
import { FeedbackSettingsPage } from "./pages/Feedback";
import { FeedsSettingsPage } from "./pages/Feeds";
import { FiltersSettingsPage } from "./pages/Filters";
import { GeneralSettingsPage } from "./pages/General";
import { SharingSettingsPage } from "./pages/Sharing";

export const SettingsDialog = (props: {
  page: string;
  setPage: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options | undefined,
  ) => Promise<URLSearchParams>;
  setDialogUndefined: () => void;
}) => {
  const { page, setPage, setDialogUndefined } = props;
  const [settingsSideBarOpen, setSettingsSideBarOpen] = useState(false);
  const { width: windowWidth } = useWindowSize();
  const onMobile = windowWidth < 500;

  const { theme } = useTheme();
  const user = useUser();

  const pageTypes = [
    "general",
    "sharing",
    "filters",
    "bookmarks",
    "feeds",
    "organize",
    "account",
    "feedback",
  ];

  // Temporary hack to make arrow keys work till I figure out a component based solution
  useHotkeys("UP", () => {
    const newIndex = pageTypes.indexOf(page) - 1;
    setPage(pageTypes[newIndex >= 0 ? newIndex : pageTypes.length - 1]!);
  });
  useHotkeys("DOWN", () => {
    const newIndex = pageTypes.indexOf(page) + 1;
    setPage(pageTypes[newIndex < pageTypes.length ? newIndex : 0]!);
  });

  // Prefetch queries to preven pop in
  trpc.bookmark.getBookmarkFoldersForUser.useQuery();
  trpc.feed.getAllUserFeeds.useQuery();

  const MobileSidebarOpen = () => {
    if (onMobile && !settingsSideBarOpen) {
      return (
        <div className="mt-3 flex items-center">
          <ChevronLeft
            size={24}
            onClick={() => setSettingsSideBarOpen(!settingsSideBarOpen)}
            className="stroke-neutral-400/90 stroke-[1.5] dark:stroke-stone-400"
          />
          <svg
            onClick={() => setDialogUndefined()}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="ml-auto mr-4 h-[22px] w-[22px] stroke-neutral-450 dark:stroke-neutral-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      );
    }
  };

  const AccountInfo = () => (
    <div className="ml-2 flex rounded-lg pb-2">
      <div className="mt-0.5 flex h-[1.6rem] w-[1.6rem] select-none items-center justify-center rounded-[4px] bg-[#0496FF]/10 pt-0.5 text-xs font-normal">
        <h4 className="font-medium text-sky-500">M</h4>
      </div>
      <div className="flex flex-col pl-[2px]">
        <h4 className="max-w-8/12 max-w-[170px] select-none truncate pl-1.5 text-[13.25px] font-[500] leading-4 dark:text-stone-200">
          {user?.user_metadata.full_name ?? user?.email}
        </h4>
        <h4 className="max-w-[155px] select-none truncate pl-1.5 text-[11px] font-[500] leading-4 text-neutral-450 dark:text-stone-500">
          {user?.email}
        </h4>
      </div>
    </div>
  );

  return (
    <Dialog.Portal>
      <Dialog.Overlay>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.2,
          }}
          className="fixed inset-0 z-40 bg-neutral-600/25"
        />
      </Dialog.Overlay>
      <Dialog.Content
        onPointerDownOutside={() => {
          setDialogUndefined();
        }}
        className="fixed left-[50%] top-[50%] z-40 h-full w-full max-w-[1000px] translate-x-[-50%] translate-y-[-50%] transform md:h-[600px] md:max-h-[85vh] md:w-[90vw]"
      >
        <motion.div
          initial={{ y: -2 }}
          animate={{
            y: 0,
            transition: {
              ease: "easeOut",
              duration: 0.15,
            },
          }}
          exit={{
            y: -2,
            transition: {
              ease: "easeIn",
              duration: 0.15,
            },
          }}
          className={clsx(
            theme == "dark" && "dark dark:border-[2px] dark:border-[#262626]",
            `text-optimize-legibility dialog-shadow flex h-full w-full overflow-x-hidden bg-white text-[#38383d] subpixel-antialiased focus:outline-none md:rounded-lg dark:bg-[#0f0f10] dark:text-[#F3F5F7]`,
            !onMobile && "border-[1.5px] border-neutral-400/65",
          )}
        >
          <div
            className={clsx(
              "border-r border-[#f0f0f0] bg-[#fcfcfc] md:block md:w-[215px] md:rounded-l-lg dark:border-[#262626] dark:bg-[#141415]",
              onMobile &&
                (!settingsSideBarOpen
                  ? "hidden h-screen"
                  : "fixed z-[96] h-screen"),
            )}
          >
            <div className="flex h-full flex-col justify-between">
              <div className="self-grow ml-0.5 mt-[11px]">
                <AccountInfo />
                <div
                  onClick={() => {
                    setSettingsSideBarOpen(false);
                  }}
                >
                  {pageTypes.map((pageType) => (
                    <div className="mx-1 my-[0.1rem] pr-1" key={pageType}>
                      <button
                        className={clsx(
                          props.page == pageType &&
                            "bg-[#f5f5f5] dark:bg-[#19191a]",
                          `h-7.5 group flex w-full rounded-md py-[0.38rem] pl-2 font-[425] hover:bg-[#f5f5f5] dark:hover:bg-[#19191a]`,
                        )}
                        onClick={() => {
                          props.setPage(pageType);
                        }}
                      >
                        <Text
                          slot="label"
                          className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
                        >
                          {capitalizeFirstLetter(pageType)}
                        </Text>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={clsx("ml-5 flex-grow md:ml-8")}>
            <MobileSidebarOpen />
            {page == "general" && <GeneralSettingsPage />}
            {page == "sharing" && <SharingSettingsPage />}
            {page == "filters" && <FiltersSettingsPage />}
            {page == "bookmarks" && <BookmarksSettingsPage />}
            {page == "feeds" && <FeedsSettingsPage />}
            {page == "organize" && <OrganizeFeeds />}
            {page == "account" && <AccountSettingsPage />}
            {page == "feedback" && <FeedbackSettingsPage />}
            {page == "developer" && <DeveloperSettingsPage />}
          </div>
        </motion.div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};
