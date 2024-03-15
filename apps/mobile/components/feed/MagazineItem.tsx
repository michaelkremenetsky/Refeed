import { memo } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { decodeHtmlEntities } from "@refeed/lib/decodeHtmlEntities";
import type { ItemType } from "@refeed/types/item";

import type { FeedType, NavigatorParams } from "../../lib/navTypes";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { AddInfo } from "./AddInfo";

export const MagazineItem = memo(
  (props: {
    i: number;
    FeedType: FeedType;
    feedId?: string;
    item: ItemType;
    searchQuery?: string;
    markRead: () => void;
  }) => {
    const { i, FeedType, item, feedId, markRead } = props;
    const navigation = useNavigation<NavigatorParams>();

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          requestAnimationFrame(() => {
            if (navigation && typeof navigation.navigate === "function") {
              navigation?.navigate("Item", {
                index: i,
                type: FeedType,
                feedId: feedId,
                itemId: item.id,
                searchQuery: props.searchQuery,
              });
            }
          });
          // This won't run till after you go back to the feed because of react freeze
          setTimeout(() => {
            markRead();
          }, 0);
        }}
      >
        {(FeedType == "recentlyread" || FeedType == "bookmarks") && (
          <View>{i == 0 && <View className="my-2" />}</View>
        )}
        <Animated.View
          className={`mb-5 flex flex-row ${
            item?.marked_read ? " opacity-60" : ""
          }`}
        >
          <View className="min-h-20 w-[200px]">
            <Text
              className="text-sm font-semibold leading-[18px]"
              style={{
                letterSpacing: -0.02,
              }}
            >
              {decodeHtmlEntities(item?.title)}
            </Text>

            <View className="mt-1 flex flex-row flex-wrap">
              <AddInfo item={item} />
              <View className="flex flex-row flex-wrap">
                {(FeedType == "all" ||
                  FeedType == "multiple" ||
                  FeedType == "recentlyread" ||
                  FeedType == "bookmarks") && (
                  <>
                    <Text.Secondary numberOfLines={1} className="max-w-[150px]">
                      {item?.feed_title}{" "}
                    </Text.Secondary>
                  </>
                )}
                <Text.Secondary>
                  {dayjs(item?.updated_at).fromNow()}
                </Text.Secondary>
              </View>
            </View>
          </View>
          <View className="mx-auto" />
          <View className="ml-4 h-[78px] w-[120px] rounded-[4px] border border-neutral-200/50">
            {item?.image_url ? (
              <Image
                className="h-full w-full rounded-[4px]"
                recyclingKey={item.id}
                source={{
                  uri: item?.image_url,
                }}
              />
            ) : (
              <View className="h-full w-full rounded-md" />
            )}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  },
);
