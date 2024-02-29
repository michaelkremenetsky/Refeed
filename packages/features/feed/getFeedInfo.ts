import parse from "node-html-parser";

export const getFeedInfo = (html: string) => {
  const dom = parse(html);

  const pTags = dom.querySelectorAll("p");
  let textLength = 0;
  for (const pTag of pTags) {
    const textContent = pTag?.textContent;
    if (textContent) {
      textLength += textContent.length;
    }
  }

  let word_count = 0;
  for (const pTag of pTags) {
    const textContent = pTag?.textContent;
    if (textContent) {
      word_count += textContent.split(" ").length;
    }
  }

  let sentenceCount = 0;
  for (const pTag of pTags) {
    const textContent = pTag?.textContent;
    if (textContent) {
      sentenceCount += (textContent.match(/\./g) ?? []).length;
    }
  }
  // Automated readability index
  const readibility_score =
    4.71 * (textLength / word_count) +
    0.5 * (word_count / sentenceCount) -
    21.43;

  return {
    textLength,
    word_count,
    sentenceCount,
    readibility_score,
  };
};
