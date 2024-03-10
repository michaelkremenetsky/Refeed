import { NodeHtmlMarkdown } from "node-html-markdown";

import type { ItemType } from "@refeed/types/item";

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

export const transformItems = async (rawItems: TODO) => {
  const transformedItems: ItemType[] = [];

  for (const rawItem of rawItems) {
    if (rawItem) {
      let bookmarkFolders: string[] | undefined = [];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      bookmarkFolders = rawItem.user_items[0]?.bookmark_folders.map(
        (folder: {
          folder: {
            name: string;
          };
        }) => folder.folder.name,
      );

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
