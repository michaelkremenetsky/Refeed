export function extractTextFromMarkdown(markdown: string) {
  // 1. Basic Markdown Removal:
  let text = markdown
    // Remove inline links: (Keep what's inside the brackets)
    .replace(/\[(.*?)\]\(.+?\)/g, "$1")
    // Remove inline images:
    .replace(/!\[(.*?)\]\(.+?\)/g, "")
    // Remove emphasis (asterisks and underscores):
    .replace(/([*_]{1,3})(\S.*?\S)\1/g, "$2")
    // Remove blockquotes:
    .replace(/^\s*>\s+/gm, "");

  // 2. Handle Code Blocks (Fenced or Indented):
  text = text
    .replace(/`(.*?)`/gms, "") // Fenced code blocks
    .replace(/^\s{4,}(.*)$/gm, ""); // Indented code blocks

  // 3. Remove Headers:
  text = text.replace(/^\#+\s+(.*)$/gm, "");

  // 4. Remove Horizontal Rules:
  text = text.replace(/^(-{3,}|_{3,}|\*{3,})/gm, "");

  // 5. (Optional) Handle HTML:
  // If your Markdown might contain raw HTML tags, you'd need a more
  // sophisticated HTML parser to strip those out.

  return text.trim();
}
