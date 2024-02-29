import { createReadStream } from "fs";
import { URL } from "url";
import axios from "axios";
import cheerio from "cheerio";
import sharp from "sharp";
import svg2img from "svg2img";
import { request } from "undici";

import { resolveImage } from "@refeed/lib/resolveImage";

// Not in use for now, need to make it a bit more secure

interface Icon {
  href: string;
  isSvg: boolean;
  resolution: number; // resolution as width * height for non-SVG icons
}

async function fetchHtml(url: string): Promise<string> {
  const { body } = await request(url);

  return body.text();
}

function extractIcons(html: string, baseUrl: string): Icon[] {
  const $ = cheerio.load(html);
  const icons: Icon[] = [];
  $(
    'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
  ).each((i, el) => {
    const href = $(el).attr("href");
    if (href) {
      const fullUrl = new URL(href, baseUrl).href;
      const isSvg = fullUrl.endsWith(".svg");
      const sizes = $(el).attr("sizes") ?? "";
      const resolution = isSvg ? 0 : parseResolution(sizes);
      icons.push({ href: fullUrl, isSvg, resolution });
    }
  });
  return icons;
}

function parseResolution(sizes: string): number {
  if (!sizes) return 0;
  const parts = sizes.toLowerCase().split("x");
  if (parts.length === 2) {
    if (parts[0] && parts[1]) {
      const width = parseInt(parts[0], 10);
      const height = parseInt(parts[1], 10);
      return width * height;
    }
  }
  return 0; // default resolution for icons without sizes
}

function selectHighestResolutionIcon(icons: Icon[]): Icon | null {
  return icons.reduce(
    (highest, icon) => {
      return icon.resolution > highest.resolution ? icon : highest;
    },
    { href: "", isSvg: false, resolution: 0 } as Icon,
  );
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function getPreferredIconUrl(
  icons: Icon[],
): Promise<string | null> {
  // Prefer SVG icons
  const svgIcon = icons.find((icon) => icon.isSvg);
  if (svgIcon) return svgIcon.href;

  // If no SVG, select the highest resolution icon
  const highestResIcon = selectHighestResolutionIcon(
    icons.filter((icon) => !icon.isSvg),
  );
  return highestResIcon ? highestResIcon.href : null;
}

async function convertSvgToImage(svgUrl: string): Promise<string> {
  const outputFilename = "new_image.png";
  const response = await axios.get(svgUrl, { responseType: "arraybuffer" });
  await new Promise<void>((resolve, reject) => {
    svg2img(response.data, async (error: Error, buffer: Buffer) => {
      if (error) reject(error);
      await sharp(buffer)
        .png()
        .on("error", (e) => {
          // We need to check the error here because of https://github.com/lovell/sharp/issues/1255
          console.log(e);
        })
        .toFile(outputFilename);
      resolve();
    });
  });
  return outputFilename;
}

export async function getIconStream(
  url: string,
): Promise<NodeJS.ReadableStream> {
  const html = await fetchHtml(url);
  const icons = extractIcons(html, url);

  const iconUrl = await getPreferredIconUrl(icons);
  if (iconUrl) {
    if (iconUrl.endsWith(".svg")) {
      const imageFilename = await convertSvgToImage(iconUrl);
      return createReadStream(imageFilename);
    } else {
      return resolveImage(iconUrl);
    }
  } else {
    throw new Error("No valid icons found.");
  }
}
