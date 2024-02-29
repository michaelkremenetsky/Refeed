import { useState } from "react";
import { FreePlan, ProPlan } from "@features/pricing/PricingDialog";

import { FAQ } from "../../pages/about";
import { Control } from "../../pages/pricing";

export const PricingPage = () => {
  const [isYearlyPlan, setIsYearlyPlan] = useState(false);

  return (
    <>
      <div className="rounded-b-xl border-x border-b bg-[#fafafa] dark:border-neutral-700/80 dark:bg-[#141415]">
        <h1 className="mx-auto flex justify-center pt-10 text-7xl font-[775] leading-none tracking-tight md:w-[700px]">
          <span className="z-10 py-2 tracking-tight text-sky-500">Pricing</span>
        </h1>
        <h1 className="mx-auto mt-3 flex justify-center text-lg leading-none md:w-[700px]">
          <span className="font-base z-10 text-center text-neutral-500">
            Try the free plan or try any plan with a free 14 day trial.
          </span>
        </h1>
        <div className="mt-6 flex items-center justify-center">
          <Control
            isYearlyPlan={isYearlyPlan}
            setIsYearlyPlan={setIsYearlyPlan}
          />
        </div>
        <div className="mt-10 flex justify-center pb-28">
          <div className="z-10 flex gap-x-4 rounded-lg">
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
