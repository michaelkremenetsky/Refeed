/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

import { LandingWrapper } from "../components/layout/PageWrapper";

// NOTE: This is not in use

export default function CheckEmail() {
  const [email, setEmail] = useState("");

  return (
    <LandingWrapper>
      <div className="flex h-screen">
        <div className="mx-auto flex w-[325px] flex-col items-center justify-center text-neutral-900">
          <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          <h4 className="text-neutral-500">
            Enter the email address you registered with and we'll send you
            instructions to reset your password.
          </h4>
          <input
            className="w-full rounded-md border border-neutral-200 bg-[#FCFCFC] text-neutral-700 outline-none focus:border-neutral-200 focus:ring-[1px] focus:ring-sky-500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
      </div>
    </LandingWrapper>
  );
}
