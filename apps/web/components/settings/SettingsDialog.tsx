import * as Dialog from "@radix-ui/react-dialog";
import { useUser } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import type { Options } from "nuqs";

import OrganizeFeeds from "../../features/feed/OrganizeFeeds";
import { trpc } from "../../utils/trpc";
import { AccountSettingsPage } from "./pages/Account";
import { BookmarksSettingsPage } from "./pages/Bookmarks";
import { FeedsSettingsPage } from "./pages/Feeds";
import { FiltersSettingsPage } from "./pages/Filters";
import { GeneralSettingsPage } from "./pages/General";
import { SharingSettingsPage } from "./pages/Sharing";
import { SettingsMenuButton } from "./SettingsMenuButton";

export const SettingsDialog = (props: {
  page: string;
  setPage: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options | undefined,
  ) => Promise<URLSearchParams>;
  setDialogUndefined: () => void;
}) => {
  const { page, setPage, setDialogUndefined } = props;

  const { theme } = useTheme();

  const user = useUser();

  trpc.bookmark.getBookmarkFoldersForUser.useQuery();

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
        className="fixed left-[50%] top-[50%] z-40 h-[600px] max-h-[85vh] w-[90vw] max-w-[1000px] translate-x-[-50%] translate-y-[-50%] transform"
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
          className={`${
            theme == "dark"
              ? "dark dark:border-[2px]  dark:border-[#262626]"
              : ""
          } text-optimize-legibility flex h-full w-full overflow-x-hidden rounded-[5px] bg-white text-[#38383d] subpixel-antialiased shadow-[0_0px_0px_0.75px_rgba(0,0,0,0.15)] focus:outline-none dark:bg-[#0f0f10] dark:text-[#F3F5F7]`}
        >
          <div className="w-[215px] rounded-l-[5px] border-r border-[#f0f0f0] bg-[#fcfcfc] dark:border-[#262626] dark:bg-[#141415]">
            <div className="flex h-full flex-col justify-between">
              <div className="self-grow ml-0.5 mt-[11px]">
                <div className="ml-2 flex rounded-lg pb-2">
                  <div className="mt-0.5 flex h-[1.6rem] w-[1.6rem] select-none items-center justify-center rounded-[4px] bg-[#0496FF]/10 pt-0.5 text-xs font-normal">
                    <h4 className="font-medium text-sky-500">M</h4>
                  </div>
                  <div className="flex flex-col pl-[1px]">
                    <h4 className="max-w-8/12 max-w-[170px] select-none truncate pl-1.5 text-[13.25px] font-[500] leading-4 dark:text-stone-200">
                      {user?.user_metadata.full_name ?? user?.email}
                    </h4>
                    <h4 className="max-w-[155px] select-none truncate pl-1.5 text-[11px] font-[500] leading-4 text-neutral-450 dark:text-stone-500">
                      {user?.email}
                    </h4>
                  </div>
                </div>
                <SettingsMenuButton
                  name="general"
                  setPage={setPage}
                  page={page}
                />
                <SettingsMenuButton
                  name="sharing"
                  setPage={setPage}
                  page={page}
                />
                <SettingsMenuButton
                  name="filters"
                  setPage={setPage}
                  page={page}
                />
                <SettingsMenuButton
                  name="bookmarks"
                  setPage={setPage}
                  page={page}
                />
                <SettingsMenuButton
                  name="feeds"
                  setPage={setPage}
                  page={page}
                />
                <SettingsMenuButton
                  name="organize"
                  setPage={setPage}
                  page={page}
                />
                <SettingsMenuButton
                  name="account"
                  setPage={setPage}
                  page={page}
                />
              </div>
            </div>
          </div>
          <div className="ml-8 flex-grow">
            {page == "general" && <GeneralSettingsPage />}
            {page == "sharing" && <SharingSettingsPage />}
            {page == "filters" && <FiltersSettingsPage />}
            {page == "bookmarks" && <BookmarksSettingsPage />}
            {page == "feeds" && <FeedsSettingsPage />}
            {page == "organize" && <OrganizeFeeds />}
            {page == "account" && <AccountSettingsPage />}
          </div>
        </motion.div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};
