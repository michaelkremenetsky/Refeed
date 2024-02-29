import type { NextPage } from "next";
import { BottomFooter } from "@components/landing/Footer";
import { NextSeo } from "next-seo";

import {
  BookmarkFolderCard,
  FullContentCard,
  NotesCard,
} from "../components/landing/Cards";
import { FilterCard } from "../components/landing/FilterCard";
import NavBar from "../components/landing/NavBar";
import TimeBookmarksCard from "../components/landing/TimeBookmarksCard";
import { LandingWrapper } from "../components/layout/PageWrapper";

const Features: NextPage = () => {
  return (
    <LandingWrapper>
      <NextSeo
        title="Refeed Reader - Open Source RSS Reader"
        description="Refeed is an Open Source RSS Reader. It allows you to consume better content faster."
      />
      <div className="overscroll-hidden z-10 rounded-b-xl border-b border-[#D9D9D9]">
        <NavBar />
        <div className="mt-20 flex justify-center">
          <h1 className="text-6xl font-bold tracking-tight">Features</h1>
        </div>
        <div className="-z-10 ">
          {/* <div className="pb-20" /> */}
          <div className="mx-auto mt-24 flex w-full justify-center px-1.5">
            <div className="mx-4 grid grid-cols-1 gap-6 md:mx-0 md:grid-cols-2 xl:grid-cols-3">
              <TimeBookmarksCard />
              <BookmarkFolderCard />
              <NotesCard />
            </div>
          </div>
          <div className="mx-auto mt-4 w-full justify-center px-1.5 sm:flex">
            <div className="mx-4 grid grid-cols-1 gap-6 md:mx-0 lg:grid-cols-2 xl:grid-cols-3">
              <div className="lg:col-span-2">
                <FilterCard />
              </div>
              <FullContentCard />
            </div>
          </div>
          <div className="pb-6" />
          {/* <MobileCard /> */}
          <BottomFooter />
        </div>
      </div>
    </LandingWrapper>
  );
};

// @ts-ignore
Features.theme = "light";

export default Features;
