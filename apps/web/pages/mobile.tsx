import { useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";

import type { EventFor } from "@refeed/lib/EventFor";
import { Input } from "@refeed/ui";

import NavBar from "../components/landing/NavBar";
import { LandingWrapper } from "../components/layout/PageWrapper";
import { trpc } from "../utils/trpc";

const Mobile: NextPage = () => {
  const [searchQuery, setQuerySearch] = useState(null as string | null);
  const [submitted, setSubmitted] = useState(false);
  const submitWaitlist = trpc.mobile.submitWaitlist.useMutation();

  return (
    <LandingWrapper>
      <div className="background-pattern h-screen rounded-b-xl border-x border-b border-[#D9D9D9] bg-white">
        <NavBar />
        <div className="mb-10 mt-10">
          <div className="mx-auto flex w-full justify-center px-1.5">
            <div className="w-[400px] overflow-hidden rounded-xl lg:w-[825px] xl:w-[1300px]">
              <div className="flex flex-col gap-x-32 pt-10 sm:items-center sm:pt-0 md:flex-row">
                <div className="flex flex-col sm:-translate-y-6 sm:pl-28">
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-y-4">
                      <div className="flex w-full items-center justify-center sm:justify-start">
                        <h3 className="text-2xl font-[650] sm:text-left sm:text-[54px]">
                          Refeed Mobile App
                        </h3>
                        <span className="ml-2.5 h-5 translate-y-[1px] rounded bg-[#0496FF]/10 px-[6px] text-right text-sm font-[450] text-sky-500">
                          Alpha
                        </span>
                      </div>
                      <span className="mt-4 text-center text-xl text-neutral-500/90 sm:text-left">
                        Join the waitlist to be notifed when Refeed Mobile App
                        comes out.
                      </span>
                    </div>
                  </div>
                  <div className="mx-8 mt-6 flex w-[540px] flex-col gap-x-2 gap-y-3 md:mx-0 md:flex-row md:gap-y-0">
                    {!submitted ? (
                      <>
                        <Input
                          placeholder="Type your email address"
                          className="mb-0.5 h-11 w-full text-base md:w-[300px]"
                          defaultValue={searchQuery ?? ""}
                          onInput={(e: EventFor<"input", "onChange">) => {
                            if (!e.target.value) {
                              setQuerySearch(null);
                            } else {
                              setQuerySearch(e.target.value ?? "");
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            submitWaitlist.mutate({ email: searchQuery! });
                            setSubmitted(true);
                          }}
                          className="mx-auto h-11 w-[240px] rounded-md bg-white px-6 text-base font-medium shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)] sm:mx-0"
                        >
                          Sign Up for Waitlist
                        </button>
                      </>
                    ) : (
                      <h1 className="text-xl text-neutral-500">
                        Thanks for joining the waitlist! We will email you when
                        its ready!
                      </h1>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center overflow-hidden rounded-lg">
                  <Image
                    src="/MobileFull.png"
                    alt="Mobile App"
                    width="828"
                    height="1270"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingWrapper>
  );
};

// @ts-ignore
Mobile.theme = "light";

export default Mobile;
