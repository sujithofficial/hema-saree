import { useState, useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Award, ArrowLeft } from "lucide-react";

import { CATEGORIES, type CategorySlug } from "@/data/catalog";
import { type SortKey } from "@/lib/catalog";
import { useShop } from "@/store/shop";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_store/bestsellers")({
  head: () => ({
    meta: [
      { title: "The Signature Edit — Curated Favourites | Hema Sarees" },
      {
        name: "description",
        content:
          "Explore our most cherished handloom designs. Beloved Kanchipurams, Banarasi brocades and everyday classics.",
      },
    ],
  }),
  component: BestsellersPage,
});

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Curated Order" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export function BestsellersPage() {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("featured");

  // Derive products flagged as bestsellers or high popularity
  const bestsellers = useMemo(() => {
    let list = products.filter((p) => p.isBestseller || p.popularity >= 85);
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categories.includes(selectedCategory));
    }

    return [...list].sort((a, b) => {
      if (sortKey === "price-asc") return a.price - b.price;
      if (sortKey === "price-desc") return b.price - a.price;
      if (sortKey === "newest") return b.addedAt.localeCompare(a.addedAt);
      return b.popularity - a.popularity;
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
            <Award className="h-3 w-3 text-gold" />
            <span className="eyebrow text-[0.58rem] text-wine">The Signature Collection</span>
          </div>
          <h1 className="display-lg mt-2 text-ink">
            Curated Favourites & <em className="italic text-wine">Signature Weaves</em>
          </h1>
          <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-ink/80">
            A handpicked selection of our most admired saree silhouettes — designs that celebrate
            master craftsmanship and timeless drape appeal across seasons.
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
              All Favourites ({products.filter((p) => p.isBestseller || p.popularity >= 85).length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = products.filter(
                (p) => (p.isBestseller || p.popularity >= 85) && p.categories.includes(cat.slug),
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
              aria-label="Sort favourites"
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
