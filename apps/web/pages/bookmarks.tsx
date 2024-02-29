import { FeedLayout } from "@components/feed/FeedLayout";
import SideBar from "components/layout/SideBar";
import type { NextPage } from "next";

import CommandPalette from "../components/cmdk/CommandPalette";
import NavBar from "../components/layout/NavBar";
import { PageWrapper } from "../components/layout/PageWrapper";
import Reader from "../components/reader/Reader";

const Bookmarks: NextPage = () => {
  return (
    <PageWrapper>
      <CommandPalette />
      <SideBar />
      <div className={`flex h-screen w-full flex-col overflow-hidden`}>
        <Reader />
        <NavBar title="Bookmarks" bookmarkPage={true} />
        <FeedLayout FeedType="bookmarks" />
      </div>
    </PageWrapper>
  );
};

export default Bookmarks;
