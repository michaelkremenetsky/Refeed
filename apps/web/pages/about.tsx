import type { NextPage } from "next";

import { BottomFooter } from "../components/landing/Footer";
import NavBar from "../components/landing/NavBar";
import { LandingWrapper } from "../components/layout/PageWrapper";

const About: NextPage = () => {
  return (
    <LandingWrapper>
      <div className="background-pattern rounded-b-xl border-x bg-[#F9FBFC]">
        <NavBar />
        <FAQ />
      </div>
      <BottomFooter />
    </LandingWrapper>
  );
};

export const FAQ = ({ removeTitle }: { removeTitle?: boolean }) => (
  <div className="mx-auto flex w-11/12 flex-col pb-16 pt-20 md:w-[700px]">
    {!removeTitle && (
      <div className="mb-12 flex justify-center">
        <h1 className="text-6xl font-bold tracking-tight">FAQ</h1>
      </div>
    )}
    <h2 className="mt-4 text-lg font-[550]">Can I use Refeed for free?</h2>
    <h2 className="mt-4 text-lg">
      Absolutely! Refeed is completely free to use forever. Refeed is{" "}
      <a href="GITHUB_LINK" className="text-sky-500">
        Open Source
      </a>{" "}
      so you can self-host it.
    </h2>
    <h2 className="mt-4 text-lg font-[550]">How do I self-host Refeed?</h2>
    <h2 className="mt-4 text-lg">
      See our self-hosting page on{" "}
      <a href="GITHUB_SELF_HOSTING_LINK" className="text-sky-500">
        Github
      </a>
    </h2>
    <h2 className="mt-4 text-lg font-[550]">Do you have yearly pricing?</h2>
    <h2 className="mt-4 text-lg">
      Yes! you can sign up to pay yearly with a 25% discount.
    </h2>
    <h2 className="mt-4 text-lg font-[550]">
      How are payments being proccesed?
    </h2>
    <h2 className="mt-4 text-lg">
      We do not handle your credit card information directly. We use Stripe to
      process payments on Web and RevenueCat for our mobile apps.
    </h2>
    <h2 className="mt-4 text-lg font-[550]">
      Where can I see the source code for Refeed?
    </h2>
    <h2 className="mt-4 text-lg">
      See our{" "}
      <a href="GITHUB_SELF_HOSTING_LINK" className="text-sky-500">
        Github
      </a>{" "}
      repository for the source code to Refeed.
    </h2>
    <h2 className="mt-4 text-lg font-[550]">
      What happens if my payment fails? E.g. an expired credit card.
    </h2>
    <h2 className="mt-4 text-lg">
      We will email you after each failed payments. Payments will be retried up
      to 4 times, if these don&apos;t succed we will downgrade you to the Free
      plan.
    </h2>
    <h2 className="mt-4 text-lg font-[550]">
      I have another question, how can I contact you?
    </h2>
    <h2 className="mt-4 text-lg">
      You can email our support{" "}
      <a href="mailto:michaelkremenetsky@refeed.dev" className="text-sky-500">
        at this email adddress
      </a>
    </h2>
  </div>
);

// @ts-ignore
About.theme = "light";

export default About;
