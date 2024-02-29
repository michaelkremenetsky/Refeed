import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import type { ItemType } from "@refeed/types/item";

import { Text } from "../ui/Text";

dayjs.extend(relativeTime);

export const DateInfo = (props: { i: number; items: ItemType[] }) => {
  const { i, items } = props;

  const item = items[i];

  try {
    return (
      <>
        {(i == 0 ||
          item?.created_at.setHours(0, 0, 0, 0) !=
            items?.[i - 1]?.created_at.setHours(0, 0, 0, 0)) && (
          <>
            {item?.created_at.toDateString() == new Date().toDateString() ? (
              <Text className="mb-3 ml-1 mt-4 text-xs font-medium tracking-wider text-neutral-500">
                Today
              </Text>
            ) : item?.created_at.toDateString() ==
              new Date(Date.now() - 1).toDateString() ? (
              <Text className="mb-3 ml-1 mt-4 text-xs font-medium tracking-wider text-neutral-500">
                Yesterday
              </Text>
            ) : (
              <Text className="mb-3 ml-1 mt-3 text-xs font-medium tracking-wider text-neutral-500">
                {dayjs(item?.created_at).format("MMM D")}
              </Text>
            )}
          </>
        )}
      </>
    );
  } catch (error) {
    return <></>;
  }
};
