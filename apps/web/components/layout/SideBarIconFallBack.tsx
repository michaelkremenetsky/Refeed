import { memo, useState } from "react";
import { Rss } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  [key: string]: unknown;
}

export const ImageWithFallback = memo(
  ({ src, alt, ...rest }: ImageWithFallbackProps) => {
    const [hasError, setHasError] = useState(false);

    if (!hasError) {
      // I find the perf on next/image to be worse
      return (
        <img
          alt={alt}
          {...rest}
          src={src}
          onError={() => {
            setHasError(true);
          }}
        />
      );
    } else {
      return <Rss width={16} height={16} className="stroke-sky-500/50" />;
    }
  },
);

// export const ImageWithFallback = memo(
//   ({ src, alt, priority = true, ...rest }: ImageWithFallbackProps) => {
//     const [hasError, setHasError] = useState(false);

//     if (!hasError) {
//       return (
//         <Image
//           priority={priority}
//           alt={alt}
//           {...rest}
//           src={src}
//           onError={() => {
//             setHasError(true);
//           }}
//           // Might change back
//           // unoptimized
//         />
//       );
//     } else {
//       return <Rss width={16} height={16} className="stroke-sky-500/50" />;
//     }
//   },
// );
