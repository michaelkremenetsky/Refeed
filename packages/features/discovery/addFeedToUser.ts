import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { prisma } from "../../db";
import { getFeedAmount } from "../feed/getFeedAmount";
import { setFeedOrder } from "../feed/setFeedOrder";
import { getPlan } from "../payment/checkPlan";

export const addFeedToUserDB = async (
  prisma: PrismaClient,
  title: string,
  userId: string,
) => {
  console.log("addFeedToUser");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const feed = await prisma.feed.findUnique({
    where: {
      title: title,
    },
    include: {
      items: {
        orderBy: {
          created_at: "desc",
        },
        where: {
          created_at: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          created_at: true,
          title: true,
        },
        take: 20,
      },
    },
  });

  if (!feed) {
    throw new Error("No Feed Exists");
  }

  let plan;
  try {
    plan = await getPlan(userId, prisma);
  } catch (err) {
    console.log(err);
    throw new Error("Couldn't Fetch Plan");
  }

  let amount;
  try {
    amount = await getFeedAmount(userId, prisma);
  } catch (err) {
    console.log(err);
    throw new Error("Couldn't fetch amount");
  }

  if (plan === "free") {
    if (amount > 1000) {
      throw new Error("Free users cannot add more than 1000 feeds");
    }
  }
  if (plan === "pro") {
    if (amount > 5000) {
      throw new Error("Pro users cannot add more than 5000 feeds");
    }
  }

  // So user starts with 20 feeds.
  const pagination_start_timestamp =
    feed.items[feed.items.length - 1]?.created_at;

  try {
    await prisma.feed.update({
      where: {
        title: title,
      },
      data: {
        users: {
          create: {
            // If you get the message below its probably a db stub issue:
            // An operation failed because it depends on one or more records that were required but not found. No 'User' record(s) (needed to inline the relation on 'UserFeeds' record(s)) was found for a nested connect on one-to-many relation 'UserToUserFeeds'.
            //
            pagination_start_timestamp,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        // P2002 is just "Unique constraint failed" which is fine
      } else {
        console.log(err);
        return;
      }
    } else {
      console.log(err);
      return;
    }
  }

  return feed.id;
};

export const getFeedOrder = async (userId: string) => {
  let order;
  try {
    order = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        feed_order: true,
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Issue while fetching feed_order");
  }
  return order;
};

export const addFeedToUser = async (
  title: string,
  userId: string,
  prisma: PrismaClient,
  folderName?: string,
) => {
  const feedId = await addFeedToUserDB(prisma, title, userId);

  const order = await getFeedOrder(userId);

  try {
    let feedOrder: {
      folder_name: string;
      order: number;
      folded: boolean;
      children?: {
        feedId: string;
        order: number;
      }[];
    }[] = JSON.parse(order?.feed_order as string);

    if (!feedOrder) {
      feedOrder = [];
    }

    const parentFolderName = folderName ? folderName : "Imported";
    const parentFolder = feedOrder.find(
      (folder) => folder.folder_name === parentFolderName,
    );

    // If parent folder with name "Imported" doesn't exist, create it
    if (!parentFolder) {
      feedOrder.push({
        folder_name: parentFolderName,
        folded: true,
        order: feedOrder.length,
        children: [],
      });
    }

    // Find the parent folder again in case it was just created
    const targetFolder = feedOrder.find(
      (folder) => folder.folder_name === parentFolderName,
    );

    const nextOrderNumber = targetFolder?.children
      ? targetFolder.children.length
      : 0;

    const child = {
      feedId: feedId!,
      order: nextOrderNumber,
    };

    targetFolder?.children?.push(child);

    await setFeedOrder(feedOrder, {
      user: {
        id: userId,
      },
      prisma,
    });
  } catch (err) {
    console.log(err);
  }
};
