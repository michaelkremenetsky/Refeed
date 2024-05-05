import { useState } from "react";
import { FreePlan, ProPlan } from "@features/pricing/PricingDialog";

import { FAQ } from "../../pages/about";
import { Control } from "../../pages/pricing";

export const PricingPage = () => {
  const [isYearlyPlan, setIsYearlyPlan] = useState(false);

  return (
    <>
      <div className="rounded-b-xl border-x border-b bg-[#fafafa] dark:rounded-none dark:border-none dark:border-neutral-700/80 dark:bg-[#141415]">
        <h1 className="mx-auto flex justify-center pt-10 text-7xl font-[775] leading-none tracking-tight md:w-[700px]">
          <span className="z-10 py-2 tracking-tight text-sky-500">Pricing</span>
        </h1>
        <h1 className="mx-auto mt-3 flex justify-center text-lg leading-none md:w-[700px]">
          <span className="font-base z-10 text-center text-neutral-450">
            Use Refeed for free or try Refeed Pro with a free 14 day trial.
          </span>
        </h1>
        <div className="mt-6 flex items-center justify-center">
          <Control
            isYearlyPlan={isYearlyPlan}
            setIsYearlyPlan={setIsYearlyPlan}
          />
        </div>
        <div className="mt-10 flex justify-center pb-28">
          <div className="z-10 flex flex-col gap-x-4 space-y-2 rounded-lg md:flex-row md:space-y-0">
            <FreePlan className="mx-4 border border-neutral-300/80 md:mx-0 md:w-[375px]" />
            <ProPlan
              className="mx-4 md:mx-0 md:w-[375px]"
              isYearlyPlan={isYearlyPlan}
            />
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-[#141415]">
        <FAQ removeTitle={true} />
      </div>
    </>
  );
};
