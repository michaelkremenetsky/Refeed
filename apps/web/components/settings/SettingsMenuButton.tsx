import {
  Bookmark,
  FileText,
  Filter,
  Share,
  SlidersHorizontal,
  Tags,
  User2,
} from "lucide-react";
import type { Options } from "nuqs";

interface SettingsMenuButtonProps {
  name:
    | "general"
    | "appearance"
    | "sharing"
    | "bookmarks"
    | "account"
    | "billing"
    | "filters"
    | "feeds"
    | "organize"
    | "reader";
  setPage: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options | undefined,
  ) => Promise<URLSearchParams>;
  page: string;
}

export const SettingsMenuButton: React.FC<SettingsMenuButtonProps> = (
  props,
) => {
  return (
    <div className="mx-1 my-[0.1rem] pr-1">
      <button
        className={`h-7.5 group flex w-full rounded-md py-[0.38rem] pl-2 font-[425] hover:bg-[#f5f5f5] dark:hover:bg-[#19191a] ${
          props.page == props.name ? "bg-[#f5f5f5] dark:bg-[#19191a]" : null
        }`}
        onClick={() => {
          props.setPage(props.name);
        }}
      >
        {props.name == "general" && (
          <div className="inline-flex items-center">
            <SlidersHorizontal
              absoluteStrokeWidth
              shapeRendering="geometricPrecision"
              className={`mr-2 h-[20.75px] w-[20.75px] stroke-neutral-450 stroke-[1.4] dark:stroke-stone-500`}
            />

            <h2
              className={`stroke-neutral-700 text-sm font-[450] dark:text-stone-200`}
            >
              General
            </h2>
          </div>
        )}
        {props.name == "sharing" && (
          <div className="inline-flex items-center">
            <Share
              absoluteStrokeWidth
              shapeRendering="geometricPrecision"
              fill="none"
              className={`mr-2 h-[20.75px] w-[20.75px] stroke-neutral-450 stroke-[1.4] dark:stroke-stone-500`}
            />

            <h2
              className={`stroke-neutral-700 text-sm font-[450] dark:text-stone-200`}
            >
              Sharing
            </h2>
          </div>
        )}
        {props.name == "filters" && (
          <div className="inline-flex items-center">
            <Filter
              absoluteStrokeWidth
              shapeRendering="geometricPrecision"
              className={`mr-2 h-[20.75px] w-[20.75px] stroke-neutral-450 stroke-[1.4] dark:stroke-stone-500`}
            />

            <h2
              className={`stroke-neutral-700 text-sm font-[450] dark:text-stone-200`}
            >
              Filters
            </h2>
          </div>
        )}
        {props.name == "reader" && (
          <div className="inline-flex items-center">
            <FileText
              shapeRendering="geometricPrecision"
              className={`mr-2 h-[20.75px] w-[20.75px] stroke-neutral-450 stroke-[1.4] dark:stroke-stone-400`}
            />
            <h2
              className={`stroke-neutral-700 text-sm font-[450] dark:text-stone-200`}
            >
              Reader
            </h2>
          </div>
        )}
        {props.name == "bookmarks" && (
          <div className="inline-flex items-center">
            <Bookmark
              absoluteStrokeWidth
              shapeRendering="geometricPrecision"
              className={`mr-2 h-[20.75px] w-[20.75px] stroke-neutral-450 stroke-[1.4] dark:stroke-stone-500`}
            />

            <h2
              className={`stroke-neutral-700 text-sm font-[450] dark:text-stone-200`}
            >
              Bookmarks
            </h2>
          </div>
        )}
        {props.name == "feeds" && (
          <div className="inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`mr-2 h-[20.75px] w-[20.75px] stroke-neutral-450 stroke-[1.4] dark:stroke-stone-500`}
            >
              <path
                shapeRendering="geometricPrecision"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
              />
            </svg>
            <h2
              className={`stroke-neutral-700 text-sm font-[450] dark:text-stone-200`}
            >
              Feeds
            </h2>
          </div>
        )}

        {props.name == "organize" && (
          <div className="inline-flex items-center">
            <Tags
              shapeRendering="geometricPrecision"
              className={`mr-2 h-[20.75px] w-[20.75px] stroke-neutral-450 stroke-[1.4] dark:stroke-stone-400`}
            />

            <h2
              className={`stroke-neutral-700 text-sm font-[450] dark:text-stone-200`}
            >
              Organize
            </h2>
          </div>
        )}
        {props.name == "account" && (
          <div className="inline-flex items-center">
            <User2
              shapeRendering="geometricPrecision"
              absoluteStrokeWidth
              className={`mr-2 h-[20.75px] w-[20.75px] stroke-neutral-450 stroke-[1.4] dark:stroke-stone-500`}
            />

            <h2
              className={`stroke-neutral-700 text-sm font-[450] dark:text-stone-200`}
            >
              Account
            </h2>
          </div>
        )}
      </button>
    </div>
  );
};
