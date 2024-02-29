export interface Outline {
  text: string;
  title: string;
  type?: string;
  xmlUrl?: string;
  htmlUrl?: string;
  outlines?: Outline[];
}

export interface Opml {
  head: {
    title: string;
  };
  body: {
    outline: Outline[];
  };
}

export interface ParsedOutline {
  $: {
    text: string;
    title: string;
    type?: string;
    xmlUrl?: string;
    htmlUrl?: string;
  };
  outline?: ParsedOutline[];
}
