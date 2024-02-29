import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { webTrpc } from "@refeed/features/trpc";
import type { AppRouter } from "@refeed/trpc";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const trpc = webTrpc;

export { type RouterInputs, type RouterOutputs } from "@refeed/trpc";
