import type { feed } from "@prisma/client";
import pLimit from "p-limit";

import { toHttps } from "@refeed/lib/toHttps";
import type { FeedError } from "@refeed/types/progress";

import type { PrismaClient } from "../../db";
import type { formatedOPMLType } from "../../lib/formatOPML";
import { progressManager } from "../../trpc/router/opml";
import { addFeedToUserDB } from "../discovery/addFeedToUser";
import { addFeed } from "../feed/addFeed";
import { setFeedOrder } from "../feed/setFeedOrder";
import { createOpmlFeedOrder } from "./createOpmlFeedOrder";

export const addFeedsFromOpml = async (
  formatedOPML: formatedOPMLType,
  userId: string,
  prisma: PrismaClient,
) => {
  const step1: any[] = [];
  const limit = pLimit(40); // I would do a 100 but I don't want to eat up the connection pool

  formatedOPML.forEach(
    (feed: { title?: string; text?: string; xmlUrl?: string }) => {
      step1.push(
        limit(async () => {
          let error: FeedError | undefined;
          let data;

          try {
            if (feed.title) {
              data = await addFeed(feed.title, toHttps(feed.xmlUrl!), prisma);
            } else {
              data = await addFeed(feed.text!, toHttps(feed.xmlUrl!), prisma);
            }
          } catch (err) {
            if (err instanceof Error) {
              if (err.message === "Issue with Parsing") {
                error = "Issue with Parsing Feed";
              } else if (err.message === "Issue with Refreshing Feed") {
                error = "Issue with Refreshing Feed";
              } else if (err.message === "Feed URL not Valid") {
                error = "Feed URL not Valid";
              } else if (err.message === "Link Returns 404") {
                error = "Link Returns 404";
              } else {
                console.log(err);
              }
            }
          }

          progressManager.updateProgress(userId, {
            title: feed.title ?? feed.text!,
            step: "Step 1",
            error,
          });

          return data;
        }),
      );
    },
  );

  const feeds: feed[] = (await Promise.all(step1)).filter(
    (feed) => feed != undefined,
  );

  if (feeds != undefined) {
    const feedIds = feeds
      .map((feed) => feed.id)
      .filter((id) => id != undefined);

    console.log("Sending FeedIds to Server", feedIds);

    const REFEED_BACKEND_URL =
      process.env.REFEED_BACKEND_URL ?? "http://0.0.0.0:4050";

    if (feedIds.length > 0) {
      await fetch(REFEED_BACKEND_URL + "/refreshfeeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feed_ids: feedIds }),
      });
    }
  }

  const step2: any[] = [];
  const successfullyAddedFeeds: string[] = [];
  const limit2 = pLimit(50);

  formatedOPML.forEach(
    (feed: { title?: string; text?: string; xmlUrl?: string }) => {
      step2.push(
        limit2(async () => {
          let error: FeedError;
          let feedId;
          try {
            if (userId) {
              if (feed.title) {
                feedId = await addFeedToUserDB(prisma, feed.title, userId);
              } else {
                feedId = await addFeedToUserDB(prisma, feed.text!, userId);
              }
            }
          } catch (err) {
            if (err instanceof Error) {
              if (err.message === "Issue adding Feed to User") {
                error = "Issue adding Feed to User";
              }
            }
            console.log(err);
          }

          if (feedId) {
            successfullyAddedFeeds.push(feedId);
          }

          // If it already has a existing error skip it and don't update it
          const checkFeed = progressManager
            .getProgress(userId)
            .find((item) => item.title === feed.title);

          if (!checkFeed?.error) {
            progressManager.updateProgress(userId, {
              title: feed.title ?? feed.text!,
              step: "Step 2",
              error,
            });
          }
        }),
      );
    },
  );

  await Promise.all(step2);

  const newFeedOrder = await createOpmlFeedOrder(
    successfullyAddedFeeds,
    userId,
  );

  const ctx = {
    user: {
      id: userId,
    },
    prisma,
  };

  await setFeedOrder(newFeedOrder, ctx);
  console.log(
    `Finished Importing ${progressManager.getProgress(userId).length} feeds`,
  );
};
