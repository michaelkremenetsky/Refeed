import type { PrismaClient } from "@refeed/db";
import { checkDuplicates } from "@refeed/features/duplicates/checkDuplicates";
import type { ItemType } from "@refeed/types/item";

export const removeDuplicates = (
  items: ItemType[],
  userId: string,
  prisma: PrismaClient,
  markRead: boolean,
) => {
  const duplicates = checkDuplicates(items);

  items = items.filter((item) => {
    // Remove duplicates from items
    if (duplicates.has(item)) {
      return false;
    }

    return true;
  });

  // Mark the Items read as a Side Effect so the feeds return faster
  if (markRead) {
    // setTimeout(() => {
    //   items.forEach((item) => {
    //     // Mark item as read
    //     markItemRead(item.id, userId, prisma);
    //   });
    // }, 0);
  }

  return items;
};
