import type { NextPage } from "next";
import NavBar from "@components/layout/NavBar";
import SideBar from "components/layout/SideBar";

import CommandPalette from "../../components/cmdk/CommandPalette";
import { DiscoverLayout } from "../../components/discover/DiscoverLayout";
import { PageWrapper } from "../../components/layout/PageWrapper";
import Reader from "../../components/reader/Reader";

const Discover: NextPage = () => {
  return (
    <PageWrapper>
      <CommandPalette />
      <SideBar />
      <div className={`flex h-screen w-full flex-col`}>
        <Reader />
        <NavBar title="Discover" hideButtons />
        <DiscoverLayout />
      </div>
    </PageWrapper>
  );
};

export default Discover;
