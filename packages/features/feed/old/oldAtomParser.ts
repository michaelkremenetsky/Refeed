import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { XMLParser } from "fast-xml-parser";

import { isString } from "@refeed/lib/isString";

// This is an older parser and is not in use for now

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

dayjs.extend(utc);

const options = {
  ignoreAttributes: false,
  preserveOrder: false,
};
const parser = new XMLParser(options);

interface Feed {
  title: string;
  description: string;
  link: string;
  updated?: Date;
  FeedType: "rss" | "atom";
  entries: Entry[];
}

interface Entry {
  title: string;
  link: string;
  updated: Date;
  content: string;
}

function extractHref(link: any): string | undefined {
  return link?.["@_href"];
}

function isValidLink(href: string | undefined): boolean {
  const invalidEndings = [".xml", "/atom.xml", "/feed", "/refresh"];
  return href ? !invalidEndings.some((ending) => href.endsWith(ending)) : false;
}

function getLink(result: any): string | undefined {
  if (typeof result.feed.link === "object") {
    const links = Array.isArray(result.feed.link)
      ? result.feed.link
      : [result.feed.link];
    return links.map(extractHref).find(isValidLink);
  }
  return result.feed.link?.href || result.feed.link?.["@_href"];
}

function parseEntry(entry: any): Entry {
  const link = isString(entry.link)
    ? entry.link
    : entry.link
        ?.map((link: any) =>
          link?.["@_type"] === "text/html" ? link?.["@_href"] : undefined,
        )
        .find((link: any) => link != undefined);

  return {
    title: isString(entry.title) ? entry.title : entry.title["#text"],
    link,
    content: isString(entry.content)
      ? entry.content
      : entry?.content?.["#text"] || "",
    updated: dayjs(isString(entry.updated) ? entry.updated : undefined)
      .utc()
      .toDate(),
  };
}

export function parseAtomFeed(xml: string): Feed {
  const result = parser.parse(xml);
  const link = getLink(result);

  if (!isString(result.feed.title)) {
    throw new Error("Invalid Feed Title");
  }

  if (!link) {
    throw new Error("Link is undefined");
  }

  const feed: Feed = {
    title: result.feed.title,
    description: result.feed.subtitle || "",
    link: link,
    updated: dayjs(
      isString(result.feed.updated) ? result.feed.updated : undefined,
    )
      .utc()
      .toDate(),
    FeedType: "atom",
    entries: [],
  };

  if (link && result.feed.entry) {
    const entries = Array.isArray(result.feed.entry)
      ? result.feed.entry
      : [result.feed.entry];
    feed.entries = entries.map(parseEntry);
  }

  return feed;
}
