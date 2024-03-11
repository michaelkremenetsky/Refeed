import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

import { LandingWrapper } from "../components/layout/PageWrapper";
import { AppleButton } from "../features/auth/AppleLoginButton";
import { EmailButton } from "../features/auth/EmailButton";
import { GoogleButton } from "../features/auth/GoogleLoginButton";

/* eslint-disable react/no-unescaped-entities */

function Login() {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user?.id != undefined) {
      location.reload();
    }
  }, [user]);

  return (
    <LandingWrapper>
      <div className="flex h-screen justify-center overflow-hidden bg-[#FCFCFC] text-neutral-900">
        <div className="mx-auto flex w-[325px] flex-col items-center justify-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight">Sign In</h1>
          <div className="mb-2 flex text-sm font-medium">
            <h1 className="mr-1">Don't have an Account?</h1>
            <button
              onClick={() => {
                router.push("/signup");
              }}
              className="text-neutral-450"
            >
              Sign Up
            </button>
          </div>
          <AppleButton />
          <GoogleButton />
          <EmailButton type="login" />
          <h4 className="pt-1 text-center text-[13px] text-neutral-500">
            By clicking “Continue” above, you acknowledge that you have read and
            understood, and agree to Refeed's{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </h4>
        </div>
      </div>
    </LandingWrapper>
  );
}

Login.theme = "light";
export default Login;
