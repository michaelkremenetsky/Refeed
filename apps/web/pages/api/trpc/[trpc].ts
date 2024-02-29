import { createNextApiHandler } from "@trpc/server/adapters/next";

import { appRouter, createTRPCContext } from "@refeed/trpc";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  batching: {
    enabled: true,
  },
});

// If you need to enable cors, you can do so like this:
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   // Enable cors
//   await cors();
//   // Let the tRPC handler do its magic
//   return createNextApiHandler({
//     router: appRouter,
//     // createContext,
//     createContext: createTRPCContext,
//   })(req, res);
// };
// export default handler;
