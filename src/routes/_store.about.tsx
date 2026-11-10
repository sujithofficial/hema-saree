import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Heart, Compass, ShieldCheck } from "lucide-react";

import { LOOKBOOK } from "@/data/catalog";
import { SITE } from "@/lib/config";
import { whatsappUrl } from "@/lib/whatsapp";
import { SareeImage } from "@/components/site/SareeImage";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";

export const Route = createFileRoute("/_store/about")({
  head: () => ({
    meta: [
      { title: "About Us & Craft Heritage | Hema Sarees" },
      {
        name: "description",
        content:
          "Discover the boutique philosophy behind Hema Sarees. Celebrating the timeless artistry of Indian handlooms.",
      },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Editorial Header */}
      <section className="relative overflow-hidden border-b border-border bg-paper py-16 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 butta-pattern opacity-30"
          aria-hidden
        />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-8 relative z-10">
          <Link
            to="/"
            className="eyebrow link-underline mb-4 inline-flex items-center gap-1.5 text-[0.62rem] text-muted-foreground hover:text-wine"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Storefront
          </Link>
          <p className="eyebrow text-gold">The Boutique Philosophy</p>
          <h1 className="display-lg mt-3 text-ink">
            Honouring the Artistry of the <em className="italic text-wine">Indian Loom</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/80">
            Hema Sarees is envisioned as a tribute to handwoven Indian textiles — from the
            temple-bordered silks of the South to the intricate brocades of the North.
          </p>
        </div>
      </section>

      {/* Brand Narrative & Replaceable Placeholder Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden border border-gold/40 shadow-soft">
                <SareeImage
                  image={LOOKBOOK.craft}
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="img-zoom"
                />
                <div className="temple-border absolute inset-x-0 bottom-0 bg-gold" aria-hidden />
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <span className="eyebrow text-gold">Our Vision</span>
              <h2 className="display-md text-ink">
                A conscious curation of <em className="italic text-wine">heritage drapes</em>.
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-ink/80 sm:text-base">
                <p>
                  Every saree in our boutique is chosen for its authenticity of weave, balanced
                  weight, and timeless aesthetic. We believe that handloom sarees are not disposable
                  fashion; they are heirlooms meant to be cherished across generations.
                </p>
                <p>
                  Our WhatsApp-first approach enables personal connection: we answer questions
                  individually, share daylight fabric videos, and ensure each client chooses a piece
                  that truly resonates with their personal style and occasion.
                </p>
              </div>

              {/* Explicit Demo Placeholder Note for Client Customization */}
              <div className="mt-4 border border-dashed border-gold/60 bg-paper p-5 text-xs text-muted-foreground leading-relaxed">
                <div className="flex items-center gap-2 font-medium text-ink mb-1">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span>Demonstration Profile Placeholder</span>
                </div>
                <p>
                  <em>
                    Note for client review: This section is ready to feature the boutique founder's
                    personal profile, founding journey, verified weaver cluster relationships, and
                    physical studio location upon launch.
                  </em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craft Pillars */}
      <section className="border-t border-border bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow text-gold">Guiding Principles</p>
            <h2 className="display-md mt-2 text-ink">What Guides Our Selection</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="border border-border bg-ivory p-8 shadow-sm">
              <Compass className="h-7 w-7 text-wine mb-4" strokeWidth={1.3} />
              <h3 className="font-display text-xl text-ink">Weave Authenticity</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Celebrating traditional methods like Korvai interlocking and Kadhwa brocading that
                honour the master weaver's patience.
              </p>
            </div>

            <div className="border border-border bg-ivory p-8 shadow-sm">
              <Heart className="h-7 w-7 text-wine mb-4" strokeWidth={1.3} />
              <h3 className="font-display text-xl text-ink">Personal Curation</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Direct WhatsApp interaction allows customers to view fabric movement and discuss
                blouse pairing before deciding.
              </p>
            </div>

            <div className="border border-border bg-ivory p-8 shadow-sm">
              <ShieldCheck className="h-7 w-7 text-wine mb-4" strokeWidth={1.3} />
              <h3 className="font-display text-xl text-ink">Drape Longevity</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Sarees with balanced borders, breathable weaves, and unstitched blouse pieces
                intended for celebration and family memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Enquiry Section */}
      <section className="py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-xl px-4 sm:px-8">
          <p className="eyebrow text-gold">Get in Touch</p>
          <h2 className="display-md mt-2 text-ink">Have questions about a weave?</h2>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Whether you seek advice on saree care or need assistance choosing an occasion drape, we
            are happy to connect on WhatsApp.
          </p>
          <div className="mt-8">
            <a
              href={whatsappUrl(
                `Namaste ${SITE.name}, I would like to learn more about your boutique.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow inline-flex items-center gap-2.5 bg-wine px-6 py-3.5 text-[0.66rem] text-ivory hover:bg-wine-deep transition"
            >
              <WhatsAppIcon className="h-4 w-4" /> Chat with our curator on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
