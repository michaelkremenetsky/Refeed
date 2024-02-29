import { request } from "undici";

export const fetchHtml = async (link: string) => {
  const feed = await request(link, {
    bodyTimeout: 5000,
    headersTimeout: 5000,
    maxRedirections: 3,
    throwOnError: false,
    headers: {
      "User-Agent": "Refeed Reader/v1 (+https://www.refeed.dev/)",
    },
  });

  try {
    return await feed.body.text();
  } catch (error) {
    throw new Error("Fetch failed on: " + link);
  }
};
