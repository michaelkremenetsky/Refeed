import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";
import { useAtomValue } from "jotai";

import { bookmarkFolderSortAtom } from "@refeed/atoms/bookmarkAtom";
import type { FeedType } from "@refeed/types/feed";
import type { ItemType } from "@refeed/types/item";

export const useFilterBookmarkFolders = ({
  FeedType,
  items,
}: {
  FeedType: FeedType;
  items: ItemType[];
}) => {
  // Filter out items based on selected Bookmark Folder
  const { query } = useRouter();

  const bookmarkSort = useAtomValue(bookmarkFolderSortAtom);
  const { item: itemParam, search } = query;

  const { data: folders } = trpc.bookmark.getBookmarkFoldersForUser.useQuery();
  const hasNoneZeroFolders = folders?.some((folder) => folder.amount > 0);

  const readerOpen = itemParam != undefined || search != undefined;

  if (FeedType == "bookmarks" || FeedType == "recentlyread") {
    if (bookmarkSort) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      items = items?.filter((item) => {
        if (item.bookmark_folders) {
          return item.bookmark_folders.includes(bookmarkSort);
        }
      });
    }
  }

  return { hasNoneZeroFolders, readerOpen };
};
