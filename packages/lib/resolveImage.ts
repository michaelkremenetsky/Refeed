import { Readable } from "node:stream";
import { Agent, fetch } from "undici";

export async function resolveImage(
  url: string,
): Promise<NodeJS.ReadableStream> {
  const { body } = await fetch(url, {
    dispatcher: new Agent({
      keepAliveTimeout: 10000,
      keepAliveMaxTimeout: 10000,
      bodyTimeout: 10000,
      maxRedirections: 3,
    }),
  });

  return Readable.fromWeb(body as any);
}
