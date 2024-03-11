import { useTheme } from "next-themes";

import type { ItemType } from "@refeed/types/item";

import type { FeedTypes } from "../../types/feed";
import { ImageWithFallback } from "../layout/ImageWithFallback";

export const MagazineImage = (props: {
  item: ItemType;
  FeedType: FeedTypes;
}) => {
  const { item } = props;
  const { theme } = useTheme();

  return (
    <div
      className={`
        ${
          theme == "dark"
            ? " border-neutral-800"
            : theme == "light"
              ? "shadow-sm"
              : null
        } d
        ${
          !item?.image_url
            ? "border border-neutral-100 dark:border-[#1a1a1a]"
            : null
        } relative top-1 mb-3 ml-2 mr-1.5 h-20 min-w-[129.55px] rounded-md bg-white dark:bg-[#0f0f10]`}
    >
      <>
        {!item?.image_url ? (
          <div className="w-min-screen h-[105px] rounded-md" />
        ) : (
          <ImageWithFallback
            alt="Feed"
            fill={true}
            src={item?.image_url ?? ""}
            unoptimized
            className={`rounded-md border border-neutral-50 object-cover dark:border-stone-800`}
          />
        )}
      </>
    </div>
  );
};
