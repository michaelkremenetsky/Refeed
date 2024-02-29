import type { ReactNode } from "react";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { View } from "../components/ui/View";

const { height: screenHeight } = Dimensions.get("window");

export default function SwipeToCloseModal({
  children,
  onDismiss,
}: {
  children: ReactNode;
  onDismiss: () => void;
}) {
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event, context) => {
      translateY.value = Math.max(
        0,
        ((context.startY as number) + event.translationY),
      );
    },
    onEnd: (_) => {
      if (translateY.value > screenHeight * 0.4) {
        runOnJS(onDismiss)();
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      <View style={styles.overlay}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.modal, animatedStyle]}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    height: screenHeight * 0.6,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
