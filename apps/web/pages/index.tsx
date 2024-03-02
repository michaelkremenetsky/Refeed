import type { NextPage } from "next";
import { BottomFooter } from "@components/landing/Footer";
import { NextSeo } from "next-seo";

import {
  BookmarkFolderCard,
  FullContentCard,
  NotesCard,
} from "../components/landing/Cards";
import { FilterCard } from "../components/landing/FilterCard";
import Hero from "../components/landing/Hero";
import { MobileCard } from "../components/landing/MobileBlock";
import NavBar from "../components/landing/NavBar";
import TimeBookmarksCard from "../components/landing/TimeBookmarksCard";
import { LandingWrapper } from "../components/layout/PageWrapper";

const Landing: NextPage = () => {
  return (
    <LandingWrapper>
      <NextSeo
        title="Refeed Reader - Open Source RSS Reader"
        description="Refeed is an Open Source RSS Reader. It allows you to consume better content faster."
      />
      <div className="background-pattern overscroll-hidden z-10 rounded-b-xl border-b border-[#D9D9D9] bg-[#fafafa]">
        <NavBar />
        <Hero />
        <div className="-z-10 bg-white">
          <div className="pb-20" />
          <div className="mx-auto mt-24 flex w-full justify-center px-1.5">
            <div className="mx-4 grid grid-cols-1 gap-6 md:mx-0 md:grid-cols-2 xl:grid-cols-3">
              <TimeBookmarksCard />
              <BookmarkFolderCard />
              <NotesCard />
              <div className="xl:hidden">
                <FullContentCard />
              </div>
            </div>
          </div>
          <div className="mx-auto mt-4 w-full justify-center px-1.5 md:flex">
            <div className="mx-4 grid grid-cols-1 gap-6 md:mx-0 md:grid-cols-2 xl:grid-cols-3">
              <div className="md:col-span-2">
                <FilterCard />
              </div>
              <div className="hidden xl:block">
                <FullContentCard />
              </div>
            </div>
          </div>
          <div className="pb-6" />
          <MobileCard />
          <BottomFooter />
        </div>
      </div>
    </LandingWrapper>
  );
};

// @ts-ignore
Landing.theme = "light";

export default Landing;
