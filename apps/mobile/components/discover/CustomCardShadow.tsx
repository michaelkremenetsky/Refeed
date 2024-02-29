import type { ReactNode } from "react";
import { ShadowedView } from "react-native-fast-shadow";

export const CustomCardShadow = ({ children }: { children: ReactNode }) => (
  <ShadowedView
    style={{
      shadowColor: "#242a42",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.08,
      shadowRadius: 70,
      backgroundColor: "transparent",
    }}
  >
    {children}
  </ShadowedView>
);
