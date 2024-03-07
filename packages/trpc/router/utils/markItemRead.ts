import type { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export const markItemRead = async (
  itemId: string,
  userId: string,
  prisma: PrismaClient,
) => {
  const time = dayjs();

  await prisma.user_item.upsert({
    where: {
      item_id_user_id: {
        item_id: itemId,
        user_id: userId,
      },
    },
    update: {
      marked_read: true,
      marked_read_time: time.toDate(),
    },
    create: {
      user: {
        connect: {
          id: userId,
        },
      },
      item: {
        connect: {
          id: itemId,
        },
      },
      in_read_later: false,
      marked_read: true,
      marked_read_time: time.toDate(),
    },
  });
};
