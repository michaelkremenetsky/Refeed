import type { PrismaClient } from "@prisma/client";

export const getFolderFeedIds = async (
  Folder: string,
  userId: string,
  prisma: PrismaClient,
): Promise<string[]> => {
  const order = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      feed_order: true,
    },
  });

  const parsed: {
    folder_name: string;
    order: number;
    folded: boolean;
    children?: {
      feedId: string;
      order: number;
    }[];
  }[] = JSON.parse(order?.feed_order as string);

  const folderIndex = parsed.findIndex(
    (folder) => folder.folder_name === Folder,
  );

  const feedIds = parsed?.[folderIndex]?.children?.map((feed) => feed.feedId);

  return feedIds!;
};
