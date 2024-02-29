import type { feed } from "@prisma/client";

import type { Opml } from "../types/opml";

export type formatedOPMLType = feed[];

export const formatOPML = (OPML: Opml) => {
  const feeds: feed[] = [];

  // Different OPML files are structured diffrently
  OPML.body.outline?.forEach((feed) => {
    if (feed.outlines) {
      feed.outlines?.forEach((feed) => {
        feeds.push(feed as unknown as feed);
      });
    } else {
      feeds.push(feed as unknown as feed);
    }
  });

  return feeds;
};
