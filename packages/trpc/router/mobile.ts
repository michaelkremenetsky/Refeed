import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

// Tip - use the VSCode Outline View feature to see the APIs defined in here without having to scroll through the file

export const mobileRouter = createTRPCRouter({
  submitWaitlist: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const waitListLink =
        "https://docs.google.com/forms/d/e/1FAIpQLScYR9AC2SmPNjRu42v1wjackAU-c_BMj6BAohO-PufVtc8TOQ/formResponse";

      const formData = new URLSearchParams();

      formData.append("entry.1326422514", input.email);

      const response = await fetch(waitListLink, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.ok) {
        return { message: "Form submitted successfully!" };
      } else {
        return { error: "Failed to submit the form." };
      }
    }),
});
