import Image from "next/image";
import Link from "next/link";
import { BottomFooter } from "@components/landing/Footer";
import NavBar from "@components/landing/NavBar";

import { decodeHtmlEntities } from "@refeed/lib/decodeHtmlEntities";

import { LandingWrapper } from "../../components/layout/PageWrapper";

export const Blog = () => {
  return (
    <LandingWrapper>
      <div>
        <div className=" overflow-hidden bg-[#FCFCFC] ">
          <div className="z-10 rounded-b-xl pt-5">
            <NavBar />
          </div>
          <div className=" bg-[#FCFCFC]">
            <div className="pb-20" />
            <div className="flex justify-center">
              <div className="w-[1200px] rounded-lg">
                <div className="mb-12 flex flex-col justify-center">
                  <h1 className="text-6xl font-bold tracking-tight">Blog</h1>
                  <div className="relative mt-20 grid w-full grid-cols-4 gap-4 border-b  py-8 first-of-type:pt-0 last-of-type:border-b-0 lg:py-24">
                    <h2>Jun 18, 2023</h2>
                    <div className="flex w-[800px] flex-col">
                      <figure className="h-[400px] w-[800px] rounded-md border bg-[#FCFCFC]">
                        <Image
                          src="/Screenshot 2024-02-22 at 02-37-15 Refeed.png"
                          alt="App screenshot"
                          priority
                          width={800}
                          height={400}
                          unoptimized
                          className="scale-[1.03] transform rounded-lg border border-neutral-200 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)]"
                        />
                      </figure>
                      <BlogArticle title="Refeed Version 1 is now out" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pb-20" />
            <div className="border">
              <BottomFooter />
            </div>
          </div>
        </div>
      </div>
    </LandingWrapper>
  );
};

const BlogArticle = ({ title }: { title: string }) => {
  return (
    <div
      className={`text-[#38383d] subpixel-antialiased dark:border-neutral-700 dark:text-[#F3F5F7] `}
    >
      <div className="mt-10 w-full">
        <Link
          className={
            "select-text text-3xl font-[700] no-underline subpixel-antialiased dark:text-[#F3F5F7]"
          }
          href="#"
        >
          {decodeHtmlEntities(title)}
        </Link>

        <div className="reader prose prose-lg mt-3 max-w-none text-[#38383d] subpixel-antialiased dark:prose-invert prose-a:underline prose-a:decoration-neutral-300 prose-a:decoration-[0.75px] hover:prose-a:decoration-neutral-500 hover:prose-a:decoration-[0.75px] dark:text-inherit dark:text-stone-200 dark:prose-a:decoration-[#F4F4F5]">
          Refeed Version 1 is now out. We have been working on this for a long
          time and we are finally ready to release it. We hope you like it.
        </div>
        <div className="my-4" />
      </div>
    </div>
  );
};

// @ts-ignore
Blog.theme = "light";

export default Blog;
