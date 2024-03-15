import { useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

import { useUser } from "@refeed/features/hooks/useUser";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@refeed/ui";

import { useCheckSource } from "../../features/folders/useCheckSource";
import { trpc } from "../../utils/trpc";

// Going to rewrite this soon a bit of a mess for now

interface ExtendedProps extends RadixDialog.DialogContentProps {
  link?: string;
  searchLink?: string;
  title?: string;
  route?: string;
  setRoute: (route: string) => void;
  feed_title?: string;
  favicon_url?: string;
}

export function AddFeedDialogContent({
  link: defaultLink,
  route,
  feed_title,
  searchLink,
  favicon_url,
}: ExtendedProps) {
  const utils = trpc.useUtils();
  const { plan } = useUser();

  const {
    checkSource,
    folders,
    previewFeed,
    totalFeedsInFolders,
    error,
    setError,
  } = useCheckSource(defaultLink!, searchLink, feed_title, favicon_url);

  const [customTitle, setCustomTitle] = useState<string | undefined>(undefined);
  const [folderName, setFolderName] = useState<string | undefined>(
    folders?.[0],
  );

  const addFeedToUserViaDiscovery =
    trpc.feed.addFeedToUserViaDiscovery.useMutation();

  return (
    <div
      className={`flex h-full ${
        route == "addFeed" ? "w-[300px]" : "w-[600px]"
      } flex-col items-stretch px-3.5 pb-2`}
    >
      {route == "addFeed" && (
        <>
          <Input
            onChange={(e) => {
              checkSource(e.target.value);
              if (!folderName) {
                setFolderName(folders?.[0]);
              }
            }}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={false}
            defaultValue={defaultLink ?? previewFeed?.link ?? searchLink ?? ""}
            placeholder="RSS or Atom Link"
          />
          {previewFeed?.title && (
            <div className={`mt-4 flex`}>
              <div className="h-24 w-24 rounded-md border bg-neutral-50 dark:border-neutral-700/80 dark:bg-[#141415]">
                {previewFeed ? (
                  <img
                    className="h-24 w-24 rounded-xl p-2"
                    alt="Icon not found"
                    src={previewFeed.favicon}
                    key={previewFeed?.favicon}
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              <div className="ml-2 flex flex-col">
                {previewFeed && previewFeed?.title?.length > 0 ? (
                  <Input
                    onChange={(e) => {
                      setCustomTitle(e.target.value);
                    }}
                    key={previewFeed?.title}
                    value={previewFeed?.title}
                    className="mb-1 w-[170px] overflow-hidden truncate"
                  />
                ) : null}
                <div className="mb-0.5 mt-2">
                  <Select onValueChange={(value) => setFolderName(value)}>
                    <SelectTrigger
                      defaultValue={folders?.[0]}
                      className="text-md w-[170px] text-neutral-700"
                    >
                      {/* @ts-ignore */}
                      <SelectValue placeholder={folders?.[0]} />
                    </SelectTrigger>
                    <SelectContent
                      defaultValue={folders?.[0]}
                      className="w-[170px] text-neutral-700"
                    >
                      {folders?.map((folder: string) => (
                        <SelectItem key={folder} value={folder}>
                          {folder}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <RadixDialog.Close aria-label="Close">
            <div
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                if (previewFeed && error == undefined) {
                  const title = customTitle ?? previewFeed?.title;
                  const folder = folderName! ?? folders?.[0]!;

                  if (plan == "free" && totalFeedsInFolders! >= 149) {
                    toast(
                      "You have reached the limit of 150 feeds for the free plan",
                      {
                        description:
                          "Upgrade to the pro plan to add more feeds",
                        duration: 3000,
                      },
                    );
                    return;
                  }
                  if (plan == "pro" && totalFeedsInFolders! >= 999) {
                    toast("Limit Reached", {
                      description:
                        "You have reached the limit of 1000 feeds for the pro plan.",
                      duration: 3000,
                    });
                    return;
                  }

                  try {
                    toast("Fetching" + " " + title, {
                      description: "This may take a few seconds",
                      duration: 3000,
                    });

                    await addFeedToUserViaDiscovery.mutateAsync({
                      feed_url: previewFeed?.link,
                      folder_name: folder,
                      customTitle: title,
                    });
                  } catch {
                    setError("There was an issue adding the Feed");
                  } finally {
                    toast("Feed Added", {
                      description: `${title} to ${folder} folder`,
                      duration: 2000,
                    });
                    utils.feed.getFeedOrder.reset();
                    utils.feed.getFeedsInFolders.reset();
                    utils.search.searchFeeds.reset();
                  }
                }
              }}
              className={`-z-10 mb-1 mt-4 w-full ${
                !previewFeed.link || error
                  ? "cursor-not-allowed bg-sky-500/60"
                  : "bg-sky-500"
              } rounded-md py-1.5 text-center font-medium tracking-tight text-white`}
            >
              Add Feed
            </div>
          </RadixDialog.Close>
        </>
      )}

      <h3
        className={`pointer-events-none rounded-md text-center text-neutral-450 ${
          error && "mt-0.5"
        }`}
      >
        {error}
      </h3>
    </div>
  );
}
