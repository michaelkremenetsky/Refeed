import { useEffect, useRef } from "react";

export const useInfiniteScroll = (
  isFetchingNextPage: boolean,
  hasNextPage: boolean,
  isFetching: boolean,
  fetchNextPage: any,
  heightRatio = 0.95,
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const root = containerRef.current;

    if (root) {
      const scrollPosition = root.scrollTop + root.clientHeight;
      const totalHeight = root.scrollHeight;
      // 95% of the current items
      const threshold = (25 * heightRatio * totalHeight) / 25;

      if (!isFetchingNextPage && hasNextPage && scrollPosition >= threshold) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    const root = containerRef.current;

    if (root) {
      root.addEventListener("scroll", handleScroll);
      return () => root.removeEventListener("scroll", handleScroll);
    }
  }, [isFetching, isFetchingNextPage, hasNextPage]);

  return { containerRef };
};
