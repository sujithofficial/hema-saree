import { useState, useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Sparkles, ArrowLeft, SlidersHorizontal } from "lucide-react";

import { CATEGORIES, type CategorySlug, type Product } from "@/data/catalog";
import { type SortKey } from "@/lib/catalog";
import { useShop } from "@/store/shop";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_store/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Fresh Handloom Weaves | Hema Sarees" },
      {
        name: "description",
        content:
          "Discover recent additions to our handloom collection. Pure silks, light linens and festive organzas.",
      },
    ],
  }),
  component: NewArrivalsPage,
});

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function NewArrivalsPage() {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  // Derive products tagged as new or recently added
  const newArrivals = useMemo(() => {
    let list = products.filter((p) => p.isNew || new Date(p.addedAt).getTime() > 1727740800000); // added recently
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categories.includes(selectedCategory));
    }

    return [...list].sort((a, b) => {
      if (sortKey === "price-asc") return a.price - b.price;
      if (sortKey === "price-desc") return b.price - a.price;
      return b.addedAt.localeCompare(a.addedAt);
    });
  }, [products, selectedCategory, sortKey]);

  return (
    <div className="flex flex-col">
      {/* Editorial Header */}
      <section className="relative overflow-hidden border-b border-border bg-paper py-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 butta-pattern opacity-30"
          aria-hidden
        />
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 relative z-10">
          <Link
            to="/collections"
            className="eyebrow link-underline mb-3 inline-flex items-center gap-1.5 text-[0.62rem] text-muted-foreground hover:text-wine"
          >
            <ArrowLeft className="h-3 w-3" /> All Collections
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ivory/80 px-3 py-1 mb-2">
            <Sparkles className="h-3 w-3 text-gold" />
            <span className="eyebrow text-[0.58rem] text-wine">Autumn & Festive 2026 Releases</span>
          </div>
          <h1 className="display-lg mt-2 text-ink">
            New Arrivals & <em className="italic text-wine">Fresh Weaves</em>
          </h1>
          <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-ink/80">
            A curated showcase of recently loomed additions to our catalogue — from delicate organza
            drapes to seasonal soft silks and breathable linens.
          </p>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <div className="border-b border-border bg-ivory py-4">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 sm:px-8">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "eyebrow whitespace-nowrap border px-3.5 py-1.5 text-[0.62rem] transition",
                selectedCategory === "all"
                  ? "border-wine bg-wine text-ivory"
                  : "border-border bg-paper text-ink hover:border-wine/50",
              )}
            >
              All New ({products.filter((p) => p.isNew).length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = products.filter(
                (p) => p.isNew && p.categories.includes(cat.slug),
              ).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    "eyebrow whitespace-nowrap border px-3.5 py-1.5 text-[0.62rem] transition",
                    selectedCategory === cat.slug
                      ? "border-wine bg-wine text-ivory"
                      : "border-border bg-paper text-ink hover:border-wine/50",
                  )}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <span className="eyebrow text-[0.62rem] text-muted-foreground">Sort:</span>
            <select
              aria-label="Sort new arrivals"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="eyebrow border border-border bg-paper px-3 py-1.5 text-[0.64rem] text-ink outline-none transition focus:border-wine"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8">
        {newArrivals.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-border bg-paper px-6 py-20 text-center">
            <SlidersHorizontal className="h-8 w-8 text-gold mb-4" />
            <h2 className="font-display text-2xl text-ink">No new weaves in this category</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Explore our full collection to see all handwoven sarees.
            </p>
            <Button
              variant="wine"
              size="sm"
              className="mt-6"
              onClick={() => setSelectedCategory("all")}
            >
              Show all new arrivals
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
