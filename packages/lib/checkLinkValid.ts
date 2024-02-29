import { toHttps } from "./toHttps";

export const checkLinkValid = (link: string | undefined, base_url: string) => {
  let url: string;

  if (link == undefined) {
    return undefined;
  }
  try {
    new URL(toHttps(link));
    url = toHttps(link);
  } catch {
    try {
      new URL(toHttps(base_url + link));
      url = toHttps(base_url + link);
    } catch {
      return undefined;
    }
  }

  return url;
};
