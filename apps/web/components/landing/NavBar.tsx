import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/NavigationMenu";
import LoginButton from "./LoginButton";
import TryNowButton from "./TryNowButton";

export default function NavBar() {
  return (
    <nav className="sticky top-2 z-50 flex h-12 justify-center px-2 md:top-5 md:px-0">
      <div className="mx-1 flex w-full transform items-center justify-center rounded-[10px] border bg-white shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] md:w-fit">
        <Link
          href="/"
          className="ml-4 mr-5 flex items-start text-base font-[650]"
        >
          Refeed
        </Link>
        <MobileNav />
        <div className="flex items-center space-x-5 text-sm font-[550]">
          <Link href="/pricing" className="hidden md:block">
            Pricing
          </Link>
          {/* <Link className="hidden md:block" href="/features">
            Features
          </Link> */}
          <Link
            className={`hidden md:block`}
            href="https://github.com/michaelkremenetsky/Refeed"
          >
            Github
          </Link>
          <Link
            className="hidden md:block"
            href="https://github.com/users/michaelkremenetsky/projects/3"
          >
            Roadmap
          </Link>
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="center">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[200px] bg-white py-2">
                    <Link href="/about" className="cursor-default">
                      <NavigationButton title="About" subtitle="About Us" />
                    </Link>
                    <Link
                      href="https://github.com/michaelkremenetsky/Refeed?tab=readme-ov-file#self-hosting-with-docker"
                      className="cursor-default"
                    >
                      <NavigationButton
                        title="Self Host"
                        subtitle="Self Host Refeed"
                      />
                    </Link>
                    <Link
                      href="https://github.com/michaelkremenetsky/Refeed?tab=readme-ov-file#contributing"
                      className="cursor-default"
                    >
                      <NavigationButton
                        title="Contributing"
                        subtitle="Contribute to Refeed"
                      />
                    </Link>
                    <Link
                      href="https://github.com/michaelkremenetsky/Refeed/issues"
                      className="cursor-default"
                    >
                      <NavigationButton
                        title="Report an Issue"
                        subtitle="Report on Github"
                      />
                    </Link>
                    <Link href="/privacy" className="cursor-default">
                      <NavigationButton
                        title="Privacy Policy"
                        subtitle="Our Privacy Policy"
                      />
                    </Link>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/** md:ml-32 */}
        <div className="mx-auto ml-auto mr-1.5 space-x-3 md:ml-44">
          <Link href="/login">
            <LoginButton />
          </Link>
          <Link href="/signup">
            <TryNowButton />
          </Link>
        </div>
      </div>
    </nav>
  );
}

const MobileNav = () => {
  return (
    <div className="md:hidden">
      <NavigationMenu>
        <NavigationMenuList className="center">
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <span>Links</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[200px] bg-white py-2">
              <Link href="/pricing">
                <NavigationButton title="Pricing" subtitle="Refeed Pricing" />
              </Link>
              <Link href="https://github.com/michaelkremenetsky/Refeed">
                <NavigationButton
                  title="Github"
                  subtitle="Refeed Source Code"
                />
              </Link>
              <Link href="https://github.com/users/michaelkremenetsky/projects/3">
                <NavigationButton title="Roadmap" subtitle="Our Roadmap" />
              </Link>
              <Link href="/about">
                <NavigationButton title="About" subtitle="About Us" />
              </Link>
              <Link href="https://github.com/michaelkremenetsky/Refeed?tab=readme-ov-file#self-hosting-with-docker">
                <NavigationButton
                  title="Self Host"
                  subtitle="Self Host Refeed"
                />
              </Link>
              <Link href="https://github.com/michaelkremenetsky/Refeed?tab=readme-ov-file#contributing">
                <NavigationButton
                  title="Contributing"
                  subtitle="Contribute to Refeed"
                />
              </Link>
              <Link href="https://github.com/michaelkremenetsky/Refeed/issues">
                <NavigationButton
                  title="Report an Issue"
                  subtitle="Report on Github"
                />
              </Link>
              <Link href="/privacy">
                <NavigationButton
                  title="Privacy Policy"
                  subtitle="Refeed Privacy Policy"
                />
              </Link>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

const NavigationButton = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="ml-2 mr-2 flex flex-col rounded-md py-2 pl-2 hover:bg-neutral-100/80">
      <h1 className="z-10 select-none text-sm font-[550] text-[#38383d]">
        {title}
      </h1>
      <h2 className="font-regular z-10 mt-0.5 select-none text-sm font-[425] text-neutral-450 dark:text-stone-400">
        {subtitle}
      </h2>
    </div>
  );
};
