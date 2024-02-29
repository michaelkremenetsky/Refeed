import dayjs from "dayjs";

import type { ItemType } from "@refeed/types/item";

interface Types {
  item: ItemType;
}

export const BookmarkInfo: React.FC<Types> = (props: Types) => {
  const { item } = props;

  if (item) {
    return (
      <>
        {item?.in_read_later == true && (
          <div className="flex shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.55}
              stroke="currentColor"
              className="mt-[-1px] h-[14px] w-[14px] stroke-sky-500/90"
              shapeRendering="geometricPrecision"
            >
              <path
                shapeRendering="geometricPrecision"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
            <div className="pl-1" />
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
