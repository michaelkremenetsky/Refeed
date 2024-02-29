import React from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Text } from "../ui/Text";

// TODO: Replace this with a Segmented Control

export const PlanSelectButton = (props: {
  plan: "Monthly" | "Yearly";
  selected: boolean;
  setPlan: React.Dispatch<"Monthly" | "Yearly">;
}) => {
  const scale = useSharedValue(1);
  const color = useSharedValue(1);

  const scaleStyles = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });
  const colorStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: props.selected
        ? "#FCFCFC"
        : interpolateColor(
            color.value,
            [1, 2],
            ["rgba(4,150,255,0.1)", "rgba(4,150,255,0.25)"],
          ),
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { stiffness: 300 });
    color.value = withSpring(1);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 300 });
    color.value = withSpring(0);
  };

  const opposite =
    props.plan === "Monthly"
      ? "Yearly"
      : props.plan === "Yearly"
        ? "Monthly"
        : undefined;

  return (
    <Animated.View
      className="mx-4 mt-2 h-[75px] rounded-lg border border-[#0496FF]/10"
      style={[scaleStyles, colorStyles]}
    >
      <Pressable
        onPress={() => props.setPlan(opposite!)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text
          className={`ml-2 mt-2 text-xl font-semibold tracking-tight ${
            props.selected ? null : "text-[#0496FF]"
          }`}
        >
          {props.plan == "Yearly" ? "Yearly" : "Monthly"}
        </Text>
        <Text
          className={`ml-2 mt-0.5 text-lg tracking-tight ${
            props.selected ? null : "text-[#0496FF]"
          }`}
        >
          {props.plan == "Yearly" ? "$5.99 a month" : "$7.99 a month"}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
