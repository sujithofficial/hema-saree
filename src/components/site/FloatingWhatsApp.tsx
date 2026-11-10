import { useLocation } from "@tanstack/react-router";
import { SITE } from "@/lib/config";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsApp() {
  const { pathname } = useLocation();
  // Product pages have their own sticky WhatsApp CTA
  if (pathname.startsWith("/sarees/") || pathname.startsWith("/checkout")) return null;
  return (
    <a
      href={whatsappUrl(`Namaste ${SITE.name}, I'd like help choosing a saree.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-whatsapp py-3 pl-3.5 pr-3.5 text-whatsapp-foreground shadow-lift transition-all hover:pr-5"
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm transition-all duration-500 group-hover:max-w-40">
        Chat with us
      </span>
    </a>
  );
}
