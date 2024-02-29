import type { NextApiRequest, NextApiResponse } from "next";
import { getOrCreateStripeCustomerIdForUser } from "features/payments/stripe-handlers";
import type Stripe from "stripe";
import { stripe } from "utils/stripe/client";

import { prisma } from "@refeed/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      if (!req.body.price) {
        throw new Error(req.body.price as string);
      }

      if (!req.body.userId) {
        throw new Error(req.body.userId as string);
      }

      const customerId = await getOrCreateStripeCustomerIdForUser({
        prisma,
        stripe,
        userId: req.body.userId as string,
      });

      if (!customerId) {
        throw new Error("Could not create customer");
      }

      console.log(req.body.price);

      const params: Stripe.Checkout.SessionCreateParams = {
        customer: customerId,
        client_reference_id: req.body.userId as string,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: req.body.price as string,
            quantity: 1,
          },
        ],
        subscription_data: {
          trial_settings: {
            end_behavior: {
              missing_payment_method: "cancel",
            },
          },
          metadata: {
            userId: req.body.userId as string,
          },
          // Will eventually go back to having a trail for Refeed Yearly
          trial_period_days:
            req.body.price == "price_1NpofzBXmca2WokEhuEPIWEJ" ? 14 : undefined,
        },
        success_url: `${req.headers.origin}/feed/all`,
        cancel_url: `${req.headers.origin}/feed/all`,
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
