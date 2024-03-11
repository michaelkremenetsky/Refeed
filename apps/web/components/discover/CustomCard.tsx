import { ImageWithFallback } from "@components/layout/ImageWithFallback";
import clsx from "clsx";

import { decodeHtmlEntities } from "@refeed/lib/decodeHtmlEntities";

export const CustomCard = ({
  item,
  search_logo_url,
  className,
}: {
  item: any;
  search_logo_url?: string;
  className?: string;
}) => {
  const logoUrl = item.logo_url ?? search_logo_url;

  return (
    <div
      className={clsx(
        `${search_logo_url != undefined ? "dark:bg-[#0f0f10]" : "dark:bg-[#141415]"} text-optimize-legibility h-[200px] w-[275px] overflow-hidden rounded-lg border border-neutral-200 bg-white pb-2 pt-2 subpixel-antialiased shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] sm:w-[245px] dark:border-neutral-700/80 dark:shadow-sm`,
        className,
      )}
    >
      <div className="shadow-1 mb-2 ml-2.5 mt-1 flex h-[20px] w-[20px] items-center justify-center rounded">
        <ImageWithFallback
          height="20"
          width="20"
          alt="Logo Url"
          className="rounded-sm opacity-50"
          src={logoUrl}
        />
      </div>
      <div className="flex items-start">
        <h2 className="mx-2.5 line-clamp-3 text-sm font-medium text-neutral-700 dark:text-stone-200">
          {decodeHtmlEntities(item.title as string)}
        </h2>
      </div>
      <div className="flex h-full flex-col gap-2.5">
        <BlurredText className="mx-3 mt-3 h-2.5 rounded-sm " />
        <BlurredText className="mx-3 h-2.5 rounded-sm " />
        <BlurredText className="mx-3 h-2.5 rounded-sm " />
        <BlurredText className="mx-3 h-2.5 rounded-sm " />
      </div>
    </div>
  );
};

const BlurredText = ({ className }: { className: string }) => (
  <div
    className={clsx(
      "rounded bg-neutral-100 shadow-[0_0px_0px_1.25px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.06)] dark:bg-[#1e1e1f]",
      className,
    )}
  />
);
