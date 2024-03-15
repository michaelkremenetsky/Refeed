import { TouchableOpacity } from "react-native-gesture-handler";
import { SFSymbol } from "react-native-sfsymbols";
import Svg, { Path } from "react-native-svg";

import { useUser } from "@refeed/features/hooks/useUser";
import type { ItemType } from "@refeed/types/item";

import { useUpdateBookmarks } from "../../../features/useUpdateBookmarks";

export const ShortTermBookmarkButton = ({ item }: { item: ItemType }) => {
  const { markBookmarkRead, removeBookmark } = useUpdateBookmarks();
  const { plan } = useUser();

  if (plan != "free") {
    return (
      <>
        {!(item?.temp_added_time instanceof Date) ? (
          <TouchableOpacity
            onPress={() => {
              markBookmarkRead(item?.id, "Short Term");
            }}
          >
            <SFSymbol
              name="clock"
              weight="regular"
              scale="large"
              size={18}
              color="#9c9ca5"
              multicolor={false}
              style={{ width: 22, height: 22 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              removeBookmark(item?.id, "Short Term");
            }}
          >
            <Svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.3}
              stroke="#0496FF"
              width={22}
              height={22}
            >
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
              />
            </Svg>
          </TouchableOpacity>
        )}
      </>
    );
  }
};
