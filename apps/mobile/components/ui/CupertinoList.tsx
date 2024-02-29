import { DrawerActions, useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import React from "react";
import type {
  ColorValue,
  SectionListData,
  StyleProp,
  ViewStyle
} from "react-native";
import {
  Platform,
  PlatformColor,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import type { NavigatorParams } from "../../lib/navTypes";

// Modified version of https://twitter.com/Baconbrix/status/1526578286783893505

const ITEM_START_WIDTH = 60;

const BORDER_RADIUS = 10;

interface Item {
  id: string;
  title: string;
  icon: string;
}

type Section = SectionListData<Item>;

interface NewCupertinoListTypes {
  style: StyleProp<ViewStyle>;
  onPress: (params: { item: Item; section: Section; index: number }) => void;
  sections: Section[];
  children: ReactNode;
  data: Item[];
}

export function CupertinoList({ style, data }: NewCupertinoListTypes) {
  return (
    <FlatList
      style={style}
      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={10}
      contentContainerStyle={{
        paddingHorizontal: 20,
      }}
      data={data}
      keyExtractor={(item, index) => item.id + index}
      renderItem={({ item, index }) => {
        return (
          <CupertinoSectionListItem
            {...item}
            isFirst={index === 0}
            isLast={index == data.length - 1}
          />
        );
      }}
      ItemSeparatorComponent={CupertinoItemSeparatorComponent}
    />
  );
}

export function CupertinoItemSeparatorComponent() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: cupertinoColor(
          "secondarySystemGroupedBackground",
          "#fff",
        ),
      }}
    >
      <View
        style={{
          marginLeft: ITEM_START_WIDTH,
          height: StyleSheet.hairlineWidth,
          backgroundColor: cupertinoColor("separator", "#C6C6C8"),
        }}
      />
    </View>
  );
}

export function cupertinoColor(
  iosName: string,
  fallback: ColorValue,
): ColorValue {
  if (Platform.OS === "ios") {
    return PlatformColor(iosName);
  } else {
    return fallback;
  }
}

interface CupertinoSectionListItemProps {
  title?: string;
  id?: string;
  icon?: string;
  isFirst: boolean;
  isLast: boolean;
}

export const CupertinoSectionListItem = ({
  title,
  id,
  icon,
  isFirst,
  isLast,
}: CupertinoSectionListItemProps) => {
  const navigation = useNavigation<StackNavigationProp<NavigatorParams>>();

  return (
    <TouchableHighlight
      underlayColor={cupertinoColor("systemGray5", "#d1d1d6")}
      style={[
        {
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#f7f7f7",
        },
        isFirst && {
          borderTopLeftRadius: BORDER_RADIUS,
          borderTopRightRadius: BORDER_RADIUS,
        },
        isLast && {
          borderBottomLeftRadius: BORDER_RADIUS,
          borderBottomRightRadius: BORDER_RADIUS,
          marginBottom: 20,
        },
      ]}
      onPress={() => {
        requestAnimationFrame(() => {
          navigation.dispatch(DrawerActions.closeDrawer());
        });
        navigation.navigate("Feed", {
          screen: "Inbox",
          feedId: id,
          type: "one",
          title: title,
        });
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            maxWidth: ITEM_START_WIDTH,
          }}
        >
          <Image className="h-5 w-5" source={icon} />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            className="truncate text-base"
            numberOfLines={1}
            style={{
              paddingVertical: 10,
              fontFamily: "System",
              color: cupertinoColor("label", "#000"),
            }}
          >
            {title}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            maxWidth: 90,
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 13,
            flexDirection: "row",
          }}
        ></View>
      </View>
    </TouchableHighlight>
  );
};
