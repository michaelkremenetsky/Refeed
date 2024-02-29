import { useCallback, useEffect, useRef, useState } from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";

import { Card } from "./Cards";

const TimeBookmarksCard = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

  const divRef = useRef<HTMLDivElement | null>(null);

  const formatTime = useCallback((seconds: number) => {
    let hours = seconds / 3600;
    hours = Math.round(hours);
    return `${hours}h`;
  }, []);

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 75;
      });
    }, 1);

    return interval;
  };

  const stopTimer = (interval: string | number | undefined) => {
    clearInterval(interval);
    setTimeLeft(24 * 60 * 60);
  };

  const handleMouseEnter = () => {
    // @ts-ignore
    divRef.current.interval = startTimer();
  };

  const handleMouseLeave = () => {
    // @ts-ignore
    stopTimer(divRef.current?.interval as string);

    // @ts-ignore
    divRef.current.interval = null;
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.addEventListener("mouseenter", handleMouseEnter);

      divRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (divRef.current) {
        divRef.current.removeEventListener("mouseenter", handleMouseEnter);
        divRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [divRef]);

  const [expanded, setExpanded] = useState(false);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={divRef}
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
      >
        <Card
          description="Add Bookmarks that disappear"
          title="Timed Bookmarks"
        >
          <div className="flex h-full w-full items-center justify-center">
            <m.div
              className={`relative mx-1 mt-1 flex w-[300px] cursor-default flex-row space-x-[4px] rounded-lg bg-white pb-2 pt-2 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] ${
                expanded
                  ? "border border-neutral-200"
                  : "border border-neutral-200"
              }
`}
            >
              <div
                className={`relative top-1 mb-3 ml-2 mr-1.5 h-20 w-[175px] rounded-md bg-[#DDDDDD] dark:bg-[#0f0f10] `}
              >
                <div className="h-full rounded bg-neutral-100 shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
              </div>
              <div className="flex w-full flex-col">
                <div className="mb-2 h-5 w-9/12 rounded bg-neutral-100 pl-2 pt-1 shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
                <div className="flex flex-row">
                  <div className="pl-0.5"></div>
                  <div className="flex flex-row pb-0.5 pl-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.65}
                      className="h-[14px] w-[14px] translate-y-[1.5px] stroke-sky-500"
                    >
                      <path
                        shapeRendering="geometricPrecision"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="pl-1"></div>
                    <div>
                      <p className="text-[12.25px] font-[425] text-sky-500">
                        {formatTime(timeLeft)} left
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </Card>
      </m.div>
    </LazyMotion>
  );
};

export const TimedBookmarkAnimated = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

  const divRef = useRef<HTMLDivElement | null>(null);

  const formatTime = useCallback((seconds: number) => {
    let hours = seconds / 3600;
    hours = Math.round(hours);
    return `${hours}h`;
  }, []);

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 75;
      });
    }, 1);

    return interval;
  };

  const stopTimer = (interval: string | number | undefined) => {
    clearInterval(interval);
    setTimeLeft(24 * 60 * 60);
  };

  const handleMouseEnter = () => {
    // @ts-ignore
    divRef.current.interval = startTimer();
  };

  const handleMouseLeave = () => {
    // @ts-ignore
    stopTimer(divRef.current?.interval as string);

    // @ts-ignore
    divRef.current.interval = null;
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.addEventListener("mouseenter", handleMouseEnter);

      divRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (divRef.current) {
        divRef.current.removeEventListener("mouseenter", handleMouseEnter);
        divRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [divRef]);

  return (
    <m.div
      className={`relative mx-1 mt-1 flex w-[300px] cursor-default flex-row space-x-[4px] rounded-lg border border-neutral-200 bg-white pb-2 pt-2 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)]
`}
    >
      <div
        className={`relative top-1 mb-3 ml-2 mr-1.5 h-20 w-[175px] rounded-md bg-[#DDDDDD] dark:bg-[#0f0f10] `}
      >
        <div className="h-full rounded bg-neutral-100 shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
      </div>
      <div className="flex w-full flex-col">
        <div className="mb-2 h-5 w-9/12 rounded bg-neutral-100 pl-2 pt-1 shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)]" />
        <div className="flex flex-row">
          <div className="pl-0.5"></div>
          <div className="flex flex-row pb-0.5 pl-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.65}
              className="h-[14px] w-[14px] translate-y-[1.5px] stroke-sky-500"
            >
              <path
                shapeRendering="geometricPrecision"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="pl-1"></div>
            <div>
              <p className="text-[12.25px] font-[425] text-sky-500">
                {formatTime(timeLeft)} left
              </p>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
};

export default TimeBookmarksCard;
