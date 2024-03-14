import { useState } from "react";
import { ArticleTopbar } from "@components/reader/Reader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/Tooltip";
import dayjs from "dayjs";
import { useAtom, useAtomValue } from "jotai";
import { Maximize } from "lucide-react";
import Markdown from "marked-react";
import { trpc } from "utils/trpc";

import { useUser } from "@refeed/features/hooks/useUser";
import { decodeHtmlEntities } from "@refeed/lib/decodeHtmlEntities";
import type { ItemType } from "@refeed/types/item";
import { TextArea } from "@refeed/ui";

import { settingsAtom } from "../../stores/settings";
import Sharing from "../sharing/Sharing";
import { fullscreenAtom } from "./Reader";

interface ArticleProps {
  item: ItemType;
  FeedType: FeedType;
  Type: "Popup" | "Article View" | "Back" | "Full";
}

export const Article = (props: ArticleProps) => {
  const { item } = props;
  const { url, title, created_at } = item;

  const [notesOpen, setNotesOpen] = useState(false);
  const [fullContentExpanded, setFullContentExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useAtom(fullscreenAtom);
  const settings = useAtomValue(settingsAtom);

  const updateNoteinDB = trpc.pro.updateNote.useMutation();
  const updateNote = (note: string) => {
    updateNoteinDB.mutateAsync({ itemId: props.item.id, Note: note });
  };

  const { data: expandedContent } = trpc.pro.fetchFullContent.useQuery(
    { url: url },
    {
      enabled: fullContentExpanded,
    },
  );

  const { plan } = useUser();

  return (
    <div
      className={`mx-auto select-text break-words text-[#38383d] subpixel-antialiased dark:border-neutral-700 dark:text-[#F3F5F7] ${
        props.Type == "Popup"
          ? "w-[94.5%]"
          : props.Type == "Full"
            ? "h-[calc(100svh-3.4rem)]"
            : props.Type == "Article View"
              ? "overflow-hidden rounded-md"
              : ""
      }  `}
    >
      {props.Type == "Article View" ? (
        <div className="flex items-center rounded-t-md border-b bg-[#FCFCFC] py-3.5 dark:border-[#24252A] dark:bg-[#141415]">
          <div className="mx-auto flex w-[95%] justify-between">
            <ArticleTopbar openItemFromArticle={item} />
            <div>
              <Sharing />
            </div>
          </div>
        </div>
      ) : null}
      <div
        className={`w-full ${
          props.Type == "Article View" ? "px-5 py-4" : "px-[4px]"
        }`}
      >
        <div
          className={
            props.Type == "Article View"
              ? "mt-2"
              : props.Type == "Full"
                ? "mt-6"
                : "mt-5"
          }
        />
        <a
          className={
            "select-text text-3xl font-[700] leading-9 text-neutral-700 no-underline subpixel-antialiased dark:text-[#f3f3f7]"
          }
          rel="noopener noreferrer"
          href={url}
        >
          {decodeHtmlEntities(title)}
        </a>
        <div className="mb-5 mt-3 flex">
          <h4 className="font-base text-sm tracking-wide text-neutral-500/90 dark:text-stone-500">
            {"From "} {item.feed_title} on
            {dayjs(created_at).format(" MMMM D, YYYY [at] h:mmA")}
          </h4>
        </div>
        <div
          className={`${props.Type == "Full" && "w-fit md:w-[640px]"} reader prose prose-base mb-5 text-neutral-700 subpixel-antialiased dark:prose-invert prose-a:text-neutral-700 prose-a:underline prose-a:decoration-neutral-300/70 prose-a:decoration-[0.5px] prose-a:underline-offset-[3px] hover:prose-a:decoration-neutral-400/60 dark:text-inherit dark:text-stone-200 dark:prose-a:text-stone-200 dark:prose-a:decoration-[#F4F4F5]`}
        >
          <Markdown
            renderer={{
              image: (src, alt, title) => {
                return (
                  <img
                    className="mb-2 mt-3.5 h-auto w-full rounded-[3px] border border-[#f1f1f2] dark:border-neutral-800"
                    alt={alt}
                    src={src}
                    key={src + alt + title}
                  />
                );
              },
            }}
            value={
              !fullContentExpanded ? item.website_content! : expandedContent!
            }
          />
        </div>
        <div className="flex">
          <button className="w-full rounded-md border border-neutral-200 text-base font-medium hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-700/90">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={url}
              className="no-underline"
            >
              <h2 className="py-2 text-center font-[450] text-neutral-600/80 shadow-sm dark:text-gray-200">
                Visit Website
              </h2>
            </a>
          </button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => {
                    setFullContentExpanded(!fullContentExpanded);
                  }}
                  className="ml-2 flex w-[50px] justify-center rounded-md border border-neutral-200 py-2 text-base shadow-sm  hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-700/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-[22px] w-[22px] text-neutral-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                    />
                  </svg>
                </div>
              </TooltipTrigger>
              <TooltipContent>Fetch Full Content</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => setNotesOpen(!notesOpen)}
                  className="hover:border-gray-30 ml-2 flex w-[50px] justify-center rounded-md border border-neutral-200 py-2 text-base font-medium shadow-sm hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-700/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-[22px] w-[22px] stroke-neutral-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </div>
              </TooltipTrigger>
              <TooltipContent>Write Note</TooltipContent>
            </Tooltip>
            {props.Type != "Article View" && (
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => {
                      setFullscreen(!fullscreen);
                    }}
                    className="hover:border-gray-30 ml-2 flex w-[50px] justify-center rounded-md border border-neutral-200 py-2 text-base font-medium shadow-sm hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-700/90"
                  >
                    <Maximize className="h-[22px] w-[22px] stroke-neutral-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Full Screen</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
        {notesOpen || (item.note && plan == "pro") ? (
          <TextArea
            className="z-10 mt-4 w-full"
            placeholder="Write Note"
            name="postContent"
            onChange={(e) => {
              updateNote(e.target.value);
            }}
            defaultValue={item.note ?? settings.defaultNoteTemplate}
            onKeyDown={(event) => preventCarouselTrigger(event)}
            rows={5}
            maxLength={50}
          />
        ) : null}
        {props.Type != "Article View" ? (
          <div className="py-[18px]" />
        ) : (
          <div className="py-[6px]" />
        )}
      </div>
    </div>
  );
};
