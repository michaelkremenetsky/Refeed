import type { NextApiRequest, NextApiResponse } from "next";

import { stripe } from "../../../utils/stripe/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { subscriptionId } = req.body;

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      if (subscription && subscription.trial_end) {
        res.status(200).json({ trialEnd: subscription.trial_end });
      } else {
        res
          .status(404)
          .json({ error: "No active trial found for the given subscription." });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
