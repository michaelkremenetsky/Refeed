import { z } from "zod";

import { handleSubscriptionCreatedOrUpdated } from "@refeed/features/payment/stripe-handlers";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Tip - use VSCode Outline feature to see the APIs defined in here without having to scroll through the file

export const paymentsRouter = createTRPCRouter({
  getUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.user.id;
  }),
  updatePlan: protectedProcedure
    .input(z.union([z.literal("free"), z.literal("pro")]))
    .query(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        data: {
          plan: input,
        },
        where: {
          id: ctx.user.id,
        },
      });
    }),
  handleSubscriptionCreatedOrUpdated: protectedProcedure
    .input(
      z.object({
        event: z.any(),
      }),
    )
    .query(({ ctx, input }) => {
      handleSubscriptionCreatedOrUpdated({
        event: input.event,
        prisma: ctx.prisma,
      });
    }),
  getStripeSubscriptionId: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        stripeSubscriptionId: true,
      },
    });

    return user?.stripeSubscriptionId;
  }),
});
