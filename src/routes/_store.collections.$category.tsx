import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { CATEGORIES, getCategory, type CategorySlug } from "@/data/catalog";
import { validateCollectionSearch } from "@/lib/collection-search";
import { CollectionCatalog } from "@/components/site/CollectionCatalog";
import { SareeImage } from "@/components/site/SareeImage";

export const Route = createFileRoute("/_store/collections/$category")({
  validateSearch: validateCollectionSearch,
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) {
      throw notFound();
    }
    return { category };
  },
  notFoundComponent: CategoryNotFound,
  component: CategoryDetailPage,
});

function CategoryNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow text-gold">Category not found</p>
      <h1 className="display-md mt-4 text-ink">We couldn't find this weave collection</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Please explore our handwoven archive to see all available categories.
      </p>
      <Link
        to="/collections"
        className="eyebrow mt-8 inline-flex items-center gap-2 bg-wine px-6 py-3.5 text-[0.66rem] text-ivory hover:bg-wine-deep"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to all collections
      </Link>
    </div>
  );
}

export function CategoryDetailPage() {
  const { category } = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <div className="flex flex-col">
      {/* Category Editorial Hero */}
      <section className="relative overflow-hidden border-b border-border bg-paper py-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 butta-pattern opacity-30"
          aria-hidden
        />
        <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] relative z-10">
          <div>
            <Link
              to="/collections"
              className="eyebrow link-underline mb-4 inline-flex items-center gap-1.5 text-[0.62rem] text-muted-foreground hover:text-wine"
            >
              <ArrowLeft className="h-3 w-3" /> All Collections
            </Link>
            <p className="eyebrow text-gold">{category.note}</p>
            <h1 className="display-lg mt-3 text-ink">
              {category.name} <em className="italic text-wine">Sarees</em>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/80 sm:text-base">
              {category.description}
            </p>
          </div>

          <div className="relative mx-auto aspect-[16/9] w-full max-w-md overflow-hidden border border-gold/40 shadow-soft lg:aspect-[4/3] lg:max-w-sm">
            <SareeImage
              image={category.image}
              priority
              sizes="(min-width: 1024px) 30vw, 80vw"
              className="img-zoom"
            />
            <div className="temple-border absolute inset-x-0 bottom-0 bg-gold" aria-hidden />
          </div>
        </div>
      </section>

      {/* Catalogue Filter Engine for this Category */}
      <CollectionCatalog
        initialCategory={category.slug}
        basePath={`/collections/${category.slug}`}
        searchParams={search}
      />
    </div>
  );
}
