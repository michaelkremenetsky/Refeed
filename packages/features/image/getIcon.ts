export async function getIcon(link: string) {
  let size = 256;
  let faviconUrl;

  const googleUrl = "https://www.google.com/s2/favicons?domain=";

  const url = new URL(link);

  // If its a youtube link get 64x64 because it dosen't get the correct icon if its higher than that.
  if (url.hostname.includes("youtube.com")) {
    size = 64;
  }

  while (size >= 16) {
    try {
      const response = await fetch(`${googleUrl}${link}&sz=${size}`, {
        method: "HEAD",
      });

      if (response.ok) {
        faviconUrl = `${googleUrl}${link}&sz=${size}`;
        break;
      } else {
        size /= 2;
      }
    } catch (error) {
      break;
    }
  }

  if (!faviconUrl) {
    faviconUrl =
      "https://www.google.com/s2/favicons?domain=" + link + "&sz=128";
  }

  return faviconUrl;
}
