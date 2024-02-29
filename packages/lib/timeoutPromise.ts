export const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Request timed out")), 5000),
);
