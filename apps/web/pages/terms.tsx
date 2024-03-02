import type { NextPage } from "next";

import { BottomFooter } from "../components/landing/Footer";
import NavBar from "../components/landing/NavBar";
import { LandingWrapper } from "../components/layout/PageWrapper";

const TermsPage: NextPage = () => {
  return (
    <LandingWrapper>
      <div className="more-background-pattern overflow-hidden bg-[#FCFCFC] ">
        <div className="z-10 rounded-b-xl pt-5">
          <NavBar />
        </div>
        <div className="more-background-pattern bg-[#FCFCFC]">
          <div className="pb-20" />
          <div className="flex justify-center">
            <div className="mx-6 w-full rounded-lg lg:mx-0 lg:w-[850px]">
              <div className="mb-12 flex justify-center">
                <h1 className="text-center text-6xl font-bold tracking-tight">
                  Terms of Service
                </h1>
              </div>
              <Terms />
            </div>
          </div>
          <div className="pb-20" />
          <div className="border">
            <BottomFooter />
          </div>
        </div>
      </div>
    </LandingWrapper>
  );
};

// @ts-ignore
TermsPage.theme = "light";

/* eslint-disable react/no-unescaped-entities */

const Terms = () => (
  <div className="text-lg">
    <p className="my-6">Effective Febuary 14, 2024</p>
    <p>
      Refeed (“us”, “we”, or “our”) operates{" "}
      <a href="https://refeedreader.com">https://refeedreader.com</a>{" "}
      (hereinafter referred to as “Service”).
    </p>
    <h2 className="my-6 text-2xl font-bold" id="introduction">
      Introduction
    </h2>
    <p>
      The following Terms of Service are a legal agreement between you (either
      as an individual or on behalf of an entity) and Refeed regarding your use
      of Refeed's Platform and associated documentation ("Software"). These erms
      apply to the executable code version of the Software. Source code for the
      Software is available separately and free of charge under open source
      software license agreements. If you do not agree to all of the terms in
      these Application Terms, do not download, install, use, or copy the
      Software.
    </p>
    <h2 className="my-6 text-2xl font-bold">Modification</h2>
    <p>
      Refeed reserves the right, at its sole discretion, to modify these Terms
      at any time and without prior notice. The date of the last modification to
      the Terms will be posted at the beginning of these Terms. It is your
      responsibility to check from time to time for updates. By continuing to
      access or use the Platform, you are indicating that you agree to be bound
      by any modified Terms.
    </p>
    <h2 className="my-6 text-2xl font-bold">Privacy</h2>
    <p>
      These Terms include the provisions in this document, as well as those in
      our Privacy Policy{" "}
      <a href="/privacy" className="text-sky-500">
        Privacy Policy
      </a>
      .
    </p>
    <h2 className="my-6 text-2xl font-bold">Termination</h2>
    <p>
      Either party may terminate this Agreement upon written notice to the other
      party if the other party materially breaches this Agreement and such
      breach is not cured within thirty (30) days after the breaching party’s
      receipt of such notice. Refeed may terminate Customer’s access to the Free
      Version at any time upon notice to Customer.
    </p>
    <h2 className="my-6 text-2xl font-bold">Disclaimer of Warranties.</h2>
    <p>
      Customer represents and warrants that it has validly entered into the
      Contract and has the legal power to do so. Customer further represents and
      warrants that it is responsible for the conduct of its Authorized Users
      and their compliance with the terms of this Contract and the User Terms.
      EXCEPT AS EXPRESSLY PROVIDED FOR HEREIN, THE SERVICES AND ALL RELATED
      COMPONENTS AND INFORMATION ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE"
      BASIS WITHOUT ANY WARRANTIES OF ANY KIND, AND REFEED EXPRESSLY DISCLAIMS
      ANY AND ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING THE IMPLIED
      WARRANTIES OF MERCHANTABILITY, TITLE, FITNESS FOR A PARTICULAR PURPOSE,
      AND NON-INFRINGEMENT. CUSTOMER UNDERSTANDS THAT ITS PARTICULAR
      CONFIGURATIONS OF, AND INTEGRATIONS WITH, ITS CUSTOM APPS MAY IMPACT
      LATENCY, AVAILABILITY, OPTIMIZATION AND PERFORMANCE. CUSTOMER ACKNOWLEDGES
      THAT REFEED DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED,
      TIMELY, STABLE, SECURE, OR ERROR FREE. EACH PARTY DISCLAIMS ALL LIABILITY
      AND INDEMNIFICATION OBLIGATIONS FOR ANY HARM OR DAMAGES CAUSED BY ANY BETA
      SERVICES. NOTWITHSTANDING ANYTHING TO THE CONTRARY IN THE AGREEMENT,
      CUSTOMER ACKNOWLEDGES AND AGREES THAT THE BETA SERVICES ARE PROVIDED
      "AS-IS" WITH RESPECT TO ITS PERFORMANCE, SPEED, FUNCTIONALITY, SUPPORT,
      AND AVAILABILITY.
    </p>
    <h2 className="my-6 text-2xl font-bold">No Waiver</h2>
    <p>
      The failure of Refeed to enforce any right or provision of these Terms
      will not constitute a waiver of future enforcement of that right or
      provision.
    </p>
    <h2 className="my-6 text-2xl font-bold">Severability</h2>
    <p>
      This Agreement will be enforced to the fullest extent permitted under
      applicable law. If any provision of this Agreement is held by a court of
      competent jurisdiction to be contrary to law, the provision will be
      modified by the court and interpreted so as best to accomplish the
      objectives of the original provision to the fullest extent permitted by
      law, and the remaining provisions of this Agreement will remain in effect.
    </p>
    <h2 className="my-6 text-2xl font-bold">Entire Agreement</h2>
    <p>
      Entire Agreement. These Terms constitute the entire agreement between you
      and Refeed regarding your use of the Platform, and supersede all prior
      written or oral agreements other than the Organization Agreements.
    </p>
    <h2 className="my-6 text-2xl font-bold" id="contact-us">
      Contact Us
    </h2>
    <p>
      If you have any questions about this Terms of Service, please contact us
      by email at{" "}
      <a href="mailto:michaelkremenetsky@refeed.dev" className="text-sky-500">
        michaelkremenetsky@refeed.dev
      </a>
    </p>
  </div>
);

export default TermsPage;
