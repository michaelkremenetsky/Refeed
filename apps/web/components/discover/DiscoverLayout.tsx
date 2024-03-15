import Link from "next/link";
import { useQueryState } from "nuqs";
import { useWindowSize } from "usehooks-ts";
import { trpc } from "utils/trpc";

import {
  BusinessDiscoverItems,
  TechDiscoverFeeds,
} from "@refeed/lib/DiscoveryFeeds";
import type { EventFor } from "@refeed/lib/EventFor";
import type { ItemType } from "@refeed/types/item";
import { ScrollArea } from "@refeed/ui";
import {
  DialogRoot,
  DialogTrigger,
} from "@refeed/ui/components/dialog/AddDialog";
import { Input } from "@refeed/ui/components/input";

import { useInfiniteScroll } from "../../lib/useInfiniteScroll";
import { AddFeedDialog } from "../dialog/AddFeedDialog";
import { AddFolderDialog } from "../dialog/AddFolderDialog";
import { CustomCard } from "./CustomCard";

const DiscoveryFeeds = [
  { feeds: TechDiscoverFeeds, name: "Tech" },
  { feeds: BusinessDiscoverItems, name: "Business" },
];

export const DiscoverLayout = () => {
  const [searchQuery, setQuerySearch] = useQueryState("search", {
    shallow: true,
  });

  const { data: feedsInFolders } = trpc.feed.getFeedsInFolders.useQuery();
  const { width } = useWindowSize();
  const itemsPerFeed = width > 1280 ? 3 : width > 900 ? 2 : width < 800 ? 1 : 0;

  const {
    data,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isPending,
    isFetchingNextPage,
  } = trpc.search.searchFeeds.useInfiniteQuery(
    {
      search: searchQuery!,
      amount: 18,
      itemsPerFeed,
    },
    {
      enabled: searchQuery != null,
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor;
      },
    },
  );

  const { containerRef } = useInfiniteScroll(
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    fetchNextPage,
    0.5,
  );

  let searchData = data?.pages?.map((page) => page?.feeds).flat();

  if (!searchData) {
    searchData = [];
  }

  // Filter out feeds without items
  searchData = searchData?.filter((feed) => feed?.items.length! > 0);

  // Move any feed that has less than 3 items to the end
  searchData = searchData?.sort((a, b) => {
    if (a?.items.length! < 3) {
      return 1;
    } else if (b?.items.length! < 3) {
      return -1;
    }
    return 0;
  });

  return (
    <ScrollArea
      ref={containerRef}
      className="mx-auto flex h-full w-full flex-col overflow-x-hidden pr-4"
    >
      <div className="mx-auto w-max px-0.5 pt-6">
        <Input
          placeholder="Search Feeds or Paste RSS Link"
          className="mx-4 mb-0.5 h-11 w-[275px] sm:w-[250px] md:mx-0 md:w-[500px] lg:w-[750px] xl:w-[1000px]"
          defaultValue={searchQuery ?? ""}
          onInput={(e: EventFor<"input", "onChange">) => {
            if (!e.target.value) {
              setQuerySearch(null);
            } else {
              setQuerySearch(e.target.value ?? "");
            }
          }}
        />
        {searchData?.length == 0 && searchQuery && !isPending ? (
          <div className="ml-1 mt-4">
            <h3 className="mb-2 text-neutral-450">
              No Feeds found
              <span>
                {" "}
                <EmptySearch emptySearchLink={searchQuery} />
              </span>
            </h3>
          </div>
        ) : null}
      </div>
      {(!searchQuery || isFetching) && (
        <div className="mx-auto flex w-[250px] flex-col items-center md:w-[500px] lg:w-[750px] xl:w-[1000px]">
          {DiscoveryFeeds?.map((section) => (
            <div key={section.name}>
              <h1 className="my-3 text-lg font-medium">{section.name}</h1>
              <div className="my-1 mt-3 grid grid-cols-1 place-items-center gap-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.feeds.map((item, i) => (
                  <DialogRoot key={i}>
                    <DialogTrigger>
                      <CustomCard item={item} className="mb-4" />
                    </DialogTrigger>
                    {feedsInFolders?.length! > 0 ? (
                      <AddFeedDialog
                        feed_title={item.title}
                        link={item.feed_url}
                        title="Add New Feed"
                        favicon_url={item.logo_url}
                      />
                    ) : (
                      <AddFolderDialog
                        link={item.feed_url}
                        title="Add Folder"
                      />
                    )}
                  </DialogRoot>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {searchQuery && !isPending && (
        <div className="mx-auto mt-6 w-[250px] px-0.5 md:w-[500px] lg:w-[750px] xl:w-[1000px]">
          {searchData?.map((search) => (
            <div key={search?.title} className="mx-auto mb-5">
              <NewDisc
                title={search?.title!}
                search_title={search?.title}
                search_logo_url={search?.logo_url!}
                search_feed_url={search?.feed_url}
                feed_id={search?.id!}
                items={search?.items as unknown as ItemType[]}
              />
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

const NewDisc = ({
  items,
  title,
  feed_id,
  search_title,
  search_logo_url,
  search_feed_url,
}: {
  items: ItemType[];
  title: string;
  feed_id: string;
  search_title?: string;
  search_logo_url?: string;
  search_feed_url?: string;
}) => {
  const { data: feedsInFolders, isPending } =
    trpc.feed.getFeedsInFolders.useQuery();

  return (
    <div
      className={`flex h-[275px] overflow-hidden rounded-md border bg-[#FCFCFC] lg:mx-0 dark:border-neutral-700/80 dark:dark:bg-[#141415]`}
    >
      <div className="flex w-full items-center gap-8">
        <div className="flex w-[200px] flex-col px-3">
          <div className="shadow-[0_0px_1px_rgba(0,0,0,0.5) mx-auto my-auto h-10 w-10 rounded-md border bg-[#FCFCFC] p-[3px] dark:border-neutral-700/80 dark:bg-[#141415]">
            <img
              className="h-full w-full rounded-sm "
              width={40}
              height={40}
              alt="Site not found"
              src={search_logo_url}
            />
          </div>
          <h1 className="mx-auto mt-3 line-clamp-3 max-w-[150px] text-center text-sm font-semibold tracking-wide">
            {title}
          </h1>
          <div className="flex flex-col">
            <DialogRoot>
              <DialogTrigger className="mt-2 rounded-md text-center font-medium tracking-[-0.015em] text-sky-500">
                + Add Feed
              </DialogTrigger>
              {!isPending && feedsInFolders?.length! > 0 ? (
                <AddFeedDialog
                  feed_title={search_title}
                  link={search_feed_url}
                  favicon_url={search_logo_url}
                  title="Add New Feed"
                />
              ) : (
                <AddFolderDialog link={search_feed_url} title="Add Folder" />
              )}
            </DialogRoot>

            <Link
              href={"/discover/" + feed_id}
              className="mt-1 rounded-md text-center font-medium text-neutral-400/90 dark:text-stone-400"
            >
              Preview
            </Link>
          </div>
        </div>

        {items.map((item: any) => (
          <div key={item.title + item.link} className="w-[219.5px] gap-4">
            <DialogRoot>
              <DialogTrigger asChild>
                <CustomCard item={item} search_logo_url={search_logo_url} />
              </DialogTrigger>
              <AddFeedDialog
                feed_title={search_title}
                link={search_feed_url}
                title="Add New Feed"
              />
            </DialogRoot>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EmptySearch = ({
  emptySearchLink,
}: {
  emptySearchLink: string;
}) => {
  const { data: feedsInFolders, isPending } =
    trpc.feed.getFeedsInFolders.useQuery();

  return (
    <DialogRoot>
      <DialogTrigger className="rounded-md text-center text-sky-500">
        Add a new one
      </DialogTrigger>
      {!isPending && feedsInFolders?.length! > 0 ? (
        <AddFeedDialog searchLink={emptySearchLink} title="Add New Feed" />
      ) : (
        <AddFolderDialog link="" title="Add Folder" />
      )}
    </DialogRoot>
  );
};
