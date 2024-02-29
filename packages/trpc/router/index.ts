import { createTRPCRouter } from "../trpc";
import { bookmarkRouter } from "./bookmarks";
import { feedRouter } from "./feeds";
import { itemRouter } from "./items";
import { mobileRouter } from "./mobile";
import { opmlRouter } from "./opml";
import { paymentsRouter } from "./payments";
import { proRouter } from "./pro";
import { readRouter } from "./read";
import { searchRouter } from "./search";
import { settingRouter } from "./settings";

export const appRouter = createTRPCRouter({
  feed: feedRouter,
  item: itemRouter,
  read: readRouter,
  search: searchRouter,
  settings: settingRouter,
  opml: opmlRouter,
  bookmark: bookmarkRouter,
  pro: proRouter,
  payments: paymentsRouter,
  mobile: mobileRouter,
});

export type AppRouter = typeof appRouter;
