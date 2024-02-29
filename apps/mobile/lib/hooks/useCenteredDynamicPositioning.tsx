import { Dimensions } from "react-native";
import { useDerivedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomSheetDynamicSnapPoints } from "@gorhom/bottom-sheet";

export const useCenteredDynamicPositioning = () => {
  const { animatedHandleHeight, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(["CONTENT_HEIGHT"]);

  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;

  const animatedSnapPoints = useDerivedValue(() => {
    const safeHeight = windowHeight - insets.top - insets.bottom;
    const bottomSheetHeight =
      animatedContentHeight.value + animatedHandleHeight.value;
    const verticalMargin = (safeHeight - bottomSheetHeight) / 2;
    const snapPoint = windowHeight - insets.top - verticalMargin;

    // Values lower than 1 aren't valid snapPoints, so always return at least 1
    return [snapPoint >= 1 ? snapPoint : 1];
  });

  return {
    animatedSnapPoints,
    animatedHandleHeight,
    animatedContentHeight,
    handleContentLayout,
  };
};
