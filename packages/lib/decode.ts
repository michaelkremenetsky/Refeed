export const decode = (str: string): string =>
  Buffer.from(str, "base64").toString("binary");
