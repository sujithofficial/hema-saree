import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { CATEGORIES } from "@/data/catalog";
import { SITE } from "@/lib/config";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";

function Newsletter() {
  const [email, setEmail] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you — you're on the list", {
      description: "Prototype: sign-ups are not stored yet.",
    });
    setEmail("");
  };
  return (
    <section aria-labelledby="newsletter-title" className="border-y border-border bg-paper">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-8 md:grid-cols-[1.1fr_1fr] md:items-end md:py-20">
        <div>
          <p className="eyebrow text-gold">The Hema letter</p>
          <h2 id="newsletter-title" className="display-md mt-4 max-w-xl text-ink">
            First look at new weaves, festive edits and{" "}
            <em className="text-wine">quiet restocks</em>.
          </h2>
        </div>
        <form onSubmit={onSubmit} className="w-full" noValidate>
          <label
            htmlFor="newsletter-email"
            className="eyebrow text-[0.62rem] text-muted-foreground"
          >
            Email address
          </label>
          <div className="mt-3 flex border-b border-ink">
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-w-0 flex-1 bg-transparent py-3 font-display text-xl text-ink outline-none placeholder:text-muted-foreground/60"
            />
            <Button type="submit" variant="link" className="eyebrow px-0 text-[0.66rem] text-wine">
              Subscribe →
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            One thoughtful email a month. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-24">
      <Newsletter />
      <div className="bg-wine-deep text-ivory/85">
        <div className="temple-border bg-gold/70" aria-hidden />
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo light />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/70">
              Hema — from the Sanskrit for gold. Handwoven silks, Banarasi brocades and everyday
              handlooms, chosen with care.
            </p>
            <a
              href={whatsappUrl(`Namaste ${SITE.name}, I have a question.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border border-ivory/30 px-4 py-2.5 text-sm text-ivory transition hover:border-gold-soft hover:text-gold-soft"
            >
              <WhatsAppIcon className="h-4 w-4" /> {SITE.whatsappDisplay}
            </a>
          </div>
          <nav aria-label="Shop" className="md:col-span-2">
            <p className="eyebrow text-gold-soft">Shop</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/collections/$category"
                    params={{ category: c.slug }}
                    className="link-underline hover:text-ivory"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Explore" className="md:col-span-2">
            <p className="eyebrow text-gold-soft">Explore</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <Link to="/new-arrivals" className="link-underline hover:text-ivory">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/bestsellers" className="link-underline hover:text-ivory">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/wedding-edit" className="link-underline hover:text-ivory">
                  Wedding Edit
                </Link>
              </li>
              <li>
                <Link to="/about" className="link-underline hover:text-ivory">
                  About
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="link-underline hover:text-ivory">
                  Wishlist
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Help" className="md:col-span-2">
            <p className="eyebrow text-gold-soft">Help</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/policies/$policy"
                  params={{ policy: "shipping" }}
                  className="link-underline hover:text-ivory"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/$policy"
                  params={{ policy: "returns" }}
                  className="link-underline hover:text-ivory"
                >
                  Returns & exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/$policy"
                  params={{ policy: "privacy" }}
                  className="link-underline hover:text-ivory"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/$policy"
                  params={{ policy: "terms" }}
                  className="link-underline hover:text-ivory"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className="eyebrow text-gold-soft">Contact</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <a href={`mailto:${SITE.email}`} className="link-underline hover:text-ivory">
                  {SITE.email}
                </a>
              </li>
              <li className="text-ivory/60">Mon – Sat, 10am – 7pm IST</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ivory/10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-6 text-[0.72rem] text-ivory/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>
              © {new Date().getFullYear()} {SITE.name}. Prices in INR.
            </p>
            <p>
              Design prototype — products, prices, stock, reviews and contact details are sample
              content.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
