import { Outlet, createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { QuickView } from "@/components/site/QuickView";
import { SearchDialog } from "@/components/site/SearchDialog";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";

export const Route = createFileRoute("/_store")({
  component: StoreLayout,
});

function StoreLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-wine focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <QuickView />
      <SearchDialog />
      <FloatingWhatsApp />
    </div>
  );
}
