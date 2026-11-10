import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Video, Truck, Award } from "lucide-react";

import { CATEGORIES, LOOKBOOK, PRODUCTS } from "@/data/catalog";
import { SITE } from "@/lib/config";
import { formatINR } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { ProductCard } from "@/components/site/ProductCard";
import { SareeImage } from "@/components/site/SareeImage";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";

export const Route = createFileRoute("/_store/")({
  component: HomePage,
});

export function HomePage() {
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);
  const weddingPieces = PRODUCTS.filter((p) => p.isWedding).slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border bg-paper pb-16 pt-8 sm:pb-24 sm:pt-14 lg:pb-32 lg:pt-20">
        <div
          className="pointer-events-none absolute inset-0 butta-pattern opacity-40"
          aria-hidden
        />
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="relative z-10 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ivory/80 px-3.5 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-gold" />
              <span className="eyebrow text-[0.62rem] text-wine">
                Autumn & Festive 2026 Collection
              </span>
            </div>

            <h1 className="display-xl mt-6 text-ink">
              Pure silk, <br />
              <span className="italic text-wine">handwoven</span> for <br />
              generations.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg">
              Authentic Kanchipuram korvai weaves, Banarasi tissue jaals, and breathable everyday
              handlooms. Handpicked directly from master weavers across India and delivered with
              care.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
              <Link
                to="/collections"
                className="eyebrow inline-flex items-center justify-center gap-3 bg-wine px-7 py-4 text-[0.68rem] text-ivory shadow-lift transition-all hover:bg-wine-deep"
              >
                Explore Collections <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href={whatsappUrl(
                  `Namaste ${SITE.name}, I am visiting your boutique website and would like help selecting a saree.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow inline-flex items-center justify-center gap-2 border border-ink/40 bg-ivory/90 px-6 py-4 text-[0.68rem] text-ink backdrop-blur-sm transition-all hover:border-wine hover:bg-wine hover:text-ivory"
              >
                <WhatsAppIcon className="h-4 w-4" /> Personal Enquiry
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-border/80 pt-6 text-xs text-muted-foreground">
              <div>
                <span className="font-display text-xl text-ink">100%</span>
                <p className="mt-0.5 text-[0.72rem]">Mulberry Silk & Tested Zari</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <span className="font-display text-xl text-ink">Direct</span>
                <p className="mt-0.5 text-[0.72rem]">From Artisan Looms</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <span className="font-display text-xl text-ink">Video</span>
                <p className="mt-0.5 text-[0.72rem]">Drape previews on WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="relative z-10 lg:pl-6">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden border border-gold/40 bg-ivory shadow-soft sm:max-w-lg lg:max-w-none">
              <SareeImage
                image={LOOKBOOK.hero}
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="img-zoom"
              />
              <div className="temple-border absolute inset-x-0 bottom-0 bg-gold" aria-hidden />
              <div className="absolute bottom-5 left-5 right-5 border border-ivory/30 bg-wine-deep/85 p-4 text-ivory backdrop-blur-md">
                <p className="eyebrow text-gold-soft">Featured Bridal Weave</p>
                <p className="mt-1 font-display text-xl">The Aranmanai Wine Kanchipuram</p>
                <p className="mt-0.5 text-xs text-ivory/70">
                  Gopuram korvai border with antique gold zari • ₹24,500
                </p>
                <Link
                  to="/sarees/$slug"
                  params={{ slug: "aranmanai-wine-kanchipuram-silk" }}
                  className="eyebrow link-underline mt-2 inline-block text-[0.62rem] text-gold-soft"
                >
                  View saree details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST PILLARS */}
      <section className="border-b border-border bg-ivory py-10 sm:py-12">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 bg-paper">
                <Award className="h-5 w-5 text-wine" strokeWidth={1.4} />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink">Pure Silk & Tested Zari</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Genuine mulberry silks and pure zari threads woven according to timeless handloom
                  standards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 bg-paper">
                <Video className="h-5 w-5 text-wine" strokeWidth={1.4} />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink">Fabric Videos on WhatsApp</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Unsure of the drape or colour? Message us for daylight videos and close-up pallu
                  details.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 bg-paper">
                <Truck className="h-5 w-5 text-wine" strokeWidth={1.4} />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink">Insured Domestic Delivery</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Insured courier delivery across India, with exact charges confirmed directly based
                  on your pincode.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 bg-paper">
                <ShieldCheck className="h-5 w-5 text-wine" strokeWidth={1.4} />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink">Artisan Authenticity</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Each saree is single-origin, hand-finished and delivered with matching running
                  blouse piece.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED WEAVES (CATEGORIES) */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <SectionHeading
            index="01"
            eyebrow="Shop by Weave"
            title={
              <>
                Treasures of the <em className="italic text-wine">Indian loom</em>.
              </>
            }
            aside={
              <Link
                to="/collections"
                className="eyebrow link-underline text-[0.66rem] text-wine hover:text-wine-deep"
              >
                Browse all collections →
              </Link>
            }
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.slug}
                to="/collections/$category"
                params={{ category: cat.slug }}
                className="group relative flex flex-col overflow-hidden border border-border bg-paper transition-shadow duration-500 hover:shadow-soft"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
                  <SareeImage
                    image={cat.image}
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="img-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 text-ivory">
                    <span className="eyebrow text-[0.58rem] text-gold-soft">{cat.note}</span>
                    <h3 className="font-display text-2xl font-normal transition-transform duration-300 group-hover:-translate-y-0.5">
                      {cat.name}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-4 bg-paper">
                  <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                  <span className="eyebrow link-underline mt-4 inline-flex items-center gap-1.5 text-[0.62rem] text-wine">
                    View sarees →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED BESTSELLERS */}
      <section className="border-t border-border bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <SectionHeading
            index="02"
            eyebrow="Curated Pieces"
            title={
              <>
                Beloved weaves & <em className="italic text-wine">timeless classics</em>.
              </>
            }
            aside={
              <Link
                to="/bestsellers"
                className="eyebrow link-underline text-[0.66rem] text-wine hover:text-wine-deep"
              >
                View all bestsellers →
              </Link>
            }
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. HERITAGE & THE CRAFT (STORYTELLING) */}
      <section className="relative overflow-hidden border-t border-border bg-wine-deep py-20 text-ivory sm:py-28">
        <div className="temple-border absolute inset-x-0 top-0 bg-gold" aria-hidden />
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-gold/40 shadow-soft">
              <SareeImage
                image={LOOKBOOK.craft}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="img-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 border-t border-ivory/20 pt-3 text-xs text-ivory/80">
                Loom in Kanchipuram • Three-shuttle Korvai weaving technique
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            <p className="eyebrow flex items-center gap-3 text-gold-soft">
              <span className="h-px w-8 bg-gold-soft/60" />
              The Artisan's Discipline
            </p>
            <h2 className="display-lg mt-4 text-balance text-ivory">
              Where time slows to the rhythm of{" "}
              <em className="italic text-gold-soft">the shuttle</em>.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ivory/80 sm:text-base">
              <p>
                In Kanchipuram, true Korvai borders require two weavers working in tandem on a
                single pit loom — one throwing the shuttle across the body, while the other catches
                the border warp, locking the contrast borders together with a serrated temple join.
              </p>
              <p>
                A single wedding saree can take three to four weeks of unbroken attention. We work
                directly with weaver families, ensuring fair compensation and preserving techniques
                that machine looms can never replicate.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                to="/about"
                className="eyebrow inline-flex items-center justify-center gap-2 border border-gold-soft px-6 py-3.5 text-[0.66rem] text-gold-soft transition hover:bg-gold hover:text-wine-deep"
              >
                Read our full story →
              </Link>
              <a
                href={whatsappUrl(
                  `Namaste ${SITE.name}, I'd like to learn more about how your sarees are handwoven.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow link-underline inline-flex items-center gap-2 text-[0.66rem] text-ivory/80 hover:text-ivory"
              >
                <WhatsAppIcon className="h-4 w-4" /> Ask our curator on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WEDDING & CELEBRATION EDIT */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <SectionHeading
            index="03"
            eyebrow="Ceremony & Celebration"
            title={
              <>
                The Wedding & Festive <em className="italic text-wine">Edit</em>.
              </>
            }
            aside={
              <Link
                to="/wedding-edit"
                className="eyebrow link-underline text-[0.66rem] text-wine hover:text-wine-deep"
              >
                Explore wedding collection →
              </Link>
            }
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {weddingPieces.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>

          {/* Wedding Lookbook Banner */}
          <div className="relative mt-16 overflow-hidden border border-border bg-wine-deep text-ivory">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <SareeImage
                  image={LOOKBOOK.wedding}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="img-zoom"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <span className="eyebrow text-gold-soft">Bespoke Bridal Trousseau</span>
                <h3 className="display-md mt-3 text-ivory">
                  Heirloom sarees for your most sacred moments.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/80">
                  Whether you are planning muhurtham silks, evening reception brocades or
                  coordinated family drapes, our team offers personal bridal video calls to guide
                  your choice.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/wedding-edit"
                    className="eyebrow inline-flex items-center justify-center bg-gold px-6 py-3.5 text-[0.66rem] text-wine-deep transition hover:bg-gold-soft"
                  >
                    View Wedding Sarees
                  </Link>
                  <a
                    href={whatsappUrl(
                      `Namaste ${SITE.name}, I would like to book a WhatsApp bridal consultation.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="eyebrow inline-flex items-center justify-center gap-2 border border-ivory/40 px-6 py-3.5 text-[0.66rem] text-ivory transition hover:border-gold-soft hover:text-gold-soft"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Book WhatsApp Consultation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PATRON VOICES / DEMONSTRATION REVIEWS */}
      <section className="border-t border-border bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="text-center">
            <p className="eyebrow text-gold">Patron Experiences</p>
            <h2 className="display-md mt-3 text-ink">Words from our collectors</h2>
            <p className="mx-auto mt-2 max-w-lg text-xs text-muted-foreground">
              Demonstration testimonials reflecting real customer service and WhatsApp interactions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="border border-border bg-ivory p-8 shadow-sm">
              <div className="flex text-gold">★★★★★</div>
              <p className="mt-4 font-display text-lg text-ink">
                "The drape of the Aranmanai Kanchipuram is magnificent. The daylight video sent on
                WhatsApp helped me decide instantly."
              </p>
              <div className="mt-6 border-t border-border/80 pt-4 text-xs">
                <p className="font-medium text-ink">S. Ramanathan</p>
                <p className="text-muted-foreground">Chennai • Wedding Muhurtham</p>
              </div>
            </div>

            <div className="border border-border bg-ivory p-8 shadow-sm">
              <div className="flex text-gold">★★★★★</div>
              <p className="mt-4 font-display text-lg text-ink">
                "Pure antique gold Banarasi tissue that feels regal yet stays comfortable throughout
                a long celebratory evening."
              </p>
              <div className="mt-6 border-t border-border/80 pt-4 text-xs">
                <p className="font-medium text-ink">P. Mehta</p>
                <p className="text-muted-foreground">Mumbai • Reception Saree</p>
              </div>
            </div>

            <div className="border border-border bg-ivory p-8 shadow-sm">
              <div className="flex text-gold">★★★★★</div>
              <p className="mt-4 font-display text-lg text-ink">
                "The handloom cottons are so breathable. They soften with every wash. Beautiful
                packaging and prompt WhatsApp replies."
              </p>
              <div className="mt-6 border-t border-border/80 pt-4 text-xs">
                <p className="font-medium text-ink">A. Nair</p>
                <p className="text-muted-foreground">Bengaluru • Daily Handloom</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
