import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { productEnquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";
import { Price, StockIndicator } from "./Price";
import { QtyStepper } from "./QtyStepper";
import { SareeImage } from "./SareeImage";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function QuickView() {
  const { quickViewId, openQuickView, getProduct, addToCart, toggleWishlist, isWishlisted } =
    useShop();
  const p = quickViewId ? getProduct(quickViewId) : undefined;
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setActive(0);
    setQty(1);
  }, [quickViewId]);

  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && openQuickView(null)}>
      <DialogContent className="max-h-[92vh] max-w-[980px] gap-0 overflow-y-auto rounded-none border-0 bg-ivory p-0 sm:rounded-none">
        {p && (
          <div className="grid md:grid-cols-[1.05fr_1fr]">
            <div className="grid grid-cols-[64px_1fr] gap-3 bg-paper p-3">
              <div className="flex flex-col gap-2">
                {p.images.map((im, i) => (
                  <button
                    key={im.base}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={cn(
                      "aspect-[4/5] overflow-hidden border transition",
                      i === active
                        ? "border-wine"
                        : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <SareeImage image={im} sizes="64px" />
                  </button>
                ))}
              </div>
              <div className="aspect-[4/5] overflow-hidden">
                <SareeImage
                  key={active}
                  image={p.images[active]}
                  sizes="(min-width: 768px) 460px, 80vw"
                  className="animate-fade"
                />
              </div>
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <p className="eyebrow text-gold">{p.categories[0].replace("-", " ")}</p>
              <DialogTitle className="mt-3 font-display text-4xl font-normal text-ink">
                {p.name}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                {p.subtitle}
              </DialogDescription>
              <Price price={p.price} mrp={p.mrp} size="lg" className="mt-5" />
              <StockIndicator stock={p.stock} className="mt-3" />
              <p className="mt-5 line-clamp-4 text-sm leading-relaxed text-ink/80">
                {p.description}
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-border py-4 text-xs">
                <div>
                  <dt className="text-muted-foreground">Fabric</dt>
                  <dd className="mt-0.5 text-ink">{p.fabric}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Colour</dt>
                  <dd className="mt-0.5 text-ink">{p.colour}</dd>
                </div>
              </dl>
              <div className="mt-6 flex items-center gap-3">
                {p.stock > 0 && (
                  <QtyStepper
                    value={qty}
                    max={p.stock}
                    onChange={(v) => setQty(Math.max(1, Math.min(v, p.stock)))}
                  />
                )}
                <Button
                  variant="wine"
                  size="xl"
                  className="flex-1"
                  disabled={p.stock <= 0}
                  onClick={() => {
                    addToCart(p.id, qty);
                    openQuickView(null);
                  }}
                >
                  {p.stock > 0 ? "Add to bag" : "Sold out"}
                </Button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(p.id)}
                  aria-pressed={isWishlisted(p.id)}
                  aria-label="Save to wishlist"
                  className="grid h-13 w-13 place-items-center border border-border text-ink transition hover:border-wine hover:text-wine"
                >
                  <Heart
                    className={cn("h-4 w-4", isWishlisted(p.id) && "fill-wine text-wine")}
                    strokeWidth={1.4}
                  />
                </button>
              </div>
              <Button asChild variant="whatsapp" size="xl" className="mt-2">
                <a
                  href={whatsappUrl(productEnquiryMessage(p, qty))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-4 w-4" />{" "}
                  {p.stock > 0 ? "Order on WhatsApp" : "Ask about a re-weave"}
                </a>
              </Button>
              <Link
                to="/sarees/$slug"
                params={{ slug: p.slug }}
                onClick={() => openQuickView(null)}
                className="eyebrow link-underline mt-6 self-start text-[0.62rem] text-wine"
              >
                View full details →
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
