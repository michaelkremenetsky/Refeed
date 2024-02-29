import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  [key: string]: unknown;
}

export const ImageWithFallback = ({
  src,
  alt,
  ...rest
}: ImageWithFallbackProps) => {
  try {
    return <Image alt={alt} {...rest} src={src} />;
  } catch {
    return <div />;
  }
};
