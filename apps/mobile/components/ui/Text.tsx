import React from "react";
import type { TextProps } from "react-native";
import { Text as FastText } from "react-native-fast-text";

import useCustomColorScheme from "../../lib/hooks/useCustomColorScheme";

interface AppTextProps extends TextProps {
  className?: string;
}

export const Text = ({ style, ...props }: AppTextProps) => {
  const colorScheme = useCustomColorScheme();

  return (
    <FastText
      {...props}
      className={` ${
        colorScheme == "dark" ? "text-[#d4d4d4]" : "text-[#222425]"
      } `}
      style={[style, { fontFamily: "system" }]}
    />
  );
};

// Used for Titles/Headings in UI
const Title = (props: AppTextProps) => (
  <Text {...props} className="text-sm font-semibold" />
);
Title.displayName = "AppText.Title";
Text.Title = Title;

// Used for Supporting Text
const Secondary = (props: AppTextProps) => (
  <Text
    {...props}
    className="text-[13px] font-normal text-neutral-400 dark:text-[#c5c5c5]"
  />
);
Secondary.displayName = "AppText.Secondary";
Text.Secondary = Secondary;

// Used for Large Titles/Headings in UI
const ArticleTitle = (props: AppTextProps) => {
  const colorScheme = useCustomColorScheme();

  return (
    <Text
      {...props}
      className={`text-xl font-medium  ${
        colorScheme == "dark" ? "text-[#d4d4d4]" : "text-[#333338]"
      }`}
    />
  );
};
ArticleTitle.displayName = "AppText.ArticleTitle";
Text.ArticleTitle = ArticleTitle;
