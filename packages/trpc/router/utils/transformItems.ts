import { NodeHtmlMarkdown } from "node-html-markdown";

import type { ItemType } from "@refeed/types/item";

type TODO = any;

export const transformItems = (rawItems: TODO) => {
  const transformedItems: ItemType[] = [];

  for (const rawItem of rawItems) {
    if (rawItem) {
      const contentMarkdown = NodeHtmlMarkdown.translate(
        rawItem.website_content ?? "",
      );
      let bookmarkFolders: string[] | undefined = [];

      if (rawItem.user_items) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        bookmarkFolders = rawItem.user_items[0]?.bookmark_folders.map(
          (folder: {
            folder: {
              name: string;
            };
          }) => folder.folder.name,
        );
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
        website_content: rawItem.from_newsletter
          ? rawItem.website_content
          : contentMarkdown,
        marked_read: rawItem.user_items
          ? rawItem.user_items[0]?.marked_read ?? false
          : false,
        in_read_later: rawItem.user_items
          ? rawItem.user_items[0]?.in_read_later ?? false
          : false,
        marked_read_time: rawItem.user_items
          ? rawItem.user_items[0]?.marked_read_time ?? null
          : false,
        temp_added_time: rawItem.user_items
          ? rawItem.user_items[0]?.temp_added_time ?? null
          : null,
        bookmark_folders: bookmarkFolders,
        feed_title: rawItem.feed ? rawItem.feed.title : undefined,
        note: rawItem.user_items ? rawItem.user_items[0]?.note : null,
        logo_url: rawItem.feed ? rawItem.feed.logo_url : null,
        from_search: false,
      };

      transformedItems.push(transformedItem);
    }
  }

  return transformedItems;
};
