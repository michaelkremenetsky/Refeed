import type { NextPage } from "next";
import { FeedLayout } from "@components/feed/FeedLayout";
import NavBar from "@components/layout/NavBar";
import SideBar from "components/layout/SideBar";

import CommandPalette from "../components/cmdk/CommandPalette";
import { PageWrapper } from "../components/layout/PageWrapper";
import Reader from "../components/reader/Reader";

const Recent: NextPage = () => {
  return (
    <PageWrapper>
      <CommandPalette />
      <SideBar />
      <div className={`flex h-screen w-full flex-col`}>
        <Reader />
        <NavBar title="Recently Read" recentPage={true} />
        <FeedLayout FeedType="recentlyread" />
      </div>
    </PageWrapper>
  );
};

export default Recent;
