import { memo, useState } from "react";
import Image from "next/image";
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
      return (
        <Image
          alt={alt}
          {...rest}
          src={src}
          onError={() => {
            setHasError(true);
          }}
          priority
        />
      );
    } else {
      return <Rss width={16} height={16} className="stroke-sky-500/50" />;
    }
  },
);
