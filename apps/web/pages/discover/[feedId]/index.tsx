import { FeedLayout } from "@components/feed/FeedLayout";
import NavBar from "@components/layout/NavBar";
import SideBar from "@components/layout/SideBar";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

import CommandPalette from "../../../components/cmdk/CommandPalette";
import { PageWrapper } from "../../../components/layout/PageWrapper";
import Reader from "../../../components/reader/Reader";

const Feed: NextPage = () => {
  const { query } = useRouter();
  const { feedId } = query;

  const fetch = trpc.feed.getDiscoveryFeedById.useQuery(
    {
      feedId: feedId as string,
    },
    {
      enabled: feedId != undefined,
    },
  ).data;

  const title = fetch?.title;

  return (
    <PageWrapper>
      <CommandPalette />
      <SideBar />
      <div
        className={`flex h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#0f0f10]`}
      >
        <Reader />
        <NavBar title={title ?? ""} />
        <FeedLayout FeedType="one" feedId={(feedId as string) || ""} />
      </div>
    </PageWrapper>
  );
};

export default Feed;
