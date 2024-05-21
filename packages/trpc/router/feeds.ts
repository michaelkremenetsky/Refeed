import { TRPCError } from "@trpc/server";
import { Innertube } from "youtubei.js";
import { z } from "zod";

import { addFeedToUser } from "@refeed/features/discovery/addFeedToUser";
import { getFeed } from "@refeed/features/feed/getFeed";
import { setFeedOrder } from "@refeed/features/feed/setFeedOrder";
import { getPlan } from "@refeed/features/payment/checkPlan";
import { toHttps } from "@refeed/lib/toHttps";

import { addFeed } from "../../features/feed/addFeed";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// Tip - use the VSCode Outline View feature to see the APIs defined in here without having to scroll through the file

export const feedRouter = createTRPCRouter({
  getFeedsInFolders: protectedProcedure.query(async ({ ctx }) => {
    // Eventually when creating the API add a option to not sort it right at the api level so third party apps can sort it themselves if they would like.

    const plan = await getPlan(ctx.user.id, ctx.prisma);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Returns all the feeds in their folders with item counts of items that are not marked read
    const feedQuery = ctx.prisma.feed.findMany({
      where: {
        users: {
          some: {
            user_id: ctx.user.id,
          },
        },
      },
      include: {
        users: {
          select: {
            feed_id: true,
            date_added: true,
            pagination_start_timestamp: true,
          },
          where: {
            user_id: ctx.user.id,
          },
        },
        items: {
          where: {
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
            created_at: {
              gte: thirtyDaysAgo,
            },
          },
          select: {
            created_at: true,
          },
        },
        // What we are trying to do is get the count of all the items added after pagination_start_timestamp
        // with a max limit of 1000 items or 30 days
      },
      // This helps bring it down but it is still take 100ms+ right now.
      // Only way to speed up this query is by going raw. Which won't be to bad
      // but thats for another day
      relationLoadStrategy: "query",
      take: plan == "free" ? 150 : 1000,
    });

    // Get the feed order and if it isn't their create one
    const orderQuery = ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        feed_order: true,
      },
    });

    const [query, order] = await Promise.all([feedQuery, orderQuery]);

    if (!JSON.parse(order?.feed_order as string)) {
      await setFeedOrder([], ctx);
    }

    const parsed: {
      folder_name: string;
      order: number;
      folded: boolean;
      children?: {
        feedId: string;
        order: number;
      }[];
    }[] = JSON.parse(order?.feed_order as string);

    const feeds = query.map((feed) => {
      const { items, ...rest } = feed;

      // Loop through the items and make sure it starts at the pagination_start_timestamp
      const itemsAfterDate = items.filter((item) => {
        const feed_added = feed.users[0]?.pagination_start_timestamp;
        const item_added = item.created_at;

        return feed_added! <= item_added;
      });

      return { ...rest, amount: itemsAfterDate.length };
    });

    const folderFeeds: (
      | {
          id: string;
          name: string;
          folded: boolean;
          children?: undefined;
        }
      | {
          id: string;
          name: string;
          folded: boolean;
          children: {
            id: string;
            name: string;
            amount: number;
            summary: string;
            feed_url: string;
            logo_url: string;
            date_added: Date;
          }[];
        }
    )[] = [];

    parsed.forEach((folder, x) => {
      folderFeeds.push({
        id: folder.folder_name,
        name: folder.folder_name,
        folded: folder?.folded,
        children: [],
      });

      // Loop over the feeds add at the ones that belong to the folder
      folder.children?.forEach((children) => {
        const match = feeds.find((feed) => feed.id == children.feedId);

        if (match) {
          folderFeeds[x]?.children?.push({
            id: match?.id,
            name: match?.title,
            amount: match?.amount,
            summary: match?.summary!,
            feed_url: match?.feed_url,
            logo_url: match?.logo_url!,
            date_added: match?.users[0]?.date_added!,
          });
        }
      });
    });

    // Add Empty Folders
    parsed.forEach((folder) => {
      const folderIndex = folderFeeds.findIndex(
        (item) => item.name == folder.folder_name,
      );
      if (folderIndex == -1) {
        folderFeeds.push({
          id: folder.folder_name,
          name: folder.folder_name,
          folded: true,
          children: [],
        });
      }
    });

    // Sort the folders based on the order
    folderFeeds.sort((a, b) => {
      const orderA =
        parsed.find((folder) => folder.folder_name == a.name)?.order ?? 0;
      const orderB =
        parsed.find((folder) => folder.folder_name == b.name)?.order ?? 0;
      return orderA - orderB;
    });

    // Sort the feeds in each folder based on the order
    folderFeeds.forEach((folder) => {
      const correspondingParseFolder = parsed.find(
        (parsed_folder) => parsed_folder.folder_name == folder.name,
      );
      if (correspondingParseFolder?.children) {
        folder.children?.sort((a, b) => {
          const orderA =
            correspondingParseFolder?.children?.find(
              (child) => child.feedId == a.id,
            )?.order ?? 0;
          const orderB =
            correspondingParseFolder?.children?.find(
              (child) => child.feedId == b.id,
            )?.order ?? 0;
          return orderA - orderB;
        });
      }
    });

    return folderFeeds;
  }),
  setFeedOrder: protectedProcedure
    .input(
      z.object({
        feedOrder: z.array(
          z.object({
            folder_name: z.string(),
            order: z.number(),
            folded: z.boolean(),
            children: z
              .array(
                z.object({
                  order: z.number(),
                  feedId: z.string(),
                }),
              )
              .optional(),
          }),
        ),
      }),
    )
    .mutation(({ ctx, input }) => {
      setFeedOrder(input.feedOrder, ctx);
    }),
  removeUserFeed: protectedProcedure
    .input(z.object({ feedId: z.union([z.string(), z.array(z.string())]) }))
    .mutation(async ({ ctx, input }) => {
      const feedIds = Array.isArray(input.feedId)
        ? input.feedId
        : [input.feedId];

      await ctx.prisma.user_feeds.deleteMany({
        where: {
          feed_id: {
            in: feedIds,
          },
          user_id: ctx.user.id,
        },
      });

      // Update the feed_order
      const order = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.user.id,
        },
        select: {
          feed_order: true,
        },
      });

      const parsed: {
        folder_name: string;
        order: number;
        folded: boolean;
        children?: {
          feedId: string;
          order: number;
        }[];
      }[] = JSON.parse(order?.feed_order as string);

      // Remove the feeds from the feed_order
      parsed.forEach((folder) => {
        if (folder.children) {
          const index = folder.children.findIndex((child) =>
            input.feedId.includes(child.feedId),
          );
          if (index != -1) {
            folder.children.splice(index, 1);
          }
        }
      });

      // Update the feed_order
      await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          feed_order: JSON.stringify(parsed),
        },
      });
    }),
  removeFolder: protectedProcedure
    .input(z.object({ folderName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Fetch the feed_order and get all the feeds in the folder
      const order = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.user.id,
        },
        select: {
          feed_order: true,
        },
      });

      const parsed: {
        folder_name: string;
        order: number;
        folded: boolean;
        children?: {
          feedId: string;
          order: number;
        }[];
      }[] = JSON.parse(order?.feed_order as string);

      const folderIndex = parsed.findIndex(
        (item) => item.folder_name == input.folderName,
      );

      const folder = parsed[folderIndex];

      // Remove the folder from the feed_order
      parsed.splice(folderIndex, 1);

      // Remove the feeds in the folder from the user
      await ctx.prisma.user_feeds.deleteMany({
        where: {
          user_id: ctx.user.id,
          feed_id: {
            in: folder?.children?.map((item) => item.feedId),
          },
        },
      });

      // Remove the folder from the feed_order
      await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          feed_order: JSON.stringify(parsed),
        },
      });
    }),
  addFeedToUserViaDiscovery: protectedProcedure
    .input(
      z.object({
        feed_url: z.string(),
        folder_name: z.string(),
        customTitle: z.union([z.string(), z.undefined()]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let feed_url = input.feed_url;

      // Get the Base URl
      const url = new URL(input.feed_url).hostname;

      if (
        (url == "www.youtube.com" || url == "youtube.com") &&
        !input.feed_url.includes("/feeds/")
      ) {
        // If its a youtube URL then turn it into a RSS Link
        const client = await Innertube.create();

        const channel = (await Promise.race([
          client.resolveURL(input.feed_url),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Timeout after 3 seconds")),
              3000,
            ),
          ),
        ])) as {
          payload: {
            browseId: string;
          };
        };

        feed_url =
          "https://www.youtube.com/feeds/videos.xml?channel_id=" +
          channel.payload.browseId;
      }

      // Check if the feed already exists and if dosen't add it
      let feed = await ctx.prisma.feed.findFirst({
        where: {
          feed_url: toHttps(feed_url),
        },
      });

      if (feed) {
        // Check if feed already exists on user
        const check = await ctx.prisma.feed.findFirst({
          where: {
            feed_url: toHttps(feed_url),
            users: {
              some: {
                user_id: ctx.user.id,
              },
            },
          },
        });

        if (check) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Feed already Exists on User",
          });
        }
      }

      if (!feed) {
        await addFeed(input.customTitle!, toHttps(feed_url), ctx.prisma);

        // Fetch again to get info
        feed = await ctx.prisma.feed.findFirst({
          where: {
            feed_url: toHttps(feed_url),
          },
        });

        // If its a new feed then refresh it
        const BACKEND_URL =
          process.env.REFEED_BACKEND_URL ?? "http://0.0.0.0:4050";

        await fetch(BACKEND_URL + "/refreshfeeds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ feed_ids: [feed?.id] }),
        });
      }

      if (!feed) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't fetch feed",
        });
      }

      if (feed?.title) {
        await addFeedToUser(
          feed?.title,
          ctx.user.id,
          ctx.prisma,
          input.folder_name,
        );
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't fetch feed title",
        });
      }

      return "Added";
    }),
  getAllUserFeeds: protectedProcedure.query(async ({ ctx }) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const query = await ctx.prisma.feed.findMany({
      where: {
        users: {
          some: {
            user_id: ctx.user.id,
          },
        },
      },
      select: {
        id: true,
        title: true,
        feed_url: true,
        logo_url: true,
        _count: {
          select: {
            items: {
              where: {
                created_at: {
                  gte: thirtyDaysAgo,
                },
              },
            },
          },
        },
      },
    });

    if (query == undefined) {
      return [];
    }

    // Convert _count to amount
    const feeds = query.map((feed) => {
      const { _count, logo_url, ...rest } = feed;
      if (logo_url) {
        return { ...rest, amount: _count.items, logo_url: logo_url };
      }
      return { ...rest, amount: _count.items, logo_url: "" };
    });

    return feeds;
  }),
  getFeedOrder: protectedProcedure.query(async ({ ctx }) => {
    const order = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        feed_order: true,
      },
    });

    if (!JSON.parse(order?.feed_order as string)) {
      await setFeedOrder([], ctx);
    }

    const parsed: {
      folder_name: string;
      order: number;
      folded: boolean;
      children?: {
        feedId: string;
        order: number;
      }[];
    }[] = JSON.parse(order?.feed_order as string);

    return parsed;
  }),
  getFeed: protectedProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      // Get the Base URl
      const url = new URL(input.url).hostname;

      if (
        (url == "www.youtube.com" || url == "youtube.com") &&
        !input.url.includes("/feeds/")
      ) {
        // If its a youtube URL then turn it into a RSS Link
        const client = await Innertube.create();

        try {
          const channel = (await Promise.race([
            client.resolveURL(input.url),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Timeout after 3 seconds")),
                3000,
              ),
            ),
          ])) as {
            payload: {
              browseId: string;
            };
          };

          const feed = await getFeed({
            url:
              "https://www.youtube.com/feeds/videos.xml?channel_id=" +
              channel.payload.browseId,
            feedId: "stub_id",
          });

          return feed;
        } catch {
          return undefined;
        }
      }

      const feed = await getFeed({
        url: input.url,
        feedId: "stub_id",
      });

      return feed;
    }),
  getDiscoveryFeedById: protectedProcedure
    .input(z.object({ feedId: z.string() }))
    .query(async ({ ctx, input }) => {
      // User must have access to the feed to view it for now, might change in the future so you can see if you have a link.

      const feed = await ctx.prisma.feed.findFirst({
        where: {
          id: input.feedId,
        },
        include: {
          // Remove this later
          items: true,
        },
      });

      return feed;
    }),
});
