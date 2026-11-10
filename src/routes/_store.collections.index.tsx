import { createFileRoute } from "@tanstack/react-router";

import { validateCollectionSearch } from "@/lib/collection-search";
import { CollectionCatalog } from "@/components/site/CollectionCatalog";

export const Route = createFileRoute("/_store/collections/")({
  validateSearch: validateCollectionSearch,
  component: CollectionsPage,
});

export function CollectionsPage() {
  const search = Route.useSearch();

  return (
    <div className="flex flex-col">
      {/* Editorial Header */}
      <section className="relative overflow-hidden border-b border-border bg-paper py-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 butta-pattern opacity-30"
          aria-hidden
        />
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 relative z-10">
          <p className="eyebrow text-gold">The Handloom Archive</p>
          <h1 className="display-lg mt-3 text-ink">
            All Handwoven <em className="italic text-wine">Collections</em>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/80 sm:text-base">
            From regal mulberry silks and heavy Banarasi brocades to featherlight handloom cottons
            and linens — explore sarees handpicked for weddings, festivities and timeless daily
            elegance.
          </p>
        </div>
      </section>

      {/* Catalogue Component with filters, search, sorting */}
      <CollectionCatalog basePath="/collections" searchParams={search} />
    </div>
  );
}
