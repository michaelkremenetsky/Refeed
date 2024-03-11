import { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

import { Input } from "@refeed/ui/components/input";

import { trpc } from "../../utils/trpc";

export const EmailButton = (props: { type: "login" | "signup" }) => {
  const Supabase = useSupabaseClient();
  const utils = trpc.useUtils();

  const [email, setEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const user = useUser();

  useEffect(() => {
    if (user) {
      location.reload();
    }
  }, [user]);

  const signInWithOtp = async () => {
    if (window) {
      setEmailSent(true);

      const emailRedirectTo =
        window.location.host == "localhost:3000"
          ? "http://localhost:3000/login"
          : `https://${window.location.host}/login`;

      const { error } = await Supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          // The redirect to dosen't to work, set the default in the supabase dashboard instead
          emailRedirectTo: emailRedirectTo,
        },
      });

      if (error) alert(error.message);

      utils.invalidate();
    }
  };

  return (
    <>
      <motion.div className="w-full">
        <div className="flex flex-col items-start gap-3">
          {showEmail ? (
            <>
              <Input
                className="mb-3 w-full"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </>
          ) : null}
        </div>
        <motion.button
          onClick={() => {
            setShowEmail(true);
            if (showEmail) {
              signInWithOtp();
            }
          }}
          className="w-full rounded-[6px] bg-white px-4 py-2.5 text-base font-medium no-underline shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)] transition hover:bg-[#fafafa]"
        >
          <div className="flex items-center justify-center">
            <Mail className="mr-2 stroke-neutral-900" />
            {props.type == "login" ? (
              <>
                {showEmail ? (
                  <span>Login with Email</span>
                ) : (
                  <span> Continue with Email</span>
                )}
              </>
            ) : null}
            {props.type == "signup" ? (
              <>
                {showEmail ? (
                  <span>Sign Up with Email</span>
                ) : (
                  <span> Continue with Email</span>
                )}
              </>
            ) : null}
          </div>
        </motion.button>
      </motion.div>
      {emailSent && (
        <h3 className="text-center text-neutral-500">
          We have sent you an email, please check your inbox.
        </h3>
      )}
    </>
  );
};
