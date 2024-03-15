import { TouchableOpacity } from "react-native-gesture-handler";
import { SFSymbol } from "react-native-sfsymbols";

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
          <SFSymbol
            name="bookmark"
            weight="regular"
            scale="large"
            color="#9c9ca5"
            size={18}
            multicolor={false}
            style={{ width: 22, height: 22 }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            removeBookmark(item?.id, "Regular");
          }}
        >
          <SFSymbol
            name="bookmark"
            weight="regular"
            scale="large"
            color="#0496FF"
            size={18}
            multicolor={false}
            style={{ width: 22, height: 22 }}
          />
        </TouchableOpacity>
      )}
    </>
  );
};
