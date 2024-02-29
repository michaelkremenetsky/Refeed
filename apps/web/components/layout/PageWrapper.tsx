import type { ReactNode } from "react";
import localFont from "next/font/local";
import { motion } from "framer-motion";

const inter = localFont({
  src: "../../public/InterVariable.woff2",
  variable: "--font-inter",
  preload: true,
  display: "swap",
});

export const PageWrapper = ({
  children,
  disableDark,
}: {
  children: ReactNode;
  disableDark?: boolean;
}) => {
  return (
    <main
      className={`min-w-screen max-h-screen overflow-y-hidden dark:bg-[#0f0f10] ${inter.className} text-optimize-legibility subpixel-antialiased`}
    >
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <motion.div
        layout
        className={`flex overflow-x-hidden ${
          !disableDark && "dark:bg-[#0f0f10]"
        }`}
      >
        {children}
      </motion.div>
    </main>
  );
};

export const LandingWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <main
      className={` ${inter.className} text-optimize-legibility subpixel-antialiased`}
    >
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      {children}
    </main>
  );
};
