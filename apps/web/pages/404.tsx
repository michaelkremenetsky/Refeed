import Link from "next/link";
import { PageWrapper } from "@components/layout/PageWrapper";

function ErrorPage() {
  return (
    <PageWrapper>
      <div className="mx-auto flex h-screen text-[#38383d]">
        <div className="flex w-full items-center justify-center">
          <div className="text-center">
            <p className="text-base font-semibold text-sky-500">404</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-700 sm:text-5xl">
              Page Not Found
            </h1>
            <p className="text-neutral-50-600 mt-6 text-base leading-7 text-neutral-450">
              We couldn’t find the page you’re looking for.
            </p>
            <div className="mt-5 flex items-center justify-center">
              <Link
                href="/"
                className="rounded-md border border-[#DCDCDC] bg-white px-4 py-1.5 text-base font-medium shadow-[0_1px_2px_rgba(16,29,52,.15)] hover:bg-[#fafafa]"
              >
                Go back home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// @ts-ignore
ErrorPage.theme = "light";

export default ErrorPage;
