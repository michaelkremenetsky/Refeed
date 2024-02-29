import type { SVGProps } from "react";
import { useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { trpc } from "@utils/trpc";

export const AppleButton = () => {
  const Supabase = useSupabaseClient();
  const utils = trpc.useUtils();
  const origin =
    typeof window !== "undefined" ?? window.location.origin
      ? window.location.origin
      : "";

  const user = useUser();

  useEffect(() => {
    if (user) {
      location.reload();
    }
  }, [user]);

  const signInWithApple = async () => {
    const { error } = await Supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: origin + "/login",
      },
    });

    if (error) alert(error.message);

    utils.invalidate();
  };

  return (
    <button
      className="w-full rounded-[6px] bg-white px-4 py-2.5 text-base font-medium no-underline shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)] transition hover:bg-[#fafafa]"
      onClick={() => {
        signInWithApple();
      }}
    >
      <div className="flex items-center justify-center">
        <AppleLogo className="mr-2 h-5 w-5 fill-black" />
        <span> Continue with Apple</span>
      </div>
    </button>
  );
};

export const AppleLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" {...props}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);
