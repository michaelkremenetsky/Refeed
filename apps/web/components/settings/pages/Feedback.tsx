import { useState } from "react";
import { trpc } from "@utils/trpc";

import { TextArea } from "@refeed/ui";

import { SettingsHeader } from "../SettingsHeader";

export const FeedbackSettingsPage = () => {
  const sendFeedback = trpc.settings.sendFeedback.useMutation();

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  return (
    <div>
      <SettingsHeader title="Feedback" subtitle="Feedback Settings" />
      <div className="flex w-full items-start">
        <div className="flex w-full flex-col">
          <h4 className="text-sm leading-5 text-neutral-450 dark:text-stone-500">
            Let us know what you think and feel free to link to a screenshot or
            video
          </h4>
          <TextArea
            className="z-10 mt-5 w-11/12 md:w-10/12"
            name="postContent"
            placeholder="Feature Suggestion, Bug Report, General Feedback, etc."
            rows={5}
            maxLength={50}
            onChange={(e) => {
              setFeedbackText(e.target.value);
            }}
          />
          {!feedbackSubmitted ? (
            <button
              onClick={() => {
                sendFeedback.mutate({ feedback: feedbackText });
                setFeedbackSubmitted(true);
              }}
              type="submit"
              className="mt-3 w-[135px] rounded-md border border-[#DCDCDC] bg-white py-1.5 text-base font-[450] shadow-[rgba(38,38,38,0.04)_0px_2px_1px] hover:bg-[#fafafa] dark:border-[#1e2020] dark:bg-[#0f0f10] dark:hover:bg-[#0f0f10]"
            >
              Send Feedback
            </button>
          ) : (
            <h3 className="mt-2 text-neutral-450">
              Thank you for Submitting Feedback!
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};
