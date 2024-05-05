import type { Options } from "nuqs";
import { Text } from "react-aria-components";

export type SideBarMenuPages =
  | "general"
  | "appearance"
  | "sharing"
  | "bookmarks"
  | "account"
  | "filters"
  | "feeds"
  | "organize"
  | "reader"
  | "integrations"
  | "feedback";

export interface SettingsMenuButtonProps {
  name: SideBarMenuPages;
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
            <Text
              slot="label"
              className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
            >
              General
            </Text>
          </div>
        )}
        {props.name == "sharing" && (
          <div className="inline-flex items-center">
            <Text
              slot="label"
              className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
            >
              Sharing
            </Text>
          </div>
        )}
        {props.name == "filters" && (
          <div className="inline-flex items-center">
            <Text
              slot="label"
              className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
            >
              Filters
            </Text>
          </div>
        )}
        {props.name == "bookmarks" && (
          <div className="inline-flex items-center">
            <Text
              slot="label"
              className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
            >
              Bookmarks
            </Text>
          </div>
        )}
        {props.name == "feeds" && (
          <div className="inline-flex items-center">
            <Text
              slot="label"
              className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
            >
              Feeds
            </Text>
          </div>
        )}
        {props.name == "organize" && (
          <div className="inline-flex items-center">
            <Text
              slot="label"
              className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
            >
              Organize
            </Text>
          </div>
        )}
        {props.name == "account" && (
          <div className="inline-flex items-center">
            <Text
              slot="label"
              className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
            >
              Account
            </Text>
          </div>
        )}
        {props.name == "feedback" && (
          <div className="inline-flex items-center">
            <Text
              slot="label"
              className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
            >
              Feedback
            </Text>
          </div>
        )}
        {props.name == "reader" && (
          <div className="inline-flex items-center">
            <Text
              slot="label"
              className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
            >
              Reader
            </Text>
          </div>
        )}
        {props.name == "integrations" && (
          <div className="inline-flex items-center">
            <Text
              slot="label"
              className={`stroke-neutral-700 pl-0.5 text-sm font-[450] text-neutral-700 dark:text-stone-200`}
            >
              Integrations
            </Text>
          </div>
        )}
      </button>
    </div>
  );
};
