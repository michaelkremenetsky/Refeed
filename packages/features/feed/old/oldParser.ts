// @ts-nocheck
/* eslint-disable */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { XMLParser } from "fast-xml-parser";

// This is an older parser and is not in use for now

import type { Entry, Feed } from "../getFeed";

dayjs.extend(utc);

const options = {
  ignoreAttributes: false,
  preserveOrder: false,
};
const parser = new XMLParser(options);

function detectFeedType(text: string): "atom" | "rss" | "undetermined" {
  if (text) {
    let feed;
    try {
      feed = parser.parse(text);
    } catch (err) {
      return "undetermined";
    }

    if (feed.feed) {
      return "atom";
    }

    if (feed.rss) {
      return "rss";
    }

    if (feed.channel) {
      return "rss";
    }

    if (feed.entry) {
      return "atom";
    }

    return "undetermined";
  }
  return "undetermined";
}

const isIterable = (object: any) =>
  object != null && typeof object[Symbol.iterator] === "function";

function parseAtomFeed(xml: string) {
  const result = parser.parse(xml);

  let link;

  // Get the non-feed link
  if (typeof result.feed.link == "object") {
    if (result.feed.link?.["@_href"]) {
      if (
        !result.feed.link?.["@_href"].endsWith(".xml") ||
        !result.feed.link?.["@_href"].endsWith("/atom.xml") ||
        !result.feed.link?.["@_href"].endsWith("/feed") ||
        !result.feed.link?.["@_href"].endsWith("/refresh")
      ) {
        link = result.feed.link?.["@_href"];
      }
    } else {
      result.feed.link?.forEach((x: any) => {
        if (x?.["@_href"]) {
          if (
            !x?.["@_href"].endsWith(".xml") ||
            !x?.["@_href"].endsWith("/atom.xml") ||
            !x?.["@_href"].endsWith("/feed") ||
            !x?.["@_href"].endsWith("/refresh")
          ) {
            link = x?.["@_href"];
          }
        }
      });
    }
  } else {
    link = result.feed.link?.href || result.feed.link?.["@_href"];
  }

  const feed: Feed = {
    title:
      typeof result.feed.title == "string"
        ? result.feed.title
        : result.feed.title["#text"],
    description: result.feed.subtitle ?? "",
    link: link,
    updated: dayjs(
      typeof result.feed.updated == "string" ? result.feed.updated : undefined,
    )
      .utc()
      .toDate(),
    FeedType: "atom",
    entries: [],
  };

  if (link != undefined && result.feed.link != undefined) {
    if (result.feed.entry) {
      if (isIterable(result.feed.entry)) {
        for (const entry of result.feed.entry) {
          const item: Entry = {
            title:
              typeof entry.title == "string"
                ? entry.title
                : entry.title["#text"],
            link:
              typeof entry.link == "string"
                ? entry.link
                : typeof entry.link?.["@_href"] == "string"
                  ? entry.link?.["@_href"]
                  : entry.link
                      .map((link: any) => {
                        if (link?.["@_type"] == "text/html") {
                          return link?.["@_href"];
                        }
                      })
                      .filter(
                        (link: string | undefined) => link != undefined,
                      )[0],
            content:
              typeof entry.content == "string"
                ? entry.content
                : typeof entry?.content?.["#text"] == "string"
                  ? entry.content["#text"]
                  : "",
            updated: dayjs(
              typeof entry.updated == "string" ? entry.updated : undefined,
            )
              .utc()
              .toDate(),
          };

          feed.entries.push(item);
        }
      } else {
        const item: Entry = {
          title:
            typeof result.feed.entry.title == "string"
              ? result.feed.entry.title
              : result.feed.entry.title["#text"],
          link:
            typeof result.feed.entry.link == "string"
              ? result.feed.entry.link
              : typeof result.feed.entry.link?.["@_href"] == "string"
                ? result.feed.entry.link?.["@_href"]
                : result.feed.entry.link
                    .map((link: any) => {
                      if (link?.["@_type"] == "text/html") {
                        return link?.["@_href"];
                      }
                    })
                    .filter((link: string | undefined) => link != undefined)[0],
          updated: dayjs(
            typeof result.feed.entry.updated == "string"
              ? result.feed.entry.updated
              : undefined,
          )
            .utc()
            .toDate(),
          content:
            typeof result.feed.entry.content == "string"
              ? result.feed.entry.content
              : typeof result.feed.entry.content["#text"] == "string"
                ? result.feed.entry.content["#text"]
                : "",
        };

        feed.entries.push(item);
      }
    }
  }

  if (typeof feed.title != "string") {
    throw new Error("Invalid Feed Title");
  }

  return feed;
}

function parseRSSFeed(xml: string) {
  const result = parser.parse(xml);

  let link = result.rss.channel?.link || result.rss.channel?.link?.href;

  if (link) {
    if (link.length <= 4) {
      link = undefined;
    }
  }

  const feed: Feed = {
    title: result.rss.channel?.title,
    link: link,
    FeedType: "rss",
    updated: dayjs(
      typeof result.rss.channel?.lastBuildDate == "string"
        ? result.rss.channel?.lastBuildDate
        : undefined,
    )
      .utc()
      .toDate(),
    description: result.rss.channel?.description,
    entries: [],
  };

  const isIterable = (object: typeof result) =>
    object != null && typeof object[Symbol.iterator] === "function";

  if (result.rss.channel?.item && link) {
    try {
      if (isIterable(result.rss.channel?.item))
        for (const item of result.rss.channel?.item ?? undefined) {
          const entry: Entry = {
            title: item.title,
            link: item.link,
            content: item.description ?? "",
            updated: dayjs(
              typeof item.pubDate == "string" ? item.pubDate : undefined,
            )
              .utc()
              .toDate(),
          };

          try {
            entry.link = new URL(entry.link, link).href;
          } catch {
            entry.link = new URL(entry.link, link.slice(1)).href;
          }

          feed.entries.push(entry);
        }
      else {
        const entry: Entry = {
          title: result.rss.channel?.item.title,
          link: result.rss.channel?.item.link,
          updated: dayjs(
            typeof result.rss.channel?.item.pubDate == "string"
              ? result.rss.channel?.item.pubDate
              : undefined,
          )
            .utc()
            .toDate(),
          content:
            typeof result.rss.channel?.item.content == "string"
              ? result.rss.channel?.item.content
              : typeof result.rss.channel?.item.description == "string"
                ? result.rss.channel?.item.description
                : "",
        };

        feed.entries.push(entry);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return feed;
}

export function parseFeed(xml: string) {
  const type = detectFeedType(xml);

  if (type === "atom") {
    return parseAtomFeed(xml);
  } else if (type === "rss") {
    return parseRSSFeed(xml);
  } else if (type === "undetermined") {
    return undefined;
  }
}
