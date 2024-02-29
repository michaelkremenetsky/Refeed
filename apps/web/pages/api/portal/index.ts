import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "utils/stripe/client";

import { prisma } from "@refeed/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const user = await prisma.user.findUnique({
      where: {
        id: req.body.userId,
      },
      select: {
        stripeCustomerId: true,
      },
    });


    if (user?.stripeCustomerId) {
      const session = await stripe.billingPortal.sessions.create({
        customer: user?.stripeCustomerId,
        return_url: `${req.headers.origin}/account`,
      });

      res.status(200).json({ url: session.url });
    } else {
      res
        .status(404)
        .json({ message: "User not found or no Stripe customer ID" });
    }
    return;
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
