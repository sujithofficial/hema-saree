import { Link, createFileRoute } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useShop } from "@/store/shop";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_store/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Hema Sarees" },
      {
        name: "description",
        content: "View your saved handloom sarees and enquire directly on WhatsApp.",
      },
    ],
  }),
  component: WishlistPage,
});

export function WishlistPage() {
  const { wishlist, getProduct, toggleWishlist, addToCart } = useShop();

  const wishlistedProducts = wishlist
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const handleAddAllToCart = () => {
    let count = 0;
    wishlistedProducts.forEach((p) => {
      if (p.stock > 0) {
        addToCart(p.id, 1, { open: false });
        count++;
      }
    });
    if (count > 0) {
      toast.success(`Added ${count} available ${count === 1 ? "saree" : "sarees"} to your bag`);
    } else {
      toast.error("None of your saved sarees are currently in stock");
    }
  };

  const handleClearAll = () => {
    wishlist.forEach((id) => toggleWishlist(id));
    toast("Wishlist cleared");
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-paper py-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 butta-pattern opacity-30"
          aria-hidden
        />
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 relative z-10">
          <p className="eyebrow text-gold">Personal Curation</p>
          <h1 className="display-lg mt-3 text-ink">
            Your Saved <em className="italic text-wine">Sarees</em>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/80 sm:text-base">
            Heirloom weaves you have set aside. Items remain saved in your browser so you can
            revisit or enquire via WhatsApp whenever you are ready.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8">
        {wishlistedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-border bg-paper px-6 py-20 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-ivory text-gold">
              <Heart className="h-6 w-6 text-wine" strokeWidth={1.3} />
            </div>
            <h2 className="font-display text-2xl text-ink mt-6">Your wishlist is empty</h2>
            <p className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
              As you explore our collections, tap the heart icon on any saree to save it here for
              quick reference.
            </p>
            <Link
              to="/collections"
              className="eyebrow mt-8 inline-flex items-center justify-center bg-wine px-6 py-3.5 text-[0.66rem] text-ivory hover:bg-wine-deep"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Action Bar */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <p className="text-sm text-muted-foreground">
                Showing <strong className="text-ink">{wishlistedProducts.length}</strong> saved{" "}
                {wishlistedProducts.length === 1 ? "saree" : "sarees"}
              </p>
              <div className="flex items-center gap-4">
                <Button
                  variant="line"
                  size="default"
                  onClick={handleAddAllToCart}
                  className="flex items-center gap-2 text-xs"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Move all to bag
                </Button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="eyebrow link-underline flex items-center gap-1.5 text-[0.62rem] text-muted-foreground hover:text-wine"
                >
                  <Trash2 className="h-3 w-3" /> Clear all
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
