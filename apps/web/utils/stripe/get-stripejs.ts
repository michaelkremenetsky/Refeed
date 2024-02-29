/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import type { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";

/* eslint-disable @typescript-eslint/no-misused-promises */

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
    );
  }
  return stripePromise;
};

export default getStripe;
