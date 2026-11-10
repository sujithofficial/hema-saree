import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Filter, SlidersHorizontal, X, Search, RotateCcw, Check } from "lucide-react";

import { CATEGORIES, PRODUCTS, type CategorySlug, type Product } from "@/data/catalog";
import {
  PRICE_BANDS,
  filterProducts,
  stockStatus,
  type Availability,
  type SortKey,
} from "@/lib/catalog";
import { type CollectionSearch } from "@/lib/collection-search";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  initialCategory?: CategorySlug;
  searchParams?: CollectionSearch;
  basePath: string;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured & Curated" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Bestselling & Offers" },
];

export function CollectionCatalog({ initialCategory, searchParams = {}, basePath }: Props) {
  const { products: shopProducts } = useShop();
  const navigate = useNavigate();

  // Local state initialized from searchParams or defaults
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | "all">(
    initialCategory ?? "all",
  );
  const [activeSort, setActiveSort] = useState<SortKey>(searchParams.sort ?? "featured");
  const [availability, setAvailability] = useState<Availability>(searchParams.avail ?? "all");
  const [priceBand, setPriceBand] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number | undefined>(searchParams.min);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(searchParams.max);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.q ?? "");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter application
  const filteredProducts = useMemo(() => {
    return filterProducts(shopProducts, {
      category: selectedCategory === "all" ? undefined : selectedCategory,
      q: searchQuery.trim() || undefined,
      min: minPrice,
      max: maxPrice,
      availability: availability,
      sort: activeSort,
    });
  }, [shopProducts, selectedCategory, searchQuery, minPrice, maxPrice, availability, activeSort]);

  const activeFilterCount =
    (selectedCategory !== (initialCategory ?? "all") ? 1 : 0) +
    (minPrice != null || maxPrice != null ? 1 : 0) +
    (availability !== "all" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handlePriceBand = (label: string, min?: number, max?: number) => {
    setPriceBand(label);
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleResetFilters = () => {
    setSelectedCategory(initialCategory ?? "all");
    setAvailability("all");
    setPriceBand("all");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSearchQuery("");
    setActiveSort("featured");
  };

  return (
    <div className="flex flex-col">
      {/* Category Pills Navigation */}
      <div className="border-b border-border bg-paper/60 py-4">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-4 sm:px-8 scrollbar-none">
          <Link
            to="/collections"
            className={cn(
              "eyebrow whitespace-nowrap border px-4 py-2 text-[0.62rem] transition-colors",
              selectedCategory === "all" && !initialCategory
                ? "border-wine bg-wine text-ivory"
                : "border-border bg-ivory text-ink hover:border-wine/50",
            )}
            onClick={() => setSelectedCategory("all")}
          >
            All Weaves ({shopProducts.length})
          </Link>
          {CATEGORIES.map((cat) => {
            const count = shopProducts.filter((p) => p.categories.includes(cat.slug)).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <Link
                key={cat.slug}
                to="/collections/$category"
                params={{ category: cat.slug }}
                className={cn(
                  "eyebrow whitespace-nowrap border px-4 py-2 text-[0.62rem] transition-colors",
                  isSelected
                    ? "border-wine bg-wine text-ivory"
                    : "border-border bg-ivory text-ink hover:border-wine/50",
                )}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Product Count, Mobile Filter Trigger & Sort Dropdown */}
      <div className="border-b border-border bg-ivory py-4">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="eyebrow text-gold">Catalogue</span>
            <span className="h-3 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              Showing <strong className="font-medium text-ink">{filteredProducts.length}</strong>{" "}
              {filteredProducts.length === 1 ? "saree" : "sarees"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="eyebrow flex items-center gap-2 border border-border bg-paper px-3.5 py-2 text-[0.64rem] text-ink transition hover:border-wine lg:hidden"
                >
                  <Filter className="h-3.5 w-3.5 text-wine" />
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] bg-ivory p-6 overflow-y-auto">
                <SheetHeader className="text-left border-b border-border pb-4">
                  <SheetTitle className="font-display text-2xl font-normal text-ink">
                    Filter Sarees
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-6">
                  {/* Category Filter Mobile */}
                  <div>
                    <p className="eyebrow text-gold mb-3">Weave Category</p>
                    <div className="flex flex-col gap-1.5 text-sm">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory("all")}
                        className={cn(
                          "flex items-center justify-between py-1.5 px-2 text-left transition",
                          selectedCategory === "all"
                            ? "bg-paper font-medium text-wine"
                            : "text-ink hover:text-wine",
                        )}
                      >
                        <span>All Weaves</span>
                        {selectedCategory === "all" && <Check className="h-3.5 w-3.5" />}
                      </button>
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => setSelectedCategory(c.slug)}
                          className={cn(
                            "flex items-center justify-between py-1.5 px-2 text-left transition",
                            selectedCategory === c.slug
                              ? "bg-paper font-medium text-wine"
                              : "text-ink hover:text-wine",
                          )}
                        >
                          <span>{c.name}</span>
                          {selectedCategory === c.slug && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter Mobile */}
                  <div className="border-t border-border pt-4">
                    <p className="eyebrow text-gold mb-3">Price Range</p>
                    <div className="flex flex-col gap-1.5 text-sm">
                      <button
                        type="button"
                        onClick={() => handlePriceBand("all")}
                        className={cn(
                          "py-1.5 px-2 text-left transition",
                          priceBand === "all"
                            ? "bg-paper font-medium text-wine"
                            : "text-ink hover:text-wine",
                        )}
                      >
                        All Prices
                      </button>
                      {PRICE_BANDS.map((b) => (
                        <button
                          key={b.label}
                          type="button"
                          onClick={() => handlePriceBand(b.label, b.min, b.max)}
                          className={cn(
                            "py-1.5 px-2 text-left transition",
                            priceBand === b.label
                              ? "bg-paper font-medium text-wine"
                              : "text-ink hover:text-wine",
                          )}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability Filter Mobile */}
                  <div className="border-t border-border pt-4">
                    <p className="eyebrow text-gold mb-3">Availability</p>
                    <div className="flex flex-col gap-1.5 text-sm">
                      {(
                        [
                          { id: "all", label: "All Items" },
                          { id: "in-stock", label: "In Stock" },
                          { id: "low", label: "Low Stock (≤ 3)" },
                        ] as const
                      ).map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setAvailability(a.id)}
                          className={cn(
                            "py-1.5 px-2 text-left transition",
                            availability === a.id
                              ? "bg-paper font-medium text-wine"
                              : "text-ink hover:text-wine",
                          )}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Button */}
                  <div className="border-t border-border pt-6">
                    <Button
                      variant="line"
                      className="w-full text-xs"
                      onClick={() => {
                        handleResetFilters();
                        setMobileFilterOpen(false);
                      }}
                    >
                      Reset All Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="eyebrow hidden text-[0.62rem] text-muted-foreground sm:inline">
                Sort:
              </span>
              <select
                aria-label="Sort sarees"
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as SortKey)}
                className="eyebrow border border-border bg-paper px-3 py-2 text-[0.64rem] text-ink outline-none transition focus:border-wine"
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
      </div>

      {/* Active Filter Pills Bar (if any) */}
      {activeFilterCount > 0 && (
        <div className="border-b border-border bg-ivory/80 px-4 py-2.5 sm:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2">
            <span className="eyebrow text-[0.6rem] text-muted-foreground mr-1">Active:</span>

            {selectedCategory !== "all" && selectedCategory !== initialCategory && (
              <span className="inline-flex items-center gap-1.5 border border-wine/30 bg-paper px-2.5 py-1 text-xs text-wine">
                Weave: {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                <button
                  type="button"
                  onClick={() => setSelectedCategory(initialCategory ?? "all")}
                  aria-label="Remove category filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {priceBand !== "all" && (
              <span className="inline-flex items-center gap-1.5 border border-wine/30 bg-paper px-2.5 py-1 text-xs text-wine">
                Price: {priceBand}
                <button
                  type="button"
                  onClick={() => handlePriceBand("all")}
                  aria-label="Remove price filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {availability !== "all" && (
              <span className="inline-flex items-center gap-1.5 border border-wine/30 bg-paper px-2.5 py-1 text-xs text-wine">
                Availability: {availability === "in-stock" ? "In Stock" : "Low Stock"}
                <button
                  type="button"
                  onClick={() => setAvailability("all")}
                  aria-label="Remove availability filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 border border-wine/30 bg-paper px-2.5 py-1 text-xs text-wine">
                Search: "{searchQuery}"
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search text"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="eyebrow link-underline ml-2 text-[0.62rem] text-muted-foreground hover:text-wine"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Desktop Filter Sidebar + Product Grid */}
      <div className="mx-auto grid max-w-[1440px] flex-1 grid-cols-1 gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[260px_1fr] lg:gap-12">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden flex-col gap-8 lg:flex">
          {/* Quick Search */}
          <div className="border border-border bg-paper p-4">
            <p className="eyebrow text-gold mb-2">Search catalogue</p>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Weave, colour, motif..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-b border-ink/40 bg-transparent py-2 pl-2 pr-7 text-xs text-ink placeholder:text-muted-foreground/60 outline-none focus:border-wine"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 text-muted-foreground hover:text-wine"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Search className="absolute right-1 h-3.5 w-3.5 text-muted-foreground/60" />
              )}
            </div>
          </div>

          {/* Weave Category Filter */}
          <div className="border border-border bg-paper p-5">
            <p className="eyebrow text-gold mb-3 flex items-center justify-between">
              <span>Weave Category</span>
              {selectedCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="text-[0.6rem] text-muted-foreground hover:text-wine"
                >
                  Reset
                </button>
              )}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "flex w-full items-center justify-between py-1 transition",
                    selectedCategory === "all"
                      ? "font-medium text-wine"
                      : "text-ink/80 hover:text-wine",
                  )}
                >
                  <span>All Weaves</span>
                  <span className="text-muted-foreground text-[0.7rem]">{shopProducts.length}</span>
                </button>
              </li>
              {CATEGORIES.map((c) => {
                const count = shopProducts.filter((p) => p.categories.includes(c.slug)).length;
                const isSelected = selectedCategory === c.slug;
                return (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(c.slug)}
                      className={cn(
                        "flex w-full items-center justify-between py-1 transition",
                        isSelected ? "font-medium text-wine" : "text-ink/80 hover:text-wine",
                      )}
                    >
                      <span>{c.name}</span>
                      <span className="text-muted-foreground text-[0.7rem]">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Price Bands Filter */}
          <div className="border border-border bg-paper p-5">
            <p className="eyebrow text-gold mb-3 flex items-center justify-between">
              <span>Price in INR</span>
              {priceBand !== "all" && (
                <button
                  type="button"
                  onClick={() => handlePriceBand("all")}
                  className="text-[0.6rem] text-muted-foreground hover:text-wine"
                >
                  Reset
                </button>
              )}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handlePriceBand("all")}
                  className={cn(
                    "flex w-full items-center justify-between py-1 transition",
                    priceBand === "all" ? "font-medium text-wine" : "text-ink/80 hover:text-wine",
                  )}
                >
                  <span>All Prices</span>
                </button>
              </li>
              {PRICE_BANDS.map((b) => (
                <li key={b.label}>
                  <button
                    type="button"
                    onClick={() => handlePriceBand(b.label, b.min, b.max)}
                    className={cn(
                      "flex w-full items-center justify-between py-1 transition",
                      priceBand === b.label
                        ? "font-medium text-wine"
                        : "text-ink/80 hover:text-wine",
                    )}
                  >
                    <span>{b.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Availability Filter */}
          <div className="border border-border bg-paper p-5">
            <p className="eyebrow text-gold mb-3 flex items-center justify-between">
              <span>Availability</span>
              {availability !== "all" && (
                <button
                  type="button"
                  onClick={() => setAvailability("all")}
                  className="text-[0.6rem] text-muted-foreground hover:text-wine"
                >
                  Reset
                </button>
              )}
            </p>
            <div className="space-y-2 text-xs">
              {(
                [
                  { id: "all", label: "All Items" },
                  { id: "in-stock", label: "In Stock" },
                  { id: "low", label: "Low Stock (≤ 3 left)" },
                ] as const
              ).map((a) => (
                <label
                  key={a.id}
                  className="flex cursor-pointer items-center gap-2 text-ink/80 hover:text-wine"
                >
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === a.id}
                    onChange={() => setAvailability(a.id)}
                    className="accent-wine"
                  />
                  <span>{a.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* WhatsApp Personal Assistant Helper */}
          <div className="border border-gold/40 bg-ivory p-5 text-center">
            <p className="eyebrow text-gold text-[0.62rem]">Need Styling Advice?</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Our boutique curators share daylight drape videos and help you choose the right weave.
            </p>
            <Link
              to="/about"
              className="eyebrow link-underline mt-4 inline-block text-[0.62rem] text-wine"
            >
              Learn about our looms →
            </Link>
          </div>
        </aside>

        {/* Product Cards Grid or Empty State */}
        <section className="flex flex-col">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-border bg-paper px-6 py-20 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-ivory text-gold">
                <SlidersHorizontal className="h-6 w-6 text-wine" strokeWidth={1.3} />
              </div>
              <h3 className="font-display text-2xl text-ink mt-6">
                No sarees match your current filters
              </h3>
              <p className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
                Try widening your price range, clearing the search term, or browsing all handloom
                categories.
              </p>
              <Button
                variant="wine"
                size="default"
                className="mt-6 flex items-center gap-2"
                onClick={handleResetFilters}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
