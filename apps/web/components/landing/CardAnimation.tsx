import clsx from "clsx";
import { motion } from "framer-motion";

export const Test3Left = ({ i }: { i: number }) => {
  const variants = {
    animate: {
      y: [`0%`, `200%`],
      x: ["-350%", "50%"],
    },
  };

  return (
    <motion.div
      animate="animate"
      variants={variants}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "linear",
        delay: 0.5 * i,
      }}
      className={`transfrom absolute`}
    >
      <div>
        <ItemsNonAbsolute className="" />
      </div>
    </motion.div>
  );
};

export const Test3Right = ({ i }: { i: number }) => {
  const variants = {
    animate: {
      y: [`0%`, `200%`],
      x: ["50%", "-350%"],
    },
  };

  return (
    <motion.div
      animate="animate"
      variants={variants}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "linear",
        delay: 0.5 * i,
      }}
      className={`transfrom absolute`}
    >
      <div>
        <ItemsNonAbsolute className="" />
      </div>
    </motion.div>
  );
};

export const ItemsNonAbsolute = ({ className }: { className: string }) => {
  return (
    <div
      className={clsx(
        "mx-1 mt-1 flex w-[300px] cursor-default flex-row space-x-[4px] rounded-lg border border-neutral-200 bg-white pb-2 pt-2 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] dark:hover:bg-[#060606]",
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
