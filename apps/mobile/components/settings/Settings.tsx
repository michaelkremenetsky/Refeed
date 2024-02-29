import type { ReactNode } from "react";
import React from "react";
import { SafeAreaView, StyleSheet, Switch, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";

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
        <View className="mx-2"></View>
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
        <Text className="select-none text-sm leading-5 text-neutral-450 dark:text-stone-500">
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
