import React from "react";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { trpc } from "utils/trpc";
import * as DropdownMenu from "zeego/dropdown-menu";

import type { ItemType } from "@refeed/types/item";

import { useUpdateBookmarkFolders } from "../../features/useUpdateBookmarkFolders";
import { useUpdateBookmarks } from "../../features/useUpdateBookmarks";
import { EllipsisIcon } from "../../lib/Icons";
import { openShareSheet } from "../../lib/openShareSheet";

export const ReaderDropdown = ({ item }: { item: ItemType }) => {
  const { markBookmarkRead, removeBookmark } = useUpdateBookmarks();

  const { data: bookmarkFolders } =
    trpc.bookmark.getBookmarkFoldersForUser.useQuery();

  const { toggleBookmarkFolder } = useUpdateBookmarkFolders();

  const addBookmarkFolder = () => {
    Alert.prompt(
      "Add Bookmark Folder",
      "For organizing your bookmarks",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: (folderName) => {
            toggleBookmarkFolder(item, folderName!);
          },
        },
      ],
      "plain-text",
    );
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity>
          <EllipsisIcon className="mr-4 self-center" />
        </TouchableOpacity>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.CheckboxItem
          value={
            !(item?.in_read_later == undefined || item.in_read_later == false)
          }
          // @ts-ignore
          onSelect={() => {
            if (!item?.in_read_later) {
              markBookmarkRead(item?.id, "Regular");
            } else {
              removeBookmark(item?.id, "Regular");
            }
          }}
          key="bookmark"
        >
          <DropdownMenu.ItemIndicator />
          <DropdownMenu.ItemTitle>Bookmark</DropdownMenu.ItemTitle>
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger key="sort">Folders</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            {bookmarkFolders?.map((folder) => {
              return (
                <DropdownMenu.CheckboxItem
                  key={folder.name}
                  value={item?.bookmark_folders?.includes(folder.name)!}
                  // @ts-ignore
                  onSelect={() => {
                    toggleBookmarkFolder(item, folder.name);
                  }}
                >
                  <DropdownMenu.ItemIndicator />
                  <DropdownMenu.ItemTitle>{folder.name}</DropdownMenu.ItemTitle>
                </DropdownMenu.CheckboxItem>
              );
            })}
            <DropdownMenu.Item
              onSelect={() => addBookmarkFolder()}
              key="addnew"
            >
              <DropdownMenu.ItemTitle>Add New</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.CheckboxItem
          value={item?.temp_added_time instanceof Date}
          // @ts-ignore
          onSelect={() => {
            if (!(item?.temp_added_time instanceof Date)) {
              markBookmarkRead(item?.id, "Short Term");
            } else {
              removeBookmark(item?.id, "Short Term");
            }
          }}
          key="timedbookmark"
        >
          <DropdownMenu.ItemTitle>Timed Bookmark</DropdownMenu.ItemTitle>
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Item
          // @ts-ignore
          onSelect={() => {
            openShareSheet(item?.url);
          }}
          key="share"
        >
          <DropdownMenu.ItemTitle>Share</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
