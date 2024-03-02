import { createTRPCNext } from "@trpc/next";
import { createTRPCReact, httpBatchLink, loggerLink } from "@trpc/react-query";
import superjson from "superjson";

import { checkPlatform } from "@refeed/lib/checkPlatform";
import { getBaseUrl } from "@refeed/lib/getBaseUrl";

import type { AppRouter } from "../trpc/index";

export const defaultReactQueryOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retryOnMount: false,
      retry: 5,
      staleTime: Infinity,
    },
  },
};

// We can't import anything from the mobile app here as the turbo build dosen't add that part of the codebase when its building the docker image. So we just create the mobile TRPC client here.
export const mobileTrpc = createTRPCReact<AppRouter>();

export const webTrpc = createTRPCNext<AppRouter>({
  config() {
    return {
      queryClientConfig: defaultReactQueryOptions,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  transformer: superjson,
  ssr: false,
});

// Use the Platform specific trpc endpoint in the features folder
export const trpc = checkPlatform() == "web" ? webTrpc : mobileTrpc;
