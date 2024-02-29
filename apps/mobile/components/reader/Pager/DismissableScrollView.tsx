import type { PropsWithChildren } from "react";
import React, { useCallback, useState } from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRefContext } from "@react-navigation/stack";

export const DismissableScrollView = (
  props: PropsWithChildren<ScrollViewProps>,
) => {
  const [scrolledTop, setScrolledTop] = useState(true);
  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setScrolledTop(nativeEvent.contentOffset.y <= 0);
    },
    [],
  );

  return (
    <GestureHandlerRefContext.Consumer>
      {(ref) => (
        <ScrollView
          waitFor={scrolledTop ? ref : undefined}
          onScroll={onScroll}
          scrollEventThrottle={16}
          {...props}
        />
      )}
    </GestureHandlerRefContext.Consumer>
  );
};
