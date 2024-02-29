import parse from "node-html-parser";

import { isValidHttpUrl } from "@refeed/lib/isValidUrl";

// Left here in case we need to do some feed parsing on the frontend
// Not in use for now

export const parseStaticContent = (
  rawHtml: string,
  purifiedHtml: string,
  baseUrl: string,
) => {
  const rawDom = parse(rawHtml);
  const dom = parse(purifiedHtml);

  // First, we check it the site has a Open Graph image
  const ogImage = rawDom
    .querySelector('meta[property="og:image"]')
    ?.getAttribute("content");

  if (ogImage) {
    const fullOgImageUrl = isValidHttpUrl(ogImage)
      ? ogImage
      : `https://${baseUrl}${ogImage}`;

    // Not file type here since the OG imags sometimes don't have a file type
    return fullOgImageUrl;
  }

  // If no OG image or not valid, search for <img> tags
  const imageTags = dom.querySelectorAll(
    'img[src$=".jpg"], img[src$=".png"], img[src$=".jpeg"], img[src$=".webp"], img[src$=".avif"]',
  );

  for (const image of imageTags) {
    let src = image.getAttribute("src");
    if (src) {
      src = isValidHttpUrl(src) ? src : `https://${baseUrl}${src}`;
      if (/\.(jpg|jpeg|png|webp|avif)$/.test(src)) {
        return src;
      }
    }
  }

  return undefined;
};
