import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

// NOTE: Make sure to add a CSS height on the skeletons

export const ThemedSkeleton = ({
  className,
  width,
  count,
}: {
  className: string;
  width?: number | undefined;
  count?: number | undefined;
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // We need to wait till it runs on the client before showing the Skeleton
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (mounted) {
    if (theme == "dark") {
      return (
        <Skeleton
          baseColor="#141415"
          highlightColor="#232525"
          width={width}
          count={count}
          className={className}
        />
      );
    }
    return (
      <Skeleton
        baseColor="#f4f5f5"
        highlightColor="#eff0f0"
        width={width}
        count={count}
        className={className}
      />
    );
  }
};
