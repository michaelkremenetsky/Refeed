export const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";

  return `http://localhost:3000`;
};
