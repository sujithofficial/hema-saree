import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, AlertCircle, ShieldAlert } from "lucide-react";

import { SITE } from "@/lib/config";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";

interface PolicyContent {
  slug: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: { heading: string; body: string }[];
}

const POLICIES: Record<string, PolicyContent> = {
  shipping: {
    slug: "shipping",
    title: "Shipping & Delivery Policy",
    subtitle: "Demonstration Policy — Subject to business confirmation before store launch",
    updatedAt: "November 2026",
    sections: [
      {
        heading: "1. Confirmation of Shipping Charges",
        body: "Delivery charges are not fixed in advance. Because saree weights and destination distances vary significantly across India and abroad, exact courier fees (via Blue Dart, DTDC, or Speed Post) will be calculated and confirmed directly by our boutique on WhatsApp based on your destination postal PIN code.",
      },
      {
        heading: "2. Dispatch & Delivery Timelines",
        body: "Estimated dispatch and delivery schedules depend on item readiness (in-stock boutique sarees vs. custom blouse stitching requests). Delivery timelines will be communicated directly by our customer care team when confirming your order on WhatsApp.",
      },
      {
        heading: "3. Packaging & In-Transit Care",
        body: "All sarees are carefully wrapped in moisture-resistant protective layers and sealed in tamper-evident outer packaging to ensure safe delivery to your doorstep.",
      },
      {
        heading: "4. Tracking & Delivery Updates",
        body: "Once your parcel is handed over to the courier partner, an official tracking consignment number and live tracking link will be shared with you over WhatsApp.",
      },
    ],
  },
  returns: {
    slug: "returns",
    title: "Returns & Exchanges Policy",
    subtitle: "Demonstration Policy — Subject to business confirmation before store launch",
    updatedAt: "November 2026",
    sections: [
      {
        heading: "1. Policy Status (Under Business Review)",
        body: "The final return, exchange, and cancellation policy for Hema Sarees is currently under review by boutique management and will be formally published prior to official commercial operations.",
      },
      {
        heading: "2. Handloom Characteristics & Variations",
        body: "Handloom textiles inherently possess subtle slub variations, gentle dye shifts, and irregular motifs that reflect the artisan's manual touch rather than defects. We share daylight videos of individual sarees before dispatch to ensure complete client satisfaction.",
      },
      {
        heading: "3. Damaged or Incorrect Shipments",
        body: "In the unlikely event of transit damage or receipt of an incorrect product, customers are advised to contact our WhatsApp support within 24 hours of delivery with unboxing photographs.",
      },
      {
        heading: "4. Custom Blouse Pieces",
        body: "Blouse pieces that have been cut, tailored, or customized at the customer's request cannot be returned or exchanged.",
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy & Data Handling Notice",
    subtitle: "Demonstration Notice — Sample policy requiring legal review before launch",
    updatedAt: "November 2026",
    sections: [
      {
        heading: "1. Information We Collect",
        body: "When you interact with our website or place an order via WhatsApp, we may collect your name, mobile phone number, delivery address, postal PIN code, and saree preferences to fulfill your requests and provide customer service.",
      },
      {
        heading: "2. How Your Information is Used",
        body: "Your details are used exclusively for order communication, calculating accurate shipping charges, dispatching courier shipments, and answering product queries. We do not sell or rent customer data to third-party marketing brokers.",
      },
      {
        heading: "3. Payment & Financial Data",
        body: "Our website does not store credit card, debit card, or net banking credentials. All payment arrangements are discussed and executed directly via secure official bank transfer or verified UPI applications.",
      },
      {
        heading: "4. Local Browser Storage",
        body: "Our storefront uses standard client-side browser storage (localStorage) solely to remember your shopping bag items, recently viewed sarees, and saved wishlist products across visits.",
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    subtitle: "Demonstration Terms — Subject to formal business and legal review",
    updatedAt: "November 2026",
    sections: [
      {
        heading: "1. Prototype Nature of the Website",
        body: "This website is currently presented as an architectural and visual demonstration prototype for client evaluation. Product listings, stock availability, and indicative prices are sample content intended to illustrate the shopping experience.",
      },
      {
        heading: "2. Order Acceptance & Availability",
        body: "Placing an order request on this website does not constitute a legally binding contract until the boutique explicitly confirms saree availability, applicable delivery charges, and payment receipt via WhatsApp or official channels.",
      },
      {
        heading: "3. Intellectual Property & Imagery",
        body: "All photography, brand marks, and handloom editorial copy featured on this site are protected intellectual assets and may not be reproduced or redistributed without prior written consent.",
      },
      {
        heading: "4. Governing Jurisdiction",
        body: "Official commercial transactions and terms will be subject to applicable Indian commercial laws and the designated jurisdiction of the business's principal place of operation.",
      },
    ],
  },
};

export const Route = createFileRoute("/_store/policies/$policy")({
  loader: ({ params }) => {
    const policy = POLICIES[params.policy];
    if (!policy) {
      throw notFound();
    }
    return { policy };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.policy) return { meta: [{ title: "Policy Not Found" }] };
    return {
      meta: [
        { title: `${loaderData.policy.title} — Hema Sarees` },
        { name: "description", content: loaderData.policy.subtitle },
      ],
    };
  },
  notFoundComponent: PolicyNotFound,
  component: PolicyDetailPage,
});

function PolicyNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="display-md text-ink">Policy Page Not Found</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        The requested policy document does not exist.
      </p>
      <Link
        to="/"
        className="eyebrow mt-6 inline-flex items-center gap-2 bg-wine px-6 py-3 text-[0.66rem] text-ivory hover:bg-wine-deep"
      >
        Return to Home
      </Link>
    </div>
  );
}

export function PolicyDetailPage() {
  const { policy } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-paper py-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 butta-pattern opacity-30"
          aria-hidden
        />
        <div className="mx-auto max-w-4xl px-4 sm:px-8 relative z-10">
          <Link
            to="/"
            className="eyebrow link-underline mb-4 inline-flex items-center gap-1.5 text-[0.62rem] text-muted-foreground hover:text-wine"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Storefront
          </Link>
          <p className="eyebrow text-gold">Demonstration Policy Document</p>
          <h1 className="display-lg mt-2 text-ink">{policy.title}</h1>
          <p className="mt-2 text-xs text-muted-foreground italic">
            Last updated: {policy.updatedAt} • Prototype demo notice
          </p>
        </div>
      </section>

      {/* Main Policy Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        {/* Prominent Demo Notice Callout */}
        <div className="border border-gold/60 bg-paper p-5 sm:p-6 mb-10">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-muted-foreground">
              <strong className="text-ink font-medium">Demonstration Placeholder Notice:</strong>
              <p className="mt-1">
                This policy outline is provided for demonstration and proposal evaluation purposes.
                Actual shipping policies, return conditions, warranty guidelines, and legal terms
                will be confirmed by boutique management prior to official commercial launch.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 divide-y divide-border">
          {policy.sections.map((sec, idx) => (
            <div key={idx} className={idx > 0 ? "pt-8" : ""}>
              <h2 className="font-display text-xl text-ink">{sec.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{sec.body}</p>
            </div>
          ))}
        </div>

        {/* Policy Navigation Footer */}
        <div className="mt-14 border-t border-border pt-8 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap gap-4">
            <Link
              to="/policies/$policy"
              params={{ policy: "shipping" }}
              className="eyebrow link-underline text-[0.62rem] text-muted-foreground hover:text-wine"
            >
              Shipping
            </Link>
            <Link
              to="/policies/$policy"
              params={{ policy: "returns" }}
              className="eyebrow link-underline text-[0.62rem] text-muted-foreground hover:text-wine"
            >
              Returns
            </Link>
            <Link
              to="/policies/$policy"
              params={{ policy: "privacy" }}
              className="eyebrow link-underline text-[0.62rem] text-muted-foreground hover:text-wine"
            >
              Privacy
            </Link>
            <Link
              to="/policies/$policy"
              params={{ policy: "terms" }}
              className="eyebrow link-underline text-[0.62rem] text-muted-foreground hover:text-wine"
            >
              Terms
            </Link>
          </div>

          <a
            href={whatsappUrl(`Namaste ${SITE.name}, I have a question regarding store policies.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-wine hover:underline"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" /> Enquire on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
