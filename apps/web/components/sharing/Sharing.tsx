import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/DropDownMenu";
import { Facebook, Linkedin, Mail, Twitter } from "lucide-react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PocketShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";

import { useUser } from "@refeed/features/hooks/useUser";
import { useOpenItem } from "@refeed/features/item/useItemDataWeb";

const Sharing = () => {
  const { data } = useUser();

  const providers = data?.sharing;

  const { openItem } = useOpenItem();

  const includesAll =
    providers?.includes("Twitter") &&
    providers?.includes("Email") &&
    providers?.includes("Facebook") &&
    providers?.includes("Telegram") &&
    providers?.includes("Pocket") &&
    providers?.includes("Mastodon") &&
    providers?.includes("Linkedin");

  return (
    <div className="flex">
      {providers?.includes("Twitter") ? (
        <div className="pr-5">
          <TwitterShareButton
            title={openItem?.title}
            url={openItem?.url!}
            className="h-[22px] w-[22px]"
          >
            <Twitter
              shapeRendering="geometricPrecision"
              className="translate-y-[3px] transform stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
            />
          </TwitterShareButton>
        </div>
      ) : null}
      {providers?.includes("Email") ? (
        <div className="pr-5">
          <EmailShareButton url={openItem?.url!} className="h-[22px] w-[22px]">
            <Mail
              shapeRendering="geometricPrecision"
              className="translate-y-[3px] transform stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
            />
          </EmailShareButton>
        </div>
      ) : null}
      {providers?.includes("Facebook") ? (
        <div className="pr-5">
          <FacebookShareButton
            url={openItem?.url!}
            className="h-[22px] w-[22px]"
          >
            <Facebook
              shapeRendering="geometricPrecision"
              className="translate-y-[3px] transform stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
            />
          </FacebookShareButton>
        </div>
      ) : null}

      {providers?.includes("Telegram") ? (
        <div className="pr-5">
          <TelegramShareButton url={openItem?.url!}>
            <svg
              fill="transparent"
              shapeRendering="geometricPrecision"
              className="h-[22px] w-[22px] translate-y-[3px] transform overflow-visible stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
            >
              <path
                shapeRendering="geometricPrecision"
                d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"
              />
            </svg>
          </TelegramShareButton>
        </div>
      ) : null}
      {providers?.includes("Pocket") ? (
        <div className="pr-5">
          <PocketShareButton className="h-[22px] w-[22px]" url={openItem?.url!}>
            <svg
              fill="transparent"
              shapeRendering="geometricPrecision"
              className="h-[22px] w-[22px] translate-y-[3px] transform stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
            >
              <path
                shapeRendering="geometricPrecision"
                d="M5 4h14a2 2 0 0 1 2 2v6a9 9 0 0 1 -18 0v-6a2 2 0 0 1 2 -2"
              />
              <path shapeRendering="geometricPrecision" d="M8 11l4 4l4 -4" />
            </svg>
          </PocketShareButton>
        </div>
      ) : null}
      {providers?.includes("Mastodon") ? (
        <div className="pr-5">
          <PocketShareButton url={openItem?.url!}>
            <svg
              fill="transparent"
              shapeRendering="geometricPrecision"
              className="h-[22px] w-[22px] translate-y-[3px] overflow-visible stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
            >
              <path d="M18.648 15.254c-1.816 1.763 -6.648 1.626 -6.648 1.626a18.262 18.262 0 0 1 -3.288 -.256c1.127 1.985 4.12 2.81 8.982 2.475c-1.945 2.013 -13.598 5.257 -13.668 -7.636l-.026 -1.154c0 -3.036 .023 -4.115 1.352 -5.633c1.671 -1.91 6.648 -1.666 6.648 -1.666s4.977 -.243 6.648 1.667c1.329 1.518 1.352 2.597 1.352 5.633s-.456 4.074 -1.352 4.944z" />
              <path d="M12 11.204v-2.926c0 -1.258 -.895 -2.278 -2 -2.278s-2 1.02 -2 2.278v4.722m4 -4.722c0 -1.258 .895 -2.278 2 -2.278s2 1.02 2 2.278v4.722" />
            </svg>
          </PocketShareButton>
        </div>
      ) : null}
      {providers?.includes("Linkedin") ? (
        <div className={`${!includesAll && "pr-5"}`}>
          <LinkedinShareButton className="flex" url={openItem?.url!}>
            <Linkedin
              shapeRendering="geometricPrecision"
              className={`h-[22px] w-[22px] translate-y-[3px] transform overflow-visible stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400`}
            />
          </LinkedinShareButton>
        </div>
      ) : null}
      {!includesAll && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              shapeRendering="geometricPrecision"
              className="h-6 w-6 fill-neutral-450 stroke-neutral-450"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                shapeRendering="geometricPrecision"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="cursor-fix w-36" align="end">
            {!providers?.includes("Twitter") ? (
              <DropdownMenuItem>
                <TwitterShareButton
                  className="flex items-center"
                  url={openItem?.url!}
                >
                  <Twitter
                    shapeRendering="geometricPrecision"
                    className="mr-2 stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
                  />
                  <span>Twitter</span>
                </TwitterShareButton>
              </DropdownMenuItem>
            ) : null}
            {!providers?.includes("Email") ? (
              <DropdownMenuItem>
                <EmailShareButton
                  className="flex items-center"
                  url={openItem?.url!}
                >
                  <Mail
                    shapeRendering="geometricPrecision"
                    className="mr-2 stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
                  />
                  <span>Email</span>
                </EmailShareButton>
              </DropdownMenuItem>
            ) : null}
            {!providers?.includes("Facebook") ? (
              <DropdownMenuItem>
                <FacebookShareButton
                  className="flex items-center"
                  url={openItem?.url!}
                >
                  <Facebook
                    shapeRendering="geometricPrecision"
                    className="mr-2 stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
                  />
                  <span>Facebook</span>
                </FacebookShareButton>
              </DropdownMenuItem>
            ) : null}
            {!providers?.includes("Telegram") ? (
              <DropdownMenuItem>
                <TelegramShareButton
                  className="flex items-center"
                  url={openItem?.url!}
                >
                  <div className="mr-2 h-[22px] w-[22px]">
                    <svg
                      shapeRendering="geometricPrecision"
                      fill="transparent"
                      className="h-[16px] w-[16px] overflow-visible stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
                    >
                      <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                    </svg>
                  </div>

                  <span>Telegram</span>
                </TelegramShareButton>
              </DropdownMenuItem>
            ) : null}
            {!providers?.includes("Pocket") ? (
              <DropdownMenuItem>
                <PocketShareButton
                  className="flex items-center"
                  url={openItem?.url!}
                >
                  <svg
                    shapeRendering="geometricPrecision"
                    fill="transparent"
                    className="mr-2 h-[22px] w-[22px] stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
                  >
                    <path d="M5 4h14a2 2 0 0 1 2 2v6a9 9 0 0 1 -18 0v-6a2 2 0 0 1 2 -2" />
                    <path d="M8 11l4 4l4 -4" />
                  </svg>

                  <span>Pocket</span>
                </PocketShareButton>
              </DropdownMenuItem>
            ) : null}
            {!providers?.includes("Mastodon") ? (
              <DropdownMenuItem>
                <PocketShareButton
                  className="flex items-center"
                  url={openItem?.url!}
                >
                  <svg
                    fill="transparent"
                    shapeRendering="geometricPrecision"
                    className="mr-2 h-[22px] w-[22px] stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
                  >
                    <path
                      shapeRendering="geometricPrecision"
                      d="M18.648 15.254c-1.816 1.763 -6.648 1.626 -6.648 1.626a18.262 18.262 0 0 1 -3.288 -.256c1.127 1.985 4.12 2.81 8.982 2.475c-1.945 2.013 -13.598 5.257 -13.668 -7.636l-.026 -1.154c0 -3.036 .023 -4.115 1.352 -5.633c1.671 -1.91 6.648 -1.666 6.648 -1.666s4.977 -.243 6.648 1.667c1.329 1.518 1.352 2.597 1.352 5.633s-.456 4.074 -1.352 4.944z"
                    />
                    <path
                      shapeRendering="geometricPrecision"
                      d="M12 11.204v-2.926c0 -1.258 -.895 -2.278 -2 -2.278s-2 1.02 -2 2.278v4.722m4 -4.722c0 -1.258 .895 -2.278 2 -2.278s2 1.02 2 2.278v4.722"
                    />
                  </svg>

                  <span>Mastodon</span>
                </PocketShareButton>
              </DropdownMenuItem>
            ) : null}
            {!providers?.includes("Linkedin") ? (
              <DropdownMenuItem>
                <LinkedinShareButton
                  className="flex items-center"
                  url={openItem?.url!}
                >
                  <Linkedin
                    shapeRendering="geometricPrecision"
                    className="mr-2 h-[22px] w-[22px] overflow-visible stroke-neutral-450 stroke-[1.5] dark:stroke-stone-400"
                  />

                  <span>Linkedin</span>
                </LinkedinShareButton>
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default Sharing;
