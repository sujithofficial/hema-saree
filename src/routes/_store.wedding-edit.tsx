import { useState, useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Sparkles, ArrowLeft, HeartHandshake } from "lucide-react";

import { LOOKBOOK, type Product } from "@/data/catalog";
import { SITE } from "@/lib/config";
import { whatsappUrl } from "@/lib/whatsapp";
import { useShop } from "@/store/shop";
import { ProductCard } from "@/components/site/ProductCard";
import { SareeImage } from "@/components/site/SareeImage";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_store/wedding-edit")({
  head: () => ({
    meta: [
      { title: "The Wedding Edit — Ceremonial & Bridal Silks | Hema Sarees" },
      {
        name: "description",
        content:
          "Explore ceremonial Kanchipuram silks, Banarasi brocades and festive drapes for weddings and family celebrations.",
      },
    ],
  }),
  component: WeddingEditPage,
});

const OCCASIONS = [
  { id: "all", label: "All Ceremonial Pieces" },
  { id: "wedding", label: "Muhurtham & Wedding" },
  { id: "reception", label: "Reception & Evening" },
  { id: "festive", label: "Festive & Sangeet" },
] as const;

export function WeddingEditPage() {
  const { products } = useShop();
  const [activeOccasion, setActiveOccasion] = useState<string>("all");

  const weddingSarees = useMemo(() => {
    return products.filter((p) => {
      if (activeOccasion === "all") {
        return (
          p.isWedding ||
          p.occasion.some((o) =>
            ["wedding", "reception", "festive", "ceremony", "sangeet"].includes(o.toLowerCase()),
          )
        );
      }
      if (activeOccasion === "wedding") {
        return p.occasion.some((o) => ["wedding", "ceremony"].includes(o.toLowerCase()));
      }
      if (activeOccasion === "reception") {
        return p.occasion.some((o) =>
          ["reception", "evening", "cocktail"].includes(o.toLowerCase()),
        );
      }
      if (activeOccasion === "festive") {
        return p.occasion.some((o) => ["festive", "sangeet"].includes(o.toLowerCase()));
      }
      return true;
    });
  }, [products, activeOccasion]);

  return (
    <div className="flex flex-col">
      {/* Wedding Hero Banner */}
      <section className="relative overflow-hidden border-b border-border bg-wine-deep py-16 text-ivory sm:py-24">
        <div className="temple-border absolute inset-x-0 top-0 bg-gold" aria-hidden />
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Link
              to="/collections"
              className="eyebrow link-underline mb-4 inline-flex items-center gap-1.5 text-[0.62rem] text-gold-soft hover:text-ivory"
            >
              <ArrowLeft className="h-3 w-3" /> All Collections
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-wine px-3 py-1 mb-3">
              <Sparkles className="h-3 w-3 text-gold-soft" />
              <span className="eyebrow text-[0.58rem] text-gold-soft">
                The Bridal & Festive Trousseau
              </span>
            </div>
            <h1 className="display-xl text-ivory">
              The Wedding <em className="italic text-gold-soft">Edit</em>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/80 sm:text-base">
              A ceremonial curation of dense brocades, luminous tissue drapes, and traditional
              temple-bordered silks designed to grace sacred ceremonies, muhurthams, and evening
              receptions.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={whatsappUrl(
                  `Namaste ${SITE.name}, I would like to request personal guidance for wedding saree selection.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow inline-flex items-center justify-center gap-2.5 bg-gold px-6 py-3.5 text-[0.66rem] text-wine-deep transition hover:bg-gold-soft"
              >
                <WhatsAppIcon className="h-4 w-4" /> Personal Bridal Consultation
              </a>
              <span className="text-xs text-ivory/60">
                We share daylight drape videos on WhatsApp
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden border border-gold/40 shadow-soft">
              <SareeImage
                image={LOOKBOOK.wedding}
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="img-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 border-t border-ivory/20 pt-2 text-xs text-ivory/80">
                Traditional ceremonial wedding collection
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasion Navigation Bar */}
      <div className="border-b border-border bg-paper py-4">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-4 sm:px-8 scrollbar-none">
          {OCCASIONS.map((occ) => (
            <button
              key={occ.id}
              type="button"
              onClick={() => setActiveOccasion(occ.id)}
              className={cn(
                "eyebrow whitespace-nowrap border px-4 py-2 text-[0.62rem] transition",
                activeOccasion === occ.id
                  ? "border-wine bg-wine text-ivory"
                  : "border-border bg-ivory text-ink hover:border-wine/50",
              )}
            >
              {occ.label}
            </button>
          ))}
        </div>
      </div>

      {/* Saree Grid */}
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {weddingSarees.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ))}
        </div>

        {/* Bridal Styling Note */}
        <div className="mt-16 border border-gold/40 bg-paper p-8 text-center sm:p-12">
          <HeartHandshake className="mx-auto h-8 w-8 text-wine" strokeWidth={1.3} />
          <h2 className="font-display text-2xl text-ink mt-4">
            Curating Family Drapes & Bridal Trousseaus
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground">
            Whether coordinating matching shades for the bridal party or choosing an heirloom saree
            for muhurtham rituals, our team provides personal assistance and daylight video
            consultations.
          </p>
          <a
            href={whatsappUrl(
              `Namaste ${SITE.name}, I'd like help styling and choosing sarees for an upcoming wedding.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow link-underline mt-5 inline-flex items-center gap-2 text-[0.66rem] text-wine"
          >
            <WhatsAppIcon className="h-4 w-4" /> Message our bridal stylist on WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}
