export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay: number,
) => {
  let debounceTimer: NodeJS.Timeout;

  const debouncedFunc = function (...args: Parameters<F>) {
    clearTimeout(debounceTimer);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    debounceTimer = setTimeout(() => func(...args), delay);
  };

  debouncedFunc.cancel = () => {
    clearTimeout(debounceTimer);
  };
  return debouncedFunc;
};
