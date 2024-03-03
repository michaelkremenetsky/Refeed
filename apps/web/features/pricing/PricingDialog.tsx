import Link from "next/link";
import { PricingToggleFilter } from "@components/landing/PricingToggleFilter";
import { TimedBookmarkAnimated } from "@components/landing/TimeBookmarksCard";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useUser } from "@supabase/auth-helpers-react";
import Tippy from "@tippyjs/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useTheme } from "next-themes";
import { followCursor } from "tippy.js";

import { TextArea } from "@refeed/ui";
import { getEnsureDialogContainer } from "@refeed/ui/components/dialog/AddDialog";

import { BookmarkFolders } from "../../components/landing/Cards";
import { fetchPostJSON } from "../../utils/stripe/api-helpers";
import getStripe from "../../utils/stripe/get-stripejs";

export const PricingDialog = (props: { setDialogUndefined: () => void }) => {
  const { setDialogUndefined } = props;
  const { theme } = useTheme();

  return (
    <RadixDialog.Portal container={getEnsureDialogContainer()}>
      <RadixDialog.Overlay>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.2,
          }}
          className="fixed inset-0 z-50 bg-neutral-600/25"
        />
      </RadixDialog.Overlay>

      <RadixDialog.Content
        onPointerDownOutside={() => {
          setDialogUndefined();
        }}
        className={`${
          theme == "dark" ? "dark dark:bg-[#0f0f10]" : "bg-white"
        }  text-optimize-legibility data-[state=open]:animate-content ] fixed z-50 h-[650px] w-[710px] rounded-[6px] text-[#282a30] subpixel-antialiased shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px]  focus:outline-none dark:text-neutral-300`}
      >
        <h1 className="mx-auto mb-2 mt-2 flex justify-center text-3xl font-[775] leading-none tracking-tight md:w-[700px]">
          <span className="py-2  text-neutral-700">Upgrade</span>
        </h1>
        <div className="mt-4 flex justify-center gap-x-4">
          <FreePlan />
          <ProPlan />
        </div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
};

const Checkbox = () => (
  <span className="ml-1.5 mr-2 rounded bg-[#0496FF]/10 px-1 py-[3px] text-sm font-[600] text-sky-500">
    ✓
  </span>
);

const CheckboxGray = () => (
  <span className="ml-1.5 mr-2 rounded bg-neutral-100 px-1 py-[3px] text-sm font-[600] text-neutral-400 dark:bg-[#141415] dark:text-neutral-500">
    ✓
  </span>
);

const handleSubmit = async (isYearlyPlan: boolean, userId: string) => {
  // Make sure to change the pricing in trpc as well if you change these
  const price = isYearlyPlan
    ? "price_1OmSxDBXmca2WokEeEmTAnWZ"
    : "price_1NpofzBXmca2WokEhuEPIWEJ";

  // Create a Checkout Session.
  const response = await fetchPostJSON("/api/payment", {
    price: price,
    userId: userId,
  });

  if (response.statusCode === 500) {
    console.error(response.message);
    return;
  }

  const stripe = await getStripe();
  const { error } = await stripe!.redirectToCheckout({
    sessionId: response.id,
  });
  console.warn(error.message);
};

export const ProPlan = (props: {
  className?: string;
  isYearlyPlan?: boolean;
}) => {
  const { className, isYearlyPlan } = props;

  const user = useUser();

  const Filter1 = {
    id: 0,
    enabled: false,
    user_id: "",
    filter: {
      Feeds: [
        "https://cdn.vox-cdn.com/verge/favicon.ico",
        // "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
      ], // Replaced with links unlink the real one
      Content: "Title",
      Logic: "Equals",
      Keywords: ["test", "test"],
    },
  };

  const Filter2 = {
    id: 0,
    enabled: false,
    user_id: "",
    filter: {
      Feeds: [
        "https://cdn.vox-cdn.com/verge/favicon.ico",
        // "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
      ], // Replaced with links unlink the real one
      Content: "Anywhere",
      Logic: "Begins With",
    },
    Keywords: ["test", "test"],
  };

  return (
    <div
      className={clsx(
        "mx-4 h-[565px] select-none rounded-lg bg-white text-[#161718] shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] ring-1 ring-[#1EA1FF]/40 md:mx-0 md:w-[375px] dark:bg-[#0f0f10]",
        className,
      )}
    >
      <h1 className="ml-5 flex pt-5 text-lg font-bold dark:text-stone-500/80">
        <Sparkle className="mr-1 fill-[#0496FF] stroke-sky-500" />
        Refeed Pro
      </h1>
      <div className="flex">
        <h1 className="ml-5 mt-4 flex pb-4 text-5xl font-bold text-[#38383d] dark:text-stone-200">
          {props.isYearlyPlan ? "$6" : "$8"}
        </h1>
        <h1 className="text-md ml-1.5 mt-9 flex pb-4 font-bold text-neutral-600 dark:text-stone-200">
          {props.isYearlyPlan ? "/mo" : "/mo"}
        </h1>
      </div>
      <ul className="mx-auto mt-2 flex flex-col px-2">
        <li className=" px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
          <Checkbox />
          Everything in Free Plan+
        </li>
        <li className=" px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
          <Checkbox />
          Up to <span className="font-[550]">1000</span> Feeds
        </li>
        <li className=" px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
          <Checkbox />
          Up to <span className="font-[550]">2500</span> Unread Items
        </li>
        <Tippy
          className="rounded-[4px] border bg-white p-2 shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] dark:border dark:border-[#333333] dark:bg-[#141415]"
          placement="top"
          followCursor={true}
          plugins={[followCursor]}
          delay={0}
          duration={0}
          content={
            <div className="h-[200px] w-[305px]">
              <BookmarkFolders
                className={`relative border border-neutral-200 shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)]`}
              />
              <h2 className="mx-2 mt-4 font-medium">Bookmark Folders</h2>
              <h2 className="mx-2 text-neutral-500">
                Organize your Bookmarks to into Folders
              </h2>
            </div>
          }
        >
          <li className=" px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
            <Checkbox />
            <span className="underline decoration-neutral-300 decoration-dashed decoration-1 underline-offset-2">
              Bookmark Folders
            </span>
          </li>
        </Tippy>
        <Tippy
          className="rounded-[4px] border bg-white p-2 shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] dark:border dark:border-[#333333] dark:bg-[#141415]"
          placement="top"
          followCursor={true}
          plugins={[followCursor]}
          delay={0}
          duration={0}
          content={
            <div className="h-[200px]">
              <TimedBookmarkAnimated />
              <h2 className="mx-2 mt-8 font-medium">Timed Bookmarks</h2>
              <h2 className="mx-2 text-neutral-500">
                Filter out items based on conditions
              </h2>
            </div>
          }
        >
          <li className=" px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
            <Checkbox />
            <span className="underline decoration-neutral-300 decoration-dashed decoration-1 underline-offset-2">
              Timed Bookmarks
            </span>
          </li>
        </Tippy>
        <Tippy
          className="rounded-[4px] border bg-white p-2 shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] dark:border dark:border-[#333333] dark:bg-[#141415]"
          placement="top"
          followCursor={true}
          plugins={[followCursor]}
          delay={0}
          duration={0}
          content={
            <div className="h-[200px]">
              <TextArea
                className="z-10 mx-1 mt-1.5 h-[120px] w-[300px]"
                placeholder="Write Note"
                name="postContent"
                rows={5}
                maxLength={50}
              />
              <h2 className="mx-2 mt-3 font-medium">Notes</h2>
              <h2 className="mx-2 text-neutral-500">
                Filter out items based on conditions
              </h2>
            </div>
          }
        >
          <li className=" px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
            <Checkbox />
            <span className="underline decoration-neutral-300 decoration-dashed decoration-1 underline-offset-2">
              Notes
            </span>
          </li>
        </Tippy>
        <Tippy
          className="rounded-[4px] border bg-white shadow-[rgba(0,0,0,0.05)_0px_0px_1px,rgba(0,0,0,0.04)_0px_15px_30px] dark:border dark:border-[#333333] dark:bg-[#141415]"
          placement="top"
          followCursor={true}
          plugins={[followCursor]}
          delay={0}
          duration={0}
          content={
            <div className="h-[200px]">
              <div className="flex flex-col space-y-2 overflow-hidden py-5 pl-2">
                <PricingToggleFilter filter={Filter1 as any} />
                <PricingToggleFilter filter={Filter2 as any} />
              </div>
              <div className="px-2">
                <h2 className="mx-2 mt-4 font-medium">Filters</h2>
                <h2 className="mx-2 text-neutral-500">
                  Filter out items based on conditions
                </h2>
              </div>
            </div>
          }
        >
          <li className=" px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
            <Checkbox />
            <span className="underline decoration-neutral-300 decoration-dashed decoration-1 underline-offset-2">
              Filters
            </span>
          </li>
        </Tippy>
        <li className=" px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
          <Checkbox />
          Full Text Search
        </li>
        <Tippy
          className="rounded-[4px] bg-white p-2 shadow-[0_0px_0px_1px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.08),0px_8px_16px_-4px_rgba(0,0,0,0.06)] dark:border dark:border-[#333333] dark:bg-[#141415]"
          placement="top"
          followCursor={true}
          plugins={[followCursor]}
          delay={0}
          duration={0}
          content="Subscribe to Newsletters using a email address provided by Refeed."
        >
          <li className=" hover:help Newsletter flex px-4 py-[3px] text-lg hover:bg-neutral-50 dark:hover:bg-[#121212]">
            <h3>
              {" "}
              <Checkbox />
              <span className="underline decoration-neutral-300 decoration-dashed decoration-1 underline-offset-2 dark:text-stone-200">
                Inbox
              </span>
              <span
                className={
                  "ml-1.5 rounded bg-[#0496FF]/10 px-[3px] text-right text-xs font-[500] text-sky-500"
                }
              >
                Coming Soon
              </span>
            </h3>
          </li>
        </Tippy>
        <Tippy
          className="rounded-[4px] bg-white p-2 shadow-[0_0px_0px_1px_rgba(31,34,37,0.09),0px_12px_24px_-4px_rgba(0,0,0,0.08),0px_8px_16px_-4px_rgba(0,0,0,0.06)] dark:border dark:border-[#333333] dark:bg-[#141415]"
          placement="top"
          followCursor={true}
          plugins={[followCursor]}
          delay={0}
          duration={0}
          content="Refeed AI features coming soon."
        >
          <li className=" hover:help Newsletter flex px-4 py-[3px] text-lg hover:bg-neutral-50 dark:hover:bg-[#121212]">
            <h3>
              <Checkbox />
              <span className="underline decoration-neutral-300 decoration-dashed decoration-1 underline-offset-2 dark:text-stone-200">
                AI
              </span>
              <span
                className={
                  "ml-1.5 rounded bg-[#0496FF]/10 px-[3px] text-right text-xs font-[500] text-sky-500"
                }
              >
                Coming Soon
              </span>
            </h3>
          </li>
        </Tippy>
      </ul>
      <Link href="/signup">
        <button
          onClick={() => {
            handleSubmit(isYearlyPlan!, user?.id!);
          }}
          className="mx-5 mb-5 mt-8 w-[90%] rounded-md bg-white px-6 py-1.5 text-base font-medium text-[#38383D] shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)]"
        >
          Try Now -&gt;{" "}
        </button>
      </Link>
    </div>
  );
};

export const FreePlan = ({ className }: { className?: string }) => (
  <div
    className={clsx(
      "mx-4 h-[565px] rounded-lg border bg-white text-[#161718] shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] md:mx-0 md:w-[375px]  dark:border-neutral-700 dark:bg-[#0f0f10]",
      className,
    )}
  >
    <h1 className="ml-6 mt-5 flex text-lg font-bold dark:text-stone-500/80">
      Free
    </h1>
    <h1 className="ml-5 mt-4 flex pb-4 text-5xl font-bold text-[#38383d] dark:text-stone-200">
      $0
    </h1>
    <ul className="mx-2 mt-2 flex flex-col">
      <li className="px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
        <CheckboxGray />
        Up to <span className="font-[550]">100</span> Feeds
      </li>
      <li className="px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
        <CheckboxGray />
        Up to <span className="font-[550]">1000</span> Unread Items
      </li>
      <li className="px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
        <CheckboxGray />
        Unlimited Bookmarks
      </li>
      <li className="px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
        <CheckboxGray />
        Fetch Full Content
      </li>
      <li className="px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
        <CheckboxGray />
        Import and Export OPML files
      </li>
      <li className="px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
        <CheckboxGray />
        Follow any Public Feed
      </li>
      <li className="px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
        <CheckboxGray />
        Self Host Yourself
      </li>
      <li className="px-4 py-[3px] text-lg hover:bg-neutral-50 dark:text-stone-200 dark:hover:bg-[#121212]">
        <CheckboxGray />
        Always Ad Free and Open source
      </li>
    </ul>
  </div>
);
