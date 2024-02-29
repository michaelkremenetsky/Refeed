import { trpc } from "../trpc";

export const removeFeedsOrFolder = () => {
  const utils = trpc.useUtils();

  const removeFeedMutation = trpc.feed.removeUserFeed.useMutation();
  const removeFolderMutation = trpc.feed.removeFolder.useMutation();

  const removeFeed = async (feedId: string) => {
    const feedsInFolders = utils.feed.getFeedsInFolders.getData();

    // Remove feed from cache while its deleting in DB
    const newFeeds = feedsInFolders?.map((folder) => {
      const newFolder = folder.children?.filter((feed) => feed.id !== feedId);
      return { ...folder, children: newFolder };
    });
    utils.feed.getFeedsInFolders.setData(undefined, newFeeds);

    await removeFeedMutation.mutateAsync({ feedId });
  };

  const removeFolder = async (folderName: string) => {
    const feedsInFolders = utils.feed.getFeedsInFolders.getData();

    // Remove feed from cache while its deleting in DB
    const newFolders = feedsInFolders?.filter(
      (folder) => folder.name !== folderName,
    );
    utils.feed.getFeedsInFolders.setData(undefined, newFolders);

    await removeFolderMutation.mutateAsync({ folderName });
  };

  return { removeFeed, removeFolder };
};
