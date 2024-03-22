import { NodeHtmlMarkdown } from "node-html-markdown";
import { z } from "zod";

import { Prisma } from "@refeed/db";
import { getFolderFeedIds } from "@refeed/features/feed/getFolderFeedIds";

import { getNextPrismaCursor } from "../../lib/getNextPrismaCursor";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { removeDuplicates } from "./utils/removeDuplicates";
import { transformItems } from "./utils/transformItems";

// Tip - use the VSCode Outline View feature to see the APIs defined in here without having to scroll through the file

export const itemRouter = createTRPCRouter({
  getUnreadItems: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        sort: z.enum(["Latest", "Oldest"]),
        type: z.enum([
          "all",
          "one",
          "recentlyread",
          "bookmarks",
          "multiple",
          "discover",
          "newsletters",
        ]),
        bookmark_folder: z.string().optional(),
        folder: z.string().optional(),
        feed_id: z.string().optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sharedQuery: Prisma.itemFindManyArgs = {
        take: input.amount,
        skip: input.cursor === undefined ? 0 : 1,
        cursor:
          input.cursor === undefined
            ? undefined
            : {
                id: input.cursor,
              },
        orderBy:
          input.type != "recentlyread" && input.type != "bookmarks"
            ? input.sort == "Latest"
              ? { id: Prisma.SortOrder.desc }
              : input.sort == "Oldest"
                ? { id: Prisma.SortOrder.asc }
                : undefined
            : { updated_at: Prisma.SortOrder.desc },
        include: {
          feed: {
            select: {
              title: true,
              logo_url: true,
              users: {
                select: {
                  date_added: true,
                  pagination_start_timestamp: true,
                },
                where: {
                  user_id: ctx.user.id,
                },
              },
            },
          },
          user_items:
            input.type == "recentlyread" ||
            input.type == "bookmarks" ||
            input.type == "newsletters"
              ? {
                  select: {
                    note: true,
                    marked_read: true,
                    in_read_later: true,
                    temp_added_time: true,
                    bookmark_folders: {
                      select: {
                        folder: true,
                      },
                    },
                    marked_read_time: true,
                  },
                }
              : undefined,
        },
      };
      if (input.type == "bookmarks") {
        const withBookmarkFolder = {
          bookmark_folders:
            input.bookmark_folder === undefined
              ? undefined
              : {
                  some: {
                    folder: {
                      name: input.bookmark_folder,
                    },
                  },
                },
          user_id: ctx.user.id,
        };

        const withoutBookmarkFolder = {
          OR: [
            {
              in_read_later: true,
            },
            {
              bookmark_folders: {
                some: {
                  user_id: ctx.user.id,
                },
              },
            },
          ],
          user_id: ctx.user.id,
        };

        const items = await ctx.prisma.user_item.findMany({
          where:
            input.bookmark_folder === undefined
              ? withoutBookmarkFolder
              : withBookmarkFolder,
          take: input.amount,
          skip: input.cursor === undefined ? 0 : 1,
          orderBy: {
            marked_read_time:
              input.sort == "Latest"
                ? Prisma.SortOrder.desc
                : input.sort == "Oldest"
                  ? Prisma.SortOrder.asc
                  : undefined,
          },
          cursor:
            input.cursor === undefined
              ? undefined
              : {
                  id: input.cursor,
                },
          include: {
            bookmark_folders: {
              select: {
                folder: true,
              },
            },
            item: {
              include: {
                feed: {
                  select: {
                    title: true,
                    logo_url: true,
                  },
                },
              },
            },
          },
        });

        // Convert use_item to ItemType
        const convertedItems = items.map((item) => {
          return {
            ...item.item,
            user_items: [
              {
                marked_read: item.marked_read,
                marked_read_time: item.marked_read_time,
                note: item.note,
                in_read_later: item.in_read_later,
                temp_added_time: item.temp_added_time,
                bookmark_folders: item.bookmark_folders,
              },
            ],
          };
        });

        const nextCursor = getNextPrismaCursor(items, input.amount);

        const transformedItems = transformItems(convertedItems);

        return {
          transformedItems,
          nextCursor,
        };
      }
      if (input.type == "recentlyread") {
        const items = await ctx.prisma.user_item.findMany({
          where: {
            // Check this to make sure its safe
            marked_read: true,
            marked_read_time: {
              gte: thirtyDaysAgo,
            },
            user_id: ctx.user.id,
            bookmark_folders:
              input.bookmark_folder === undefined
                ? undefined
                : {
                    some: {
                      folder: {
                        name: input.bookmark_folder,
                      },
                    },
                  },
          },
          take: input.amount,
          skip: input.cursor === undefined ? 0 : 1,
          orderBy: {
            marked_read_time:
              input.sort == "Latest"
                ? Prisma.SortOrder.desc
                : input.sort == "Oldest"
                  ? Prisma.SortOrder.asc
                  : undefined,
          },
          cursor:
            input.cursor === undefined
              ? undefined
              : {
                  id: input.cursor,
                },
          include: {
            bookmark_folders: {
              select: {
                folder: true,
              },
            },
            item: {
              include: {
                feed: {
                  select: {
                    title: true,
                    logo_url: true,
                  },
                },
              },
            },
          },
        });

        // Convert user_item to ItemType
        const convertedItems = items.map((item) => {
          return {
            ...item.item,
            user_items: [
              {
                marked_read: item.marked_read,
                marked_read_time: item.marked_read_time,
                note: item.note,
                in_read_later: item.in_read_later,
                temp_added_time: item.temp_added_time,
                bookmark_folders: item.bookmark_folders,
              },
            ],
          };
        });

        let transformedItems = transformItems(convertedItems);
        const nextCursor = getNextPrismaCursor(items, input.amount);

        transformedItems = removeDuplicates(
          transformedItems,
          ctx.user.id,
          ctx.prisma,
          false,
        );

        return {
          transformedItems,
          nextCursor,
        };
      }

      if (input.type == "discover") {
        const items = await ctx.prisma.item.findMany({
          where: {
            feed_id: input.feed_id,
            created_at: {
              gte: thirtyDaysAgo,
            },
            user_items: {
              none: {
                AND: [
                  {
                    marked_read: true,
                  },
                  {
                    user_id: ctx.user.id,
                  },
                ],
              },
            },
          },
          ...sharedQuery,
        });

        let transformedItems = transformItems(items);
        const nextCursor = getNextPrismaCursor(transformedItems, input.amount);

        transformedItems = removeDuplicates(
          transformedItems,
          ctx.user.id,
          ctx.prisma,
          false,
        );

        return {
          transformedItems,
          nextCursor,
        };
      }

      if (input.type == "all") {
        const items = await ctx.prisma.item.findMany({
          where: {
            created_at: {
              gte: thirtyDaysAgo,
            },

            feed: {
              // Make sure the user is subscribed to the feed
              users: {
                some: {
                  user_id: ctx.user.id,
                },
              },
            },
            user_items: {
              none: {
                AND: [
                  {
                    marked_read: true,
                  },
                  {
                    user_id: ctx.user.id,
                  },
                ],
              },
            },
          },
          ...sharedQuery,
        });

        // Loop through the items and make sure it starts at the pagination_start_timestamp
        const itemsAfterDate = items.filter((item) => {
          // @ts-ignore
          const feed_added = item.feed?.users[0]?.pagination_start_timestamp!;
          const item_added = item.created_at;

          if (input.sort == "Latest") {
            return feed_added <= item_added;
          } else if (input.sort == "Oldest") {
            return feed_added >= item_added;
          }
        });

        let transformedItems = transformItems(itemsAfterDate);
        const nextCursor = getNextPrismaCursor(transformedItems, input.amount);

        transformedItems = removeDuplicates(
          transformedItems,
          ctx.user.id,
          ctx.prisma,
          true,
        );

        return {
          transformedItems,
          nextCursor,
        };
      }

      if (input.type == "one" || input.type == "multiple") {
        console.log(input);

        const items = await ctx.prisma.item.findMany({
          where: {
            created_at: {
              gte: thirtyDaysAgo,
            },
            feed: {
              // Make sure the user is subscribed to the feed
              users: {
                some: {
                  user_id: ctx.user.id,
                },
              },
            },
            feed_id:
              // Multiple feeds
              input.type == "multiple"
                ? {
                    in: await getFolderFeedIds(
                      input.folder!,
                      ctx.user.id,
                      ctx.prisma,
                    ),
                  }
                : // Single feed
                  input.type == "one"
                  ? input.feed_id
                  : // All Feeds
                    undefined,
            user_items: {
              none: {
                AND: [
                  {
                    marked_read: true,
                  },
                  {
                    user_id: ctx.user.id,
                  },
                ],
              },
            },
          },
          ...sharedQuery,
        });

        // Loop through the items and make sure it starts at the pagination_start_timestamp
        const itemsAfterDate = items.filter((item) => {
          // @ts-ignore
          const feed_added = item.feed?.users[0]?.pagination_start_timestamp!;
          const item_added = item.created_at;

          if (input.sort == "Latest") {
            return feed_added <= item_added;
          } else if (input.sort == "Oldest") {
            return feed_added >= item_added;
          }
        });

        let transformedItems = transformItems(itemsAfterDate);
        const nextCursor = getNextPrismaCursor(transformedItems, input.amount);

        transformedItems = removeDuplicates(
          transformedItems,
          ctx.user.id,
          ctx.prisma,
          true,
        );

        return {
          transformedItems,
          nextCursor,
        };
      }
      if (input.type == "newsletters") {
        const items = await ctx.prisma.item.findMany({
          where: {
            from_newsletter: true,
          },
          ...sharedQuery,
        });

        let transformedItems = transformItems(items);
        const nextCursor = getNextPrismaCursor(transformedItems, input.amount);

        transformedItems = removeDuplicates(
          transformedItems,
          ctx.user.id,
          ctx.prisma,
          true,
        );

        return {
          transformedItems,
          nextCursor,
        };
      }

      // Add the check for Plan later
      //       // Check plan limits
      //       if (plan == "free") {
      //         if (items.length > 1000) {
      //           setHasMore(false);
      //         }
      //       }
      //       if (plan == "pro") {
      //         if (items.length > 5000) {
      //           setHasMore(false);
      //         }
      //       }
    }),
  searchMultipleItems: protectedProcedure
    .input(
      z.object({
        query: z.union([z.string(), z.undefined()]),
        plan: z.enum(["free", "pro"]),
        take: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchItems = await ctx.prisma.item.findMany({
        where: {
          title: {
            // I would prefer to use search but prisma dosen't support indexes on it yet:
            // https://github.com/prisma/prisma/issues/8950
            contains: input.query,
            mode: "insensitive",
          },
          website_content:
            input.plan == "free"
              ? undefined
              : {
                  // I would prefer to use search but prisma dosen't support indexes on it yet:
                  // https://github.com/prisma/prisma/issues/8950
                  contains: input.query,
                  mode: "insensitive",
                },
          feed: {
            users: {
              some: {
                user_id: ctx.user.id,
              },
            },
          },
        },
        include: {
          feed: {
            select: {
              title: true,
            },
          },
        },
        take: input.take,
      });

      // Loop through the items and transform the website_content to markdown
      for (const item of searchItems) {
        item.website_content = NodeHtmlMarkdown.translate(
          item.website_content ?? "",
        );

        // Temporarily add the feed_title to the item
        // @ts-ignore
        item.feed_title = item.feed.title;
      }

      return searchItems;
    }),
  // Formatted like the unreadItems
  searchMultipleItemsWithFormatting: protectedProcedure
    .input(
      z.object({
        query: z.union([z.string(), z.undefined()]),
        take: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // I think their a better way to do this
      const searchItems = await ctx.prisma.item.findMany({
        where: {
          title: {
            // I would prefer to use search but prisma dosen't support indexes on it yet:
            // https://github.com/prisma/prisma/issues/8950
            contains: input.query,
            mode: "insensitive",
          },
          feed: {
            users: {
              some: {
                user_id: ctx.user.id,
              },
            },
          },
        },
        take: input.take,
        include: {
          feed: {
            select: {
              title: true,
            },
          },
        },
      });

      // Flatten the feed_title into the item
      const transformedItems = searchItems.map((item) => {
        return {
          ...item,
          feed_title: item.feed?.title,
        };
      });

      return transformedItems;
    }),
});
