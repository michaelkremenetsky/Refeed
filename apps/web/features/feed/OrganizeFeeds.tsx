import type { HTMLProps } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SortingState } from "@tanstack/react-table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useWindowSize } from "usehooks-ts";

import { Badge } from "@refeed/ui";
import { Input } from "@refeed/ui/components/input";

import { trpc } from "../../utils/trpc";

interface UserFeed {
  title: string;
  amount: number;
  logo_url: string;
  feed_url: string;
}

const columnHelper = createColumnHelper<UserFeed>();

const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <div className="ml-2 px-1">
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="ml-2 px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  }),
  columnHelper.accessor("title", {
    cell: (props) => (
      <div className="flex items-center p-2 md:ml-3">
        <div className="shadow-[0_0px_1px_rgba(0,0,0,0.5) mr-4 h-6 w-6 rounded-md border bg-[#FCFCFC] p-[3px] dark:border-[#232329] dark:bg-[#141415]">
          <Image
            className="h-full w-full rounded-sm"
            width={20}
            height={20}
            alt="Feed Logo"
            src={props.row.original.logo_url}
            unoptimized
          />
        </div>
        <span className="w-[100px] overflow-hidden truncate md:w-[225px]">
          {props.getValue()}
        </span>
      </div>
    ),
    footer: (info) => info.column.id,
    header: () => (
      <span className="ml-2 flex select-none justify-start py-2 font-semibold md:ml-4 dark:text-stone-200">
        Title
      </span>
    ),
  }),
  columnHelper.accessor("feed_url", {
    cell: (info) => (
      <div className="w-[225px] overflow-hidden truncate text-neutral-450">
        {info.getValue()}
      </div>
    ),
    footer: (info) => info.column.id,
    header: () => (
      <span className="mr-4 flex select-none items-start font-semibold dark:text-stone-200">
        URL
      </span>
    ),
  }),
  columnHelper.accessor("amount", {
    cell: (info) => (
      <div className="w-[125px] text-center">
        <Badge className="text-sm"> {info.getValue()}</Badge>
      </div>
    ),
    footer: (info) => info.column.id,
    header: () => (
      <span className="mr-4 select-none font-semibold dark:text-stone-200">
        Stories/Month
      </span>
    ),
  }),
];

export const OrganizeFeeds = () => {
  const { width } = useWindowSize();
  const { data, refetch } = trpc.feed.getAllUserFeeds.useQuery();

  const utils = trpc.useUtils();

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const deleteUserFeedsMutation = trpc.feed.removeUserFeed.useMutation();

  const selectedIds = Object.keys(rowSelection)
    .map((row) => {
      const index = parseInt(row, 10);
      return data?.[index]?.id!;
    })
    .filter((id) => id !== undefined);

  const deleteUserFeeds = async () => {
    const feedsInFolders = utils.feed.getFeedsInFolders.getData();

    // Optimistic update to make it feel instant
    const newFeedsInFolders = feedsInFolders?.map((folder) => {
      if (folder.children) {
        return {
          ...folder,
          children: folder.children.filter(
            (feed) => !selectedIds.includes(feed.id),
          ),
        };
      }
      return folder;
    });
    utils.feed.getFeedsInFolders.setData(undefined, newFeedsInFolders);

    // Update getAllUserFeeds aswell
    const newFeeds = data?.filter((feed) => !selectedIds.includes(feed.id));
    utils.feed.getAllUserFeeds.setData(undefined, newFeeds);

    // Remove in DB
    if (selectedIds) {
      await deleteUserFeedsMutation.mutateAsync({
        feedId: selectedIds,
      });
      refetch();
      await utils.feed.getFeedsInFolders.invalidate();
    }
  };

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "amount",
      desc: true,
    },
  ]);

  const table = useReactTable({
    data: data ? data : [],
    columns:
      width > 500
        ? columns
        : // @ts-ignore
          columns.filter((column) => column.accessorKey != "feed_url"),
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    initialState: { columnVisibility: { logo_url: false } },
  });

  return (
    <div className="mr-[3px] h-full w-full overflow-y-auto overscroll-none scrollbar scrollbar-thumb-neutral-300/75 scrollbar-thumb-rounded-md scrollbar-w-1 dark:scrollbar-thumb-neutral-700">
      <div className="my-3 mr-2 flex flex-col gap-y-3 md:w-[700px]">
        <div className="flex w-full">
          <Input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="ml-[2px] w-full"
            placeholder="Search all columns..."
          />
          {/** Incase we want to make it so you can sort via Bookmark Folder */}
          {/* <Select
            onValueChange={(value) => {
            }}
          >
            <SelectTrigger defaultValue={theme} className="w-[140px]">
              <SelectValue placeholder={getFolders.data?.[0]?.name} />
            </SelectTrigger>
            <SelectContent
              defaultValue={getFolders.data?.[0]?.name}
              className="transfrom w-[100px] -translate-x-[1px]"
            >
              {getFolders.data?.map((folder) => (
                <SelectItem value={folder.name}>{folder.name}</SelectItem>
              ))}

            </SelectContent>
          </Select> */}
        </div>

        {data && table.getSortedRowModel().rows.length > 0 && (
          <div className="ml-[2px] rounded-lg border dark:border-[#232329]">
            <table className="w-full">
              <thead className="border-b dark:border-neutral-700">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className="rounded-lg bg-[#FCFCFC] dark:bg-[#141415]"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table?.getSortedRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex w-full items-center justify-end border-t dark:border-neutral-700">
              <h1 className="ml-4 mr-auto text-neutral-450">
                {data?.length} Feeds Total
              </h1>
              <button
                onClick={() => {
                  deleteUserFeeds();
                }}
                type="submit"
                className={clsx(
                  "my-2 mr-2 w-[135px] rounded-md border border-[#DCDCDC] bg-white py-1.5 text-center text-base font-medium shadow-[0_1px_2px_rgba(16,29,52,.15)] hover:bg-[#fafafa] dark:border-[#1e2020] dark:bg-[#0f0f10] dark:hover:bg-[#0f0f10]",
                  selectedIds.length == 0 && "opacity-0",
                )}
              >
                Unfollow Feed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  // TODO: Render a skelton here
};

export default OrganizeFeeds;

function IndeterminateCheckbox({
  indeterminate,
  className = "ml-1.5 rounded-[3px] border-neutral-300 bg-[#fcfcfc] dark:border-[#333333]/80 dark:bg-[#333333]",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={
        className +
        " cursor-pointer rounded-[3px] border-neutral-300 bg-[#fcfcfc] text-stone-700 dark:border-[#1e2020] dark:bg-[#141415]"
      }
      {...rest}
    />
  );
}
