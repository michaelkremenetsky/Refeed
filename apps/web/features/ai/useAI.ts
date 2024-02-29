import { aiAtom } from "@components/layout/NavBarButtons";
import { nanoid } from "ai";
import { useChat } from "ai/react";
import { useAtom } from "jotai";
import { useEffect } from "react";

// NOTE: Not in use for now

export const useAI = (titles: string) => {
  const { messages, handleSubmit, input, setInput, handleInputChange, append } =
    useChat();

  const [checkAIEnabled, setAIEnabled] = useAtom(aiAtom);

  useEffect(() => {
    if (checkAIEnabled == true) {
      const submitAI = () => {
        if (checkAIEnabled) {
          setInput(
            "Rewrite these as a list and remove any parts that are clickbait - " +
              titles,
          );

          append({
            id: nanoid(),
            role: "user",
            content:
              "Rewrite these as a list and remove any parts that are clickbait - " +
              titles,
          });

          setAIEnabled(false);
        }
      };

      submitAI();
    }
  }, [checkAIEnabled]);

  return { messages, handleSubmit, input, setInput, handleInputChange, append };
};
