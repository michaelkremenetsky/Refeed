import { Readability } from "@mozilla/readability";
import { TRPCError } from "@trpc/server";
import { parseHTML } from "linkedom";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Tip - use the VSCode Outline View feature to see the APIs defined in here without having to scroll through the file

const zodFilterType = z.object({
  id: z.string(),
  enabled: z.boolean(),
  conditions: z.object({
    Feeds: z.array(z.string()),
    Content: z.union([
      z.literal("Content"),
      z.literal("Anywhere"),
      z.literal("Title"),
      z.literal("Summary"),
      z.literal("Link"),
    ]),
    Logic: z.union([
      z.literal("Contain"),
      z.literal("Does Not Contain"),
      z.literal("Equals"),
      z.literal("Does not Equal"),
      z.literal("Begins With"),
      z.literal("Ends With"),
      z.undefined(),
    ]),
    Keywords: z.union([z.array(z.string()), z.undefined()]),
  }),
});

// This file holds the Router for all the Pro features
export const proRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    // Checks what plan a user has
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        plan: true,
        inbox: true,
        inbox_email: true,
        stripeSubscriptionId: true,
        sharing: true,
      },
    });

    return user;
  }),
  updateNote: protectedProcedure
    // Updates or adds a note on an Item
    .input(
      z.object({
        itemId: z.string(),
        Note: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user_item.update({
        where: {
          item_id_user_id: {
            item_id: input.itemId,
            user_id: ctx.user.id,
          },
        },
        data: {
          note: input.Note,
        },
      });
    }),
  getNote: protectedProcedure
    // Gets the note of an Item
    .input(z.object({ itemId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user_item.findUnique({
        where: {
          item_id_user_id: {
            item_id: input.itemId,
            user_id: ctx.user.id,
          },
        },
        select: {
          note: true,
        },
      });
    }),
  fetchFullContent: protectedProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      try {
        const response = await fetch(input.url, {
          credentials: "include",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/105.0",
            Accept: "text/html,*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
          },
          method: "GET",
          mode: "cors",
        });

        const { document } = parseHTML(await response.text());

        const article = new Readability(document).parse();

        return article?.textContent;
      } catch {
        return "Failed to Fetch Site";
      }
    }),
  getFilters: protectedProcedure.query(async ({ ctx }) => {
    const filters = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        filters: true,
      },
    });
    return filters?.filters;
  }),
  updateFilter: protectedProcedure
    .input(
      z.object({
        newFilter: zodFilterType,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.filter.update({
        where: {
          id: input.newFilter.id,
        },
        data: {
          enabled: input.newFilter.enabled,
          filter: input.newFilter.conditions,
        },
      });
    }),
  addFilter: protectedProcedure
    .input(
      z.object({
        enabled: z.boolean(),
        filter: z.any(),
        // TODO: Make the frontend compatible with this zod schema
        // z.object({
        //       Feeds: z.array(z.string()),
        //       Content: z.union([
        //         z.literal("Content"),
        //         z.literal("Anywhere"),
        //         z.literal("Title"),
        //         z.literal("Link"),
        //       ]),
        //       Logic: z.union([
        //         z.literal("Contain"),
        //         z.literal("Does Not Contain"),
        //         z.literal("Equals"),
        //         z.literal("Does not Equal"),
        //         z.literal("Begins With"),
        //         z.literal("Ends With"),
        //         z.undefined(),
        //       ]),
        //       Keywords: z.union([z.array(z.string()), z.undefined()]),
        //     }),
        //   }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          filters: {
            create: {
              enabled: input.enabled,
              filter: input.filter,
            },
          },
        },
      });
    }),
  deleteFilter: protectedProcedure
    .input(
      z.object({
        filter_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.filter.delete({
        where: {
          user_id: ctx.user.id,
          id: input.filter_id,
        },
      });
    }),
  searchItems: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.item.findMany({
        where: {
          OR: [
            {
              title: {
                contains: input.query,
                mode: "insensitive",
              },
            },
          ],
        },
      });
    }),
  toggleNewsletters: protectedProcedure
    .input(
      z.object({
        enabled: z.boolean(),
        email: z.union([z.string(), z.null()]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!input.enabled) {
        await ctx.prisma.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            inbox: false,
          },
        });
      }
      if (input.enabled) {
        // Check if their is already a user with this email
        const user = await ctx.prisma.user.findFirst({
          where: {
            inbox_email: {
              equals: input.email,
            },
            NOT: {
              id: {
                equals: ctx.user.id,
              },
            }
          },
        });

        if (user) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Email already in use",
          });
        }

        const newEmail = input.email;

        if (newEmail) {
          // Check if it has @refeedreader.com on the end
          if (!newEmail?.includes("@inbox.refeedreader.com")) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Email must end with refeedreader.com",
            });
          }

          // Make sure new email is under 60 characters
          if (input.email!.length > 60) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Email is too long",
            });
          }

          // Otherwise add it to the user
          await ctx.prisma.user.update({
            where: {
              id: ctx.user.id,
            },
            data: {
              inbox: true,
              inbox_email: input.email,
            },
          });
        }
      }
    }),
});
