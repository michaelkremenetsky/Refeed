import dayjs from "dayjs";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { markItemRead } from "./utils/markItemRead";

// Tip - use the VSCode Outline View feature to see the APIs defined in here without having to scroll through the file

export const readRouter = createTRPCRouter({
  addReadLater: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user_item.upsert({
        where: {
          item_id_user_id: {
            item_id: input.itemId,
            user_id: ctx.user.id,
          },
        },
        update: {
          in_read_later: true,
          marked_read: true,
        },
        create: {
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
          item: {
            connect: {
              id: input.itemId,
            },
          },
          in_read_later: true,
          marked_read: true,
        },
      });
    }),
  markItemRead: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await markItemRead(input.itemId, ctx.user.id, ctx.prisma);
    }),
  markItemUnread: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user_item.update({
        where: {
          item_id_user_id: {
            item_id: input.itemId,
            user_id: ctx.user.id,
          },
        },
        data: {
          marked_read: false,
          marked_read_time: undefined,
        },
      });
    }),
  removeReadLater: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user_item.update({
        where: {
          item_id_user_id: {
            item_id: input.itemId,
            user_id: ctx.user.id,
          },
        },
        data: {
          in_read_later: false,
        },
      });
    }),
  removeTemp: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user_item.update({
        where: {
          item_id_user_id: {
            item_id: input.itemId,
            user_id: ctx.user.id,
          },
        },
        data: {
          temp_added_time: null,
        },
      });
    }),
  addTempReadLater: protectedProcedure
    .input(
      z.object({ itemId: z.string(), tempTimeAmount: z.number().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      let tempTime;

      if (!input.tempTimeAmount) {
        const time = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
          select: {
            default_temp_time: true,
          },
        });

        if (!time) {
          throw new Error("Time Not Found");
        }
        if (time.default_temp_time === null) {
          throw new Error("Time Not Found");
        }

        tempTime = time.default_temp_time;
      } else {
        tempTime = input.tempTimeAmount;
      }

      // 1 is 1 minute (1440 min in a day)
      const tempdate = dayjs().add(tempTime, "minute").toDate();

      return await ctx.prisma.user_item.upsert({
        where: {
          item_id_user_id: {
            item_id: input.itemId,
            user_id: ctx.user.id,
          },
        },
        update: {
          in_read_later: true,
          marked_read: true,
          temp_added_time: tempdate,
        },
        create: {
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
          item: {
            connect: {
              id: input.itemId,
            },
          },
          in_read_later: true,
          marked_read: true,
          temp_added_time: tempdate,
        },
      });
    }),
  markAllRead: protectedProcedure
    .input(z.object({ feedIds: z.array(z.string()).optional() }))
    .mutation(async ({ ctx, input }) => {
      // Mark specific feeds read
      if (input.feedIds) {
        // Get items that don't already have userItem on them
        const items = await ctx.prisma.item.findMany({
          where: {
            feed_id: {
              in: input.feedIds,
            },
            NOT: {
              user_items: {
                some: {
                  user_id: ctx.user.id,
                },
              },
            },
          },
        });

        // Create a userItem for every item in the feedId
        return await ctx.prisma.user_item.createMany({
          data: items.map((item) => ({
            user_id: ctx.user.id,
            item_id: item.id,
            marked_read: true,
            marked_read_time: dayjs().toDate(),
          })),
        });
      }

      // Mark All Feeds Read
      else {
        // Get items that don't already have userItem on them
        const items = await ctx.prisma.item.findMany({
          where: {
            NOT: {
              user_items: {
                some: {
                  user_id: ctx.user.id,
                },
              },
            },
          },
        });

        // Create a userItem for every item in the feedId
        return await ctx.prisma.user_item.createMany({
          data: items.map((item) => ({
            user_id: ctx.user.id,
            item_id: item.id,
            marked_read: true,
            marked_read_time: dayjs().toDate(),
          })),
        });
      }
    }),
});
