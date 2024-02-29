export function shortenURL(url: string) {
  try {
    const parsedURL = new URL(url);
    let hostname = parsedURL.hostname;

    // Remove 'www.' if present
    if (hostname.startsWith("www.")) {
      hostname = hostname.substring(4);
    }

    return hostname;
  } catch (error) {
    console.error("Invalid URL:", url);
    return null;
  }
}
