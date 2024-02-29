import type { View as RegularView } from "react-native";

/* eslint-disable @typescript-eslint/no-var-requires */
const NativeView =
  require("react-native/Libraries/Components/View/ViewNativeComponent").default;

type NativeViewProps = RegularView["props"] & { className?: string };

export const View = (props: NativeViewProps) => <NativeView {...props} />;
