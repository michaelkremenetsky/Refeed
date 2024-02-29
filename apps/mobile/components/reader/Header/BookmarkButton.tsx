import { TouchableOpacity } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";

import type { ItemType } from "@refeed/types/item";

import { useUpdateBookmarks } from "../../../features/useUpdateBookmarks";

export const BookmarkButton = ({ item }: { item: ItemType }) => {
  const { markBookmarkRead, removeBookmark } = useUpdateBookmarks();

  return (
    <>
      {item?.in_read_later == undefined || item.in_read_later == false ? (
        <TouchableOpacity
          onPress={() => {
            markBookmarkRead(item?.id, "Regular");
          }}
        >
          <Svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#878792"
            width={26}
            height={26}
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z"
            />
          </Svg>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            removeBookmark(item?.id, "Regular");
          }}
        >
          <Svg
            fill="#0496FF"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#0496FF"
            className="h-8 w-8"
            width={26}
            height={26}
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z"
            />
          </Svg>
        </TouchableOpacity>
      )}
    </>
  );
};
