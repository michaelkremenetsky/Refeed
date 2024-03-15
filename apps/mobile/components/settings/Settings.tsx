import type { ReactNode } from "react";
import React from "react";
import { SafeAreaView, StyleSheet, Switch, Text } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import * as DropdownMenu from "zeego/dropdown-menu";

import { settingsAtom } from "../../lib/stores/settings";
import { ModalClose } from "../reader/Header/ModalCloseButton";
import { View } from "../ui/View";

export default function Example() {
  const [settings, setSettings] = useAtom(settingsAtom);
  const navigation = useNavigation();

  return (
    <SafeAreaView className="h-full">
      <View style={styles.container}>
        <ModalClose type="Navigation" navigation={navigation} />
        <Text className="mb-10 text-center text-[16px] font-semibold">
          Settings
        </Text>
        <View className="mx-4">
          <SettingItem
            title="Mark Read on Scroll"
            subTitle="Mark Feeds read as you scroll"
          >
            <Switch
              onValueChange={(val) => {
                setSettings({
                  ...settings,
                  MarkReadOnScroll: val,
                });
              }}
              value={settings.MarkReadOnScroll}
            />
          </SettingItem>
        </View>
        <View className="mx-4 mt-4">
          <SettingItem
            title="Prompt when marking all items read"
            subTitle="Confirm when marking all items read"
          >
            <Switch
              onValueChange={(val) => {
                setSettings({
                  ...settings,
                  PromptWhenMarkingItemsRead: val,
                });
              }}
              value={settings.PromptWhenMarkingItemsRead}
            />
          </SettingItem>
        </View>
        <View className="mx-4 mt-4">
          <SettingItem
            title="Horizontal Scrolling"
            subTitle="Confirm when marking all items read"
          >
            <Switch
              onValueChange={() => {
                setSettings({
                  ...settings,
                  ScrollDirection:
                    settings.ScrollDirection == "Horizontal"
                      ? "Vertical"
                      : "Horizontal",
                });
              }}
              value={settings.ScrollDirection == "Horizontal" ? true : false}
            />
          </SettingItem>
        </View>
        <View className="mx-4 mt-4">
          <SettingItem
            title="Sort Feeds by amount of unread items"
            subTitle="Organize feeds by the number of unread articles for easier
            navigation"
          >
            <Switch
              onValueChange={(val) => {
                setSettings({
                  ...settings,
                  SortFeedsByAmountOfUnreadItems: val,
                });
              }}
              value={settings.SortFeedsByAmountOfUnreadItems}
            />
          </SettingItem>
        </View>
      </View>
      <View className="mx-4">
        <SettingItem
          title="Default Timed Bookmark time"
          subTitle="The default amount of time a timed bookmark will be set to"
        >
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <View className="mt-3 flex flex-row items-center">
                <Text className="text-lg text-neutral-350">
                  {settings.DefaultTimedBookmarkTime == 60
                    ? "1 hour"
                    : settings.DefaultTimedBookmarkTime == 360
                      ? "6 hours"
                      : settings.DefaultTimedBookmarkTime == 720
                        ? "12 hours"
                        : settings.DefaultTimedBookmarkTime == 1440
                          ? "1 day"
                          : settings.DefaultTimedBookmarkTime == 4320
                            ? "3 days"
                            : settings.DefaultTimedBookmarkTime == 10080
                              ? "7 days"
                              : settings.DefaultTimedBookmarkTime / 60 + "h"}
                </Text>
                <SFSymbol
                  name="chevron.forward"
                  weight="medium"
                  scale="small"
                  color="#cacace"
                  size={18}
                  multicolor={false}
                  style={{ width: 22, height: 22 }}
                />
              </View>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onSelect={() => {
                  setSettings({
                    ...settings,
                    DefaultTimedBookmarkTime: 60,
                  });
                }}
                key="1 hour"
              >
                <DropdownMenu.ItemTitle>1 hour</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  setSettings({
                    ...settings,
                    DefaultTimedBookmarkTime: 360,
                  });
                }}
                key="6 hours"
              >
                <DropdownMenu.ItemTitle>6 hours</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  setSettings({
                    ...settings,
                    DefaultTimedBookmarkTime: 720,
                  });
                }}
                key="12 hours"
              >
                <DropdownMenu.ItemTitle>12 hours</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  setSettings({
                    ...settings,
                    DefaultTimedBookmarkTime: 1440,
                  });
                }}
                key="1 day"
              >
                <DropdownMenu.ItemTitle>1 day</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  setSettings({
                    ...settings,
                    DefaultTimedBookmarkTime: 4320,
                  });
                }}
                key="3 days"
              >
                <DropdownMenu.ItemTitle>3 days</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  setSettings({
                    ...settings,
                    DefaultTimedBookmarkTime: 10080,
                  });
                }}
                key="7 days"
              >
                <DropdownMenu.ItemTitle>7 days</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </SettingItem>
      </View>
    </SafeAreaView>
  );
}

const SettingItem = ({
  title,
  subTitle,
  children,
}: {
  title: string;
  subTitle: string;
  children: ReactNode;
}) => {
  return (
    <View className="flex flex-row">
      <View className="flex flex-col">
        <Text className="mb-1 select-none text-sm font-medium leading-5">
          {title}
        </Text>
        <Text className="max-w-[250px] select-none text-sm leading-5 text-neutral-450 dark:text-stone-500">
          {subTitle}
        </Text>
      </View>
      <View className="ml-auto mt-1">{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
  },
});
