import { useCallback, useRef } from "react";
import type { NativeEventSubscription } from "react-native";
import { BackHandler } from "react-native";
import type {
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";

// From https://github.com/gorhom/react-native-bottom-sheet/issues/1110#issuecomment-1352865270

/**
 * hook that dismisses the bottom sheet on the hardware back button press if it is visible
 * @param bottomSheetRef ref to the bottom sheet which is going to be closed/dismissed on the back press
 */
export const useBottomSheetBackHandler = (
  bottomSheetRef: React.RefObject<BottomSheetModal | null>,
) => {
  const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(
    null,
  );
  const handleSheetPositionChange = useCallback<
    NonNullable<BottomSheetModalProps["onChange"]>
  >(
    (index) => {
      const isBottomSheetVisible = index >= 0;
      if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
        // setup the back handler if the bottom sheet is right in front of the user
        backHandlerSubscriptionRef.current = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            bottomSheetRef.current?.dismiss();
            return true;
          },
        );
      } else if (!isBottomSheetVisible) {
        backHandlerSubscriptionRef.current?.remove();
        backHandlerSubscriptionRef.current = null;
      }
    },
    [bottomSheetRef, backHandlerSubscriptionRef],
  );
  return { handleSheetPositionChange };
};
