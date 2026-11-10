import { useState, useEffect } from "react";
import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import {
  Heart,
  Share2,
  Sparkles,
  Truck,
  Video,
  Award,
  ChevronRight,
  Maximize2,
  X,
  Check,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { PRODUCTS, type Product } from "@/data/catalog";
import { SITE } from "@/lib/config";
import { discountPercent, formatINR } from "@/lib/format";
import { stockStatus } from "@/lib/catalog";
import { productEnquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";
import { Price, StockIndicator } from "@/components/site/Price";
import { ProductCard } from "@/components/site/ProductCard";
import { QtyStepper } from "@/components/site/QtyStepper";
import { SareeImage, srcFor } from "@/components/site/SareeImage";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const Route = createFileRoute("/_store/sarees/$slug")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.slug === params.slug);
    if (!product) {
      throw notFound();
    }
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.product) {
      return { meta: [{ title: "Saree Not Found — Hema Sarees" }] };
    }
    const { product } = loaderData;
    const title = `${product.name} — ${product.subtitle} | Hema Sarees`;
    const imageSrc = product.images[0] ? srcFor(product.images[0], 960) : "/favicon.ico";

    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
        { property: "og:image", content: imageSrc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: product.description },
        { name: "twitter:image", content: imageSrc },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            sku: product.sku,
            image: imageSrc,
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: product.price,
              availability:
                product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: SareeNotFound,
  component: SareeDetailPage,
});

function SareeNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow text-gold">Catalogue Item Not Found</p>
      <h1 className="display-md mt-4 text-ink">This saree has unravelled from our shelves</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The saree you are seeking might be archived or re-woven under another name.
      </p>
      <Link
        to="/collections"
        className="eyebrow mt-8 inline-flex items-center gap-2 bg-wine px-6 py-3.5 text-[0.66rem] text-ivory hover:bg-wine-deep"
      >
        Explore available weaves →
      </Link>
    </div>
  );
}

export function SareeDetailPage() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted, markViewed, products: shopProducts } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  // Mark product as viewed in recent history
  useEffect(() => {
    markViewed(product.id);
    setActiveImageIndex(0);
    setQty(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product.id, markViewed]);

  const saved = isWishlisted(product.id);
  const status = stockStatus(product.stock);
  const isAvailable = product.stock > 0;
  const off = discountPercent(product.price, product.mrp);

  // WhatsApp Enquiry URL with page reference
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const waEnquiryUrl = whatsappUrl(
    productEnquiryMessage(
      {
        name: product.name,
        sku: product.sku,
        price: product.price,
        colour: product.colour,
      },
      qty,
      currentUrl,
    ),
  );

  const handleAddToCart = () => {
    if (!isAvailable) {
      toast.error("This saree is currently out of stock");
      return;
    }
    addToCart(product.id, qty, { open: true });
    toast.success(`Added ${product.name} to your bag`, {
      description: `Quantity: ${qty} • ${formatINR(product.price * qty)}`,
    });
  };

  const handleBuyNow = () => {
    if (!isAvailable) {
      toast.error("This saree is currently out of stock");
      return;
    }
    addToCart(product.id, qty, { open: false });
    navigate({ to: "/checkout" });
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} — Hema Sarees`,
          text: product.subtitle,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      if (typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        toast.success("Product link copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  // Related products from same category or occasion
  const relatedProducts = shopProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categories.some((c) => product.categories.includes(c)) ||
          p.occasion.some((o) => product.occasion.includes(o))),
    )
    .slice(0, 4);

  return (
    <div className="flex flex-col pb-24 lg:pb-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="border-b border-border bg-paper/50 py-3 text-xs">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 text-muted-foreground sm:px-8">
          <Link to="/" className="link-underline hover:text-ink">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/collections" className="link-underline hover:text-ink">
            Collections
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            to="/collections/$category"
            params={{ category: product.categories[0] }}
            className="link-underline capitalize hover:text-ink"
          >
            {product.categories[0].replace("-", " ")}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-ink font-medium">{product.name}</span>
        </div>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-14">
        {/* LEFT: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[80px_1fr] lg:gap-5">
            {/* Thumbnail Column (Desktop & Tablet) */}
            <div className="hidden flex-col gap-3 lg:flex">
              {product.images.map((img, idx) => (
                <button
                  key={img.base}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "relative aspect-[4/5] overflow-hidden border transition",
                    activeImageIndex === idx
                      ? "border-wine ring-1 ring-wine"
                      : "border-border opacity-70 hover:opacity-100",
                  )}
                  aria-label={`View image ${idx + 1}`}
                >
                  <SareeImage image={img} sizes="80px" />
                </button>
              ))}
            </div>

            {/* Primary High-Resolution Image Viewport */}
            <div className="relative aspect-[4/5] overflow-hidden border border-border bg-paper shadow-sm">
              <SareeImage
                image={product.images[activeImageIndex]}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="img-zoom cursor-zoom-in"
              />

              {/* Fullscreen Zoom Trigger Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full bg-ivory/85 text-ink shadow-sm backdrop-blur-sm transition hover:bg-ivory hover:text-wine"
                aria-label="Open full screen image viewer"
              >
                <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
              </button>

              {/* Status Badges */}
              <div className="pointer-events-none absolute left-3.5 top-3.5 flex flex-col gap-1.5">
                {product.isNew && (
                  <span className="eyebrow bg-ivory/95 px-2.5 py-1 text-[0.58rem] text-wine shadow-sm">
                    New Weave
                  </span>
                )}
                {product.isWedding && (
                  <span className="eyebrow bg-gold px-2.5 py-1 text-[0.58rem] text-wine-deep shadow-sm">
                    Wedding Edit
                  </span>
                )}
                {off > 0 && (
                  <span className="eyebrow bg-wine px-2.5 py-1 text-[0.58rem] text-ivory shadow-sm">
                    −{off}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Thumbnail Row */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 lg:hidden scrollbar-none">
            {product.images.map((img, idx) => (
              <button
                key={img.base}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  "relative aspect-[4/5] w-16 shrink-0 overflow-hidden border transition",
                  activeImageIndex === idx
                    ? "border-wine ring-1 ring-wine"
                    : "border-border opacity-70",
                )}
                aria-label={`View image ${idx + 1}`}
              >
                <SareeImage image={img} sizes="64px" />
              </button>
            ))}
          </div>

          {/* Craft Guarantee Callout */}
          <div className="mt-2 border-y border-border py-4 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <span>
                Each saree comes with an unstitched 0.8m running blouse piece and authenticity
                assurances.
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT: Product Information, Specs & Actions */}
        <div className="flex flex-col">
          {/* Top meta & Wishlist/Share buttons */}
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="eyebrow text-gold">{product.categories[0].replace("-", " ")}</span>
              <span className="text-border">•</span>
              <span className="font-mono text-[0.7rem] text-muted-foreground">{product.sku}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink transition hover:border-wine hover:text-wine"
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart
                  className={cn("h-4 w-4", saved && "fill-wine text-wine")}
                  strokeWidth={1.5}
                />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink transition hover:border-wine hover:text-wine"
                aria-label="Share product"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Share2 className="h-4 w-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <h1 className="display-lg mt-5 text-ink">{product.name}</h1>
          <p className="mt-2 font-display text-lg italic text-muted-foreground">
            {product.subtitle}
          </p>

          {/* Price & Stock Display */}
          <div className="mt-6 flex flex-wrap items-baseline gap-4">
            <Price price={product.price} mrp={product.mrp} size="lg" />
            <StockIndicator stock={product.stock} />
          </div>
          <p className="mt-1 text-[0.75rem] text-muted-foreground">
            Inclusive of all taxes. Delivery charges confirmed directly on WhatsApp based on
            pincode.
          </p>

          {/* Description */}
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-sm leading-relaxed text-ink/85">{product.description}</p>
          </div>

          {/* Shopping & WhatsApp Action Section */}
          <div className="mt-8 flex flex-col gap-4 border-y border-border py-6">
            <div className="flex items-center gap-4">
              <span className="eyebrow text-[0.62rem] text-muted-foreground">Quantity:</span>
              <QtyStepper
                value={qty}
                max={Math.max(1, product.stock)}
                onChange={(v) => setQty(Math.max(1, Math.min(v, product.stock)))}
                size="md"
              />
              <span className="text-xs text-muted-foreground">
                {product.stock > 0
                  ? product.stock <= 3
                    ? `Only ${product.stock} left in boutique`
                    : "Ready to ship"
                  : "Currently sold out"}
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                variant="wine"
                size="xl"
                disabled={!isAvailable}
                onClick={handleAddToCart}
                className="w-full justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Bag
              </Button>

              <Button
                variant="line"
                size="xl"
                disabled={!isAvailable}
                onClick={handleBuyNow}
                className="w-full justify-center gap-2"
              >
                Buy Now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Direct WhatsApp Ordering / Fabric Video Consultation */}
            <a
              href={waEnquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow flex items-center justify-center gap-2.5 border border-whatsapp bg-whatsapp/10 px-5 py-3.5 text-[0.68rem] text-whatsapp-foreground bg-whatsapp transition-all hover:brightness-105"
            >
              <WhatsAppIcon className="h-4 w-4" /> Order or Enquire via WhatsApp
            </a>

            <p className="text-center text-[0.72rem] text-muted-foreground">
              Prefer personal assistance? Tap above to request daylight drape videos or place your
              order directly.
            </p>
          </div>

          {/* Saree Specifications Details */}
          <div className="mt-8 flex flex-col">
            <h2 className="eyebrow text-gold mb-4">Saree Specifications</h2>
            <div className="grid grid-cols-1 divide-y divide-border border-y border-border text-xs sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <dl className="divide-y divide-border pr-0 sm:pr-4">
                <div className="flex justify-between py-2.5">
                  <dt className="text-muted-foreground">Fabric</dt>
                  <dd className="font-medium text-ink text-right">{product.fabric}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-muted-foreground">Weave & Technique</dt>
                  <dd className="font-medium text-ink text-right">{product.weave}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-muted-foreground">Colour</dt>
                  <dd className="font-medium text-ink text-right">{product.colour}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-muted-foreground">Dimensions</dt>
                  <dd className="font-medium text-ink text-right">{product.length}</dd>
                </div>
              </dl>

              <dl className="divide-y divide-border pl-0 sm:pl-4">
                <div className="flex justify-between py-2.5">
                  <dt className="text-muted-foreground">Blouse Piece</dt>
                  <dd className="font-medium text-ink text-right">{product.blouse}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-muted-foreground">Occasion</dt>
                  <dd className="font-medium text-ink text-right">{product.occasion.join(", ")}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-muted-foreground">Care</dt>
                  <dd className="font-medium text-ink text-right">{product.care}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-muted-foreground">SKU Code</dt>
                  <dd className="font-mono text-ink text-right">{product.sku}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 grid grid-cols-1 gap-4 border border-border bg-paper p-5 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-wine shrink-0" strokeWidth={1.4} />
              <span className="text-xs text-ink/80 leading-tight">
                Authentic Handloom Certified
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-wine shrink-0" strokeWidth={1.4} />
              <span className="text-xs text-ink/80 leading-tight">
                Daylight drape preview on WhatsApp
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-wine shrink-0" strokeWidth={1.4} />
              <span className="text-xs text-ink/80 leading-tight">
                Insured domestic courier delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Image Viewer Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-h-[95vh] max-w-4xl border-0 bg-ivory p-2 sm:p-4 rounded-none">
          <div className="relative flex flex-col items-center">
            <div className="aspect-[4/5] max-h-[85vh] w-full overflow-hidden bg-paper">
              <SareeImage
                image={product.images[activeImageIndex]}
                sizes="100vw"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.base}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "aspect-[4/5] w-12 overflow-hidden border transition",
                    activeImageIndex === idx ? "border-wine" : "border-border opacity-60",
                  )}
                  aria-label={`Show photo ${idx + 1}`}
                >
                  <SareeImage image={img} sizes="48px" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* "Complete the Look" / Related Handlooms */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border bg-paper py-16 sm:py-20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-gold">Curated Recommendations</p>
                <h2 className="display-md mt-2 text-ink">You may also admire</h2>
              </div>
              <Link
                to="/collections"
                className="eyebrow link-underline text-[0.66rem] text-wine hover:text-wine-deep"
              >
                Browse all handlooms →
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-between border-t border-border bg-ivory/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div>
          <p className="font-display text-lg text-ink leading-tight">{formatINR(product.price)}</p>
          <span className="text-[0.68rem] text-muted-foreground">{product.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={waEnquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-10 w-10 place-items-center bg-whatsapp text-whatsapp-foreground"
            aria-label="Order on WhatsApp"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <Button
            variant="wine"
            size="default"
            disabled={!isAvailable}
            onClick={handleAddToCart}
            className="px-4 text-[0.65rem]"
          >
            Add to Bag
          </Button>
          <Button
            variant="line"
            size="default"
            disabled={!isAvailable}
            onClick={handleBuyNow}
            className="px-3 text-[0.65rem]"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
