export const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === "fulfilled";
