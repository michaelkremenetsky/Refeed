export const getIcon = async (link: string) => {
  let icon = link + "/favicon.ico";

  try {
    try {
      const response = await fetch(icon, { method: "HEAD" });
      if (!response.ok) {
        throw Error;
      }

      const contentType = response.headers.get("Content-Type");
      const contentLength = parseInt(
        response.headers.get("Content-Length")!,
        10,
      );

      if (!contentType?.startsWith("image/")) {
        throw Error;
      }

      if (contentLength && contentLength < 2048) {
        // If Size less than 2KB than their probably isn't anything
        throw Error;
      }
    } catch {
      // Get the base URL
      const newUrl = new URL(link);
      const base = newUrl.origin;

      // Check that
      const response = await fetch(base, { method: "HEAD" });
      if (!response.ok) {
        throw Error;
      }

      const contentType = response.headers.get("Content-Type");
      const contentLength = parseInt(
        response.headers.get("Content-Length")!,
        10,
      );

      if (!contentType?.startsWith("image/")) {
        throw Error;
      }

      if (contentLength && contentLength < 2048) {
        // If Size less than 2KB than their probably isn't anything
        throw Error;
      }
    }
  } catch {
    // Fetch from google as fallback since its usually lower quality
    icon = "https://s2.googleusercontent.com/s2/favicons?domain=" + link;
  }

  return icon;
};
