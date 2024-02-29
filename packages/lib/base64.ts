export const decode = (str: string): string =>
  Buffer.from(str, "base64").toString("binary");

export const encode = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");
