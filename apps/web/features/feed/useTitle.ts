import { useFeedsInFolders } from "@features/folders/useFeedsInFolders";
import { useAtomValue } from "jotai";

import { titleAtom } from "@refeed/atoms/feedsAtom";

export const useTitle = ({ feedId }: { feedId: string }) => {
  const { feedsInFolders } = useFeedsInFolders();
  let title;

  if (feedsInFolders) {
    for (const folder of feedsInFolders) {
      if (folder.children) {
        for (const feed of folder.children) {
          if (feed.id === feedId) {
            title = feed.name;
          }
        }
      }
    }
  }

  const check = useAtomValue(titleAtom);
  if (check) {
    title = check;
  }

  return { title };
};
