import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FeedLayout } from "@components/feed/FeedLayout";
import NavBar from "@components/layout/NavBar";
import SideBar from "@components/layout/SideBar";

import CommandPalette from "../../components/cmdk/CommandPalette";
import { PageWrapper } from "../../components/layout/PageWrapper";
import Reader from "../../components/reader/Reader";

const Folder: NextPage = () => {
  const { query } = useRouter();

  const { folder } = query;

  return (
    <PageWrapper>
      <CommandPalette />
      <SideBar />
      <div className={`flex h-[100vh] w-full flex-col `}>
        <Reader />
        <NavBar title={folder as string} />
        <FeedLayout FeedType="multiple" folderName={folder as string} />
      </div>
    </PageWrapper>
  );
};

export default Folder;
