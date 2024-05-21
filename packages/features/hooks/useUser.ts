import { trpc } from "../trpc";

export const useUser = () => {
  const { data, isPending, isLoading } = trpc.pro.getUser.useQuery();

  const plan = data?.plan;
  const inboxEnabled = data?.inbox;
  const inboxEmail = data?.inbox_email;

  return { plan, data, inboxEnabled, inboxEmail, isPending, isLoading };
};
