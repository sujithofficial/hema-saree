import type { Product } from "@/data/catalog";

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "discount";
export type Availability = "all" | "in-stock" | "low" | "sold-out";

export interface CatalogQuery {
  category?: string;
  q?: string;
  min?: number;
  max?: number;
  availability?: Availability;
  sort?: SortKey;
  only?: "new" | "bestseller" | "wedding";
}

export const LOW_STOCK_THRESHOLD = 3;

export function stockStatus(stock: number): "sold-out" | "low" | "in-stock" {
  if (stock <= 0) return "sold-out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in-stock";
}

export function stockLabel(stock: number): string {
  const s = stockStatus(stock);
  if (s === "sold-out") return "Sold out";
  if (s === "low") return `Only ${stock} left`;
  return "In stock";
}

export function matchesSearch(p: Product, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [
    p.name,
    p.subtitle,
    p.fabric,
    p.colour,
    p.weave,
    p.sku,
    ...p.categories,
    ...p.occasion,
  ]
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((t) => hay.includes(t));
}

export function filterProducts(products: Product[], query: CatalogQuery): Product[] {
  let list = products.filter((p) => {
    if (query.category && !p.categories.includes(query.category as Product["categories"][number]))
      return false;
    if (query.only === "new" && !p.isNew) return false;
    if (query.only === "bestseller" && !p.isBestseller) return false;
    if (query.only === "wedding" && !p.isWedding) return false;
    if (query.q && !matchesSearch(p, query.q)) return false;
    if (query.min != null && p.price < query.min) return false;
    if (query.max != null && p.price > query.max) return false;
    if (query.availability && query.availability !== "all") {
      const s = stockStatus(p.stock);
      if (query.availability === "in-stock" && s === "sold-out") return false;
      if (query.availability === "low" && s !== "low") return false;
      if (query.availability === "sold-out" && s !== "sold-out") return false;
    }
    return true;
  });

  const sort = query.sort ?? "featured";
  const disc = (p: Product) => (p.mrp && p.mrp > p.price ? (p.mrp - p.price) / p.mrp : 0);
  list = [...list].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return b.addedAt.localeCompare(a.addedAt);
      case "discount":
        return disc(b) - disc(a);
      default:
        return b.popularity - a.popularity;
    }
  });
  return list;
}

export const PRICE_BANDS = [
  { label: "Under ₹3,000", min: 0, max: 3000 },
  { label: "₹3,000 – ₹10,000", min: 3000, max: 10000 },
  { label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { label: "Above ₹20,000", min: 20000, max: undefined },
] as const;
