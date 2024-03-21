import { PrismaClient } from "@prisma/client";

const cuid = require("cuid");

const prisma = new PrismaClient();

async function populateUserItemIds() {
  const userItems = await prisma.user_item.findMany({
    where: {
      id: null,
    },
  });

  for (const userItem of userItems) {
    await prisma.user_item.update({
      where: {
        item_id_user_id: {
          item_id: userItem.item_id,
          user_id: userItem.user_id,
        },
      },
      data: {
        id: cuid(),
      },
    });
  }
}

const main = async () => {
  populateUserItemIds();
  prisma
    .$disconnect()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
};

main();
