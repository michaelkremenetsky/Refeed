import Balancer from "react-wrap-balancer";

import { decodeHtmlEntities } from "@refeed/lib/decodeHtmlEntities";

import type { FeedTypes } from "../../types/feed";

export const Title = (props: { title: string; FeedType: FeedTypes }) => (
  <Balancer
    className={`w-[285px] select-text pl-2 pt-1 text-[15px] font-[600] leading-[18px] tracking-[-0.005em] subpixel-antialiased ${
      props.FeedType != "bookmarks"
        ? "text-[#333338] dark:text-stone-200"
        : null
    }`}
    preferNative={false}
    ratio={0.4}
  >
    {decodeHtmlEntities(props.title)}
  </Balancer>
);

export const CardTitle = (props: { title: string; FeedType: FeedTypes }) => (
  <Balancer
    className={`w-[240px] select-text pl-2 pt-1 text-[15px] font-[600] leading-[18px] tracking-[-0.005em] subpixel-antialiased ${
      props.FeedType != "bookmarks"
        ? "text-[#333338] dark:text-stone-200"
        : null
    }`}
    preferNative={false}
    ratio={0.4}
  >
    {decodeHtmlEntities(props.title)}
  </Balancer>
);
