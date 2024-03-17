import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation as useNavigationNative } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useSetAtom } from "jotai";
import * as DropdownMenu from "zeego/dropdown-menu";

import { sortAtom } from "@refeed/atoms/feedsAtom";
import useMobileParams from "@refeed/features/item/useMobileParams";

import { removeFeedsOrFolder } from "../../../../packages/features/feed/removeFeedsOrFolders";
import { useMarkAllRead } from "../../features/useMarkRead";
import { EllipsisIcon } from "../../lib/Icons";
import type { NavigatorParams } from "../../lib/navTypes";

export const Dropdown = () => {
  const { markAllRead } = useMarkAllRead();
  const setSort = useSetAtom(sortAtom);

  const navigation =
    useNavigationNative<StackNavigationProp<NavigatorParams>>();

  const { FeedType, feedId, folder } = useMobileParams();
  const { removeFeed, removeFolder } = removeFeedsOrFolder();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity>
          <EllipsisIcon className="mr-4 self-center" />
        </TouchableOpacity>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {FeedType == "one" ? (
          <DropdownMenu.Item
            onSelect={() => markAllRead(FeedType, feedId)}
            key="markallread"
          >
            <DropdownMenu.ItemTitle>Mark all Read</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        ) : null}
        {FeedType == "all" ? (
          <DropdownMenu.Item
            onSelect={() => markAllRead(FeedType)}
            key="markallread"
          >
            <DropdownMenu.ItemTitle>Mark all Read</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        ) : null}
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger key="sort">Sort</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item onSelect={() => setSort("Latest")} key="latest">
              <DropdownMenu.ItemTitle>Latest</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => setSort("Oldest")} key="oldest">
              <DropdownMenu.ItemTitle>Oldest</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        {FeedType == "one" && (
          <DropdownMenu.Item
            onSelect={() => {
              removeFeed(feedId);
              navigation.navigate("Feed", {
                screen: "Inbox",
                type: "all",
              });
            }}
            key="Delete Feed"
          >
            <DropdownMenu.ItemTitle>Delete Feed</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        )}
        {FeedType == "multiple" && (
          <DropdownMenu.Item
            onSelect={() => {
              removeFolder(folder);
              navigation.navigate("Feed", {
                screen: "Inbox",
                type: "all",
              });
            }}
            key="Delete Feed"
          >
            <DropdownMenu.ItemTitle>Delete Feed</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
