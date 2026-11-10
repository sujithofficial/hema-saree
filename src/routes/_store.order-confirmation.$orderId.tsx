import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { CheckCircle, Clock, MapPin, Phone, MessageSquare, ArrowRight } from "lucide-react";

import { useShop } from "@/store/shop";
import { formatINR } from "@/lib/format";
import { orderMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_store/order-confirmation/$orderId")({
  head: ({ params }) => ({
    meta: [
      { title: `Order Request ${params.orderId} Received — Hema Sarees` },
      {
        name: "description",
        content: "Your order request has been recorded. We will confirm shipping via WhatsApp.",
      },
    ],
  }),
  component: OrderConfirmationPage,
});

export function OrderConfirmationPage() {
  const { orderId } = Route.useParams();
  const { orders } = useShop();

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Clock className="h-12 w-12 text-gold mb-4" />
        <h1 className="display-md text-ink">Order Reference Not Found</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          We could not locate reference {orderId} in this session.
        </p>
        <Link
          to="/"
          className="eyebrow mt-6 inline-flex items-center gap-2 bg-wine px-6 py-3 text-[0.66rem] text-ivory hover:bg-wine-deep"
        >
          Return Home
        </Link>
      </div>
    );
  }

  // Generate re-open WhatsApp link
  const waText = orderMessage({
    lines: order.lines,
    subtotal: order.subtotal,
    shipping: order.shipping,
    orderId: order.id,
    customer: {
      name: order.customer,
      phone: order.phone,
      address: order.address ?? "",
      city: order.city,
      state: order.state,
      pincode: order.pincode ?? "",
      notes: order.notes,
    },
  });
  const waLink = whatsappUrl(waText);

  return (
    <div className="flex flex-col bg-background py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        {/* Status Banner */}
        <div className="border border-gold/40 bg-paper p-8 text-center sm:p-12 shadow-soft">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ivory border border-gold/60 text-gold">
            <Clock className="h-8 w-8 text-wine" strokeWidth={1.5} />
          </div>

          <p className="eyebrow text-gold mt-6">Order Request Received</p>
          <h1 className="display-md mt-2 text-ink">
            Reference <span className="font-mono">{order.id}</span>
          </h1>

          <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-ivory px-4 py-1.5 text-xs text-ink font-medium">
            <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
            Status: <span className="capitalize">{order.status} Confirmation</span>
          </div>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-ink/80">
            Thank you, <strong className="text-ink">{order.customer}</strong>. Your saree selection
            has been registered in our boutique system. Our curator will verify the parcel weight,
            look up courier charges for your pincode, and confirm your final amount directly on
            WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="whatsapp" size="xl">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-4 w-4" /> Open Order in WhatsApp
              </a>
            </Button>

            <Button asChild variant="line" size="xl">
              <Link to="/collections">
                Continue Browsing <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="mt-10 border border-border bg-paper p-6 sm:p-8">
          <h2 className="eyebrow text-gold mb-4">Order Items Summary</h2>

          <ul className="divide-y divide-border border-y border-border">
            {order.lines.map((line, idx) => (
              <li key={idx} className="flex items-center justify-between py-4 text-sm">
                <div>
                  <p className="font-display text-base text-ink">{line.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">Code: {line.sku}</p>
                  <p className="text-xs text-muted-foreground">Quantity: {line.qty}</p>
                </div>
                <div className="text-right font-medium text-ink">
                  {formatINR(line.price * line.qty)}
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Product Subtotal</dt>
              <dd className="font-medium text-ink">{formatINR(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-muted-foreground">Shipping Charges</dt>
              <dd className="italic text-muted-foreground">
                {order.shipping != null
                  ? formatINR(order.shipping)
                  : "To be confirmed by the seller"}
              </dd>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-medium">
              <dt className="text-ink">Final Amount</dt>
              <dd className="font-display text-xl text-ink">
                {order.shipping != null ? (
                  formatINR(order.total)
                ) : (
                  <>
                    {formatINR(order.subtotal)}{" "}
                    <span className="text-xs font-sans font-normal text-muted-foreground">
                      + shipping
                    </span>
                  </>
                )}
              </dd>
            </div>
          </dl>

          {/* Delivery Details */}
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="eyebrow text-gold mb-3 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> Delivery Information
            </h3>
            <div className="text-xs leading-relaxed text-muted-foreground">
              <p className="font-medium text-ink">{order.customer}</p>
              <p className="flex items-center gap-1.5 mt-0.5">
                <Phone className="h-3 w-3" /> {order.phone}
              </p>
              <p className="mt-1">
                {order.address ? `${order.address}, ` : ""}
                {order.city}
                {order.state ? `, ${order.state}` : ""}
                {order.pincode ? ` – ${order.pincode}` : ""}
              </p>
              {order.notes && <p className="mt-2 italic">Notes: "{order.notes}"</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
