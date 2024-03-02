import type { NextPage } from "next";

import { BottomFooter } from "../components/landing/Footer";
import NavBar from "../components/landing/NavBar";
import { LandingWrapper } from "../components/layout/PageWrapper";

const PrivacyPolicyPage: NextPage = () => {
  return (
    <LandingWrapper>
      <div className="more-background-pattern z-10 rounded-b-xl bg-[#FCFCFC] pt-5">
        <NavBar />
        <div className="pb-20" />

        <div className="flex justify-center">
          <div className="mx-6 w-full rounded-lg lg:mx-0 lg:w-[850px]">
            <div className="mb-12 flex justify-center">
              <h1 className="text-center text-6xl font-bold tracking-tight">
                Privacy Policy
              </h1>
            </div>
            <PricacyPolicy />
          </div>
        </div>
        <div className="border-b pb-20" />
        <BottomFooter />
      </div>
    </LandingWrapper>
  );
};

// @ts-ignore
PrivacyPolicyPage.theme = "light";

const PricacyPolicy = () => (
  <div className="text-lg">
    <p>
      Refeed (“us”, “we”, or “our”) operates{" "}
      <a href="https://refeedreader.com">https://refeedreader.com</a>{" "}
      (hereinafter referred to as “Service”).
    </p>
    <h2 className="my-6 text-2xl font-bold" id="introduction">
      Introduction
    </h2>
    <p>
      This Privacy Policy (the “Policy”) explains how Refeed collects, uses, and
      discloses personal information through its online platform (the
      “Platform”). By using or accessing the Platform in any manner, you
      acknowledge that you accept the practices and policies outlined in this
      Policy, and you hereby consent that we will collect, use, and share your
      personal information in the following ways. Any capitalized terms that are
      not defined in this Policy are defined in our{" "}
      <a href="/terms" className="text-sky-500">
        Terms of Service
      </a>
      .
    </p>
    <h2 className="my-6 text-2xl font-bold" id="information-we-collect">
      Information We Collect
    </h2>
    <p>
      For our customers (and their end users of the Services) and Site visitors,
      we collect information you provide us, including when you register with
      us, interact with us, and information included in your models; information
      from third parties; and information collected automatically.
    </p>
    <h4 className="my-6 text-xl font-bold" id="information-you-provide">
      Information You Provide
    </h4>
    <p>
      We may collect information you provide to us when, for example, you sign
      up for an account or contact us or use the Services. We may also collect
      information from our customers about you if you are a Refeed end user or
      if you are an employee, contractor, or service provider of a Refeed
      customer. The information we collect may include:
    </p>
    <ul className="ml-8">
      <li className="keep">
        Contact and account information, such as your first and last name, email
        address, account password, billing and/or business address, account
        tier;
      </li>
      <li className="keep">
        Payment information such as credit card information, which is collected
        and processed by a third party payment processor, not Refeed; and
      </li>
      <li className="keep">
        Any information you otherwise provide us such as information you include
        in an email to us or in interactions with customer service.
      </li>
    </ul>
    <h4 className="my-6 text-xl font-bold" id="information-from-third-parties">
      Information from Third Parties
    </h4>
    <p>
      We may collect information about you from third parties, as permitted by
      law, such as data providers, third-party advertisers, and other
      commercially available sources; public sources such as publicly available
      social media pages; and third-party services that you choose to connect to
      your models. We may combine this information with other information we
      collect.
    </p>
    <h4
      className="my-4 text-xl font-bold"
      id="automatically-collected-information"
    >
      Automatically Collected Information
    </h4>
    <p>
      When you interact with the Services, we may automatically collect
      information about your device, your use of the Services, and your online
      activity. Information about your device may include:
    </p>
    <ul>
      <li>
        <strong>Device data,</strong> including but not limited to your device’s
        operating system type and version, manufacturer and model, browser type,
        screen resolution, RAM and disk size, CPU usage, device type (e.g.,
        phone or tablet), IP address, MAC address, unique identifiers (including
        cookie identifiers used for advertising purposes), language settings,
        mobile device carrier, radio/network information (e.g., whether you are
        using WiFi, LTE, 3G), general location information such as city, state
        or geographic area.
      </li>
      <li>
        <strong>Usage data</strong>, such as pages or screens you viewed, how
        long you spent on a page or screen, the website you visited before
        browsing to our website, navigation paths between pages or screens,
        information about your activity on a page or screen, access times, and
        duration of access, and whether you have opened our marketing emails or
        clicked links within them.
      </li>
    </ul>
    <h2 className="my-6 text-2xl font-bold" id="security">
      Security
    </h2>
    <p>
      We use commercially reasonable physical, managerial, and technical
      safeguards to preserve the integrity and security of your personal
      information. In addition, we rely on the technical safeguards provided by
      the third party service providers we use to host, store, and process your
      personal information. We cannot, however, ensure or warrant that your
      personal information on the Platform may not be accessed, disclosed,
      altered, or destroyed by breach of any of our physical, technical, or
      managerial safeguards. We are not responsible to our users or to any third
      party due to any such loss, misuse, or alteration.
    </p>
    <h2 className="my-6 text-2xl font-bold" id="changes-to-policy">
      Changes to Policy
    </h2>
    <p>
      We’re constantly trying to improve the Platform, so we may need to change
      this Policy from time to time as well. The date of the last modification
      will also be posted at the beginning of this Policy. It is your
      responsibility to check from time to time for updates. By continuing to
      access or use the Platform, you are indicating that you agree to be bound
      by the modified Policy.
    </p>
    <h2 className="my-6 text-2xl font-bold" id="contact-us">
      Contact Us
    </h2>
    <p>
      If you have any questions about this Privacy Policy, please contact us by
      email at{" "}
      <a href="mailto:michaelkremenetsky@refeed.dev" className="text-sky-500">
        michaelkremenetsky@refeed.dev
      </a>
    </p>
  </div>
);

export default PrivacyPolicyPage;
