import React, { memo, useState } from "react";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import { useMarkdown } from "react-native-marked";
import Animated from "react-native-reanimated";
import dayjs from "dayjs";

import { decodeHtmlEntities } from "@refeed/lib/decodeHtmlEntities";
import { isDeepEqual } from "@refeed/lib/isDeepEqual";
import type { ItemType } from "@refeed/types/item";

import { MoreIcon } from "../../lib/Icons";
import { openWeb } from "../../lib/openWeb";
import { trpc } from "../../utils/trpc";
import { Text } from "../ui/Text";
import { View } from "../ui/View";
import { markdownRenderer } from "./MarkdownRender";

let ItemRender = ({ item }: { item: ItemType }): React.ReactNode => {
  const FeedInfo =
    item?.feed_title! +
    " on" +
    dayjs(item?.created_at).format(" MMMM D, YYYY [at] h:mmA");

  const [fullContentExpanded, setFullContentExpanded] = useState(false);
  const { data: expandedContent } = trpc.pro.fetchFullContent.useQuery(
    { url: item?.url },
    {
      enabled: fullContentExpanded,
    },
  );

  // The markdown can still down the app quite a bit sometimes on lower end devices so we are temporarily slicing it till static hermes comes out
  const elements = useMarkdown(
    expandedContent
      ? expandedContent
      : item.website_content?.slice(0, 3000) ?? "",
    {
      renderer: markdownRenderer,
      styles: {
        text: {
          fontFamily: "System",
          fontSize: 19,
          lineHeight: 29.6,
          color: "#404245",
        },
        link: {
          fontFamily: "System",
          fontStyle: "normal",
          fontSize: 19,
          lineHeight: 29.6,
          color: "#0496FF",
        },
      },
    },
  );

  return (
    <Animated.ScrollView
      scrollIndicatorInsets={{
        bottom: 40,
        top: 8,
      }}
      style={styles.horizontalPadding}
    >
      <Pressable
        style={styles.topPadding}
        onPress={() => {
          openWeb(item?.url);
        }}
      >
        <Text style={styles.title}>{decodeHtmlEntities(item?.title)}</Text>
      </Pressable>
      <Text style={styles.feedInfo}>{FeedInfo}</Text>
      {elements}
      <View style={styles.bottomBtnsOuter}>
        <Pressable
          onPress={() => {
            openWeb(item.url);
          }}
          style={styles.bottomBtnsInner}
        >
          <Text style={styles.visitButton}>Visit Website</Text>
        </Pressable>
        <Pressable
          onPress={() => setFullContentExpanded(!fullContentExpanded)}
          style={styles.expandButton}
        >
          <MoreIcon />
        </Pressable>
      </View>
    </Animated.ScrollView>
  );
};

ItemRender = memo(ItemRender, (oldProps, newProps) => {
  /* We need to remove these because it causes it to re-render if 
  the an item is bookmarked */
  // delete oldProps.item?.bookmark_folders;
  // delete newProps.item?.bookmark_folders;
  // delete oldProps.item?.in_read_later;
  // delete newProps.item?.in_read_later;
  // delete oldProps.item?.temp_added_time;
  // delete newProps.item?.temp_added_time;

  return isDeepEqual(oldProps.item, newProps.item);
});

export default ItemRender;

const width = Dimensions.get("window").width;

// Not using nativewind here for perf reasons
const styles = StyleSheet.create({
  horizontalPadding: {
    paddingHorizontal: 16,
    width: width,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  topPadding: {
    paddingTop: 20,
  },
  feedInfo: {
    marginBottom: 5,
    paddingVertical: 8,
    letterSpacing: 0.4,
    color: "#878792",
  },
  bottomBtnsOuter: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    paddingBottom: 32,
  },
  bottomBtnsInner: {
    marginTop: 32,
    width: "80%",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    borderColor: "#d4d7d9",
  },
  visitButton: {
    marginLeft: 4,
    alignSelf: "center",
    fontWeight: "500",
    color: "#9999a3",
    borderColor: "#d4d7d9",
  },
  expandButton: {
    marginTop: 32,
    width: "16.666667%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d4d7d9",
    padding: 8,
  },
  title: {
    fontFamily: "system",
    fontSize: 26,
    marginBottom: 4,
    fontWeight: "700",
    lineHeight: 30,
    color: "#292929",
  },
});
