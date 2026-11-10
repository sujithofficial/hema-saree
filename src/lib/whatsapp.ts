import { SITE } from "./config";
import { formatINR } from "./format";

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(
  p: {
    name: string;
    sku: string;
    price: number;
    colour: string;
  },
  qty = 1,
  pageUrl?: string,
): string {
  return [
    `Namaste ${SITE.name}, I'd like to enquire about this saree:`,
    ``,
    `• ${p.name}`,
    `• Code: ${p.sku}`,
    `• Colour: ${p.colour}`,
    `• Price: ${formatINR(p.price)}`,
    `• Quantity: ${qty}`,
    pageUrl ? `• Link: ${pageUrl}` : "",
    ``,
    `Is it available? Please share daylight fabric videos and delivery details.`,
  ]
    .filter((l) => l !== "")
    .join("\n");
}

export interface OrderMessageLine {
  name: string;
  sku: string;
  qty: number;
  price: number;
}

export function orderMessage(opts: {
  lines: OrderMessageLine[];
  subtotal: number;
  shipping?: number | null;
  total?: number;
  orderId?: string;
  customer?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    pincode: string;
    notes?: string;
  };
}): string {
  const out: string[] = [];
  out.push(
    `Namaste ${SITE.name}, I would like to place an order${opts.orderId ? ` (Ref: ${opts.orderId})` : ""}:`,
  );
  out.push("");
  opts.lines.forEach((l, i) => {
    out.push(`${i + 1}. ${l.name} [Code: ${l.sku}] × ${l.qty} — ${formatINR(l.price * l.qty)}`);
  });
  out.push("");
  out.push(`Subtotal: ${formatINR(opts.subtotal)}`);

  if (opts.shipping != null && opts.shipping > 0) {
    out.push(`Shipping: ${formatINR(opts.shipping)}`);
    out.push(`Total: ${formatINR(opts.subtotal + opts.shipping)}`);
  } else if (opts.shipping === 0) {
    out.push(`Shipping: Complimentary`);
    out.push(`Total: ${formatINR(opts.subtotal)}`);
  } else {
    out.push(`Shipping: To be confirmed by seller`);
    out.push(
      `Estimated Total: ${formatINR(opts.subtotal)} + shipping charges (pending confirmation)`,
    );
  }

  if (opts.customer) {
    const c = opts.customer;
    out.push("");
    out.push("Delivery Information:");
    out.push(`• Name: ${c.name}`);
    out.push(`• Phone: ${c.phone}`);
    out.push(`• Address: ${c.address}, ${c.city}${c.state ? `, ${c.state}` : ""} – ${c.pincode}`);
    if (c.notes) out.push(`• Notes: ${c.notes}`);
  }

  out.push("");
  out.push(
    "Please confirm saree availability, delivery charges for my pincode, and direct payment arrangements.",
  );
  return out.join("\n");
}
