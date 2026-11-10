import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES } from "@/data/catalog";
import { filterProducts } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { useShop } from "@/store/shop";
import { SareeImage } from "./SareeImage";

const SUGGESTIONS = ["Kanchipuram", "wedding", "linen", "red", "cotton", "festive"];

export function SearchDialog() {
  const { searchOpen, setSearchOpen, products } = useShop();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchOpen) setQ("");
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = useMemo(
    () => (q.trim() ? filterProducts(products, { q }).slice(0, 6) : []),
    [q, products],
  );

  const submit = (e?: FormEvent | { preventDefault: () => void }) => {
    e?.preventDefault();
    setSearchOpen(false);
    navigate({ to: "/collections", search: { q: q.trim() || undefined } });
  };

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="top-0 max-w-none translate-y-0 gap-0 rounded-none border-0 border-b border-border bg-ivory p-0 data-[state=open]:slide-in-from-top-4 sm:rounded-none">
        <DialogTitle className="sr-only">Search sarees</DialogTitle>
        <DialogDescription className="sr-only">
          Type to search by name, fabric, colour or occasion
        </DialogDescription>
        <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:py-12">
          <form onSubmit={submit} className="flex items-center gap-4 border-b border-ink pb-3">
            <Search className="h-5 w-5 text-gold" strokeWidth={1.3} />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Kanchipuram, linen, red, wedding…"
              aria-label="Search"
              className="min-w-0 flex-1 bg-transparent font-display text-2xl text-ink outline-none placeholder:text-muted-foreground/50 sm:text-4xl"
            />
          </form>

          {!q.trim() ? (
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-gold">Popular searches</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQ(s)}
                      className="border border-border px-3 py-1.5 text-sm text-ink transition hover:border-wine hover:text-wine"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow text-gold">Browse by weave</p>
                <ul className="mt-4 grid grid-cols-2 gap-y-2">
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to="/collections/$category"
                        params={{ category: c.slug }}
                        onClick={() => setSearchOpen(false)}
                        className="font-display text-lg text-ink hover:text-wine hover:italic"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="mt-10 text-center text-muted-foreground">
              No sarees match “{q}”. Try a fabric, colour or occasion.
            </p>
          ) : (
            <>
              <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/sarees/$slug"
                      params={{ slug: p.slug }}
                      onClick={() => setSearchOpen(false)}
                      className="group flex gap-3"
                    >
                      <span className="h-20 w-16 shrink-0 overflow-hidden bg-paper">
                        <SareeImage image={p.images[0]} sizes="64px" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-lg leading-tight text-ink group-hover:text-wine">
                          {p.name}
                        </span>
                        <span className="line-clamp-2 text-xs text-muted-foreground">
                          {p.subtitle}
                        </span>
                        <span className="mt-1 block text-xs text-ink">{formatINR(p.price)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={submit}
                className="eyebrow link-underline mt-8 text-[0.62rem] text-wine"
              >
                See all results for “{q}” →
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
