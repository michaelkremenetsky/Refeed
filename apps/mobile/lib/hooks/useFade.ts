import type { SharedValue } from "react-native-reanimated";
import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useItemData } from "@refeed/features/item/useItemDataMobile";

import type { FeedType } from "../navTypes";

export const useFade = (FeedType: FeedType, scrollY: SharedValue<number>) => {
  const { items } = useItemData();

  const textStyles = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [50, 100], [0, 1], "clamp");

    if (FeedType == "discover") {
      return {
        opacity: 1,
      };
    }

    if (items) {
      if (items.length < 7) {
        return {
          opacity: 1,
        };
      }
    }

    return {
      opacity,
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    if (items) {
      if (items.length < 7) {
        return {
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
        };
      }
    }

    if (FeedType == "discover") {
      return {
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
      };
    }

    const borderColor = interpolateColor(
      scrollY.value,
      [10, 45],
      ["#00000000", "#f0f0f0"],
      "RGB",
    );

    return {
      borderTopWidth: 1,
      borderTopColor: borderColor,
    };
  });

  const animatedDarkBorderStyle = useAnimatedStyle(() => {
    if (items) {
      if (items.length < 7) {
        return {
          borderBottomWidth: 1,
          borderBottomColor: "#1E1E1E",
        };
      }
    }
    if (FeedType == "discover") {
      return {
        borderBottomWidth: 1,
        borderBottomColor: "#1E1E1E",
      };
    }

    const borderColor = interpolateColor(
      scrollY.value,
      [10, 45],
      ["#00000000", "#1E1E1E"],
      "RGB",
    );

    return {
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    };
  });

  return { textStyles, animatedBorderStyle, animatedDarkBorderStyle } as const;
};
