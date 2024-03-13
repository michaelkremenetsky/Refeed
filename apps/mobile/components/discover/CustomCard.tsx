import React, { useContext } from "react";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import clsx from "clsx";
import { useSetAtom } from "jotai";

import { decodeHtmlEntities } from "@refeed/lib/decodeHtmlEntities";

import type { TODO } from "../../lib/todoType";
import { addFeedLinkAtom, AddFeedRefContext } from "../sheet/AddFeedRefContext";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { CustomCardShadow } from "./CustomCardShadow";

export const CustomCard = ({
  item,
  search_logo_url,
}: {
  item: TODO;
  search_logo_url: string;
}) => {
  const logoUrl = item.logo_url ?? search_logo_url;

  const opener = useContext(AddFeedRefContext);
  const setLink = useSetAtom(addFeedLinkAtom);
  const setTitle = useSetAtom(addFeedLinkAtom);

  return (
    <>
      <CustomCardShadow>
        <Pressable
          onPress={() => {
            // Open the Modal
            opener?.current?.expand();
            opener?.current?.present();
            setTitle(item?.feed_url);
            setLink(item?.feed_url);
          }}
          className="mx-2 mb-1 h-[175px] w-[200px] rounded-lg border border-[#e4e7ea] bg-[#fcfcfc] px-0.5"
        >
          <View className="shadow-1 mb-2 ml-2.5 mt-4 flex h-[20px] w-[20px] items-center justify-center rounded">
            <Image
              className="h-[20px] w-[20px] opacity-60"
              source={{ uri: logoUrl }}
            />
          </View>
          <Text className="ml-2 font-medium">
            {decodeHtmlEntities(item.title)}
          </Text>
          <Text className="ml-2">{item.link}</Text>
          <View className="mx-auto flex w-[95%]">
            <View className="flex h-full flex-col dark:border-neutral-700">
              <BlurredText className="mx-3 rounded-sm" />
              <BlurredText className="mx-3 rounded-sm" />
              <BlurredText className="mx-3 rounded-sm" />
              <BlurredText className="mx-3 rounded-sm" />
            </View>
          </View>
        </Pressable>
      </CustomCardShadow>
    </>
  );
};

const BlurredText = ({ className }: { className: string }) => (
  <View
    className={clsx(
      "mt-1 h-4 w-full rounded border border-neutral-200/60 bg-neutral-100 dark:bg-[#19191a]",
      className,
    )}
  />
);
