function removeMarkdownLinks(markdown: string) {
  // Remove Markdown links (both images and regular links)
  let cleanedMarkdown = markdown.replace(
    /!\[.*?\]\(.*?\)|\[[^\]]+\]\([^)]+\)/g,
    "",
  );

  // Remove angle brackets around URLs
  cleanedMarkdown = cleanedMarkdown.replace(/<([^>]+)>/g, "$1");

  // Remove extra underscores
  cleanedMarkdown = cleanedMarkdown.replace(/_+/g, "");

  return cleanedMarkdown;
}

export function getFirstParagraphs(markdown: string) {
  if (!markdown) return "";

  const markdownWithoutLinks = removeMarkdownLinks(markdown);

  // Split the text into paragraphs
  const paragraphs = markdownWithoutLinks.split(/\n\n+/);

  // Find the first two non-empty paragraphs and append a newline
  let result = "";
  let count = 0;
  for (const paragraph of paragraphs) {
    if (paragraph.trim() !== "" && count < 3) {
      // Skip if the includes a description of an image
      if (
        paragraph.includes("Illustration") ||
        paragraph.includes("illustration") ||
        paragraph.includes("Photo by")
      ) {
        continue;
      }

      result += paragraph + "\n";
      count++;
    }
  }

  // Remove other things that don't like nice in the summary
  result = result.replace(/©/g, "");
  result = result.replace(/#\S+/g, "");
  result = result.replace(/]/g, "");
  result = result.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "");

  return result.trim();
}

// Incase we need markdown summaries again:
// <Markdown
//   renderer={{
//     em: (children) => (
//       <span key={children?.toString() + "em"}>{children}</span>
//     ),
//     image: (link) => <span key={link} />,
//     link: (link, text) => (
//       <span key={link + text?.toString()}>{link}</span>
//     ),
//   }}
//   value={website_content}
// />
