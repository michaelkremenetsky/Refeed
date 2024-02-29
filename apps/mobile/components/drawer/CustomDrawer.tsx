import React, { memo } from "react";
import { Image, Pressable } from "react-native";
import TreeView from "react-native-final-tree-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import {
  DrawerActions,
  useNavigation as useNavigationNative,
} from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import * as DropdownMenu from "zeego/dropdown-menu";

import { removeFeedsOrFolder } from "../../../../packages/features/feed/removeFeedsOrFolders";
import { useModifyFeedOrder } from "../../features/useFolderFeedOrder";
import { DownIcon } from "../../lib/Icons";
import type { NavigatorParams } from "../../lib/navTypes";
import { trpc } from "../../utils/trpc";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { AccountDropdown } from "./AccountDropdown";
import { AddFolderButtonGray } from "./AddFolderButtons";
import { NoFoldersMessage } from "./NoFolderMessage";

const CustomDrawer = memo(() => {
  const navigation =
    useNavigationNative<StackNavigationProp<NavigatorParams>>();

  const { data: feedsInFolders } = trpc.feed.getFeedsInFolders.useQuery();

  const { onToggle } = useModifyFeedOrder();

  const { removeFeed, removeFolder } = removeFeedsOrFolder();

  const totalItemAmount = feedsInFolders?.reduce((acc, folder) => {
    if (folder.children) {
      return (
        acc +
        folder.children.reduce((acc, feed) => {
          return acc + feed.amount;
        }, 0)
      );
    } else {
      return acc;
    }
  }, 0);

  // Remove any duplicates in the same folder
  if (feedsInFolders) {
    feedsInFolders.forEach((folder) => {
      const folderFeeds = folder.children;
      const folderFeedsIds = folderFeeds?.map((feed) => feed.id);
      const uniqueFeeds = folderFeeds?.filter(
        (feed, index) => !folderFeedsIds?.includes(feed.id, index + 1),
      );
      folder.children = uniqueFeeds;
    });
  }

  if (feedsInFolders) {
    return (
      <DrawerContentScrollView
        className="pt-10"
        persistentScrollbar={true}
        bounces={false}
      >
        <View className="mb-4 flex flex-col">
          <AccountDropdown />
        </View>
        <View className="flex w-full flex-row px-1">
          <TouchableOpacity>
            <View className="ml-3 mt-[3px] h-5 w-5 self-center rounded-sm">
              <DownIcon />
            </View>
          </TouchableOpacity>
          <Pressable
            onPress={() => {
              requestAnimationFrame(() => {
                navigation.dispatch(DrawerActions.closeDrawer());
              });
              navigation.navigate("Feed", {
                // Remember node is not typed because of the lib
                screen: "Inbox",
                type: "all",
                title: "All Feeds",
              });
            }}
          >
            <Text className="ml-1.5 max-w-[100px] self-center truncate stroke-neutral-700 text-base">
              All
            </Text>
          </Pressable>
          <Text.Secondary className="ml-auto mr-4 self-center text-sm text-neutral-400/90">
            {totalItemAmount}
          </Text.Secondary>
        </View>
        <NoFoldersMessage Empty={feedsInFolders.length == 0} />
        {/** @ts-ignore */}
        <TreeView
          // This libary does not work well with typescript, probably will end up writing my own, also the perf is bad
          data={feedsInFolders as any[]}
          isNodeExpanded={(node) => {
            const folded =
              feedsInFolders?.find((folder) => {
                return folder.id === node;
              })?.folded ?? false;

            return folded;
          }}
          renderNode={({ node }) => {
            return (
              <>
                {node.children ? (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger action="longPress">
                      <View className="flex w-full flex-row px-1 py-[7px]">
                        <TouchableOpacity onPress={() => onToggle(node.name)}>
                          <View className="ml-3 mt-[3px] h-5 w-5 self-center rounded-sm">
                            <DownIcon />
                          </View>
                        </TouchableOpacity>
                        <Pressable
                          onPress={() => {
                            requestAnimationFrame(() => {
                              navigation.dispatch(DrawerActions.closeDrawer());
                            });
                            navigation.navigate("Feed", {
                              // Remember node is not typed because of the lib
                              screen: "Inbox",
                              type: "multiple",
                              title: node.name,
                            });
                          }}
                        >
                          <Text className="ml-1.5 max-w-[100px] self-center truncate stroke-neutral-700 text-base">
                            {node.name}
                          </Text>
                        </Pressable>
                        <Pressable
                          className="flex-1 self-center"
                          onPress={() => {
                            requestAnimationFrame(() => {
                              navigation.dispatch(DrawerActions.closeDrawer());
                            });
                            navigation.navigate("Feed", {
                              // Remember node is not typed because of the lib
                              screen: "Inbox",
                              type: "multiple",
                              title: node.name,
                            });
                          }}
                        >
                          <Text.Secondary className="ml-auto mr-4 self-center text-sm text-neutral-400/80">
                            {node?.children
                              ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                                node?.children
                                  .reduce(
                                    (
                                      acc: number,
                                      child: { amount: number },
                                    ) => {
                                      return acc + child.amount;
                                    },
                                    0,
                                  )
                                  .toString()
                              : "0"}
                          </Text.Secondary>
                        </Pressable>
                      </View>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item key="markallread">
                        <DropdownMenu.ItemTitle>
                          Mark as Read
                        </DropdownMenu.ItemTitle>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        key="remove"
                        onSelect={() => {
                          removeFolder(node.name);
                        }}
                      >
                        <DropdownMenu.ItemTitle>
                          Delete Folder
                        </DropdownMenu.ItemTitle>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                ) : (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger action="longPress">
                      <Pressable
                        onPress={() => {
                          requestAnimationFrame(() => {
                            navigation.dispatch(DrawerActions.closeDrawer());
                          });
                          navigation.navigate("Feed", {
                            // Remember node is not typed because of the lib
                            screen: "Inbox",
                            feedId: node.id,
                            type: "one",
                            title: node.name,
                          });
                        }}
                        className="flex flex-row px-1 py-[7px]"
                      >
                        <View className="ml-[38px] h-[22px] w-[22px] self-center">
                          <Image
                            className="h-full w-full rounded-[2px]"
                            progressiveRenderingEnabled
                            source={{
                              uri: node.logo_url as string,
                            }}
                          />
                        </View>
                        <Text
                          className="ml-2 w-44 self-center truncate stroke-neutral-700 text-base"
                          numberOfLines={1}
                        >
                          {node.name}
                        </Text>
                        <View className="mx-auto" />
                        <Text.Secondary className="mr-4 self-center text-sm text-neutral-400/80">
                          {node.amount + ""}
                        </Text.Secondary>
                      </Pressable>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item key="markallread">
                        <DropdownMenu.ItemTitle>
                          Mark as Read
                        </DropdownMenu.ItemTitle>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        key="remove"
                        onSelect={() => {
                          removeFeed(node.id);
                        }}
                      >
                        <DropdownMenu.ItemTitle>
                          Delete Feed
                        </DropdownMenu.ItemTitle>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                )}
              </>
            );
          }}
        />
        {feedsInFolders?.length ? <AddFolderButtonGray /> : null}
        <View className="h-20" />
      </DrawerContentScrollView>
    );
  }
});

CustomDrawer.displayName == "CustomDrawer";

export default CustomDrawer;
