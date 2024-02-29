/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as xml2js from "xml2js";

interface Outline {
  text: string;
  title: string;
  type?: string;
  xmlUrl?: string;
  htmlUrl?: string;
  outlines?: Outline[];
}

interface Opml {
  head: {
    title: string;
  };
  body: {
    outline: Outline[];
  };
}

interface ParsedOutline {
  $: {
    text: string;
    title: string;
    type?: string;
    xmlUrl?: string;
    htmlUrl?: string;
  };
  outline?: ParsedOutline[];
}

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
        resolve({
          head: {
            title: head.title[0],
          },
          body: {
            outline: outlines,
          },
        });
      }
    });
  });
};
