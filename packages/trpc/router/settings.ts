import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Tip - use VSCode Outline feature to see the APIs defined in here without having to scroll through the file

export const settingRouter = createTRPCRouter({
  updateShareProviders: protectedProcedure
    .input(
      z.object({
        Sharing: z.array(z.string()).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const SharingProviders = [
        "Twitter",
        "Email",
        "Facebook",
        "Telegram",
        "Pocket",
        "Mastodon",
        "Linkedin",
      ];

      // Make sure it includes only the sharing providers
      input.Sharing.forEach((item) => {
        if (!SharingProviders.includes(item)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Sharing Providers invalid",
          });
        }
      });

      return await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          sharing: input.Sharing,
        },
      });
    }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    await supabase.from("user").delete().match({ user_id: ctx.user.id });
    await supabase.auth.admin.deleteUser(ctx.user.id);
  }),
});
