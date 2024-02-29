import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

/* eslint-disable */
// Copied from https://stackoverflow.com/questions/45854450/detect-swipe-left-in-react-native

export function useSwipe(
  onSwipeLeft?: any,
  onSwipeRight?: any,
  rangeOffset = 4,
) {
  let firstTouch = 0;

  function onTouchStart(e: any) {
    firstTouch = e.nativeEvent.pageX;
  }

  function onTouchEnd(e: any) {
    const positionX = e.nativeEvent.pageX;
    const range = windowWidth / rangeOffset;

    // Check if position is growing positively and has reached specified range
    if (positionX - firstTouch > range) {
      onSwipeRight?.();
    }
    // Check if position is growing negatively and has reached specified range
    else if (firstTouch - positionX > range) {
      onSwipeLeft?.();
    }
  }

  return { onTouchStart, onTouchEnd };
}
