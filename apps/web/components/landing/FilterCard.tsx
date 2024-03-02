import { useEffect, useState } from "react";
import { domAnimation, LazyMotion, m, useAnimation } from "framer-motion";

import { ProBadge } from "@refeed/ui";

import { Card, Items } from "./Cards";
import { LandingToggleFilter } from "./LandingToggleFilter";

export const AnimatedSquareRand = ({
  initialY,
  initialX,
  animateTo,
  run,
}: {
  initialY: number;
  initialX: number;
  animateTo: number;
  run?: boolean;
}) => {
  const controls = useAnimation();

  useEffect(() => {
    if (run) {
      controls.start({ y: animateTo });
    } else {
      controls.stop();
    }
  }, [run, controls, animateTo]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="relative -z-10"
        initial={{ y: initialY, x: initialX }}
        animate={controls}
        transition={{
          duration: 20, // 800 / 125
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        <Items className="shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
      </m.div>
    </LazyMotion>
  );
};

export const FilterAnimation = ({
  initialY,
  animateTo,
  run,
}: {
  initialY: number;
  animateTo: number;
  run?: boolean;
}) => {
  const controls = useAnimation();

  useEffect(() => {
    if (run) {
      // controls.start({ y: animateTo });
      controls.start({ transform: `translate(0px, ${animateTo}px)` });
    } else {
      controls.stop();
    }
  }, [run, controls, animateTo]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        // initial={{ y: initialY }}
        initial={{ transform: `translate(0px, ${initialY}px)` }}
        animate={controls}
        transition={{
          duration: 400 / 125,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        <Items className="shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
      </m.div>
    </LazyMotion>
  );
};

export const SignInAnimatedSquare = ({
  initialY,
  animateTo,
  run,
}: {
  initialY: number;
  animateTo: number;
  run?: boolean;
}) => {
  const controls = useAnimation();

  useEffect(() => {
    if (run) {
      // controls.start({ y: animateTo });
      controls.start({ transform: `translate(0px, ${animateTo}px)` });
    } else {
      controls.stop();
    }
  }, [run, controls, animateTo]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        // initial={{ y: initialY }}
        initial={{ transform: `translate(0px, ${initialY}px)` }}
        animate={controls}
        transition={{
          duration: 40,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        <Items className="shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
      </m.div>
    </LazyMotion>
  );
};

export const FilterCard = () => {
  const [noteExpanded1, setNoteExpanded1] = useState(false);
  const Filter1 = {
    id: 0,
    enabled: false,
    user_id: "",
    filter: {
      Feeds: [
        "https://cdn.vox-cdn.com/verge/favicon.ico",
        // "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
      ], // Replaced with links unlink the real one
      Content: "Title",
      Logic: "Equals",
      Keywords: ["Floating Rock", " Neuralink"],
    },
  };

  const [noteExpanded2, setNoteExpanded2] = useState(false);
  const Filter2 = {
    id: 1,
    enabled: false,
    user_id: "",
    filter: {
      Feeds: [
        "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
        // "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
      ], // Replaced with links unlink the real one
      Content: "Anywhere",
      Logic: "Does Not Contain",
      Keywords: ["IPO", " Meta", " Apple", " Amazon", " Tesla", " Google"],
    },
  };

  // const [expanded, setExpanded] = useState(false);
  // const initialSeparation = 110 + 15;

  const Filter3 = {
    id: 0,
    enabled: false,
    user_id: "",
    filter: {
      Feeds: [
        "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
        // "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
      ], // Replaced with links unlink the real one
      Content: "Content",
      Logic: "Contain",
      Keywords: ["test", "test"],
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
      // onHoverStart={() => setExpanded(true)}
      // onHoverEnd={() => setExpanded(false)}
      >
        <Card
          description="Filter out items based on conditions"
          title="Filtering System"
          multipler={2}
        >
          <>
            <div className="ml-5 mr-20 flex w-full justify-center sm:overflow-hidden">
              <div
                className={`${noteExpanded1 || noteExpanded2 ? "pt-4" : "py-20"} flex md:block`}
              >
                <div className="mb-1 ml-1.5 flex flex-col">
                  <h1 className="mb-1 select-none text-sm font-medium leading-5">
                    Filters
                    <ProBadge className="ml-1.5" />
                  </h1>
                  <h4 className="mb-2.5 select-none text-sm leading-5 text-neutral-450 dark:text-stone-500">
                    Filter out items based on conditions
                  </h4>
                </div>
                <div className="flex flex-col space-y-2">
                  <LandingToggleFilter
                    filter={Filter1 as any}
                    notesOpen={noteExpanded1}
                    setNotesOpen={setNoteExpanded1}
                  />
                  <LandingToggleFilter
                    filter={Filter2 as any}
                    notesOpen={noteExpanded2}
                    setNotesOpen={setNoteExpanded2}
                  />
                </div>
              </div>
            </div>
            {/* <div className="-translate-x-[330px] -translate-y-[800px]">
              <div className="">
                {[...Array(10)]?.map((data, x) => (
                  <FilterAnimation
                    key={x}
                    animateTo={x * initialSeparation + 400}
                    initialY={x * initialSeparation}
                    run={expanded ? true : false}
                  />
                ))}
              </div>
              <div className="flex h-full flex-col overflow-hidden"></div>
            </div> */}
          </>
        </Card>
      </m.div>
    </LazyMotion>
  );
};
