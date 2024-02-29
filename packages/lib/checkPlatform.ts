export const checkPlatform = () => {
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    return "mobile";
  } else {
    return "web";
  }
};
