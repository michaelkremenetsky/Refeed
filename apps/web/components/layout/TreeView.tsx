import type { FunctionComponent } from "react";
import { memo, useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  TreeWidthContext,
  TreeWidthProvider,
} from "@components/layout/TreeContext";
import clsx from "clsx";
import { Dialog, DialogContent, DialogTrigger } from "components/ui/Dialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSetAtom } from "jotai";
import { useTreeVisibleNodesCount } from "lib/hooks/useTreeVisibleNodesCount";
import {
  BarChart3,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  FolderEdit,
  PlusIcon,
  Trash,
} from "lucide-react";
import type { NodeApi, NodeRendererProps } from "react-arborist";
import { Tree } from "react-arborist";
import type { OpenMap } from "react-arborist/dist/module/state/open-slice";
import type { RouterOutput } from "utils/trpc";
import { trpc } from "utils/trpc";

import { titleAtom } from "@refeed/atoms/feedsAtom";
import { removeFeedsOrFolder } from "@refeed/features/feed/removeFeedsOrFolders";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@refeed/ui";
import { DialogRoot } from "@refeed/ui/components/dialog/AddDialog";

import { useModifyFeedOrder } from "../../features/folders/useFolderFeedOrder";
import { RenameFolderDialog } from "../dialog/NewRenameFolderDialog";
import { ImageWithFallback } from "./SideBarIconFallBack";

dayjs.extend(relativeTime);

interface Tree {
  feed_url: string;
  id: string;
  name: string;
  logo_url: string;
  amount: number;
  children:
    | undefined
    | {
        id: string;
        name: string;
        amount: number;
        logo_url: string;
        feed_url: string;
        date_added?: Date;
      }[];
}

type feedsInFolders = RouterOutput["feed"]["getFeedsInFolders"];

const TreeViewInner = ({
  feedsInFolders,
  OpenState,
  width,
}: {
  feedsInFolders?: feedsInFolders;
  OpenState?: OpenMap;
  width: number;
}) => {
  const { ref, count } = useTreeVisibleNodesCount();
  const { onMove, onToggle } = useModifyFeedOrder();

  if (OpenState) {
    return (
      <TreeWidthProvider width={width}>
        <Tree<any>
          ref={ref}
          height={count * 32 + 1}
          width={width}
          openByDefault={false}
          initialOpenState={OpenState}
          rowHeight={32}
          onMove={onMove}
          className="Tree scrollbar-none"
          overscanCount={8}
          data={feedsInFolders}
          onToggle={onToggle}
        >
          {Node}
        </Tree>
      </TreeWidthProvider>
    );
  }
};

export const TreeView = memo(TreeViewInner);

const Node: FunctionComponent<NodeRendererProps<Tree>> = memo(
  ({ node, style, dragHandle }) => {
    const setTitle = useSetAtom(titleAtom);
    const utils = trpc.useUtils();

    const router = useRouter();

    const folderAmount = node.data.children?.reduce(
      (accumulator: number, feed) => accumulator + feed.amount,
      0,
    );

    const Route = () => {
      const feedsInFolders = utils.feed.getFeedsInFolders.getData();

      if (node.isLeaf) {
        router.replace(`/feed/${node.data.id}`, undefined, {
          shallow: true,
        });

        // Need to reset on route change or the feeds gets mixed up in the cache
        utils.item.getUnreadItems.reset();

        setTitle(node.data.name);
      } else {
        const folderIndex = feedsInFolders?.findIndex(
          (folder) => folder.name == node.data.name,
        );

        if (feedsInFolders?.[folderIndex!]?.children?.length == 0) {
          router.replace("/discover");
        } else {
          router.replace(`/folder/${node.data.id}`);
        }
      }
    };

    const WidthContext = useContext(TreeWidthContext);
    const widthStyle = { maxWidth: `${WidthContext.width! - 80}px` };

    // For perf reasons we only load the ContextMenu if its clicked
    const [showContextMenu, setShowContextMenu] = useState(false);

    return (
      <ContextMenu modal={false}>
        <ContextMenuTrigger>
          <div
            className={clsx(
              "mr-1.5 flex cursor-pointer items-center rounded-md py-[0.25rem] focus:[&:not(:focus-visible)]:outline-none",
              node.data.name == "Delete Feed"
                ? "hover:bg-red-100 dark:hover:bg-red-800"
                : "hover:bg-[#f5f5f5] hover:dark:bg-[#1a1a1a]",
            )}
            style={style}
            ref={dragHandle}
            onClick={Route}
            onContextMenu={() => {
              setShowContextMenu(true);
            }}
          >
            <FolderArrow node={node} />
            {node.isLeaf ? (
              <ImageWithFallback
                src={node.data.logo_url}
                width="17"
                height="17"
                alt="icon"
                className="items-center rounded-[1px]"
              />
            ) : null}

            <span
              className={`flex-1 truncate text-neutral-700 dark:text-stone-200 ${
                !node.isLeaf && ""
              } text-ellipsis ${node.isLeaf ? "pl-2 font-[425] " : "pl-1 font-[450]"} text-base
            `}
              style={widthStyle}
            >
              {node.data.name}
            </span>
            {node.isLeaf ? (
              <span className="absolute right-[14px] text-center text-xs font-[450] text-neutral-400/75 dark:text-stone-500/95">
                {(node.data.amount as unknown as number) > 2500
                  ? "2.5K+"
                  : (node.data.amount as unknown as number) >= 1000
                    ? "1K+"
                    : node.data.amount ?? null}
              </span>
            ) : (
              <span className="absolute right-[14px] pl-2 text-center text-xs font-[450] text-neutral-400/75 dark:text-stone-500/95">
                {folderAmount! > 2500
                  ? "2.5K+"
                  : folderAmount! >= 1000
                    ? "1K+"
                    : folderAmount ?? null}
              </span>
            )}
          </div>
        </ContextMenuTrigger>
        {showContextMenu && <ContentMenu node={node} />}
      </ContextMenu>
    );
  },
);

const ContentMenu = ({ node }: { node: NodeApi<Tree> }) => {
  const { removeFeed, removeFolder } = removeFeedsOrFolder();

  const markAllAsRead = trpc.read.markAllRead.useMutation();

  const utils = trpc.useUtils();

  const markRead = async (type: "one" | "folder") => {
    if (type == "one") {
      console.log(node.data.id);
      await markAllAsRead.mutateAsync({ feedIds: [node.data.id] });
    }
    if (type == "folder") {
      // Get the ids of all the feeds in the folder
      const feedIds = node.data.children?.map((feed) => feed.id);

      await markAllAsRead.mutateAsync({ feedIds });
    }

    utils.item.getUnreadItems.reset();
    utils.feed.getFeedsInFolders.reset();
  };

  return (
    <DialogRoot>
      <ContextMenuContent
        className={`text-optimize-legibility w-40 subpixel-antialiased`}
      >
        <ContextMenuItem
          onClick={() => {
            void markRead(node.isLeaf ? "one" : "folder");
          }}
        >
          <CheckCheck className="mr-2 h-4 w-4 stroke-neutral-450 dark:stroke-stone-400" />
          <span>Mark as Read</span>
        </ContextMenuItem>
        {!node.isLeaf && (
          <Link href="/discover">
            <ContextMenuItem>
              <PlusIcon className="mr-2 h-4 w-4 stroke-neutral-450 dark:stroke-stone-400" />
              <span>Add Feed</span>
            </ContextMenuItem>
          </Link>
        )}
        {!node.isLeaf && (
          <DialogTrigger asChild>
            <ContextMenuItem>
              <FolderEdit className="mr-2 h-4 w-4 stroke-neutral-450 dark:stroke-stone-400" />
              <span>Rename</span>
            </ContextMenuItem>
          </DialogTrigger>
        )}
        {node.isLeaf && (
          <Dialog>
            <DialogTrigger asChild>
              <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                <BarChart3 className="mr-2 h-4 w-4 stroke-neutral-450 dark:stroke-stone-400" />
                <span>See Details</span>
              </ContextMenuItem>
            </DialogTrigger>
            <DialogContent title={node.data.name} className="w-[300px]">
              <div className="mb-2 flex justify-center">
                <div className="h-16 w-16 rounded-md border bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-[#141415]">
                  <img
                    className="h-full w-full"
                    alt="Site not found"
                    src={node.data.logo_url}
                  />
                </div>
              </div>
              <h4 className="mb-0.5 ml-1 mt-2 overflow-hidden truncate text-sm font-medium text-neutral-700 dark:text-stone-200">
                Title
              </h4>
              <h3 className="mb-3 ml-1 overflow-hidden text-sm text-neutral-500 dark:text-stone-500">
                {node.data.name}
              </h3>
              <h4 className="mb-0.5 ml-1 mt-2 overflow-hidden truncate text-sm font-medium text-neutral-700 dark:text-stone-200">
                URL
              </h4>
              <h3 className="mb-3 ml-1 overflow-hidden truncate text-sm text-neutral-500 dark:text-stone-500">
                {node.data.feed_url}
              </h3>
              <h4 className="mb-0.5 ml-1 mt-2 overflow-hidden truncate text-sm font-medium text-neutral-700 dark:text-stone-200">
                Date Added
              </h4>
              <h3 className="mb-3 ml-1 overflow-hidden truncate text-sm text-neutral-500 dark:text-stone-500">
                {/*  @ts-ignore */}
                {dayjs(node.data.date_added).format("MMMM DD, YYYY")}
              </h3>
            </DialogContent>
          </Dialog>
        )}
        <ContextMenuSeparator />
        {node.isLeaf ? (
          <>
            <ContextMenuItem
              onClick={() => {
                removeFeed(node.data.id);
              }}
            >
              <Trash className="mr-2 h-4 w-4 stroke-red-400/80" />
              <span>Delete Feed</span>
            </ContextMenuItem>
          </>
        ) : (
          <ContextMenuItem
            onClick={() => {
              removeFolder(node.data.id);
            }}
          >
            <Trash className="mr-2 h-4 w-4 stroke-red-400/80" />
            <span>Delete Folder</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
      <RenameFolderDialog
        title={"Rename " + '"' + node.data.name + '"'}
        folderName={node.data.name}
      />
    </DialogRoot>
  );
};

export function FolderArrow({ node }: { node: NodeApi<Tree> }) {
  if (node.isLeaf) return <span></span>;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();

        node.isInternal && node.toggle();
      }}
    >
      {node.isOpen ? (
        <ChevronDown className="h-[24px] w-[24px] stroke-neutral-400 stroke-[1.4] hover:stroke-neutral-500" />
      ) : (
        <ChevronRight className="h-[24px] w-[24px] stroke-neutral-400 stroke-[1.4] hover:stroke-neutral-500" />
      )}
    </div>
  );
}
