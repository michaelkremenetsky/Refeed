import { useEffect, useState } from "react";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { DropdownMenuSeparator } from "@components/ui/DropDownMenu";
import { PricingPage } from "@components/upgrade/PricingPage";
import {
  useSupabaseClient,
  useUser as useSupabaseUser,
} from "@supabase/auth-helpers-react";
import { SettingsDialog } from "components/settings/SettingsDialog";
import { Dialog } from "components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "components/ui/DropDownMenu";
import { useQueryState } from "nuqs";
import { useHotkeys } from "react-hotkeys-hook";
import { Drawer } from "vaul";

import { useUser } from "@refeed/features/hooks/useUser";
import { Badge, ScrollArea } from "@refeed/ui";

export const AccountDropdown = ({ width }: { width: number }) => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const { replace, query, pathname } = useRouter();
  const { plan } = useUser();

  const [DialogType, setDialogType] = useState<
    "Pricing" | "Settings" | undefined
  >();

  const widthStyle = { maxWidth: `${width - 75}px` };

  useHotkeys("f+b", () => replace("/bookmarks"));
  useHotkeys("f+f", () => replace("/feed/all"));
  useHotkeys("f+n", () => replace("/discover"));
  useHotkeys("f+s", () => replace("/search"));
  useHotkeys("g+s", () => {
    setDialogType("Settings"), setPage("general");
  });

  const DropDownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="ml-auto mr-2 h-4 w-4 stroke-neutral-450"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );

  const SettingsTrigger = () => (
    <button
      onClick={() => {
        setDialogType("Settings");
        setPage("general");
      }}
      className="w-full"
    >
      <DropdownMenuItem>
        <span>Settings</span>
      </DropdownMenuItem>
    </button>
  );

  const OpenDiscovery = () => (
    <Link shallow={true} href="/discover">
      <DropdownMenuItem>
        <span>Discover</span>
      </DropdownMenuItem>
    </Link>
  );

  const OpenMobileApps = () => (
    <Link href="/mobile">
      <DropdownMenuItem>
        <span>Mobile Apps</span>
      </DropdownMenuItem>
    </Link>
  );

  const RecentlyRead = () => (
    <Link href="/recentlyread">
      <DropdownMenuItem>
        <span>Recently Read</span>
      </DropdownMenuItem>
    </Link>
  );

  const Bookmarks = () => (
    <Link href="/bookmarks">
      <DropdownMenuItem>
        <span>Bookmarks</span>
      </DropdownMenuItem>
    </Link>
  );

  const Newsletters = () => (
    <Link href="/feed/newsletters">
      <DropdownMenuItem>
        <span>Newsletters</span>
      </DropdownMenuItem>
    </Link>
  );

  const LogOutButton = () => (
    <DropdownMenuItem
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/login");
      }}
    >
      Log out
    </DropdownMenuItem>
  );

  const Upgrade = () => (
    <Drawer.Trigger asChild>
      <DropdownMenuItem>
        <span>Upgrade</span>
        <Badge className="ml-1.5 rounded bg-[#0496FF]/10 px-[4px] text-right text-xs font-[500] text-sky-500">
          14 days free
        </Badge>
      </DropdownMenuItem>
    </Drawer.Trigger>
  );

  const PricingDrawer = () => (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 z-20 bg-black/[.32]" />
      <Drawer.Content className="fixed bottom-0 right-0 z-20 mt-24 flex h-full flex-col rounded-t-[10px] bg-white md:w-[900px] dark:bg-[#141415]">
        <ScrollArea className="rounded-md">
          <PricingPage />
        </ScrollArea>
      </Drawer.Content>
    </Drawer.Portal>
  );

  const fullName =
    (user?.user_metadata.full_name as string | undefined) ?? user?.email ?? "";

  const AccountDropdownTrigger = () => (
    <DropdownMenuTrigger asChild>
      <div className="mb-2.5 flex cursor-pointer rounded-lg py-1 pt-1">
        <div className="flex h-[1.6rem] w-[1.6rem] cursor-pointer items-center justify-center rounded-[4px] bg-[#0496FF]/[.15] text-[13px] font-normal">
          <h4 className="font-medium text-sky-500">
            {fullName.substring(0, 1)}
          </h4>
        </div>
        <div className="flex flex-row items-center">
          <h4
            style={widthStyle}
            className="truncate pl-2 text-sm font-[500] leading-4"
          >
            {fullName}
          </h4>
          <div className="ml-1 flex items-center">
            <DropDownIcon />
          </div>
        </div>
      </div>
    </DropdownMenuTrigger>
  );

  const [page, setPage] = useQueryState("settings");

  useEffect(() => {
    // Open dialog if there is a query param
    if (page) {
      setDialogType("Settings");
    }
  }, []);

  return (
    <>
      <Dialog
        open={
          (DialogType == "Settings" || DialogType == "Pricing") ?? undefined
        }
        onOpenChange={(open) => {
          if (!open) {
            const params = new URLSearchParams(
              query as unknown as URLSearchParams,
            );
            params.delete("settings");
            router.push({ pathname, query: params.toString() }, undefined, {
              shallow: true,
            });
          }
        }}
      >
        <Drawer.Root direction="right" shouldScaleBackground>
          <DropdownMenu modal={false}>
            <AccountDropdownTrigger />
            <DropdownMenuContent
              align="start"
              className="w-60 translate-x-[-6px] transform"
            >
              <DropdownMenuLabel className="max-w-[225px] truncate">
                {user?.email}
              </DropdownMenuLabel>
              <SettingsTrigger />
              <RecentlyRead />
              <Bookmarks />
              <Newsletters />
              <OpenDiscovery />
              <DropdownMenuSeparator />
              {plan == "free" && <Upgrade />}
              <OpenMobileApps />
              <LogOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
          <PricingDrawer />
        </Drawer.Root>
        {DialogType == "Settings" ? (
          <SettingsDialog
            setDialogUndefined={() => setDialogType(undefined)}
            page={page!}
            setPage={setPage}
          />
        ) : null}
      </Dialog>
    </>
  );
};
