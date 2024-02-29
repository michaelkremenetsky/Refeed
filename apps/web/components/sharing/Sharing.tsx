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
import { trpc } from "utils/trpc";

import { useOpenItem } from "@refeed/features/item/useItemDataWeb";

// TODO: Make this better, Make it look more like the youtube sharing?

const Sharing = () => {
  const providers = trpc.settings.getShareProviders.useQuery(undefined, {
    staleTime: Infinity,
  }).data;

  const { openItem } = useOpenItem();

  return (
    <div className="flex">
      {providers?.includes("Twitter") ? (
        <div className="pr-5">
          <TwitterShareButton
            title={openItem?.title}
            url={openItem?.url!}
            className="h-6 w-6"
          >
            <Twitter className="translate-y-[3px] transform stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400" />
          </TwitterShareButton>
        </div>
      ) : null}
      {providers?.includes("Email") ? (
        <div className="pr-5">
          <EmailShareButton url={openItem?.url!} className="h-6 w-6">
            <Mail className="translate-y-[3px] transform stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400" />
          </EmailShareButton>
        </div>
      ) : null}
      {providers?.includes("Facebook") ? (
        <div className="pr-5">
          <FacebookShareButton url={openItem?.url!} className="h-6 w-6">
            <Facebook className="translate-y-[3px] transform stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400" />
          </FacebookShareButton>
        </div>
      ) : null}

      {providers?.includes("Telegram") ? (
        <div className="pr-5">
          <TelegramShareButton url={openItem?.url!}>
            <svg
              fill="transparent"
              className="h-6 w-6 translate-y-[3px] transform overflow-visible stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
            >
              <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
            </svg>
          </TelegramShareButton>
        </div>
      ) : null}
      {providers?.includes("Pocket") ? (
        <div className="pr-5">
          <PocketShareButton className="h-6 w-6" url={openItem?.url!}>
            <svg
              fill="transparent"
              className="h-6 w-6 translate-y-[3px] transform stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
            >
              <path d="M5 4h14a2 2 0 0 1 2 2v6a9 9 0 0 1 -18 0v-6a2 2 0 0 1 2 -2" />
              <path d="M8 11l4 4l4 -4" />
            </svg>
          </PocketShareButton>
        </div>
      ) : null}
      {providers?.includes("Mastodon") ? (
        <div className="pr-5">
          <PocketShareButton url={openItem?.url!}>
            <svg
              fill="transparent"
              className="h-6 w-6 translate-y-[3px] overflow-visible stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
            >
              <path d="M18.648 15.254c-1.816 1.763 -6.648 1.626 -6.648 1.626a18.262 18.262 0 0 1 -3.288 -.256c1.127 1.985 4.12 2.81 8.982 2.475c-1.945 2.013 -13.598 5.257 -13.668 -7.636l-.026 -1.154c0 -3.036 .023 -4.115 1.352 -5.633c1.671 -1.91 6.648 -1.666 6.648 -1.666s4.977 -.243 6.648 1.667c1.329 1.518 1.352 2.597 1.352 5.633s-.456 4.074 -1.352 4.944z" />
              <path d="M12 11.204v-2.926c0 -1.258 -.895 -2.278 -2 -2.278s-2 1.02 -2 2.278v4.722m4 -4.722c0 -1.258 .895 -2.278 2 -2.278s2 1.02 2 2.278v4.722" />
            </svg>
          </PocketShareButton>
        </div>
      ) : null}
      {providers?.includes("Linkedin") ? (
        <div className="pr-5">
          <LinkedinShareButton className="flex" url={openItem?.url!}>
            <Linkedin className="h-6 w-6 translate-y-[3px] transform overflow-visible stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400" />
          </LinkedinShareButton>
        </div>
      ) : null}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#929396"
            className="light:hover:fill-neutral-400 h-6 w-6 stroke-2 dark:fill-[#929396]"
          >
            <path
              fillRule="evenodd"
              d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
              clipRule="evenodd"
            />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="cursor-fix w-36" align="end">
          {!providers?.includes("Twitter") ? (
            <DropdownMenuItem className="">
              <TwitterShareButton className="flex" url={openItem?.url!}>
                <Twitter className="mr-2 stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400" />
                <span>Twitter</span>
              </TwitterShareButton>
            </DropdownMenuItem>
          ) : null}
          {!providers?.includes("Email") ? (
            <DropdownMenuItem>
              <EmailShareButton className="flex" url={openItem?.url!}>
                <Mail className="mr-2 stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400" />
                <span>Email</span>
              </EmailShareButton>
            </DropdownMenuItem>
          ) : null}
          {!providers?.includes("Facebook") ? (
            <DropdownMenuItem>
              <FacebookShareButton className="flex" url={openItem?.url!}>
                <Facebook className="mr-2 stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400" />
                <span>Facebook</span>
              </FacebookShareButton>
            </DropdownMenuItem>
          ) : null}
          {!providers?.includes("Telegram") ? (
            <DropdownMenuItem>
              <TelegramShareButton className="flex" url={openItem?.url!}>
                <svg
                  fill="transparent"
                  className="h-[16px] w-[16px] overflow-visible stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
                >
                  <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                </svg>

                <span className="ml-3.5">Telegram</span>
              </TelegramShareButton>
            </DropdownMenuItem>
          ) : null}
          {!providers?.includes("Pocket") ? (
            <DropdownMenuItem>
              <PocketShareButton className="flex" url={openItem?.url!}>
                <svg
                  fill="transparent"
                  className="mr-2 h-6 w-6 stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
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
              <PocketShareButton className="flex" url={openItem?.url!}>
                <svg
                  fill="transparent"
                  className="mr-2 h-6 w-6 stroke-neutral-450 stroke-[1.25] dark:stroke-stone-400"
                >
                  <path d="M18.648 15.254c-1.816 1.763 -6.648 1.626 -6.648 1.626a18.262 18.262 0 0 1 -3.288 -.256c1.127 1.985 4.12 2.81 8.982 2.475c-1.945 2.013 -13.598 5.257 -13.668 -7.636l-.026 -1.154c0 -3.036 .023 -4.115 1.352 -5.633c1.671 -1.91 6.648 -1.666 6.648 -1.666s4.977 -.243 6.648 1.667c1.329 1.518 1.352 2.597 1.352 5.633s-.456 4.074 -1.352 4.944z" />
                  <path d="M12 11.204v-2.926c0 -1.258 -.895 -2.278 -2 -2.278s-2 1.02 -2 2.278v4.722m4 -4.722c0 -1.258 .895 -2.278 2 -2.278s2 1.02 2 2.278v4.722" />
                </svg>

                <span>Mastodon</span>
              </PocketShareButton>
            </DropdownMenuItem>
          ) : null}
          {!providers?.includes("Linkedin") ? (
            <DropdownMenuItem>
              <LinkedinShareButton className="flex" url={openItem?.url!}>
                <Linkedin className="mr-[9px] h-6 w-6 overflow-visible stroke-neutral-450 stroke-[1.5] dark:stroke-stone-400" />

                <span>Linkedin</span>
              </LinkedinShareButton>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Sharing;
