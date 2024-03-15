import crypto from "crypto";
import type { item } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Parser from "rss-parser";

import { checkLinkValid } from "@refeed/lib/checkLinkValid";

import { fetchFeed } from "./fetchFeed";

dayjs.extend(utc);

export interface Feed {
  title: string;
  description: string;
  link: string;
  updated?: Date;
  FeedType: "rss" | "atom";
  items: Item[];
}

export interface Item {
  title: string;
  link: string;
  updated: Date;
  content: string;
}

interface filteredItemsType {
  link: string;
  items: {
    title?: string;
    link?: string;
    updated: Date;
    content?: string;
  }[];
  title: undefined;
}

export const getFeed = async (params: {
  url: string;
  feedId: string;
  existing_items?: item[];
  eTag?: string | null;
  last_crawled?: Date;
  last_crawl_hash?: string | undefined;
}) => {
  try {
    const base_url = new URL(params.url).host;

    const { text, etag } = await fetchFeed({
      url: params.url,
      eTag: params.eTag,
      last_crawled: params.last_crawled,
    });

    if (text.length == 0) {
      throw new Error(`XML is undefined`);
    }

    const parser = new Parser();

    const feed = await parser.parseString(text);

    if (feed == undefined) {
      throw new Error("Issue with parsing");
    }

    const filteredItems = feed;

    filteredItems.items = filteredItems.items.map((item) => {
      return {
        link: checkLinkValid(item.link, base_url),
        items: item.items,
        title: item.title,
        content: item.content,
      };
    });

    const new_last_crawl_hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(feed.items))
      .digest("hex");

    if (params.last_crawl_hash) {
      if (params.last_crawl_hash == new_last_crawl_hash) {
        filteredItems.items = [];
      }
    }

    filteredItems.items = filteredItems.items.map((item) => {
      const updated = dayjs(item.pubDate).utc().toDate();

      const { title, link, content } = item;

      return {
        title: title,
        link: link,
        content: content,
        updated: updated ?? dayjs().utc().toDate(),
      };
    });

    // It shouldn't get more than 10 items for now
    if (filteredItems.items.length > 10) {
      filteredItems.items = filteredItems.items.slice(0, 10);
    }

    return {
      id: params.feedId,
      updated: dayjs().utc().toDate(),
      last_crawl_hash: new_last_crawl_hash,
      etag: etag ? etag.toString() : undefined,
      feedUrl: params.url,
      ...(filteredItems as filteredItemsType),
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message != "XML is undefined") {
        console.log(error);
      }
    }
    return {
      id: params.feedId,
      feedUrl: params.url,
      updated: dayjs().utc().toDate(),
      items: [],
      etag: undefined,
      last_crawl_hash: undefined,
      title: undefined,
    };
  }
};
