export const extractCodeFromUrl = (url: string) => {
  const match = url.match(/code=([^&]+)/);
  return match?.[1];
};
