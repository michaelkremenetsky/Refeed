import { getFeedOrder } from "../discovery/addFeedToUser";

export const createOpmlFeedOrder = async (
  feedIds: string[],
  userId: string,
) => {
  const order = await getFeedOrder(userId);

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

  feedIds.forEach((feedId) => {
    const parentFolder = feedOrder.find(
      (folder) => folder.folder_name === "Imported",
    );

    // If parent folder with name "Imported" doesn't exist, create it
    if (!parentFolder) {
      feedOrder.push({
        folder_name: "Imported",
        folded: true,
        order: feedOrder.length,
        children: [],
      });
    }

    // Find the parent folder again in case it was just created
    const targetFolder = feedOrder.find(
      (folder) => folder.folder_name === "Imported",
    );

    const nextOrderNumber = targetFolder?.children
      ? targetFolder.children.length
      : 0;

    const child = {
      feedId: feedId,
      order: nextOrderNumber,
    };

    targetFolder?.children?.push(child);
  });

  return feedOrder;
};
