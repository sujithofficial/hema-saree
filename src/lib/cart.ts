import type { Product } from "@/data/catalog";

export interface CartLine {
  productId: string;
  qty: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  savings: number;
}

/** Clamp a requested quantity to what's in stock (min 1 when in stock). */
export function clampQty(qty: number, stock: number): number {
  if (stock <= 0) return 0;
  return Math.max(1, Math.min(Math.floor(qty), stock));
}

export function computeTotals(lines: CartLine[], products: Product[]): CartTotals {
  let itemCount = 0;
  let subtotal = 0;
  let savings = 0;
  for (const l of lines) {
    const p = products.find((x) => x.id === l.productId);
    if (!p) continue;
    itemCount += l.qty;
    subtotal += p.price * l.qty;
    if (p.mrp && p.mrp > p.price) savings += (p.mrp - p.price) * l.qty;
  }
  return {
    itemCount,
    subtotal,
    savings,
  };
}
