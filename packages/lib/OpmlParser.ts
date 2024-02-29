import * as xml2js from "xml2js";

import type { Opml, Outline, ParsedOutline } from "../types/opml";

/* eslint-disable @typescript-eslint/no-unsafe-call */

const parseOutline = (outline: ParsedOutline): Outline => {
  const result: Outline = {
    text: outline.$.text,
    title: outline.$.title,
  };
  if (outline.$.type) result.type = outline.$.type;
  if (outline.$.xmlUrl) result.xmlUrl = outline.$.xmlUrl;
  if (outline.$.htmlUrl) result.htmlUrl = outline.$.htmlUrl;
  if (outline.outline) result.outlines = outline.outline.map(parseOutline);
  return result;
};

export const parseOpml = (opmlString: string): Promise<Opml> => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(opmlString, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const opml = result.opml;
        const head = opml.head[0];
        const body = opml.body[0];
        const outlines = body.outline.map(parseOutline);

        let title;
        if (head.title?.[0]) {
          title = head.title?.[0];
        } else {
          title = "";
        }

        resolve({
          head: {
            title,
          },
          body: {
            outline: outlines,
          },
        });
      }
    });
  });
};
