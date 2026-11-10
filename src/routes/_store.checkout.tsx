import { useState, type FormEvent } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, ArrowLeft, Info, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useShop } from "@/store/shop";
import { formatINR } from "@/lib/format";
import { orderMessage, whatsappUrl } from "@/lib/whatsapp";
import { SareeImage } from "@/components/site/SareeImage";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_store/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Place Order via WhatsApp | Hema Sarees" },
      {
        name: "description",
        content:
          "Provide your delivery details and place your order directly via WhatsApp. Zero payment gateway required.",
      },
    ],
  }),
  component: CheckoutPage,
});

export function CheckoutPage() {
  const { cart, getProduct, totals, addOrder, clearCart } = useShop();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cart item lines
  const orderLines = cart
    .map((line) => {
      const p = getProduct(line.productId);
      return p
        ? {
            productId: p.id,
            name: p.name,
            sku: p.sku,
            qty: line.qty,
            price: p.price,
            image: p.images[0],
            subtitle: p.subtitle,
          }
        : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (orderLines.length === 0) {
      toast.error("Your shopping bag is empty");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      toast.error("Please fill in all required delivery details");
      return;
    }

    // Basic mobile validation
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    setIsSubmitting(true);

    // Generate unique order reference
    const orderId = `HS-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim() || undefined,
      pincode: pincode.trim(),
      channel: "website" as const,
      status: "pending" as const,
      lines: orderLines.map((l) => ({
        productId: l.productId,
        name: l.name,
        sku: l.sku,
        qty: l.qty,
        price: l.price,
      })),
      subtotal: totals.subtotal,
      shipping: null, // Pending confirmation by seller
      total: totals.subtotal,
      notes: notes.trim() || undefined,
    };

    // Save order with Pending status
    addOrder(newOrder);

    // Prepare WhatsApp message
    const waText = orderMessage({
      lines: orderLines.map((l) => ({
        name: l.name,
        sku: l.sku,
        qty: l.qty,
        price: l.price,
      })),
      subtotal: totals.subtotal,
      shipping: null,
      orderId,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim() || undefined,
        pincode: pincode.trim(),
        notes: notes.trim() || undefined,
      },
    });

    const waLink = whatsappUrl(waText);

    // Clear cart and redirect
    clearCart();

    // Trigger WhatsApp link
    if (typeof window !== "undefined") {
      window.open(waLink, "_blank", "noopener,noreferrer");
    }

    toast.success("Order request created", {
      description: `Reference: ${orderId}. WhatsApp chat opened with your details.`,
    });

    navigate({
      to: "/order-confirmation/$orderId",
      params: { orderId },
    });
  };

  if (orderLines.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-paper text-gold">
          <ShoppingBag className="h-6 w-6 text-wine" strokeWidth={1.3} />
        </div>
        <h1 className="display-md mt-6 text-ink">Your bag is empty</h1>
        <p className="mt-2 max-w-md text-xs text-muted-foreground">
          You need at least one saree in your bag to proceed with WhatsApp checkout.
        </p>
        <Link
          to="/collections"
          className="eyebrow mt-8 inline-flex items-center gap-2 bg-wine px-6 py-3.5 text-[0.66rem] text-ivory hover:bg-wine-deep"
        >
          Explore Collections →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background">
      {/* Checkout Header */}
      <section className="border-b border-border bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <Link
            to="/collections"
            className="eyebrow link-underline mb-3 inline-flex items-center gap-1.5 text-[0.62rem] text-muted-foreground hover:text-wine"
          >
            <ArrowLeft className="h-3 w-3" /> Continue shopping
          </Link>
          <p className="eyebrow text-gold">WhatsApp-First Checkout</p>
          <h1 className="display-lg mt-2 text-ink">
            Delivery Details & <em className="italic text-wine">Order Confirmation</em>
          </h1>
          <p className="mt-2 max-w-xl text-xs text-muted-foreground">
            No online payment gateway required. We confirm your saree availability, calculate exact
            shipping for your pincode, and share direct bank/UPI details over WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Form and Order Summary Grid */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-4 py-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Customer Address Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div className="border border-border bg-paper p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">1. Delivery Address</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Please enter the shipping address where your saree parcel will be delivered.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="full-name"
                  className="eyebrow block text-[0.62rem] text-muted-foreground"
                >
                  Full Name *
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  placeholder="e.g. S. Ramanathan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full border border-border bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-wine"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="phone-number"
                  className="eyebrow block text-[0.62rem] text-muted-foreground"
                >
                  WhatsApp Mobile Number *
                </label>
                <input
                  id="phone-number"
                  type="tel"
                  required
                  placeholder="e.g. +91 98400 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full border border-border bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-wine"
                />
                <span className="mt-1 block text-[0.68rem] text-muted-foreground">
                  We will contact you at this number with fabric videos and tracking details.
                </span>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="street-address"
                  className="eyebrow block text-[0.62rem] text-muted-foreground"
                >
                  Street Address & Flat / Door No. *
                </label>
                <input
                  id="street-address"
                  type="text"
                  required
                  placeholder="e.g. 14 Mylapore Tank Street, Opp. Kapaleeshwarar Temple"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1.5 w-full border border-border bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-wine"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="eyebrow block text-[0.62rem] text-muted-foreground"
                >
                  City / Town *
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  placeholder="e.g. Chennai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1.5 w-full border border-border bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-wine"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="eyebrow block text-[0.62rem] text-muted-foreground"
                >
                  State / Region
                </label>
                <input
                  id="state"
                  type="text"
                  placeholder="e.g. Tamil Nadu"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-1.5 w-full border border-border bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-wine"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="pincode"
                  className="eyebrow block text-[0.62rem] text-muted-foreground"
                >
                  6-Digit Postal PIN Code *
                </label>
                <input
                  id="pincode"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 600004"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="mt-1.5 w-full border border-border bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-wine"
                />
                <span className="mt-1 block text-[0.68rem] text-muted-foreground">
                  Used by our team to look up accurate courier charges (Blue Dart / DTDC / Speed
                  Post).
                </span>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="eyebrow block text-[0.62rem] text-muted-foreground"
                >
                  Order Notes or Blouse Stitching Requests (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="e.g. Please send daylight video of the pallu before dispatching."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1.5 w-full border border-border bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-wine"
                />
              </div>
            </div>
          </div>

          {/* Submission Notice & Action Button */}
          <div className="border border-gold/40 bg-ivory p-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-muted-foreground">
                <p className="font-medium text-ink">How your order will be confirmed:</p>
                <ol className="mt-1.5 list-decimal space-y-1 pl-4">
                  <li>
                    Tapping below will create your order reference in <strong>Pending</strong>{" "}
                    status.
                  </li>
                  <li>WhatsApp will open with your pre-filled items and address.</li>
                  <li>
                    Our boutique will review your pincode, confirm saree availability, and share
                    exact delivery charges.
                  </li>
                  <li>Payment is arranged directly via WhatsApp (UPI/Bank Transfer).</li>
                </ol>
              </div>
            </div>

            <Button
              type="submit"
              variant="whatsapp"
              size="xl"
              disabled={isSubmitting}
              className="mt-6 w-full justify-center gap-2.5 py-4"
            >
              <WhatsAppIcon className="h-4 w-4" /> Place Order via WhatsApp
            </Button>
          </div>
        </form>

        {/* Order Summary Column */}
        <aside className="flex flex-col">
          <div className="border border-border bg-paper p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">2. Order Summary</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {orderLines.length} {orderLines.length === 1 ? "saree" : "sarees"} in your bag
            </p>

            {/* List of items */}
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {orderLines.map((item) => (
                <li key={item.productId} className="flex gap-4 py-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden border border-border bg-ivory">
                    <SareeImage image={item.image} sizes="64px" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="font-display text-base text-ink">{item.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.subtitle}</p>
                      <p className="mt-0.5 font-mono text-[0.68rem] text-muted-foreground">
                        Code: {item.sku}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Qty: {item.qty}</span>
                      <span className="font-medium text-ink">
                        {formatINR(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Calculations Breakdown */}
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Product Subtotal</dt>
                <dd className="font-medium text-ink">{formatINR(totals.subtotal)}</dd>
              </div>

              <div className="flex items-center justify-between text-xs">
                <dt className="text-muted-foreground flex items-center gap-1.5">
                  <span>Shipping Charges</span>
                </dt>
                <dd className="italic text-muted-foreground">To be confirmed by seller</dd>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex items-baseline justify-between">
                  <dt className="font-medium text-ink">Final Payable Amount</dt>
                  <dd className="font-display text-xl text-ink">
                    {formatINR(totals.subtotal)}{" "}
                    <span className="font-sans text-xs text-muted-foreground">+ shipping</span>
                  </dd>
                </div>
                <p className="mt-1 text-[0.72rem] text-muted-foreground italic">
                  Exact shipping will be quoted on WhatsApp based on your destination pincode.
                </p>
              </div>
            </dl>

            {/* Safe Shopping Assurances */}
            <div className="mt-8 border-t border-border pt-6 space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-wine shrink-0" />
                <span>Zero payment gateway risks — discuss directly with the boutique.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-wine shrink-0" />
                <span>Fabric inspection and daylight video available prior to dispatch.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
