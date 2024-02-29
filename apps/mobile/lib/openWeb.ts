import * as WebBrowser from "expo-web-browser";
import { WebBrowserPresentationStyle } from "expo-web-browser";

export const openWeb = async (url: string) => {
  try {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowserPresentationStyle.FULL_SCREEN,
    });
  } catch {
    // Just prevent it from stoping the JS thread
  }
};
