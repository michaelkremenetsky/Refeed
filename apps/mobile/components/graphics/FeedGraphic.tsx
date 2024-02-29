import React from "react";
import { ShadowedView } from "react-native-fast-shadow";
import Svg, { Path } from "react-native-svg";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Text } from "../ui/Text";
import { View } from "../ui/View";

dayjs.extend(relativeTime);

export const FeedGraphic = (props: { className?: string }) => {
  const { className } = props;

  return (
    <ShadowedView className={clsx("-translate-y-6", className)}>
      <View className="flex h-[100px] w-[275px] flex-row rounded-md border border-neutral-200 bg-white">
        <View className="ml-2 h-[80px] w-[100px] self-center rounded-md border border-neutral-200 bg-neutral-50" />
        <View className="ml-2 mt-[10px] h-[20px] w-[150px] rounded-md border border-neutral-200 bg-neutral-50" />
      </View>
    </ShadowedView>
  );
};

export const TimedFeedGraphic = (props: { className?: string }) => {
  const { className } = props;

  // TODO: Add a timer to this graphic similar to how it is on web
  return (
    <ShadowedView className={clsx("-translate-y-6", className)}>
      <View className="flex h-[100px] w-[275px] flex-row rounded-md border border-neutral-200 bg-white">
        <View className="ml-2 h-[80px] w-[100px] self-center rounded-md border border-neutral-200 bg-neutral-50" />
        <View className="ml-2 mt-[10px] h-[20px] w-[150px] rounded-md border border-neutral-200 bg-neutral-50">
          <View className="flex flex-row pb-0.5 pl-0.5">
            <Svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.65}
              className="h-[14px] w-[14px] translate-y-[1.5px] stroke-[#0496FF]"
            >
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </Svg>
            <View className="pl-1" />
            <Text className="text-[13px] font-[425] text-[#0496FF]">
              24 left
            </Text>
          </View>
        </View>
      </View>
    </ShadowedView>
  );
};
