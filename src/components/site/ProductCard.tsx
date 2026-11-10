import { Link } from "@tanstack/react-router";
import { Eye, Heart } from "lucide-react";

import type { Product } from "@/data/catalog";
import { discountPercent } from "@/lib/format";
import { stockStatus } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";
import { Price, StockIndicator } from "./Price";
import { SareeImage } from "./SareeImage";

export function ProductCard({
  product,
  sizes,
  className,
  aspect = "aspect-[4/5]",
  priority,
}: {
  product: Product;
  sizes?: string;
  className?: string;
  aspect?: string;
  priority?: boolean;
}) {
  const { toggleWishlist, isWishlisted, openQuickView } = useShop();
  const off = discountPercent(product.price, product.mrp);
  const status = stockStatus(product.stock);
  const saved = isWishlisted(product.id);
  const [first, second] = product.images;

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className={cn("relative overflow-hidden bg-paper", aspect)}>
        <Link
          to="/sarees/$slug"
          params={{ slug: product.slug }}
          className="absolute inset-0 block"
          aria-label={`${product.name} — ${product.subtitle}`}
        >
          <SareeImage image={first} sizes={sizes} priority={priority} className="img-zoom" />
          {second && (
            <span className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <SareeImage image={second} sizes={sizes} />
            </span>
          )}
          {status === "sold-out" && <span className="absolute inset-0 bg-ivory/45" aria-hidden />}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isNew && (
            <span className="eyebrow bg-ivory/90 px-2 py-1 text-[0.58rem] text-wine">New</span>
          )}
          {off > 0 && (
            <span className="eyebrow bg-wine px-2 py-1 text-[0.58rem] text-ivory">−{off}%</span>
          )}
          {status === "sold-out" && (
            <span className="eyebrow bg-ink px-2 py-1 text-[0.58rem] text-ivory">Sold out</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={
            saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`
          }
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ivory/85 text-ink transition hover:bg-ivory hover:text-wine"
        >
          <Heart className={cn("h-4 w-4", saved && "fill-wine text-wine")} strokeWidth={1.4} />
        </button>

        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          className="eyebrow absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 bg-ivory/95 py-3 text-[0.62rem] text-ink transition-all duration-500 hover:bg-wine hover:text-ivory md:translate-y-[130%] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={1.4} /> Quick view
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl leading-tight text-ink">
            <Link to="/sarees/$slug" params={{ slug: product.slug }} className="link-underline">
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="line-clamp-1 text-[0.82rem] text-muted-foreground">{product.subtitle}</p>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <Price price={product.price} mrp={product.mrp} size="sm" />
          {status !== "in-stock" && <StockIndicator stock={product.stock} />}
        </div>
      </div>
    </article>
  );
}
