import * as RadixDialog from "@radix-ui/react-dialog";
import { useAtom } from "jotai";
import { useState } from "react";
import { Button, FileTrigger } from "react-aria-components";

import { useUser } from "@refeed/features/hooks/useUser";
import { Input, ProBadge, Switch } from "@refeed/ui";
import { DialogRoot } from "@refeed/ui/components/dialog/AddDialog";
import {
  DialogContent,
  DialogTrigger,
} from "@refeed/ui/components/dialog/Dialog";

import { generateShortUUID } from "../../../../../packages/lib/generateShortUUID";
import useOpml from "../../../features/settings/useOpml";
import { settingsAtom } from "../../../stores/settings";
import { trpc } from "../../../utils/trpc";
import { SettingsHeader } from "../SettingsHeader";

const Checkbox = () => (
  <span className="ml-1.5 mr-2 rounded bg-[#0496FF]/10 px-1.5 py-1 text-sm font-[600] text-sky-500">
    ✓
  </span>
);

export const FeedsSettingsPage = () => {
  const { data } = useUser();
  const utils = trpc.useUtils();

  const { importProgress, exportOPML, importOPML, onFileChange, errorMessage } =
    useOpml();

  // Put the Step 2 on the top and the ones with errors on the bottom
  const sortedImportProgress = importProgress?.sort((a, b) => {
    if (a.step === "Step 2" && b.step !== "Step 2") {
      return -1;
    }
    if (b.step === "Step 2" && a.step !== "Step 2") {
      return 1;
    }
    if (a.error && !b.error) {
      return 1;
    }
    if (!a.error && b.error) {
      return -1;
    }
    return 0;
  });

  const [settings, setSettings] = useAtom(settingsAtom);
  const [file, setFile] = useState(null);

  const toggleNewsletters = trpc.pro.toggleNewsletters.useMutation();

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <SettingsHeader title="Feeds" subtitle="Manage Feeds" />
      <div className="mt-6 flex w-full items-start pb-1">
        <div className="flex flex-col">
          <h1 className="mb-1 select-none text-sm font-medium leading-5">
            Sort Feeds by amount of unread items
          </h1>
          <h4 className="select-none text-sm leading-5 text-neutral-450 dark:text-stone-500">
            Organize feeds by the number of unread articles for easier
            navigation
          </h4>
        </div>
        <Switch
          className="ml-auto mr-12 mt-3"
          checked={settings.SortFeedsByAmountOfUnreadItems}
          onCheckedChange={() => {
            setSettings({
              ...settings,
              SortFeedsByAmountOfUnreadItems:
                !settings.SortFeedsByAmountOfUnreadItems,
            });
          }}
          id="airplane-mode"
        />
      </div>
      {settings.flagEnableNewsleters && (
        <>
          <div className="mt-4 flex w-full items-start">
            <div className="flex flex-col">
              <h1 className="mb-1 select-none text-sm font-medium leading-5">
                Newsletters <ProBadge className="ml-1.5" />
              </h1>
              <h4 className="select-none text-sm leading-5 text-neutral-450 dark:text-stone-500">
                Subscribe to Newsletters using a email address provided by
                Refeed.
              </h4>
            </div>
            <Switch
              className="ml-auto mr-12 mt-3"
              checked={data?.inbox ?? false}
              onCheckedChange={() => {
                if (data?.inbox) {
                  toggleNewsletters.mutate({
                    email: null,
                    enabled: false,
                  });

                  // @ts-ignore
                  utils.pro.getUser.setData(undefined, {
                    ...data,
                    inbox: false,
                    inbox_email: data?.inbox_email,
                  });
                } else if (data?.inbox_email && !data.inbox) {
                  toggleNewsletters.mutate({
                    email: data?.inbox_email,
                    enabled: true,
                  });

                  // @ts-ignore
                  utils.pro.getUser.setData(undefined, {
                    ...data,
                    inbox: true,
                    inbox_email: data?.inbox_email,
                  });
                } else if (!data?.inbox_email) {
                  const randomEmail =
                    generateShortUUID() + "@inbox.refeedreader.com";

                  toggleNewsletters.mutate({
                    email: randomEmail,
                    enabled: true,
                  });

                  // @ts-ignore
                  utils.pro.getUser.setData(undefined, {
                    ...data,
                    inbox: false,
                    inbox_email: randomEmail,
                  });
                }
              }}
              id="airplane-mode"
            />
          </div>
          {data?.inbox && data?.inbox_email && (
            <Input
              placeholder="Type your email address"
              className="mb-1 mt-4 h-9 text-sm md:w-[500px]"
              value={data.inbox_email}
              readOnly
            />
          )}
        </>
      )}

      <div className="mt-4 flex items-center space-x-2">
        <div className="flex flex-col">
          <h1 className="mb-1 select-none text-sm font-medium leading-5">
            Import and Export OPML
          </h1>
          <h4 className="select-none text-sm leading-5 text-neutral-450 dark:text-stone-500">
            Import and Export your feeds from other readers
          </h4>
        </div>
      </div>
      <div className="mb-4 flex gap-4">
        <DialogRoot>
          <DialogContent title="Import OPML" className="w-[300px]">
            <h1>{errorMessage}</h1>
            <div className="mx-auto">
              {importProgress?.map((feed) => (
                <div className="flex w-full py-3" key={feed.title}>
                  <div className="shadow-1 mx-2 h-5 w-5 rounded-sm" />
                  <h3 className="max-w-[250px] truncate">{feed.title}</h3>
                  {feed.step == "Step 2" && (
                    <div className="ml-auto">
                      <Checkbox />
                    </div>
                  )}
                  {feed.error && (
                    <h3 className="ml-auto mr-3 text-neutral-450">
                      {feed.error}
                    </h3>
                  )}
                </div>
              ))}
              <RadixDialog.Close
                aria-label="Close"
                onClick={() => {
                  importOPML();
                }}
                className={`mb-1 w-full self-end rounded-md ${
                  !file ? "cursor-not-allowed bg-sky-500/60" : "bg-sky-500"
                } py-1.5 font-medium tracking-tight text-white`}
              >
                Add
              </RadixDialog.Close>
            </div>
          </DialogContent>
        </DialogRoot>
        <DialogRoot>
          <DialogTrigger className="ml-[0.5px] mt-3 w-[135px] rounded-md border border-[#DCDCDC] bg-white py-1.5 text-base font-[450] shadow-[rgba(38,38,38,0.04)_0px_2px_1px] hover:bg-[#fafafa] dark:border-[#1e2020] dark:bg-[#0f0f10] dark:hover:bg-[#0f0f10]">
            Import OPML
          </DialogTrigger>
          <DialogContent title="Import OPML" className="w-[300px]">
            <div className="mx-auto">
              <FileTrigger
                acceptedFileTypes={[".opml"]}
                onSelect={(e) => {
                  // @ts-ignore
                  const files = Array.from(e);
                  const filenames = files.map((file) => file.name);
                  onFileChange(files);
                  // @ts-ignore
                  setFile(filenames);
                }}
              >
                <Button className="mx-auto mb-3 h-20 w-full rounded-md border bg-[#FCFCFC] text-neutral-500/90 dark:border-[#232329] dark:bg-[#141415]">
                  {!file ? "Select a file" : file}
                </Button>
              </FileTrigger>
              <RadixDialog.Close
                aria-label="Close"
                onClick={() => {
                  importOPML();
                }}
                className={`mb-1 w-full self-end rounded-md ${
                  !file ? "cursor-not-allowed bg-sky-500/60" : "bg-sky-500"
                } py-1.5 font-medium tracking-tight text-white`}
              >
                Import
              </RadixDialog.Close>
            </div>
          </DialogContent>
        </DialogRoot>
        <button
          onClick={() => {
            exportOPML();
          }}
          type="submit"
          className="mt-3 w-[135px] rounded-md border border-[#DCDCDC] bg-white py-1.5 text-base font-[450] shadow-[rgba(38,38,38,0.04)_0px_2px_1px] hover:bg-[#fafafa] dark:border-[#1e2020] dark:bg-[#0f0f10] dark:hover:bg-[#0f0f10]"
        >
          Export OPML
        </button>
        {/* TODO Make this percent more accurate before adding it back */}
        {/* {!Number.isNaN(percentageDone) && (
          <h1 className="ml-1 mt-5 text-neutral450">
            {Math.ceil(percentageDone)}%
          </h1>
        )} */}
      </div>
      {errorMessage == "You can only import 150 feeds on the free plan" && (
        <div className="mt-1">
          <h4 className="text-baseleading-5 select-none text-neutral-450 dark:text-stone-500">
            You can only import 150 feeds on the free plan.
          </h4>
        </div>
      )}
      {sortedImportProgress?.map((feed) => (
        <div
          className="mt-2 w-[450px] cursor-default rounded-lg border border-neutral-200 bg-white shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] dark:hover:bg-[#060606]"
          key={feed.title}
        >
          <div className="flex w-full py-3">
            <div className="shadow-1 mx-2 h-5 w-5 rounded-sm" />
            <h3 className="max-w-[250px] truncate">{feed.title}</h3>
            {feed.step == "Step 2" && (
              <div className="ml-auto">
                <Checkbox />
              </div>
            )}
            {feed.error && (
              <h3 className="ml-auto mr-3 text-neutral-450">{feed.error}</h3>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
