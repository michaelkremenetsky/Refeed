import { trpc } from "../trpc";

export const usePlan = () => {
  const { data: plan, isPending, isLoading } = trpc.pro.checkPlan.useQuery();

  return { plan, isPending, isLoading };
};
