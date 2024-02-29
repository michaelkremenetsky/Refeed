import router from "next/router";

import { trpc } from "../utils/trpc";

export const useMarkRead = (feedId: string | undefined) => {
  const markAllAsRead = trpc.read.markAllRead.useMutation();

  const markRead = (type: "one" | "all") => {
    if (type == "one") {
      markAllAsRead.mutate({ feedId: feedId });
    }
    if (type == "all") {
      markAllAsRead.mutate({});
    }
    router.reload();
  };

  return { markRead };
};
