import Svg, { Path } from "react-native-svg";
import dayjs from "dayjs";

import type { ItemType } from "@refeed/types/item";

import { Text } from "../ui/Text";
import { View } from "../ui/View";

export const AddInfo = (props: { item: ItemType }) => {
  const { item } = props;

  if (item) {
    return (
      <View
        className={`flex flex-row ${
          item?.in_read_later == true ??
          item?.temp_added_time ??
          item?.bookmark_folders != undefined
            ? "mr-1"
            : null
        }`}
      >
        {item?.in_read_later == true && (
          <View className="flex flex-row pb-0.5">
            <Svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={1.65}
              stroke="currentColor"
              className="h-[14px] w-[14px] stroke-[#0496FF]"
            >
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </Svg>
            <Text className="pb-[1px] pl-1 text-[13px] font-[425] text-[#0496FF]">
              Read Later
            </Text>
          </View>
        )}
        {item?.temp_added_time && (
          <View className="flex flex-row pb-0.5 pl-0.5">
            <Svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.65}
              className="h-[14px] w-[14px] stroke-[#0496FF]"
            >
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </Svg>
            <Text className="pl-1 text-[13px] font-[425] text-[#0496FF]">
              {dayjs(item?.temp_added_time ?? 0).fromNow(true)} left
            </Text>
          </View>
        )}
        {item?.bookmark_folders != undefined
          ? item?.bookmark_folders.map((folder) => (
              <View key={folder} className="flex">
                <View className="ml-1.5 rounded bg-[#0496FF]/10 px-[3px] text-right text-xs font-[500] text-[#0496FF]">
                  <Text className="text-[#0496FF]">{folder}</Text>
                </View>
              </View>
            ))
          : null}
      </View>
    );
  }
};
