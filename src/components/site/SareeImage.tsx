import { cn } from "@/lib/utils";
import type { ProductImage } from "@/data/catalog";

interface Props {
  image: ProductImage;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** intrinsic aspect for CLS; defaults to 4:5 */
  width?: number;
  height?: number;
}

export function srcSetFor(image: ProductImage): string {
  const widths = image.widths ?? [480, 960];
  return widths.map((w) => `${image.base}-${w}.webp ${w}w`).join(", ");
}

export function srcFor(image: ProductImage, prefer = 960): string {
  const widths = image.widths ?? [480, 960];
  const w = widths.find((x) => x >= prefer) ?? widths[widths.length - 1];
  return `${image.base}-${w}.webp`;
}

export function SareeImage({
  image,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className,
  priority,
  width = 960,
  height = 1200,
}: Props) {
  return (
    <img
      src={srcFor(image)}
      srcSet={srcSetFor(image)}
      sizes={sizes}
      alt={image.alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
