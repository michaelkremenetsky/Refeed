import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { domAnimation, LazyMotion, m } from "framer-motion";

import TimeBookmarksCard from "./TimeBookmarksCard";

export const BookmarksSection = () => {
  return (
    <div className="mx-auto mb-2 mt-10 items-center justify-center space-y-6 lg:mx-0 lg:flex lg:space-x-6 lg:space-y-0">
      <TimeBookmarksCard />
      <BookmarkFolderCard />
      <NotesCard />
    </div>
  );
};

export const NotesCard = () => {
  const [expanded, setExpanded] = useState(false);

  const parentVariants = {
    hover: {
      height: "225px",
      scale: 1.04,
      transition: { duration: 0.5 },
    },
    hidden: { height: "175px", scale: 1 },
  };

  const contentVariants = {
    hover: { opacity: 1, transition: { duration: 0.5 }, y: 0 },
    hidden: { opacity: 0, y: 10 },
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
      >
        <Card title="Notes" description="Write notes while reading">
          <div className="mt-4">
            <m.div
              whileHover="hover"
              animate={expanded ? "hover" : "hidden"}
              variants={parentVariants}
              className={`mb-4 w-[245px] overflow-hidden rounded-lg border border-neutral-200 bg-white pb-2 pt-2 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)]  ${
                expanded
                  ? "border border-neutral-200"
                  : "border border-neutral-200"
              }`}
            >
              <div className="hackernews-logo-shadow h-[22px mb-2 ml-2.5 mt-1 flex w-[22px] items-center justify-center rounded bg-[#FF6600]/50">
                <Image
                  alt="Hacker News Logo"
                  height="20"
                  width="20"
                  className="opacity-50"
                  src="/hacker-news.ico"
                />
              </div>
              <h2 className="mx-2 text-sm font-medium text-neutral-700">
                Does the rock float?
              </h2>
              <h3 className="mx-2 text-sm font-medium text-neutral-400 dark:text-stone-400">
                twitter.com
              </h3>
              <div className="flex flex-col gap-2.5">
                <BlurredText className="mx-3 mt-3 h-2.5 rounded-sm" />
                <BlurredText className="mx-3 h-2.5 rounded-sm" />
              </div>
              <m.div
                initial="hidden"
                animate={expanded ? "hover" : "hidden"}
                variants={contentVariants}
              >
                <div className="flex justify-center">
                  <textarea
                    className={`my-4 h-[75px] w-11/12 resize-none rounded-md border-neutral-200 `}
                    name="Folders"
                    placeholder="Write Note"
                    rows={5}
                    maxLength={50}
                  />
                </div>
              </m.div>
            </m.div>
          </div>
        </Card>
      </m.div>
    </LazyMotion>
  );
};

export const BookmarkFolderCard = () => {
  const [expanded, setExpanded] = useState(false);

  const card1 = {
    hover: {
      opacity: 1,
      y: -16,
      scale: 1,
    },
    hidden: {
      scale: 1,
      opacity: 0,
      x: 0,
      y: 0,
    },
  };

  const card2 = {
    hover: {
      opacity: 1,
      y: -32,
      scale: 0.95,
    },
    hidden: {
      scale: 1,
      opacity: 0,
      x: 0,
      y: 0,
    },
  };

  const card3 = {
    hover: {
      opacity: 1,
      y: -48,
      scale: 0.9,
    },
    hidden: {
      scale: 1,
      opacity: 0,
      x: 0,
      y: 0,
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
      >
        <Card
          description="Organize your Bookmarks to into Folders"
          title="Bookmark Folders"
        >
          <m.div className={`${expanded ? "" : null}`}>
            <m.div
              initial="hidden"
              animate={expanded ? "hover" : "hidden"}
              variants={card3}
              className="flex h-full items-center justify-center"
            >
              <BookmarkFolders
                className={` ${expanded ? "border border-neutral-200" : null} `}
              />
            </m.div>
            <m.div
              animate={expanded ? "hover" : "hidden"}
              variants={card2}
              initial="hidden"
              className="flex h-full items-center justify-center"
            >
              <BookmarkFolders
                className={` ${expanded ? "border border-neutral-200" : null} `}
              />
            </m.div>
            <m.div
              initial="hidden"
              animate={expanded ? "hover" : "hidden"}
              variants={card1}
              className="flex h-full items-center justify-center"
            >
              <BookmarkFolders
                className={` ${
                  expanded ? "border border-neutral-200 " : null
                } `}
              />
            </m.div>
            <m.div
              animate={expanded ? { scale: 1.05 } : { scale: 1 }}
              className={"flex h-full items-center justify-center"}
            >
              <BookmarkFolders className="border border-neutral-200 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)]" />
            </m.div>
          </m.div>
        </Card>
      </m.div>
    </LazyMotion>
  );
};

export const Items = ({ className }: { className: string }) => {
  return (
    <div
      className={clsx(
        "absolute mx-1 mt-1 flex w-[300px] cursor-default flex-row space-x-[4px] rounded-lg border border-neutral-200 bg-white pb-2 pt-2 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] dark:hover:bg-[#060606]",
        className,
      )}
    >
      <div
        className={`relative top-1 mb-3 ml-2 mr-1.5 h-20 w-[175px] rounded-md bg-[#DDDDDD] dark:bg-[#0f0f10] `}
      >
        <div className="h-full rounded bg-neutral-100 shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
      </div>
      <div className="flex w-full flex-col">
        <div className="mb-2 h-5 w-9/12 rounded bg-neutral-100 pl-2 pt-1 shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
      </div>
    </div>
  );
};

export const BookmarkFolders = ({ className }: { className: string }) => {
  return (
    <div
      className={clsx(
        "dark:hover:bg-[#060606]) absolute mx-1 mt-1 flex w-[300px] cursor-default flex-row space-x-[4px] rounded-lg bg-white pb-2 pt-2",
        className,
      )}
    >
      <div
        className={`relative top-1 mb-3 ml-2 mr-1.5 h-20 w-[175px] rounded-md bg-[#DDDDDD] dark:bg-[#0f0f10] `}
      >
        <div className="h-full rounded bg-neutral-100 shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
      </div>
      <div className="flex w-full flex-col">
        <div className="mb-2 h-5 w-9/12 rounded bg-neutral-100 pl-2 pt-1 shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
        <div>
          <span className="ml-1.5 h-4 rounded bg-[#0496FF]/10 px-1 text-right text-xs font-[500] text-sky-500">
            To Research
          </span>
        </div>
      </div>
    </div>
  );
};

export const Card = (props: {
  description: string;
  title: string;
  multipler?: number;
  background?: string;
  children: JSX.Element;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        animate={expanded ? "hover" : "hidden"}
        // variants={cardVariants}
        className={`mx-auto flex overflow-hidden ${
          props.multipler ? "sm:w-[400px] md:w-[825px]" : "md:w-[400px]"
        } mx-1 h-[400px] rounded-xl border   ${
          expanded
            ? "bg-neutral-50"
            : props.background
              ? props.background
              : " bg-[#fcfcfc]"
        } md:mx-0 ${expanded ? "" : null}`}
      >
        <div className="flex w-full flex-col">
          <div className="flex h-full select-none items-center justify-center">
            {props.children}
          </div>
          <div className="ml-6 mr-2 mt-4 flex flex-col pb-4">
            <h1 className="z-10 select-none text-lg font-[550]">
              {props.title}
            </h1>

            <h2 className="font-regular z-10 select-none text-lg text-neutral-400 dark:text-stone-400">
              {props.description}
            </h2>
          </div>
        </div>
      </m.div>
    </LazyMotion>
  );
};

export const FullContentCard = () => {
  const [expanded, setExpanded] = useState(false);

  const parentVariants = {
    hover: {
      height: "225px",
      scale: 1.04,
      transition: { duration: 0.5 },
    },
    hidden: { height: "135px", scale: 1 },
  };

  const contentVariants = {
    hover: { opacity: 1, transition: { duration: 0.5 }, y: 0 },
    hidden: { opacity: 0, y: 10 },
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
      >
        <Card
          title="Fetch full content"
          description="Fetch the full website before visiting"
        >
          <div className="mt-4">
            <m.div
              whileHover="hover"
              animate={expanded ? "hover" : "hidden"}
              variants={parentVariants}
              className="mb-4 w-[245px] overflow-hidden rounded-lg border border-neutral-200 bg-white pb-2 pt-2 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)]"
            >
              <div className="shadow-1 h-[22px mb-2 ml-2.5 mt-1 flex w-[22px] items-center justify-center rounded bg-[#4C02E8]/20">
                <Image
                  alt="Verge Logo"
                  height="20"
                  width="20"
                  className="opacity-50"
                  src="/verge.ico"
                />
              </div>
              <h2 className="mx-2 text-sm font-medium text-neutral-700">
                Neuralink is recruiting subjects for the first human trial of
                its brain-computer interface
              </h2>
              <h3 className="mx-2 text-sm font-medium text-neutral-400 dark:text-stone-400">
                theverge.com
              </h3>
              <m.div
                initial="hidden"
                animate={expanded ? "hover" : "hidden"}
                variants={contentVariants}
              >
                <div className="flex h-full flex-col gap-2.5">
                  <BlurredText className="mx-3 mt-3 h-2.5 rounded-sm" />
                  <BlurredText className="mx-3 h-2.5 rounded-sm" />
                  <BlurredText className="mx-3 h-2.5 rounded-sm" />
                  <BlurredText className="mx-3 h-2.5 rounded-sm" />
                </div>
              </m.div>
            </m.div>
          </div>
        </Card>
      </m.div>
    </LazyMotion>
  );
};

export const BlurredText = ({ className }: { className: string }) => (
  <div
    className={clsx(
      "rounded bg-neutral-100 shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]",
      className,
    )}
  />
);
