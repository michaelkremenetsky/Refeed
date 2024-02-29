export function toHttps(link: string) {
  if (!link.startsWith("http")) {
    return "https://" + link;
  }

  if (link.startsWith("http://")) {
    return link.replace("http://", "https://");
  }

  return link;
}
