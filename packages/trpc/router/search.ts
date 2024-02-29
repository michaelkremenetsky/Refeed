import { z } from "zod";

import { getNextPrismaCursor } from "../../lib/getNextPrismaCursor";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const searchRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.item.findMany({
        where: {
          title: {
            search: input.query,
          },
          website_content: {
            search: input.query,
          },
        },
      });
    }),
  searchFeeds: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        amount: z.number(),
        itemsPerFeed: z.number(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.search) {
        return undefined;
      }

      const feeds = await ctx.prisma.feed.findMany({
        where: {
          OR: [
            {
              title: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              feed_url: {
                contains: input.search,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          feed_url: true,
          logo_url: true,
          items: {
            take: input.itemsPerFeed,
          },
        },
        take: input.amount,
        skip: input.cursor === undefined ? 0 : 1,
        cursor:
          input.cursor === undefined
            ? undefined
            : {
                id: input.cursor,
              },
      });

      const nextCursor = getNextPrismaCursor(feeds, input.amount);

      return {
        feeds,
        nextCursor,
      };
    }),
});
