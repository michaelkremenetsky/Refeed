import "styles/cmdk.scss";
import "styles/globals.css";

import { StrictMode, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import type { Session } from "@supabase/auth-helpers-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import {
  NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_POSTHOG_KEY,
} from "@utils/posthog";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { trpc } from "utils/trpc";

import { Toaster } from "@refeed/ui";

if (typeof window !== "undefined") {
  if (NEXT_PUBLIC_POSTHOG_KEY && NEXT_PUBLIC_POSTHOG_HOST) {
    posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      enable_recording_console_log: true,
    });
  }
}

const App = ({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session | null }>) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => posthog?.capture("$pageview");
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <JotaiProvider>
          <StrictMode>
            <Head>
              <title>Refeed</title>
              <meta name="description" content="Refeed RSS Reader" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              ></meta>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              // @ts-ignore
              forcedTheme={Component.theme}
            >
              <main
                className={`bg-background text-optimize-legibility min-h-screen text-[#38383d] subpixel-antialiased outline-none dark:bg-[#0f0f10] dark:text-[#f3f3f7]`}
              >
                <Component className={`dark`} {...pageProps} />
                <Toaster position="bottom-right" />
              </main>
            </ThemeProvider>
          </StrictMode>
        </JotaiProvider>
      </SessionContextProvider>
    </PostHogProvider>
  );
};

export default trpc.withTRPC(App);
