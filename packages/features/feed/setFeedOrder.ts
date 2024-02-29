import type { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

export const setFeedOrder = async (
  order: {
    folder_name: string;
    order: number;
    folded: boolean;
    children?: {
      order: number;
      feedId: string;
    }[];
  }[],
  ctx: {
    user: {
      id: string;
    };
    prisma: PrismaClient<Prisma.PrismaClientOptions, never>;
  },
) => {
  // Sets the new feed order in the database and moves any folders or feeds that were moved according to new schema
  const schema = z.array(
    z.object({
      folder_name: z.string(),
      order: z.number(),
      folded: z.boolean(),
      children: z
        .array(
          z.object({
            feedId: z.string(),
            order: z.number(),
          }),
        )
        .optional(),
    }),
  );

  const input = schema.parse(order);
  const feedOrderJson = JSON.stringify(input);

  await ctx.prisma.user.update({
    where: {
      id: ctx.user.id,
    },
    data: {
      feed_order: feedOrderJson,
    },
  });
};
