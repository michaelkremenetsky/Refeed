import React from "react";
import { Keyboard } from "react-native";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { BottomSheetBackdrop, useBottomSheetModal } from "@gorhom/bottom-sheet";

export const Backdrop = (props_: BottomSheetBackdropProps) => {
  const { dismissAll } = useBottomSheetModal();

  return (
    <BottomSheetBackdrop
      {...props_}
      pressBehavior={"close"}
      opacity={0.25}
      appearsOnIndex={0}
      onPress={() => {
        Keyboard.dismiss();
        dismissAll();
      }}
      disappearsOnIndex={-1}
    />
  );
};

export const renderBackdropWithoutFlicker = (
  props_: BottomSheetBackdropProps,
) => (
  <BottomSheetBackdrop
    {...props_}
    pressBehavior={"close"}
    opacity={0.25}
    appearsOnIndex={2}
    onPress={Keyboard.dismiss}
    disappearsOnIndex={1}
  />
);
