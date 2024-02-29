import { request } from "undici";

export const fetchFeed = async (params: {
  url: string;
  eTag?: string | null;
  last_crawled?: Date;
}) => {
  const encodedURL = encodeURI(params.url);

  const feed = await request(encodedURL, {
    bodyTimeout: 5000,
    headersTimeout: 5000,
    maxRedirections: 3,
    throwOnError: false,
    headers: {
      "If-Modified-Since": params.last_crawled?.toUTCString(),
      "If-None-Match": params.eTag ? params.eTag : undefined,
      "User-Agent": "Refeed Reader/v1 (+https://www.refeed.dev/)",
    },
  });

  return {
    text: await feed.body.text(),
    etag: feed.headers.etag,
  };
};
