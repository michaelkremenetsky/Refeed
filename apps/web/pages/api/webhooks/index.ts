import { env } from "env.mjs";
import {
  handleInvoicePaid,
  handleSubscriptionCanceled,
  handleSubscriptionCreatedOrUpdated,
} from "features/payments/stripe-handlers";
import { buffer } from "micro";
import Cors from "micro-cors";
import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { stripe } from "utils/stripe/client";

import { prisma } from "@refeed/db";

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (err instanceof Error) console.log(err);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    switch (event.type) {
      case "invoice.paid":
        // Used to provision services after the trial has ended.
        // The status of the invoice will show up as paid. Store the status in your database to reference when a user accesses your service to avoid hitting rate limits.
        await handleInvoicePaid({
          event,
          stripe,
          prisma,
        });
        break;
      case "customer.subscription.created":
        // Used to provision services as they are added to a subscription.
        await handleSubscriptionCreatedOrUpdated({
          event,
          prisma,
        });
        break;
      case "customer.subscription.updated":
        console.log(event);
        // Used to provision services as they are updated.
        await handleSubscriptionCreatedOrUpdated({
          event,
          prisma,
        });
        break;
      case "invoice.payment_failed":
        // TODO
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        // Can also have Stripe send an email to the customer notifying them of the failure. See settings: https://dashboard.stripe.com/settings/billing/automatic
        break;
      case "customer.subscription.deleted":
        // handle subscription cancelled automatically based
        // upon your subscription settings.
        await handleSubscriptionCanceled({
          event,
          prisma,
        });
        break;
      default:
    }

    const eventObject = event.data.object as Stripe.Event.Data.Object;
    const previousAttributes = event.data
      .previous_attributes as Stripe.Event.Data.PreviousAttributes;

    // Record the event in the database
    await prisma.stripeEvent.create({
      data: {
        id: event.id,
        type: event.type,
        object: event.object,
        api_version: event.api_version,
        account: event.account,
        created: new Date(event.created * 1000), // convert to milliseconds
        data: {
          object: eventObject,
          previous_attributes: previousAttributes,
        },
        livemode: event.livemode,
        pending_webhooks: event.pending_webhooks,
        request: {
          id: event.request?.id,
          idempotency_key: event.request?.idempotency_key,
        },
      },
    });

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

// @ts-ignore
export default cors(webhookHandler);
