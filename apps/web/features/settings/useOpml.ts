import { useState } from "react";
import type { feed } from "@prisma/client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { useUser } from "@refeed/features/hooks/useUser";
import { base64ToBlob } from "@refeed/lib/base64toBlob";
import { decode } from "@refeed/lib/decode";
import { formatOPML } from "@refeed/lib/formatOPML";
import { parseOpml } from "@refeed/lib/OpmlParser";

import { trpc } from "../../utils/trpc";

type FeedError =
  | "Issue with Parsing Feed"
  | "Issue with Refreshing Feed"
  | "Feed URL not Valid"
  | "Issue adding Feed to User"
  | "Link Returns 404"
  | undefined;

type importProgressType =
  | {
      title: string;
      // Step 1 means the feed was added to DB and refreshed
      // Step 2 means it was added to user and is done
      step?: "Step 1" | "Step 2";
      error?: FeedError;
    }[]
  | undefined;

const useOpml = () => {
  const supabase = useSupabaseClient();
  const { plan } = useUser();
  const utils = trpc.useUtils();

  const [file, setFile] = useState<string | undefined>();
  const [toManyFeeds, setToManyFeeds] = useState<feed[] | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [importProgress, setImportProgress] =
    useState<importProgressType>(undefined);

  const importOpml = trpc.opml.addOPML.useMutation({
    onSuccess: () => {
      utils.feed.getFeedOrder.reset();
      utils.feed.getFeedsInFolders.reset();
    },
    onError: () => {
      setErrorMessage("Failed to import feeds try again");
    },
  });
  const setFinshedAddingFeeds = trpc.opml.finishedAddingFeeds.useMutation();

  const importOPML = async () => {
    setImportProgress(undefined);

    const token = (await supabase.auth.getSession()).data.session?.access_token;

    if (token) {
      const OPML = await parseOpml(decode(file ?? ""));

      const formatedOPML = formatOPML(OPML);

      // TODO: Prompt to create a picker to chose which ones you want to add out of the 150
      if (plan == "free" && formatedOPML?.length > 150) {
        setToManyFeeds(formatedOPML);
        setErrorMessage("You can only import 150 feeds on the free plan");
        return;
      }
      if (plan == "pro" && formatedOPML?.length > 1000) {
        setToManyFeeds(formatedOPML);
        setErrorMessage("You can only import 1000 feeds on the pro plan");
        return;
      }

      // Call checkProgress every 5 seconds to get the progress of the import stop after its done
      const checkProgress = async () => {
        const progress = await utils.opml.checkProgress.fetch(undefined, {
          staleTime: 0,
        });

        if (progress.progress.length != 0) {
          setImportProgress(progress.progress as importProgressType);

          // Get amount of items that are Step 2
          const step2Count = progress.progress?.filter(
            (item) => item.step === "Step 2" || item.error !== undefined,
          ).length;

          const percentDone = step2Count / progress.progress.length;

          if (percentDone === 1) {
            setImportProgress(progress.progress as importProgressType);
            clearInterval(interval);
            setFinshedAddingFeeds.mutate();
          } else {
            setImportProgress(progress.progress as importProgressType);
          }
        }
      };

      /* eslint-disable @typescript-eslint/no-misused-promises */
      const interval = setInterval(checkProgress, 1000);

      await importOpml.mutateAsync({ base64Opml: file ?? "" });
    } else {
      setErrorMessage("Failed to import feeds try again");
    }
  };

  const onFileChange = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      // @ts-ignore
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64String = reader.result.split(",")[1];
          setFile(base64String);
        }
      };
    }
  };

  async function exportOPML() {
    const base64Opml = await utils.opml.exportOPML.fetch(undefined, {
      staleTime: 0,
    });
    const blob = base64ToBlob(base64Opml, "application/xml");
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "feeds.opml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  return {
    importProgress,
    exportOPML,
    importOPML,
    toManyFeeds,
    onFileChange,
    errorMessage,
  };
};

export default useOpml;
