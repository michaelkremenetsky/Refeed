import * as React from "react";
import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";
import { Library } from "lucide-react-native";

import useCustomColorScheme from "./hooks/useCustomColorScheme";

export const BackIcon = (props: SvgProps) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="#878792"
      width={22}
      height={22}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </Svg>
  );
};

export const Bars = (props: SvgProps) => {
  const colorScheme = useCustomColorScheme();

  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.6}
      stroke={colorScheme === "dark" ? "#4d4d4d" : "#4d4d4d"}
      className="h-6 w-6"
      width={24}
      height={24}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </Svg>
  );
};

export const BookmarkIcon = (props: SvgProps) => {
  const colorScheme = useCustomColorScheme();

  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={colorScheme === "dark" ? "#4d4d4d" : "#4d4d4d"}
      className="h-6 w-6"
      width={24}
      height={24}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z"
      />
    </Svg>
  );
};

interface BookmarkIconProps {
  selected: boolean;
}

export const BookmarkIconTabBar = ({
  selected,
  ...props
}: SvgProps & BookmarkIconProps) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.4}
      className={`${selected ? "stroke-[#0B7ED0]" : "stroke-[#9999a3]"}`}
      width={28}
      height={28}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z"
      />
    </Svg>
  );
};

export const Checkmark = (props: SvgProps) => {
  const colorScheme = useCustomColorScheme();

  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={colorScheme === "dark" ? "#4d4d4d" : "black"}
      className="h-6 w-6"
      width={26}
      height={26}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </Svg>
  );
};

export const ClockIcon = (props: SvgProps) => {
  const colorScheme = useCustomColorScheme();

  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={colorScheme === "dark" ? "#4d4d4d" : "#4d4d4d"}
      className="h-6 w-6"
      width={24}
      height={24}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
      />
    </Svg>
  );
};

interface DiscoverIconProps {
  selected: boolean;
}

export const DiscoverIcon = ({
  selected,
  ...props
}: SvgProps & DiscoverIconProps) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.425}
      className={`${selected ? "stroke-[#0B7ED0]" : "stroke-neutral-500"}`}
      width={28}
      height={28}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </Svg>
  );
};

export const FeedsIcon = ({
  selected,
  ...props
}: SvgProps & DiscoverIconProps) => {
  return (
    <Library
      viewBox="0 0 24 24"
      strokeWidth={1.4}
      color={selected ? "#0B7ED0" : "#9999a3"}
      width={28}
      height={28}
      {...props}
    />
  );
};

export const DownIcon = (props: SvgProps) => {
  const colorScheme = useCustomColorScheme();

  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={colorScheme === "dark" ? "#4d4d4d" : "#9c9ca5"}
      width={20}
      height={20}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </Svg>
  );
};

export const EllipsisIcon = (props: SvgProps) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.6}
      className="h-6 w-6 stroke-[#878792]"
      width={28}
      height={28}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm6 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm6 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z"
      />
    </Svg>
  );
};

interface HomeIconProps {
  selected: boolean;
}

export const HomeIcon = ({ selected, ...props }: SvgProps & HomeIconProps) => {
  const colorScheme = useCustomColorScheme();

  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.3}
      stroke={
        colorScheme === "dark"
          ? selected
            ? "#E7E9EA"
            : "#4d4d4d"
          : selected
            ? "black"
            : "#4d4d4d"
      }
      className="h-6 w-6"
      width={24}
      height={24}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </Svg>
  );
};

interface InboxIconProps {
  selected: boolean;
}

export const InboxIcon = ({
  selected,
  ...props
}: SvgProps & InboxIconProps) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.4}
      //       className={
      //   colorScheme === "dark"
      //     ? selected
      //       ? "stroke-[#0B7ED0]"
      //       : "stroke-[#222425]"
      //     : selected
      //     ? "stroke-[#0B7ED0]"
      //     : "stroke-[#222425]"
      // }
      className={`${selected ? "stroke-[#0B7ED0]" : "stroke-neutral-450"}`}
      width={28}
      height={28}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
      />
    </Svg>
  );
};

interface SearchIconProps {
  selected: boolean;
}

export const SearchIconTabBar = ({
  selected,
  ...props
}: SvgProps & SearchIconProps) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.4}
      className={`${selected ? "stroke-[#0B7ED0]" : "stroke-neutral-450"}`}
      width={28}
      height={28}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
      />
    </Svg>
  );
};

export const ShareIcon = (props: SvgProps) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="#9c9ca5"
      width={22}
      height={22}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z"
      />
    </Svg>
  );
};

export const SquareIcon = (props: SvgProps) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      strokeWidth={1.6}
      stroke="#9999a3"
      fill="none"
      width={26}
      height={26}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
      />
    </Svg>
  );
};

export const StackIcon = (props: SvgProps) => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.6}
    className="stroke-[#9c9ca5]"
    width={28}
    height={28}
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
    />
  </Svg>
);

export const AddIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="lucide lucide-plus"
    {...props}
  >
    <Path d="M5 12h14M12 5v14" />
  </Svg>
);

export const MoreIcon = () => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#717578"
    className="h-6 w-6"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
    />
  </Svg>
);
