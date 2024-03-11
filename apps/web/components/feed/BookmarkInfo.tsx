import dayjs from "dayjs";
import { useAtom } from "jotai";

import type { ItemType } from "@refeed/types/item";

import { feedLayout } from "../../stores/ui";

interface Types {
  item: ItemType;
}

export const BookmarkInfo: React.FC<Types> = (props: Types) => {
  const { item } = props;
  const [Layout] = useAtom(feedLayout);

  // Slice the amount of bookmark_folders to 3 if they are using the Card layout
  if (Layout == "Card") {
    item.bookmark_folders = item?.bookmark_folders?.slice(0, 3);
  }

  if (item) {
    return (
      <>
        {item?.in_read_later == true && (
          <div className="flex shrink-0">
            <div className="pl-[1px]" />
            <h4 className="text-[13px] font-[425] leading-none text-sky-500">
              Read Later
            </h4>
          </div>
        )}
        {item?.temp_added_time && (
          <div className="flex shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              shapeRendering="geometricPrecision"
              className="mt-[-1px] h-[14px] w-[14px] stroke-sky-500/90"
            >
              <path
                shapeRendering="geometricPrecision"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="pl-1" />
            <h4 className="text-[13px] font-[425] leading-none text-sky-500">
              {dayjs(item?.temp_added_time ?? 0).fromNow(true)} left
            </h4>
          </div>
        )}
        {item?.bookmark_folders?.map((folder) => (
          <div key={folder} className="mt-[-1px] flex shrink-0">
            <span
              className={`h-4 rounded bg-[#0496FF]/10 px-1 text-right text-xs font-[500] text-sky-500`}
            >
              {folder}
            </span>
          </div>
        ))}
      </>
    );
  }
};
