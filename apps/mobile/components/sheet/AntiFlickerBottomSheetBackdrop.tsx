import type { FunctionComponent } from "react";
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

export const AntiFlickerBottomSheetBackdrop: FunctionComponent<
  BottomSheetBackdropProps
> = ({ animatedIndex, ...rest }) => {
  const adjustedAnimatedIndex = useSharedValue(0);
  const hasOpened = useSharedValue(false);

  useAnimatedReaction(
    () => animatedIndex.value,
    (data, prev) => {
      if (prev == null) {
        adjustedAnimatedIndex.value = withTiming(
          1,
          { duration: 400 },
          (isFinished) => {
            if (isFinished) hasOpened.value = true;
          },
        );
      }

      if (hasOpened.value) adjustedAnimatedIndex.value = data;
    },
  );

  return (
    <BottomSheetBackdrop
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      animatedIndex={adjustedAnimatedIndex}
      {...rest}
    />
  );
};
