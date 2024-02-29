import React from "react";
import { Alert } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import * as DropdownMenu from "zeego/dropdown-menu";

import type { ItemType } from "@refeed/types/item";

import { useUpdateBookmarkFolders } from "../../../features/useUpdateBookmarkFolders";
import { trpc } from "../../../utils/trpc";

// TODO: This is a WIP. You can't remove bookmark folders yet.

export function BookmarkFolderButton({ item }: { item: ItemType }) {
  const { data: bookmarkFolders } =
    trpc.bookmark.getBookmarkFoldersForUser.useQuery();

  const { toggleBookmarkFolder } = useUpdateBookmarkFolders();

  const createFolder = (folderName: string) => {
    toggleBookmarkFolder(item, folderName);
  };

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
          onPress: (folderName) => createFolder(folderName!),
        },
      ],
      "plain-text",
    );
  };

  // TODO: Get which folders the item is in
  // const folders = item?.bookmark_folders?.map((folder) => folder.name);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <>
          {item?.bookmark_folders?.length == 0 ||
          item?.bookmark_folders?.length == undefined ? (
            <SFSymbol
              name="book"
              weight="regular"
              scale="large"
              color="#878792"
              size={18}
              multicolor={false}
              style={{ width: 26, height: 26 }}
            />
          ) : (
            <SFSymbol
              name="book"
              weight="regular"
              scale="large"
              color="#0496FF"
              size={18}
              multicolor={false}
              style={{ width: 26, height: 26 }}
            />
          )}
        </>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Add Bookmark Folder</DropdownMenu.Label>
        {bookmarkFolders?.map((folder) => {
          return (
            <DropdownMenu.CheckboxItem value={true} key={folder.name}>
              <DropdownMenu.ItemIndicator />
              <DropdownMenu.ItemTitle>{folder.name}</DropdownMenu.ItemTitle>
            </DropdownMenu.CheckboxItem>
          );
        })}
        <DropdownMenu.Label>Add New Bookmark Folder</DropdownMenu.Label>
        <DropdownMenu.Item onSelect={() => addBookmarkFolder()} key="Add New">
          <DropdownMenu.ItemTitle>Add New</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
