import { isValidHttpUrl } from "@refeed/lib/isValidUrl";

import { parseStaticContent } from "./parseStaticContent";

// Left here in case we need to do some feed parsing on the frontend
// Not in use for now

export const getImageLink = (
  rawHtml: string,
  purifiedHtml: string,
  baseUrl: string,
) => {
  // 1. First we check if it has an OG Image (in parseStaticContent)
  // 2. Then we check if the image can be found in the static html
  // 3. If no image link is found in the static content, we use Puppeteer to check the dynamic html

  const imageLink = parseStaticContent(rawHtml, purifiedHtml, baseUrl);

  // Disabled for now
  // if (!imageLink) {
  //   imageLink = await parseDynamicContent(fullLink, baseUrl, browserEndPoint);
  // }

  if (imageLink && !isValidHttpUrl(imageLink)) {
    throw new Error(`Not a valid link: ${imageLink}`);
  }

  return imageLink;
};
