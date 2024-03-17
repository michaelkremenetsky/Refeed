import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { View } from "../ui/View";

export const SpinningCircle = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const { height, width } = useWindowDimensions();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        className="bg-[#a3a3a3]/95"
        style={{
          height: height * 0.085,
          width: width * 0.18,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={[
            {
              width: 35,
              height: 35,
              borderRadius: 25,
              borderWidth: 4.75,
              borderColor: "#FCFCFC",
              borderRightColor: "transparent",
            },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};
