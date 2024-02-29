import type { PrismaClient } from "@prisma/client";

export async function findFolderById(prisma: PrismaClient, folderId: string) {
  const folder = await prisma.bookmark_folder.findUnique({
    where: {
      id: folderId,
    },
  });

  return folder?.name;
}
