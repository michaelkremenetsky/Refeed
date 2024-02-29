import dayjs from "dayjs";

import type { ItemType } from "@refeed/types/item";

export const DateInfo = (props: { i: number; items: ItemType[] }) => {
  try {
    return (
      <>
        {(props.i == 0 ||
          props.items[props.i]?.created_at.setHours(0, 0, 0, 0) !=
            props.items[props.i - 1]?.created_at.setHours(0, 0, 0, 0)) && (
          <>
            {props.items[props.i]?.created_at.toDateString() ==
            new Date().toDateString() ? (
              <h4 className="ml-5 mt-4 text-xs font-[500] tracking-wider text-neutral-500 dark:text-neutral-500/70">
                Today
              </h4>
            ) : props.items[props.i]?.created_at.toDateString() ==
              new Date(Date.now() - 1).toDateString() ? (
              <h4 className="ml-5 mt-6 text-xs font-[500] tracking-wider text-neutral-500 dark:text-neutral-500/70">
                Yesterday
              </h4>
            ) : (
              <h4 className="ml-5 mt-6 text-xs font-[500] tracking-wider text-neutral-500 dark:text-neutral-500/70">
                {dayjs(props.items[props.i]?.created_at).format("MMM D")}
              </h4>
            )}
          </>
        )}
      </>
    );
  } catch (error) {
    return <></>;
  }
};
