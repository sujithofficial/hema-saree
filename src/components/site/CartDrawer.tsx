import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, X, Info } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";
import { orderMessage, whatsappUrl } from "@/lib/whatsapp";
import { useShop } from "@/store/shop";
import { QtyStepper } from "./QtyStepper";
import { SareeImage } from "./SareeImage";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function useCartWhatsAppUrl() {
  const { cart, getProduct, totals } = useShop();
  const lines = cart
    .map((l) => {
      const p = getProduct(l.productId);
      return p ? { name: p.name, sku: p.sku, qty: l.qty, price: p.price } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  return whatsappUrl(
    orderMessage({
      lines,
      subtotal: totals.subtotal,
      shipping: null,
    }),
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, getProduct, setQty, removeFromCart, totals } = useShop();
  const navigate = useNavigate();
  const waUrl = useCartWhatsAppUrl();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l-0 bg-ivory p-0 sm:max-w-[440px]"
      >
        <div className="border-b border-border px-6 py-5">
          <SheetTitle className="font-display text-2xl font-normal text-ink">Your bag</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {totals.itemCount === 0
              ? "Nothing here yet"
              : `${totals.itemCount} ${totals.itemCount === 1 ? "saree" : "sarees"}`}
          </SheetDescription>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full border border-gold/50">
              <ShoppingBag className="h-6 w-6 text-gold" strokeWidth={1.2} />
            </div>
            <p className="mt-6 font-display text-2xl text-ink">Your bag is waiting</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Explore Kanchipurams, Banarasis and everyday handlooms — each one chosen by hand.
            </p>
            <Button
              variant="wine"
              size="xl"
              className="mt-8"
              onClick={() => {
                setCartOpen(false);
                navigate({ to: "/collections" });
              }}
            >
              Explore the collection
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border bg-paper/60 px-6 py-3">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 text-gold shrink-0" />
                <span>Shipping charges are confirmed directly by the seller upon checkout.</span>
              </p>
            </div>

            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {cart.map((line) => {
                const p = getProduct(line.productId);
                if (!p) return null;
                return (
                  <li key={line.productId} className="flex gap-4 py-5">
                    <Link
                      to="/sarees/$slug"
                      params={{ slug: p.slug }}
                      onClick={() => setCartOpen(false)}
                      className="h-28 w-[88px] shrink-0 overflow-hidden bg-paper"
                    >
                      <SareeImage image={p.images[0]} sizes="88px" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-display text-lg leading-tight text-ink">{p.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{p.subtitle}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(p.id)}
                          aria-label={`Remove ${p.name}`}
                          className="text-muted-foreground transition hover:text-wine"
                        >
                          <X className="h-4 w-4" strokeWidth={1.3} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-end justify-between pt-3">
                        <QtyStepper
                          size="sm"
                          value={line.qty}
                          max={p.stock}
                          onChange={(v) => setQty(p.id, v)}
                        />
                        <span className="text-sm font-medium text-ink">
                          {formatINR(p.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border bg-paper/60 px-6 py-5">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Products Subtotal</dt>
                  <dd className="font-medium text-ink">{formatINR(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-xs">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="italic text-muted-foreground">To be confirmed by seller</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-medium">
                  <dt className="text-ink">Total Payable</dt>
                  <dd className="font-display text-lg text-ink">
                    {formatINR(totals.subtotal)}{" "}
                    <span className="text-[0.7rem] font-sans font-normal text-muted-foreground">
                      + shipping
                    </span>
                  </dd>
                </div>
              </dl>

              <div className="mt-4 grid gap-2">
                <Button
                  variant="wine"
                  size="xl"
                  onClick={() => {
                    setCartOpen(false);
                    navigate({ to: "/checkout" });
                  }}
                >
                  Proceed to Checkout
                </Button>
                <Button asChild variant="whatsapp" size="xl">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-4 w-4" /> Quick Enquiry via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
