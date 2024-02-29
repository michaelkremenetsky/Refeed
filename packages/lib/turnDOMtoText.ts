import { parse } from "node-html-parser";

export const TurnDOMtoText = (html: string): string => {
  const root = parse(html);
  const textElement = root.querySelector("p");

  return textElement ? textElement.text ?? "" : "";
};
