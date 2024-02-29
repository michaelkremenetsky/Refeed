import { toHttps } from "./toHttps";

export const checkURL = (url: string) => {
  try {
    const base_url = new URL(url).host;

    if (!base_url) {
      throw new Error("No base URL");
      // Effect.fail("No base URL");
    }

    // Check if link is https and if not make it.
    const full_link = toHttps(url);

    return { base_url, full_link };
  } catch (err) {
    // Effect.fail("Issue parsing URLs");
    throw new Error("Issue parsing URLs");
  }
};
