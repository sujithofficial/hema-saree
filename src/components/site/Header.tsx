import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { CATEGORIES, LOOKBOOK } from "@/data/catalog";
import { SITE } from "@/lib/config";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { SareeImage } from "./SareeImage";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { whatsappUrl } from "@/lib/whatsapp";

const MESSAGES = [
  "Order or enquire personally on WhatsApp — we reply with fabric videos",
  "Delivery charges confirmed directly based on destination pincode",
  "The Wedding & Festive Edit is now in the boutique",
];

function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % MESSAGES.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-wine-deep text-ivory">
      <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-center px-4">
        <p
          key={i}
          className="animate-fade truncate text-center text-[0.7rem] tracking-[0.14em]"
          aria-live="polite"
        >
          {MESSAGES[i]}
        </p>
      </div>
    </div>
  );
}

const NAV = [
  { to: "/", label: "Home" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/bestsellers", label: "Bestsellers" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const { totals, wishlist, setCartOpen, setSearchOpen, hydrated } = useShop();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverCat, setHoverCat] = useState(CATEGORIES[0]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = "eyebrow link-underline py-1 text-[0.66rem] text-ink hover:text-wine";

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-ivory/95 backdrop-blur-sm transition-shadow duration-500",
          scrolled ? "border-border shadow-[0_1px_0_0_var(--border)]" : "border-transparent",
        )}
      >
        <div className="mx-auto grid h-[72px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8 lg:h-[84px]">
          {/* left: nav */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-ink lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.3} />
            </button>
            <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
              <Link to="/" className={linkCls} activeOptions={{ exact: true }}>
                Home
              </Link>
              <div className="group relative">
                <Link to="/collections" className={linkCls} aria-haspopup="true">
                  Collections
                </Link>
                {/* mega menu */}
                <div className="invisible absolute left-[-1rem] top-full z-50 pt-6 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="grid w-[720px] grid-cols-[1fr_260px] gap-8 border border-border bg-ivory p-8 shadow-soft">
                    <div>
                      <p className="eyebrow text-gold">Shop by weave</p>
                      <ul className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3">
                        {CATEGORIES.map((c) => (
                          <li key={c.slug}>
                            <Link
                              to="/collections/$category"
                              params={{ category: c.slug }}
                              onMouseEnter={() => setHoverCat(c)}
                              onFocus={() => setHoverCat(c)}
                              className="group/item block"
                            >
                              <span className="font-display text-2xl text-ink transition-colors group-hover/item:text-wine group-hover/item:italic">
                                {c.name}
                              </span>
                              <span className="block text-xs text-muted-foreground">{c.note}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-7 flex gap-6 border-t border-border pt-5">
                        <Link
                          to="/collections"
                          className="eyebrow link-underline text-[0.62rem] text-wine"
                        >
                          View all sarees
                        </Link>
                        <Link
                          to="/wedding-edit"
                          className="eyebrow link-underline text-[0.62rem] text-wine"
                        >
                          The Wedding Edit
                        </Link>
                      </div>
                    </div>
                    <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                      <SareeImage
                        key={hoverCat.slug}
                        image={hoverCat.image}
                        sizes="260px"
                        className="animate-fade"
                      />
                      <span className="eyebrow absolute bottom-3 left-3 bg-ivory/90 px-2 py-1 text-[0.58rem] text-wine">
                        {hoverCat.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {NAV.slice(1).map((n) => (
                <Link key={n.to} to={n.to} className={linkCls}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <Logo />

          {/* right: actions */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search sarees"
              className="grid h-10 w-10 place-items-center text-ink transition-colors hover:text-wine"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.3} />
            </button>
            <Link
              to="/wishlist"
              aria-label={`Wishlist${hydrated && wishlist.length ? `, ${wishlist.length} saved` : ""}`}
              className="relative hidden h-10 w-10 place-items-center text-ink transition-colors hover:text-wine sm:grid"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.3} />
              {hydrated && wishlist.length > 0 && (
                <span className="absolute right-1 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.58rem] font-medium text-wine-deep">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping bag, ${totals.itemCount} items`}
              className="relative grid h-10 w-10 place-items-center text-ink transition-colors hover:text-wine"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.3} />
              {hydrated && totals.itemCount > 0 && (
                <span className="absolute right-1 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-wine px-1 text-[0.58rem] font-medium text-ivory">
                  {totals.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[88vw] max-w-sm overflow-y-auto border-r-0 bg-ivory p-0"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
          <div className="border-b border-border px-6 py-6">
            <Logo />
          </div>
          <nav aria-label="Mobile" className="px-6 py-6" onClick={() => setMobileOpen(false)}>
            <ul className="space-y-4">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="font-display text-3xl text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/wishlist" className="font-display text-3xl text-ink">
                  Wishlist
                </Link>
              </li>
            </ul>
            <p className="eyebrow mt-10 text-gold">Collections</p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/collections/$category"
                    params={{ category: c.slug }}
                    className="block border border-border px-3 py-3 text-sm text-ink"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li className="col-span-2">
                <Link
                  to="/collections"
                  className="block bg-wine px-3 py-3 text-center text-sm text-ivory"
                >
                  All sarees
                </Link>
              </li>
            </ul>
          </nav>
          <div className="relative mx-6 mb-6 aspect-[16/10] overflow-hidden">
            <SareeImage image={LOOKBOOK.wedding} sizes="88vw" width={1600} height={1000} />
            <Link
              to="/wedding-edit"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 flex items-end bg-gradient-to-t from-wine-deep/80 to-transparent p-4"
            >
              <span className="font-display text-xl text-ivory">The Wedding Edit →</span>
            </Link>
          </div>
          <a
            href={whatsappUrl(`Namaste ${SITE.name}, I'd like some help choosing a saree.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-6 mb-8 flex items-center justify-center gap-2 bg-whatsapp py-3 text-sm text-whatsapp-foreground"
          >
            <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </SheetContent>
      </Sheet>
    </>
  );
}
