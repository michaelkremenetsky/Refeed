import Spinner from "react-native-loading-spinner-overlay";

import { useLoading } from "./LoadingContext";
import { SpinningCircle } from "./SpinningCircle";

export const SpinnerOverlay = () => {
  const { isLoading } = useLoading();

  return (
    isLoading && (
      <Spinner
        visible={isLoading}
        customIndicator={<SpinningCircle />}
        textStyle={{ color: "#FFF" }}
      />
    )
  );
};
