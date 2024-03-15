import React from "react";
import Constants from "expo-constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { defaultReactQueryOptions, mobileTrpc } from "@refeed/features/trpc";
import type { AppRouter } from "@refeed/trpc";

import { EXPO_PUBLIC_BACKEND_URL } from "./env";
import { supabase } from "./supabase";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const trpc = mobileTrpc;
export { type RouterInputs, type RouterOutputs } from "@refeed/trpc";

const getBaseUrl = () => {
  let localhost: string;
  if (EXPO_PUBLIC_BACKEND_URL != undefined) {
    localhost = EXPO_PUBLIC_BACKEND_URL;
  } else {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const debugIp = debuggerHost?.split(":")[0];
    return `http://${debugIp}:3000`;
  }

  if (!localhost) {
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }

  return localhost;
};

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = React.useState(
    () => new QueryClient(defaultReactQueryOptions),
  );
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
          headers: async () => {
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;
            return { Authorization: token };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
