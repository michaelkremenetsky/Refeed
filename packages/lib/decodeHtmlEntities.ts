export function decodeHtmlEntities(str: string) {
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#039;/g, "'")
    .replace(/&#8216;/g, "‘")
    .replace(/&#038;/g, "&")
    .replace(/&#8212;/g, "—")
    .replace(/&nbsp;/g, " ");
}
