import type { PrismaClient } from "@prisma/client";

export const getFeedAmount = async (userId: string, prisma: PrismaClient) => {
  const amount = await prisma.user_feeds.count({
    where: {
      user_id: userId,
    },
  });
  return amount;
};
