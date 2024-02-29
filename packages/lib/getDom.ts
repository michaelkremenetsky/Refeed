export const getWebsiteContent = async (url: string): Promise<string> => {
  const content = await fetch(url);
  return content.text();
};
