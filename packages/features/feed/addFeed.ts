import path from "path";
import { PassThrough } from "stream";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import Parser from "rss-parser";
import { v4 as uuidv4 } from "uuid";

import { getSummary } from "@refeed/lib/getSummary";
import { resolveImage } from "@refeed/lib/resolveImage";
import { toHttps } from "@refeed/lib/toHttps";

import { getIcon } from "../image/getIcon";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.IMAGE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.IMAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.IMAGE_ACCESS_KEY_SECRET!,
  },
});

export const addFeed = async (
  title: string,
  feed_url: string,
  prisma: PrismaClient,
) => {
  const checkUrlValid = new URL(toHttps(feed_url));
  if (!checkUrlValid) {
    throw new Error("Feed URL not Valid");
  }

  const Feed = await prisma.feed.findFirst({
    where: {
      feed_url: toHttps(feed_url),
    },
  });

  /* TODO: Check feeds from the same domain and see if they are the same and then if they are throw an error.
   For now just manually removing duplicates in the DB. */

  if (Feed) {
    throw new Error("Feed already exists");
  }

  let parsed;
  try {
    const parser = new Parser({
      timeout: 5000,
    });

    parsed = await parser.parseURL(toHttps(feed_url));
  } catch (err) {
    if (err instanceof Error) {
      if (err.message == "Status code 404") {
        throw new Error(`Link Returns 404`);
      }
    }
    throw new Error(`Issue with parsing Feed`);
  }
  let summary;
  try {
    summary = await getSummary(parsed?.link!);
  } catch (err) {
    console.log(err);
    summary = "";
  }

  let key;
  try {
    /* TODO: Replace all icons with higher resolution ones and fetch directly from
     their site instead of google. Need to write a scraper for this */

    const bucket = "icons";

    key = Date.now() + uuidv4() + ".ico";

    const iconUrl = await getIcon(parsed?.link!);
    const uploadStream = new PassThrough();
    const imageStream = await resolveImage(iconUrl);

    imageStream.pipe(uploadStream);

    const uploadParams = {
      Bucket: bucket,
      Key: path.basename(key),
      Body: uploadStream,
      ContentType: "image/x-icon",
    };

    const upload = new Upload({
      client: S3,
      params: uploadParams,
    });

    await upload.done();
  } catch (err) {
    console.log(err);
    throw new Error("Issue with uploading Image");
  }

  const LogoUrl = process.env.ICON_BUCKET_URL! + "/" + key;

  try {
    const feed = await prisma.feed.create({
      data: {
        title: title,
        feed_url: toHttps(feed_url),
        website_url: parsed?.link ?? "",
        logo_url: LogoUrl || "",
        summary: summary || "",
      },
    });

    return feed;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        // P2002 is just "Unique constraint failed" which is fine
      } else {
        console.log(err);
        return;
      }
    } else {
      console.log(err);
      return;
    }
  }
};
