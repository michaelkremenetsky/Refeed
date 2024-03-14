import { trpc } from "../trpc";

export const useUser = () => {
  const { data, isPending, isLoading } = trpc.pro.getUser.useQuery();

  const plan = data?.plan;

  return { plan, data, isPending, isLoading };
};
