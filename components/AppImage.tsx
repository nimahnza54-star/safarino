import Image, { type ImageProps } from "next/image";

export default function AppImage({ src, unoptimized, ...props }: ImageProps) {
  const isGoogleHostedImage =
    typeof src === "string" &&
    src.startsWith("https://lh3.googleusercontent.com/");

  return (
    <Image
      {...props}
      src={src}
      unoptimized={Boolean(unoptimized) || isGoogleHostedImage}
    />
  );
}
