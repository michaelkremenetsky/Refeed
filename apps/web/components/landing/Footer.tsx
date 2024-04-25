import type { SVGProps } from "react";
import Link from "next/link";

export const BottomFooter = () => {
  return (
    <footer className="bg-white pt-6 dark:bg-neutral-900">
      <div className="w-full max-w-screen-xl p-4 py-6 sm:mx-2 md:mx-auto md:w-[825px] md:py-8 xl:w-[1252px]">
        <div className="md:flex md:justify-between">
          <div className="mb-6 flex flex-col md:mb-0">
            <span className="select-none text-base text-neutral-500 sm:text-center">
              © 2023{" "}
              <a href="https://refeedreader.com/" className="hover:underline">
                Refeed
              </a>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            <div>
              <h2 className="mb-6 text-base font-medium text-neutral-900 dark:text-white">
                Resources
              </h2>
              <ul className="font-medium text-neutral-450">
                <li className="mb-4">
                  <Link href="/pricing" className="hover:underline">
                    Pricing
                  </Link>
                </li>

                <li className="mb-4">
                  <a href="/mobile" className="hover:underline">
                    Mobile App
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:underline">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-base font-medium text-neutral-900 dark:text-white">
                Developers
              </h2>
              <ul className="font-medium text-neutral-450">
                <li className="mb-4">
                  <Link
                    href="https://github.com/michaelkremenetsky/Refeed?tab=readme-ov-file#self-hosting-with-docker"
                    className="hover:underline"
                  >
                    Self Hosting
                  </Link>
                </li>
                <li className="mb-4">
                  <a
                    href="https://github.com/michaelkremenetsky/Refeed/issues"
                    className="hover:underline"
                  >
                    Report an Issue
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://github.com/users/michaelkremenetsky/projects/3"
                    className="hover:underline"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-base font-medium text-neutral-900 dark:text-white">
                Follow us
              </h2>
              <ul className="font-medium text-neutral-450">
                <li className="mb-4">
                  <a
                    href="https://github.com/michaelkremenetsky/Refeed/issues"
                    className="hover:underline"
                  >
                    Github
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://twitter.com/mkremenetsky"
                    className="hover:underline"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/michaelkremenetsky/Refeed?tab=readme-ov-file#contributing"
                    className="hover:underline"
                  >
                    Contributing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-base font-medium text-neutral-900 dark:text-white">
                Legal
              </h2>
              <ul className="font-medium text-neutral-450">
                <li className="mb-4">
                  <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a href="/terms" className="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const EmptyMessageSvgForFooter = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 224 200"
    fill="none"
    {...props}
  >
    <path
      fill="#fcfcfd"
      stroke="#d4d4d4"
      strokeWidth={1.5}
      d="M44.478 73h133.444a9.001 9.001 0 0 1 8.975 8.327l8.1 108c.391 5.221-3.739 9.673-8.975 9.673H36.378c-5.236 0-9.366-4.452-8.975-9.673l8.1-108A9 9 0 0 1 44.478 73Z"
      className="box-shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px]"
    />
    <path
      fill="#fcfcfd"
      stroke="#d4d4d4"
      strokeWidth={1.5}
      d="M31.577 44.2h159.246a9 9 0 0 1 8.966 8.214l9.462 108.001c.461 5.26-3.685 9.785-8.966 9.785H22.115c-5.281 0-9.427-4.525-8.966-9.785l9.462-108a9 9 0 0 1 8.966-8.215Z"
      className="box-shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px]"
    />
    <path
      fill="#fcfcfd"
      stroke="#d4d4d4"
      strokeWidth={1.5}
      d="M28.276 1h164.941a9 9 0 0 1 8.893 7.612l19.101 122.4c.851 5.458-3.369 10.388-8.893 10.388H11.468c-5.458 0-9.66-4.818-8.917-10.224L19.36 8.776A9 9 0 0 1 28.276 1Z"
      className="box-shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px]"
    />
  </svg>
);
