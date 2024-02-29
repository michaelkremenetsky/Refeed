export const getNextPrismaCursor = (items: any, amount: number) => {
  let nextCursor: string | undefined = undefined;
  if (items.length % amount == 0) {
    nextCursor = items?.[amount - 1]?.id;
  } else {
    nextCursor = undefined;
  }

  return nextCursor;
};
