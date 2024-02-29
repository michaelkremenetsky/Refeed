import type { PrismaClient } from "@prisma/client";
import { NodeHtmlMarkdown } from "node-html-markdown";

import type { ItemType } from "@refeed/types/item";

import { findFolderById } from "./findFolderById";

/* eslint-disable @typescript-eslint/no-unsafe-call */

type TODO = any;

export const transformItemsWithoutUserItems = (rawItems: TODO) => {
  const transformedItems: ItemType[] = [];

  for (const rawItem of rawItems) {
    if (rawItem) {
      const contentMarkdown = NodeHtmlMarkdown.translate(
        rawItem.website_content ?? "",
      );

      const transformedItem: ItemType = {
        id: rawItem.id,
        readibility_score: rawItem.readibility_score,
        content_length: rawItem.content_length,
        created_at: rawItem.created_at,
        feed_id: rawItem.feed_id,
        image_url: rawItem.image_url,
        title: rawItem.title,
        updated_at: rawItem.updated_at,
        url: rawItem.url,
        website_content: contentMarkdown,
        marked_read: false,
        in_read_later: false,
        marked_read_time: undefined,
        temp_added_time: undefined,
        bookmark_folders: [],
        feed_title: rawItem.feed.title,
        note: undefined,
        logo_url: rawItem.feed.logo_url,
        from_search: false,
      };

      transformedItems.push(transformedItem);
    }
  }

  return transformedItems;
};

export const transformItems = async (
  rawItems: TODO,
  prisma: PrismaClient,
  bookmarks?: boolean,
) => {
  const transformedItems: ItemType[] = [];

  for (const rawItem of rawItems) {
    if (rawItem) {
      let bookmarkFolders: string[] | undefined = [];

      // @ts-ignore
      const promises = rawItem.user_items[0]?.bookmark_folders.map((folder) =>
        findFolderById(prisma, folder.folder_id),
      );
      if (promises) {
        bookmarkFolders = (await Promise.all(promises)) as string[];
      }

      const contentMarkdown = NodeHtmlMarkdown.translate(
        rawItem.website_content ?? "",
      );

      // To prevent items from being returned if they are not in bookmarks
      if (
        bookmarks &&
        rawItem.user_items[0]?.in_read_later == false &&
        bookmarkFolders.length == 0
      ) {
        continue;
      }

      const transformedItem: ItemType = {
        id: rawItem.id,
        readibility_score: rawItem.readibility_score,
        content_length: rawItem.content_length,
        created_at: rawItem.created_at,
        feed_id: rawItem.feed_id,
        image_url: rawItem.image_url,
        title: rawItem.title,
        updated_at: rawItem.updated_at,
        url: rawItem.url,
        website_content: contentMarkdown,
        marked_read: rawItem.user_items[0]?.marked_read ?? false,
        in_read_later: rawItem.user_items[0]?.in_read_later ?? false,
        marked_read_time: rawItem.user_items[0]?.marked_read_time ?? null,
        temp_added_time: rawItem.user_items[0]?.temp_added_time ?? null,
        bookmark_folders: bookmarkFolders,
        feed_title: rawItem.feed.title,
        note: rawItem.user_items[0]?.note,
        logo_url: rawItem.feed.logo_url,
        from_search: false,
      };

      transformedItems.push(transformedItem);
    }
  }

  return transformedItems;
};
