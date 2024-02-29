import { SharedTransition, withSpring } from "react-native-reanimated";

export const transition = SharedTransition.custom((values) => {
  "worklet";
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
  };
});
