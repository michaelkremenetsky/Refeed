import { create } from "xmlbuilder2";
import { z } from "zod";

import { getPlan } from "@refeed/features/payment/checkPlan";
import { decode, encode } from "@refeed/lib/base64";
import { parseOpml } from "@refeed/lib/OpmlParser";

import { addFeedsFromOpml } from "../../features/opml/addFeedsFromOpml";
import { formatOPML } from "../../lib/formatOPML";
import { createTRPCRouter, protectedProcedure } from "../trpc";

interface ProgressItem {
  title: string;
  step: string;
  error?: string;
}

const progressMap = new Map<string, ProgressItem[]>();

export const progressManager = {
  getProgress: (userId: string) => progressMap.get(userId) || [],
  updateProgress: (userId: string, item: ProgressItem) => {
    const userProgress = progressMap.get(userId) || [];
    const existingIndex = userProgress.findIndex((p) => p.title === item.title);
    if (existingIndex !== -1) {
      userProgress[existingIndex] = item;
    } else {
      userProgress.push(item);
    }
    progressMap.set(userId, userProgress);
  },
  resetProgress: (userId: string) => {
    progressMap.delete(userId);
  },
};

export const opmlRouter = createTRPCRouter({
  checkProgress: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.user.id;
    return { progress: progressManager.getProgress(userId) };
  }),
  finishedAddingFeeds: protectedProcedure.mutation(({ ctx }) => {
    progressManager.resetProgress(ctx.user.id);
  }),
  addOPML: protectedProcedure
    .input(
      z.object({
        base64Opml: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const opml = await parseOpml(decode(input.base64Opml));
      const formatedOPML = formatOPML(opml);
      const plan = await getPlan(ctx.user.id, ctx.prisma);

      if (plan === "free" && formatedOPML.length > 150) {
        throw new Error("Upgrade Plan");
      }
      await addFeedsFromOpml(formatedOPML, ctx.user.id, ctx.prisma);

      return { message: "Successfully imported OPML." };
    }),
  exportOPML: protectedProcedure.query(async ({ ctx }) => {
    const feeds = await ctx.prisma.feed.findMany({
      where: {
        users: {
          some: {
            user_id: ctx.user.id,
          },
        },
      },
    });

    const opml = create(
      { version: "1.0", encoding: "UTF-8" },
      {
        opml: {
          "@version": "2.0",
          head: {
            title: "Refeed OPML Export",
          },
          body: feeds.map((feed) => ({
            outline: {
              "@text": feed.title,
              "@type": "rss",
              "@xmlUrl": feed.feed_url,
              "@htmlUrl": feed.website_url,
            },
          })),
        },
      },
    );

    return encode(opml.end({ prettyPrint: true }));
  }),
});
