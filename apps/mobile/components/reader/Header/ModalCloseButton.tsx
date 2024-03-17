import type { RefObject } from "react";
import React, { useCallback } from "react";
import { Path, Svg } from "react-native-svg";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import type { TODO } from "../../../lib/todoType";

interface ModalCloseProps {
  type: "Navigation" | "modal";
  modalRef?: RefObject<BottomSheetModalMethods>;
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  navigation?: TODO;
}

export const ModalClose = (props: ModalCloseProps) => {
  const onPressHandler = useCallback(() => {
    if (props.type === "Navigation" && props.navigation) {
      props.navigation.goBack();
    } else {
      props.modalRef?.current?.close();
    }
  }, [props.type, props.navigation, props.modalRef]);

  return (
    <Svg
      viewBox="0 0 24 24"
      className="absolute right-4 mt-4 h-7 w-7"
      onPress={onPressHandler}
    >
      <Path
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"
        fill="#e6e6e6"
      />
      <Path
        d="M10.44 11.5l-2.22 2.22a.75.75 0 1 0 1.06 1.06L11.5 12.56l2.22 2.22a.75.75 0 1 0 1.06-1.06l-2.22-2.22 2.22-2.22a.75.75 0 1 0-1.06-1.06L11.5 10.44l-2.22-2.22a.75.75 0 1 0-1.06 1.06L10.44 11.5z"
        fill="#868686"
      />
    </Svg>
  );
};

export const DialogModalClose = (props: ModalCloseProps) => {
  const onPressHandler = useCallback(() => {
    if (props.type === "Navigation" && props.navigation) {
      props.navigation.goBack();
    } else {
      props.modalRef?.current?.close();
    }
  }, [props.type, props.navigation, props.modalRef]);

  return (
    <Svg
      viewBox="0 0 24 24"
      className="absolute right-1 mt-4 h-7 w-7"
      onPress={onPressHandler}
    >
      <Path
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"
        fill="#e6e6e6"
      />
      <Path
        d="M10.44 11.5l-2.22 2.22a.75.75 0 1 0 1.06 1.06L11.5 12.56l2.22 2.22a.75.75 0 1 0 1.06-1.06l-2.22-2.22 2.22-2.22a.75.75 0 1 0-1.06-1.06L11.5 10.44l-2.22-2.22a.75.75 0 1 0-1.06 1.06L10.44 11.5z"
        fill="#868686"
      />
    </Svg>
  );
};
