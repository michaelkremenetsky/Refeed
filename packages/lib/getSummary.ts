import parse from "node-html-parser";

export const getSummary = async (url: string) => {
  try {
    if (!url) {
      return "";
    }

    const content = await fetch(url);
    const dom = parse(await content.text());
    const summary = dom.querySelector("summary")?.textContent;

    return summary ?? "";
  } catch {
    return "";
  }
};
