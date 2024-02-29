import type { useAnimatedStyle } from "react-native-reanimated";
import { interpolate } from "react-native-reanimated";

import type { PageInterpolatorParams } from "./InfinitePager";

export function pageInterpolatorSlide({
  focusAnim,
  pageWidth,
  pageHeight,
  vertical,
}: PageInterpolatorParams): ReturnType<typeof useAnimatedStyle> {
  "worklet";

  const translateX = vertical
    ? 0
    : interpolate(
        focusAnim.value,
        [-1, 0, 1],
        [-pageWidth.value, 0, pageWidth.value],
      );
  const translateY = vertical
    ? interpolate(
        focusAnim.value,
        [-1, 0, 1],
        [-pageHeight.value, 0, pageHeight.value],
      )
    : 0;

  return {
    transform: [{ translateX }, { translateY }],
  };
}
