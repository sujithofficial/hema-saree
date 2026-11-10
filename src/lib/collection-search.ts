import type { Availability, SortKey } from "./catalog";

export interface CollectionSearch {
  q?: string;
  sort?: SortKey;
  min?: number;
  max?: number;
  avail?: Availability;
}

const SORTS: SortKey[] = ["featured", "newest", "price-asc", "price-desc", "discount"];
const AVAILS: Availability[] = ["all", "in-stock", "low", "sold-out"];

const num = (v: unknown): number | undefined => {
  const n = typeof v === "number" ? v : typeof v === "string" && v !== "" ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function validateCollectionSearch(s: Record<string, unknown>): CollectionSearch {
  return {
    q: typeof s.q === "string" && s.q.trim() ? s.q : undefined,
    sort: SORTS.includes(s.sort as SortKey) ? (s.sort as SortKey) : undefined,
    min: num(s.min),
    max: num(s.max),
    avail: AVAILS.includes(s.avail as Availability) ? (s.avail as Availability) : undefined,
  };
}
