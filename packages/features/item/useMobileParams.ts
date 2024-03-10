import { useNavigationState } from "@react-navigation/native";
import { useAtomValue } from "jotai";

import { Sort } from "../../../apps/web/stores/ui";

// TODO: Need to refactor the typing for react-navigation

const useMobileParams = () => {
  const sort = useAtomValue(Sort);

  let FeedType = useNavigationState((state) => {
    return state.routes.find((route) => route.name === "Feed" || "Bookmark");
    // @ts-ignore
  })?.params?.type;

  if (!FeedType) {
    FeedType = useNavigationState((state) => {
      return state.routes.find((route) => route.name === "Item");
      // @ts-ignore
    })?.params?.type;
  }

  const feedId = useNavigationState((state) => {
    return state.routes.find(
      (route) =>
        route.name === "Feed" ||
        route.name === "Bookmark" ||
        route.name === "Item",
    );
    // @ts-ignore
  })?.params?.feedId;

  if (!FeedType) {
    FeedType = useNavigationState((state) => {
      return state.routes.find((route) => route.name === "Item");
      // @ts-ignore
    })?.params?.feedId;
  }

  const folder = useNavigationState((state) => {
    return state.routes.find((route) => route.name === "Feed");
    // @ts-ignore
  })?.params?.folder;

  return { sort, FeedType: FeedType, folder, feedId };
};

export default useMobileParams;
